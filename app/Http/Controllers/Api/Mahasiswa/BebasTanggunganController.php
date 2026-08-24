<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\BebasTanggungan;
use App\Services\BebasTanggunganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BebasTanggunganController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $m          = $request->user()->mahasiswa;
        $permohonan = $m->bebasTanggungan;
        $checklist  = BebasTanggunganService::getChecklist($m);

        return response()->json([
            'success'    => true,
            'status'     => $permohonan?->status,
            'permohonan' => $permohonan ? [
                'id'             => $permohonan->id,
                'tanggal_ajukan' => $permohonan->tanggal_ajukan?->format('d M Y'),
                'catatan_admin'  => $permohonan->catatan_admin,
                'nomor_surat'    => $permohonan->nomor_surat,
                'tanggal_terbit' => $permohonan->tanggal_terbit?->format('d M Y'),
            ] : null,
            'checklist'  => $checklist['checklist'],
            'dokumen'    => $checklist['dokumen'],
            'can_apply'  => $checklist['can_apply'] && $permohonan === null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;

        if ($m->bebasTanggungan) {
            return response()->json(['success' => false, 'message' => 'Anda sudah mengajukan permohonan bebas tanggungan.'], 422);
        }

        $checklist = BebasTanggunganService::getChecklist($m);
        if (! $checklist['can_apply']) {
            return response()->json([
                'success' => false,
                'message' => 'Syarat bebas tanggungan belum terpenuhi.',
                'checklist' => $checklist['checklist'],
            ], 422);
        }

        $bt = BebasTanggungan::create([
            'mahasiswa_id'   => $m->id,
            'tanggal_ajukan' => now()->toDateString(),
            'status'         => 'Menunggu',
        ]);

        return response()->json(['success' => true, 'data' => $bt], 201);
    }
}
