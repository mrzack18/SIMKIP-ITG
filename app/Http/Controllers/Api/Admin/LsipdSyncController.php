<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\LsipdException;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Services\LsipdClientService;
use App\Services\LsipdSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        try {
            $stats = LsipdSyncService::syncAllMahasiswa();

            AuditLog::catat('LSIPD Sync', sprintf(
                'Sinkronisasi %d mahasiswa KIP-K (inserted=%d, updated=%d, skipped=%d)',
                $stats['total'], $stats['inserted'], $stats['updated'], $stats['skipped'],
            ));

            return response()->json([
                'success' => true,
                'data'    => $stats,
                'message' => sprintf(
                    'Sinkron selesai: %d inserted, %d updated, %d skipped dari %d total.',
                    $stats['inserted'], $stats['updated'], $stats['skipped'], $stats['total'],
                ),
            ]);
        } catch (LsipdException $e) {
            return $this->errorResponse($e, 'Gagal sinkronisasi mahasiswa dari LSIPD.');
        } catch (\Throwable $e) {
            Log::error('LSIPD syncAllMahasiswa error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat sinkronisasi mahasiswa.',
            ], 500);
        }
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
