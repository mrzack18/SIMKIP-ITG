<?php

namespace App\Services;

use App\Models\Mahasiswa;
use App\Models\Organisasi;
use App\Models\Prestasi;
use App\Models\Prodi;
use App\Models\SuratPeringatan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Sumber tunggal kolom dan baris rekap laporan.
 * Dipakai oleh preview (Admin\LaporanController) dan PDF (PdfGeneratorService).
 */
class LaporanRekapService
{
    public const JENIS = ['akademik', 'organisasi', 'prestasi'];

    public static function label(string $jenis): string
    {
        return match ($jenis) {
            'organisasi' => 'Data Organisasi',
            'prestasi' => 'Data Prestasi',
            default => 'Data Akademik',
        };
    }

    /**
     * Kolom tabel per jenis: [key => header].
     */
    public static function columns(string $jenis): array
    {
        return match ($jenis) {
            'organisasi' => [
                'nim' => 'NIM', 'nama' => 'Nama', 'prodi' => 'Prodi',
                'organisasi' => 'Organisasi', 'jabatan' => 'Jabatan', 'periode' => 'Periode',
            ],
            'prestasi' => [
                'nim' => 'NIM', 'nama' => 'Nama', 'prodi' => 'Prodi',
                'nama_prestasi' => 'Nama Prestasi', 'tingkat' => 'Tingkat', 'tanggal' => 'Tanggal',
            ],
            default => [
                'nim' => 'NIM', 'nama' => 'Nama', 'prodi' => 'Prodi', 'angkatan' => 'Angkatan',
                'ipk' => 'IPK', 'sp' => 'SP', 'prestasi' => 'Prestasi', 'keterangan' => 'Keterangan',
            ],
        };
    }

    /**
     * Query mahasiswa sesuai cakupan laporan.
     */
    public static function mahasiswaQuery(string $cakupan, ?string $angkatan, ?string $prodi): Builder
    {
        $q = Mahasiswa::with('prodi');

        if (in_array($cakupan, ['angkatan', 'keduanya'], true)) {
            $q->where('angkatan', $angkatan);
        }
        if (in_array($cakupan, ['prodi', 'keduanya'], true)) {
            $p = Prodi::where('nama', $prodi)->first();
            $q->where('prodi_id', $p?->id ?? 0);
        }

        return $q;
    }

    /**
     * Baris rekap per jenis. Setiap baris berisi key sesuai columns($jenis).
     */
    public static function rows(string $jenis, Collection $mahasiswas): array
    {
        return match ($jenis) {
            'organisasi' => self::organisasiRows($mahasiswas),
            'prestasi' => self::prestasiRows($mahasiswas),
            default => self::akademikRows($mahasiswas),
        };
    }

    private static function akademikRows(Collection $mahasiswas): array
    {
        $ids = $mahasiswas->pluck('id')->all();

        $spMap = SuratPeringatan::whereIn('mahasiswa_id', $ids)
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn ($items) => $items->sortByDesc('level')->first());

        $prestasiMap = Prestasi::whereIn('mahasiswa_id', $ids)
            ->where('status', 'Disetujui')
            ->select('mahasiswa_id', DB::raw('COUNT(*) as total'))
            ->groupBy('mahasiswa_id')
            ->pluck('total', 'mahasiswa_id');

        return $mahasiswas->map(function ($m) use ($spMap, $prestasiMap) {
            $ipk = $m->ipk_terakhir;
            $sp = $spMap->get($m->id);

            $keterangan = 'Baik';
            if ($sp) {
                $keterangan = 'Perlu Perhatian (SP '.str_replace('SP', '', $sp->level).' Aktif)';
            } elseif ($ipk && $ipk < 3.0) {
                $keterangan = 'IPK di bawah standar';
            }

            return [
                'nim' => $m->nim,
                'nama' => $m->nama,
                'prodi' => $m->prodi?->nama ?? '-',
                'angkatan' => $m->angkatan ?? '-',
                'ipk' => $ipk ? number_format((float) $ipk, 2) : '-',
                'sp' => $sp ? $sp->level : 'Tidak ada',
                'prestasi' => $prestasiMap->get($m->id, 0),
                'keterangan' => $keterangan,
            ];
        })->values()->all();
    }

    private static function prestasiRows(Collection $mahasiswas): array
    {
        return Prestasi::with('mahasiswa.prodi')
            ->whereIn('mahasiswa_id', $mahasiswas->pluck('id')->all())
            ->where('status', 'Disetujui')
            ->orderBy('mahasiswa_id')
            ->get()
            ->map(fn ($p) => [
                'nim' => $p->mahasiswa?->nim ?? '-',
                'nama' => $p->mahasiswa?->nama ?? '-',
                'prodi' => $p->mahasiswa?->prodi?->nama ?? '-',
                'nama_prestasi' => $p->nama_prestasi,
                'tingkat' => $p->tingkat ?? '-',
                'tanggal' => $p->tanggal_mulai?->format('d M Y') ?? '-',
            ])
            ->values()
            ->all();
    }

    private static function organisasiRows(Collection $mahasiswas): array
    {
        return Organisasi::with('mahasiswa.prodi')
            ->whereIn('mahasiswa_id', $mahasiswas->pluck('id')->all())
            ->where('status', 'Disetujui')
            ->orderBy('mahasiswa_id')
            ->get()
            ->map(fn ($o) => [
                'nim' => $o->mahasiswa?->nim ?? '-',
                'nama' => $o->mahasiswa?->nama ?? '-',
                'prodi' => $o->mahasiswa?->prodi?->nama ?? '-',
                'organisasi' => $o->nama,
                'jabatan' => $o->jabatan ?? '-',
                'periode' => trim(($o->periode_mulai?->format('M Y') ?? '-').' – '.($o->periode_selesai?->format('M Y') ?? 'sekarang')),
            ])
            ->values()
            ->all();
    }
}
