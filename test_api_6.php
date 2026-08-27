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
$mhs = User::where('role', 'mahasiswa')->first();
$mhs_id = clone $mhs; // we need original

echo "=== PHASE 6B TESTS ===\n";

// 1. Unified Queue Test
echo "1. Unified Queue Test\n";
$res = simulateApi('GET', '/api/admin/dokumen-queue', $admin);
assert($res['status'] === 200, "Unified queue failed: " . json_encode($res));
echo "OK: Unified queue returns 200.\n";

// 2. GET Dokumen (Mahasiswa)
echo "2. GET Dokumen Mahasiswa\n";
$res = simulateApi('GET', '/api/dokumen', $mhs);
assert($res['status'] === 200, "Dokumen list failed");
assert(isset($res['content']['data'][0]['isWajib']), "DokumenJenis mapped correctly");
echo "OK: Dokumen list structure is correct.\n";

// 3. POST SP (Admin)
echo "3. POST Surat Peringatan\n";
$res = simulateApi('POST', '/api/sp', $admin, [
    'mahasiswa_id' => $mhs->mahasiswa->id,
    'level' => 'SP1',
    'jenis_pelanggaran' => 'Akademik',
    'deskripsi' => 'IPK turun sangat drastis',
    'tanggal_terbit' => '2026-08-01',
    'batas_evaluasi' => '2026-12-31'
]);
assert($res['status'] === 201, "POST SP failed: " . json_encode($res));
echo "OK: SP Created.\n";

// 4. GET SP (Admin/Mahasiswa)
echo "4. GET Surat Peringatan List\n";
$res = simulateApi('GET', '/api/sp', $admin);
assert($res['status'] === 200, "GET SP failed");
assert(isset($res['content']['data'][0]['sisa']), "sisa hari is calculated");
echo "OK: GET SP structure is correct.\n";

// 5. Validation dispatcher
echo "5. Unified Queue Validation Dispatcher\n";
// Let's create a Dokumen first
$jenis = \App\Models\DokumenJenis::first();
$file = \Illuminate\Http\UploadedFile::fake()->create('test.pdf', 100);
$res = simulateApi('POST', '/api/dokumen', $mhs, [
    'dokumen_jenis_id' => $jenis->id,
    'metadata' => json_encode(['tempat' => 'Garut'])
], ['file' => $file]);
assert($res['status'] === 201, "POST Dokumen failed: " . json_encode($res));
$docId = $res['content']['data']['id'];

$res = simulateApi('PUT', '/api/admin/dokumen-queue/doc_'.$docId.'/validate', $admin, [
    'status' => 'Disetujui',
    'catatan_admin' => 'Bagus'
]);
assert($res['status'] === 200, "Validation failed: " . json_encode($res));
echo "OK: Validation dispatcher is working.\n";

// 6. Regression
echo "6. Regression Test Phase 3B & 4B\n";
$res3b = simulateApi('GET', '/api/mahasiswa', $admin);
assert($res3b['status'] === 200, "Phase 3B broken");
$res4b = simulateApi('GET', "/api/mahasiswa/{$mhs->mahasiswa->id}/ipk", $admin);
assert($res4b['status'] === 200, "Phase 4B broken");
echo "OK: Regression tests passed.\n";

echo "\nALL TESTS PASSED.\n";
