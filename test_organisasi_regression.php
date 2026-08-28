<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\Organisasi;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\OrganisasiController;

$mhsUser = User::where('role', 'mahasiswa')->first();
$mahasiswa = Mahasiswa::where('user_id', $mhsUser->id)->first();
$adminUser = User::where('role', 'admin')->first();

Storage::fake('public'); // Mock storage for tests

echo "=== E2E REGRESSION TEST ORGANISASI ===\n\n";

Organisasi::where('mahasiswa_id', $mahasiswa->id)->delete();

// M1. GET organisasi kosong
echo "M1. GET organisasi kosong\n";
$reqM1 = Request::create('/api/organisasi', 'GET');
$reqM1->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM1 = app(OrganisasiController::class)->index($reqM1);
$dataM1 = json_decode($resM1->getContent(), true);
echo "    Status Code: " . $resM1->getStatusCode() . " | Count: " . count($dataM1['data']) . "\n";
echo "    Expected: 200, Count: 0 -> " . (count($dataM1['data']) === 0 ? "PASS" : "FAIL") . "\n\n";

// M3. POST organisasi tanpa file
echo "M3. POST organisasi tanpa file\n";
$reqM3 = Request::create('/api/organisasi', 'POST', [
    'jenis' => 'Organisasi',
    'nama' => 'BEM M3',
    'jabatan' => 'Ketua',
    'periode_mulai' => '2025-01-01',
    'periode_selesai' => '2025-12-01',
    'deskripsi' => 'Test M3'
]);
$reqM3->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM3 = app(OrganisasiController::class)->store($reqM3);
$dataM3 = json_decode($resM3->getContent(), true);
echo "    Status Code: " . $resM3->getStatusCode() . "\n";
echo "    Expected: 201 -> " . ($resM3->getStatusCode() == 201 ? "PASS" : "FAIL") . "\n\n";

// M2. GET organisasi yang sudah ada
echo "M2. GET organisasi yang sudah ada\n";
$reqM2 = Request::create('/api/organisasi', 'GET');
$reqM2->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM2 = app(OrganisasiController::class)->index($reqM2);
$dataM2 = json_decode($resM2->getContent(), true);
echo "    Count: " . count($dataM2['data']) . "\n";
echo "    Expected: Count 1 -> " . (count($dataM2['data']) === 1 ? "PASS" : "FAIL") . "\n\n";

// M4 & M11. POST dengan SK valid & URL
echo "M4. POST dengan SK valid\n";
$skFile = UploadedFile::fake()->create('sk-asli.pdf', 1024, 'application/pdf');
$reqM4 = Request::create('/api/organisasi', 'POST', [
    'jenis' => 'Kepanitiaan',
    'nama' => 'Panitia M4',
    'jabatan' => 'Anggota',
    'periode_mulai' => '2025-01-01',
    'periode_selesai' => '2025-12-01',
], [], ['file_sk' => $skFile]);
$reqM4->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM4 = app(OrganisasiController::class)->store($reqM4);
$dataM4 = json_decode($resM4->getContent(), true);
echo "    Status Code: " . $resM4->getStatusCode() . "\n";
echo "    M11 URL SK: " . ($dataM4['data']['fileSk'] ?? 'null') . "\n";
echo "    Expected: 201 & URL Contains 'sk' -> " . (($resM4->getStatusCode() == 201 && strpos($dataM4['data']['fileSk'], 'sk') !== false) ? "PASS" : "FAIL") . "\n\n";

// M5 & M12. POST dengan foto valid
echo "M5. POST dengan foto valid\n";
$fotoFile = UploadedFile::fake()->create('foto-asli.jpg', 1024, 'image/jpeg');
$reqM5 = Request::create('/api/organisasi', 'POST', [
    'jenis' => 'Kegiatan',
    'nama' => 'Kegiatan M5',
    'jabatan' => 'Peserta',
    'periode_mulai' => '2025-01-01',
    'periode_selesai' => '2025-12-01',
], [], ['foto_kegiatan' => $fotoFile]);
$reqM5->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM5 = app(OrganisasiController::class)->store($reqM5);
$dataM5 = json_decode($resM5->getContent(), true);
echo "    Status Code: " . $resM5->getStatusCode() . "\n";
echo "    M12 URL Foto: " . ($dataM5['data']['fotoKegiatan'] ?? 'null') . "\n";
echo "    Expected: 201 & URL Contains 'foto' -> " . (($resM5->getStatusCode() == 201 && strpos($dataM5['data']['fotoKegiatan'], 'foto') !== false) ? "PASS" : "FAIL") . "\n\n";

