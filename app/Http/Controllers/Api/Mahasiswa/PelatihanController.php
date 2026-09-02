<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pelatihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PelatihanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $query = $m->pelatihans()->latest();
        \App\Helpers\TahunAjaranHelper::applyOverlapFilter($query, 'pelatihans.tanggal_mulai', 'pelatihans.tanggal_selesai', $request->tahun_ajaran);
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        
        $data = $query->get();
        return response()->json([
            'data' => \App\Http\Resources\PelatihanResource::collection($data)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama'            => 'required|string|max:255',
            'jenis'           => 'required|in:Akademik,Non-Akademik',
            'penyelenggara'   => 'required|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'tempat'          => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'file_sertifikat' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'foto_kegiatan'   => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $m       = $request->user()->mahasiswa;
        $fileSert = $request->hasFile('file_sertifikat')
            ? $request->file('file_sertifikat')->store("uploads/pelatihan/{$m->nim}/sertifikat", 'public')
            : null;
            
        $fotoKegiatan = $request->hasFile('foto_kegiatan')
            ? $request->file('foto_kegiatan')->store("uploads/pelatihan/{$m->nim}/foto", 'public')
            : null;

        $p = Pelatihan::create(array_merge($request->only([
            'nama', 'jenis', 'penyelenggara', 'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi',
        ]), [
            'mahasiswa_id'    => $m->id,
            'file_sertifikat' => $fileSert,
            'foto_kegiatan'   => $fotoKegiatan,
            'status'          => 'Menunggu',
        ]));

        return response()->json(['data' => new \App\Http\Resources\PelatihanResource($p)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        
        if ($p->status === 'Disetujui') {
            return response()->json(['message' => 'Pelatihan yang sudah disetujui tidak dapat diedit.'], 403);
        }

        if ($request->hasFile('file_sertifikat')) {
            if ($p->file_sertifikat) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_sertifikat);
            $p->file_sertifikat = $request->file('file_sertifikat')->store("uploads/pelatihan/{$m->nim}/sertifikat", 'public');
        }

        if ($request->hasFile('foto_kegiatan')) {
            if ($p->foto_kegiatan) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->foto_kegiatan);
            $p->foto_kegiatan = $request->file('foto_kegiatan')->store("uploads/pelatihan/{$m->nim}/foto", 'public');
        }

        $p->update($request->only(['nama','jenis','penyelenggara','tanggal_mulai','tanggal_selesai','tempat','deskripsi']));
        return response()->json(['data' => new \App\Http\Resources\PelatihanResource($p)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        
        if ($p->file_sertifikat) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_sertifikat);
        if ($p->foto_kegiatan) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->foto_kegiatan);
        
        $p->delete();
        return response()->json(['message' => 'Pelatihan dihapus.']);
    }

    public function resubmit(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = \App\Models\Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($p->status !== 'Ditolak') {
            return response()->json(['message' => 'Hanya pelatihan berstatus Ditolak yang dapat diajukan ulang.'], 422);
        }

        $p->update([
            'status'         => 'Menunggu',
            'catatan_admin'  => null,
            'validated_by'   => null,
            'validated_at'   => null,
        ]);

        return response()->json(['message' => 'Pelatihan berhasil diajukan ulang.', 'data' => new \App\Http\Resources\PelatihanResource($p)]);
    }
}
