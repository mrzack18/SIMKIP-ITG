<?php

namespace App\Http\Controllers\Api\Warek;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Services\ExcelExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MahasiswaController extends Controller
{
    /**
     * WAREK-specific read-only listing of KIP-K mahasiswa across all prodi.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Mahasiswa::withDetails();

        if ($request->search) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $prodi = Prodi::where('nama', $request->prodi)->orWhere('kode', $request->prodi)->first();
            if ($prodi) $query->where('prodi_id', $prodi->id);
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $query->orderBy('nama');

        $limit = (int) ($request->limit ?? 8); // FE uses page size 8
        $page  = (int) ($request->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data'        => \App\Http\Resources\MahasiswaResource::collection($data),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'totalPages'  => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $m = Mahasiswa::withDetails()
            ->with(['user.contactHistories', 'suratPeringatans', 'ipkSemestrs.mataKuliahs'])
            ->findOrFail($id);

        // Hitung total semester (asumsi 8 semester untuk S1)
        $semesterNum = (int) ($m->semester_calc ?? 0);

        return response()->json([
            'data'       => new \App\Http\Resources\MahasiswaResource($m),
            'progress'   => [
                'semesterAktif' => $semesterNum,
                'totalSemester' => 8,
                'progressPct'   => $semesterNum > 0 ? round(($semesterNum / 8) * 100) : 0,
            ],
        ]);
    }

    public function filterOptions(Request $request): JsonResponse
    {
        $prodis = Prodi::select('id', 'nama', 'kode')
            ->where('is_aktif', true)
            ->orderBy('nama')
            ->get();

        $angkatans = Mahasiswa::select('angkatan')
            ->distinct()
            ->orderByDesc('angkatan')
            ->pluck('angkatan');

        return response()->json([
            'success'   => true,
            'prodis'    => $prodis,
            'angkatans' => $angkatans,
        ]);
    }

    /**
     * Export mahasiswa list to Excel (read-only, for warek).
     * Applies the same filters as the list endpoint.
     */
    public function export(Request $request): BinaryFileResponse|JsonResponse
    {
        $query = Mahasiswa::withDetails();

        if ($request->search) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $prodi = Prodi::where('nama', $request->prodi)->orWhere('kode', $request->prodi)->first();
            if ($prodi) $query->where('prodi_id', $prodi->id);
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $rows = $query->orderBy('nama')->get()->map(function ($m) {
            return [
                $m->nim,
                $m->nama,
                $m->prodi->nama ?? '-',
                $m->angkatan,
                $m->kategori,
                (float) ($m->ipk_calc ?? 0),
                (int) ($m->semester_calc ?? 0),
                $m->status,
                $m->sp_calc ?? '-',
            ];
        })->toArray();

        $headers = ['NIM', 'Nama', 'Program Studi', 'Angkatan', 'Kategori', 'IPK', 'Semester', 'Status', 'SP'];
        $filename = 'Mahasiswa_KIP-K_' . date('Ymd_His') . '.xlsx';

        return ExcelExportService::stream($filename, $headers, $rows);
    }
}