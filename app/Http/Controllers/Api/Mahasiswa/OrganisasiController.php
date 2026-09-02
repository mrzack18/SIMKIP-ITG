<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganisasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $query = $m->organisasis();
        \App\Helpers\TahunAjaranHelper::applyOverlapFilter($query, 'organisasis.periode_mulai', 'organisasis.periode_selesai', $request->tahun_ajaran);

        $data = $query->latest()->get();
        return response()->json([
            'data' => \App\Http\Resources\OrganisasiResource::collection($data)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'jenis'          => 'required|in:Organisasi,Kepanitiaan,Kegiatan',
            'nama'           => 'required|string|max:255',
            'jabatan'        => 'required|string|max:255',
            'periode_mulai'  => 'required|date',
            'periode_selesai'=> 'required|date|after_or_equal:periode_mulai',
            'deskripsi'      => 'nullable|string',
            'file_sk'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'foto_kegiatan'  => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $m      = $request->user()->mahasiswa;
        $fileSk = $request->hasFile('file_sk')
            ? $request->file('file_sk')->store("uploads/organisasi/{$m->nim}/sk", 'public')
            : null;
        
        $fotoKegiatan = $request->hasFile('foto_kegiatan')
            ? $request->file('foto_kegiatan')->store("uploads/organisasi/{$m->nim}/foto", 'public')
            : null;

        $o = Organisasi::create(array_merge($request->only(['jenis','nama','jabatan','periode_mulai','periode_selesai','deskripsi']), [
            'mahasiswa_id'  => $m->id,
            'file_sk'       => $fileSk,
            'foto_kegiatan' => $fotoKegiatan,
            'status'        => 'Menunggu',
        ]));

        return response()->json(['data' => new \App\Http\Resources\OrganisasiResource($o)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        
        if ($o->status === 'Disetujui') {
            return response()->json(['message' => 'Organisasi yang sudah disetujui tidak dapat diedit.'], 403);
        }

        if ($request->hasFile('file_sk')) {
            if ($o->file_sk) \Illuminate\Support\Facades\Storage::disk('public')->delete($o->file_sk);
            $o->file_sk = $request->file('file_sk')->store("uploads/organisasi/{$m->nim}/sk", 'public');
        }

        if ($request->hasFile('foto_kegiatan')) {
            if ($o->foto_kegiatan) \Illuminate\Support\Facades\Storage::disk('public')->delete($o->foto_kegiatan);
            $o->foto_kegiatan = $request->file('foto_kegiatan')->store("uploads/organisasi/{$m->nim}/foto", 'public');
        }

        $o->update($request->only(['jenis','nama','jabatan','periode_mulai','periode_selesai','deskripsi']));
        return response()->json(['data' => new \App\Http\Resources\OrganisasiResource($o)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        
        if ($o->file_sk) \Illuminate\Support\Facades\Storage::disk('public')->delete($o->file_sk);
        if ($o->foto_kegiatan) \Illuminate\Support\Facades\Storage::disk('public')->delete($o->foto_kegiatan);
        
        $o->delete();
        return response()->json(['message' => 'Organisasi dihapus.']);
    }

    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = \App\Models\Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($o->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya organisasi berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $o->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Organisasi berhasil diajukan ulang.', 'data' => new \App\Http\Resources\OrganisasiResource($o)]);
    }
}
