<?php

namespace App\Http\Controllers\Api\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MahasiswaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $prodiId = $request->user()->prodi_id;
        $query   = Mahasiswa::withDetails()->where('prodi_id', $prodiId);

        if ($request->search) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua Status') {
            $query->where('status', $request->status);
        }
        if ($request->kipFilter && $request->kipFilter !== 'Semua') {
            $kategori = $request->kipFilter === 'KIP-K Reguler' ? 'Reguler' : 'Aspirasi';
            $query->where('kategori', $kategori);
        }

        // Apply SP Filter
        if ($request->spFilter && $request->spFilter !== 'Semua') {
            if ($request->spFilter === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn($q) => $q->where('level', $request->spFilter)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }

        // IPK Filter
        if ($request->ipkFilter && $request->ipkFilter !== 'Semua') {
            if ($request->ipkFilter === 'Di Bawah Standar (< 3.0)') {
                $query->having('ipk_calc', '<', 3.0);
            } else if ($request->ipkFilter === 'Di Atas Standar (≥ 3.0)') {
                $query->having('ipk_calc', '>=', 3.0);
            }
        }

        // Sorting
        if ($request->sortBy) {
            switch ($request->sortBy) {
                case 'IPK Tertinggi → Terendah':
                    $query->orderByDesc('ipk_calc');
                    break;
                case 'IPK Terendah → Tertinggi':
                    $query->orderBy('ipk_calc');
                    break;
                case 'Nama A–Z':
                    $query->orderBy('nama');
                    break;
                case 'Angkatan Terbaru':
                    $query->orderByDesc('angkatan');
                    break;
                default:
                    $query->orderByDesc('ipk_calc');
                    break;
            }
        } else {
            $query->orderByDesc('ipk_calc');
        }

        $limit = (int) ($request->limit ?? 10);
        $page  = (int) ($request->page ?? 1);
        
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data'        => \App\Http\Resources\MahasiswaResource::collection($data),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'totalPages'  => (int) ceil($total / $limit),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $prodiId = $request->user()->prodi_id;
        $m = Mahasiswa::withDetails()
            ->where('prodi_id', $prodiId)
            ->findOrFail($id);

        return response()->json(['data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }

    public function ekspor(Request $request): JsonResponse
    {
        $prodiId = $request->user()->prodi_id;
        $query   = Mahasiswa::with(['prodi', 'ipkSemestrs', 'dokumens.jenis', 'suratPeringatans'])
            ->where('prodi_id', $prodiId);

        if ($request->angkatan && $request->angkatan !== 'Semua') $query->where('angkatan', $request->angkatan);
        if ($request->kategori && $request->kategori !== 'Semua') $query->where('kategori', $request->kategori);
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $data = $query->get()->map(fn($m) => [
            'nim'       => $m->nim,
            'nama'      => $m->nama,
            'angkatan'  => $m->angkatan,
            'kategori'  => $m->kategori,
            'status'    => $m->status,
            'ipk'       => $m->ipk_terakhir,
            'semester'  => $m->semester_aktif,
            'sp'        => $m->sp_aktif ?? '-',
            'ipk_per_semester' => $m->ipkSemestrs->map(fn($s) => ['sem' => $s->semester, 'ipk' => (float)$s->ipk]),
        ]);

        return response()->json(['success' => true, 'data' => $data, 'total' => $data->count()]);
    }

    public function exportDownload(Request $request)
    {
        $prodiId = $request->user()->prodi_id;
        
        $filters = [
            'angkatan' => $request->angkatan,
            'kategori' => $request->kategori,
            'tahun_akademik' => $request->tahun_akademik,
            'semester' => $request->semester,
            'sertakan_ipk' => filter_var($request->sertakan_ipk, FILTER_VALIDATE_BOOLEAN),
            'sertakan_dokumen' => filter_var($request->sertakan_dokumen, FILTER_VALIDATE_BOOLEAN),
            'sertakan_sp' => filter_var($request->sertakan_sp, FILTER_VALIDATE_BOOLEAN),
            'format' => $request->format ?? 'xlsx',
        ];

        return \App\Services\ExcelExportService::exportMahasiswaProdi($prodiId, $filters);
    }
}