// M6. POST file invalid
echo "M6. POST file invalid\n";
try {
    $invalidFile = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');
    $reqM6 = Request::create('/api/organisasi', 'POST', [
        'jenis' => 'Kegiatan',
        'nama' => 'M6',
        'jabatan' => 'M6',
        'periode_mulai' => '2025-01-01',
        'periode_selesai' => '2025-12-01',
    ], [], ['file_sk' => $invalidFile]);
    $reqM6->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
    app(OrganisasiController::class)->store($reqM6);
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "    Error: " . json_encode($e->errors()) . "\n";
    echo "    Expected: 422 (mimes error) -> PASS\n\n";
}

// M7. POST file >5MB
echo "M7. POST file >5MB\n";
try {
    $hugeFile = UploadedFile::fake()->create('big.pdf', 6000, 'application/pdf'); // 6MB
    $reqM7 = Request::create('/api/organisasi', 'POST', [
        'jenis' => 'Kegiatan',
        'nama' => 'M7',
        'jabatan' => 'M7',
        'periode_mulai' => '2025-01-01',
        'periode_selesai' => '2025-12-01',
    ], [], ['file_sk' => $hugeFile]);
    $reqM7->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
    app(OrganisasiController::class)->store($reqM7);
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "    Error: " . json_encode($e->errors()) . "\n";
    echo "    Expected: 422 (max error) -> PASS\n\n";
}

// M8. Validasi periode (Selesai < Mulai)
echo "M8. Validasi periode (Selesai < Mulai)\n";
try {
    $reqM8 = Request::create('/api/organisasi', 'POST', [
        'jenis' => 'Kegiatan',
        'nama' => 'M8',
        'jabatan' => 'M8',
        'periode_mulai' => '2026-01-01',
        'periode_selesai' => '2025-01-01', // Terbalik
    ]);
    $reqM8->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
    app(OrganisasiController::class)->store($reqM8);
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "    Error: " . json_encode($e->errors()) . "\n";
    echo "    Expected: 422 (after_or_equal error) -> PASS\n\n";
}

// M10. Dashboard count ikut berubah
echo "M10. Dashboard count ikut berubah\n";
$reqM10 = Request::create('/api/dashboard', 'GET');
$reqM10->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM10 = app(\App\Http\Controllers\Api\DashboardController::class)->index($reqM10);
$dataM10 = json_decode($resM10->getContent(), true);
echo "    Total Organisasi di Dashboard: " . ($dataM10['kegiatan']['organisasi'] ?? 'null') . "\n";
echo "    Expected: 3 -> " . (($dataM10['kegiatan']['organisasi'] ?? -1) == 3 ? "PASS" : "FAIL") . "\n\n";

// M13. Status dari database tampil benar
echo "M13. Status dari database tampil benar\n";
$orgM13 = Organisasi::where('mahasiswa_id', $mahasiswa->id)->first();
echo "    DB Status: " . $orgM13->status . "\n";
echo "    Expected: Menunggu -> " . ($orgM13->status === 'Menunggu' ? "PASS" : "FAIL") . "\n\n";

// M14. Organisasi Disetujui tidak dapat diedit
echo "M14. Organisasi Disetujui tidak dapat diedit\n";
$orgM13->status = 'Disetujui';
$orgM13->save();
$reqM14 = Request::create('/api/organisasi/' . $orgM13->id, 'PUT', [
    'nama' => 'BEM Hacked'
]);
$reqM14->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM14 = app(OrganisasiController::class)->update($reqM14, $orgM13->id);
echo "    Status Code: " . $resM14->getStatusCode() . "\n";
echo "    Expected: 403 Forbidden -> " . ($resM14->getStatusCode() == 403 ? "PASS" : "FAIL") . "\n\n";

// Cleanup tests
Organisasi::where('mahasiswa_id', $mahasiswa->id)->delete();

