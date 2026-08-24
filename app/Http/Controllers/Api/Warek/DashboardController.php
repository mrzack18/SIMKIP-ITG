<?php

namespace App\Http\Controllers\Api\Warek;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Models\Mahasiswa;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalMahasiswa = Mahasiswa::where('status', 'Aktif')->count();
        $laporanMenunggu = Laporan::where('status', 'Diajukan')->count();
        $laporanDisetujui = Laporan::where('status', 'Disetujui')->count();

        $laporanTerbaru = Laporan::with('dibuatOleh')
            ->whereIn('status', ['Diajukan', 'Disetujui', 'Dikembalikan'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($l) => [
                'id'       => $l->id,
                'judul'    => $l->judul,
                'periode'  => $l->periode,
                'status'   => $l->status,
                'tanggal'  => $l->tanggal_laporan?->format('d M Y'),
            ]);

        return response()->json([
            'success' => true,
            'stats'   => [
                'total_mahasiswa'   => $totalMahasiswa,
                'laporan_menunggu'  => $laporanMenunggu,
                'laporan_disetujui' => $laporanDisetujui,
            ],
            'laporan_terbaru' => $laporanTerbaru,
        ]);
    }
}
