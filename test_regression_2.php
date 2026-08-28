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
use App\Services\IPKCalculatorService;

$mhsUser = User::where('role', 'mahasiswa')->first();
$mahasiswa = Mahasiswa::where('user_id', $mhsUser->id)->first();
$adminUser = User::where('role', 'admin')->first();

echo "=== START REGRESSION VERIFICATION 2 ===\n\n";

// 6. Dashboard Mahasiswa
echo "\n[6] Dashboard Mahasiswa\n";
$dashReq = Request::create('/api/dashboard', 'GET');
$dashReq->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$dashRes = app(\App\Http\Controllers\Api\DashboardController::class)->index($dashReq);
$dashData = json_decode($dashRes->getContent(), true);
echo "    Dashboard IPK: " . ($dashData['data']['statistik']['ipk_terakhir'] ?? 'Not found in statistik.ipk_terakhir') . "\n";
if (!isset($dashData['data']['statistik']['ipk_terakhir'])) {
    echo "    Keys found: " . implode(", ", array_keys($dashData['data']['statistik'] ?? [])) . "\n";
}

// 7. Dashboard Admin (Mahasiswa Index)
echo "\n[7] Dashboard Admin / Mahasiswa List\n";
$adminReq = Request::create('/api/mahasiswa', 'GET');
$adminReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$adminRes = app(\App\Http\Controllers\Api\MahasiswaController::class)->index($adminReq);
$adminData = json_decode($adminRes->getContent(), true);
$found = collect($adminData['data']['data'] ?? [])->firstWhere('id', $mahasiswa->id);
echo "    Admin List IPK: " . ($found['ipk'] ?? 'Not found in found.ipk') . "\n";
if (!isset($found['ipk'])) {
    echo "    Keys found: " . implode(", ", array_keys($found ?? [])) . "\n";
}

// Cleanup from previous run
$ipkIds = IpkSemestr::where('mahasiswa_id', $mahasiswa->id)->where('semester', '>=', 4)->pluck('id');
MataKuliah::whereIn('ipk_semestr_id', $ipkIds)->delete();
IpkSemestr::whereIn('id', $ipkIds)->delete();
IPKCalculatorService::recalculateAllIPK($mahasiswa->id);

echo "    Cleanup done.\n";
