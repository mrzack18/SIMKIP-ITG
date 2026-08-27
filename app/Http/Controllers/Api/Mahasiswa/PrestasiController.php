<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Prestasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrestasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $data = $m->prestasis()->latest()->get();
        return response()->json([
            'data' => \App\Http\Resources\PrestasiResource::collection($data)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama_prestasi'     => 'required|string|max:255',
            'tingkat'           => 'required|in:Internasional,Nasional,Wilayah,Institusi',
            'pencapaian'        => 'required|string|max:255',
            'penyelenggara'     => 'required|string|max:255',
            'tanggal_mulai'     => 'required|date',
            'tanggal_selesai'   => 'required|date|after_or_equal:tanggal_mulai',
            'tempat'            => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'link_penyelenggara'=> 'nullable|url|max:500',
            'file_sertifikat'   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'file_foto'         => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $m = $request->user()->mahasiswa;

        $fileSert = $request->hasFile('file_sertifikat')
            ? $request->file('file_sertifikat')->store("uploads/prestasi/{$m->nim}/sertifikat", 'public')
            : null;

        $fileFoto = $request->hasFile('file_foto')
            ? $request->file('file_foto')->store("uploads/prestasi/{$m->nim}/foto", 'public')
            : null;

        $p = Prestasi::create(array_merge($request->only([
            'nama_prestasi', 'tingkat', 'pencapaian', 'penyelenggara',
            'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi', 'link_penyelenggara',
        ]), [
            'mahasiswa_id'   => $m->id,
            'file_sertifikat'=> $fileSert,
            'file_foto'      => $fileFoto,
            'status'         => 'Menunggu Validasi',
        ]));

        return response()->json(['data' => new \App\Http\Resources\PrestasiResource($p)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Prestasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($p->status === 'Disetujui') {
            return response()->json(['message' => 'Prestasi yang sudah disetujui tidak dapat diedit.'], 403);
        }

        // Add file update logic if necessary, or just basic fields for now
        if ($request->hasFile('file_sertifikat')) {
            if ($p->file_sertifikat) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_sertifikat);
            $p->file_sertifikat = $request->file('file_sertifikat')->store("uploads/prestasi/{$m->nim}/sertifikat", 'public');
        }

        if ($request->hasFile('file_foto')) {
            if ($p->file_foto) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_foto);
            $p->file_foto = $request->file('file_foto')->store("uploads/prestasi/{$m->nim}/foto", 'public');
        }

        $p->update($request->only([
            'nama_prestasi', 'tingkat', 'pencapaian', 'penyelenggara',
            'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi', 'link_penyelenggara',
        ]));

        return response()->json(['data' => new \App\Http\Resources\PrestasiResource($p)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Prestasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        
        if ($p->file_sertifikat) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_sertifikat);
        if ($p->file_foto) \Illuminate\Support\Facades\Storage::disk('public')->delete($p->file_foto);
        
        $p->delete();
        return response()->json(['message' => 'Prestasi dihapus.']);
    }
}
