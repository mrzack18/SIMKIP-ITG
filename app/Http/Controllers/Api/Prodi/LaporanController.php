<?php
namespace App\Http\Controllers\Api\Prodi;
use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Http\Resources\LaporanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $prodiName = $request->user()->prodi?->nama;
        
        $query = Laporan::with(['dibuatOleh','latestReview.warek'])
            ->where('status', 'Disetujui') // Only approved laporans are visible to prodi
            ->where('tujuan_prodi', true)
            ->where(function($q) use ($prodiName) {
                // If specific prodi is set, match it. Otherwise it's 'semua prodi'.
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

        return response()->json(['success' => true, 'data' => new LaporanResource($l)]);
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
