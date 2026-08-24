<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');
        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('aktivitas','like',"%$s%")->orWhere('terkait_nim','like',"%$s%")->orWhere('terkait_nama','like',"%$s%"));
        }
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        if ($request->dari)  $query->whereDate('created_at', '>=', $request->dari);
        if ($request->sampai) $query->whereDate('created_at', '<=', $request->sampai);

        $limit = (int)($request->limit ?? 20);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->orderByDesc('created_at')->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success' => true,
            'data'    => $data->map(fn($a) => [
                'id'           => $a->id,
                'jenis'        => $a->jenis,
                'aktivitas'    => $a->aktivitas,
                'deskripsi'    => $a->deskripsi,
                'dilakukan_oleh'=> $a->user?->name ?? 'System',
                'terkait_nim'  => $a->terkait_nim,
                'terkait_nama' => $a->terkait_nama,
                'ip_address'   => $a->ip_address,
                'waktu'        => $a->created_at?->format('d M Y H:i'),
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }
}
