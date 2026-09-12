<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\LsipdException;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\LsipdSyncProgress;
use App\Models\Mahasiswa;
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
