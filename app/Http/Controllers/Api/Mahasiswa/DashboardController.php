<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Konfigurasi;
use App\Models\DokumenJenis;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa()->with([
            'prodi', 'ipkSemestrs', 'suratPeringatans', 'dokumens', 'bebasTanggungan',
        ])->first();

        if (! $m) {
            return response()->json(['success' => false, 'message' => 'Data mahasiswa tidak ditemukan.'], 404);
        }

        $ipkList     = $m->ipkSemestrs->sortBy('semester')->values();
        $ipkTerakhir = (float) ($ipkList->last()?->ipk ?? 0);
        $ipkPrev     = $ipkList->count() > 1 ? (float) $ipkList->slice(-2, 1)->first()?->ipk : null;
        $spAktif     = $m->suratPeringatans->whereIn('status', ['Aktif', 'Masa Tenggang'])->sortByDesc('level')->first();
        $ipkMin      = (float) Konfigurasi::get('ipk_minimum', 3.0);
        $dokWajib    = DokumenJenis::where('is_wajib', true)->count();
        $dokDisetujui = $m->dokumens->where('status', 'Disetujui')->unique('dokumen_jenis_id')->count();

        return response()->json([
            'success'   => true,
            'mahasiswa' => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama,
                'angkatan' => $m->angkatan,
                'kategori' => $m->kategori,
                'status'   => $m->status,
            ],
            'akademik' => [
                'ipk_terakhir' => $ipkTerakhir,
                'ipk_delta'    => $ipkPrev !== null ? round($ipkTerakhir - $ipkPrev, 2) : null,
                'semester'     => $ipkList->count(),
                'ipk_minimum'  => $ipkMin,
                'status_ipk'   => $ipkTerakhir >= $ipkMin ? 'Aman' : 'Di Bawah Standar',
                'sp_aktif'     => $spAktif ? ['level' => $spAktif->level, 'status' => $spAktif->status] : null,
            ],
            'dokumen' => [
                'total_wajib'     => $dokWajib,
                'total_disetujui' => $dokDisetujui,
                'lengkap'         => $dokDisetujui >= $dokWajib,
            ],
            'bebas_tanggungan' => $m->bebasTanggungan ? ['status' => $m->bebasTanggungan->status] : null,
            'ipk_chart' => $ipkList->map(fn($s) => ['semester' => $s->semester, 'ipk' => (float) $s->ipk]),
        ]);
    }
}
