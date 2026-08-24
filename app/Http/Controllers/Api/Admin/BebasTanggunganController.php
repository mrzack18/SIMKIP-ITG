<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\BebasTanggungan;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Services\BebasTanggunganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BebasTanggunganController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BebasTanggungan::with('mahasiswa.prodi');
        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success' => true,
            'data'    => $data->map(fn($b) => [
                'id'             => $b->id,
                'nim'            => $b->mahasiswa->nim,
                'nama'           => $b->mahasiswa->nama,
                'prodi'          => $b->mahasiswa->prodi?->nama,
                'tanggal_ajukan' => $b->tanggal_ajukan?->format('d M Y'),
                'status'         => $b->status,
                'catatan_admin'  => $b->catatan_admin,
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $b = BebasTanggungan::with('mahasiswa.prodi')->findOrFail($id);
        $m = $b->mahasiswa;
        $checklist = BebasTanggunganService::getChecklist($m);

        return response()->json([
            'success'    => true,
            'permohonan' => $b,
            'mahasiswa'  => [
                'id' => $m->id, 'nim' => $m->nim, 'nama' => $m->nama,
                'prodi' => $m->prodi?->nama, 'angkatan' => $m->angkatan,
                'semester' => $m->ipkSemestrs()->count(),
            ],
            'checklist'  => $checklist,
        ]);
    }

    public function approve(int $id): JsonResponse
    {
        $b = BebasTanggungan::with('mahasiswa.user')->findOrFail($id);

        $nomor = 'SKPS/KIP-K/ITG/' . strtoupper(now()->format('m')) . '/' . now()->year . '/' . str_pad($id, 3, '0', STR_PAD_LEFT);

        $b->update([
            'status'        => 'Diterbitkan',
            'reviewed_by'   => auth()->id(),
            'reviewed_at'   => now(),
            'nomor_surat'   => $nomor,
            'tanggal_terbit'=> now()->toDateString(),
        ]);

        $b->mahasiswa->update(['status' => 'Lulus']);

        Notification::kirim(
            $b->mahasiswa->user_id,
            'Bebas Tanggungan Diterbitkan',
            "Surat Keterangan Penyelesaian Studi Anda telah diterbitkan. Nomor: {$nomor}",
            'success',
            '/mahasiswa/bebas-tanggungan'
        );

        AuditLog::catat('Approve', "Terbitkan bebas tanggungan {$b->mahasiswa->nama} ({$b->mahasiswa->nim})", [
            'terkait_nim' => $b->mahasiswa->nim, 'terkait_nama' => $b->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'nomor_surat' => $nomor]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['alasan' => 'required|string|min:10']);

        $b = BebasTanggungan::with('mahasiswa.user')->findOrFail($id);
        $b->update([
            'status'       => 'Ditolak',
            'reviewed_by'  => auth()->id(),
            'reviewed_at'  => now(),
            'catatan_admin'=> $request->alasan,
        ]);

        Notification::kirim(
            $b->mahasiswa->user_id,
            'Bebas Tanggungan Ditolak',
            "Permohonan bebas tanggungan Anda ditolak. Alasan: {$request->alasan}",
            'error',
            '/mahasiswa/bebas-tanggungan'
        );

        return response()->json(['success' => true, 'message' => 'Permohonan ditolak.']);
    }
}
