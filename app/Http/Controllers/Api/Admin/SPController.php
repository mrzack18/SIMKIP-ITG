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
        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($query, 'surat_peringatans.tanggal_terbit', $request->tahun_ajaran);

        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
        }
        if ($request->level && $request->level !== 'Semua') $query->where('level', $request->level);
        if ($request->prodi && $request->prodi !== 'Semua') $query->whereHas('mahasiswa.prodi', fn($q) => $q->where('nama', $request->prodi));
        if ($request->angkatan && $request->angkatan !== 'Semua') $query->whereHas('mahasiswa', fn($q) => $q->where('angkatan', $request->angkatan));
        if ($request->status && $request->status !== 'Semua') $query->where('status', $request->status);

        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $total = $query->count();
        $data  = $query->latest()->skip(($page-1)*$limit)->take($limit)->get();

        return response()->json([
            'success'     => true,
            'data'        => \App\Http\Resources\SuratPeringatanResource::collection($data),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'totalPages' => (int) ceil($total / max($limit, 1)),
            'total_pages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function history(Request $request, int $id): JsonResponse
    {
        $q = SuratPeringatan::with(['mahasiswa.prodi'])->where('mahasiswa_id', $id);
        \App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q, 'surat_peringatans.tanggal_terbit', $request->tahun_ajaran);
        
        // Ensure active SPs are at the top, followed by historical ones
        $q->orderByRaw("FIELD(status, 'Aktif', 'Masa Tenggang', 'Pemberhentian', 'Selesai') ASC")
          ->latest('tanggal_terbit');

        $data = $q->get();
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
            'jenis_pelanggaran' => 'required|exists:jenis_pelanggarans,nama',
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

        $jp = \App\Models\JenisPelanggaran::where('nama', $request->jenis_pelanggaran)->first();
        $level = ($jp && $jp->eskalasi === 'langsung_sp3') ? 'SP3' : $request->level;

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

        $romans = [1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'];
        $monthRoman = $romans[(int)now()->format('n')];
        $nomorSurat = str_pad($sp->id, 3, '0', STR_PAD_LEFT) . '/SP/KIP-K/ITG/' . $monthRoman . '/' . now()->year;
        
        $sp->update(['nomor_surat' => $nomorSurat]);

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
        $sp = SuratPeringatan::with(['mahasiswa.prodi', 'diterbitkanOleh'])->findOrFail($id);

        // SP history for same mahasiswa (for timeline section)
        $history = SuratPeringatan::with(['mahasiswa.prodi'])
            ->where('mahasiswa_id', $sp->mahasiswa_id)
            ->latest('tanggal_terbit')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => (new \App\Http\Resources\SuratPeringatanResource($sp))->resolve(),
            'extra'   => [
                'jenisPelanggaran' => $sp->jenis_pelanggaran,
                'catatan'          => $sp->catatan,
                'diterbitkanOleh'  => $sp->diterbitkanOleh?->name,
                'mahasiswaId'      => $sp->mahasiswa_id,
                'kategori'         => $sp->mahasiswa?->kategori,
            ],
            'history' => \App\Http\Resources\SuratPeringatanResource::collection($history)->resolve(),
        ]);
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
