<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Laporan;
use App\Models\LaporanReview;
use App\Models\Notification;
use App\Models\User;
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
            'data'        => $data->map(fn($l) => [
                'id'            => $l->id,
                'nomor_surat'   => $l->nomor_surat,
                'judul'         => $l->judul,
                'periode'       => $l->periode,
                'status'        => $l->status,
                'dibuat_oleh'   => $l->dibuatOleh?->name,
                'catatan_warek' => $l->latestReview?->catatan,
                'tanggal'       => $l->tanggal_laporan?->format('d M Y'),
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'judul'          => 'required|string',
            'periode'        => 'required|string',
            'tahun_akademik' => 'required|string',
            'semester'       => 'required|in:Ganjil,Genap',
            'tanggal_laporan'=> 'required|date',
            'catatan_laporan'=> 'nullable|string',
        ]);

        $laporan = Laporan::create([
            'judul'           => $request->judul,
            'periode'         => $request->periode,
            'tahun_akademik'  => $request->tahun_akademik,
            'semester'        => $request->semester,
            'tanggal_laporan' => $request->tanggal_laporan,
            'catatan_laporan' => $request->catatan_laporan,
            'status'          => 'Draft',
            'dibuat_oleh'     => auth()->id(),
        ]);

        AuditLog::catat('Laporan', "Buat laporan: {$request->judul}");

        return response()->json(['success' => true, 'laporan' => $laporan], 201);
    }

    public function show(int $id): JsonResponse
    {
        $l = Laporan::with(['dibuatOleh','reviews.warek'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $l]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $l = Laporan::findOrFail($id);
        if ($l->status !== 'Draft' && $l->status !== 'Dikembalikan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dapat diedit.'], 422);
        }
        $l->update($request->only(['judul','periode','tahun_akademik','semester','tanggal_laporan','catatan_laporan']));
        return response()->json(['success' => true, 'laporan' => $l]);
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

        // Notifikasi ke semua warek
        User::where('role', 'warek')->each(function ($u) use ($l) {
            Notification::kirim($u->id, 'Laporan Baru Menunggu Persetujuan',
                "Laporan \"{$l->judul}\" telah diajukan untuk ditinjau.", 'info', '/warek/laporan');
        });

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
