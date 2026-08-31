<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tahunAjaran = '2023/2024 Genap';

$query = App\Models\Mahasiswa::addSelect([
    'ipk_calc' => \App\Models\IpkSemestr::select('ipk')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran, fn($q) => $q->where('tahun_ajaran', $tahunAjaran))
        ->orderByDesc('semester')
        ->limit(1),

    'prev_ipk_calc' => \App\Models\IpkSemestr::select('ipk')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran, function($q) use ($tahunAjaran) {
             $q->where('semester', '<', \Illuminate\Support\Facades\DB::raw("(SELECT semester FROM ipk_semestrs WHERE ipk_semestrs.mahasiswa_id = mahasiswas.id AND tahun_ajaran = '{$tahunAjaran}' LIMIT 1)"));
        }, function($q) {
             $q->skip(1);
        })
        ->orderByDesc('semester')
        ->limit(1),

    'sp_calc' => \App\Models\SuratPeringatan::select('level')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran, function($q) use ($tahunAjaran) {
             $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran);
             if ($range) {
                 $q->where('tanggal_terbit', '<=', $range[1])
                   ->where('batas_evaluasi', '>=', $range[0]);
             }
        }, function($q) {
             $q->whereIn('status', ['Aktif', 'Masa Tenggang']);
        })
        ->orderByDesc('level')
        ->limit(1),
]);

$mhs = $query->first();

echo "IPK Calc ($tahunAjaran): {$mhs->ipk_calc}\n";
echo "Prev IPK Calc ($tahunAjaran): {$mhs->prev_ipk_calc}\n";
echo "SP Calc ($tahunAjaran): {$mhs->sp_calc}\n";

$tahunAjaran2 = '2025/2026 Ganjil';
$query2 = App\Models\Mahasiswa::addSelect([
    'ipk_calc' => \App\Models\IpkSemestr::select('ipk')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran2, fn($q) => $q->where('tahun_ajaran', $tahunAjaran2))
        ->orderByDesc('semester')
        ->limit(1),

    'prev_ipk_calc' => \App\Models\IpkSemestr::select('ipk')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran2, function($q) use ($tahunAjaran2) {
             $q->where('semester', '<', \Illuminate\Support\Facades\DB::raw("(SELECT semester FROM ipk_semestrs WHERE ipk_semestrs.mahasiswa_id = mahasiswas.id AND tahun_ajaran = '{$tahunAjaran2}' LIMIT 1)"));
        }, function($q) {
             $q->skip(1);
        })
        ->orderByDesc('semester')
        ->limit(1),

    'sp_calc' => \App\Models\SuratPeringatan::select('level')
        ->whereColumn('mahasiswa_id', 'mahasiswas.id')
        ->when($tahunAjaran2, function($q) use ($tahunAjaran2) {
             $range = \App\Helpers\TahunAjaranHelper::getDateRange($tahunAjaran2);
             if ($range) {
                 $q->where('tanggal_terbit', '<=', $range[1])
                   ->where('batas_evaluasi', '>=', $range[0]);
             }
        }, function($q) {
             $q->whereIn('status', ['Aktif', 'Masa Tenggang']);
        })
        ->orderByDesc('level')
        ->limit(1),
]);

$mhs2 = $query2->first();
echo "\nIPK Calc ($tahunAjaran2): {$mhs2->ipk_calc}\n";
echo "Prev IPK Calc ($tahunAjaran2): {$mhs2->prev_ipk_calc}\n";
echo "SP Calc ($tahunAjaran2): {$mhs2->sp_calc}\n";
