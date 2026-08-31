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
        ]);
    }
}
