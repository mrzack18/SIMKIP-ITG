<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\IpkSemestr;
use App\Services\IPKCalculatorService;
use App\Helpers\PeriodeInputHelper;
use App\Helpers\TahunAjaranHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IPKController extends Controller
{
    /**
     * Periode check helper — returns null if OK, or an error message string.
     * $tahunAjaran: the TA filter the student selected in the form.
     *
     * Periode dicari dari tabel `periode_akademiks` berdasarkan tahun ajaran
     * yang dipilih mahasiswa, BUKAN dari satu key konfigurasi global. Dengan
     * begitu beberapa tahun ajaran bisa punya periode aktif sekaligus, dan
     * mahasiswa hanya bisa mengisi TA yang periodenya memang dibuka.
     */
    private function checkPeriode(?string $tahunAjaran = null): ?string
    {
        $periode = PeriodeInputHelper::untukTahunAjaran($tahunAjaran);

        return PeriodeInputHelper::alasanTidakBisa($periode, $tahunAjaran);
    }

    public function index(Request $request): JsonResponse
    {
        $m = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        // ── TA filtering ────────────────────────────────────────────────
        $tahunAjaran = $request->tahun_ajaran;
        $semesterTujuan = null;

        if ($tahunAjaran && $tahunAjaran !== 'Semua') {
            $semesterTujuan = TahunAjaranHelper::calculateSemester(
                (int) $m->angkatan,
                $tahunAjaran
            );
        }

        // All records (for carry-over & semester detection — always full)
        $allData = $m->ipkSemestrs()->with('mataKuliahs')->orderByDesc('semester')->get();
        $carryOver = IPKCalculatorService::getCarryOver($m->id);

        // Filtered data for display (chart, stats, riwayat).
        // semesterTujuan = 0 (mahasiswa belum aktif di TA itu) => kosong,
        // bukan tampil semua. null (tanpa filter) => tampil semua.
        $data = !is_null($semesterTujuan)
            ? $allData->filter(fn($r) => $r->semester <= $semesterTujuan)->values()
            : $allData;

        // Statistik based on filtered data
        $totalLulus = 0;
        foreach ($data as $record) {
            foreach ($record->mataKuliahs as $mk) {
                if ($mk->lulus) $totalLulus += $mk->sks;
            }
        }

        $statistik = [
            'tertinggi' => $data->count() > 0 ? $data->sortByDesc('ipk')->first()->only(['ipk', 'semester']) : ['ipk' => 0, 'semester' => '-'],
            'terendah'  => $data->count() > 0 ? $data->sortBy('ipk')->first()->only(['ipk', 'semester']) : ['ipk' => 0, 'semester' => '-'],
            'rata_rata' => $data->count() > 0 ? round($data->avg('ipk'), 2) : 0,
            'total_sks_lulus' => $totalLulus,
        ];

        // Semester aktif based on ALL records (not filtered)
        $allSemesters = $m->ipkSemestrs;
        $semesterAktif = $allSemesters->count() > 0 ? $allSemesters->max('semester') : 0;

        // displayedSemester: the highest semester in filtered data
        $displayedSemester = $data->count() > 0 ? $data->max('semester') : 0;

        return response()->json([
            'data' => \App\Http\Resources\SemesterDetailResource::collection($data->values()),
            'carry_over' => $carryOver,
            'statistik' => $statistik,
            'tahun_ajaran_filter' => $tahunAjaran,
            'semester_tersedia' => $displayedSemester,
            'semester_aktif' => $semesterAktif,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // 1. Periode check (pass TA so it can validate match)
        if ($err = $this->checkPeriode($request->tahun_ajaran)) {
            return response()->json(['success' => false, 'message' => $err], 422);
        }

        $request->validate([
            'semester'               => 'required|integer|min:1|max:14',
            'tahun_ajaran'           => 'required|string|max:30',
            'file_khs'              => 'nullable|file|mimes:pdf,jpg,jpeg|max:5120',
            'mata_kuliah'            => 'required|array|min:1',
            'mata_kuliah.*.kode'    => 'required|string|max:20',
            'mata_kuliah.*.nama'    => 'required|string|max:255',
            'mata_kuliah.*.sks'     => 'required|integer|between:1,6',
            'mata_kuliah.*.nilai_huruf' => 'required|in:A,AB,B,BC,C,D,E',
            'mata_kuliah.*.alasan_perubahan' => 'nullable|string|max:1000',
        ]);

        $m = $request->user()->mahasiswa;

        // 2. Block if already Disetujui (final) atau Menunggu (sedang divalidasi admin)
        $existing = IpkSemestr::where('mahasiswa_id', $m->id)
            ->where('semester', $request->semester)
            ->first();

        if ($existing && $existing->status === 'Disetujui') {
            return response()->json([
                'success' => false,
                'message' => 'Nilai semester sudah disetujui dan tidak dapat diubah.'
            ], 422);
        }

        if ($existing && $existing->status === 'Menunggu') {
            return response()->json([
                'success' => false,
                'message' => 'Nilai sedang menunggu validasi admin. Tidak dapat mengubah sampai ditolak.'
            ], 422);
        }

        $mks     = IPKCalculatorService::prepareMataKuliah($request->mata_kuliah);
        $ipsCalc = IPKCalculatorService::hitungIPS($mks);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Upsert IpkSemestr — simpan sebagai Draft agar admin tidak melihat
            // sampai mahasiswa klik "Ajukan" (submit).
            // Status 'Ditolak' di-reset ke 'Draft' supaya bisa diedit ulang.
            $ipkSem = IpkSemestr::updateOrCreate(
                ['mahasiswa_id' => $m->id, 'semester' => $request->semester],
                [
                    'tahun_ajaran' => $request->tahun_ajaran,
                    'ips'          => $ipsCalc,
                    'ipk'          => 0,
                    'status'       => 'Draft',
                    'catatan_admin'=> null,
                ]
            );

            // Clear old courses if updating
            $ipkSem->mataKuliahs()->delete();

            foreach ($mks as $mk) {
                $ipkSem->mataKuliahs()->create($mk);
            }

            // Recalculate IPK Kumulatif retroactively
            IPKCalculatorService::recalculateAllIPK($m->id);

            // Handle file upload
            if ($request->hasFile('file_khs')) {
                $filePath = $request->file('file_khs')->store("khs/{$m->nim}", 'public');
                $ipkSem->update(['file_khs' => $filePath]);
            }

            \Illuminate\Support\Facades\DB::commit();

            return response()->json(['success' => true, 'data' => $ipkSem->load('mataKuliahs')], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal menyimpan data KHS: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Submit a draft IPK record for admin validation.
     *
     * Transitions: Draft -> Menunggu | Ditolak -> Menunggu (re-submit)
     * Status 'Menunggu' dipakai di queue admin (bukan 'Diajukan') agar sync dengan filter.
     */
    public function submit(Request $request): JsonResponse
    {
        // 1. Periode check (pass TA so it can validate match)
        if ($err = $this->checkPeriode($request->tahun_ajaran)) {
            return response()->json(['success' => false, 'message' => $err], 422);
        }

        $request->validate([
            'semester' => 'required|integer|min:1|max:14',
            'tahun_ajaran' => 'nullable|string|max:30',
        ]);

        $m = $request->user()->mahasiswa;

        $existing = IpkSemestr::where('mahasiswa_id', $m->id)
            ->where('semester', $request->semester)
            ->first();

        if (!$existing) {
            return response()->json([
                'success' => false,
                'message' => 'Data nilai semester belum diisi. Silakan input nilai terlebih dahulu.'
            ], 422);
        }

        if ($existing->status === 'Disetujui') {
            return response()->json([
                'success' => false,
                'message' => 'Nilai semester sudah disetujui dan tidak dapat diubah.'
            ], 422);
        }

        if ($existing->status === 'Menunggu') {
            return response()->json([
                'success' => false,
                'message' => 'Nilai sudah diajukan dan sedang menunggu validasi admin.'
            ], 422);
        }

        // Wajib ada bukti KHS sebelum diajukan.
        //
        // Penting sejak data akademik hasil sync LSIPD berstatus 'Draft': tanpa
        // penjaga ini, mahasiswa bisa mengajukan nilai hasil sinkronisasi (yang
        // tidak punya file KHS sama sekali) untuk divalidasi pengelola tanpa bukti
        // apa pun. Alur normal pun memang upload KHS dulu, baru ajukan.
        if (empty($existing->file_khs)) {
            return response()->json([
                'success' => false,
                'message' => 'Unggah file KHS terlebih dahulu sebelum mengajukan nilai untuk divalidasi.'
            ], 422);
        }

        // Izinkan submit dari 'Draft' atau 'Ditolak' (re-submit setelah penolakan)
        $existing->update([
            'status' => 'Menunggu',
            'catatan_admin' => null,
            'validated_by' => null,
            'validated_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Nilai berhasil diajukan untuk divalidasi.',
            'data' => $existing->fresh()->load('mataKuliahs'),
        ]);
    }
}
