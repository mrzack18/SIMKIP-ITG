<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KonfigurasiPhase7Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Nilai Mutu
        $nilaiMutus = [
            ['id' => 1, 'min' => 80, 'max' => 100, 'huruf' => 'A', 'poin' => 4.0, 'lulus' => true],
            ['id' => 2, 'min' => 75, 'max' => 79.9, 'huruf' => 'AB', 'poin' => 3.5, 'lulus' => true],
            ['id' => 3, 'min' => 70, 'max' => 74.9, 'huruf' => 'B', 'poin' => 3.0, 'lulus' => true],
            ['id' => 4, 'min' => 65, 'max' => 69.9, 'huruf' => 'BC', 'poin' => 2.5, 'lulus' => true],
            ['id' => 5, 'min' => 60, 'max' => 64.9, 'huruf' => 'C', 'poin' => 2.0, 'lulus' => true],
            ['id' => 6, 'min' => 55, 'max' => 59.9, 'huruf' => 'D', 'poin' => 1.0, 'lulus' => false],
            ['id' => 7, 'min' => 0, 'max' => 54.9, 'huruf' => 'E', 'poin' => 0.0, 'lulus' => false],
        ];
        foreach ($nilaiMutus as $n) {
            DB::table('nilai_mutus')->updateOrInsert(['id' => $n['id']], $n);
        }

        // 2. Jenis Pelanggaran
        $jenisPelanggarans = [
            ['nama' => 'Akademik', 'deskripsi' => 'Pelanggaran IPK di bawah standar minimum yang ditetapkan', 'eskalasi' => 'normal', 'aktif' => true],
            ['nama' => 'Non-Akademik', 'deskripsi' => 'Pelanggaran kode etik atau tata tertib kampus', 'eskalasi' => 'normal', 'aktif' => true],
            ['nama' => 'Cuti Tanpa Izin', 'deskripsi' => 'Tidak melakukan registrasi ulang tanpa keterangan', 'eskalasi' => 'langsung_sp3', 'aktif' => true],
        ];
        foreach ($jenisPelanggarans as $j) {
            DB::table('jenis_pelanggarans')->updateOrInsert(['nama' => $j['nama']], $j);
        }

        // 3. Periode Akademik History
        $periodes = [
            ['tahun_akademik' => '2025/2026', 'semester' => 'Genap', 'tanggal_buka' => '2026-08-01', 'tanggal_tutup' => '2026-09-30', 'is_aktif' => true],
            ['tahun_akademik' => '2025/2026', 'semester' => 'Ganjil', 'tanggal_buka' => '2026-02-01', 'tanggal_tutup' => '2026-03-31', 'is_aktif' => false],
            ['tahun_akademik' => '2024/2025', 'semester' => 'Genap', 'tanggal_buka' => '2025-08-01', 'tanggal_tutup' => '2025-09-30', 'is_aktif' => false],
        ];
        foreach ($periodes as $p) {
            DB::table('periode_akademiks')->updateOrInsert(['tahun_akademik' => $p['tahun_akademik'], 'semester' => $p['semester']], $p);
        }

        // 4. Regulasi Tambahan di konfigurasis
        DB::table('konfigurasis')->updateOrInsert(
            ['key' => 'masa_tenggang_sp'],
            ['value' => '90', 'label' => 'Masa Tenggang SP', 'tipe' => 'number']
        );
        DB::table('konfigurasis')->updateOrInsert(
            ['key' => 'sks_minimum_semester'],
            ['value' => '18', 'label' => 'Minimum SKS per Semester', 'tipe' => 'number']
        );
    }
}
