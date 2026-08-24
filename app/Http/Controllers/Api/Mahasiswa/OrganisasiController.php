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
        return response()->json(['success' => true, 'data' => $m->organisasis()->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama'           => 'required|string|max:255',
            'jabatan'        => 'required|string|max:255',
            'periode_mulai'  => 'required|date',
            'periode_selesai'=> 'required|date|after_or_equal:periode_mulai',
            'deskripsi'      => 'nullable|string',
            'file_sk'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $m      = $request->user()->mahasiswa;
        $fileSk = $request->hasFile('file_sk')
            ? $request->file('file_sk')->store("organisasi/{$m->nim}", 'public')
            : null;

        $o = Organisasi::create(array_merge($request->only(['nama','jabatan','periode_mulai','periode_selesai','deskripsi']), [
            'mahasiswa_id' => $m->id,
            'file_sk'      => $fileSk,
            'status'       => 'Menunggu',
        ]));

        return response()->json(['success' => true, 'data' => $o], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        $o->update($request->only(['nama','jabatan','periode_mulai','periode_selesai','deskripsi']));
        return response()->json(['success' => true, 'data' => $o]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        $o = Organisasi::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();
        $o->delete();
        return response()->json(['success' => true, 'message' => 'Organisasi dihapus.']);
    }
}
