<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Prodi;
use App\Models\Mahasiswa;
use App\Models\IpkSemestr;
use App\Models\MataKuliah;
use App\Models\Prestasi;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use App\Models\Dokumen;
use App\Models\SuratPeringatan;
use App\Models\BebasTanggungan;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        $prodis = Prodi::all();
        if ($prodis->isEmpty()) {
            $this->call(ProdiSeeder::class);
            $prodis = Prodi::all();
        }

        // --- 1. EDGE CASES ---
        // Mahasiswa Lulus / Bebas Tanggungan
        $mhsLulus = Mahasiswa::factory()->create([
            'status' => 'Lulus',
            'prodi_id' => $prodis->random()->id
        ]);
        BebasTanggungan::factory()->create(['mahasiswa_id' => $mhsLulus->id, 'status' => 'Disetujui']);

        // Mahasiswa Dicabut
        Mahasiswa::factory()->create([
            'status' => 'Dicabut',
            'prodi_id' => $prodis->random()->id,
            'semester_dicabut' => 'Ganjil 2025/2026',
            'tanggal_dicabut' => '2026-02-10',
            'alasan_dicabut' => 'IPK di Bawah Standar',
            'dicabut_oleh' => 'Admin Pusat'
        ]);

        // Mahasiswa Nonaktif
        Mahasiswa::factory()->create([
            'status' => 'Nonaktif',
            'prodi_id' => $prodis->random()->id,
            'alasan_nonaktif' => 'Cuti Akademik',
            'tanggal_nonaktif' => '2026-01-15'
        ]);

        // --- 2. MAHASISWA AKTIF BANYAK ---
        $mahasiswas = Mahasiswa::factory()->count(25)->create([
            'status' => 'Aktif',
            'prodi_id' => fn() => $prodis->random()->id
        ]);

        foreach ($mahasiswas as $index => $mhs) {
            // A. DATA AKADEMIK (2-5 semester)
            if ($index > 2) { // biarkan 3 mahasiswa tanpa data akademik untuk edge case
                $semesters = rand(2, 5);
                for ($s = 1; $s <= $semesters; $s++) {
                    $ipk = IpkSemestr::factory()->create([
                        'mahasiswa_id' => $mhs->id,
                        'semester' => $s,
                    ]);

                    // Mata Kuliah per semester
                    MataKuliah::factory()->count(rand(4, 6))->create([
                        'ipk_semester_id' => $ipk->id
                    ]);
                }
            }

            // B. AKTIVITAS & DOKUMEN (Random)
            if (rand(0, 1)) {
                Prestasi::factory()->count(rand(1, 3))->create(['mahasiswa_id' => $mhs->id]);
            }
            if (rand(0, 1)) {
                Organisasi::factory()->count(rand(1, 2))->create(['mahasiswa_id' => $mhs->id]);
            }
            if (rand(0, 1)) {
                Pelatihan::factory()->count(rand(1, 2))->create(['mahasiswa_id' => $mhs->id]);
            }

            // Dokumen (sebagian besar menunggu untuk test queue admin)
            Dokumen::factory()->count(rand(2, 5))->create([
                'mahasiswa_id' => $mhs->id,
                'status' => rand(0, 2) === 0 ? 'Disetujui' : (rand(0, 2) === 1 ? 'Ditolak' : 'Menunggu')
            ]);

            // C. SURAT PERINGATAN (Skenario Khusus)
            if ($index === 5) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP1', 'status' => 'Aktif']);
            } elseif ($index === 6) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP2', 'status' => 'Aktif']);
            } elseif ($index === 7) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP3', 'status' => 'Aktif']);
            } elseif ($index === 8) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP3', 'status' => 'Masa Tenggang']);
            } elseif ($index === 9) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP1', 'status' => 'Selesai']);
                // Selesai artinya Tanpa SP aktif
            } elseif ($index === 10) {
                SuratPeringatan::factory()->create(['mahasiswa_id' => $mhs->id, 'level' => 'SP2', 'status' => 'Masa Tenggang']);
            }
        }
    }
}
