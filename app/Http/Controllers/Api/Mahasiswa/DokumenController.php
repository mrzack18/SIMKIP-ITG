<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\DokumenJenis;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DokumenController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m    = $request->user()->mahasiswa;
        $data = $m->dokumens()->with('jenis')->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $data->map(fn($d) => [
                'id'             => $d->id,
                'jenis'          => $d->jenis->nama,
                'jenis_id'       => $d->dokumen_jenis_id,
                'nama_file'      => $d->nama_file,
                'status'         => $d->status,
                'catatan_admin'  => $d->catatan_admin,
                'tanggal_upload' => $d->created_at->format('d M Y'),
                'file_url'       => asset('storage/' . $d->path_file),
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'dokumen_jenis_id' => 'required|exists:dokumen_jenis,id',
            'file'             => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $m    = $request->user()->mahasiswa;
        $jenis = DokumenJenis::findOrFail($request->dokumen_jenis_id);

        $filePath = $request->file('file')->store("dokumen/{$m->nim}/{$jenis->nama}", 'public');
        $namaFile = $request->file('file')->getClientOriginalName();
        $ukuran   = $request->file('file')->getSize();

        $dok = Dokumen::create([
            'mahasiswa_id'     => $m->id,
            'dokumen_jenis_id' => $request->dokumen_jenis_id,
            'nama_file'        => $namaFile,
            'path_file'        => $filePath,
            'ukuran'           => $ukuran,
            'status'           => 'Menunggu',
        ]);

        // Notifikasi ke admin
        User::where('role', 'admin')->each(function ($admin) use ($m, $jenis) {
            Notification::kirim(
                $admin->id,
                "Dokumen Baru: {$jenis->nama}",
                "{$m->nama} ({$m->nim}) mengunggah dokumen {$jenis->nama}. Menunggu verifikasi.",
                'info',
                '/admin/dokumen'
            );
        });

        return response()->json(['success' => true, 'data' => $dok->load('jenis')], 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m   = $request->user()->mahasiswa;
        $dok = Dokumen::where('id', $id)->where('mahasiswa_id', $m->id)->firstOrFail();

        if ($dok->status !== 'Ditolak') {
            return response()->json(['success' => false, 'message' => 'Hanya dokumen yang ditolak dapat dihapus.'], 422);
        }

        \Illuminate\Support\Facades\Storage::disk('public')->delete($dok->path_file);
        $dok->delete();

        return response()->json(['success' => true, 'message' => 'Dokumen dihapus.']);
    }

    public function arsip(Request $request): JsonResponse
    {
        $m     = $request->user()->mahasiswa;
        $query = $m->dokumens()->with('jenis');

        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);
        if ($request->jenis) {
            $query->whereHas('jenis', fn($q) => $q->where('nama', $request->jenis));
        }

        return response()->json([
            'success' => true,
            'data'    => $query->latest()->get()->map(fn($d) => [
                'id'             => $d->id,
                'jenis'          => $d->jenis->nama,
                'nama_file'      => $d->nama_file,
                'status'         => $d->status,
                'tanggal_upload' => $d->created_at->format('d M Y'),
                'file_url'       => asset('storage/' . $d->path_file),
            ]),
        ]);
    }
}
