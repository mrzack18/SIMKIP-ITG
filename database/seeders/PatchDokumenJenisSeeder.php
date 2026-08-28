<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatchDokumenJenisSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            'Sertifikat PKKMB' => [
                'kode' => 'pkkmb',
                'deskripsi' => 'Sertifikat Pengenalan Kehidupan Kampus Bagi Mahasiswa Baru'
            ],
            'Sertifikat Bela Negara' => [
                'kode' => 'belanegara',
                'deskripsi' => 'Sertifikat keikutsertaan program Bela Negara'
            ],
            'Sertifikat MABIM' => [
                'kode' => 'mabim',
                'deskripsi' => 'Sertifikat keikutsertaan Masa Bimbingan Mahasiswa'
            ],
            'Berita Acara Kerja Praktik' => [
                'kode' => 'ba_kp',
                'deskripsi' => 'Berita acara/bukti sidang Kerja Praktik'
            ],
            'Sertifikasi' => [
                'kode' => 'sertifikasi',
                'deskripsi' => 'Sertifikat profesional/kompetensi (minimal 1 wajib)'
            ],
        ];

        foreach ($map as $nama => $data) {
            DB::table('dokumen_jenis')
                ->where('nama', $nama)
                ->update([
                    'kode' => $data['kode'],
                    'deskripsi' => $data['deskripsi']
                ]);
        }
    }
}
