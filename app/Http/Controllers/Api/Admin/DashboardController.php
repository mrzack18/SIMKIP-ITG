<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Dokumen;
use App\Models\SuratPeringatan;
use App\Models\BebasTanggungan;
use App\Models\Prodi;
use App\Models\CatatanInternal;
use App\Helpers\TahunAjaranHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tahunAjaran = $request->tahun_ajaran;
        $range       = TahunAjaranHelper::getDateRange($tahunAjaran);
        $taStartYear = $range
            ? (int) preg_replace('/\/\d+.*/', '', str_replace(['Tahun ','-1','-2'], ['','',''], $tahunAjaran))
            : null;

        // ── Stats: student counts ───────────────────────────────────────────────
        // When filtering by TA, include only students enrolled up to that year
        $baseMhs = Mahasiswa::query();
        if ($taStartYear) {
            $baseMhs->where('angkatan', '<=', $taStartYear);
        }
        $totalAktif = (clone $baseMhs)->where('status', 'Aktif')->count();
        $reguler    = (clone $baseMhs)->where('status', 'Aktif')->where('kategori', 'Reguler')->count();
        $aspirasi   = (clone $baseMhs)->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count();
        $dicabut    = (clone $baseMhs)->where('status', 'Dicabut')->count();

        // ── Pending counts: filtered by TA date range ─────────────────────────
        $baseDok = Dokumen::query();
        $baseBt  = BebasTanggungan::query();
        if ($range) {
            $baseDok->whereBetween('created_at', [$range[0], $range[1]]);
            $baseBt->whereBetween('created_at', [$range[0], $range[1]]);
        }
        $dokumenMenunggu = (clone $baseDok)->where('status', 'Menunggu')->count();
        $bebasPending    = (clone $baseBt)->where('status', 'Menunggu')->count();

        // ── SP Aktif (issued within TA range) ─────────────────────────────────
        $spAktifBase = SuratPeringatan::with(['mahasiswa.prodi'])
            ->whereIn('status', ['Aktif', 'Masa Tenggang']);
        if ($range) {
            $spAktifBase->whereBetween('tanggal_terbit', [$range[0], $range[1]]);
        }
        $spAktif = $spAktifBase->latest()->take(5)->get()->map(fn($sp) => [
            'id'    => $sp->id,
            'nim'   => $sp->mahasiswa->nim,
            'nama'  => $sp->mahasiswa->nama,
            'prodi' => $sp->mahasiswa->prodi->nama ?? '-',
            'sp'    => $sp->level,
            'sisa'  => $sp->sisa_hari,
        ]);

        // ── Dokumen Queue (uploaded within TA range) ────────────────────────────
        $dqBase = Dokumen::with(['mahasiswa', 'jenis'])->where('status', 'Menunggu');
        if ($range) {
            $dqBase->whereBetween('created_at', [$range[0], $range[1]]);
        }
        $dokumenQueue = $dqBase->latest()->take(5)->get()->map(fn($d) => [
            'id'             => $d->id,
            'nim'            => $d->mahasiswa->nim,
            'nama'           => $d->mahasiswa->nama,
            'jenis'          => $d->jenis->nama,
            'tanggal_upload' => $d->created_at->format('d M Y'),
            'status'         => $d->status,
        ]);

        // ── Advanced Stats ──────────────────────────────────────────────────────
        // Semester >8: students with >8 IPK records (up to TA range end)
        $sem8Base = \Illuminate\Support\Facades\DB::table('ipk_semestrs')
            ->join('mahasiswas', 'ipk_semestrs.mahasiswa_id', '=', 'mahasiswas.id')
            ->select('mahasiswas.id');
        if ($taStartYear) {
            $sem8Base->where('mahasiswas.angkatan', '<=', $taStartYear);
        }
        if ($range) {
            $sem8Base->where('ipk_semestrs.created_at', '<=', $range[1]);
        }
        $semesterLebih8 = (clone $sem8Base)
            ->groupBy('mahasiswas.id')
            ->havingRaw('COUNT(ipk_semestrs.id) > 8')
            ->count();

        // SP in this period
        $spPeriodBase = SuratPeringatan::query();
        if ($range) {
            $spPeriodBase->whereBetween('tanggal_terbit', [$range[0], $range[1]]);
        }
        $spSemesterIni = (clone $spPeriodBase)->count();

        // ── Chart Data ─────────────────────────────────────────────────────────
        $prodis = Prodi::all();

        $mhsBase = Mahasiswa::select('id', 'prodi_id', 'angkatan', 'status', 'kategori');
        if ($taStartYear) {
            $mhsBase->where('angkatan', '<=', $taStartYear);
        }
        $mahasiswaSemua = $mhsBase->get();
        $angkatans = $mahasiswaSemua->pluck('angkatan')->filter()->unique()->sort();

        // 1. Prodi Sebaran
        $prodiSebaranData = $prodis->map(fn($prodi) => [
            'name'     => $prodi->nama,
            'Reguler'  => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
            'Aspirasi' => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
            'Dicabut'  => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('status', 'Dicabut')->count(),
        ])->values();

        // 2. Angkatan Sebaran
        $angkatanSebaranData = $angkatans->map(fn($angkatan) => [
            'name'     => (string) $angkatan,
            'Reguler'  => $mahasiswaSemua->where('angkatan', $angkatan)->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
            'Aspirasi' => $mahasiswaSemua->where('angkatan', $angkatan)->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
            'Dicabut'  => $mahasiswaSemua->where('angkatan', $angkatan)->where('status', 'Dicabut')->count(),
        ])->values();

        // 3. Sebaran per Prodi per Angkatan
        $sebaranPerProdiAngkatan = ['Semua' => $prodiSebaranData];
        foreach ($angkatans as $angkatan) {
            $sebaranPerProdiAngkatan[(string)$angkatan] = $prodis->map(fn($prodi) => [
                'name'     => $prodi->nama,
                'Reguler'  => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('angkatan', $angkatan)->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
                'Aspirasi' => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('angkatan', $angkatan)->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
                'Dicabut'  => $mahasiswaSemua->where('prodi_id', $prodi->id)->where('angkatan', $angkatan)->where('status', 'Dicabut')->count(),
            ])->values();
        }

        // ── Kendala (CatatanInternal) ───────────────────────────────────────────
        $kendalaQuery = CatatanInternal::query();
        if ($tahunAjaran && $tahunAjaran !== 'Semua') {
            $kendalaQuery->where('tahun_ajaran', $tahunAjaran);
        }
        $kendalaTotal = $kendalaQuery->count();

        $kategoriCounts = (clone $kendalaQuery)
            ->selectRaw('kategori, COUNT(*) as total')
            ->groupBy('kategori')
            ->pluck('total', 'kategori')
            ->toArray();

        $kategoriColors = [
            'Finansial' => '#263F93',
            'Akademik'  => '#D4A72C',
            'Fasilitas' => '#4F46E5',
            'Lainnya'   => '#94A3B8',
        ];
        $kendalaCategories = collect(['Finansial', 'Akademik', 'Fasilitas', 'Lainnya'])
            ->map(fn($kat) => [
                'name'  => $kat,
                'value' => $kategoriCounts[$kat] ?? 0,
                'color' => $kategoriColors[$kat] ?? '#94A3B8',
            ])
            ->values()
            ->toArray();

        $dominant = collect($kendalaCategories)->sortByDesc('value')->first();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_aktif'              => $totalAktif,
                'reguler'                  => $reguler,
                'aspirasi'                 => $aspirasi,
                'mahasiswa_dicabut'        => $dicabut,
                'dokumen_menunggu'         => $dokumenMenunggu,
                'bebas_tanggungan_pending' => $bebasPending,
                'semester_lebih_8'         => $semesterLebih8,
                'sp_semester_ini'          => $spSemesterIni,
            ],
            'prodi_sebaran'               => $prodiSebaranData,
            'angkatan_sebaran'           => $angkatanSebaranData,
            'sebaran_per_prodi_angkatan'  => $sebaranPerProdiAngkatan,
            'sp_aktif'                   => $spAktif,
            'dokumen_queue'              => $dokumenQueue,
            'kendala' => [
                'total'       => $kendalaTotal,
                'categories'  => $kendalaCategories,
                'dominant'    => $dominant['name'] ?? null,
                'dominant_pct'=> $kendalaTotal > 0 ? round(($dominant['value'] ?? 0) / $kendalaTotal * 100) : 0,
            ],
        ]);
    }

    public function badgeCounts(): JsonResponse
    {
        $dokumenCount    = \App\Models\Dokumen::where('status', 'Menunggu')->count();
        $prestasiCount   = \App\Models\Prestasi::whereIn('status', ['Menunggu', 'Menunggu Validasi'])->count();
        $organisasiCount = \App\Models\Organisasi::where('status', 'Menunggu')->count();
        $pelatihanCount  = \App\Models\Pelatihan::where('status', 'Menunggu')->count();
        $ipkCount       = \App\Models\IpkSemestr::where('status', 'Menunggu')->count();
        $dokumenQueueMenunggu = $dokumenCount + $prestasiCount + $organisasiCount + $pelatihanCount + $ipkCount;
        $bebasMenunggu   = \App\Models\BebasTanggungan::whereIn('status', ['Menunggu', 'Diproses'])->count();

        return response()->json([
            'success' => true,
            'dokumen_queue_menunggu'   => $dokumenQueueMenunggu,
            'bebas_tanggungan_menunggu'=> $bebasMenunggu,
        ]);
    }
}
