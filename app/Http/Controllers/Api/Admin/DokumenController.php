<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Dokumen;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DokumenController extends Controller
{
    public function queue(Request $request): JsonResponse
    {
        $limit = (int)($request->limit ?? 10);
        $page  = (int)($request->page ?? 1);
        $status = $request->status;
        $search = $request->search;
        $jenisFilter = $request->jenis;

        $items = collect();

        // 1. Dokumens
        $dokQuery = Dokumen::with(['mahasiswa.prodi', 'jenis']);
        if ($status && $status !== 'Semua') $dokQuery->where('status', $status);
        $doks = $dokQuery->get()->map(function($d) {
            return [
                'id' => 'doc_' . $d->id,
                'mahasiswas_id' => $d->mahasiswa_id,
                'nim' => $d->mahasiswa->nim,
                'nama' => $d->mahasiswa->nama,
                'prodi' => $d->mahasiswa->prodi?->nama ?? 'Unknown',
                'jenis' => $d->jenis->nama,
                'tanggalUpload' => $d->created_at->format('Y-m-d\TH:i:s'),
                'status' => $d->status,
                'created_at' => $d->created_at,
            ];
        });
        $items = $items->concat($doks);

        // 2. Prestasis
        $presQuery = \App\Models\Prestasi::with(['mahasiswa.prodi']);
        if ($status && $status !== 'Semua') {
            if ($status === 'Menunggu') {
                $presQuery->whereIn('status', ['Menunggu Validasi', 'Menunggu']);
            } else {
                $presQuery->where('status', $status);
            }
        }
        $pres = $presQuery->get()->map(function($p) {
            return [
                'id' => 'prestasi_' . $p->id,
                'mahasiswas_id' => $p->mahasiswa_id,
                'nim' => $p->mahasiswa->nim,
                'nama' => $p->mahasiswa->nama,
                'prodi' => $p->mahasiswa->prodi?->nama ?? 'Unknown',
                'jenis' => 'Sertifikat Prestasi',
                'tanggalUpload' => $p->created_at->format('Y-m-d\TH:i:s'),
                'status' => $p->status === 'Menunggu Validasi' ? 'Menunggu' : $p->status,
                'created_at' => $p->created_at,
            ];
        });
        $items = $items->concat($pres);

        // 3. Organisasis
        $orgQuery = \App\Models\Organisasi::with(['mahasiswa.prodi']);
        if ($status && $status !== 'Semua') $orgQuery->where('status', $status);
        $orgs = $orgQuery->get()->map(function($o) {
            return [
                'id' => 'organisasi_' . $o->id,
                'mahasiswas_id' => $o->mahasiswa_id,
                'nim' => $o->mahasiswa->nim,
                'nama' => $o->mahasiswa->nama,
                'prodi' => $o->mahasiswa->prodi?->nama ?? 'Unknown',
                'jenis' => 'SK Organisasi',
                'tanggalUpload' => $o->created_at->format('Y-m-d\TH:i:s'),
                'status' => $o->status,
                'created_at' => $o->created_at,
            ];
        });
        $items = $items->concat($orgs);

        // 4. Pelatihans
        $pelQuery = \App\Models\Pelatihan::with(['mahasiswa.prodi']);
        if ($status && $status !== 'Semua') $pelQuery->where('status', $status);
        $pels = $pelQuery->get()->map(function($p) {
            return [
                'id' => 'pelatihan_' . $p->id,
                'mahasiswas_id' => $p->mahasiswa_id,
                'nim' => $p->mahasiswa->nim,
                'nama' => $p->mahasiswa->nama,
                'prodi' => $p->mahasiswa->prodi?->nama ?? 'Unknown',
                'jenis' => 'Sertifikat Pelatihan',
                'tanggalUpload' => $p->created_at->format('Y-m-d\TH:i:s'),
                'status' => $p->status,
                'created_at' => $p->created_at,
            ];
        });
        $items = $items->concat($pels);

        // Filter search & jenis
        if ($search) {
            $search = strtolower($search);
            $items = $items->filter(function($i) use ($search) {
                return str_contains(strtolower($i['nama']), $search) || str_contains(strtolower($i['nim']), $search);
            });
        }
        if ($jenisFilter && $jenisFilter !== 'Semua') {
            $items = $items->filter(function($i) use ($jenisFilter) {
                return str_contains(strtolower($i['jenis']), strtolower($jenisFilter));
            });
        }

        // Sort descending
        $sorted = $items->sortByDesc('created_at')->values();

        $total = $sorted->count();
        $paginated = $sorted->slice(($page - 1) * $limit, $limit)->values();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\DokumenQueueResource::collection($paginated),
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => (int) ceil($total / max($limit, 1)),
        ]);
    }

    public function validateDokumen(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:Disetujui,Ditolak',
            'catatan_admin' => 'nullable|string'
        ]);

        $parts = explode('_', $id);
        if (count($parts) !== 2) return response()->json(['message' => 'Invalid ID format'], 400);

        $type = $parts[0];
        $realId = $parts[1];

        $adminId = auth()->id();
        $status = $request->status;
        $catatan = $request->catatan_admin;

        if ($type === 'doc') {
            $dok = Dokumen::with('mahasiswa')->findOrFail($realId);
            $dok->update(['status' => $status, 'catatan_admin' => $catatan, 'approved_by' => $adminId, 'approved_at' => now()]);
            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'prestasi') {
            $pres = \App\Models\Prestasi::findOrFail($realId);
            $pres->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);
            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'organisasi') {
            $org = \App\Models\Organisasi::findOrFail($realId);
            $org->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);
            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'pelatihan') {
            $pel = \App\Models\Pelatihan::findOrFail($realId);
            $pel->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);
            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        }

        return response()->json(['message' => 'Unknown type'], 400);
    }

    public function serveFile(int $id): mixed
    {
        $dok = Dokumen::findOrFail($id);
        $path = storage_path('app/public/' . $dok->path_file);
        if (! file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'File tidak ditemukan.'], 404);
        }
        return response()->file($path);
    }
}
