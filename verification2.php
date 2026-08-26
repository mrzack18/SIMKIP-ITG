<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Mahasiswa;

$counts = [
    'Aktif' => Mahasiswa::where('status', 'Aktif')->count(),
    'Nonaktif' => Mahasiswa::where('status', 'Nonaktif')->count(),
    'Dicabut' => Mahasiswa::where('status', 'Dicabut')->count(),
    'Lulus' => Mahasiswa::where('status', 'Lulus')->count(),
];

// Check properties of a nonaktif
$nonaktif = Mahasiswa::where('status', 'Nonaktif')->first();
$dicabut = Mahasiswa::where('status', 'Dicabut')->first();

echo json_encode([
    'counts' => $counts,
    'nonaktif_fields' => [
        'alasan' => $nonaktif?->alasan_nonaktif,
        'tanggal' => $nonaktif?->tanggal_nonaktif,
    ],
    'dicabut_fields' => [
        'semester' => $dicabut?->semester_dicabut,
        'tanggal' => $dicabut?->tanggal_dicabut,
        'alasan' => $dicabut?->alasan_dicabut,
        'oleh' => $dicabut?->dicabut_oleh,
    ]
], JSON_PRETTY_PRINT);
