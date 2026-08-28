<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\BebasTanggungan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TestBebasTanggungan extends Command
{
    protected $signature = 'test:bt';
    protected $description = 'Test Bebas Tanggungan Module';

    public function handle()
    {
        $this->info("--- START TESTING ---");
        DB::beginTransaction();
        try {
            $admin = User::where('role', 'admin')->first();
            $mhsUser = User::where('role', 'mahasiswa')->first();

            $this->info("1. API GET Mahasiswa");
            $reqGet1 = Request::create('/api/bebas-tanggungan', 'GET');
            $resGet1 = app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqGet1->setUserResolver(fn() => $mhsUser));
            $dataGet1 = json_decode($resGet1->getContent(), true);
            if (!in_array($dataGet1['status'] ?? null, ['belum', 'menunggu', 'diterbitkan', 'ditolak'])) {
                throw new \Exception("Status is invalid: " . ($dataGet1['status'] ?? 'null') . " \nResponse: " . $resGet1->getContent());
            }
            $this->info("  [PASS] GET mengembalikan struktur yang benar: {$dataGet1['status']}");

            $this->info("2. Admin Reject Action & History");
            $bt = clone BebasTanggungan::create([
                'mahasiswa_id' => $mhsUser->mahasiswa->id,
                'tanggal_ajukan' => now(),
                'status' => 'Menunggu'
            ]);
            
            // First reject
            $reqRej1 = Request::create("/api/bebas-tanggungan/{$bt->id}/reject", 'PATCH', ['alasan' => 'Tolak 1']);
            app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqRej1->setUserResolver(fn() => $admin));
            
            // Second reject
            $bt->update(['status' => 'Menunggu']);
            $reqRej2 = Request::create("/api/bebas-tanggungan/{$bt->id}/reject", 'PATCH', ['alasan' => 'Tolak 2']);
            app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqRej2->setUserResolver(fn() => $admin));
            
            $bt->refresh();
            if ($bt->histories->count() !== 2) {
                throw new \Exception("Histories count mismatch! Expected 2, got " . $bt->histories->count());
            }
            $this->info("  [PASS] Admin reject creates multiple history records.");

            $this->info("3. Mahasiswa GET exposes rejectionHistory");
            $reqGet2 = Request::create('/api/bebas-tanggungan', 'GET');
            $resGet2 = app()->make(\Illuminate\Contracts\Http\Kernel::class)->handle($reqGet2->setUserResolver(fn() => $mhsUser));
            $dataGet2 = json_decode($resGet2->getContent(), true);
            if (!isset($dataGet2['data']['rejectionHistory']) || count($dataGet2['data']['rejectionHistory']) !== 2) {
                throw new \Exception("rejectionHistory is missing or count is not 2!");
            }
            $this->info("  [PASS] Mahasiswa GET exposes rejectionHistory properly.");

            DB::rollBack();
            $this->info("--- ALL TESTS PASSED ---");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("\n[FAIL] " . $e->getMessage());
        }
    }
}
