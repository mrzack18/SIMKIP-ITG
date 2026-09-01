<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Konfigurasi;
use App\Models\DokumenJenis;
use App\Helpers\TahunAjaranHelper;
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

        $tahunAjaran = $request->tahun_ajaran;
        $tahunAjaranLabel = $tahunAjaran && $tahunAjaran !== 'Semua' ? $tahunAjaran : null;

        // Filter IPK records up to the selected TA semester
        $ipkBase = $m->ipkSemestrs();
        if ($tahunAjaranLabel) {
            $semesterTujuan = TahunAjaranHelper::calculateSemester((int) $m->angkatan, $tahunAjaranLabel);
            $ipkBase = $m->ipkSemestrs()->where('semester', '<=', $semesterTujuan);
        }

        $ipkList     = $ipkBase->get()->sortBy('semester')->values();
        $ipkTerakhir = (float) ($ipkList->last()?->ipk ?? 0);
        $ipkPrev     = $ipkList->count() > 1 ? (float) $ipkList->slice(-2, 1)->first()?->ipk : null;
        $spAktif     = $m->suratPeringatans->whereIn('status', ['Aktif', 'Masa Tenggang'])->sortByDesc('level')->first();
        $ipkMin      = (float) Konfigurasi::get('ipk_minimum', 3.0);

        // Dokumen status (always show all mandatory docs, but the status reflects latest upload)
        $dokumenJenis = DokumenJenis::where('is_wajib', true)->get();
        $dokWajib     = $dokumenJenis->count();
        $dokDisetujui = $m->dokumens->where('status', 'Disetujui')->unique('dokumen_jenis_id')->count();

        $dokumenStatusList = $dokumenJenis->map(function ($jenis) use ($m) {
            $uploaded = $m->dokumens->where('dokumen_jenis_id', $jenis->id)->sortByDesc('created_at')->first();
            return [
                'id_jenis' => $jenis->id,
                'nama'     => $jenis->nama,
                'status'   => $uploaded ? $uploaded->status : 'Belum Diunggah',
                'pesan'    => $uploaded ? $uploaded->keterangan : null,
            ];
        })->values();

        $totalPrestasi   = $m->prestasis()->count();
        $totalOrganisasi = $m->organisasis()->count();
        $totalPelatihan  = $m->pelatihans()->count();

        $periodeAktif = Konfigurasi::get('periode_input_aktif', '0') === '1';
        $periodeTutup = Konfigurasi::get('periode_input_tutup');

        // Current semester: always based on all records (not filtered), TA filter only affects chart display
        $allIpk = $m->ipkSemestrs;
        $semesterAktif = $allIpk->count() > 0 ? $allIpk->max('semester') : 0;
        $currentSemester = $semesterAktif < 8 ? $semesterAktif + 1 : $semesterAktif;
        if ($currentSemester == 0) $currentSemester = 1;

        // Semester displayed in the chart (may be lower if TA filter is applied)
        $displayedSemester = $tahunAjaranLabel
            ? TahunAjaranHelper::calculateSemester((int) $m->angkatan, $tahunAjaranLabel)
            : $semesterAktif;

        return response()->json([
            'success'   => true,
            'tahun_ajaran_filter' => $tahunAjaranLabel,
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
                'semester'     => $displayedSemester,
                'ipk_minimum'  => $ipkMin,
                'status_ipk'   => $ipkTerakhir >= $ipkMin ? 'Aman' : 'Di Bawah Standar',
                'sp_aktif'     => $spAktif ? [
                    'level'     => $spAktif->level,
                    'status'   => $spAktif->status,
                    'deskripsi' => $spAktif->deskripsi,
                ] : null,
            ],
            'dokumen' => [
                'total_wajib'     => $dokWajib,
                'total_disetujui' => $dokDisetujui,
                'lengkap'         => $dokDisetujui >= $dokWajib,
                'list_status'     => $dokumenStatusList,
            ],
            'kegiatan' => [
                'prestasi'   => $totalPrestasi,
                'organisasi' => $totalOrganisasi,
                'pelatihan'  => $totalPelatihan,
            ],
            'periode' => [
                'aktif'       => $periodeAktif,
                'batas_waktu' => $periodeTutup,
            ],
            'bebas_tanggungan' => $m->bebasTanggungan ? ['status' => $m->bebasTanggungan->status] : null,
            'ipk_chart' => $ipkList->map(fn($s) => ['semester' => $s->semester, 'ipk' => (float) $s->ipk]),
        ]);
    }
}
