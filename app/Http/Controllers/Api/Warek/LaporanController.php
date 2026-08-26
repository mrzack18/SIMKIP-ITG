<?php

namespace App\Http\Controllers\Api\Warek;

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
        $query = Laporan::with(['dibuatOleh', 'latestReview'])
            ->whereIn('status', ['Diajukan', 'Disetujui', 'Dikembalikan']);

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('judul', 'like', "%$s%")->orWhere('nomor_surat', 'like', "%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => $data->map(fn($l) => [
                'id'           => $l->id,
                'nomor_surat'  => $l->nomor_surat,
                'judul'        => $l->judul,
                'periode'      => $l->periode,
                'status'       => $l->status,
                'dibuat_oleh'  => $l->dibuatOleh?->name,
                'tanggal'      => $l->tanggal_laporan?->format('d M Y'),
                'submitted_at' => $l->submitted_at?->format('d M Y H:i'),
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total / $limit),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $l = Laporan::with(['dibuatOleh', 'reviews.warek'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $l]);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $l = Laporan::findOrFail($id);

        if ($l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dalam status Diajukan.'], 422);
        }

        $l->update(['status' => 'Disetujui']);

        LaporanReview::create([
            'laporan_id'  => $l->id,
            'warek_id'    => auth()->id(),
            'aksi'        => 'Disetujui',
            'reviewed_at' => now(),
        ]);

        // Notifikasi ke admin
        User::where('role', 'admin')->each(function ($u) use ($l) {
            Notification::kirim(
                $u->id,
                "Laporan Disetujui",
                "Laporan \"{$l->judul}\" telah disetujui oleh Warek.",
                'success',
                '/admin/laporan/' . $l->id
            );
        });

        AuditLog::catat('Approve', "Warek setujui laporan: {$l->judul}");

        return response()->json(['success' => true, 'status' => 'Disetujui']);
    }

    public function return(Request $request, int $id): JsonResponse
    {
        $request->validate(['catatan' => 'required|string|min:10']);

        $l = Laporan::findOrFail($id);

        if ($l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dalam status Diajukan.'], 422);
        }

        $l->update(['status' => 'Dikembalikan', 'submitted_at' => null]);

        LaporanReview::create([
            'laporan_id'  => $l->id,
            'warek_id'    => auth()->id(),
            'aksi'        => 'Dikembalikan',
            'catatan'     => $request->catatan,
            'reviewed_at' => now(),
        ]);

        User::where('role', 'admin')->each(function ($u) use ($l, $request) {
            Notification::kirim(
                $u->id,
                "Laporan Dikembalikan",
                "Laporan \"{$l->judul}\" dikembalikan oleh Warek. Catatan: {$request->catatan}",
                'warning',
                '/admin/laporan/' . $l->id
            );
        });

        AuditLog::catat('Laporan', "Warek kembalikan laporan: {$l->judul}");

        return response()->json(['success' => true, 'status' => 'Dikembalikan']);
    }

    public function downloadPdf(int $id)
    {
        $l = Laporan::findOrFail($id);
        if ($l->status !== 'Disetujui' && $l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan belum diajukan.'], 403);
        }
        return \App\Services\PdfGeneratorService::laporanKipK($id);
    }
}
