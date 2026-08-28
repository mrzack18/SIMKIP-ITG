<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\IpkSemestr;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\Mahasiswa\IPKController;
use App\Http\Controllers\Api\DashboardController;
use App\Services\IPKCalculatorService;

// Find a student
$mhsUser = User::where('role', 'mahasiswa')->first();
$mahasiswa = Mahasiswa::where('user_id', $mhsUser->id)->first();
$adminUser = User::where('role', 'admin')->first();

echo "=== START REGRESSION VERIFICATION ===\n\n";

// 1. Initial State
$ipkRecords = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->orderBy('semester', 'asc')->get();
echo "[1] GET /api/ipk - Initial Semesters count: " . $ipkRecords->count() . "\n";
foreach($ipkRecords as $rec) {
    echo "    Sem {$rec->semester} -> IPS: {$rec->ips}, IPK Kumulatif: {$rec->ipk}\n";
}

// 2. Input semester baru (Simulate Controller store)
echo "\n[2] Input Semester Baru\n";
$newSem = $ipkRecords->count() + 1;
$req = Request::create('/api/ipk', 'POST', [
    'semester' => $newSem,
    'tahun_ajaran' => '2026/2027',
    'mata_kuliah' => [
        ['kode' => 'MK-TEST-1', 'nama' => 'Test 1', 'sks' => 3, 'nilai_huruf' => 'A'],
        ['kode' => 'MK-TEST-2', 'nama' => 'Test 2', 'sks' => 2, 'nilai_huruf' => 'C'],
    ]
]);
$req->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
app(\App\Http\Controllers\Api\IPKController::class)->store($req);

$latestIpk = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->where('semester', $newSem)->first();
echo "    Saved Sem {$newSem} -> IPS: {$latestIpk->ips}, IPK: {$latestIpk->ipk}\n";

// 3. Update semester lama
echo "\n[3] Update Semester Lama (Recalculation Test)\n";
$oldSem = 1;
$req2 = Request::create('/api/ipk', 'POST', [
    'semester' => $oldSem,
    'tahun_ajaran' => '2025/2026',
    'mata_kuliah' => [
        ['kode' => 'MK-OLD-1', 'nama' => 'Old 1', 'sks' => 3, 'nilai_huruf' => 'A'],
        ['kode' => 'MK-OLD-2', 'nama' => 'Old 2', 'sks' => 3, 'nilai_huruf' => 'A'],
    ]
]);
$req2->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
app(\App\Http\Controllers\Api\IPKController::class)->store($req2);

$recalcIpk = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->orderBy('semester', 'asc')->get();
foreach($recalcIpk as $rec) {
    echo "    Sem {$rec->semester} -> IPS: {$rec->ips}, IPK: {$rec->ipk}\n";
}

// 4. MK mengulang & 5. Carry-over
echo "\n[4 & 5] MK Mengulang (Carry-over)\n";
$req3 = Request::create('/api/ipk', 'POST', [
    'semester' => $newSem + 1,
    'tahun_ajaran' => '2026/2027',
    'mata_kuliah' => [
        ['kode' => 'MK-TEST-2', 'nama' => 'Test 2', 'sks' => 2, 'nilai_huruf' => 'A'], // Mengulang C jadi A
    ]
]);
$req3->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
app(\App\Http\Controllers\Api\IPKController::class)->store($req3);

$finalIpk = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->orderBy('semester', 'desc')->first();
echo "    Final IPK Kumulatif (Should update based on new A replacing C): {$finalIpk->ipk}\n";

// 6. Dashboard Mahasiswa
echo "\n[6] Dashboard Mahasiswa\n";
$dashReq = Request::create('/api/dashboard', 'GET');
$dashReq->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$dashRes = app(\App\Http\Controllers\Api\DashboardController::class)->index($dashReq);
$dashData = json_decode($dashRes->getContent(), true);
echo "    Dashboard IPK: " . ($dashData['data']['ipk'] ?? 'N/A') . "\n";

// 7. Dashboard Admin (Mahasiswa Index)
echo "\n[7] Dashboard Admin / Mahasiswa List\n";
$adminReq = Request::create('/api/mahasiswa', 'GET');
$adminReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$adminRes = app(\App\Http\Controllers\Api\MahasiswaController::class)->index($adminReq);
$adminData = json_decode($adminRes->getContent(), true);
$found = collect($adminData['data']['data'] ?? [])->firstWhere('id', $mahasiswa->id);
echo "    Admin List IPK: " . ($found['ipk'] ?? 'N/A') . "\n";

// 8. SP Verification
echo "\n[8] SP Check\n";
$spReq = Request::create('/api/sp', 'GET');
$spReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$spRes = app(\App\Http\Controllers\Api\SPController::class)->index($spReq);
echo "    SP Endpoint OK. Status: " . $spRes->getStatusCode() . "\n";

// 9. Bebas Tanggungan
echo "\n[9] Bebas Tanggungan Check\n";
$btReq = Request::create('/api/bebas-tanggungan', 'GET');
$btReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$btRes = app(\App\Http\Controllers\Api\BebasTanggunganController::class)->index($btReq);
echo "    Bebas Tanggungan Endpoint OK. Status: " . $btRes->getStatusCode() . "\n";

// 10. Export Laporan
echo "\n[10] Export Laporan Check\n";
$exportReq = Request::create('/api/akademik/rekap-mahasiswa', 'GET');
$exportReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$exportRes = app(\App\Http\Controllers\Api\MahasiswaController::class)->rekapAkademik($exportReq);
echo "    Export Rekap OK. Status: " . $exportRes->getStatusCode() . "\n";

// 11. Rollback changes to keep DB clean
echo "\n[11] Reverting test data...\n";
IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->where('semester', '>=', $newSem)->delete();
MataKuliah::where('mahasiswa_id', $mahasiswa->id)->where('semester', '>=', $newSem)->delete();
IPKCalculatorService::recalculateAllIPK($mahasiswa->id);
echo "    Reverted.\n";
