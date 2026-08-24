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

class MahasiswaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Mahasiswa::with('prodi')
            ->withCount(['suratPeringatans as sp_count' => fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang'])]);

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
        if ($request->status && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }
        if ($request->sp && $request->sp !== 'Semua') {
            if ($request->sp === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn($q) => $q->where('level', $request->sp)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }

        $limit = (int) ($request->limit ?? 10);
        $page  = (int) ($request->page ?? 1);
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        $result = $data->map(function ($m) {
            $ipkSemesters = $m->ipkSemestrs()->orderBy('semester')->get();
            $ipkTerakhir  = $ipkSemesters->last()?->ipk ?? 0;
            $prevIPK      = $ipkSemesters->count() > 1 ? $ipkSemesters->nth($ipkSemesters->count() - 1)?->ipk ?? null : null;
            $spAktif      = $m->suratPeringatans()->whereIn('status', ['Aktif', 'Masa Tenggang'])->orderByDesc('level')->first();

            return [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama,
                'angkatan' => $m->angkatan,
                'kategori' => $m->kategori,
                'status'   => $m->status,
                'ipk'      => (float) $ipkTerakhir,
                'ipk_delta'=> $prevIPK !== null ? round($ipkTerakhir - $prevIPK, 2) : null,
                'semester' => $ipkSemesters->count(),
                'sp'       => $spAktif?->level,
            ];
        });

        return response()->json([
            'success'     => true,
            'data'        => $result,
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'total_pages' => (int) ceil($total / $limit),
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
        $m = Mahasiswa::with([
            'prodi', 'user',
            'ipkSemestrs.mataKuliahs',
            'dokumens.jenis',
            'suratPeringatans.diterbitkanOleh',
            'prestasis',
            'organisasis',
            'pelatihans',
            'bebasTanggungan',
        ])->findOrFail($id);

        return response()->json(['success' => true, 'data' => $this->formatMahasiswaDetail($m)]);
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

    private function formatMahasiswaDetail(Mahasiswa $m): array
    {
        $ipkHistory = $m->ipkSemestrs->map(fn($s) => [
            'id'           => $s->id,
            'semester'     => $s->semester,
            'tahun_ajaran' => $s->tahun_ajaran,
            'ipk'          => (float) $s->ipk,
            'is_verified'  => $s->is_verified,
            'mata_kuliah'  => $s->mataKuliahs->map(fn($mk) => [
                'kode'        => $mk->kode,
                'nama'        => $mk->nama,
                'sks'         => $mk->sks,
                'nilai_huruf' => $mk->nilai_huruf,
                'nilai_mutu'  => (float) $mk->nilai_mutu,
                'lulus'       => (bool) $mk->lulus,
            ]),
        ]);

        $spAktif = $m->suratPeringatans->where('status', 'Aktif')->sortByDesc('level')->first();

        return [
            'id'        => $m->id,
            'nim'       => $m->nim,
            'nama'      => $m->nama,
            'prodi'     => $m->prodi?->nama,
            'angkatan'  => $m->angkatan,
            'kategori'  => $m->kategori,
            'status'    => $m->status,
            'nomor_sk'  => $m->nomor_sk,
            'tanggal_sk'=> $m->tanggal_sk?->format('d M Y'),
            'sp_aktif'  => $spAktif?->level,
            'ipk_history' => $ipkHistory,
            'dokumens'  => $m->dokumens->map(fn($d) => [
                'id'           => $d->id,
                'jenis'        => $d->jenis->nama,
                'status'       => $d->status,
                'catatan_admin'=> $d->catatan_admin,
                'tanggal_upload'=> $d->created_at->format('d M Y'),
                'path_file'    => $d->path_file ? asset('storage/' . $d->path_file) : null,
            ]),
            'surat_peringatans' => $m->suratPeringatans->map(fn($sp) => [
                'id'             => $sp->id,
                'level'          => $sp->level,
                'jenis'          => $sp->jenis_pelanggaran,
                'deskripsi'      => $sp->deskripsi,
                'tanggal_terbit' => $sp->tanggal_terbit?->format('d M Y'),
                'batas_evaluasi' => $sp->batas_evaluasi?->format('d M Y'),
                'status'         => $sp->status,
                'sisa_hari'      => $sp->sisa_hari,
            ]),
            'prestasis'  => $m->prestasis,
            'organisasis'=> $m->organisasis,
            'pelatihans' => $m->pelatihans,
        ];
    }
}
