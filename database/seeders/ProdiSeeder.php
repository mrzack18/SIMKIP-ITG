<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $prodis = [
            ['kode' => 'TI',  'nama' => 'Teknik Informatika',   'urutan' => 1],
            ['kode' => 'SI',  'nama' => 'Sistem Informasi',      'urutan' => 2],
            ['kode' => 'TIN', 'nama' => 'Teknik Industri',       'urutan' => 3],
            ['kode' => 'TS',  'nama' => 'Teknik Sipil',          'urutan' => 4],
            ['kode' => 'AR',  'nama' => 'Arsitektur',            'urutan' => 5],
        ];

        foreach ($prodis as $data) {
            Prodi::firstOrCreate(['kode' => $data['kode']], [
                'nama' => $data['nama'],
                'is_aktif' => true,
            ]);
        }
    }
}
