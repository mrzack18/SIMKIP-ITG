<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\TahunAjaranHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\SuratPeringatanResource;
use App\Models\AuditLog;
use App\Models\JenisPelanggaran;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Models\SuratPeringatan;
use App\Services\PdfGeneratorService;
use App\Services\SPValidationService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SPController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SuratPeringatan::with(['mahasiswa.prodi']);
        TahunAjaranHelper::applyDateMaxFilter($query, 'surat_peringatans.tanggal_terbit', $request->tahun_ajaran);

        if ($s = $request->search) {
            $query->whereHas('mahasiswa', fn ($q) => $q->where('nim', 'like', "%$s%")->orWhere('nama', 'like', "%$s%"));
        }
        if ($request->level && $request->level !== 'Semua') {
            $query->where('level', $request->level);
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $query->whereHas('mahasiswa.prodi', fn ($q) => $q->where('nama', $request->prodi));
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->whereHas('mahasiswa', fn ($q) => $q->where('angkatan', $request->angkatan));
        }
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $limit = (int) ($request->limit ?? 10);
        $page = (int) ($request->page ?? 1);
        $total = $query->count();
        $data = $query->latest()->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'success' => true,
            'data' => SuratPeringatanResource::collection($data),
            'total' => $total, 'page' => $page, 'limit' => $limit,
            'totalPages' => (int) ceil($total / max($limit, 1)),
            'total_pages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function history(Request $request, int $id): JsonResponse
    {
        $q = SuratPeringatan::with(['mahasiswa.prodi'])->where('mahasiswa_id', $id);
        TahunAjaranHelper::applyDateMaxFilter($q, 'surat_peringatans.tanggal_terbit', $request->tahun_ajaran);

        // Ensure active SPs are at the top, followed by historical ones
        $q->orderByRaw("FIELD(status, 'Aktif', 'Masa Tenggang', 'Pemberhentian', 'Selesai') ASC")
            ->latest('tanggal_terbit');

        $data = $q->get();

        return response()->json([
            'success' => true,
            'data' => SuratPeringatanResource::collection($data),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'mahasiswa_id' => 'required|exists:mahasiswas,id',
            'level' => 'required|in:SP1,SP2,SP3',
            'jenis_pelanggaran' => 'required|exists:jenis_pelanggarans,nama',
            'deskripsi' => 'required|string|min:10',
            'tanggal_terbit' => 'required|date',
            'batas_evaluasi' => 'nullable|date|after:tanggal_terbit',
            'catatan' => 'nullable|string',
            'nomor_surat' => 'nullable|string|max:100|unique:surat_peringatans,nomor_surat',
            'tempat' => 'nullable|string|max:255',
            'penandatangan_nama' => 'nullable|string|max:255',
            'penandatangan_nidn' => 'nullable|string|max:50',
            'penandatangan_jabatan' => 'nullable|string|max:255',
        ]);

        $mahasiswa = Mahasiswa::findOrFail($request->mahasiswa_id);
        $error = SPValidationService::validate($mahasiswa, $request->level, $request->jenis_pelanggaran);

        if ($error) {
            return response()->json(['success' => false, 'message' => $error], 422);
        }

        $jp = JenisPelanggaran::where('nama', $request->jenis_pelanggaran)->first();
        $level = ($jp && $jp->eskalasi === 'langsung_sp3') ? 'SP3' : $request->level;

        $sp = SuratPeringatan::create([
            'mahasiswa_id' => $request->mahasiswa_id,
            'level' => $level,
            'jenis_pelanggaran' => $request->jenis_pelanggaran,
            'deskripsi' => $request->deskripsi,
            'tanggal_terbit' => $request->tanggal_terbit,
            'batas_evaluasi' => $request->batas_evaluasi,
            'status' => $level === 'SP3' ? 'Pemberhentian' : 'Aktif',
            'diterbitkan_oleh' => auth()->id(),
            'catatan' => $request->catatan,
            'tempat' => $request->tempat ?? 'Garut',
            'penandatangan_nama' => $request->penandatangan_nama,
            'penandatangan_nidn' => $request->penandatangan_nidn,
            'penandatangan_jabatan' => $request->penandatangan_jabatan,
            'nomor_surat' => $request->nomor_surat,
        ]);

        if (empty($sp->nomor_surat)) {
            $romans = [1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI', 7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'];
            $monthRoman = $romans[(int) now()->format('n')];
            $nomorSurat = str_pad($sp->id, 3, '0', STR_PAD_LEFT).'/SP/KIP-K/ITG/'.$monthRoman.'/'.now()->year;
            $sp->update(['nomor_surat' => $nomorSurat]);
        }

        if ($level === 'SP3') {
            SPValidationService::handleSP3($mahasiswa);
        }

        Notification::kirim(
            $mahasiswa->user_id,
            "Surat Peringatan {$level} Diterbitkan",
            "Anda mendapatkan {$level} atas pelanggaran: {$request->jenis_pelanggaran}. Batas evaluasi: ".date('d M Y', strtotime($request->batas_evaluasi)),
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
            'data' => (new SuratPeringatanResource($sp))->resolve(),
            'extra' => [
                'jenisPelanggaran' => $sp->jenis_pelanggaran,
                'catatan' => $sp->catatan,
                'diterbitkanOleh' => $sp->diterbitkanOleh?->name,
                'mahasiswaId' => $sp->mahasiswa_id,
                'kategori' => $sp->mahasiswa?->kategori,
            ],
            'history' => SuratPeringatanResource::collection($history)->resolve(),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:Aktif,Masa Tenggang,Selesai',
            'catatan' => 'nullable|string',
        ]);

        $sp = SuratPeringatan::with('mahasiswa')->findOrFail($id);
        $sp->update(['status' => $request->status, 'catatan' => $request->catatan ?? $sp->catatan]);

        AuditLog::catat('Ubah', "Update status SP {$sp->level} → {$request->status} ({$sp->mahasiswa->nim})", [
            'terkait_nim' => $sp->mahasiswa->nim, 'terkait_nama' => $sp->mahasiswa->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status SP diperbarui.']);
    }

    public function downloadPdf(int $id): StreamedResponse
    {
        $sp = SuratPeringatan::with(['mahasiswa.prodi', 'mahasiswa.user'])->findOrFail($id);
        $mahasiswa = $sp->mahasiswa;

        $tanggalTerbit = $sp->tanggal_terbit;
        $tahunAjaran = null;
        if ($tanggalTerbit) {
            $month = (int) $tanggalTerbit->format('m');
            $year = (int) $tanggalTerbit->format('Y');
            if ($month >= 2 && $month <= 8) {
                $tahunAjaran = ($year - 1).'/'.$year.' Genap';
            } elseif ($month == 1) {
                $tahunAjaran = ($year - 1).'/'.$year.' Ganjil';
            } else {
                $tahunAjaran = $year.'/'.($year + 1).' Ganjil';
            }
        }

        $pdf = Pdf::loadView('sp.pdf', [
            'sp' => $sp,
            'mahasiswa' => $mahasiswa,
            'tahunAjaran' => $tahunAjaran,
            'logoPath' => PdfGeneratorService::getLogoBase64(),
        ])->setPaper('a4')->setOptions([
            'defaultFont' => 'Times New Roman',
        ]);

        $filename = 'Surat-Peringatan-'.$sp->level.'-'.$mahasiswa->nim.'-'.$sp->id.'.pdf';

        return response()->streamDownload(
            fn () => print($pdf->output()),
            $filename,
            ['Content-Type' => 'application/pdf']
        );
    }
}
