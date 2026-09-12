<?php

namespace App\Http\Controllers\Api;

use App\Helpers\TahunAjaranHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrganisasiResource;
use App\Http\Resources\PelatihanResource;
use App\Http\Resources\PrestasiResource;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use App\Models\Prestasi;
use App\Models\Prodi;
use App\Services\PdfGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Laporan prestasi, keaktifan organisasi, dan pelatihan mahasiswa.
 *
 * Dipakai oleh role admin (seluruh prodi, bisa difilter per prodi) dan prodi
 * (otomatis di-scope ke prodi milik user).
 */
class ReportingController extends Controller
{
    /**
     * Konfigurasi tiap jenis laporan.
     *
     * - dateFilter: 'range'  -> filter tanggal_mulai di antara rentang tahun ajaran
     *               'overlap'-> filter periode yang beririsan dengan tahun ajaran
     * - extraKey  : nama filter tambahan di luar tahun ajaran/status/prodi
     */
    private const TYPES = [
        'prestasi' => [
            'judul'      => 'Laporan Prestasi Mahasiswa',
            'dateFilter' => 'range',
            'startCol'   => 'tanggal_mulai',
            'statuses'   => ['Menunggu Validasi', 'Disetujui', 'Ditolak'],
            'extraKey'   => 'tingkat',
            'extraLabel' => 'Tingkat',
            'extras'     => ['Internasional', 'Nasional', 'Wilayah', 'Institusi'],
        ],
        'organisasi' => [
            'judul'      => 'Laporan Keaktifan Organisasi Mahasiswa',
            'dateFilter' => 'overlap',
            'startCol'   => 'periode_mulai',
            'statuses'   => ['Menunggu', 'Disetujui', 'Ditolak'],
            'extraKey'   => 'jenis',
            'extraLabel' => 'Jenis',
            'extras'     => ['Organisasi', 'Kepanitiaan', 'Kegiatan'],
        ],
        'pelatihan' => [
            'judul'      => 'Laporan Pelatihan Mahasiswa',
            'dateFilter' => 'range',
            'startCol'   => 'tanggal_mulai',
            'statuses'   => ['Menunggu', 'Disetujui', 'Ditolak'],
            'extraKey'   => 'jenis',
            'extraLabel' => 'Jenis',
            'extras'     => ['Akademik', 'Non-Akademik'],
        ],
    ];

    public function index(Request $request, string $type): JsonResponse
    {
        $config = $this->resolveType($type);
        $this->authorizeRole($request);

        $rows = $this->buildQuery($request, $type)
            ->latest()
            ->get()
            ->map(fn ($item) => $this->mapRow($item, $type))
            ->values();

        return response()->json([
            'success'   => true,
            'data'      => $rows,
            'total'     => $rows->count(),
            'judul'     => $config['judul'],
            'filter'    => $this->describeFilters($request, $config),
            'options'   => [
                'status' => $config['statuses'],
                'extra'  => $config['extras'],
            ],
        ]);
    }

    public function pdf(Request $request, string $type): Response
    {
        $config = $this->resolveType($type);
        $this->authorizeRole($request);

        $rows = $this->buildQuery($request, $type)
            ->latest()
            ->get()
            ->map(fn ($item) => $this->mapPdfRow($item, $type))
            ->values()
            ->toArray();

        return PdfGeneratorService::reportingTable(
            $config['judul'],
            $this->describeFilters($request, $config),
            $this->pdfHeaders($type),
            $rows,
        );
    }

    // ------------------------------------------------------------------
    // Query building
    // ------------------------------------------------------------------

    private function buildQuery(Request $request, string $type)
    {
        $config = self::TYPES[$type];

        $query = match ($type) {
            'prestasi'  => Prestasi::with(['mahasiswa.prodi']),
            'organisasi' => Organisasi::with(['mahasiswa.prodi']),
            'pelatihan' => Pelatihan::with(['mahasiswa.prodi']),
        };

        // Scope prodi: role prodi selalu dibatasi ke prodinya sendiri,
        // admin boleh memfilter prodi mana pun (opsional).
        $prodiId = null;
        if ($request->user()->role === 'prodi') {
            $prodiId = (int) ($request->user()->prodi_id ?? 0);
            if (!$prodiId) abort(403, 'Prodi tidak ditemukan untuk user ini.');
        } elseif ($request->filled('prodi_id') && $request->prodi_id !== 'Semua') {
            $prodiId = (int) $request->prodi_id;
        }

        if ($prodiId) {
            $query->whereHas('mahasiswa', fn ($q) => $q->where('prodi_id', $prodiId));
        }

        // Filter tahun ajaran (format internal frontend: "Tahun 2025/2026-1")
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua'
            ? $request->tahun_ajaran
            : null;

        if ($tahunAjaran) {
            $normalized = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            if ($config['dateFilter'] === 'overlap') {
                TahunAjaranHelper::applyOverlapFilter($query, $config['startCol'], 'periode_selesai', $normalized);
            } else {
                TahunAjaranHelper::applyDateRangeFilter($query, $config['startCol'], $normalized);
            }
        }

        // Filter status validasi (nilai enum apa adanya dari DB)
        if ($request->filled('status') && $request->status !== 'Semua Status') {
            $query->where('status', $request->status);
        }

        // Filter tambahan: tingkat (prestasi) / jenis (organisasi & pelatihan)
        $extraKey = $config['extraKey'];
        if ($request->filled($extraKey) && $request->input($extraKey) !== 'Semua') {
            $query->where($extraKey, $request->input($extraKey));
        }

        return $query;
    }

