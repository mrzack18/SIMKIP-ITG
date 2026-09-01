<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $prodis = [
            ['kode' => '06', 'nama' => 'Teknik Informatika',  'urutan' => 1],
            ['kode' => '07', 'nama' => 'Sistem Informasi',     'urutan' => 2],
            ['kode' => '03', 'nama' => 'Teknik Industri',      'urutan' => 3],
            ['kode' => '11', 'nama' => 'Teknik Sipil',        'urutan' => 4],
            ['kode' => '24', 'nama' => 'Arsitektur',         'urutan' => 5],
        ];

        foreach ($prodis as $data) {
            Prodi::firstOrCreate(['kode' => $data['kode']], [
                'nama' => $data['nama'],
                'is_aktif' => true,
            ]);
        }
    }
}
