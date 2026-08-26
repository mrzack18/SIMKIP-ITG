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
        $m = Mahasiswa::withDetails()->findOrFail($id);

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


}
