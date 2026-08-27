<?php
require 'vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function simulateApi($method, $uri, $user, $data = [], $files = []) {
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

Storage::fake('public');

$admin = User::where('role', 'admin')->first();
$warek = User::where('role', 'warek')->first();
$prodiIf = User::where('role', 'prodi')->first();
$prodiSi = User::where('role', 'prodi')->where('id', '!=', $prodiIf->id)->first();

$mahasiswa1 = User::where('role', 'mahasiswa')->whereHas('mahasiswa', fn($q) => $q->where('prodi_id', $prodiIf->prodi_id))->first();
$mahasiswa2 = User::where('role', 'mahasiswa')->whereHas('mahasiswa', fn($q) => $q->where('prodi_id', $prodiSi->prodi_id))->first();

$m1 = $mahasiswa1->mahasiswa;
$m2 = $mahasiswa2->mahasiswa;

echo "=== PHASE 5B TESTS ===\n";

// 1. Empty State Test
\App\Models\Prestasi::where('mahasiswa_id', $m1->id)->delete();
echo "1. Empty State Test\n";
$res = simulateApi('GET', '/api/prestasi', $mahasiswa1);
if ($res['status'] !== 200 || !empty($res['content']['data'])) { var_dump($res); exit(1); }
assert($res['status'] === 200 && empty($res['content']['data']), "Empty state failed");
echo "OK: Empty State returns empty data array.\n";

// 2. CRUD & File Upload Test (Prestasi)
echo "2. CRUD & File Upload Test (Prestasi)\n";
$fileSert = UploadedFile::fake()->create('sert.pdf', 100);
$fileFoto = UploadedFile::fake()->create('foto.jpg', 100);

$res = simulateApi('POST', '/api/prestasi', $mahasiswa1, [
    'nama_prestasi' => 'Juara 1 Lomba',
    'tingkat' => 'Nasional',
    'pencapaian' => 'Juara 1',
    'penyelenggara' => 'Kemenristek',
    'tanggal_mulai' => '2026-01-01',
    'tanggal_selesai' => '2026-01-02',
    'tempat' => 'Jakarta',
    'deskripsi' => 'Lomba koding',
], ['file_sertifikat' => $fileSert, 'file_foto' => $fileFoto]);

assert($res['status'] === 201, "POST prestasi failed: ".json_encode($res));
$prestasiId = $res['content']['data']['id'];
$fileSertUrl = $res['content']['data']['fileSertifikat'];
assert(strpos($fileSertUrl, 'uploads/prestasi') !== false, "File URL incorrect");
echo "OK: POST Prestasi with File Upload success.\n";

// 3. Authorization Test (Cross-user)
echo "3. Authorization Test (Cross-user)\n";
$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $mahasiswa2);
assert($res['status'] === 403, "Cross user should be 403");

$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $prodiSi);
assert($res['status'] === 403, "Cross prodi should be 403");

$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $admin);
assert($res['status'] === 200, "Admin should access");

$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $prodiIf);
assert($res['status'] === 200, "Own prodi should access");

$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $warek);
assert($res['status'] === 200, "Warek should access");
echo "OK: Authorization checks passed.\n";

// 4. Validation Test (Admin only)
echo "4. Validation Test\n";
$res = simulateApi('PUT', "/api/mahasiswa/{$m1->id}/prestasi/{$prestasiId}/validate", $admin, [
    'status' => 'Disetujui',
    'catatan_admin' => 'Bagus sekali',
]);
assert($res['status'] === 200 && $res['content']['data']['status'] === 'Disetujui', "Admin validation failed");

$res = simulateApi('PUT', "/api/mahasiswa/{$m1->id}/prestasi/{$prestasiId}/validate", $prodiIf, [
    'status' => 'Ditolak'
]);
assert($res['status'] === 403, "Prodi cannot validate");
echo "OK: Admin Validation passed.\n";

// 5. camelCase Test & Contract Test
echo "5. camelCase & Contract Test\n";
$res = simulateApi('GET', "/api/mahasiswa/{$m1->id}/prestasi", $admin);
$data = $res['content']['data'][0];
assert(isset($data['namaPrestasi'], $data['tanggalMulai'], $data['catatanAdmin']), "camelCase missing");
assert(isset($data['nama']) && isset($data['nim']), "Student info missing from Admin view");
echo "OK: camelCase contract correct.\n";

// 6. Regression Test Phase 3B & 4B
echo "6. Regression Test Phase 3B & 4B\n";
$res3b = simulateApi('GET', '/api/mahasiswa', $admin);
assert($res3b['status'] === 200, "Phase 3B broken");
$res4b = simulateApi('GET', "/api/mahasiswa/{$m1->id}/ipk", $admin);
assert($res4b['status'] === 200, "Phase 4B broken");
echo "OK: Regression tests passed.\n";

echo "ALL TESTS PASSED.\n";
