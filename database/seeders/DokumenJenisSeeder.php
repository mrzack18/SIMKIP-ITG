<?php

namespace Database\Seeders;

use App\Models\DokumenJenis;
use Illuminate\Database\Seeder;

class DokumenJenisSeeder extends Seeder
{
    public function run(): void
    {
        $jenis = [
            ['nama' => 'PKKMB',          'is_wajib' => true, 'urutan' => 1],
            ['nama' => 'MABIM',          'is_wajib' => true, 'urutan' => 2],
            ['nama' => 'Bela Negara',    'is_wajib' => true, 'urutan' => 3],
            ['nama' => 'Sertifikasi',    'is_wajib' => true, 'urutan' => 4],
            ['nama' => 'Berita Acara KP','is_wajib' => true, 'urutan' => 5],
        ];

        foreach ($jenis as $j) {
            DokumenJenis::firstOrCreate(['nama' => $j['nama']], $j);
        }
    }
}
