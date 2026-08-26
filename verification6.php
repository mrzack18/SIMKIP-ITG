<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
$mhsUser = User::where('role', 'mahasiswa')->first();
echo "Mahasiswa User ID: " . $mhsUser->id . " Role: " . $mhsUser->role . "\n";
