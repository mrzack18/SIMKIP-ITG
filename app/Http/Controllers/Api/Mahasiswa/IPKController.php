<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\IpkSemestr;
use App\Models\Konfigurasi;
use App\Services\IPKCalculatorService;
use App\Helpers\TahunAjaranHelper;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IPKController extends Controller
{
    /**
     * Periode check helper — returns null if OK, or an error message string.
     * $tahunAjaran: the TA filter the student selected in the form.
     */
    private function checkPeriode(?string $tahunAjaran = null): ?string
    {
        $aktif = Konfigurasi::get('periode_input_aktif', '0') === '1';
        $buka  = Carbon::parse(Konfigurasi::get('periode_input_buka', '2000-01-01'));
        $tutup = Carbon::parse(Konfigurasi::get('periode_input_tutup', '2099-12-31'));
        $taKonfigurasi = Konfigurasi::get('periode_input_tahun_ajaran'); // e.g. "2025/2026 Ganjil"
        $now   = Carbon::now();

        if (!$aktif) {
            return 'Periode input nilai sedang tidak aktif.';
        }

        // Normalize TA from filter for comparison
        $normalize = fn(string $ta) => trim(
            str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $ta)
        );

        // If student selected a TA filter, validate it matches the configured TA
        if ($tahunAjaran && $tahunAjaran !== 'Semua' && $taKonfigurasi) {
            if ($normalize($tahunAjaran) !== $normalize($taKonfigurasi)) {
                return "Periode input untuk {$tahunAjaran} belum dibuka. Hubungi admin untuk membuka periode.";
            }
        }

        if ($now->lt($buka)) {
            return 'Periode input nilai belum dibuka. Dibuka pada ' . $buka->format('d M Y') . '.';
        }
        if ($now->gt($tutup)) {
            return 'Periode input nilai sudah ditutup pada ' . $tutup->format('d M Y') . '.';
        }
        return null;
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

        // Filtered data for display (chart, stats, riwayat)
        $data = $semesterTujuan
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
