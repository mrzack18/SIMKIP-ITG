<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\SystemSetting::insert([
            [
                'key' => 'min_ipk',
                'value' => '3.0',
                'description' => 'Batas minimum IPK agar beasiswa KIP tidak dicabut',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'max_sp',
                'value' => '3',
                'description' => 'Batas maksimum Surat Peringatan (SP) sebelum beasiswa dicabut',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'max_semester',
                'value' => '8',
                'description' => 'Batas maksimum semester masa studi KIP Kuliah',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
