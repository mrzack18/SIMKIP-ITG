<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Dokumen;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DokumenController extends Controller
{
    public function queue(Request $request): JsonResponse
    {
        $query = Dokumen::with(['mahasiswa.prodi', 'jenis', 'approvedBy']);

        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }
        if ($request->jenis && $request->jenis !== 'Semua') {
            $query->whereHas('jenis', fn($q) => $q->where('nama', $request->jenis));
        }

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => $data->map(fn($d) => [
                'id'             => $d->id,
                'nim'            => $d->mahasiswa->nim,
                'nama'           => $d->mahasiswa->nama,
                'prodi'          => $d->mahasiswa->prodi?->nama,
                'jenis'          => $d->jenis->nama,
                'nama_file'      => $d->nama_file,
                'status'         => $d->status,
                'catatan_admin'  => $d->catatan_admin,
                'tanggal_upload' => $d->created_at->format('d M Y'),
                'approved_by'    => $d->approvedBy?->name,
                'approved_at'    => $d->approved_at?->format('d M Y'),
                'file_url'       => asset('storage/' . $d->path_file),
            ]),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $dok = Dokumen::with('mahasiswa.user')->findOrFail($id);
        $dok->update([
            'status'      => 'Disetujui',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'catatan_admin'=> null,
        ]);

        Notification::kirim(
            $dok->mahasiswa->user_id,
            "Dokumen {$dok->jenis->nama} Disetujui",
            "Dokumen {$dok->jenis->nama} Anda telah diverifikasi dan disetujui oleh admin.",
            'success',
            '/mahasiswa/dokumen'
        );

        AuditLog::catat('Validasi', "Approve dokumen {$dok->jenis->nama} milik {$dok->mahasiswa->nama}", [
            'terkait_nim'  => $dok->mahasiswa->nim,
            'terkait_nama' => $dok->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Dokumen disetujui.']);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['catatan' => 'required|string|min:5']);

        $dok = Dokumen::with(['mahasiswa.user', 'jenis'])->findOrFail($id);
        $dok->update([
            'status'       => 'Ditolak',
            'approved_by'  => auth()->id(),
            'approved_at'  => now(),
            'catatan_admin'=> $request->catatan,
        ]);

        Notification::kirim(
            $dok->mahasiswa->user_id,
            "Dokumen {$dok->jenis->nama} Ditolak",
            "Dokumen {$dok->jenis->nama} Anda ditolak. Alasan: {$request->catatan}",
            'error',
            '/mahasiswa/dokumen'
        );

        AuditLog::catat('Validasi', "Tolak dokumen {$dok->jenis->nama} milik {$dok->mahasiswa->nama}", [
            'terkait_nim'  => $dok->mahasiswa->nim,
            'terkait_nama' => $dok->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Dokumen ditolak.']);
    }

    public function serveFile(int $id): mixed
    {
        $dok = Dokumen::findOrFail($id);
        $path = storage_path('app/public/' . $dok->path_file);
        if (! file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'File tidak ditemukan.'], 404);
        }
        return response()->file($path);
    }
}
