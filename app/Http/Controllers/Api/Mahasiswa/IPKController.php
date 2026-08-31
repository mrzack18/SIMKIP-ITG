<?php

namespace App\Http\Controllers\Api\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\IpkSemestr;
use App\Models\Konfigurasi;
use App\Services\IPKCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IPKController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $m    = $request->user()->mahasiswa;
        if (!$m) return response()->json(['data' => []]);

        $data = $m->ipkSemestrs()->with('mataKuliahs')->orderByDesc('semester')->get();
        $carryOver = IPKCalculatorService::getCarryOver($m->id);

        $totalLulus = 0;
        $uniqueMks = IPKCalculatorService::getUniqueCoursesUpToSemester($m->id, 999);
        foreach ($uniqueMks as $mk) {
            if ($mk->lulus) $totalLulus += $mk->sks;
        }

        $statistik = [
            'tertinggi' => $data->count() > 0 ? $data->sortByDesc('ipk')->first()->only(['ipk', 'semester']) : ['ipk' => 0, 'semester' => '-'],
            'terendah'  => $data->count() > 0 ? $data->sortBy('ipk')->first()->only(['ipk', 'semester']) : ['ipk' => 0, 'semester' => '-'],
            'rata_rata' => $data->count() > 0 ? round($data->avg('ipk'), 2) : 0,
            'total_sks_lulus' => $totalLulus,
        ];

        return response()->json([
            'data' => \App\Http\Resources\SemesterDetailResource::collection($data),
            'carry_over' => $carryOver,
            'statistik' => $statistik
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (Konfigurasi::get('periode_input_aktif', '0') !== '1') {
            return response()->json(['success' => false, 'message' => 'Periode input nilai sedang tidak aktif.'], 422);
        }

        $request->validate([
            'semester'               => 'required|integer|min:1|max:14',
            'tahun_ajaran'           => 'required|string|max:30',
            // ipk is ignored from client as we calculate it
            'file_khs'               => 'nullable|file|mimes:pdf,jpg,jpeg|max:5120',
            'mata_kuliah'            => 'required|array|min:1',
            'mata_kuliah.*.kode'     => 'required|string|max:20',
            'mata_kuliah.*.nama'     => 'required|string|max:255',
            'mata_kuliah.*.sks'      => 'required|integer|between:1,6',
            'mata_kuliah.*.nilai_huruf' => 'required|in:A,AB,B,BC,C,D,E',
        ]);

        $m = $request->user()->mahasiswa;

        $mks     = IPKCalculatorService::prepareMataKuliah($request->mata_kuliah);
        $ipsCalc = IPKCalculatorService::hitungIPS($mks);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Upsert IpkSemestr (to support update functionality)
            $ipkSem = IpkSemestr::updateOrCreate(
                ['mahasiswa_id' => $m->id, 'semester' => $request->semester],
                [
                    'tahun_ajaran' => $request->tahun_ajaran,
                    'ips'          => $ipsCalc,
                    'ipk'          => 0, // Fallback default untuk strict mode insert, direcalculate sesaat lagi
                    'status'       => 'Menunggu',
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

            // Handle file upload safely after DB is secured
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
}
