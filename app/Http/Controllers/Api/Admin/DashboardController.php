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

        $dokumenMenunggu = Dokumen::where('status', 'Menunggu')->count();

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

        $bebasPending = BebasTanggungan::where('status', 'Menunggu')->count();

        $prodiSebaran = Prodi::withCount([
            'mahasiswas as reguler' => fn($q) => $q->where('kategori', 'Reguler')->where('status', 'Aktif'),
            'mahasiswas as aspirasi' => fn($q) => $q->where('kategori', 'Aspirasi')->where('status', 'Aktif'),
        ])->get()->map(fn($p) => [
            'prodi'   => $p->nama,
            'reguler' => $p->reguler,
            'aspirasi' => $p->aspirasi,
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

        return response()->json([
            'success' => true,
            'stats' => [
                'total_aktif'               => $totalAktif,
                'reguler'                   => $reguler,
                'aspirasi'                  => $aspirasi,
                'dokumen_menunggu'          => $dokumenMenunggu,
                'bebas_tanggungan_pending'  => $bebasPending,
            ],
            'prodi_sebaran'  => $prodiSebaran,
            'sp_aktif'       => $spAktif,
            'dokumen_queue'  => $dokumenQueue,
        ]);
    }
}
