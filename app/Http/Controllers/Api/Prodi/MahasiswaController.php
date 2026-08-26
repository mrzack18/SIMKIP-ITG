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
        $query   = Mahasiswa::with('prodi')->where('prodi_id', $prodiId);

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('nim', 'like', "%$s%")->orWhere('nama', 'like', "%$s%"));
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') $query->where('angkatan', $request->angkatan);
        if ($request->kategori && $request->kategori !== 'Semua') $query->where('kategori', $request->kategori);
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => $data->map(fn($m) => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama,
                'angkatan' => $m->angkatan,
                'kategori' => $m->kategori,
                'status'   => $m->status,
                'ipk'      => $m->ipk_terakhir,
                'semester' => $m->semester_aktif,
                'sp'       => $m->sp_aktif,
            ]),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total / $limit),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $prodiId = $request->user()->prodi_id;
        $m = Mahasiswa::where('prodi_id', $prodiId)
            ->with(['prodi', 'ipkSemestrs.mataKuliahs', 'dokumens.jenis', 'suratPeringatans', 'prestasis', 'organisasis', 'pelatihans'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $m]);
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
