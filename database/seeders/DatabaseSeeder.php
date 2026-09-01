<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProdiSeeder::class,
            KonfigurasiSeeder::class,
            DokumenJenisSeeder::class,
            JenisPelanggaranSeeder::class,
            SuperAdminSeeder::class, // UserSeeder
            MockDataSeeder::class, // Testing UI Data
            KaillaSeeder::class, // Dummy student: Kailla Salsabila (2306064) with 6 semesters history
            ZakiSeeder::class, // Dummy student: Zaki Muhamad (2307094)
            MahasiswaBatchSeeder::class, // 125 batch students: 5 prodi × 5 angkatan × 3 mahasiswa
            BebasTanggunganSeeder::class, // Permohonan bebas tanggungan TA 2022 & 2023 (menunggu/diterima/ditolak)
        ]);
    }
}
