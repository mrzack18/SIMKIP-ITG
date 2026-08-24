<?php

namespace App\Http\Controllers\Api\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $prodiId = $request->user()->prodi_id;

        $totalAktif = Mahasiswa::where('prodi_id', $prodiId)->where('status', 'Aktif')->count();
        $reguler    = Mahasiswa::where('prodi_id', $prodiId)->where('status', 'Aktif')->where('kategori', 'Reguler')->count();
        $aspirasi   = Mahasiswa::where('prodi_id', $prodiId)->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count();

        $spAktif = Mahasiswa::where('prodi_id', $prodiId)
            ->whereHas('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']))
            ->count();

        // Hitung mahasiswa dengan IPK terakhir < standar
        $ipkDibawah = 0;
        $allMhs = Mahasiswa::where('prodi_id', $prodiId)->where('status', 'Aktif')
            ->with(['ipkSemestrs' => fn($q) => $q->orderByDesc('semester')->limit(1)])->get();
        foreach ($allMhs as $m) {
            $ipkTerakhir = $m->ipkSemestrs->first()?->ipk ?? 0;
            if ((float) $ipkTerakhir < 3.0) $ipkDibawah++;
        }

        return response()->json([
            'success' => true,
            'stats'   => [
                'total_aktif'          => $totalAktif,
                'reguler'              => $reguler,
                'aspirasi'             => $aspirasi,
                'sp_aktif'             => $spAktif,
                'ipk_di_bawah_standar' => $ipkDibawah,
            ],
        ]);
    }
}
