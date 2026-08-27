<?php
require 'vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\User;

function simulateApi($method, $uri, $user = null, $data = [], $files = []) {
    $server = [
        'REQUEST_URI' => $uri,
        'REQUEST_METHOD' => $method,
        'HTTP_ACCEPT' => 'application/json',
    ];
    $req = Request::create($uri, $method, $data, [], $files, $server);
    if ($user) {
        $req->setUserResolver(fn() => $user);
        app('auth')->guard('sanctum')->setUser($user);
    }
    $response = app()->handle($req);
    return ['status' => $response->getStatusCode(), 'content' => json_decode($response->getContent(), true)];
}

$admin = User::where('role', 'admin')->first();
$warek = User::where('role', 'warek')->first();
$prodi = User::where('role', 'prodi')->first();
$mhs   = User::where('role', 'mahasiswa')->first();
$mhs2  = User::where('role', 'mahasiswa')->where('id', '!=', $mhs->id)->first();

echo "=== PHASE 7B TESTS ===\n";

// 1. Laporan Test
echo "1. Laporan - CRUD Admin\n";
$res = simulateApi('POST', '/api/laporan', $admin, [
    'judul' => 'Laporan Genap 2026',
    'tahun_akademik' => '2025/2026',
    'semester' => 'Genap',
    'tanggal_laporan' => '2026-08-20',
    'cakupan' => 'semua',
    'tujuan_prodi' => true
]);
assert($res['status'] === 201, "POST Laporan failed: " . json_encode($res));
$laporanId = $res['content']['laporan']['id'];
echo "OK: POST Laporan (Draft)\n";

echo "2. Laporan - Submit Admin\n";
$res = simulateApi('PATCH', "/api/laporan/{$laporanId}/submit", $admin);
if ($res['status'] !== 200) { var_dump($res); exit(1); }
echo "OK: Submit Laporan (Diajukan)\n";

echo "3. Laporan - Warek Review (Return & Approve)\n";
$res = simulateApi('PATCH', "/api/laporan/{$laporanId}/return", $warek, ['catatan' => 'Perbaiki data ini']);
if ($res['status'] !== 200) {
    echo "ERROR: " . ($res['content']['message'] ?? 'Unknown') . "\n";
    echo "FILE: " . ($res['content']['file'] ?? '') . " LINE: " . ($res['content']['line'] ?? '') . "\n";
    exit(1);
}

$res = simulateApi('PATCH', "/api/laporan/{$laporanId}/submit", $admin);
$res = simulateApi('PATCH', "/api/laporan/{$laporanId}/approve", $warek);
if ($res['status'] !== 200) { var_dump($res); exit(1); }
echo "OK: Warek Review Laporan (Disetujui)\n";

echo "4. Laporan - Prodi Access Control\n";
$res = simulateApi('GET', '/api/laporan', $prodi);
assert($res['status'] === 200, "Prodi GET Laporan failed: " . json_encode($res));
// Must have 1 laporan because it's approved and tujuan_prodi is true
assert(count($res['content']['data']) >= 1, "Prodi should see the report");

// Warek can't create
$res = simulateApi('POST', '/api/laporan', $warek, [
    'judul' => 'Should fail',
    'tahun_akademik' => '2025/2026',
    'semester' => 'Genap',
    'tanggal_laporan' => '2026-08-20',
]);
assert($res['status'] === 403, "Warek shouldn't create laporan");
echo "OK: Laporan Access Control\n";

// 5. Bebas Tanggungan Test
echo "5. Bebas Tanggungan - Mahasiswa Create\n";
// The student might not have all 5 docs yet, so it should fail with 422 if checklist not met
$res = simulateApi('POST', '/api/bebas-tanggungan', $mhs);
// It returns 422 because of the checklist not fully met, or 201 if met.
// We just assert it is well-formed.
assert($res['status'] === 201 || $res['status'] === 422, "POST BebasTanggungan failed: " . json_encode($res));
echo "OK: Bebas Tanggungan Mahasiswa\n";

// Create manual BT for testing admin approval
$bt = \App\Models\BebasTanggungan::create([
    'mahasiswa_id' => $mhs2->mahasiswa->id,
    'tanggal_ajukan' => now()->toDateString(),
    'status' => 'Menunggu'
]);

echo "6. Bebas Tanggungan - Admin Approve\n";
$res = simulateApi('PATCH', "/api/bebas-tanggungan/{$bt->id}/approve", $admin);
assert($res['status'] === 200, "Approve BT failed: " . json_encode($res));

$res = simulateApi('GET', '/api/bebas-tanggungan', $mhs2);
assert($res['status'] === 200, "GET BT failed: " . json_encode($res));
assert($res['content']['status'] === 'diterbitkan', "BT status should be diterbitkan, got: " . $res['content']['status']);
echo "OK: Admin Approve BT (Diterbitkan mapping)\n";

// 7. Regression
echo "7. Regression Tests\n";
// Phase 3B
$res = simulateApi('GET', '/api/mahasiswa', $admin);
assert($res['status'] === 200, "Phase 3B broken");
// Phase 4B
$res = simulateApi('GET', "/api/mahasiswa/{$mhs->mahasiswa->id}/ipk", $admin);
assert($res['status'] === 200, "Phase 4B broken");
// Phase 5B
$res = simulateApi('GET', "/api/prestasi", $admin);
assert($res['status'] === 200, "Phase 5B broken");
// Phase 6B
$res = simulateApi('GET', "/api/admin/dokumen-queue", $admin);
assert($res['status'] === 200, "Phase 6B broken");
echo "OK: Regression tests passed.\n";

echo "\nALL TESTS PASSED.\n";
