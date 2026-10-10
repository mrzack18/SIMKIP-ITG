<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\TahunAjaranHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\DokumenQueueResource;
use App\Models\Dokumen;
use App\Models\DokumenJenis;
use App\Models\IpkSemestr;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use App\Models\Prestasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DokumenController extends Controller
{
    public function queue(Request $request): JsonResponse
    {
        $limit = (int) ($request->limit ?? 10);
        $page = (int) ($request->page ?? 1);
        $status = $request->status;
        $search = $request->search;
        $jenisFilter = $request->jenis;

        $items = collect();

        // 1. Dokumens (exclude KHS — KHS dilacak via IpkSemestr agar tidak duplikat di queue)
        $dokQuery = Dokumen::with(['mahasiswa.prodi', 'jenis.fields', 'fieldValues.field'])
            ->whereHas('jenis', fn ($q) => $q->where('nama', '!=', 'KHS'));
        TahunAjaranHelper::applyDateRangeFilter($dokQuery, 'dokumens.created_at', $request->tahun_ajaran);
        if ($status && $status !== 'Semua') {
            $dokQuery->where('status', $status);
        }
        $doks = $dokQuery->get()->map(function ($d) {
            return [
                'id' => 'doc_'.$d->id,
                'mahasiswas_id' => $d->mahasiswa_id,
                'nim' => $d->mahasiswa->nim,
                'nama' => $d->mahasiswa->nama,
                'prodi' => $d->mahasiswa->prodi?->nama ?? 'Unknown',
                'angkatan' => $d->mahasiswa->angkatan,
                'jenis' => $d->jenis->nama,
                'tanggalUpload' => $d->created_at->format('Y-m-d\TH:i:s'),
                'status' => $d->status,
                'created_at' => $d->created_at,
            ];
        });
        $items = $items->concat($doks);

        // 2. Prestasis
        $presQuery = Prestasi::with(['mahasiswa.prodi']);
        TahunAjaranHelper::applyDateRangeFilter($presQuery, 'prestasis.created_at', $request->tahun_ajaran);
        if ($status && $status !== 'Semua') {
            if ($status === 'Menunggu') {
                $presQuery->whereIn('status', ['Menunggu Validasi', 'Menunggu']);
            } else {
                $presQuery->where('status', $status);
            }
        }
        $pres = $presQuery->get()->map(function ($p) {
            return [
                'id' => 'prestasi_'.$p->id,
                'mahasiswas_id' => $p->mahasiswa_id,
                'nim' => $p->mahasiswa->nim,
                'nama' => $p->mahasiswa->nama,
                'prodi' => $p->mahasiswa->prodi?->nama ?? 'Unknown',
                'angkatan' => $p->mahasiswa->angkatan,
                'jenis' => 'Sertifikat Prestasi',
                'tanggalUpload' => $p->created_at->format('Y-m-d\TH:i:s'),
                'status' => $p->status === 'Menunggu Validasi' ? 'Menunggu' : $p->status,
                'created_at' => $p->created_at,
            ];
        });
        $items = $items->concat($pres);

        // 3. Organisasis
        $orgQuery = Organisasi::with(['mahasiswa.prodi']);
        TahunAjaranHelper::applyDateRangeFilter($orgQuery, 'organisasis.created_at', $request->tahun_ajaran);
        if ($status && $status !== 'Semua') {
            $orgQuery->where('status', $status);
        }
        $orgs = $orgQuery->get()->map(function ($o) {
            return [
                'id' => 'organisasi_'.$o->id,
                'mahasiswas_id' => $o->mahasiswa_id,
                'nim' => $o->mahasiswa->nim,
                'nama' => $o->mahasiswa->nama,
                'prodi' => $o->mahasiswa->prodi?->nama ?? 'Unknown',
                'angkatan' => $o->mahasiswa->angkatan,
                'jenis' => 'SK Organisasi',
                'tanggalUpload' => $o->created_at->format('Y-m-d\TH:i:s'),
                'status' => $o->status,
                'created_at' => $o->created_at,
            ];
        });
        $items = $items->concat($orgs);

        // 4. Pelatihans
        $pelQuery = Pelatihan::with(['mahasiswa.prodi']);
        TahunAjaranHelper::applyDateRangeFilter($pelQuery, 'pelatihans.created_at', $request->tahun_ajaran);
        if ($status && $status !== 'Semua') {
            $pelQuery->where('status', $status);
        }
        $pels = $pelQuery->get()->map(function ($p) {
            return [
                'id' => 'pelatihan_'.$p->id,
                'mahasiswas_id' => $p->mahasiswa_id,
                'nim' => $p->mahasiswa->nim,
                'nama' => $p->mahasiswa->nama,
                'prodi' => $p->mahasiswa->prodi?->nama ?? 'Unknown',
                'angkatan' => $p->mahasiswa->angkatan,
                'jenis' => 'Sertifikat Pelatihan',
                'tanggalUpload' => $p->created_at->format('Y-m-d\TH:i:s'),
                'status' => $p->status,
                'created_at' => $p->created_at,
            ];
        });
        $items = $items->concat($pels);

        // 5. IpkSemestr (Evaluasi Akademik / KHS)
        // Filter langsung pada kolom tahun_ajaran (bukan created_at) agar sync dengan TA semesternya.
        $ipkQuery = IpkSemestr::with(['mahasiswa.prodi']);
        TahunAjaranHelper::applyTahunAjaranFilter($ipkQuery, 'ipk_semestrs.tahun_ajaran', $request->tahun_ajaran);
        if ($status && $status !== 'Semua') {
            $ipkQuery->where('status', $status);
        }
        $ipks = $ipkQuery->get()->map(function ($i) {
            return [
                'id' => 'ipk_'.$i->id,
                'mahasiswas_id' => $i->mahasiswa_id,
                'nim' => $i->mahasiswa->nim,
                'nama' => $i->mahasiswa->nama,
                'prodi' => $i->mahasiswa->prodi?->nama ?? 'Unknown',
                'angkatan' => $i->mahasiswa->angkatan,
                'jenis' => 'KHS',
                'tanggalUpload' => $i->created_at->format('Y-m-d\TH:i:s'),
                'status' => $i->status,
                'created_at' => $i->created_at,
            ];
        });
        $items = $items->concat($ipks);

        // Filter search & jenis
        if ($search) {
            $search = strtolower($search);
            $items = $items->filter(function ($i) use ($search) {
                return str_contains(strtolower($i['nama']), $search) || str_contains(strtolower($i['nim']), $search);
            });
        }
        if ($jenisFilter && $jenisFilter !== 'Semua') {
            $items = $items->filter(function ($i) use ($jenisFilter) {
                return str_contains(strtolower($i['jenis']), strtolower($jenisFilter));
            });
        }

        // Sort descending
        $sorted = $items->sortByDesc('created_at')->values();

        $total = $sorted->count();
        $paginated = $sorted->slice(($page - 1) * $limit, $limit)->values();

        return response()->json([
            'success' => true,
            'data' => DokumenQueueResource::collection($paginated),
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
            'catatan_admin' => 'nullable|string',
        ]);

        $parts = explode('_', $id);
        if (count($parts) !== 2) {
            return response()->json(['message' => 'Invalid ID format'], 400);
        }

        $type = $parts[0];
        $realId = $parts[1];

        $adminId = auth()->id();
        $status = $request->status;
        $catatan = $request->catatan_admin;

        if ($type === 'doc') {
            $dok = Dokumen::with('mahasiswa')->findOrFail($realId);
            $dok->update(['status' => $status, 'catatan_admin' => $catatan, 'approved_by' => $adminId, 'approved_at' => now()]);

            // Jika dokumen KHS, sinkronkan status ke IpkSemestr yang sesuai agar konsisten.
            if ($dok->jenis?->nama === 'KHS') {
                $meta = $dok->metadata ?? [];
                $semester = $meta['semester'] ?? null;
                $ta = $meta['tahun_ajaran'] ?? null;
                if ($semester !== null && $ta !== null) {
                    IpkSemestr::where('mahasiswa_id', $dok->mahasiswa_id)
                        ->where('semester', $semester)
                        ->where('tahun_ajaran', $ta)
                        ->update([
                            'status' => $status,
                            'catatan_admin' => $catatan,
                            'validated_by' => $adminId,
                            'validated_at' => now(),
                        ]);
                }
            }

            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'prestasi') {
            $pres = Prestasi::findOrFail($realId);
            $pres->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);

            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'organisasi') {
            $org = Organisasi::findOrFail($realId);
            $org->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);

            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'pelatihan') {
            $pel = Pelatihan::findOrFail($realId);
            $pel->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);

            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        } elseif ($type === 'ipk') {
            $ipk = IpkSemestr::with('mahasiswa')->findOrFail($realId);
            $ipk->update(['status' => $status, 'catatan_admin' => $catatan, 'validated_by' => $adminId, 'validated_at' => now()]);

            // Sinkronkan ke Dokumen KHS (jenis='KHS') yang matching (mahasiswa, semester, tahun_ajaran)
            // agar konsisten bila dokumen KHS pernah diupload terpisah.
            $jenisKHS = DokumenJenis::where('nama', 'KHS')->first();
            if ($jenisKHS) {
                Dokumen::where('mahasiswa_id', $ipk->mahasiswa_id)
                    ->where('dokumen_jenis_id', $jenisKHS->id)
                    ->where(function ($q) use ($ipk) {
                        $q->whereNull('metadata')
                            ->orWhereRaw("JSON_EXTRACT(metadata, '$.semester') = ?", [$ipk->semester]);
                    })
                    ->update([
                        'status' => $status,
                        'catatan_admin' => $catatan,
                        'approved_by' => $adminId,
                        'approved_at' => now(),
                    ]);
            }

            return response()->json(['success' => true, 'message' => 'Tervalidasi']);
        }

        return response()->json(['message' => 'Unknown type'], 400);
    }

    public function serveFile(int $id): mixed
    {
        $dok = Dokumen::with('mahasiswa')->findOrFail($id);
        $user = auth()->user();

        $allowed = match ($user->role) {
            'admin' => true,
            'warek' => true,
            'mahasiswa' => false,
            'prodi' => $user->prodi_id === $dok->mahasiswa->prodi_id,
            default => false,
        };

        if (! $allowed) {
            return response()->json(['success' => false, 'message' => 'Anda tidak berhak mengakses file ini.'], 403);
        }

        $path = storage_path('app/public/'.$dok->path_file);
        if (! file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'File tidak ditemukan.'], 404);
        }

        return response()->file($path);
    }
}
