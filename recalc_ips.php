<?php
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$semesters = App\Models\IpkSemestr::with("mataKuliahs")->get();
$updated = 0;

foreach ($semesters as $sem) {
    if ($sem->mataKuliahs->count() === 0) {
        echo "ID {$sem->id} sem {$sem->semester}: no MK, skip\n";
        continue;
    }
    $totalBobot = 0.0;
    $totalSKS = 0;
    foreach ($sem->mataKuliahs as $mk) {
        $totalBobot += $mk->nilai_mutu * $mk->sks;
        $totalSKS += $mk->sks;
    }
    $ips = $totalSKS > 0 ? round($totalBobot / $totalSKS, 2) : 0.0;
    $sem->update(["ips" => $ips]);
    echo "ID {$sem->id} sem {$sem->semester}: IPS = {$ips} (dari {$sem->mataKuliahs->count()} MK)\n";
    $updated++;
}
echo "\nSelesai. {$updated} record diupdate.\n";
