<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = Illuminate\Http\Request::create('/api', 'GET', ['tahun_ajaran' => 'Tahun 2023/2024-1']); // Ganjil 23/24 (Sem 1)
$mhs = App\Models\Mahasiswa::where('nim', '2306064')->first();

$q = App\Models\Dokumen::with('jenis')->where('mahasiswa_id', $mhs->id);
App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q, 'dokumens.created_at', $req->tahun_ajaran);
echo "Sem 1:\n";
foreach($q->get() as $d) echo "- " . $d->jenis->nama . "\n";

$req2 = Illuminate\Http\Request::create('/api', 'GET', ['tahun_ajaran' => 'Tahun 2023/2024-2']); // Genap 23/24 (Sem 2)
$q2 = App\Models\Dokumen::with('jenis')->where('mahasiswa_id', $mhs->id);
App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q2, 'dokumens.created_at', $req2->tahun_ajaran);
echo "\nSem 2:\n";
foreach($q2->get() as $d) echo "- " . $d->jenis->nama . "\n";

$req3 = Illuminate\Http\Request::create('/api', 'GET', ['tahun_ajaran' => 'Tahun 2025/2026-2']); // Genap 25/26 (Sem 6)
$q3 = App\Models\Dokumen::with('jenis')->where('mahasiswa_id', $mhs->id);
App\Helpers\TahunAjaranHelper::applyDateMaxFilter($q3, 'dokumens.created_at', $req3->tahun_ajaran);
echo "\nSem 6:\n";
foreach($q3->get() as $d) echo "- " . $d->jenis->nama . "\n";
