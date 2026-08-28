<?php

namespace App\Http\Controllers\Api\Warek;

use App\Http\Controllers\Controller;
use App\Http\Resources\LaporanResource;
use App\Models\IpkSemestr;
use App\Models\Konfigurasi;
use App\Models\Laporan;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\SuratPeringatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * WAREK-specific dashboard with stats and reports list tailored for Wakil Rektor.
     */
    public function index(Request $request): JsonResponse
    {
        $currentSemester = Konfigurasi::get('semester_aktif', 'Genap');
        $currentTahun = Konfigurasi::get('tahun_akademik_aktif', '2025/2026');

        // --- Stats: total mahasiswa aktif, kategori split ---
        $totalMahasiswa = Mahasiswa::where('status', 'Aktif')->count();

        $countsByKategori = Mahasiswa::where('status', 'Aktif')
            ->select('kategori', DB::raw('COUNT(*) as total'))
            ->groupBy('kategori')
            ->pluck('total', 'kategori');

        $reguler = (int) ($countsByKategori['Reguler'] ?? 0);
        $aspirasi = (int) ($countsByKategori['Aspirasi'] ?? 0);

        // --- Laporan approved in current semester ---
        $laporanDisetujuiSemesterIni = Laporan::where('status', 'Disetujui')
            ->where('tahun_akademik', $currentTahun)
            ->where('semester', $currentSemester)
            ->count();

        // --- Pending reports (Diajukan → FE label: "Menunggu") ---
        $pendingReports = Laporan::with('dibuatOleh')
            ->where('status', 'Diajukan')
            ->where('tujuan_warek', true)
            ->latest('submitted_at')
            ->take(5)
            ->get()
            ->map(function ($l) {
                $stats = $this->quickStatistics($l);
                return [
                    'id'      => $l->id,
                    'judul'   => $l->judul,
                    'nomor'   => $l->nomor_surat,
                    'tanggal' => $l->tanggal_laporan?->format('d F Y'),
                    'summary' => $this->buildSummaryText($stats),
                    'by'      => $l->dibuatOleh?->name ?? 'Biro Kemahasiswaan',
                ];
            });

        // --- Approved reports (last 5) ---
        $approvedReports = Laporan::with('latestReview')
            ->where('status', 'Disetujui')
            ->latest('tanggal_laporan')
            ->take(5)
            ->get()
            ->map(function ($l) {
                return [
                    'id'           => $l->id,
                    'judul'        => $l->judul,
                    'nomor'        => $l->nomor_surat,
                    'tanggal'      => $l->tanggal_laporan?->format('d F Y'),
                    'approvedDate' => $l->latestReview?->reviewed_at?->format('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'stats'   => [
                'totalMahasiswaAktif'        => $totalMahasiswa,
                'regulerCount'              => $reguler,
                'aspirasiCount'             => $aspirasi,
                'laporanDisetujuiSemesterIni' => $laporanDisetujuiSemesterIni,
                'currentPeriode'            => "{$currentSemester} {$currentTahun}",
            ],
            'pendingReports'  => $pendingReports,
            'approvedReports' => $approvedReports,
        ]);
    }

    /**
     * Build a one-line summary string for a laporan from pre-computed stats.
     */
    private function buildSummaryText(array $stats): string
    {
        $totalMhs = $stats['totalMahasiswa'];
        $avgIpk   = $stats['rataIpk'];
        $spAktif  = $stats['spAktif'];

        $parts = [];
        $parts[] = "{$totalMhs} mahasiswa";
        if ($avgIpk !== null) {
            $parts[] = 'rata-rata IPK ' . number_format($avgIpk, 2);
        }
        if ($spAktif > 0) {
            $parts[] = "{$spAktif} SP aktif";
        }

        return implode(', ', $parts);
    }

    /**
     * Compute quick statistics (total, avg IPK, SP aktif, distribusi IPK).
     */
    public static function quickStatisticsFor(Laporan $l): array
    {
        return (new self)->quickStatistics($l);
    }

    private function quickStatistics(Laporan $l): array
    {
        $mQuery = Mahasiswa::query();

        if ($l->cakupan === 'angkatan') {
            $mQuery->where('angkatan', $l->angkatan);
        } elseif ($l->cakupan === 'prodi') {
            $prodi = Prodi::where('nama', $l->prodi)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        } elseif ($l->cakupan === 'keduanya') {
            $mQuery->where('angkatan', $l->angkatan);
            $prodi = Prodi::where('nama', $l->prodi)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        }

        $mIds = $mQuery->pluck('id')->toArray();

        $latestIpks = IpkSemestr::whereIn('mahasiswa_id', $mIds)
            ->whereNotNull('ipk')
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn($rows) => $rows->sortByDesc('semester')->first()?->ipk)
            ->filter(fn($v) => $v !== null)
            ->map(fn($v) => (float) $v);

        $rataIpk = $latestIpks->count() > 0 ? round($latestIpks->avg(), 2) : null;

        $spAktif = SuratPeringatan::whereIn('mahasiswa_id', $mIds)
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->count();

        // Distribusi IPK buckets
        $ipkBuckets = [
            ['range' => '< 2.5',    'jml' => $latestIpks->filter(fn($v) => $v < 2.5)->count()],
            ['range' => '2.5–2.9',  'jml' => $latestIpks->filter(fn($v) => $v >= 2.5 && $v < 3.0)->count()],
            ['range' => '3.0–3.4',  'jml' => $latestIpks->filter(fn($v) => $v >= 3.0 && $v < 3.5)->count()],
            ['range' => '3.5–3.9',  'jml' => $latestIpks->filter(fn($v) => $v >= 3.5 && $v < 4.0)->count()],
            ['range' => '4.0',      'jml' => $latestIpks->filter(fn($v) => $v == 4.0)->count()],
        ];

        // Sample mahasiswa (top 8 sorted by IPK desc) for "Sample" table
        $samples = Mahasiswa::with(['prodi'])
            ->withCount(['ipkSemestrs as semester_calc'])
            ->addSelect([
                'ipk_calc' => IpkSemestr::select('ipk')
                    ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                    ->orderByDesc('semester')
                    ->limit(1),
                'sp_calc' => SuratPeringatan::select('level')
                    ->whereColumn('mahasiswa_id', 'mahasiswas.id')
                    ->whereIn('status', ['Aktif', 'Masa Tenggang'])
                    ->orderByDesc('level')
                    ->limit(1),
            ])
            ->whereIn('mahasiswas.id', $mIds ?: [0])
            ->orderByDesc('ipk_calc')
            ->limit(8)
            ->get()
            ->map(fn($m) => [
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $this->prodiShortName($m->prodi?->nama ?? ''),
                'ipk'      => (float) ($m->ipk_calc ?? 0),
                'status'   => $m->sp_calc ? "SP" : 'Aktif',
                'kategori' => $m->kategori,
            ]);

        // Bebas tanggungan (Surat Penyelesaian count) for the period
        $bebas = \App\Models\BebasTanggungan::whereIn('mahasiswa_id', $mIds)
            ->where('status', 'Disetujui')
            ->count();

        return [
            'totalMahasiswa' => count($mIds),
            'rataIpk'        => $rataIpk,
            'spAktif'        => $spAktif,
            'bebas'          => $bebas,
            'distribusiIPK'  => $ipkBuckets,
            'mahasiswaSample'=> $samples,
        ];
    }

    private function prodiShortName(string $nama): string
    {
        return str_replace('Teknik ', 'T.', $nama);
    }
}