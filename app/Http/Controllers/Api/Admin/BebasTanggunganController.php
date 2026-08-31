<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\BebasTanggungan;
use App\Models\Notification;
use App\Services\BebasTanggunganService;
use App\Http\Resources\BebasTanggunganResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BebasTanggunganController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $baseQuery = BebasTanggungan::with([
            'mahasiswa.prodi',
            'mahasiswa.suratPeringatans' => fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']),
            'mahasiswa.ipkSemestrs',
            'mahasiswa.dokumens.jenis',
        ]);
        
        \App\Helpers\TahunAjaranHelper::applyDateRangeFilter($baseQuery, 'bebas_tanggungans.created_at', $request->tahun_ajaran);

        if ($request->status && $request->status !== 'Semua') {
            $statusMap = [
                'menunggu'    => ['Menunggu', 'Diproses'],
                'diterbitkan' => ['Disetujui'],
                'ditolak'     => ['Ditolak'],
            ];
            $dbStatus = $statusMap[$request->status] ?? [$request->status];
            $baseQuery->whereIn('status', $dbStatus);
        }

        if ($s = $request->search) {
            $baseQuery->whereHas('mahasiswa', fn($q) => $q->where('nim', 'like', "%$s%")->orWhere('nama', 'like', "%$s%"));
        }

        $limit = (int) ($request->limit ?? 10);
        $page  = (int) ($request->page ?? 1);
        $total = $baseQuery->count();
        $data  = $baseQuery->latest()->skip(($page - 1) * $limit)->take($limit)->get();

        // Per-status counts (always unfiltered by search/status to power the summary badge)
        $countMenunggu   = BebasTanggungan::whereIn('status', ['Menunggu', 'Diproses'])->count();
        $countDiterbitkan = BebasTanggungan::where('status', 'Disetujui')->count();
        $countDitolak    = BebasTanggungan::where('status', 'Ditolak')->count();

        return response()->json([
            'success'      => true,
            'data'         => BebasTanggunganResource::collection($data),
            'total'        => $total,
            'page'         => $page,
            'limit'        => $limit,
            'total_pages'  => (int) ceil($total / max(1, $limit)),
            'counts'       => [
                'menunggu'    => $countMenunggu,
                'diterbitkan' => $countDiterbitkan,
                'ditolak'     => $countDitolak,
            ],
        ]);
    }


    public function show(int $id): JsonResponse
    {
        $b = BebasTanggungan::with([
            'mahasiswa.prodi',
            'histories.reviewedBy',
        ])->findOrFail($id);

        $m        = $b->mahasiswa;
        $checklist = BebasTanggunganService::getChecklist($m);

        $rejectionHistory = $b->histories->map(fn($h) => [
            'tgl'    => $h->created_at->format('d M Y'),
            'catatan'=> $h->catatan,
            'oleh'   => $h->reviewedBy?->name ?? 'Sistem',
        ]);

        $statusMap = [
            'Menunggu'  => 'menunggu',
            'Diproses'  => 'menunggu',
            'Disetujui' => 'diterbitkan',
            'Ditolak'   => 'ditolak',
        ];

        return response()->json([
            'success'    => true,
            'permohonan' => [
                'id'            => $b->id,
                'status'        => $statusMap[$b->status] ?? 'menunggu',
                'tanggalAjukan' => $b->tanggal_ajukan?->format('d M Y'),
                'tanggalTerbit' => $b->tanggal_terbit?->format('d M Y'),
                'nomorSurat'    => $b->nomor_surat,
                'catatanAdmin'  => $b->catatan_admin,
            ],
            'mahasiswa'  => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama,
                'angkatan' => $m->angkatan,
                'semester' => $m->ipkSemestrs()->count(),
            ],
            'checklist'         => $checklist['checklist'],
            'dokumen'           => $checklist['dokumen'],
            'sksDitempuh'       => $checklist['sks_ditempuh'],
            'sksMinimum'        => $checklist['sks_minimum'],
            'ipkTerakhir'       => $checklist['ipk_terakhir'],
            'ipkMinimum'        => $checklist['ipk_minimum'],
            'canApply'          => $checklist['can_apply'],
            'rejectionHistory'  => $rejectionHistory,
        ]);
    }



    public function approve(Request $request, int $id): JsonResponse
    {
        $b = BebasTanggungan::with('mahasiswa.user')->findOrFail($id);

        if ($b->status === 'Disetujui' || $b->status === 'Ditolak') {
            return response()->json(['success' => false, 'message' => 'Permohonan sudah diproses.'], 422);
        }

        $nomor = 'SKPS/KIP-K/ITG/' . strtoupper(now()->format('m')) . '/' . now()->year . '/' . str_pad($id, 3, '0', STR_PAD_LEFT);

        $b->update([
            'status'        => 'Disetujui',
            'reviewed_by'   => auth()->id(),
            'reviewed_at'   => now(),
            'nomor_surat'   => $nomor,
            'tanggal_terbit'=> now()->toDateString(),
        ]);

        $b->mahasiswa->update(['status' => 'Lulus']);

        Notification::kirim(
            $b->mahasiswa->user_id,
            'Bebas Tanggungan Diterbitkan',
            "Surat Keterangan Penyelesaian Studi Anda telah diterbitkan. Nomor: {$nomor}",
            'success',
            '/mahasiswa/bebas-tanggungan'
        );

        AuditLog::catat('Approve', "Terbitkan bebas tanggungan {$b->mahasiswa->nama} ({$b->mahasiswa->nim})", [
            'terkait_nim' => $b->mahasiswa->nim, 'terkait_nama' => $b->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'nomor_surat' => $nomor]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['alasan' => 'required|string|min:10']);

        $b = BebasTanggungan::with('mahasiswa.user')->findOrFail($id);
        
        if ($b->status === 'Disetujui' || $b->status === 'Ditolak') {
            return response()->json(['success' => false, 'message' => 'Permohonan sudah diproses.'], 422);
        }
        
        \Illuminate\Support\Facades\DB::transaction(function () use ($b, $request) {
            $b->update([
                'status'       => 'Ditolak',
                'reviewed_by'  => auth()->id(),
                'reviewed_at'  => now(),
                'catatan_admin'=> $request->alasan,
            ]);

            $b->histories()->create([
                'status'      => 'Ditolak',
                'catatan'     => $request->alasan,
                'reviewed_by' => auth()->id(),
            ]);
        });

        Notification::kirim(
            $b->mahasiswa->user_id,
            'Bebas Tanggungan Ditolak',
            "Permohonan bebas tanggungan Anda ditolak. Alasan: {$request->alasan}",
            'error',
            '/mahasiswa/bebas-tanggungan'
        );

        return response()->json(['success' => true, 'message' => 'Permohonan ditolak.']);
    }

    public function downloadPdf(int $id)
    {
        $b = BebasTanggungan::findOrFail($id);
        if ($b->status !== 'Disetujui') {
            return response()->json(['success' => false, 'message' => 'Surat belum diterbitkan.'], 403);
        }
        return \App\Services\PdfGeneratorService::suratBebasTanggungan($id);
    }
}
