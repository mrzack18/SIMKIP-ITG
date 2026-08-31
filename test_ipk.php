<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$id = \App\Models\Mahasiswa::first()->id;
$req = Illuminate\Http\Request::create("/api/mahasiswa/{$id}/ipk", 'GET', ['tahun_ajaran' => '2023/2024 Genap']);
$req->setUserResolver(function() { return \App\Models\User::where('role', 'admin')->first(); });
$res = app(App\Http\Controllers\Api\MahasiswaController::class)->ipk($req, $id);

echo json_encode($res->getData());
