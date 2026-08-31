<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = new Illuminate\Http\Request();
$req->merge(['tahun_ajaran' => 'Tahun 2025/2026-2']);

$q = App\Models\Mahasiswa::first()->prestasis();
App\Helpers\TahunAjaranHelper::applyDateRangeFilter($q, 'prestasis.created_at', $req->tahun_ajaran);

echo $q->toSql() . "\n";
echo "Bindings: " . json_encode($q->getBindings()) . "\n";
echo "Count: " . $q->count() . "\n";
