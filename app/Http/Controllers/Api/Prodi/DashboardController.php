<?php

namespace App\Http\Controllers\Api\Prodi;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\SuratPeringatan;
use App\Models\IpkSemestr;
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
        $totalIpk   = 0.0;
        $countIpk   = 0;
        $allMhs = Mahasiswa::where('prodi_id', $prodiId)->where('status', 'Aktif')
            ->with(['ipkSemestrs' => fn($q) => $q->orderByDesc('semester')->limit(1)])->get();
        foreach ($allMhs as $m) {
            $ipkTerakhir = $m->ipkSemestrs->first()?->ipk;
            if ($ipkTerakhir !== null) {
                $totalIpk += (float) $ipkTerakhir;
                $countIpk++;
                if ((float) $ipkTerakhir < 3.0) $ipkDibawah++;
            }
        }
        $rataIpk = $countIpk > 0 ? round($totalIpk / $countIpk, 2) : 0.0;

        // ============ Chart Data ============

        // 1. Sebaran per Angkatan (stacked bar: Reguler / Aspirasi / Dicabut)
        $angkatans = Mahasiswa::where('prodi_id', $prodiId)
            ->select('angkatan')->distinct()->orderByDesc('angkatan')->pluck('angkatan');

        $sebaranAngkatan = $angkatans->map(function ($angkatan) use ($prodiId) {
            $reg  = Mahasiswa::where('prodi_id', $prodiId)
                ->where('status', 'Aktif')->where('kategori', 'Reguler')
                ->where('angkatan', $angkatan)->count();
            $asp  = Mahasiswa::where('prodi_id', $prodiId)
                ->where('status', 'Aktif')->where('kategori', 'Aspirasi')
                ->where('angkatan', $angkatan)->count();
            $cab  = Mahasiswa::where('prodi_id', $prodiId)
                ->where('status', 'Dicabut')->where('angkatan', $angkatan)->count();
            return [
                'name'      => (string) $angkatan,
                'Reguler'   => $reg,
                'Aspirasi'  => $asp,
                'Dicabut'   => $cab,
            ];
        })->values();

        // 2. Tren Rata-rata IPK per Semester (rata-rata ipk semua mhs aktif per semester)
        $trendIpk = [];
        $maxSem = (int) IpkSemestr::whereHas('mahasiswa', fn($q) =>
            $q->where('prodi_id', $prodiId)->where('status', 'Aktif'))
            ->max('semester');

        for ($s = 1; $s <= max(1, $maxSem); $s++) {
            $rows = IpkSemestr::whereHas('mahasiswa', fn($q) =>
                $q->where('prodi_id', $prodiId)->where('status', 'Aktif'))
                ->where('semester', $s)->get();
            if ($rows->count() > 0) {
                $trendIpk[] = [
                    'sem' => "Sem {$s}",
                    'ipk' => round((float) $rows->avg('ipk'), 2),
                ];
            }
        }

        // 3. Mahasiswa dengan SP Aktif (top 5)
        $spMahasiswa = SuratPeringatan::with(['mahasiswa'])
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->whereHas('mahasiswa', fn($q) => $q->where('prodi_id', $prodiId))
            ->latest('tanggal_terbit')->take(5)->get()
            ->map(fn($sp) => [
                'id'     => $sp->mahasiswa_id,
                'nim'    => $sp->mahasiswa->nim,
                'nama'   => $sp->mahasiswa->nama,
                'sp'     => $sp->level,
                'alasan' => $sp->deskripsi,
                'sisa'   => $sp->sisa_hari,
            ]);

        // 4. Mahasiswa Semester ≥ 7 (semester dihitung dari jumlah ipkSemestrs)
        $semester7plus = Mahasiswa::where('prodi_id', $prodiId)
            ->where('status', 'Aktif')
            ->withCount(['ipkSemestrs as semester_calc'])
            ->with(['ipkSemestrs' => fn($q) => $q->orderByDesc('semester')->limit(1)])
            ->having('semester_calc', '>=', 7)
            ->orderByDesc('semester_calc')
            ->take(5)
            ->get()
            ->map(fn($m) => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'sem'      => (int) $m->semester_calc,
                'ipk'      => (float) ($m->ipkSemestrs->first()?->ipk ?? 0),
            ]);

        return response()->json([
            'success'   => true,
            'stats'     => [
                'total_aktif'          => $totalAktif,
                'reguler'              => $reguler,
                'aspirasi'             => $aspirasi,
                'sp_aktif'             => $spAktif,
                'ipk_di_bawah_standar' => $ipkDibawah,
                'rata_ipk'             => $rataIpk,
            ],
            'prodi' => [
                'id'   => $prodiId,
                'nama' => $request->user()->prodi?->nama,
            ],
            'sebaran_angkatan' => $sebaranAngkatan,
            'trend_ipk'        => $trendIpk,
            'sp_mahasiswa'     => $spMahasiswa,
            'semester_7plus'   => $semester7plus,
        ]);
    }
}