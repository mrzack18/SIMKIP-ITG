<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\TahunAjaranHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\MahasiswaResource;
use App\Models\AuditLog;
use App\Models\CatatanInternal;
use App\Models\Dokumen;
use App\Models\Konfigurasi;
use App\Models\Mahasiswa;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use App\Models\Prestasi;
use App\Models\Prodi;
use App\Models\User;
use App\Services\ExcelExportService;
use App\Services\PdfGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class MahasiswaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $this->listQuery($request);

        $limit = (int) ($request->limit ?? 10);
        $page = (int) ($request->page ?? 1);

        // Count total for pagination (for having clauses, we need to count manually via get or use a subquery count)
        $total = $query->count(); // If this fails with having, we may need a workaround

        $data = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'data' => MahasiswaResource::collection($data),
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => (int) ceil($total / $limit),
        ]);
    }

    /**
     * Query dasar list mahasiswa admin (filter, pencarian, sorting).
     * Dipakai oleh index (berhalaman) dan export (semua baris).
     */
    private function listQuery(Request $request)
    {
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
        }
        $query = Mahasiswa::withDetails($tahunAjaran)->with(['suratPeringatans', 'prodi']);

        if ($request->search) {
            $q = $request->search;
            $query->where(fn ($qb) => $qb->where('nim', 'like', "%$q%")->orWhere('nama', 'like', "%$q%"));
        }
        if ($request->prodi && $request->prodi !== 'Semua') {
            $prodi = Prodi::where('nama', $request->prodi)->orWhere('kode', $request->prodi)->first();
            if ($prodi) {
                $query->where('prodi_id', $prodi->id);
            }
        }
        if ($request->angkatan && $request->angkatan !== 'Semua') {
            $query->where('angkatan', $request->angkatan);
        }
        if ($request->kategori && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }
        if ($request->status && $request->status !== 'Semua Status') {
            if ($tahunAjaran) {
                // If historical, we must check if they were active AT THAT TIME.
                // The scopeWithDetails already filters out students who left BEFORE the year.
                // But if they left DURING or AFTER, they were active then.
                if ($request->status === 'Aktif') {
                    // They are historically active if they haven't left before the end of that semester
                    // Actually, scopeWithDetails already guarantees they didn't leave BEFORE the semester.
                    // To be purely historically accurate, if they were active in that semester, we show them.
                    // The simplest is to just not apply the strict CURRENT status filter, because they were active then!
                    // We'll leave this empty to allow scopeWithDetails to handle it!
                } else {
                    // For finding "Dicabut" historically, it means they were revoked IN THAT semester.
                    // (Implementation omitted for simplicity; usually people search 'Aktif' historically)
                    $query->where('status', $request->status);
                }
            } else {
                $query->where('status', $request->status);
            }
        }
        if ($request->kipFilter && $request->kipFilter !== 'Semua') {
            $kategori = $request->kipFilter === 'KIP-K Reguler' ? 'Reguler' : 'Aspirasi';
            $query->where('kategori', $kategori);
        }

        // Apply SP Filter
        if ($request->spFilter && $request->spFilter !== 'Semua') {
            if ($request->spFilter === 'Tanpa SP') {
                $query->whereDoesntHave('suratPeringatans', fn ($q) => $q->whereIn('status', ['Aktif', 'Masa Tenggang']));
            } else {
                $query->whereHas('suratPeringatans', fn ($q) => $q->where('level', $request->spFilter)->whereIn('status', ['Aktif', 'Masa Tenggang']));
            }
        }

        // We calculate IPK via subquery, so to filter by IPK we can use having or where with the subquery.
        // Easiest is to add a having clause since we added it via addSelect
        if ($request->ipkFilter && $request->ipkFilter !== 'Semua') {
            if ($request->ipkFilter === 'Di Bawah Standar (< 3.0)') {
                $query->having('ipk_calc', '<', 3.0);
            } elseif ($request->ipkFilter === 'Di Atas Standar (≥ 3.0)') {
                $query->having('ipk_calc', '>=', 3.0);
            }
        }

        // Sorting
        if ($request->sortBy) {
            switch ($request->sortBy) {
                case 'IPK Tertinggi → Terendah':
                    $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
                    break;
                case 'IPK Terendah → Tertinggi':
                    // Tanpa nilai selalu di bawah, bukan dianggap IPK terendah.
                    $query->orderByRaw('ipk_calc IS NULL')->orderBy('ipk_calc');
                    break;
                case 'Nama A–Z':
                    $query->orderBy('nama');
                    break;
                case 'Angkatan Terbaru':
                    $query->orderByDesc('angkatan');
                    break;
                default:
                    $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
                    break;
            }
        } else {
            $query->orderByRaw('ipk_calc IS NULL')->orderByDesc('ipk_calc');
        }

        return $query;
    }

    public function export(Request $request)
    {
        $format = strtolower($request->format ?? 'xlsx');

        $rows = $this->listQuery($request)->get()->map(function ($m) {
            $ipk = $m->ipk_calc !== null ? number_format((float) $m->ipk_calc, 2) : '-';
            $trend = (float) ($m->trendDelta ?? 0);
            $trendText = $trend !== 0.0 ? ($trend > 0 ? '+' : '').number_format($trend, 2) : '-';

            return [
                $m->nim,
                $m->nama,
                $m->prodi->nama ?? '-',
                $m->angkatan,
                $m->kategori,
                $ipk,
                $trendText,
                $m->semester_aktif,
                $m->status,
                $m->sp_calc ?? '-',
            ];
        })->all();

        $headers = ['NIM', 'Nama', 'Program Studi', 'Angkatan', 'Kategori', 'IPK', 'Progres IPS', 'Semester', 'Status', 'SP'];
        $filename = 'Mahasiswa_KIP-K_'.now()->format('Ymd_His').'.'.($format === 'pdf' ? 'pdf' : 'xlsx');

        return ExcelExportService::exportList($filename, $headers, $rows, $format);
    }

    /**
     * Export laporan profil lengkap satu mahasiswa (xlsx multi-sheet / pdf).
     */
    public function exportProfil(Request $request, string $nim)
    {
        $m = Mahasiswa::withDetails()->with([
            'prodi', 'ipkSemestrs', 'prestasis', 'organisasis', 'pelatihans',
            'dokumens.jenis', 'suratPeringatans',
        ])->where('nim', $nim)->firstOrFail();

        if (strtolower($request->format ?? 'xlsx') === 'pdf') {
            return PdfGeneratorService::profilMahasiswa($m);
        }

        return ExcelExportService::exportProfilMahasiswa($m);
    }

    public function checkNim(string $nim): JsonResponse
    {
        $m = Mahasiswa::where('nim', $nim)->first();

        return response()->json(['exists' => (bool) $m, 'nama' => $m?->nama]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nomor_sk' => 'required|string|max:100',
            'tanggal_sk' => 'required|date|before_or_equal:today',
            'file_sk' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'nim' => 'required|string|max:20|unique:mahasiswas,nim',
            'nama' => 'required|string|max:255',
            'prodi_id' => 'required|exists:prodis,id',
            'angkatan' => 'required|integer|between:2015,2030',
            'kategori' => 'required|in:Reguler,Aspirasi',
        ]);

        DB::beginTransaction();
        try {
            $filePath = null;
            if ($request->hasFile('file_sk')) {
                $filePath = $request->file('file_sk')->store("sk_mahasiswa/{$request->nim}", 'public');
            }

            $password = 'kip'.$request->nim.'2026';
            $user = User::create([
                'name' => $request->nama,
                'username' => $request->nim,
                'email' => strtolower(str_replace(' ', '.', $request->nama)).'@student.itg.ac.id',
                'password' => Hash::make($password),
                'role' => 'mahasiswa',
                'is_password_changed' => false,
            ]);

            $mahasiswa = Mahasiswa::create([
                'user_id' => $user->id,
                'nim' => $request->nim,
                'nama' => $request->nama,
                'prodi_id' => $request->prodi_id,
                'angkatan' => $request->angkatan,
                'kategori' => $request->kategori,
                'status' => 'Aktif',
                'nomor_sk' => $request->nomor_sk,
                'tanggal_sk' => $request->tanggal_sk,
                'file_sk' => $filePath,
            ]);

            DB::commit();

            AuditLog::catat('Tambah', "Tambah mahasiswa: {$request->nama} ({$request->nim})", [
                'terkait_nim' => $request->nim,
                'terkait_nama' => $request->nama,
            ]);

            return response()->json([
                'success' => true,
                'mahasiswa' => ['id' => $mahasiswa->id, 'nim' => $mahasiswa->nim, 'nama' => $mahasiswa->nama],
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

        return response()->json(['data' => new MahasiswaResource($m)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $request->validate(['konfirmasi_nim' => 'required|string']);

        $m = Mahasiswa::findOrFail($id);

        if ($request->konfirmasi_nim !== $m->nim) {
            return response()->json(['success' => false, 'message' => 'NIM konfirmasi tidak sesuai.'], 422);
        }

        AuditLog::catat('Hapus', "Hapus mahasiswa: {$m->nama} ({$m->nim})", [
            'terkait_nim' => $m->nim,
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
                $alasan .= ' | Catatan: '.$request->catatan_status;
            }
            $m->alasan_nonaktif = $alasan;
            $m->tanggal_nonaktif = now();
        } else {
            $m->alasan_nonaktif = null;
            $m->tanggal_nonaktif = null;
        }

        $m->save();

        AuditLog::catat('Ubah', "Mengubah status mahasiswa {$m->nama} ({$m->nim}) dari {$oldStatus} menjadi {$m->status}", [
            'terkait_nim' => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status mahasiswa berhasil diperbarui.', 'data' => new MahasiswaResource($m)]);
    }

    public function updateSk(Request $request, int $id): JsonResponse
    {
        $m = Mahasiswa::findOrFail($id);

        $validated = $request->validate([
            'nomor_sk' => 'required|string|max:100',
            'tanggal_sk' => 'required|date|before_or_equal:today',
            'kategori' => 'required|in:Reguler,Aspirasi',
            'file_sk' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'hapus_file_sk' => 'nullable|boolean',
        ]);

        $oldFile = $m->file_sk;

        if ($request->hasFile('file_sk')) {
            $m->file_sk = $request->file('file_sk')->store("sk_mahasiswa/{$m->nim}", 'public');
            if ($oldFile) {
                Storage::disk('public')->delete($oldFile);
            }
        } elseif ($request->boolean('hapus_file_sk') && $oldFile) {
            Storage::disk('public')->delete($oldFile);
            $m->file_sk = null;
        }

        $m->nomor_sk = $validated['nomor_sk'];
        $m->tanggal_sk = $validated['tanggal_sk'];
        $m->kategori = $validated['kategori'];
        $m->save();

        AuditLog::catat('Ubah', "Mengubah data SK Penetapan KIP-K mahasiswa {$m->nama} ({$m->nim})", [
            'terkait_nim' => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data SK Penetapan KIP-K berhasil diperbarui.',
            'data' => new MahasiswaResource($m->load('prodi')),
        ]);
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
            $alasan .= ' | Catatan: '.$request->catatan_cabut;
        }
        $m->alasan_dicabut = $alasan;
        $m->tanggal_dicabut = now();
        $m->dicabut_oleh = collect(explode(' ', $request->user()->name))->first();

        $semesterAktif = Konfigurasi::get('semester_aktif', 'Ganjil');
        $tahunAjaranAktif = Konfigurasi::get('tahun_akademik_aktif', date('Y').'/'.(date('Y') + 1));
        $m->semester_dicabut = $semesterAktif.' '.$tahunAjaranAktif;

        $m->save();

        AuditLog::catat('Ubah', "Mencabut KIP-K mahasiswa {$m->nama} ({$m->nim})", [
            'terkait_nim' => $m->nim,
            'terkait_nama' => $m->nama,
        ]);

        return response()->json(['success' => true, 'message' => 'Status KIP-K mahasiswa berhasil dicabut.', 'data' => new MahasiswaResource($m)]);
    }

    public function getCatatanInternal(Request $request, int $id): JsonResponse
    {
        $tahunAjaran = $request->query('tahun_ajaran');
        $query = CatatanInternal::where('mahasiswa_id', $id);

        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            $query->where('tahun_ajaran', $tahunAjaran);
        }

        $catatan = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['success' => true, 'data' => $catatan]);
    }

    public function storeCatatanInternal(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'kategori' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $request->tahun_ajaran);

        $catatan = CatatanInternal::create([
            'mahasiswa_id' => $id,
            'tahun_ajaran' => $tahunAjaran,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json(['success' => true, 'data' => $catatan]);
    }

    public function rekapAkademik(Request $request): JsonResponse
    {
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
        }
        $mahasiswas = Mahasiswa::withDetails($tahunAjaran)->with('suratPeringatans')->get()->map(function ($m) use ($tahunAjaran) {
            $spList = [];
            $range = TahunAjaranHelper::getDateRange($tahunAjaran);
            foreach ($m->suratPeringatans as $surat) {
                if ($range && $surat->tanggal_terbit <= $range[1]) {
                    $spList[] = ['level' => $surat->level, 'status' => $surat->status];
                } elseif (! $range) {
                    $spList[] = ['level' => $surat->level, 'status' => $surat->status];
                }
            }

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
                'semester' => 'Sem '.TahunAjaranHelper::calculateSemester((int) $m->angkatan, $tahunAjaran),
                'spList' => count($spList) > 0 ? $spList : null,
                'sp' => $m->sp_aktif,
                'mkBelumLulus' => $m->mk_belum_lulus,
            ];
        });

        return response()->json(['success' => true, 'data' => $mahasiswas]);
    }

    public function rekapPrestasi(Request $request): JsonResponse
    {
        $query = Prestasi::with(['mahasiswa.prodi']);
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            $query = TahunAjaranHelper::applyDateRangeFilter($query, 'tanggal_mulai', $tahunAjaran);
        }
        if ($request->mahasiswa_id) {
            $query->where('mahasiswa_id', $request->mahasiswa_id);
        }
        $prestasis = $query->latest()->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama' => $p->mahasiswa->nama,
                'nim' => $p->mahasiswa->nim,
                'prodi' => $p->mahasiswa->prodi->nama,
                'angkatan' => $p->mahasiswa->angkatan,
                'kipk' => $p->mahasiswa->kategori === 'Aspirasi' ? 'KIP-K Aspirasi' : 'KIP-K Reguler',
                'namaPrestasi' => $p->nama_prestasi,
                'tingkat' => $p->tingkat,
                'pencapaian' => $p->pencapaian,
                'penyelenggara' => $p->penyelenggara,
                'tanggalMulai' => $p->tanggal_mulai ? $p->tanggal_mulai->format('d M Y') : null,
                'tanggalSelesai' => $p->tanggal_selesai ? $p->tanggal_selesai->format('d M Y') : null,
                'tempat' => $p->tempat,
                'deskripsi' => $p->deskripsi,
                'link' => $p->link_penyelenggara,
                'status' => $p->status,
                'catatan' => $p->catatan_admin,
            ];
        });

        return response()->json(['success' => true, 'data' => $prestasis]);
    }

    public function dokumen(Request $request, int $id): JsonResponse
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        $q = Dokumen::with(['jenis', 'fieldValues.field'])
            ->where('mahasiswa_id', $id);
        TahunAjaranHelper::applyDateMaxFilter($q, 'dokumens.created_at', $request->tahun_ajaran);
        $dokumens = $q->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'jenis' => $d->jenis->nama ?? 'Lainnya',
                    'nama_file' => $d->nama_file,
                    'file_url' => $d->path_file ? url('storage/'.$d->path_file) : null,
                    'status' => $d->status,
                    'catatan' => $d->catatan_admin,
                    'tanggal_upload' => $d->created_at->format('d M Y'),
                    'is_wajib' => $d->jenis->is_wajib ?? false,
                    'fields' => $d->fieldValues->map(function ($fv) {
                        return [
                            'label' => $fv->field->label,
                            'value' => $fv->value,
                            'tipe' => $fv->field->tipe,
                        ];
                    }),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $dokumens,
        ]);
    }

    public function rekapOrganisasi(Request $request): JsonResponse
    {
        $query = Organisasi::with(['mahasiswa.prodi']);
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            $query = TahunAjaranHelper::applyOverlapFilter($query, 'periode_mulai', 'periode_selesai', $tahunAjaran);
        }
        if ($request->mahasiswa_id) {
            $query->where('mahasiswa_id', $request->mahasiswa_id);
        }
        $organisasis = $query->latest()->get()->map(function ($o) {
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
                'periodeMulai' => $o->periode_mulai ? $o->periode_mulai->format('d M Y') : null,
                'periodeSelesai' => $o->periode_selesai ? $o->periode_selesai->format('d M Y') : null,
                'deskripsi' => $o->deskripsi,
                'status' => $o->status,
                'catatan' => $o->catatan_admin,
            ];
        });

        return response()->json(['success' => true, 'data' => $organisasis]);
    }

    public function rekapPelatihan(Request $request): JsonResponse
    {
        $query = Pelatihan::with(['mahasiswa.prodi']);
        $tahunAjaran = $request->tahun_ajaran && $request->tahun_ajaran !== 'Semua' ? $request->tahun_ajaran : null;
        if ($tahunAjaran) {
            $tahunAjaran = str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $tahunAjaran);
            $query = TahunAjaranHelper::applyDateRangeFilter($query, 'tanggal_mulai', $tahunAjaran);
        }
        if ($request->mahasiswa_id) {
            $query->where('mahasiswa_id', $request->mahasiswa_id);
        }
        $pelatihans = $query->latest()->get()->map(function ($p) {
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

    /**
     * Export rekap Data Akademik & Non-Akademik (xlsx multi-sheet / pdf).
     * scope: all | ipk | prestasi | organisasi | pelatihan
     */
    public function exportRekap(Request $request)
    {
        $scope = strtolower((string) ($request->scope ?? 'all'));
        $format = strtolower((string) ($request->format ?? 'xlsx')) === 'pdf' ? 'pdf' : 'xlsx';

        $definitions = $this->rekapSheetDefinitions($request);
        $selected = ($scope === 'all' || ! isset($definitions[$scope])) ? array_keys($definitions) : [$scope];

        $sheets = [];
        foreach ($selected as $key) {
            $def = $definitions[$key];
            $sheets[] = [
                'title' => $def['title'],
                'headers' => $def['headers'],
                'rows' => array_map($def['map'], $def['data']),
            ];
        }

        $labelTahun = $request->tahun_ajaran
            ? trim(str_replace(['Tahun ', '-1', '-2'], ['', ' Ganjil', ' Genap'], $request->tahun_ajaran))
            : 'Semua';

        if ($scope !== 'all' && isset($definitions[$scope])) {
            $filename = 'Rekap_'.$definitions[$scope]['slug'].'_KIP-K_'.$labelTahun;
        } else {
            $filename = 'Data_Akademik_KIP-K_'.$labelTahun;
        }
        $filename = trim(preg_replace('/[^0-9A-Za-z]+/', '-', $filename), '-').'.'.$format;

        if ($format === 'pdf' && count($sheets) > 1) {
            return PdfGeneratorService::laporanDataAkademik($sheets, $labelTahun);
        }

        return ExcelExportService::exportRekapAkademik($filename, $sheets, $format);
    }

    /**
     * Definisi sheet rekap akademik & non-akademik (judul, header, data, mapper baris).
     */
    private function rekapSheetDefinitions(Request $request): array
    {
        $formatDelta = fn ($v) => $v === null
            ? '-'
            : (($v > 0 ? '+' : '').number_format((float) $v, 2));

        return [
            'ipk' => [
                'title' => 'Rekap IPK',
                'slug' => 'IPK',
                'headers' => ['NIM', 'Nama', 'Prodi', 'Angkatan', 'Kategori', 'IPK', 'Progres IPK', 'Semester', 'SP', 'MK Belum Lulus'],
                'data' => $this->rekapAkademik($request)->getData(true)['data'],
                'map' => fn ($r) => [
                    $r['nim'],
                    $r['nama'],
                    $r['prodi'],
                    $r['angkatan'],
                    $r['kipkLabel'],
                    $r['ipk'] !== null ? number_format((float) $r['ipk'], 2) : '-',
                    $formatDelta($r['delta'] ?? null),
                    $r['semester'],
                    $r['sp'] ?? '-',
                    $r['mkBelumLulus'] ?? '-',
                ],
            ],
            'prestasi' => [
                'title' => 'Rekap Prestasi',
                'slug' => 'Prestasi',
                'headers' => ['NIM', 'Nama', 'Prodi', 'Angkatan', 'Kategori', 'Nama Prestasi', 'Tingkat', 'Pencapaian', 'Penyelenggara', 'Tanggal Mulai', 'Tanggal Selesai', 'Tempat', 'Status'],
                'data' => $this->rekapPrestasi($request)->getData(true)['data'],
                'map' => fn ($r) => [
                    $r['nim'],
                    $r['nama'],
                    $r['prodi'],
                    $r['angkatan'],
                    $r['kipk'],
                    $r['namaPrestasi'],
                    $r['tingkat'] ?? '-',
                    $r['pencapaian'] ?? '-',
                    $r['penyelenggara'] ?? '-',
                    $r['tanggalMulai'] ?? '-',
                    $r['tanggalSelesai'] ?? '-',
                    $r['tempat'] ?? '-',
                    $r['status'] ?? '-',
                ],
            ],
            'organisasi' => [
                'title' => 'Rekap Keaktifan Organisasi',
                'slug' => 'Organisasi',
                'headers' => ['NIM', 'Nama', 'Prodi', 'Angkatan', 'Kategori', 'Organisasi', 'Jabatan', 'Periode Mulai', 'Periode Selesai', 'Status'],
                'data' => $this->rekapOrganisasi($request)->getData(true)['data'],
                'map' => fn ($r) => [
                    $r['nim'],
                    $r['nama'],
                    $r['prodi'],
                    $r['angkatan'],
                    $r['kipk'],
                    $r['organisasi'],
                    $r['jabatan'] ?? '-',
                    $r['periodeMulai'] ?? '-',
                    $r['periodeSelesai'] ?? '-',
                    $r['status'] ?? '-',
                ],
            ],
            'pelatihan' => [
                'title' => 'Rekap Pelatihan',
                'slug' => 'Pelatihan',
                'headers' => ['NIM', 'Nama', 'Prodi', 'Angkatan', 'Kategori', 'Nama Pelatihan', 'Jenis', 'Penyelenggara', 'Tanggal Mulai', 'Tanggal Selesai', 'Tempat', 'Status'],
                'data' => $this->rekapPelatihan($request)->getData(true)['data'],
                'map' => fn ($r) => [
                    $r['nim'],
                    $r['nama'],
                    $r['prodi'],
                    $r['angkatan'],
                    $r['kipk'],
                    $r['namaPelatihan'],
                    $r['jenis'] ?? '-',
                    $r['penyelenggara'] ?? '-',
                    $r['tanggalMulai'] ?? '-',
                    $r['tanggalSelesai'] ?? '-',
                    $r['tempat'] ?? '-',
                    $r['status'] ?? '-',
                ],
            ],
        ];
    }
}