    /** Ringkasan filter aktif, dipakai untuk header PDF dan ditampilkan di UI. */
    private function describeFilters(Request $request, array $config): array
    {
        $labels = [];

        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua'
            ? $request->tahun_ajaran
            : null;
        $labels['Tahun Ajaran'] = $tahunAjaran
            ? str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran)
            : 'Semua';

        if ($request->user()->role === 'prodi') {
            $prodi = Prodi::find($request->user()->prodi_id);
            $labels['Prodi'] = $prodi?->nama ?? '-';
        } else {
            $labels['Prodi'] = ($request->filled('prodi_id') && $request->prodi_id !== 'Semua')
                ? (Prodi::find($request->prodi_id)?->nama ?? 'Semua')
                : 'Semua';
        }

        $labels['Status'] = $request->filled('status') ? $request->status : 'Semua Status';

        $extraKey = $config['extraKey'];
        $labels[$config['extraLabel']] = $request->filled($extraKey) ? $request->input($extraKey) : 'Semua';

        return $labels;
    }

    // ------------------------------------------------------------------
    // Row mapping
    // ------------------------------------------------------------------

    private function mapRow($item, string $type): array
    {
        $m = $item->mahasiswa;

        $base = [
            'id'       => $item->id,
            'nim'      => $m?->nim,
            'nama'     => $m?->nama,
            'prodi'    => $m?->prodi?->nama,
            'angkatan' => $m?->angkatan,
            'status'   => $item->status,
            // Bentuk lengkap (termasuk berkas & catatan) untuk modal detail,
            // persis seperti yang dipakai halaman Detail Mahasiswa.
            'detail'   => $this->mapDetail($item, $type),
        ];

        return match ($type) {
            'prestasi' => $base + [
                'namaPrestasi'   => $item->nama_prestasi,
                'tingkat'        => $item->tingkat,
                'pencapaian'     => $item->pencapaian,
                'penyelenggara'  => $item->penyelenggara,
                'tanggalMulai'   => $item->tanggal_mulai?->format('d M Y'),
                'tanggalSelesai' => $item->tanggal_selesai?->format('d M Y'),
                'tempat'         => $item->tempat,
            ],
            'organisasi' => $base + [
                'organisasi'     => $item->nama,
                'jenis'          => $item->jenis,
                'jabatan'        => $item->jabatan,
                'periodeMulai'   => $item->periode_mulai?->format('d M Y'),
                'periodeSelesai' => $item->periode_selesai?->format('d M Y'),
            ],
            'pelatihan' => $base + [
                'namaPelatihan'  => $item->nama,
                'jenis'          => $item->jenis,
                'penyelenggara'  => $item->penyelenggara,
                'tanggalMulai'   => $item->tanggal_mulai?->format('d M Y'),
                'tanggalSelesai' => $item->tanggal_selesai?->format('d M Y'),
                'tempat'         => $item->tempat,
            ],
        };
    }

    /**
     * Bentuk Resource lengkap untuk modal detail. Dipakai ulang oleh
     * PrestasiDetailModal / OrganisasiDetailModal / PelatihanDetailModal
     * sehingga bentuknya wajib sama dengan endpoint Detail Mahasiswa.
     */
    private function mapDetail($item, string $type): array
    {
        return match ($type) {
            'prestasi'   => (new PrestasiResource($item))->resolve(),
            'organisasi' => (new OrganisasiResource($item))->resolve(),
            'pelatihan'  => (new PelatihanResource($item))->resolve(),
        };
    }

    /** Baris untuk PDF: array skalar berurutan sesuai pdfHeaders(). */
    private function mapPdfRow($item, string $type): array
    {
        $r = $this->mapRow($item, $type);

        return match ($type) {
            'prestasi' => [
                $r['nim'], $r['nama'], $r['prodi'], $r['angkatan'], $r['namaPrestasi'],
                $r['tingkat'], $r['pencapaian'], $r['penyelenggara'], $r['tanggalMulai'], $r['status'],
            ],
            'organisasi' => [
                $r['nim'], $r['nama'], $r['prodi'], $r['angkatan'], $r['organisasi'],
                $r['jenis'], $r['jabatan'], $r['periodeMulai'], $r['periodeSelesai'], $r['status'],
            ],
            'pelatihan' => [
                $r['nim'], $r['nama'], $r['prodi'], $r['angkatan'], $r['namaPelatihan'],
                $r['jenis'], $r['penyelenggara'], $r['tanggalMulai'], $r['tanggalSelesai'], $r['status'],
            ],
        };
    }

    private function pdfHeaders(string $type): array
    {
        return match ($type) {
            'prestasi' => [
                'NIM', 'Nama', 'Prodi', 'Angkatan', 'Nama Prestasi',
                'Tingkat', 'Pencapaian', 'Penyelenggara', 'Tanggal', 'Status',
            ],
            'organisasi' => [
                'NIM', 'Nama', 'Prodi', 'Angkatan', 'Organisasi',
                'Jenis', 'Jabatan', 'Periode Mulai', 'Periode Selesai', 'Status',
            ],
            'pelatihan' => [
                'NIM', 'Nama', 'Prodi', 'Angkatan', 'Nama Pelatihan',
                'Jenis', 'Penyelenggara', 'Tanggal Mulai', 'Tanggal Selesai', 'Status',
            ],
        };
    }

    // ------------------------------------------------------------------
    // Guards
    // ------------------------------------------------------------------

    private function resolveType(string $type): array
    {
        abort_unless(isset(self::TYPES[$type]), 404, 'Jenis laporan tidak dikenal.');
        return self::TYPES[$type];
    }

    private function authorizeRole(Request $request): void
    {
        abort_unless(
            in_array($request->user()->role ?? null, ['admin', 'prodi'], true),
            403,
            'Anda tidak berhak mengakses laporan ini.'
        );
    }
}
