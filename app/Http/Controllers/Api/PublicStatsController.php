<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        $angkatan = Mahasiswa::query()
            ->whereNotNull('angkatan')
            ->selectRaw('MIN(angkatan) AS minimum, MAX(angkatan) AS maximum')
            ->first();

        return response()->json([
            'success' => true,
            'stats' => [
                'mahasiswa_aktif' => Mahasiswa::where('status', 'Aktif')->count(),
                'dokumen_tervalidasi' => Dokumen::where('status', 'Disetujui')->count(),
                'program_studi' => Prodi::where('is_aktif', true)->count(),
                'angkatan' => $angkatan?->minimum !== null
                    ? $angkatan->minimum.'–'.$angkatan->maximum
                    : null,
            ],
        ]);
    }
}
