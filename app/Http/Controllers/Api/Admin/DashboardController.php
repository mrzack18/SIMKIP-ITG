<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Dokumen;
use App\Models\SuratPeringatan;
use App\Models\BebasTanggungan;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalAktif = Mahasiswa::where('status', 'Aktif')->count();
        $reguler    = Mahasiswa::where('status', 'Aktif')->where('kategori', 'Reguler')->count();
        $aspirasi   = Mahasiswa::where('status', 'Aktif')->where('kategori', 'Aspirasi')->count();
        $dicabut    = Mahasiswa::where('status', 'Dicabut')->count();

        $dokumenMenunggu = Dokumen::where('status', 'Menunggu')->count();
        $bebasPending = BebasTanggungan::where('status', 'Menunggu')->count();

        $spAktif = SuratPeringatan::with(['mahasiswa.prodi'])
            ->whereIn('status', ['Aktif', 'Masa Tenggang'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($sp) => [
                'id'    => $sp->id,
                'nim'   => $sp->mahasiswa->nim,
                'nama'  => $sp->mahasiswa->nama,
                'prodi' => $sp->mahasiswa->prodi->nama ?? '-',
                'sp'    => $sp->level,
                'sisa'  => $sp->sisa_hari,
            ]);

        $dokumenQueue = Dokumen::with(['mahasiswa', 'jenis'])
            ->where('status', 'Menunggu')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($d) => [
                'id'             => $d->id,
                'nim'            => $d->mahasiswa->nim,
                'nama'           => $d->mahasiswa->nama,
                'jenis'          => $d->jenis->nama,
                'tanggal_upload' => $d->created_at->format('d M Y'),
                'status'         => $d->status,
            ]);

        // Advanced Stats & Charts
        $semesterLebih8 = Mahasiswa::where('status', 'Aktif')->has('ipkSemestrs', '>', 8)->count();
        $spSemesterIni = SuratPeringatan::where('created_at', '>=', now()->subMonths(6))->count();

        // Collections for Chart Data
        $prodis = Prodi::all();
        $mahasiswaSemua = Mahasiswa::select('id', 'prodi_id', 'angkatan', 'status', 'kategori')->get();
        $angkatans = $mahasiswaSemua->pluck('angkatan')->filter()->unique()->sort();

        // 1. Prodi Sebaran Data (for frontend naming)
        $prodiSebaranData = $prodis->map(function ($prodi) use ($mahasiswaSemua) {
            $mhs = $mahasiswaSemua->where('prodi_id', $prodi->id);
            return [
                'name' => $prodi->nama,
                'Reguler' => $mhs->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
                'Aspirasi' => $mhs->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
                'Dicabut' => $mhs->where('status', 'Dicabut')->count(),
            ];
        })->values();

        // 2. Angkatan Sebaran Data
        $angkatanSebaranData = $angkatans->map(function ($angkatan) use ($mahasiswaSemua) {
            $mhs = $mahasiswaSemua->where('angkatan', $angkatan);
            return [
                'name' => (string) $angkatan,
                'Reguler' => $mhs->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
                'Aspirasi' => $mhs->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
                'Dicabut' => $mhs->where('status', 'Dicabut')->count(),
            ];
        })->values();

        // 3. Sebaran per Prodi per Angkatan
        $sebaranPerProdiAngkatan = [
            'Semua' => $prodiSebaranData,
        ];
        foreach ($angkatans as $angkatan) {
            $sebaranPerProdiAngkatan[(string)$angkatan] = $prodis->map(function ($prodi) use ($mahasiswaSemua, $angkatan) {
                $mhs = $mahasiswaSemua->where('prodi_id', $prodi->id)->where('angkatan', $angkatan);
                return [
                    'name' => $prodi->nama,
                    'Reguler' => $mhs->where('status', 'Aktif')->where('kategori', 'Reguler')->count(),
                    'Aspirasi' => $mhs->where('status', 'Aktif')->where('kategori', 'Aspirasi')->count(),
                    'Dicabut' => $mhs->where('status', 'Dicabut')->count(),
                ];
            })->values();
        }

        return response()->json([
            'success' => true,
            'stats' => [
                'total_aktif'               => $totalAktif,
                'reguler'                   => $reguler,
                'aspirasi'                  => $aspirasi,
                'mahasiswa_dicabut'         => $dicabut,
                'dokumen_menunggu'          => $dokumenMenunggu,
                'bebas_tanggungan_pending'  => $bebasPending,
                'semester_lebih_8'          => $semesterLebih8,
                'sp_semester_ini'           => $spSemesterIni,
            ],
            'prodi_sebaran'              => $prodiSebaranData,
            'angkatan_sebaran'           => $angkatanSebaranData,
            'sebaran_per_prodi_angkatan' => $sebaranPerProdiAngkatan,
            'sp_aktif'                   => $spAktif,
            'dokumen_queue'              => $dokumenQueue,
        ]);
    }
}
