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
            TahunAjaranSeeder::class,
            DokumenJenisSeeder::class,
            JenisPelanggaranSeeder::class,
            SuperAdminSeeder::class, // UserSeeder
            MockDataSeeder::class, // Testing UI Data
            ZakiSeeder::class, // Dummy student: Zaki Muhamad (2307094)
            MahasiswaBatchSeeder::class, // 125 batch students: 5 prodi × 5 angkatan × 3 mahasiswa
            BebasTanggunganSeeder::class, // Permohonan bebas tanggungan TA 2022 & 2023 (menunggu/diterima/ditolak)
            BebasTanggunganTestSeeder::class, // 7 akun test BT: masing-masing kekurangan 1 syarat
        ]);
    }
}
