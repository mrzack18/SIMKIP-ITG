<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Mahasiswa;
use App\Models\IpkSemestr;
use App\Services\IPKCalculatorService;
use Illuminate\Support\Facades\DB;

DB::beginTransaction();
try {
    $m = Mahasiswa::first();
    echo "Testing using Mahasiswa: " . $m->nim . "\n";
    
    IpkSemestr::where('mahasiswa_id', $m->id)->delete();
    
    $ipk1 = IpkSemestr::create(['mahasiswa_id' => $m->id, 'semester' => 1, 'tahun_ajaran' => '2023/2024', 'ips' => 3.5, 'ipk' => 0]);
    $ipk1->mataKuliahs()->create(['kode' => 'MK1', 'nama' => 'Matkul 1', 'sks' => 3, 'nilai_huruf' => 'A', 'nilai_mutu' => 4.0, 'lulus' => true]);
    $ipk1->mataKuliahs()->create(['kode' => 'MK2', 'nama' => 'Matkul 2', 'sks' => 3, 'nilai_huruf' => 'B', 'nilai_mutu' => 3.0, 'lulus' => true]);
    
    IPKCalculatorService::recalculateAllIPK($m->id);
    $s1 = IpkSemestr::find($ipk1->id);
    echo "Semester 1 IPK (Expected 3.5): " . $s1->ipk . "\n";
    
    $ipk2 = IpkSemestr::create(['mahasiswa_id' => $m->id, 'semester' => 2, 'tahun_ajaran' => '2023/2024', 'ips' => 2.0, 'ipk' => 0]);
    $ipk2->mataKuliahs()->create(['kode' => 'MK3', 'nama' => 'Matkul 3', 'sks' => 3, 'nilai_huruf' => 'C', 'nilai_mutu' => 2.0, 'lulus' => true]);
    $ipk2->mataKuliahs()->create(['kode' => 'MK4', 'nama' => 'Matkul 4', 'sks' => 2, 'nilai_huruf' => 'E', 'nilai_mutu' => 0.0, 'lulus' => false]);
    
    IPKCalculatorService::recalculateAllIPK($m->id);
    $s2 = IpkSemestr::find($ipk2->id);
    echo "Semester 2 IPK (Expected 2.45): " . $s2->ipk . "\n";
    
    $co = IPKCalculatorService::getCarryOver($m->id);
    echo "Carry-Over Count (Expected 1): " . count($co) . "\n";
    
    $ipk3 = IpkSemestr::create(['mahasiswa_id' => $m->id, 'semester' => 3, 'tahun_ajaran' => '2024/2025', 'ips' => 4.0, 'ipk' => 0]);
    $ipk3->mataKuliahs()->create(['kode' => 'MK4', 'nama' => 'Matkul 4', 'sks' => 2, 'nilai_huruf' => 'A', 'nilai_mutu' => 4.0, 'lulus' => true]);
    
    IPKCalculatorService::recalculateAllIPK($m->id);
    $s3 = IpkSemestr::find($ipk3->id);
    echo "Semester 3 IPK (Expected 3.18): " . $s3->ipk . "\n";
    
    $co3 = IPKCalculatorService::getCarryOver($m->id);
    echo "Carry-Over Count (Expected 0): " . count($co3) . "\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
DB::rollBack();
