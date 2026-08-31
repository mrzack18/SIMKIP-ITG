<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$id = \App\Models\Mahasiswa::where('nim', '2307094')->first()->id;
$req = Illuminate\Http\Request::create("/api/mahasiswa/{$id}", 'GET', ['tahun_ajaran' => '2025/2026 Genap']);
$req->setUserResolver(function() { return \App\Models\User::where('role', 'admin')->first(); });
$res = app(App\Http\Controllers\Api\MahasiswaController::class)->show($id); // wait, show uses route binding or ID?
$m = \App\Models\Mahasiswa::findOrFail($id);
$resource = new \App\Http\Resources\MahasiswaResource($m);
$resource->toArray($req);
echo json_encode(['semester' => \App\Helpers\TahunAjaranHelper::calculateSemester(2023, '2025/2026 Genap')]);
