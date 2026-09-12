<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Helpers\AturanAkademik;
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
            'prodi', 'ipkSemestrs'
        ])->first();

        if (! $m) {
            return response()->json(['success' => false, 'message' => 'Data mahasiswa tidak ditemukan.'], 404);
        }

        $tahunAjaran = $request->tahun_ajaran;
        $tahunAjaranLabel = $tahunAjaran && $tahunAjaran !== 'Semua' ? $tahunAjaran : null;
        
        $range = TahunAjaranHelper::getDateRange($tahunAjaranLabel);
        $endDate = $range ? $range[1] : null;

        // Filter IPK records up to the selected TA semester
        $ipkBase = $m->ipkSemestrs();
        if ($tahunAjaranLabel) {
            $semesterTujuan = TahunAjaranHelper::calculateSemester((int) $m->angkatan, $tahunAjaranLabel);
            $ipkBase = $m->ipkSemestrs()->where('semester', '<=', $semesterTujuan);
        }

        $ipkList     = $ipkBase->get()->sortBy('semester')->values();
        $ipkTerakhir = (float) ($ipkList->last()?->ipk ?? 0);
        $ipkPrev     = $ipkList->count() > 1 ? (float) $ipkList->slice(-2, 1)->first()?->ipk : null;
        
        // 1. Surat Peringatan Time Travel
        $spQuery = $m->suratPeringatans()->whereIn('status', ['Aktif', 'Masa Tenggang']);
        if ($endDate) {
            $spQuery->where('tanggal_terbit', '<=', $endDate);
        }
        $spAktif = $spQuery->orderByDesc('level')->first();
        
        // Null = ambang IPK sedang dinonaktifkan di tab Regulasi.
        $ipkMin      = AturanAkademik::angkaJikaAktif('ipk_minimum');
        $maxSemester = AturanAkademik::bilanganJikaAktif('max_semester');

        // 2. Dokumen status Time Travel
        $dokumenJenis = DokumenJenis::where('is_wajib', true)->get();
        $dokWajib     = $dokumenJenis->count();
        
        $dokumenQuery = $m->dokumens();
        if ($endDate) {
            $dokumenQuery->where('created_at', '<=', $endDate);
        }
        $dokumensFiltered = $dokumenQuery->get();
        
        $dokDisetujui = $dokumensFiltered->where('status', 'Disetujui')->unique('dokumen_jenis_id')->count();

        $dokumenStatusList = $dokumenJenis->map(function ($jenis) use ($dokumensFiltered) {
            $uploaded = $dokumensFiltered->where('dokumen_jenis_id', $jenis->id)->sortByDesc('created_at')->first();
            return [
                'id_jenis' => $jenis->id,
                'nama'     => $jenis->nama,
                'status'   => $uploaded ? $uploaded->status : 'Belum Diunggah',
                'pesan'    => $uploaded ? ($uploaded->catatan_admin ?? $uploaded->keterangan) : null,
            ];
        })->values();

        // 3. Kegiatan Time Travel
        $prestasiQuery = $m->prestasis();
        $organisasiQuery = $m->organisasis();
        $pelatihanQuery = $m->pelatihans();
        
        if ($endDate) {
            $prestasiQuery->where('tanggal_mulai', '<=', $endDate);
            $organisasiQuery->where('periode_mulai', '<=', $endDate);
            $pelatihanQuery->where('tanggal_mulai', '<=', $endDate);
        }
        
        $totalPrestasi   = $prestasiQuery->count();
        $totalOrganisasi = $organisasiQuery->count();
        $totalPelatihan  = $pelatihanQuery->count();

        // Periode input dari tabel periode_akademiks. Dashboard ini tidak terikat
        // satu tahun ajaran tertentu, jadi "aktif" berarti ADA periode yang sedang
        // dibuka, dan batas waktunya diambil yang paling longgar (terakhir) supaya
        // tidak menyesatkan saat ada beberapa TA yang dibuka bersamaan.
        $periodesAktif = \App\Helpers\PeriodeInputHelper::semuaAktif();
        $periodeAktif  = $periodesAktif->isNotEmpty();
        $periodeTutup  = $periodesAktif->max(fn ($p) => $p->tanggal_tutup);

        // Current semester: always based on all records (not filtered), TA filter only affects chart display
        $allIpk = $m->ipkSemestrs;
        $semesterAktif = $allIpk->count() > 0 ? $allIpk->max('semester') : 0;
        // Catatan: dulu ada $currentSemester yang dihitung di sini dengan angka 8
        // hardcode, tapi tidak pernah dipakai siapa pun — respons mengirim
        // $displayedSemester di bawah. Dihapus, bukan diperbaiki.

        // Semester displayed in the chart (may be lower if TA filter is applied)
        $displayedSemester = $tahunAjaranLabel
            ? TahunAjaranHelper::calculateSemester((int) $m->angkatan, $tahunAjaranLabel)
            : $semesterAktif;

        // 4. Bebas Tanggungan Time Travel
        $bebasTanggunganQuery = $m->bebasTanggungan();
        if ($endDate) {
            $bebasTanggunganQuery->where('tanggal_ajukan', '<=', $endDate);
        }
        $bebasTanggungan = $bebasTanggunganQuery->first();

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
                // null saat aturan IPK Minimum dinonaktifkan — frontend memakai
                // ini sebagai syarat menggambar garis ambang di grafik, dan
                // Recharts dengan y={null} perilakunya tidak terdefinisi.
                'ipk_minimum'  => $ipkMin,
                'ipk_minimum_aktif' => $ipkMin !== null,
                // Jangan kirim null: tipenya string di dashboardService.ts.
                'status_ipk'   => $ipkMin === null
                    ? 'Tidak Dinilai'
                    : ($ipkTerakhir >= $ipkMin ? 'Aman' : 'Di Bawah Standar'),
                // Dipakai grafik sebagai penyebut "semester X dari N".
                'max_semester' => $maxSemester,
                'sp_aktif'     => $spAktif ? [
                    'level'     => $spAktif->level,
                    'status'   => $spAktif->status,
                    'deskripsi' => $spAktif->deskripsi,
                ] : null,
            ],
            // Peringatan bersifat INFORMATIF saja — tidak ada alur yang diblokir
            // karenanya. Satu array supaya frontend cukup satu loop dan kalimatnya
            // disusun di satu tempat.
            'peringatan' => $this->susunPeringatan($m, $maxSemester, $spAktif),
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
                'batas_waktu' => $periodeTutup?->format('Y-m-d'),
                // Daftar TA yang periodenya sedang dibuka — bisa lebih dari satu.
                'periodes_aktif' => $periodesAktif->map(fn ($p) => [
                    'tahun_ajaran' => "{$p->tahun_akademik} {$p->semester}",
                    'buka'         => $p->tanggal_buka?->format('Y-m-d'),
                    'tutup'        => $p->tanggal_tutup?->format('Y-m-d'),
                ])->values(),
            ],
            'bebas_tanggungan' => $bebasTanggungan ? ['status' => $bebasTanggungan->status] : null,
            'ipk_chart' => $ipkList->map(fn($s) => ['semester' => $s->semester, 'ipk' => (float) $s->ipk]),
        ]);
    }

    /**
     * Peringatan informatif untuk dashboard mahasiswa.
     *
     * Semuanya NON-BLOCKING: tidak satu pun menghalangi mahasiswa mengajukan
     * atau mengunggah apa pun. Aturan yang dinonaktifkan tidak menghasilkan
     * peringatan sama sekali — ambangnya null, bukan dibandingkan dengan nilai bawaan.
     *
     * @return array<int, array{kode: string, level: string, judul: string, pesan: string}>
     */
    private function susunPeringatan($m, ?int $maxSemester, $spAktif): array
    {
        $peringatan = [];

        // Batas Semester Studi — semester berjalan melewati ambang.
        if ($maxSemester !== null) {
            $semesterBerjalan = $m->semester_aktif;
            if ($semesterBerjalan > $maxSemester) {
                $peringatan[] = [
                    'kode'  => 'max_semester',
                    'level' => 'peringatan',
                    'judul' => 'Melewati batas semester studi',
                    'pesan' => "Semester berjalan Anda yang ke-{$semesterBerjalan} sudah melewati batas "
                        . "{$maxSemester} semester untuk penerima KIP-K. Segera konsultasikan dengan pengelola.",
                ];
            }
        }

        // Masa Tenggang SP — batas evaluasi terlewat. `sisa_hari` tidak bisa
        // dipakai di sini karena ia menjepit nilai negatif ke 0.
        if ($spAktif && $spAktif->lewat_batas) {
            $peringatan[] = [
                'kode'  => 'sp_lewat_batas',
                'level' => 'peringatan',
                'judul' => 'Batas evaluasi SP terlewat',
                'pesan' => "Batas evaluasi SP {$spAktif->level} Anda sudah terlewat. "
                    . 'Segera hubungi pengelola KIP-K.',
            ];
        }

        return $peringatan;
    }
}
