<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\Notification;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\Konfigurasi;

class MahasiswaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Mahasiswa::withDetails();

        if ($request->search) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $prodi = Prodi::where('nama', $request->prodi)->orWhere('kode', $request->prodi)->first();
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

        // Apply SP Filter
        if ($request->spFilter && $request->spFilter !== 'Semua') {
            if ($request->spFilter === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn($q) => $q->where('level', $request->spFilter)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }

        // We calculate IPK via subquery, so to filter by IPK we can use having or where with the subquery.
        // Easiest is to add a having clause since we added it via addSelect
        if ($request->ipkFilter && $request->ipkFilter !== 'Semua') {
            if ($request->ipkFilter === 'Di Bawah Standar (< 3.0)') {
                $query->having('ipk_calc', '<', 3.0);
            } else if ($request->ipkFilter === 'Di Atas Standar (≥ 3.0)') {
                $query->having('ipk_calc', '>=', 3.0);
            }
        }

        // Sorting
        if ($request->sortBy) {
            switch ($request->sortBy) {
                case 'IPK Tertinggi → Terendah':
                    $query->orderByDesc('ipk_calc');
                    break;
                case 'IPK Terendah → Tertinggi':
                    $query->orderBy('ipk_calc');
                    break;
                case 'Nama A–Z':
                    $query->orderBy('nama');
                    break;
                case 'Angkatan Terbaru':
                    $query->orderByDesc('angkatan');
                    break;
                default:
                    $query->orderByDesc('ipk_calc');
                    break;
            }
        } else {
            $query->orderByDesc('ipk_calc');
        }

        $limit = (int) ($request->limit ?? 10);
        $page  = (int) ($request->page ?? 1);
        
        // Count total for pagination (for having clauses, we need to count manually via get or use a subquery count)
        $total = $query->count(); // If this fails with having, we may need a workaround
        
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data'        => \App\Http\Resources\MahasiswaResource::collection($data),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'totalPages'  => (int) ceil($total / $limit),
        ]);
    }

    public function checkNim(string $nim): JsonResponse
    {
        $m = Mahasiswa::where('nim', $nim)->first();
        return response()->json(['exists' => (bool) $m, 'nama' => $m?->nama]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nomor_sk'   => 'required|string|max:100',
            'tanggal_sk' => 'required|date|before_or_equal:today',
            'file_sk'    => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'nim'        => 'required|string|max:20|unique:mahasiswas,nim',
            'nama'       => 'required|string|max:255',
            'prodi_id'   => 'required|exists:prodis,id',
            'angkatan'   => 'required|integer|between:2015,2030',
            'kategori'   => 'required|in:Reguler,Aspirasi',
        ]);

        DB::beginTransaction();
        try {
            $filePath = null;
            if ($request->hasFile('file_sk')) {
                $filePath = $request->file('file_sk')->store("sk_mahasiswa/{$request->nim}", 'public');
            }

            $password = 'kip' . $request->nim . '2026';
            $user = User::create([
                'name'     => $request->nama,
                'username' => $request->nim,
                'email'    => strtolower(str_replace(' ', '.', $request->nama)) . '@student.itg.ac.id',
                'password' => Hash::make($password),
                'role'     => 'mahasiswa',
                'is_password_changed' => false,
            ]);

            $mahasiswa = Mahasiswa::create([
                'user_id'    => $user->id,
                'nim'        => $request->nim,
                'nama'       => $request->nama,
                'prodi_id'   => $request->prodi_id,
                'angkatan'   => $request->angkatan,
                'kategori'   => $request->kategori,
                'status'     => 'Aktif',
                'nomor_sk'   => $request->nomor_sk,
                'tanggal_sk' => $request->tanggal_sk,
                'file_sk'    => $filePath,
            ]);

            DB::commit();

            AuditLog::catat('Tambah', "Tambah mahasiswa: {$request->nama} ({$request->nim})", [
                'terkait_nim'  => $request->nim,
                'terkait_nama' => $request->nama,
            ]);

            return response()->json([
                'success'     => true,
                'mahasiswa'   => ['id' => $mahasiswa->id, 'nim' => $mahasiswa->nim, 'nama' => $mahasiswa->nama],
                'credentials' => ['username' => $request->nim, 'password' => $password],
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $m = Mahasiswa::withDetails()->with(['user.contactHistories'])->findOrFail($id);

        return response()->json(['data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $request->validate(['konfirmasi_nim' => 'required|string']);

        $m = Mahasiswa::findOrFail($id);

        if ($request->konfirmasi_nim !== $m->nim) {
            return response()->json(['success' => false, 'message' => 'NIM konfirmasi tidak sesuai.'], 422);
        }

        AuditLog::catat('Hapus', "Hapus mahasiswa: {$m->nama} ({$m->nim})", [
            'terkait_nim'  => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        $m->user()->delete();

        return response()->json(['success' => true, 'message' => 'Mahasiswa berhasil dihapus.']);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:Aktif,Nonaktif',
            'alasan_status' => 'required_if:status,Nonaktif|string|nullable',
            'catatan_status' => 'nullable|string',
        ]);

        $m = Mahasiswa::findOrFail($id);
        
        $oldStatus = $m->status;
        $m->status = $request->status;
        
        if ($request->status === 'Nonaktif') {
            $alasan = $request->alasan_status;
            if ($request->catatan_status) {
                $alasan .= ' | Catatan: ' . $request->catatan_status;
            }
            $m->alasan_nonaktif = $alasan;
            $m->tanggal_nonaktif = now();
        } else {
            $m->alasan_nonaktif = null;
            $m->tanggal_nonaktif = null;
        }

        $m->save();

        AuditLog::catat('Ubah', "Mengubah status mahasiswa {$m->nama} ({$m->nim}) dari {$oldStatus} menjadi {$m->status}", [
            'terkait_nim'  => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status mahasiswa berhasil diperbarui.', 'data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }

    public function cabutKipk(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'alasan_cabut' => 'required|string',
            'catatan_cabut' => 'nullable|string',
            'konfirmasi_nim' => 'required|string',
        ]);

        $m = Mahasiswa::findOrFail($id);

        if ($request->konfirmasi_nim !== $m->nim) {
            return response()->json(['success' => false, 'message' => 'NIM konfirmasi tidak sesuai.'], 422);
        }

        $oldStatus = $m->status;
        $m->status = 'Dicabut';
        
        $alasan = $request->alasan_cabut;
        if ($request->catatan_cabut) {
            $alasan .= ' | Catatan: ' . $request->catatan_cabut;
        }
        $m->alasan_dicabut = $alasan;
        $m->tanggal_dicabut = now();
        $m->dicabut_oleh = collect(explode(' ', $request->user()->name))->first();
        
        $semesterAktif = Konfigurasi::get('semester_aktif', 'Ganjil');
        $tahunAjaranAktif = Konfigurasi::get('tahun_akademik_aktif', date('Y') . '/' . (date('Y') + 1));
        $m->semester_dicabut = $semesterAktif . ' ' . $tahunAjaranAktif;
        
        $m->save();

        AuditLog::catat('Ubah', "Mencabut KIP-K mahasiswa {$m->nama} ({$m->nim})", [
            'terkait_nim'  => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status KIP-K mahasiswa berhasil dicabut.', 'data' => new \App\Http\Resources\MahasiswaResource($m)]);
    }    public function rekapAkademik(Request $request): JsonResponse
    {
        $mahasiswas = Mahasiswa::withDetails()->get()->map(function($m) {
            return [
                'id' => $m->id,
                'nim' => $m->nim,
                'nama' => $m->nama,
                'prodi' => $m->prodi->nama,
                'angkatan' => $m->angkatan,
                'kategori' => $m->kategori,
                'kipkLabel' => $m->kategori === 'Aspirasi' ? 'KIP-K Aspirasi' : 'KIP-K Reguler',
                'ipk' => $m->ipk_terakhir,
                'delta' => $m->trend_delta_calc,
                'semester' => 'Semester ' . $m->semester_aktif,
                'sp' => $m->sp_aktif,
                'mkBelumLulus' => $m->mk_belum_lulus,
            ];
        });
        return response()->json(['success' => true, 'data' => $mahasiswas]);
    }

    public function rekapPrestasi(Request $request): JsonResponse
    {
        $prestasis = \App\Models\Prestasi::with(['mahasiswa.prodi'])->latest()->get()->map(function($p) {
            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama' => $p->mahasiswa->nama,
                'nim' => $p->mahasiswa->nim,
                'prodi' => $p->mahasiswa->prodi->nama,
                'angkatan' => $p->mahasiswa->angkatan,
                'kipk' => $p->mahasiswa->kategori === 'Aspirasi' ? 'KIP-K Aspirasi' : 'KIP-K Reguler',
                'namaPrestasi' => $p->nama,
                'tingkat' => $p->tingkat,
                'pencapaian' => $p->pencapaian,
                'penyelenggara' => $p->penyelenggara,
                'tanggal' => $p->tanggal ? $p->tanggal->format('d M Y') : null,
                'tempat' => $p->tempat,
                'deskripsi' => $p->deskripsi,
                'link' => $p->link,
                'status' => $p->status,
                'catatan' => $p->catatan_admin,
            ];
        });
        return response()->json(['success' => true, 'data' => $prestasis]);
    }

    public function dokumen(Request $request, int $id): JsonResponse
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        $dokumens = \App\Models\Dokumen::with('jenis')
            ->where('mahasiswa_id', $id)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'jenis' => $d->jenis->nama ?? 'Lainnya',
                    'nama_file' => $d->nama_file,
                    'file_url' => $d->path_file ? url('storage/' . $d->path_file) : null,
                    'status' => $d->status,
                    'catatan' => $d->catatan_admin,
                    'tanggal_upload' => $d->created_at->format('d M Y'),
                    'is_wajib' => $d->jenis->is_wajib ?? false,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $dokumens
        ]);
    }

    public function rekapOrganisasi(Request $request): JsonResponse
    {
        $organisasis = \App\Models\Organisasi::with(['mahasiswa.prodi'])->latest()->get()->map(function($o) {
            return [
                'id' => $o->id,
                'mahasiswa_id' => $o->mahasiswa_id,
                'nama' => $o->mahasiswa->nama,
                'nim' => $o->mahasiswa->nim,
                'prodi' => $o->mahasiswa->prodi->nama,
                'angkatan' => $o->mahasiswa->angkatan,
                'kipk' => $o->mahasiswa->kategori === 'Aspirasi' ? 'KIP-K Aspirasi' : 'KIP-K Reguler',
                'organisasi' => $o->nama,
                'jabatan' => $o->jabatan,
                'periodeMulai' => $o->periode_mulai,
                'periodeSelesai' => $o->periode_selesai,
                'deskripsi' => $o->deskripsi,
                'status' => $o->status,
                'catatan' => $o->catatan_admin,
            ];
        });
        return response()->json(['success' => true, 'data' => $organisasis]);
    }

    public function rekapPelatihan(Request $request): JsonResponse
    {
        $pelatihans = \App\Models\Pelatihan::with(['mahasiswa.prodi'])->latest()->get()->map(function($p) {
            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama' => $p->mahasiswa->nama,
                'nim' => $p->mahasiswa->nim,
                'prodi' => $p->mahasiswa->prodi->nama,
                'angkatan' => $p->mahasiswa->angkatan,
                'kipk' => $p->mahasiswa->kategori === 'Aspirasi' ? 'KIP-K Aspirasi' : 'KIP-K Reguler',
                'namaPelatihan' => $p->nama,
                'jenis' => $p->jenis,
                'penyelenggara' => $p->penyelenggara,
                'tanggalMulai' => $p->tanggal_mulai ? $p->tanggal_mulai->format('d M Y') : null,
                'tanggalSelesai' => $p->tanggal_selesai ? $p->tanggal_selesai->format('d M Y') : null,
                'tempat' => $p->tempat,
                'deskripsi' => $p->deskripsi,
                'status' => $p->status,
                'catatan' => $p->catatan_admin,
            ];
        });
        return response()->json(['success' => true, 'data' => $pelatihans]);
    }
}
