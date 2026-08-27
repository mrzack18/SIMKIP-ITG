<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Models\SuratPeringatan;
use App\Services\SPValidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SPController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SuratPeringatan::with(['mahasiswa.prodi']);
        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        if ($request->level && $request->level !== 'Semua') $query->where('level', $request->level);
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => \App\Http\Resources\SuratPeringatanResource::collection($data),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'total_pages' => (int) ceil($total/$limit),
        ]);
    }

    public function history(int $id): JsonResponse
    {
        $data = SuratPeringatan::with(['mahasiswa.prodi'])->where('mahasiswa_id', $id)->latest()->get();
        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\SuratPeringatanResource::collection($data),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'mahasiswa_id'      => 'required|exists:mahasiswas,id',
            'level'             => 'required|in:SP1,SP2,SP3',
            'jenis_pelanggaran' => 'required|in:Akademik,Non-Akademik,Cuti Tanpa Izin',
            'deskripsi'         => 'required|string|min:10',
            'tanggal_terbit'    => 'required|date',
            'batas_evaluasi'    => 'nullable|date|after:tanggal_terbit',
            'catatan'           => 'nullable|string',
        ]);

        $mahasiswa = Mahasiswa::findOrFail($request->mahasiswa_id);
        $error = SPValidationService::validate($mahasiswa, $request->level, $request->jenis_pelanggaran);

        if ($error) {
            return response()->json(['success' => false, 'message' => $error], 422);
        }

        $level = $request->jenis_pelanggaran === 'Cuti Tanpa Izin' ? 'SP3' : $request->level;

        $sp = SuratPeringatan::create([
            'mahasiswa_id'      => $request->mahasiswa_id,
            'level'             => $level,
            'jenis_pelanggaran' => $request->jenis_pelanggaran,
            'deskripsi'         => $request->deskripsi,
            'tanggal_terbit'    => $request->tanggal_terbit,
            'batas_evaluasi'    => $request->batas_evaluasi,
            'status'            => $level === 'SP3' ? 'Pemberhentian' : 'Aktif',
            'diterbitkan_oleh'  => auth()->id(),
            'catatan'           => $request->catatan,
        ]);

        if ($level === 'SP3') {
            SPValidationService::handleSP3($mahasiswa);
        }

        Notification::kirim(
            $mahasiswa->user_id,
            "Surat Peringatan {$level} Diterbitkan",
            "Anda mendapatkan {$level} atas pelanggaran: {$request->jenis_pelanggaran}. Batas evaluasi: " . date('d M Y', strtotime($request->batas_evaluasi)),
            'warning',
            '/mahasiswa/sp'
        );

        AuditLog::catat('SP', "Terbitkan {$level} untuk {$mahasiswa->nama} ({$mahasiswa->nim})", [
            'terkait_nim' => $mahasiswa->nim, 'terkait_nama' => $mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'sp' => ['id' => $sp->id, 'level' => $sp->level]], 201);
    }

    public function show(int $id): JsonResponse
    {
        $sp = SuratPeringatan::with(['mahasiswa.prodi','diterbitkanOleh'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $sp]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status'  => 'required|in:Aktif,Masa Tenggang,Selesai',
            'catatan' => 'nullable|string',
        ]);

        $sp = SuratPeringatan::with('mahasiswa')->findOrFail($id);
        $sp->update(['status' => $request->status, 'catatan' => $request->catatan ?? $sp->catatan]);

        AuditLog::catat('Ubah', "Update status SP {$sp->level} → {$request->status} ({$sp->mahasiswa->nim})", [
            'terkait_nim' => $sp->mahasiswa->nim, 'terkait_nama' => $sp->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status SP diperbarui.']);
    }
}
