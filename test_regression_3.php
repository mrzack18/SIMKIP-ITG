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

$mhsUser = User::where('role', 'mahasiswa')->first();
$mahasiswa = Mahasiswa::where('user_id', $mhsUser->id)->first();
$adminUser = User::where('role', 'admin')->first();

echo "=== FINAL REGRESSION CHECKS ===\n\n";

// 6. Dashboard Mahasiswa
echo "[6] Dashboard Mahasiswa\n";
$dashReq = Request::create('/api/dashboard', 'GET');
$dashReq->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$dashRes = app(\App\Http\Controllers\Api\DashboardController::class)->index($dashReq);
$dashData = json_decode($dashRes->getContent(), true);
echo "    Dashboard IPK (akademik.ipk_terakhir): " . ($dashData['akademik']['ipk_terakhir'] ?? 'N/A') . "\n";
$ipkList = collect($dashData['ipk_chart'] ?? [])->pluck('ipk')->toArray();
echo "    Dashboard Chart IPKs: " . implode(', ', $ipkList) . "\n";

// 7. Dashboard Admin (Mahasiswa Index)
echo "\n[7] Dashboard Admin / Mahasiswa List\n";
$adminReq = Request::create('/api/mahasiswa', 'GET', ['page' => 1, 'per_page' => 100]); // Get enough records
$adminReq->setUserResolver(function() use ($adminUser) { return $adminUser; });
$adminRes = app(\App\Http\Controllers\Api\MahasiswaController::class)->index($adminReq);
$adminData = json_decode($adminRes->getContent(), true);
$found = collect($adminData['data']['data'] ?? [])->firstWhere('id', $mahasiswa->id);
if ($found) {
    echo "    Admin List IPK (found.ipk): " . ($found['ipk'] ?? 'N/A') . "\n";
} else {
    echo "    Student not found in Admin list (maybe check search/filter).\n";
}

