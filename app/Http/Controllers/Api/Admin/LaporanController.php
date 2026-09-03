<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Laporan;
use App\Models\LaporanReview;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Models\Prodi;
use App\Models\SuratPeringatan;
use App\Models\User;
use App\Models\IpkSemestr;
use App\Http\Resources\LaporanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Laporan::with(['dibuatOleh','latestReview.warek']);
        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('judul','like',"%$s%")->orWhere('nomor_surat','like',"%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);
        if ($request->tahun_akademik) $query->where('tahun_akademik', $request->tahun_akademik);
        if ($request->semester) $query->where('semester', $request->semester);
        if ($request->cakupan && $request->cakupan !== 'semua') {
            if ($request->cakupan === 'keduanya') {
                $query->where('cakupan', 'keduanya');
            } else {
                $query->where('cakupan', $request->cakupan);
            }
        }
        if ($request->prodi && $request->prodi !== 'Semua') $query->whereHas('dibuatOleh.prodi', fn($q) => $q->where('nama', $request->prodi));
        if ($request->angkatan && $request->angkatan !== 'Semua') $query->whereHas('dibuatOleh', fn($q) => $q->where('angkatan', $request->angkatan));

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => LaporanResource::collection($data),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'totalPages' => (int) ceil($total / max($limit, 1)),
            'total_pages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'judul'          => 'required|string',
            'tahun_akademik' => 'required|string',
            'semester'       => 'required|in:Ganjil,Genap',
            'tanggal_laporan'=> 'required|date',
            'catatan_laporan'=> 'nullable|string',
            'cakupan'        => 'nullable|string|in:semua,angkatan,prodi,keduanya',
            'angkatan'       => 'nullable|string',
            'prodi'          => 'nullable|string',
            'tujuan_warek'   => 'boolean',
            'tujuan_prodi'   => 'boolean',
        ]);

        $periode = $request->semester . ' ' . $request->tahun_akademik;

        $laporan = Laporan::create([
            'judul'           => $request->judul,
            'periode'         => $periode,
            'tahun_akademik'  => $request->tahun_akademik,
            'semester'        => $request->semester,
            'tanggal_laporan' => $request->tanggal_laporan,
            'catatan_laporan' => $request->catatan_laporan,
            'cakupan'         => $request->cakupan ?? 'semua',
            'angkatan'        => $request->angkatan,
            'prodi'           => $request->prodi,
            'tujuan_warek'    => $request->tujuan_warek ?? true,
            'tujuan_prodi'    => $request->tujuan_prodi ?? false,
            'status'          => 'Draft',
            'dibuat_oleh'     => auth()->id(),
        ]);

        AuditLog::catat('Laporan', "Buat laporan: {$request->judul}");

        return response()->json(['success' => true, 'laporan' => new LaporanResource($laporan)], 201);
    }

    public function show(int $id): JsonResponse
    {
        $l = Laporan::with(['dibuatOleh','reviews.warek'])->findOrFail($id);
        $statistics = $this->computeStatistics($l);
        return response()->json([
            'success' => true,
            'data' => new LaporanResource($l),
            'statistics' => $statistics,
        ]);
    }

    public function previewStatistics(Request $request): JsonResponse
    {
        $request->validate([
            'cakupan' => 'required|in:semua,angkatan,prodi,keduanya',
            'angkatan' => 'nullable|string',
            'prodi'    => 'nullable|string',
        ]);

        $cakupan = $request->cakupan;
        $angkatan = $request->angkatan;
        $prodiNama = $request->prodi;

        $mQuery = Mahasiswa::query();

        if ($cakupan === 'angkatan') {
            $mQuery->where('angkatan', $angkatan);
        } elseif ($cakupan === 'prodi') {
            $prodi = Prodi::where('nama', $prodiNama)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        } elseif ($cakupan === 'keduanya') {
            $mQuery->where('angkatan', $angkatan);
            $prodi = Prodi::where('nama', $prodiNama)->first();
            if ($prodi) $mQuery->where('prodi_id', $prodi->id);
        }

        // Total & kategori
        $counts = (clone $mQuery)
            ->select('kategori', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('kategori')
            ->pluck('jumlah', 'kategori');

        $totalReguler  = (int) ($counts['Reguler'] ?? 0);
        $totalAspirasi = (int) ($counts['Aspirasi'] ?? 0);
        $totalMahasiswa = $totalReguler + $totalAspirasi;

        // Rata-rata IPK — latest IPK per mahasiswa
        $mIds = (clone $mQuery)->pluck('id')->toArray();

        $latestIpks = IpkSemestr::whereIn('mahasiswa_id', $mIds)
            ->whereNotNull('ipk')
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn($rows) => $rows->sortByDesc('semester')->first()?->ipk)
            ->filter(fn($v) => $v !== null)
            ->map(fn($v) => (float) $v);

        $rataIpk = $latestIpks->count() > 0 ? round($latestIpks->avg(), 2) : null;

        // Distribusi angkatan
        $distribusi = (clone $mQuery)
            ->select('angkatan', DB::raw('COUNT(*) as jumlah'))
            ->whereNotNull('angkatan')
            ->groupBy('angkatan')
            ->orderBy('angkatan')
            ->get()
            ->map(fn($r) => ['angkatan' => (string) $r->angkatan, 'total' => (int) $r->jumlah])
            ->values();

        // IPK trend — rata-rata IPK per semester (latest 6)
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

        // IPK distribution buckets — latest IPK per mahasiswa, then bucket
        $allIpks = IpkSemestr::whereIn('mahasiswa_id', $mIds)
            ->whereNotNull('ipk')
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn($rows) => $rows->sortByDesc('semester')->first()?->ipk)
            ->filter(fn($v) => $v !== null)
            ->map(fn($v) => (float) $v);

        $ipkBuckets = [
            ['range' => '< 2.5',  'count' => $allIpks->filter(fn($v) => $v < 2.5)->count()],
            ['range' => '2.5–2.9','count' => $allIpks->filter(fn($v) => $v >= 2.5 && $v < 3.0)->count()],
            ['range' => '3.0–3.4','count' => $allIpks->filter(fn($v) => $v >= 3.0 && $v < 3.5)->count()],
            ['range' => '3.5–3.9','count' => $allIpks->filter(fn($v) => $v >= 3.5 && $v < 4.0)->count()],
            ['range' => '4.0',    'count' => $allIpks->filter(fn($v) => $v == 4.0)->count()],
        ];

        // Sample mahasiswa list (paginated, 20 items for preview)
        $mahasiswas = (clone $mQuery)
            ->with(['prodi'])
            ->limit(20)
            ->get()
            ->map(fn($m) => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama ?? '',
                'angkatan' => $m->angkatan,
                'ipk'      => $m->ipkTerakhir,
                'sp'       => $m->sp_aktif,
                'status'   => $m->status,
                'kategori' => $m->kategori,
            ]);

        // Get SP count and names
        $spList = SuratPeringatan::with('mahasiswa')
            ->whereIn('mahasiswa_id', $mIds)
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->get();
        $totalSp = $spList->count();
        $namaSp = $spList->map(fn($sp) => $sp->mahasiswa->nama . ' (' . $sp->level . ')')->unique()->values();

        // Get Prestasi count and names
        $prestasiList = \App\Models\Prestasi::with('mahasiswa')
            ->whereIn('mahasiswa_id', $mIds)
            ->where('status', 'Disetujui')
            ->get();
        $totalPrestasi = $prestasiList->unique('mahasiswa_id')->count(); // How many unique students have achievements
        $namaPrestasi = $prestasiList->map(fn($p) => $p->mahasiswa->nama . ' - ' . $p->nama_kompetisi)->unique()->values();

        return response()->json([
            'success'             => true,
            'total_mahasiswa'     => $totalMahasiswa,
            'total_reguler'       => $totalReguler,
            'total_aspirasi'      => $totalAspirasi,
            'rata_ipk'            => $rataIpk,
            'distribusi_angkatan' => $distribusi,
            'ipk_trend'           => $ipkBySemester,
            'ipk_distribution'    => $ipkBuckets,
            'mahasiswa'           => $mahasiswas,
            'total_sp'            => $totalSp,
            'nama_sp'             => $namaSp,
            'total_prestasi'      => $totalPrestasi,
            'nama_prestasi'       => $namaPrestasi,
        ]);
    }

    private function computeStatistics(Laporan $l): array
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

        // Total & kategori
        $counts = (clone $mQuery)
            ->select('kategori', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('kategori')
            ->pluck('jumlah', 'kategori');

        $totalReguler  = (int) ($counts['Reguler'] ?? 0);
        $totalAspirasi = (int) ($counts['Aspirasi'] ?? 0);
        $totalMahasiswa = $totalReguler + $totalAspirasi;

        // Rata-rata IPK — latest IPK per mahasiswa
        $mIds = (clone $mQuery)->pluck('id')->toArray();

        $latestIpks = IpkSemestr::whereIn('mahasiswa_id', $mIds)
            ->whereNotNull('ipk')
            ->get()
            ->groupBy('mahasiswa_id')
            ->map(fn($rows) => $rows->sortByDesc('semester')->first()?->ipk)
            ->filter(fn($v) => $v !== null)
            ->map(fn($v) => (float) $v);

        $rataIpk = $latestIpks->count() > 0 ? round($latestIpks->avg(), 2) : null;

        // Distribusi angkatan
        $distribusi = (clone $mQuery)
            ->select('angkatan', DB::raw('COUNT(*) as jumlah'))
            ->whereNotNull('angkatan')
            ->groupBy('angkatan')
            ->orderBy('angkatan')
            ->get()
            ->map(fn($r) => [
                'angkatan' => (string) $r->angkatan,
                'total' => (int) $r->jumlah,
            ])
            ->values();

        // IPK trend — rata-rata IPK per semester (latest 6)
        $ipkBySemester = IpkSemestr::join('mahasiswas as m', 'ipk_semestrs.mahasiswa_id', 'm.id')
            ->whereIn('m.id', $mIds)
            ->whereNotNull('ipk_semestrs.ipk')
            ->select('ipk_semestrs.semester', DB::raw('ROUND(AVG(ipk_semestrs.ipk), 2) as avg_ipk'))
            ->groupBy('ipk_semestrs.semester')
            ->orderBy('ipk_semestrs.semester')
            ->limit(6)
            ->get()
            ->map(fn($r) => [
                'semester' => 'Sem ' . (int) $r->semester,
                'ipk' => (float) $r->avg_ipk,
            ])
            ->values();

        $pctReguler  = $totalMahasiswa > 0 ? round($totalReguler / $totalMahasiswa * 100) : 0;
        $pctAspirasi = $totalMahasiswa > 0 ? round($totalAspirasi / $totalMahasiswa * 100) : 0;

        return [
            'totalMahasiswa' => $totalMahasiswa,
            'kipk' => [
                'reguler' => ['total' => $totalReguler, 'persen' => $pctReguler],
                'aspirasi' => ['total' => $totalAspirasi, 'persen' => $pctAspirasi],
            ],
            'rataIpk' => $rataIpk,
            'distribusiAngkatan' => $distribusi,
            'ipkTrend' => $ipkBySemester,
        ];
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $l = Laporan::findOrFail($id);
        if ($l->status !== 'Draft' && $l->status !== 'Dikembalikan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dapat diedit.'], 422);
        }

        $request->validate([
            'judul'          => 'sometimes|required|string',
            'tahun_akademik' => 'sometimes|required|string',
            'semester'       => 'sometimes|required|in:Ganjil,Genap',
            'tanggal_laporan'=> 'sometimes|required|date',
            'catatan_laporan'=> 'nullable|string',
            'cakupan'        => 'nullable|string|in:semua,angkatan,prodi,keduanya',
            'angkatan'       => 'nullable|string',
            'prodi'          => 'nullable|string',
            'tujuan_warek'   => 'boolean',
            'tujuan_prodi'   => 'boolean',
        ]);

        $data = $request->only([
            'judul','tahun_akademik','semester','tanggal_laporan','catatan_laporan',
            'cakupan', 'angkatan', 'prodi', 'tujuan_warek', 'tujuan_prodi'
        ]);

        if (isset($data['semester']) && isset($data['tahun_akademik'])) {
            $data['periode'] = $data['semester'] . ' ' . $data['tahun_akademik'];
        }

        $l->update($data);
        return response()->json(['success' => true, 'laporan' => new LaporanResource($l)]);
    }

    public function submit(int $id): JsonResponse
    {
        $l = Laporan::findOrFail($id);
        if (! in_array($l->status, ['Draft', 'Dikembalikan'])) {
            return response()->json(['success' => false, 'message' => 'Laporan sudah diajukan.'], 422);
        }

        // Generate nomor surat
        $nomor = 'LAP/KIP-K/ITG/' . now()->format('m') . '/' . now()->year . '/' . str_pad($id, 3, '0', STR_PAD_LEFT);
        $l->update(['status' => 'Diajukan', 'submitted_at' => now(), 'nomor_surat' => $nomor]);

        if ($l->tujuan_warek) {
            User::where('role', 'warek')->each(function ($u) use ($l) {
                Notification::kirim($u->id, 'Laporan Baru Menunggu Persetujuan',
                    "Laporan \"{$l->judul}\" telah diajukan untuk ditinjau.", 'info', '/warek/laporan');
            });
        }

        AuditLog::catat('Laporan', "Submit laporan: {$l->judul}");

        return response()->json(['success' => true, 'status' => $l->status, 'nomor_surat' => $nomor]);
    }

    public function downloadPdf(int $id)
    {
        $l = Laporan::findOrFail($id);
        if ($l->status === 'Draft' || $l->status === 'Dikembalikan') {
            return response()->json(['success' => false, 'message' => 'Laporan belum diajukan atau dikembalikan.'], 403);
        }
        return \App\Services\PdfGeneratorService::laporanKipK($id);
    }
}
