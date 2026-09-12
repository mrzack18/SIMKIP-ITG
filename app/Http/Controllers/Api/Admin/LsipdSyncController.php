<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\LsipdException;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Dokumen;
use App\Models\IpkSemestr;
use App\Models\LsipdSyncProgress;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use App\Services\LsipdClientService;
use App\Services\LsipdSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class LsipdSyncController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        try {
            $token = LsipdClientService::login();

            return response()->json([
                'success' => true,
                'data'    => [
                    'configured' => (bool) config('services.lsipd.username'),
                    'base_url'   => config('services.lsipd.base_url'),
                    'token_ok'   => $token !== null,
                ],
            ]);
        } catch (LsipdException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => ['configured' => (bool) config('services.lsipd.username')],
            ], $e->httpStatus && $e->httpStatus >= 400 && $e->httpStatus < 600 ? $e->httpStatus : 503);
        } catch (\Throwable $e) {
            Log::error('LSIPD status check failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghubungi LSIPD.',
            ], 503);
        }
    }

    public function syncAllMahasiswa(Request $request): JsonResponse
    {
        // Cegah sinkronisasi ganda bila masih ada proses yang berjalan.
        $running = LsipdSyncProgress::whereIn('status', ['pending', 'running'])
            ->orderByDesc('created_at')
            ->first();

        if ($running) {
            return response()->json([
                'success' => false,
                'message' => 'Sinkronisasi masih berjalan. Silakan tunggu hingga selesai.',
                'data'    => ['run_id' => $running->id],
            ], 409);
        }

        $runId = (string) Str::uuid();

        LsipdSyncProgress::create([
            'id'     => $runId,
            'status' => 'pending',
        ]);

        // Jalankan di background (proses CLI terpisah) supaya request HTTP
        // langsung selesai dan frontend dapat mem-poll progresnya.
        $this->runInBackground($runId);

        return response()->json([
            'success' => true,
            'data'    => ['run_id' => $runId],
            'message' => 'Sinkronisasi dimulai.',
        ]);
    }

    public function syncProgress(Request $request): JsonResponse
    {
        $query = LsipdSyncProgress::query();

        if ($request->run_id) {
            $progress = $query->where('id', $request->run_id)->first();
        } else {
            $progress = $query->orderByDesc('created_at')->first();
        }

        if (! $progress) {
            return response()->json([
                'success' => true,
                'data'    => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'               => $progress->id,
                'status'           => $progress->status,
                'phase'            => $progress->phase,
                'total'            => (int) $progress->total,
                'processed'        => (int) $progress->processed,
                'percent'          => (int) $progress->percent,
                'inserted'         => (int) $progress->inserted,
                'updated'          => (int) $progress->updated,
                'unchanged'        => (int) $progress->unchanged,
                'skipped'          => (int) $progress->skipped,
                'transkrip_success'=> (int) $progress->transkrip_success,
                'transkrip_failed' => (int) $progress->transkrip_failed,
                'message'          => $progress->message,
                'started_at'       => $progress->started_at?->toISOString(),
                'finished_at'      => $progress->finished_at?->toISOString(),
            ],
        ]);
    }

    private function runInBackground(string $runId): void
    {
        $artisan = base_path('artisan');
        $php     = PHP_BINARY ?: 'php';

        $command = sprintf(
            'nohup %s %s lsipd:sync-all %s > /dev/null 2>&1 &',
            escapeshellarg($php),
            escapeshellarg($artisan),
            escapeshellarg($runId),
        );

        exec($command);
    }

    /**
     * Sinkronkan biodata beberapa mahasiswa sekaligus (batch).
     *
     * Dipakai tabel mahasiswa di halaman Sinkronisasi: satu request untuk banyak
     * NIM, supaya memilih puluhan baris tidak memicu puluhan request HTTP yang
     * bisa timeout dari browser.
     *
     * Sengaja TIDAK memblokir saat ada sync-all berjalan (berbeda dari
     * syncAllMahasiswa) karena endpoint ini pekerjaan kecil dan terikat pilihan
     * pengguna. Hasil per-NIM selalu dilaporkan, termasuk yang gagal.
     */
    public function syncMahasiswaBatch(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nims'   => 'required|array|min:1|max:200',
            'nims.*' => 'required|string|max:30',
        ]);

        $hasil = [];

        foreach (array_values(array_unique($data['nims'])) as $nim) {
            try {
                $mahasiswa = LsipdSyncService::syncMahasiswaByNim($nim);

                $hasil[] = $mahasiswa
                    ? ['nim' => $nim, 'success' => true,  'nama' => $mahasiswa->nama, 'message' => 'Biodata diperbarui.']
                    : ['nim' => $nim, 'success' => false, 'nama' => null, 'message' => 'Biodata belum ada di SIMKIP.'];
            } catch (LsipdException $e) {
                $hasil[] = ['nim' => $nim, 'success' => false, 'nama' => null, 'message' => $e->getMessage()];
            } catch (\Throwable $e) {
                Log::error('LSIPD syncMahasiswaBatch error', ['nim' => $nim, 'error' => $e->getMessage()]);
                $hasil[] = ['nim' => $nim, 'success' => false, 'nama' => null, 'message' => 'Terjadi kesalahan saat sinkronisasi.'];
            }
        }

        $berhasil = count(array_filter($hasil, fn ($h) => $h['success']));

        if ($berhasil > 0) {
            AuditLog::catat('LSIPD Sync', "Sinkronisasi biodata {$berhasil} mahasiswa (batch)");
        }

        return response()->json([
            'success' => $berhasil > 0,
            'message' => sprintf('%d dari %d biodata mahasiswa berhasil disinkronkan.', $berhasil, count($hasil)),
            'data'    => ['hasil' => $hasil, 'berhasil' => $berhasil, 'total' => count($hasil)],
        ]);
    }

    /**
     * Sinkronkan transkrip beberapa mahasiswa sekaligus (batch).
     *
     * Sama seperti syncMahasiswaBatch(), dipakai tabel mahasiswa di halaman
     * Sinkronisasi. Satu NIM bisa memakan waktu (menarik seluruh semester), jadi
     * jumlahnya dibatasi agar tidak menabrak max_execution_time PHP.
     */
    public function syncTranskripBatch(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nims'   => 'required|array|min:1|max:50',
            'nims.*' => 'required|string|max:30',
        ]);

        $hasil = [];

        foreach (array_values(array_unique($data['nims'])) as $nim) {
            try {
                $r = LsipdSyncService::syncTranskrip($nim);

                $hasil[] = [
                    'nim'      => $nim,
                    'success'  => true,
                    'semester' => $r['semester_inserted'],
                    'mk'       => $r['mata_kuliah_inserted'],
                    'last_ipk' => $r['last_ipk'],
                    'message'  => sprintf('%d semester, %d mata kuliah.', $r['semester_inserted'], $r['mata_kuliah_inserted']),
                ];
            } catch (LsipdException $e) {
                $hasil[] = ['nim' => $nim, 'success' => false, 'semester' => 0, 'mk' => 0, 'last_ipk' => null, 'message' => $e->getMessage()];
            } catch (\Throwable $e) {
                Log::error('LSIPD syncTranskripBatch error', ['nim' => $nim, 'error' => $e->getMessage()]);
                $hasil[] = ['nim' => $nim, 'success' => false, 'semester' => 0, 'mk' => 0, 'last_ipk' => null, 'message' => 'Terjadi kesalahan saat sinkronisasi transkrip.'];
            }
        }

        $berhasil = count(array_filter($hasil, fn ($h) => $h['success']));

        if ($berhasil > 0) {
            AuditLog::catat('LSIPD Sync', "Sinkronisasi transkrip {$berhasil} mahasiswa (batch)");
        }

        return response()->json([
            'success' => $berhasil > 0,
            'message' => sprintf('%d dari %d transkrip mahasiswa berhasil disinkronkan.', $berhasil, count($hasil)),
            'data'    => ['hasil' => $hasil, 'berhasil' => $berhasil, 'total' => count($hasil)],
        ]);
    }

    /**
     * Daftar mahasiswa untuk tabel di halaman Sinkronisasi.
     *
     * Endpoint /mahasiswa sengaja tidak dipakai ulang: MahasiswaController::index()
     * hanya melayani role admin/prodi/warek dan menolak role lsipd dengan 403.
     *
     * Mendukung filter angkatan & prodi, pencarian NIM/nama, urut nama A–Z / Z–A.
     */
    public function indexMahasiswa(Request $request): JsonResponse
    {
        $query = Mahasiswa::query()->with('prodi');

        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(fn ($q) => $q->where('nim', 'like', "%{$s}%")->orWhere('nama', 'like', "%{$s}%"));
        }

        if ($request->filled('angkatan') && $request->input('angkatan') !== 'Semua') {
            $query->where('angkatan', $request->input('angkatan'));
        }

        if ($request->filled('prodi') && $request->input('prodi') !== 'Semua') {
            $p = $request->input('prodi');
            $prodi = Prodi::where('nama', $p)->orWhere('kode', $p)->first();
            // Prodi tidak dikenal -> id mustahil ada, supaya hasilnya kosong
            // ketimbang filter diam-diam diabaikan.
            $query->where('prodi_id', $prodi?->id ?? -1);
        }

        // Urutan bawaan: Nama A–Z.
        $sort = $request->input('sort') === 'desc' ? 'desc' : 'asc';
        $query->orderBy('nama', $sort);

        $limit = (int) ($request->input('limit', 10));
        $page  = (int) ($request->input('page', 1));
        $total = $query->count();
        $data  = $query->skip(($page - 1) * $limit)->take($limit)->get();

        return response()->json([
            'success' => true,
            'data'    => $data->map(fn ($m) => [
                'id'       => $m->id,
                'nim'      => $m->nim,
                'nama'     => $m->nama,
                'prodi'    => $m->prodi?->nama ?? '',
                'angkatan' => (int) $m->angkatan,
                'status'   => $m->status,
            ]),
            'total'      => $total,
            'page'       => $page,
            'limit'      => $limit,
            'totalPages' => (int) ceil($total / max($limit, 1)),
            'filter_options' => [
                'angkatans' => Mahasiswa::query()
                    ->whereNotNull('angkatan')
                    ->distinct()
                    ->orderByDesc('angkatan')
                    ->pluck('angkatan'),
            ],
        ]);
    }

    public function syncMahasiswa(Request $request, string $nim): JsonResponse
    {
        try {
            $mahasiswa = LsipdSyncService::syncMahasiswaByNim($nim);

            if (! $mahasiswa) {
                return response()->json([
                    'success' => false,
                    'message' => "Biodata NIM {$nim} belum ada di SIMKIP. Tambahkan mahasiswa dulu, lalu sinkron ulang.",
                ], 404);
            }

            AuditLog::catat('LSIPD Sync', "Sinkronisasi mahasiswa NIM {$nim} ({$mahasiswa->nama})");

            return response()->json([
                'success' => true,
                'data'    => $mahasiswa,
                'message' => "Biodata {$mahasiswa->nama} berhasil diperbarui.",
            ]);
        } catch (LsipdException $e) {
            return $this->errorResponse($e, "Gagal sinkronisasi NIM {$nim}.");
        } catch (\Throwable $e) {
            Log::error('LSIPD syncMahasiswa error', ['nim' => $nim, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat sinkronisasi mahasiswa.',
            ], 500);
        }
    }

    public function syncTranskrip(Request $request, string $nim): JsonResponse
    {
        try {
            $result = LsipdSyncService::syncTranskrip($nim);

            AuditLog::catat('LSIPD Sync', sprintf(
                'Sinkronisasi transkrip NIM %s: %d semester, %d mata kuliah, IPK terakhir %.2f',
                $nim,
                $result['semester_inserted'],
                $result['mata_kuliah_inserted'],
                $result['last_ipk'] ?? 0,
            ));

            return response()->json([
                'success' => true,
                'data'    => $result,
                'message' => sprintf(
                    'Sinkronisasi transkrip selesai: %d semester, %d mata kuliah. IPK terakhir: %s.',
                    $result['semester_inserted'],
                    $result['mata_kuliah_inserted'],
                    $result['last_ipk'] !== null ? number_format($result['last_ipk'], 2) : '—',
                ),
            ]);
        } catch (LsipdException $e) {
            return $this->errorResponse($e, "Gagal sinkronisasi transkrip NIM {$nim}.");
        } catch (\Throwable $e) {
            Log::error('LSIPD syncTranskrip error', ['nim' => $nim, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat sinkronisasi transkrip.',
            ], 500);
        }
    }

    public function deleteAllMahasiswa(Request $request): JsonResponse
    {
        $request->validate(['konfirmasi' => 'required|string']);

        if ($request->konfirmasi !== 'HAPUS SEMUA') {
            return response()->json([
                'success' => false,
                'message' => 'Kata konfirmasi tidak sesuai.',
            ], 422);
        }

        return DB::transaction(function () {
            $total = Mahasiswa::count();

            // Hapus token & akun User mahasiswa. Karena FK mahasiswas.user_id
            // cascadeOnDelete, hapus User otomatis menghapus baris mahasiswa dan
            // seluruh data ber-relasi (ipk_semestrs->mata_kuliahs, dokumens->
            // field_values, surat_peringatans, bebas_tanggungans->histories,
            // catatan_internals, organisasis, pelatihans, prestasis,
            // notifications, contact_histories).
            $userIds = Mahasiswa::pluck('user_id');

            if ($userIds->isNotEmpty()) {
                PersonalAccessToken::whereIn('tokenable_id', $userIds)
                    ->where('tokenable_type', User::class)
                    ->delete();

                User::whereIn('id', $userIds)->delete();
            }

            AuditLog::catat(
                'Hapus',
                "Hapus semua data mahasiswa: {$total} mahasiswa beserta data terkait.",
            );

            return response()->json([
                'success' => true,
                'data'    => ['deleted' => $total],
                'message' => "{$total} mahasiswa beserta seluruh data terkait dan akun loginnya telah dihapus.",
            ]);
        });
    }

    /**
     * Daftar mahasiswa yang ADA DI LSIPD tapi BELUM ADA di SIMKIP.
     *
     * Gunanya: setelah seorang mahasiswa dihapus dari SIMKIP, menjalankan
     * sync-all untuk mengembalikannya itu berat (menarik seluruh daftar lalu
     * meng-upsert semuanya). Endpoint ini menunjukkan tepat siapa yang kurang,
     * sehingga bisa disinkronkan seperlunya lewat endpoint batch yang sudah ada.
     *
     * LSIPD hanya menyediakan daftar lengkap mahasiswa (tidak ada endpoint per
     * NIM untuk biodata), jadi perbandingan ini memang butuh satu tarikan daftar.
     * Karena itu aksinya eksplisit (tombol Perbarui), bukan dimuat otomatis.
     */
    public function belumTersinkron(Request $request): JsonResponse
    {
        try {
            $daftar = LsipdClientService::getMahasiswaList();
        } catch (\Throwable $e) {
            Log::warning('LSIPD belumTersinkron gagal', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengambil daftar mahasiswa dari LSIPD. Periksa koneksi/konfigurasi API.',
            ], 502);
        }

        // NIM lokal dipakai untuk mencari selisih. Dua-duanya di-trim karena NIM
        // dari LSIPD bisa mengandung spasi tak sengaja.
        $nimLokal = Mahasiswa::pluck('nim')
            ->map(fn ($n) => trim((string) $n))
            ->filter()
            ->flip();

        $belum = [];
        foreach ($daftar as $item) {
            $nim = trim((string) ($item['nim'] ?? ''));
            if ($nim === '' || $nimLokal->has($nim)) {
                continue;
            }
            $belum[] = [
                'nim'      => $nim,
                'nama'     => (string) ($item['nama'] ?? ''),
                'prodi'    => (string) ($item['prodi_kode'] ?? ''),
                'angkatan' => (int) ($item['angkatan'] ?? 0),
            ];
        }

        // Urut nama A–Z supaya konsisten dengan tabel lain di halaman ini.
        usort($belum, fn ($a, $b) => strcasecmp($a['nama'], $b['nama']));

        return response()->json([
            'success' => true,
            'data'    => $belum,
            'total'   => count($belum),
            'total_lsipd' => count($daftar),
            'total_lokal' => $nimLokal->count(),
            'filter_options' => [
                'angkatans' => collect($belum)->pluck('angkatan')
                    ->filter()->unique()->sortDesc()->values()->all(),
                'prodis'    => collect($belum)->pluck('prodi')
                    ->filter()->unique()->sort()->values()->all(),
            ],
        ]);
    }

    /**
     * Hapus satu mahasiswa beserta seluruh data terkait dan akun loginnya.
     *
     * Pola hapusnya sengaja SAMA dengan deleteAllMahasiswa(): hapus User dulu,
     * lalu FK mahasiswas.user_id (CASCADE) yang menghapus baris mahasiswa beserta
     * ipk_semestrs->mata_kuliahs, dokumens, surat_peringatans, bebas_tanggungans,
     * catatan_internals, organisasis, pelatihans, dan prestasis.
     *
     * Bila user_id ternyata kosong (mis. baris hasil impor tanpa akun), baris
     * mahasiswanya dihapus langsung supaya tidak meninggalkan data yatim.
     */
    public function deleteMahasiswa(Request $request, string $nim): JsonResponse
    {
        $mahasiswa = Mahasiswa::where('nim', $nim)->first();

        if (! $mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => "Mahasiswa dengan NIM {$nim} tidak ditemukan.",
            ], 404);
        }

        $mahasiswaId = $mahasiswa->id;
        $nama        = $mahasiswa->nama;
        $userId      = $mahasiswa->user_id;

        return DB::transaction(function () use ($nim, $nama, $mahasiswaId, $userId) {
            // Hitung dulu untuk laporan, sebelum datanya ikut terhapus.
            $rincian = [
                'semester' => IpkSemestr::where('mahasiswa_id', $mahasiswaId)->count(),
                'dokumen'  => Dokumen::where('mahasiswa_id', $mahasiswaId)->count(),
            ];

            if ($userId) {
                PersonalAccessToken::where('tokenable_id', $userId)
                    ->where('tokenable_type', User::class)
                    ->delete();
                User::where('id', $userId)->delete();
            } else {
                Mahasiswa::where('id', $mahasiswaId)->delete();
            }

            // Pastikan benar-benar terhapus (mis. baris tanpa akun yang tidak
            // ikut ter-cascade karena user_id NULL).
            Mahasiswa::where('nim', $nim)->delete();

            AuditLog::catat('Hapus', "Hapus data mahasiswa {$nama} (NIM {$nim}) beserta data terkait.");

            return response()->json([
                'success' => true,
                'data'    => ['nim' => $nim, 'nama' => $nama, 'rincian' => $rincian],
                'message' => "Data {$nama} (NIM {$nim}) beserta seluruh data terkait dan akun loginnya telah dihapus.",
            ]);
        });
    }

    private function errorResponse(LsipdException $e, string $fallback): JsonResponse
    {
        $status = $e->httpStatus && $e->httpStatus >= 400 && $e->httpStatus < 600
            ? $e->httpStatus
            : 502;

        Log::warning('LSIPD error', [
            'message' => $e->getMessage(),
            'status'  => $status,
            'context' => $e->context,
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage() ?: $fallback,
        ], $status);
    }
}
