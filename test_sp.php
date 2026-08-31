<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = Illuminate\Http\Request::create('/api', 'GET', ['tahun_ajaran' => 'Tahun 2024/2025-2']); // Genap 24/25

$q = App\Models\SuratPeringatan::where('mahasiswa_id', 40);
App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q, 'tanggal_terbit', $req->tahun_ajaran);

$res = App\Http\Resources\SuratPeringatanResource::collection($q->get())->toArray($req);

echo "For 2024/2025 Genap:\n";
foreach($res as $r) {
    echo $r['level'] . " | Status: " . $r['status'] . "\n";
}

$req2 = Illuminate\Http\Request::create('/api', 'GET', ['tahun_ajaran' => 'Tahun 2025/2026-1']); // Ganjil 25/26

$q2 = App\Models\SuratPeringatan::where('mahasiswa_id', 40);
App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q2, 'tanggal_terbit', $req2->tahun_ajaran);

$res2 = App\Http\Resources\SuratPeringatanResource::collection($q2->get())->toArray($req2);

echo "\nFor 2025/2026 Ganjil:\n";
foreach($res2 as $r) {
    echo $r['level'] . " | Status: " . $r['status'] . "\n";
}
