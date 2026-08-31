<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\IpkSemestr;
use App\Models\MataKuliah;
use App\Models\Dokumen;
use App\Models\DokumenJenis;
use App\Models\SuratPeringatan;
use App\Models\Prestasi;
use App\Models\Organisasi;
use App\Models\Pelatihan;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ZakiSeeder extends Seeder
{
    public function run()
    {
        $nim = '2307094';
        
        $prodi = Prodi::where('nama', 'like', '%Informasi%')->first();
        if (!$prodi) {
            $prodi = Prodi::create(['nama' => 'Sistem Informasi', 'kode' => 'SI']);
        }

        $user = User::where('username', $nim)->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Zaki Muhamad',
                'username' => $nim,
                'email' => "zaki.{$nim}@itg.ac.id",
                'password' => Hash::make('password123'),
                'role' => 'mahasiswa',
                'prodi_id' => $prodi->id,
            ]);
        }

        $mhs = Mahasiswa::where('nim', $nim)->first();
        if (!$mhs) {
            $mhs = Mahasiswa::create([
                'user_id' => $user->id,
                'prodi_id' => $prodi->id,
                'nim' => $nim,
                'nama' => 'Zaki Muhamad',
                'angkatan' => 2023,
                'kategori' => 'KIP-K Aspirasi',
                'status' => 'Aktif',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2005-03-12',
            ]);
        }

        // Clean up old data to prevent duplication on multiple runs
        IpkSemestr::where('mahasiswa_id', $mhs->id)->delete();
        Dokumen::where('mahasiswa_id', $mhs->id)->delete();
        Prestasi::where('mahasiswa_id', $mhs->id)->delete();
        Organisasi::where('mahasiswa_id', $mhs->id)->delete();
        Pelatihan::where('mahasiswa_id', $mhs->id)->delete();
        SuratPeringatan::where('mahasiswa_id', $mhs->id)->delete();

        // Data KHS/IPK (Semesters 1 to 5) - Sem 6 is currently running so he hasn't uploaded KHS yet
        $semesters = [
            1 => ['ta' => '2023/2024 Ganjil', 'ipk' => 3.65],
            2 => ['ta' => '2023/2024 Genap',  'ipk' => 3.70],
            3 => ['ta' => '2024/2025 Ganjil', 'ipk' => 3.82],
            4 => ['ta' => '2024/2025 Genap',  'ipk' => 3.60],
            5 => ['ta' => '2025/2026 Ganjil', 'ipk' => 3.95], // Lonjakan drastis!
        ];

        foreach ($semesters as $sem => $data) {
            // Determine creation date dynamically based on TA
            $year = (int) substr($data['ta'], 0, 4);
            $isGanjil = strpos($data['ta'], 'Ganjil') !== false;
            // KHS is usually uploaded at the END of the semester
            $createdAt = $isGanjil 
                ? Carbon::create($year + 1, 1, 15) // January next year
                : Carbon::create($year + 1, 8, 15); // August

            $ipkRec = IpkSemestr::create([
                'mahasiswa_id' => $mhs->id,
                'semester' => $sem,
                'tahun_ajaran' => $data['ta'],
                'ipk' => $data['ipk'],
                'file_khs' => "khs_sem_{$sem}_{$nim}.pdf",
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            MataKuliah::create([
                'ipk_semester_id' => $ipkRec->id,
                'kode' => "SI10{$sem}",
                'nama' => "Mata Kuliah Inti Sistem Informasi Semester {$sem}",
                'sks' => 3,
                'nilai_huruf' => 'A',
                'nilai_mutu' => 4.0,
                'lulus' => true,
            ]);
            MataKuliah::create([
                'ipk_semester_id' => $ipkRec->id,
                'kode' => "SI20{$sem}",
                'nama' => "Pemrograman Web Lanjut {$sem}",
                'sks' => 4,
                'nilai_huruf' => 'A',
                'nilai_mutu' => 4.0,
                'lulus' => true,
            ]);
        }

        // Prestasi
        Prestasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama_prestasi' => 'Lomba UI/UX Design Nasional',
            'tingkat' => 'Nasional',
            'pencapaian' => 'Juara 1',
            'penyelenggara' => 'Universitas Indonesia',
            'tanggal_mulai' => Carbon::create(2024, 10, 5),
            'tanggal_selesai' => Carbon::create(2024, 10, 7),
            'tempat' => 'Jakarta',
            'status' => 'Disetujui',
            'validated_at' => Carbon::create(2024, 10, 10),
            'created_at' => Carbon::create(2024, 10, 8),
            'updated_at' => Carbon::create(2024, 10, 10),
        ]);

        Prestasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama_prestasi' => 'Hackathon Web3 ITB',
            'tingkat' => 'Nasional',
            'pencapaian' => 'Finalis',
            'penyelenggara' => 'Institut Teknologi Bandung',
            'tanggal_mulai' => Carbon::create(2025, 4, 12),
            'tanggal_selesai' => Carbon::create(2025, 4, 14),
            'tempat' => 'Bandung',
            'status' => 'Menunggu Validasi',
            'created_at' => Carbon::create(2025, 4, 15),
            'updated_at' => Carbon::create(2025, 4, 15),
        ]);

        // Organisasi
        Organisasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'Himpunan Mahasiswa Sistem Informasi',
            'jenis' => 'Organisasi',
            'jabatan' => 'Ketua Divisi Ristek',
            'periode_mulai' => Carbon::create(2024, 8, 1),
            'periode_selesai' => Carbon::create(2025, 8, 1),
            'deskripsi' => 'Bertanggung jawab atas program kerja riset teknologi mahasiswa.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2024, 8, 5),
            'updated_at' => Carbon::create(2024, 8, 10),
        ]);

        // Pelatihan
        Pelatihan::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'AWS Cloud Practitioner Bootcamp',
            'jenis' => 'Akademik',
            'penyelenggara' => 'Amazon Web Services',
            'tanggal_mulai' => Carbon::create(2023, 11, 20),
            'tanggal_selesai' => Carbon::create(2023, 11, 25),
            'tempat' => 'Online',
            'deskripsi' => 'Pengenalan layanan komputasi awan AWS.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2023, 11, 26),
            'updated_at' => Carbon::create(2023, 11, 28),
        ]);

        // Dokumen
        $jDok = DokumenJenis::whereIn('nama', ['PKKMB', 'Bela Negara', 'MABIM', 'Sertifikasi Kompetensi'])->get();
        
        foreach ($jDok as $j) {
            $date = Carbon::now();
            if ($j->nama == 'PKKMB') $date = Carbon::create(2023, 9, 10);
            if ($j->nama == 'Bela Negara') $date = Carbon::create(2023, 9, 15);
            if ($j->nama == 'MABIM') $date = Carbon::create(2024, 2, 10);
            if ($j->nama == 'Sertifikasi Kompetensi') $date = Carbon::create(2025, 8, 20); // Akan muncul di Sem 5
            
            Dokumen::create([
                'mahasiswa_id' => $mhs->id,
                'dokumen_jenis_id' => $j->id,
                'nama_file' => "dokumen_{$j->id}_{$nim}.pdf",
                'path_file' => "dokumen/dokumen_{$j->id}_{$nim}.pdf",
                'status' => 'Disetujui',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        $this->command->info("Success creating comprehensive dummy data for Zaki Muhamad!");
    }
}
