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
        $m     = $request->user()->mahasiswa;
        $query = $m->pelatihans()->latest();
        if ($request->jenis && $request->jenis !== 'Semua') $query->where('jenis', $request->jenis);
        return response()->json(['success' => true, 'data' => $query->get()]);
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
        ]);

        $m       = $request->user()->mahasiswa;
        $fileSert = $request->hasFile('file_sertifikat')
            ? $request->file('file_sertifikat')->store("pelatihan/{$m->nim}", 'public')
            : null;

        $p = Pelatihan::create(array_merge($request->only([
            'nama', 'jenis', 'penyelenggara', 'tanggal_mulai', 'tanggal_selesai', 'tempat', 'deskripsi',
        ]), [
            'mahasiswa_id'    => $m->id,
            'file_sertifikat' => $fileSert,
            'status'          => 'Menunggu',
        ]));

        return response()->json(['success' => true, 'data' => $p], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        $p->update($request->only(['nama','jenis','penyelenggara','tanggal_mulai','tanggal_selesai','tempat','deskripsi']));
        return response()->json(['success' => true, 'data' => $p]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $p = Pelatihan::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        $p->delete();
        return response()->json(['success' => true, 'message' => 'Pelatihan dihapus.']);
    }
}
