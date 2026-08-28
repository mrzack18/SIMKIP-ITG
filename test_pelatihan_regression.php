<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\Pelatihan;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\PelatihanController;

$mhsUser = User::where('role', 'mahasiswa')->first();
$mahasiswa = Mahasiswa::where('user_id', $mhsUser->id)->first();
$adminUser = User::where('role', 'admin')->first();

Storage::fake('public');

echo "=== E2E REGRESSION TEST PELATIHAN ===\n\n";

Pelatihan::where('mahasiswa_id', $mahasiswa->id)->delete();

// M1. GET kosong
echo "M1. GET kosong\n";
$reqM1 = Request::create('/api/pelatihan', 'GET');
$reqM1->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM1 = app(PelatihanController::class)->index($reqM1);
$dataM1 = json_decode($resM1->getContent(), true);
echo "    Expected: Count 0 -> " . (count($dataM1['data']) === 0 ? "PASS" : "FAIL") . "\n\n";

// M4. POST tanpa file
echo "M4. POST tanpa file\n";
$reqM4 = Request::create('/api/pelatihan', 'POST', [
    'jenis' => 'Akademik',
    'nama' => 'Pelatihan M4',
    'penyelenggara' => 'ITG',
    'tanggal_mulai' => '2025-01-01',
    'tanggal_selesai' => '2025-01-05',
    'tempat' => 'Kampus',
    'deskripsi' => 'Test',
]);
$reqM4->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM4 = app(PelatihanController::class)->store($reqM4);
echo "    Expected: 201 -> " . ($resM4->getStatusCode() == 201 ? "PASS" : "FAIL") . "\n\n";

// M2. GET 1 record
echo "M2. GET 1 record\n";
$reqM2 = Request::create('/api/pelatihan', 'GET');
$reqM2->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM2 = app(PelatihanController::class)->index($reqM2);
$dataM2 = json_decode($resM2->getContent(), true);
echo "    Expected: Count 1 -> " . (count($dataM2['data']) === 1 ? "PASS" : "FAIL") . "\n\n";

// M5. POST sertifikat saja
echo "M5. POST sertifikat saja\n";
$sert = UploadedFile::fake()->create('sert.pdf', 1024, 'application/pdf');
$reqM5 = Request::create('/api/pelatihan', 'POST', [
    'jenis' => 'Non-Akademik',
    'nama' => 'Pelatihan M5',
    'penyelenggara' => 'ITG',
    'tanggal_mulai' => '2025-01-01',
    'tanggal_selesai' => '2025-01-05',
    'tempat' => 'Kampus',
], [], ['file_sertifikat' => $sert]);
$reqM5->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM5 = app(PelatihanController::class)->store($reqM5);
$dataM5 = json_decode($resM5->getContent(), true);
echo "    Expected: 201 & URL Contains 'sertifikat' -> " . (($resM5->getStatusCode() == 201 && strpos($dataM5['data']['sertifikat'], 'sertifikat') !== false) ? "PASS" : "FAIL") . "\n\n";

// M7. POST lengkap
echo "M7. POST lengkap (Sertifikat + Foto)\n";
$sert2 = UploadedFile::fake()->create('sert2.pdf', 1024, 'application/pdf');
$foto = UploadedFile::fake()->create('foto.png', 1024, 'image/png');
$reqM7 = Request::create('/api/pelatihan', 'POST', [
    'jenis' => 'Akademik',
    'nama' => 'Pelatihan M7',
    'penyelenggara' => 'ITG',
    'tanggal_mulai' => '2025-01-01',
    'tanggal_selesai' => '2025-01-05',
    'tempat' => 'Kampus',
], [], ['file_sertifikat' => $sert2, 'foto_kegiatan' => $foto]);
$reqM7->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM7 = app(PelatihanController::class)->store($reqM7);
$dataM7 = json_decode($resM7->getContent(), true);
echo "    Expected: 201 & URL Contains 'sertifikat' & 'foto' -> " . (($resM7->getStatusCode() == 201 && strpos($dataM7['data']['sertifikat'], 'sertifikat') !== false && strpos($dataM7['data']['fotoKegiatan'], 'foto') !== false) ? "PASS" : "FAIL") . "\n\n";

// M8. Validation >5MB
echo "M8. Validation >5MB\n";
try {
    $huge = UploadedFile::fake()->create('huge.pdf', 6000, 'application/pdf');
    $reqM8 = Request::create('/api/pelatihan', 'POST', [
        'jenis' => 'Akademik', 'nama' => 'M8', 'penyelenggara' => 'ITG',
        'tanggal_mulai' => '2025-01-01', 'tanggal_selesai' => '2025-01-05', 'tempat' => 'ITG'
    ], [], ['file_sertifikat' => $huge]);
    $reqM8->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
    app(PelatihanController::class)->store($reqM8);
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "    Expected: 422 (max error) -> PASS\n\n";
}

// M10. Validation tgl selesai < tgl mulai
echo "M10. Validation tgl selesai < tgl mulai\n";
try {
    $reqM10 = Request::create('/api/pelatihan', 'POST', [
        'jenis' => 'Akademik', 'nama' => 'M10', 'penyelenggara' => 'ITG',
        'tanggal_mulai' => '2025-02-01', 'tanggal_selesai' => '2025-01-01', 'tempat' => 'ITG' // Terbalik
    ]);
    $reqM10->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
    app(PelatihanController::class)->store($reqM10);
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "    Expected: 422 (after_or_equal error) -> PASS\n\n";
}

// M13. Dashboard Count
echo "M13. Dashboard Count\n";
$reqM13 = Request::create('/api/dashboard', 'GET');
$reqM13->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM13 = app(\App\Http\Controllers\Api\DashboardController::class)->index($reqM13);
$dataM13 = json_decode($resM13->getContent(), true);
echo "    Expected: 3 -> " . (($dataM13['kegiatan']['pelatihan'] ?? -1) == 3 ? "PASS" : "FAIL") . "\n\n";

// M19. Update Disetujui -> 403
echo "M19. Update Disetujui -> 403\n";
$pel = Pelatihan::where('mahasiswa_id', $mahasiswa->id)->first();
$pel->status = 'Disetujui';
$pel->save();
$reqM19 = Request::create('/api/pelatihan/' . $pel->id, 'PUT', ['nama' => 'Hacked']);
$reqM19->setUserResolver(function() use ($mhsUser) { return $mhsUser; });
$resM19 = app(PelatihanController::class)->update($reqM19, $pel->id);
echo "    Expected: 403 Forbidden -> " . ($resM19->getStatusCode() == 403 ? "PASS" : "FAIL") . "\n\n";

Pelatihan::where('mahasiswa_id', $mahasiswa->id)->delete();
