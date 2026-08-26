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
        return response()->json([
            'data' => \App\Http\Resources\SemesterDetailResource::collection($data)
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
            'ipk'                    => 'required|numeric|between:0,4',
            'file_khs'               => 'nullable|file|mimes:pdf,jpg,jpeg|max:5120',
            'mata_kuliah'            => 'required|array|min:1',
            'mata_kuliah.*.kode'     => 'required|string|max:20',
            'mata_kuliah.*.nama'     => 'required|string|max:255',
            'mata_kuliah.*.sks'      => 'required|integer|between:1,6',
            'mata_kuliah.*.nilai_huruf' => 'required|in:A,AB,B,BC,C,D,E',
        ]);

        $m = $request->user()->mahasiswa;

        if ($m->ipkSemestrs()->where('semester', $request->semester)->exists()) {
            return response()->json(['success' => false, 'message' => "Data IPK semester {$request->semester} sudah ada."], 422);
        }

        $filePath = null;
        if ($request->hasFile('file_khs')) {
            $filePath = $request->file('file_khs')->store("khs/{$m->nim}", 'public');
        }

        $mks     = IPKCalculatorService::prepareMataKuliah($request->mata_kuliah);
        $ipkCalc = IPKCalculatorService::hitungIPK($mks);

        $ipkSem = IpkSemestr::create([
            'mahasiswa_id' => $m->id,
            'semester'     => $request->semester,
            'tahun_ajaran' => $request->tahun_ajaran,
            'ipk'          => $ipkCalc,
            'file_khs'     => $filePath,
        ]);

        foreach ($mks as $mk) {
            $ipkSem->mataKuliahs()->create($mk);
        }

        return response()->json(['success' => true, 'data' => $ipkSem->load('mataKuliahs')], 201);
    }
}
