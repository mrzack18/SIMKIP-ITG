<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\BebasTanggungan;
use App\Services\BebasTanggunganService;
use App\Http\Resources\BebasTanggunganResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BebasTanggunganController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $m          = $request->user()->mahasiswa;
        $permohonan = $m->bebasTanggungan;
        $checklist  = BebasTanggunganService::getChecklist($m);

        $status = 'belum';
        if ($permohonan) {
            $statusMap = [
                'Menunggu'  => 'menunggu',
                'Diproses'  => 'menunggu',
                'Disetujui' => 'diterbitkan',
                'Ditolak'   => 'ditolak',
            ];
            $status = $statusMap[$permohonan->status] ?? 'menunggu';
        }

        return response()->json([
            'success'    => true,
            'status'     => $status,
            'data'       => $permohonan ? new BebasTanggunganResource($permohonan) : [],
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

        return response()->json(['success' => true, 'data' => new BebasTanggunganResource($bt)], 201);
    }

    public function downloadPdf(Request $request)
    {
        $m = $request->user()->mahasiswa;
        $b = $m->bebasTanggungan;
        // Fix bug: DB uses Disetujui
        if (! $b || $b->status !== 'Disetujui') {
            return response()->json(['success' => false, 'message' => 'Surat belum diterbitkan atau tidak ditemukan.'], 403);
        }
        return \App\Services\PdfGeneratorService::suratBebasTanggungan($b->id);
    }
}
