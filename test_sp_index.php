<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = Illuminate\Http\Request::create('/api/admin/sp', 'GET', ['tahun_ajaran' => 'Tahun 2025/2026-2']); // Genap 25/26
$res = app(App\Http\Controllers\Api\Admin\SPController::class)->index($req);

echo json_encode($res->getData());
