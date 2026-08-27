<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Laporan;
use App\Models\LaporanReview;
use App\Models\Notification;
use App\Models\User;
use App\Http\Resources\LaporanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Laporan::with(['dibuatOleh','latestReview.warek']);
        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('judul','like',"%$s%")->orWhere('nomor_surat','like',"%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

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
        return response()->json(['success' => true, 'data' => new LaporanResource($l)]);
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
