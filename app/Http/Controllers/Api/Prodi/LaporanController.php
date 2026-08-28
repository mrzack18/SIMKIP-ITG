<?php
namespace App\Http\Controllers\Api\Prodi;
use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Models\Mahasiswa;
use App\Models\IpkSemestr;
use App\Http\Resources\LaporanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $prodiName = $request->user()->prodi?->nama;

        $query = Laporan::with(['dibuatOleh','latestReview.warek'])
            ->where('status', 'Disetujui') // Only approved laporans are visible to prodi
            ->where('tujuan_prodi', true)
            ->where(function($q) use ($prodiName) {
                $q->whereNull('prodi')
                  ->orWhere('prodi', 'Semua Program Studi')
                  ->orWhere('prodi', $prodiName);
            });

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('judul','like',"%$s%")->orWhere('nomor_surat','like',"%$s%"));
        }

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => LaporanResource::collection($data),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $prodiName = $request->user()->prodi?->nama;

        $l = Laporan::with(['dibuatOleh','reviews.warek'])->findOrFail($id);

        if ($l->status !== 'Disetujui' || !$l->tujuan_prodi) {
            abort(403, 'Laporan tidak tersedia.');
        }
        if ($l->prodi && $l->prodi !== 'Semua Program Studi' && $l->prodi !== $prodiName) {
            abort(403, 'Laporan tidak tersedia untuk Prodi Anda.');
        }

        $statistics = $this->computeStatistics($l);

        return response()->json([
            'success' => true,
            'data'    => new LaporanResource($l),
            'statistics' => $statistics,
        ]);
    }

    private function computeStatistics(Laporan $l): array
    {
        $mQuery = Mahasiswa::query();

        if ($l->cakupan === 'angkatan') {
            $mQuery->where('angkatan', $l->angkatan);
        } elseif ($l->cakupan === 'prodi') {
            $prodi = \App\Models\Prodi::where('nama', $l->prodi)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        } elseif ($l->cakupan === 'keduanya') {
            $mQuery->where('angkatan', $l->angkatan);
            $prodi = \App\Models\Prodi::where('nama', $l->prodi)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        }

        $counts = (clone $mQuery)
            ->select('kategori', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('kategori')
            ->pluck('jumlah', 'kategori');

        $totalReguler  = (int) ($counts['Reguler'] ?? 0);
        $totalAspirasi = (int) ($counts['Aspirasi'] ?? 0);
        $totalMahasiswa = $totalReguler + $totalAspirasi;

        $mIds = (clone $mQuery)->pluck('id')->toArray();

        $latestIpks = IpkSemestr::whereIn('mahasiswa_id', $mIds)
            ->whereNotNull('ipk')
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn($rows) => $rows->sortByDesc('semester')->first()?->ipk)
            ->filter(fn($v) => $v !== null)
            ->map(fn($v) => (float) $v);

        $rataIpk = $latestIpks->count() > 0 ? round($latestIpks->avg(), 2) : null;

        // IPK buckets
        $ipkBuckets = [
            ['range' => '< 2.5',   'count' => $latestIpks->filter(fn($v) => $v < 2.5)->count()],
            ['range' => '2.5–2.9', 'count' => $latestIpks->filter(fn($v) => $v >= 2.5 && $v < 3.0)->count()],
            ['range' => '3.0–3.4', 'count' => $latestIpks->filter(fn($v) => $v >= 3.0 && $v < 3.5)->count()],
            ['range' => '3.5–3.9', 'count' => $latestIpks->filter(fn($v) => $v >= 3.5 && $v < 4.0)->count()],
            ['range' => '4.0',     'count' => $latestIpks->filter(fn($v) => $v == 4.0)->count()],
        ];

        $ipkBySemester = IpkSemestr::join('mahasiswas as m', 'ipk_semestrs.mahasiswa_id', 'm.id')
            ->whereIn('m.id', $mIds)
            ->whereNotNull('ipk_semestrs.ipk')
            ->select('ipk_semestrs.semester', DB::raw('ROUND(AVG(ipk_semestrs.ipk), 2) as avg_ipk'))
            ->groupBy('ipk_semestrs.semester')
            ->orderBy('ipk_semestrs.semester')
            ->limit(6)
            ->get()
            ->map(fn($r) => ['semester' => 'Sem ' . (int) $r->semester, 'ipk' => (float) $r->avg_ipk])
            ->values();

        // SP aktif count
        $spAktif = (clone $mQuery)
            ->whereHas('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']))
            ->count();

        // Bebas tanggungan / surat penyelesaian count
        $bebas = (clone $mQuery)->whereHas('bebasTanggungan')->count();

        // Sample mahasiswa (with IPK + SP)
        $sample = (clone $mQuery)
            ->with(['ipkSemestrs' => fn($q) => $q->orderByDesc('semester')->limit(1), 'suratPeringatans'])
            ->limit(20)
            ->get()
            ->map(function ($m) {
                $ipk = (float) ($m->ipkSemestrs->first()?->ipk ?? 0);
                $sp  = $m->suratPeringatans
                    ->whereIn('status', ['Aktif', 'Masa Tenggang'])
                    ->sortByDesc('level')
                    ->first();
                return [
                    'id'      => $m->id,
                    'nim'     => $m->nim,
                    'nama'    => $m->nama,
                    'prodi'   => $m->prodi->nama ?? '-',
                    'ipk'     => $ipk,
                    'status'  => $sp ? $sp->level : ($m->status === 'Aktif' ? 'Aktif' : $m->status),
                ];
            })->values();

        $pctReguler  = $totalMahasiswa > 0 ? round($totalReguler / $totalMahasiswa * 100) : 0;
        $pctAspirasi = $totalMahasiswa > 0 ? round($totalAspirasi / $totalMahasiswa * 100) : 0;

        return [
            'totalMahasiswa' => $totalMahasiswa,
            'kipk' => [
                'reguler' => ['total' => $totalReguler, 'persen' => $pctReguler],
                'aspirasi' => ['total' => $totalAspirasi, 'persen' => $pctAspirasi],
            ],
            'rataIpk' => $rataIpk,
            'distribusiAngkatan' => [],
            'ipkTrend' => $ipkBySemester,
            'ipkBuckets' => $ipkBuckets,
            'spAktif' => $spAktif,
            'suratPenyelesaian' => $bebas,
            'mahasiswas' => $sample,
        ];
    }

    public function downloadPdf(Request $request, int $id)
    {
        $prodiName = $request->user()->prodi?->nama;

        $l = Laporan::findOrFail($id);
        if ($l->status !== 'Disetujui' || !$l->tujuan_prodi) {
            abort(403, 'Laporan tidak tersedia.');
        }
        if ($l->prodi && $l->prodi !== 'Semua Program Studi' && $l->prodi !== $prodiName) {
            abort(403, 'Laporan tidak tersedia untuk Prodi Anda.');
        }
        return \App\Services\PdfGeneratorService::laporanKipK($id);
    }
}