<?php

namespace Database\Seeders;

use App\Models\Konfigurasi;
use Illuminate\Database\Seeder;

class KonfigurasiSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['key' => 'ipk_minimum',             'value' => '3.0',                          'label' => 'IPK Minimum KIP-K',          'tipe' => 'number'],
            ['key' => 'max_semester',             'value' => '8',                            'label' => 'Batas Semester Studi',        'tipe' => 'number'],
            ['key' => 'sks_minimum_lulus',        'value' => '144',                          'label' => 'Minimum SKS Kelulusan',       'tipe' => 'number'],
            ['key' => 'nama_institusi',           'value' => 'Institut Teknologi Garut',     'label' => 'Nama Institusi',             'tipe' => 'text'],
            ['key' => 'singkatan_institusi',      'value' => 'ITG',                          'label' => 'Singkatan Institusi',        'tipe' => 'text'],
            ['key' => 'alamat_institusi',         'value' => 'Jl. Mayor Syamsu No.1, Garut 44151', 'label' => 'Alamat Institusi',   'tipe' => 'text'],
            ['key' => 'telp_institusi',           'value' => '(0262) 540895',                'label' => 'Telepon Institusi',          'tipe' => 'text'],
            ['key' => 'logo_institusi',           'value' => '',                             'label' => 'Logo Institusi',             'tipe' => 'text'],
            ['key' => 'periode_input_aktif',      'value' => '1',                            'label' => 'Periode Input Nilai Aktif',  'tipe' => 'boolean'],
            ['key' => 'periode_input_buka',       'value' => '2026-08-01',                   'label' => 'Tanggal Buka Input Nilai',   'tipe' => 'date'],
            ['key' => 'periode_input_tutup',      'value' => '2026-09-30',                   'label' => 'Tanggal Tutup Input Nilai',  'tipe' => 'date'],
            ['key' => 'tahun_akademik_aktif',     'value' => '2025/2026',                    'label' => 'Tahun Akademik Aktif',       'tipe' => 'text'],
            ['key' => 'semester_aktif',           'value' => 'Genap',                        'label' => 'Semester Aktif',             'tipe' => 'text'],
        ];

        foreach ($configs as $config) {
            Konfigurasi::firstOrCreate(['key' => $config['key']], $config);
        }
    }
}
