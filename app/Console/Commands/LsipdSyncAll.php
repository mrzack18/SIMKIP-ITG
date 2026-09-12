<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use App\Models\LsipdSyncProgress;
use App\Models\Mahasiswa;
use App\Services\LsipdSyncService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class LsipdSyncAll extends Command
{
    protected $signature = 'lsipd:sync-all {runId}';

    protected $description = 'Sinkronkan semua mahasiswa LSIPD dengan progress tersimpan di DB';

    public function handle(): int
    {
        $runId = (string) $this->argument('runId');

        /** @var LsipdSyncProgress|null $progress */
        $progress = LsipdSyncProgress::find($runId);

        if (! $progress) {
            $this->error("Progress run {$runId} tidak ditemukan.");

            return self::FAILURE;
        }

        $progress->update([
            'status'     => 'running',
            'phase'      => 'biodata',
            'started_at' => now(),
        ]);

        try {
            // Fase 1: sinkronisasi biodata mahasiswa.
            $stats = LsipdSyncService::syncAllMahasiswa(function (array $stats, int $processed, int $total) use ($progress) {
                $progress->update([
                    'phase'     => 'biodata',
                    'processed' => $processed,
                    'total'     => $total,
                    'inserted'  => $stats['inserted'],
                    'updated'   => $stats['updated'],
                    'unchanged' => $stats['unchanged'],
                    'skipped'   => $stats['skipped'],
                    'message'   => $total > 0
                        ? "Menyinkronkan biodata {$processed} dari {$total} mahasiswa..."
                        : 'Menunggu data dari LSIPD...',
                ]);
            });

            // Fase 2: sinkronisasi transkrip (mata kuliah, IPS, IPK, semester).
            $trStats = LsipdSyncService::syncAllTranskrip(function (array $s, Mahasiswa $mhs) use ($progress) {
                $progress->update([
                    'phase'             => 'transkrip',
                    'processed'         => $s['total'],
                    'total'             => $s['total'],
                    'transkrip_success' => $s['success'],
                    'transkrip_failed'  => $s['failed'],
                    'message'           => "Menyinkronkan transkrip {$s['total']} mahasiswa... ({$mhs->nim})",
                ]);
            });

            $progress->update([
                'status'            => 'success',
                'processed'         => $stats['total'],
                'total'             => $stats['total'],
                'inserted'          => $stats['inserted'],
                'updated'           => $stats['updated'],
                'unchanged'         => $stats['unchanged'],
                'skipped'           => $stats['skipped'],
                'transkrip_success' => $trStats['success'],
                'transkrip_failed'  => $trStats['failed'],
                'finished_at'       => now(),
                'message'           => sprintf(
                    'Sinkron selesai: %d baru, %d diperbarui, %d tidak berubah, %d dilewati. Transkrip: %d berhasil, %d gagal.',
                    $stats['inserted'], $stats['updated'], $stats['unchanged'], $stats['skipped'],
                    $trStats['success'], $trStats['failed'],
                ),
            ]);

            AuditLog::catat('LSIPD Sync', sprintf(
                'Sinkronisasi %d mahasiswa KIP-K (inserted=%d, updated=%d, unchanged=%d, skipped=%d; transkrip: %d ok, %d gagal)',
                $stats['total'], $stats['inserted'], $stats['updated'], $stats['unchanged'], $stats['skipped'],
                $trStats['success'], $trStats['failed'],
            ));

            return self::SUCCESS;
        } catch (\Throwable $e) {
            Log::error('LSIPD background sync error', ['error' => $e->getMessage()]);

            $progress->update([
                'status'      => 'failed',
                'finished_at' => now(),
                'message'     => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);

            return self::FAILURE;
        }
    }
}
