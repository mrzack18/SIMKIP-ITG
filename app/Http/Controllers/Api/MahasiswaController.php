<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Admin\MahasiswaController as AdminMahasiswa;
use App\Http\Controllers\Api\Prodi\MahasiswaController as ProdiMahasiswa;
use App\Models\Mahasiswa;

class MahasiswaController extends Controller
{
    public function index(Request $req) {
        return match($req->user()->role) {
            "admin" => app(AdminMahasiswa::class)->index($req),
            "prodi" => app(ProdiMahasiswa::class)->index($req),
            "warek" => $this->warekIndex($req),
            default => abort(403),
        };
    }

    public function store(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->store($req);
        abort(403);
    }

    public function show(Request $req, $id) {
        return match($req->user()->role) {
            "admin" => app(AdminMahasiswa::class)->show($id),
            "prodi" => app(ProdiMahasiswa::class)->show($req, $id),
            "warek" => $this->warekShow($id),
            "mahasiswa" => $this->mahasiswaShow($req, $id),
            default => abort(403),
        };
    }

    public function destroy(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->destroy($req, $id);
        abort(403);
    }

    public function checkNim(Request $req, $nim) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->checkNim($nim);
        abort(403);
    }

    public function updateStatus(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->updateStatus($req, $id);
        abort(403);
    }

    public function cabutKipk(Request $req, $id) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->cabutKipk($req, $id);
        abort(403);
    }

    public function filterOptions(Request $req) {
        if (!in_array($req->user()->role, ['admin', 'prodi', 'warek'])) abort(403);

        $prodis = \App\Models\Prodi::select('id', 'nama', 'kode')
            ->where('is_aktif', true)
            ->orderBy('nama')
            ->get();

        $angkatans = Mahasiswa::select('angkatan')
            ->distinct()
            ->orderByDesc('angkatan')
            ->pluck('angkatan');

        return response()->json([
            'success'   => true,
            'prodis'    => $prodis,
            'angkatans' => $angkatans,
        ]);
    }

    public function rekapAkademik(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->rekapAkademik($req);
        abort(403);
    }
    public function rekapPrestasi(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->rekapPrestasi($req);
        abort(403);
    }
    public function rekapOrganisasi(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->rekapOrganisasi($req);
        abort(403);
    }
    public function rekapPelatihan(Request $req) {
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->rekapPelatihan($req);
        abort(403);
    }

    public function ipk(Request $req, $id) {
        if ($req->user()->role === "mahasiswa") abort(403);

        $m = Mahasiswa::findOrFail($id);
        
        // Prodi authorization check
        if ($req->user()->role === "prodi") {
            if ($m->prodi_id !== $req->user()->prodi_id) abort(403);
        }

        $data = $m->ipkSemestrs()->with('mataKuliahs')->orderByDesc('semester')->get();
        return response()->json([
            'data' => \App\Http\Resources\SemesterDetailResource::collection($data)
        ]);
    }

    private function checkAccessAndGetMahasiswa($req, $id) {
        if ($req->user()->role === "mahasiswa") abort(403);
        $m = Mahasiswa::findOrFail($id);
        if ($req->user()->role === "prodi" && $m->prodi_id !== $req->user()->prodi_id) abort(403);
        return $m;
    }

    public function prestasi(Request $req, $id) {
        $m = $this->checkAccessAndGetMahasiswa($req, $id);
        $data = $m->prestasis()->with('mahasiswa.prodi')->latest()->get();
        return response()->json(['data' => \App\Http\Resources\PrestasiResource::collection($data)]);
    }

    public function organisasi(Request $req, $id) {
        $m = $this->checkAccessAndGetMahasiswa($req, $id);
        $data = $m->organisasis()->with('mahasiswa.prodi')->latest()->get();
        return response()->json(['data' => \App\Http\Resources\OrganisasiResource::collection($data)]);
    }

    public function pelatihan(Request $req, $id) {
        $m = $this->checkAccessAndGetMahasiswa($req, $id);
        $data = $m->pelatihans()->with('mahasiswa.prodi')->latest()->get();
        return response()->json(['data' => \App\Http\Resources\PelatihanResource::collection($data)]);
    }

    public function dokumen(Request $req, $id) {
        $m = $this->checkAccessAndGetMahasiswa($req, $id);
        if ($req->user()->role === "admin") return app(AdminMahasiswa::class)->dokumen($req, $id);
        
        // Fallback for Prodi if they also need to view documents
        return app(AdminMahasiswa::class)->dokumen($req, $id);
    }

    public function validatePrestasi(Request $req, $id, $itemId) {
        if ($req->user()->role !== "admin") abort(403);
        $req->validate(['status' => 'required|in:Disetujui,Ditolak,Menunggu Validasi', 'catatan_admin' => 'nullable|string']);
        $p = \App\Models\Prestasi::where('id', $itemId)->where('mahasiswa_id', $id)->firstOrFail();
        $p->update(['status' => $req->status, 'catatan_admin' => $req->catatan_admin, 'validated_by' => $req->user()->id, 'validated_at' => now()]);
        return response()->json(['data' => new \App\Http\Resources\PrestasiResource($p)]);
    }

    public function validateOrganisasi(Request $req, $id, $itemId) {
        if ($req->user()->role !== "admin") abort(403);
        $req->validate(['status' => 'required|in:Disetujui,Ditolak,Menunggu', 'catatan_admin' => 'nullable|string']);
        $o = \App\Models\Organisasi::where('id', $itemId)->where('mahasiswa_id', $id)->firstOrFail();
        $o->update(['status' => $req->status, 'catatan_admin' => $req->catatan_admin, 'validated_by' => $req->user()->id, 'validated_at' => now()]);
        return response()->json(['data' => new \App\Http\Resources\OrganisasiResource($o)]);
    }

    public function validatePelatihan(Request $req, $id, $itemId) {
        if ($req->user()->role !== "admin") abort(403);
        $req->validate(['status' => 'required|in:Disetujui,Ditolak,Menunggu', 'catatan_admin' => 'nullable|string']);
        $p = \App\Models\Pelatihan::where('id', $itemId)->where('mahasiswa_id', $id)->firstOrFail();
        $p->update(['status' => $req->status, 'catatan_admin' => $req->catatan_admin, 'validated_by' => $req->user()->id, 'validated_at' => now()]);
        return response()->json(['data' => new \App\Http\Resources\PelatihanResource($p)]);
    }

    public function bebasTanggungan(Request $request, $id)
    {
        if ($request->user()->role === "mahasiswa") abort(403);

        $m = Mahasiswa::with('user', 'prodi')->findOrFail($id);

        if ($request->user()->role === "prodi" && $m->prodi_id !== $request->user()->prodi_id) abort(403);

        $permohonan = $m->bebasTanggungan;
        $checklist = \App\Services\BebasTanggunganService::getChecklist($m);
        
        $history = [];
        if ($permohonan) {
            $history = $permohonan->histories()->with('reviewedBy')->get()->map(function($h) {
                return [
                    'tgl' => $h->created_at->format('d M Y'),
                    'catatan' => $h->catatan,
                    'oleh' => $h->reviewedBy ? $h->reviewedBy->name : 'Sistem'
                ];
            });
        }

        return response()->json([
            'success' => true,
            'mahasiswa' => [
                'id' => $m->id, 'nim' => $m->nim, 'nama' => $m->nama,
                'prodi' => $m->prodi?->nama, 'angkatan' => $m->angkatan,
            ],
            'permohonan' => $permohonan ? new \App\Http\Resources\BebasTanggunganResource($permohonan) : null,
            'checklist' => $checklist['checklist'],
            'dokumen' => $checklist['dokumen'],
            'rejection_history' => $history,
        ]);
    }

    private function warekIndex(Request $request) {
        $query = Mahasiswa::withDetails();

        if ($request->search) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $prodi = \App\Models\Prodi::where('nama', $request->prodi)->orWhere('kode', $request->prodi)->first();
            if ($prodi) $query->where('prodi_id', $prodi->id);
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua Status') {
            $query->where('status', $request->status);
        }
        if ($request->kipFilter && $request->kipFilter !== 'Semua') {
            $kategori = $request->kipFilter === 'KIP-K Reguler' ? 'Reguler' : 'Aspirasi';
            $query->where('kategori', $kategori);
        }
        if ($request->spFilter && $request->spFilter !== 'Semua') {
            if ($request->spFilter === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn($q) => $q->where('level', $request->spFilter)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }
        if ($request->ipkFilter && $request->ipkFilter !== 'Semua') {
            if ($request->ipkFilter === 'Di Bawah Standar (< 3.0)') {
                $query->having('ipk_calc', '<', 3.0);
            } else if ($request->ipkFilter === 'Di Atas Standar (≥ 3.0)') {
                $query->having('ipk_calc', '>=', 3.0);
            }
        }
        if ($request->sortBy) {
            switch ($request->sortBy) {
                case 'IPK Tertinggi → Terendah': $query->orderByDesc('ipk_calc'); break;
                case 'IPK Terendah → Tertinggi': $query->orderBy('ipk_calc'); break;
                case 'Nama A–Z': $query->orderBy('nama'); break;
                case 'Angkatan Terbaru': $query->orderByDesc('angkatan'); break;
                default: $query->orderByDesc('ipk_calc'); break;
            }
        } else {
            $query->orderByDesc('ipk_calc');
        }

        $limit = (int) ($request->limit ?? 10);
        $page  = (int) ($request->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data'        => \App\Http\Resources\MahasiswaResource::collection($data),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'totalPages'  => (int) ceil($total / $limit),
        ]);
    }

    private function warekShow($id) {
        $m = Mahasiswa::withDetails()->findOrFail($id);
        return response()->json(['data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }

    private function mahasiswaShow(Request $request, $id) {
        $m = Mahasiswa::withDetails()->findOrFail($id);
        // Pastikan hanya mahasiswa yang bersangkutan (sesuai kontrak)
        if ($m->nim !== $request->user()->username) abort(403, 'Anda tidak berhak melihat data mahasiswa lain.');
        return response()->json(['data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }
}