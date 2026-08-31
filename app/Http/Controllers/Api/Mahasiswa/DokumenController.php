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
        $m = $request->user()->mahasiswa;
        
        $jenis = DokumenJenis::with(['fields', 'dokumens' => function ($q) use ($m) {
            $q->where('mahasiswa_id', $m->id)->latest();
        }])->orderBy('urutan')->get();

        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\DokumenJenisResource::collection($jenis),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'dokumen_jenis_id' => 'required|exists:dokumen_jenis,id',
            'file'             => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'metadata'         => 'nullable|string',
        ]);

        $m = $request->user()->mahasiswa;
        $jenis = DokumenJenis::findOrFail($request->dokumen_jenis_id);

        $metadataArray = null;
        if ($request->metadata) {
            $metadataArray = json_decode($request->metadata, true);
            // Basic validation
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['success' => false, 'message' => 'Format metadata tidak valid.'], 422);
            }
        }

        $filePath = $request->file('file')->store("dokumen/{$m->nim}/{$jenis->nama}", 'public');
        $namaFile = $request->file('file')->getClientOriginalName();
        $ukuran   = $request->file('file')->getSize();

        // Check if previously rejected doc exists and delete it
        $existing = Dokumen::where('mahasiswa_id', $m->id)
            ->where('dokumen_jenis_id', $request->dokumen_jenis_id)
            ->first();
        
        if ($existing) {
            if ($existing->status === 'Ditolak') {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($existing->path_file);
                $existing->delete();
            } else {
                return response()->json(['success' => false, 'message' => 'Dokumen sudah diunggah.'], 422);
            }
        }

        $dok = Dokumen::create([
            'mahasiswa_id'     => $m->id,
            'dokumen_jenis_id' => $request->dokumen_jenis_id,
            'nama_file'        => $namaFile,
            'path_file'        => $filePath,
            'ukuran'           => $ukuran,
            'status'           => 'Menunggu',
            'metadata'         => $metadataArray,
        ]);

        if (is_array($metadataArray)) {
            foreach ($metadataArray as $fieldId => $value) {
                if (is_numeric($fieldId)) {
                    $dok->fieldValues()->create([
                        'dokumen_jenis_field_id' => $fieldId,
                        'value' => is_array($value) ? json_encode($value) : $value
                    ]);
                }
            }
        }

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

        return response()->json(['success' => true, 'data' => new \App\Http\Resources\DokumenResource($dok)], 201);
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
