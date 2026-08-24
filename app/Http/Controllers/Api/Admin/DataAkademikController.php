<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Models\Prestasi;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DataAkademikController extends Controller
{
    /** List semua IPK mahasiswa (tab IPK di DataAkademik) */
    public function indexIPK(Request $request): JsonResponse
    {
        $query = Mahasiswa::with(['prodi','ipkSemestrs'])->where('status','Aktif');
        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $query->whereHas('prodi', fn($q) => $q->where('nama',$request->prodi)->orWhere('kode',$request->prodi));
        }

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => $data->map(fn($m) => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama,
                'angkatan' => $m->angkatan,
                'semester' => $m->ipkSemestrs->count(),
                'ipk_terakhir' => (float) ($m->ipkSemestrs->last()?->ipk ?? 0),
                'ipk_history'  => $m->ipkSemestrs->map(fn($s) => ['semester' => $s->semester, 'ipk' => (float)$s->ipk]),
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    /** Validate prestasi */
    public function validatePrestasi(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'aksi'         => 'required|in:Disetujui,Ditolak',
            'catatan_admin'=> 'nullable|string',
        ]);

        $p = Prestasi::with('mahasiswa.user')->findOrFail($id);
        $p->update([
            'status'       => $request->aksi === 'Disetujui' ? 'Disetujui' : 'Ditolak',
            'catatan_admin'=> $request->catatan_admin,
            'validated_by' => auth()->id(),
            'validated_at' => now(),
        ]);

        Notification::kirim(
            $p->mahasiswa->user_id,
            "Prestasi \"{$p->nama_prestasi}\" " . $request->aksi,
            "Prestasi Anda telah {$request->aksi}" . ($request->catatan_admin ? ". Catatan: {$request->catatan_admin}" : '.'),
            $request->aksi === 'Disetujui' ? 'success' : 'error',
            '/mahasiswa/prestasi'
        );

        AuditLog::catat('Validasi', "Validasi prestasi {$p->nama_prestasi}: {$request->aksi}", [
            'terkait_nim' => $p->mahasiswa->nim, 'terkait_nama' => $p->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'message' => "Prestasi {$request->aksi}."]);
    }

    /** Validate organisasi */
    public function validateOrganisasi(Request $request, int $id): JsonResponse
    {
        $request->validate(['aksi' => 'required|in:Disetujui,Ditolak', 'catatan_admin' => 'nullable|string']);
        $o = Organisasi::with('mahasiswa.user')->findOrFail($id);
        $o->update(['status' => $request->aksi, 'catatan_admin' => $request->catatan_admin,
            'validated_by' => auth()->id(), 'validated_at' => now()]);
        Notification::kirim($o->mahasiswa->user_id, "Organisasi \"{$o->nama}\" {$request->aksi}",
            "Data organisasi Anda telah {$request->aksi}.", $request->aksi === 'Disetujui' ? 'success' : 'error', '/mahasiswa/organisasi');
        return response()->json(['success' => true, 'message' => "Organisasi {$request->aksi}."]);
    }

    /** Validate pelatihan */
    public function validatePelatihan(Request $request, int $id): JsonResponse
    {
        $request->validate(['aksi' => 'required|in:Disetujui,Ditolak', 'catatan_admin' => 'nullable|string']);
        $p = Pelatihan::with('mahasiswa.user')->findOrFail($id);
        $p->update(['status' => $request->aksi, 'catatan_admin' => $request->catatan_admin,
            'validated_by' => auth()->id(), 'validated_at' => now()]);
        Notification::kirim($p->mahasiswa->user_id, "Pelatihan \"{$p->nama}\" {$request->aksi}",
            "Data pelatihan Anda telah {$request->aksi}.", $request->aksi === 'Disetujui' ? 'success' : 'error', '/mahasiswa/pelatihan');
        return response()->json(['success' => true, 'message' => "Pelatihan {$request->aksi}."]);
    }

    /** List prestasi semua mahasiswa */
    public function indexPrestasi(Request $request): JsonResponse
    {
        $query = Prestasi::with('mahasiswa.prodi');
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);
        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        return response()->json([
            'success' => true, 'data' => $query->latest()->skip(($page-1)*$limit)->take($limit)->get(),
            'total' => $total, 'page' => $page, 'limit' => $limit, 'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    /** List organisasi semua mahasiswa */
    public function indexOrganisasi(Request $request): JsonResponse
    {
        $query = Organisasi::with('mahasiswa.prodi');
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);
        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        return response()->json([
            'success' => true, 'data' => $query->latest()->skip(($page-1)*$limit)->take($limit)->get(),
            'total' => $total, 'page' => $page, 'limit' => $limit, 'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    /** List pelatihan semua mahasiswa */
    public function indexPelatihan(Request $request): JsonResponse
    {
        $query = Pelatihan::with('mahasiswa.prodi');
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);
        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        return response()->json([
            'success' => true, 'data' => $query->latest()->skip(($page-1)*$limit)->take($limit)->get(),
            'total' => $total, 'page' => $page, 'limit' => $limit, 'total_pages' => (int) ceil($total/$limit),
        ]);
    }
}
