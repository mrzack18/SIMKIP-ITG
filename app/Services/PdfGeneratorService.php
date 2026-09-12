<?php

namespace App\Services;

use App\Models\BebasTanggungan;
use App\Models\Konfigurasi;
use App\Models\Laporan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class PdfGeneratorService
{
    /**
     * Generate PDF Surat Keterangan Penyelesaian Studi (Bebas Tanggungan)
     * Sesuai desain FormalSurat di BebasTanggunganDetail.tsx
     */
    public static function suratBebasTanggungan(int $bebasTanggunganId): Response
    {
        $bt = BebasTanggungan::with([
            'mahasiswa.prodi',
            'mahasiswa.ipkSemestrs',
            'mahasiswa.dokumens.jenis',
            'reviewedBy',
        ])->findOrFail($bebasTanggunganId);

        $m         = $bt->mahasiswa;
        $ipkList   = $m->ipkSemestrs->sortBy('semester')->values();
        $rataIPK   = $ipkList->count() > 0 ? number_format($ipkList->avg('ipk'), 2) : '0.00';

        // Dokumen yang disetujui
        $dokumens = $m->dokumens
            ->where('status', 'Disetujui')
            ->unique('dokumen_jenis_id')
            ->map(fn($d) => [
                'nama'    => $d->jenis->nama,
                'tanggal' => $d->approved_at?->format('d M Y') ?? $d->created_at->format('d M Y'),
            ])
            ->values()
            ->toArray();

        // Nama & NIP penandatangan dari konfigurasi
        $pengelolaNama = Konfigurasi::get('pengelola_nama', 'Encep Jianul Hayat, S.T., M.T.');
        $pengelolaNip  = Konfigurasi::get('pengelola_nip', '197804202006041001');
        $warekNama     = Konfigurasi::get('warek_nama', 'Dr. Rina Kurniawati, S.E., M.Si.');
        $warekNip      = Konfigurasi::get('warek_nip', '198203152008012002');

        // Path logo untuk inline (base64)
        $logoPath = self::getLogoBase64();

        $data = [
            'mahasiswa'    => [
                'nama'     => $m->nama,
                'nim'      => $m->nim,
                'prodi'    => $m->prodi?->nama ?? '-',
                'angkatan' => $m->angkatan,
                'semester' => $m->ipkSemestrs->count(),
            ],
            'nomor_surat'   => $bt->nomor_surat ?? 'SKPS/KIP-K/ITG/-/-/-',
            'tanggal_terbit'=> $bt->tanggal_terbit?->format('d F Y') ?? now()->format('d F Y'),
            'rata_ipk'      => $rataIPK,
            'dokumens'      => $dokumens,
            'pengelola_nama'=> $pengelolaNama,
            'pengelola_nip' => $pengelolaNip,
            'warek_nama'    => $warekNama,
            'warek_nip'     => $warekNip,
            'logoPath'      => $logoPath,
        ];

        $pdf = Pdf::loadView('pdf.surat_bebas_tanggungan', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'dpi'                        => 150,
                'defaultFont'                => 'Times New Roman',
                'isRemoteEnabled'            => false,
                'isHtml5ParserEnabled'       => true,
            ]);

        $filename = "SKPS_KIP-K_{$m->nim}_{$m->nama}.pdf";
        return $pdf->download($filename);
    }

    /**
     * Generate PDF Laporan untuk Admin
     */
    public static function laporanKipK(int $laporanId): Response
    {
        $laporan = Laporan::with(['dibuatOleh', 'reviews.warek'])->findOrFail($laporanId);

        $logoPath = self::getLogoBase64();

        $data = [
            'laporan'    => $laporan,
            'logoPath'   => $logoPath,
            'dicetak_at' => now()->format('d F Y H:i'),
        ];

        $pdf = Pdf::loadView('pdf.laporan', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'dpi'                  => 150,
                'defaultFont'          => 'Times New Roman',
                'isHtml5ParserEnabled' => true,
            ]);

        $safeNomor = str_replace(['/', '\\'], '-', $laporan->nomor_surat);
        $filename = "Laporan_KIP-K_{$safeNomor}.pdf";
        return $pdf->download($filename);
    }

    /**
     * Generate PDF tabel laporan (prestasi / organisasi / pelatihan).
     *
     * @param  string  $judul      Judul laporan, tampil sebagai heading.
     * @param  array   $filters    Ringkasan filter aktif, format ['Label' => 'nilai'].
     * @param  array   $headers    Header kolom tabel.
     * @param  array   $rows       Baris tabel, tiap baris array skalar sepanjang $headers.
     */
    public static function reportingTable(string $judul, array $filters, array $headers, array $rows): Response
    {
        $data = [
            'judul'      => $judul,
            'filters'    => $filters,
            'headers'    => $headers,
            'rows'       => $rows,
            'logoPath'   => self::getLogoBase64(),
            'dicetak_at' => now()->format('d F Y H:i'),
        ];

        $pdf = Pdf::loadView('pdf.reporting', $data)
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'dpi'                  => 150,
                'defaultFont'          => 'Times New Roman',
                'isRemoteEnabled'      => false,
                'isHtml5ParserEnabled' => true,
            ]);

        $safeJudul = preg_replace('/[^A-Za-z0-9]+/', '_', $judul);
        return $pdf->download(trim($safeJudul, '_') . '.pdf');
    }

    /**
     * Ambil logo ITG sebagai base64 data URI agar DomPDF bisa render tanpa remote
     */
    private static function getLogoBase64(): string
    {
        // Cek apakah ada logo yang di-upload di storage
        $storageLogo = storage_path('app/public/logo_itg.png');
        if (file_exists($storageLogo)) {
            $mime = mime_content_type($storageLogo);
            $b64  = base64_encode(file_get_contents($storageLogo));
            return "data:{$mime};base64,{$b64}";
        }

        // Fallback: logo ITG dari folder public
        $publicLogo = public_path('logo_itg.png');
        if (file_exists($publicLogo)) {
            $mime = mime_content_type($publicLogo);
            $b64  = base64_encode(file_get_contents($publicLogo));
            return "data:{$mime};base64,{$b64}";
        }

        // Fallback transparan placeholder
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
}
