<?php

namespace App\Http\Controllers\Api\Warek;

use App\Http\Controllers\Controller;
use App\Http\Resources\LaporanResource;
use App\Models\AuditLog;
use App\Models\Laporan;
use App\Models\LaporanReview;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Laporan::with(['dibuatOleh', 'latestReview.warek'])
            ->whereIn('status', ['Diajukan', 'Disetujui', 'Dikembalikan']);

        if ($s = $request->search) {
            $query->where(fn($q) => $q->where('judul', 'like', "%$s%")->orWhere('nomor_surat', 'like', "%$s%"));
        }
        if ($request->status && $request->status !== 'Semua') {
            // Map FE-facing status to BE status
            $beStatus = match ($request->status) {
                'Menunggu'    => 'Diajukan',
                'Disetujui'   => 'Disetujui',
                'Dikembalikan'=> 'Dikembalikan',
                default       => $request->status,
            };
            $query->where('status', $beStatus);
        }

        if ($request->tahun_ajaran && $request->tahun_ajaran !== 'Semua') {
            $ta = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $request->tahun_ajaran);
            if (preg_match('/^(\d{4})\/(\d{4})\s+(Ganjil|Genap)$/', $ta, $matches)) {
                $query->where('tahun_akademik', $matches[1] . '/' . $matches[2])
                      ->where('semester', $matches[3]);
            }
        }

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page - 1) * $limit)->take($limit)->get();

        // Map data with FE-facing labels & summary
        $items = $data->map(function ($l) {
            $resource = (new LaporanResource($l))->resolve();
            $stats = \App\Http\Controllers\Api\Warek\DashboardController::quickStatisticsFor($l);
            return array_merge($resource, [
                'status'      => $this->mapStatusForFE($l->status),
                'summary'     => $this->buildSummary($stats),
                'periode'     => $l->periode,
                'tanggal'     => $l->tanggal_laporan?->format('d F Y'),
                'approvedDate'=> $l->latestReview?->reviewed_at?->format('d F Y'),
            ]);
        });

        return response()->json([
            'success'      => true,
            'data'         => $items,
            'total'        => $total,
            'page'         => $page,
            'limit'        => $limit,
            'total_pages'  => (int) ceil($total / $limit),
            'totalPages'   => (int) ceil($total / $limit),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $l = Laporan::with(['dibuatOleh', 'reviews.warek'])->findOrFail($id);

        // Compute statistics (reuses dashboard logic)
        $stats = \App\Http\Controllers\Api\Warek\DashboardController::quickStatisticsFor($l);

        $resource = (new LaporanResource($l))->resolve();
        $resource['status'] = $this->mapStatusForFE($l->status);
        $resource['tanggal'] = $l->tanggal_laporan?->format('d F Y');
        $resource['periode'] = $l->periode;
        $resource['approvedDate'] = $l->latestReview?->reviewed_at?->format('d F Y');

        return response()->json([
            'success'    => true,
            'data'       => $resource,
            'statistics' => $stats,
        ]);
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $l = Laporan::findOrFail($id);

        if ($l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dalam status Diajukan.'], 422);
        }

        $l->update(['status' => 'Disetujui']);

        LaporanReview::create([
            'laporan_id'  => $l->id,
            'warek_id'    => auth()->id(),
            'aksi'        => 'Disetujui',
            'reviewed_at' => now(),
        ]);

        // Notifikasi ke admin
        User::where('role', 'admin')->each(function ($u) use ($l) {
            Notification::kirim(
                $u->id,
                "Laporan Disetujui",
                "Laporan \"{$l->judul}\" telah disetujui oleh Warek.",
                'success',
                '/admin/laporan/' . $l->id
            );
        });

        AuditLog::catat('Approve', "Warek setujui laporan: {$l->judul}");

        return response()->json(['success' => true, 'status' => $this->mapStatusForFE($l->status)]);
    }

    public function returnLaporan(Request $request, int $id): JsonResponse
    {
        $request->validate(['catatan' => 'required|string|min:10']);

        $l = Laporan::findOrFail($id);

        if ($l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan tidak dalam status Diajukan.'], 422);
        }

        $l->update(['status' => 'Dikembalikan', 'submitted_at' => null]);

        LaporanReview::create([
            'laporan_id'  => $l->id,
            'warek_id'    => auth()->id(),
            'aksi'        => 'Dikembalikan',
            'catatan'     => $request->catatan,
            'reviewed_at' => now(),
        ]);

        User::where('role', 'admin')->each(function ($u) use ($l, $request) {
            Notification::kirim(
                $u->id,
                "Laporan Dikembalikan",
                "Laporan \"{$l->judul}\" dikembalikan oleh Warek. Catatan: {$request->catatan}",
                'warning',
                '/admin/laporan/' . $l->id
            );
        });

        AuditLog::catat('Laporan', "Warek kembalikan laporan: {$l->judul}");

        return response()->json(['success' => true, 'status' => $this->mapStatusForFE($l->status)]);
    }

    public function downloadPdf(int $id)
    {
        $l = Laporan::findOrFail($id);
        if ($l->status !== 'Disetujui' && $l->status !== 'Diajukan') {
            return response()->json(['success' => false, 'message' => 'Laporan belum diajukan.'], 403);
        }
        return \App\Services\PdfGeneratorService::laporanKipK($id);
    }

    /**
     * Map backend status to FE-facing label.
     * "Diajukan" → "Menunggu" (because FE tabs use "Menunggu").
     */
    private function mapStatusForFE(string $status): string
    {
        return match ($status) {
            'Diajukan'     => 'Menunggu',
            'Disetujui'    => 'Disetujui',
            'Dikembalikan' => 'Dikembalikan',
            'Ditolak'      => 'Ditolak',
            'Draft'        => 'Draft',
            default        => $status,
        };
    }

    private function buildSummary(array $stats): string
    {
        $totalMhs = $stats['totalMahasiswa'];
        $avgIpk   = $stats['rataIpk'];
        $spAktif  = $stats['spAktif'];

        $parts = [];
        $parts[] = "{$totalMhs} mahasiswa";
        if ($avgIpk !== null) {
            $parts[] = 'rata-rata IPK ' . number_format($avgIpk, 2);
        }
        $parts[] = "{$spAktif} SP aktif";

        return implode(', ', $parts);
    }
}