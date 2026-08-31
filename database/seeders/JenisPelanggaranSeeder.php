<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JenisPelanggaran;

class JenisPelanggaranSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'nama' => 'Akademik',
                'deskripsi' => 'Melanggar ketentuan akademik (IPK di bawah standar, etc.)',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
            [
                'nama' => 'Keuangan',
                'deskripsi' => 'Melanggar ketentuan keuangan (tunggakan UKT, etc.)',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
            [
                'nama' => 'Kedisiplinan',
                'deskripsi' => 'Melanggar aturan kedisiplinan kampus',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
            [
                'nama' => 'Integritas',
                'deskripsi' => 'Melanggar integritas akademik (plagiarisme, kecurangan, etc.)',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
            [
                'nama' => 'Cuti Tanpa Izin',
                'deskripsi' => 'Cuti tanpa persetujuan resmi',
                'eskalasi' => 'langsung_sp3',
                'aktif' => true,
            ],
            [
                'nama' => 'Pelaporan',
                'deskripsi' => 'Tidak memenuhi kewajiban pelaporan KIP-K',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
            [
                'nama' => 'Pelayanan',
                'deskripsi' => 'Melanggar ketentuan pelayanan/asesment',
                'eskalasi' => 'otomatis',
                'aktif' => true,
            ],
        ];

        foreach ($items as $item) {
            JenisPelanggaran::updateOrCreate(
                ['nama' => $item['nama']],
                $item
            );
        }
    }
}
