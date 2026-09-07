<?php

namespace Database\Seeders;

use App\Models\TahunAjaran;
use Illuminate\Database\Seeder;

class TahunAjaranSeeder extends Seeder
{
    public function run(): void
    {
        // Seed tahun ajaran historis & ke depan agar tabel tidak kosong saat instalasi.
        // Admin tetap bisa menambah/mengedit/menghapus secara manual di halaman Konfigurasi.
        $startYear = 2022;
        $endYear   = 2027; // sampai 2027/2028

        for ($y = $startYear; $y <= $endYear; $y++) {
            $tahun = "$y/" . ($y + 1);
            foreach (['Ganjil', 'Genap'] as $semester) {
                TahunAjaran::firstOrCreate(
                    ['tahun_akademik' => $tahun, 'semester' => $semester],
                    ['is_aktif' => false]
                );
            }
        }
    }
}
