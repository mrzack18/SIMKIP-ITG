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
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class KaillaSeeder extends Seeder
{
    public function run()
    {
        // Delete old Kailla if exists
        $oldUser = User::where('username', '2306064')->first();
        if ($oldUser) {
            Mahasiswa::where('user_id', $oldUser->id)->delete();
            $oldUser->delete();
        }

        // Find or create Prodi Informatika
        $prodi = Prodi::where('kode', 'TI')->orWhere('nama', 'like', '%Informatika%')->first();
        if (!$prodi) {
            $prodi = Prodi::create(['kode' => 'TI', 'nama' => 'Teknik Informatika', 'is_aktif' => true]);
        }

        // Create User
        $user = User::create([
            'name' => 'Kailla Salsabila',
            'email' => 'kailla@student.itg.ac.id',
            'username' => '2306064',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
            'prodi_id' => $prodi->id
        ]);

        // Create Mahasiswa
        $mhs = Mahasiswa::create([
            'user_id' => $user->id,
            'nim' => '2306064',
            'nama' => 'Kailla Salsabila',
            'prodi_id' => $prodi->id,
            'angkatan' => '2023',
            'kategori' => 'Reguler',
            'status' => 'Aktif',
            'nomor_sk' => 'SK/KIP-K/ITG/2023/2306064',
            'tanggal_sk' => Carbon::create(2023, 8, 15),
            'created_at' => Carbon::create(2023, 8, 20),
            'updated_at' => Carbon::create(2023, 8, 20),
        ]);

        // 6 Semesters History
        $semesters = [
            1 => ['ta' => '2023/2024 Ganjil', 'date' => Carbon::create(2024, 2, 10), 'ipk' => 3.75],
            2 => ['ta' => '2023/2024 Genap',  'date' => Carbon::create(2024, 8, 10), 'ipk' => 3.80],
            3 => ['ta' => '2024/2025 Ganjil', 'date' => Carbon::create(2025, 2, 10), 'ipk' => 2.90], // Below standard
            4 => ['ta' => '2024/2025 Genap',  'date' => Carbon::create(2025, 8, 10), 'ipk' => 3.10], // Recovered
            5 => ['ta' => '2025/2026 Ganjil', 'date' => Carbon::create(2026, 2, 10), 'ipk' => 3.65],
            6 => ['ta' => '2025/2026 Genap',  'date' => Carbon::create(2026, 8, 10), 'ipk' => 3.90],
        ];

        // Ensure DokumenJenis exists
        $jenisKHS = DokumenJenis::where('nama', 'KHS')->first();
        if (!$jenisKHS) {
            $jenisKHS = DokumenJenis::create(['nama' => 'KHS', 'is_wajib' => false]);
        }
        $jenisPakta = DokumenJenis::where('nama', 'Pakta Integritas')->first();
        if (!$jenisPakta) {
            $jenisPakta = DokumenJenis::create(['nama' => 'Pakta Integritas', 'is_wajib' => true]);
        }
        $jenisPkkmb = DokumenJenis::where('nama', 'PKKMB')->first() ?: DokumenJenis::create(['nama' => 'PKKMB', 'is_wajib' => true]);
        $jenisBelaNegara = DokumenJenis::where('nama', 'Bela Negara')->first() ?: DokumenJenis::create(['nama' => 'Bela Negara', 'is_wajib' => true]);
        $jenisMabim = DokumenJenis::where('nama', 'MABIM')->first() ?: DokumenJenis::create(['nama' => 'MABIM', 'is_wajib' => true]);
        $jenisSertifikasi = DokumenJenis::where('nama', 'Sertifikasi')->first() ?: DokumenJenis::create(['nama' => 'Sertifikasi', 'is_wajib' => true]);

        // Initial Pakta Integritas
        Dokumen::create([
            'mahasiswa_id' => $mhs->id,
            'dokumen_jenis_id' => $jenisPakta->id,
            'nama_file' => 'Pakta_Integritas_2306064.pdf',
            'path_file' => 'dokumen/dummy_pakta.pdf',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2023, 8, 21),
            'updated_at' => Carbon::create(2023, 8, 22),
        ]);

        // PKKMB (Semester 1)
        Dokumen::create([
            'mahasiswa_id' => $mhs->id,
            'dokumen_jenis_id' => $jenisPkkmb->id,
            'nama_file' => 'Sertifikat_PKKMB_2306064.pdf',
            'path_file' => 'dokumen/dummy_pkkmb.pdf',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2023, 8, 25),
            'updated_at' => Carbon::create(2023, 8, 27),
        ]);

        // Bela Negara (Semester 1)
        Dokumen::create([
            'mahasiswa_id' => $mhs->id,
            'dokumen_jenis_id' => $jenisBelaNegara->id,
            'nama_file' => 'Sertifikat_BelaNegara_2306064.pdf',
            'path_file' => 'dokumen/dummy_belanegara.pdf',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2023, 9, 15),
            'updated_at' => Carbon::create(2023, 9, 20),
        ]);

        // MABIM (Semester 2)
        Dokumen::create([
            'mahasiswa_id' => $mhs->id,
            'dokumen_jenis_id' => $jenisMabim->id,
            'nama_file' => 'Sertifikat_MABIM_2306064.pdf',
            'path_file' => 'dokumen/dummy_mabim.pdf',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2024, 3, 20),
            'updated_at' => Carbon::create(2024, 3, 25),
        ]);

        // Sertifikasi (Semester 6)
        Dokumen::create([
            'mahasiswa_id' => $mhs->id,
            'dokumen_jenis_id' => $jenisSertifikasi->id,
            'nama_file' => 'Sertifikat_Kompetensi_2306064.pdf',
            'path_file' => 'dokumen/dummy_sertifikasi.pdf',
            'status' => 'Menunggu', // Let's make it waiting for review
            'created_at' => Carbon::create(2026, 5, 10),
            'updated_at' => Carbon::create(2026, 5, 10),
        ]);

        foreach ($semesters as $sem => $data) {
            $ipkRec = IpkSemestr::create([
                'mahasiswa_id' => $mhs->id,
                'semester' => $sem,
                'tahun_ajaran' => $data['ta'],
                'ipk' => $data['ipk'],
                'file_khs' => "khs_sem_{$sem}_2306064.pdf",
                'is_verified' => true,
                'created_at' => $data['date'],
                'updated_at' => $data['date'],
            ]);

            // Create Dokumen upload record for this KHS
            Dokumen::create([
                'mahasiswa_id' => $mhs->id,
                'dokumen_jenis_id' => $jenisKHS->id,
                'nama_file' => "KHS_Semester_{$sem}.pdf",
                'path_file' => "dokumen/khs_sem_{$sem}_2306064.pdf",
                'status' => 'Disetujui',
                'catatan_admin' => "Semester $sem ({$data['ta']})",
                'created_at' => $data['date'],
                'updated_at' => $data['date']->copy()->addDays(2),
            ]);

            // Create 1 dummy course per semester
            MataKuliah::create([
                'ipk_semester_id' => $ipkRec->id,
                'kode' => "IF" . (100 + $sem),
                'nama' => "Mata Kuliah Dummy Semester $sem",
                'sks' => 3,
                'nilai_huruf' => $data['ipk'] >= 3.5 ? 'A' : ($data['ipk'] >= 3.0 ? 'B' : 'C'),
                'nilai_mutu' => $data['ipk'],
                'lulus' => true,
            ]);
        }

        // Create an SP in Sem 3 (when IPK dropped to 2.90)
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            SuratPeringatan::create([
                'mahasiswa_id' => $mhs->id,
                'level' => 'SP1',
                'jenis_pelanggaran' => 'Akademik',
                'deskripsi' => 'IPK Semester 3 turun di bawah 3.00 (2.90).',
                'tanggal_terbit' => Carbon::create(2025, 2, 20),
                'batas_evaluasi' => Carbon::create(2025, 8, 20),
                'status' => 'Selesai', // Selesai karena IPK Sem 4 naik
                'diterbitkan_oleh' => $admin->id,
                'catatan' => 'Dievaluasi dan dinyatakan perbaikan pada Semester 4.',
                'nomor_surat' => '001/SP/SIMKIP/2025',
                'created_at' => Carbon::create(2025, 2, 20),
                'updated_at' => Carbon::create(2025, 8, 20),
            ]);

            // Create another SP in Sem 5 (Non-Akademik)
            \App\Models\SuratPeringatan::create([
                'mahasiswa_id' => $mhs->id,
                'level' => 'SP2', // Escalates to SP2
                'jenis_pelanggaran' => 'Non-Akademik',
                'deskripsi' => 'Melanggar kode etik asrama (terlambat pulang 3x).',
                'tanggal_terbit' => Carbon::create(2025, 11, 15), // 2025/2026 Ganjil
                'batas_evaluasi' => Carbon::create(2026, 1, 31), // Akhir Ganjil
                'status' => 'Selesai', // Selesai as of Sem 6
                'diterbitkan_oleh' => $admin->id,
                'catatan' => 'Selesai menjalani sanksi pembinaan dan tidak mengulangi kesalahan.',
                'nomor_surat' => '050/SP2/SIMKIP/2025',
                'created_at' => Carbon::create(2025, 11, 15),
                'updated_at' => Carbon::create(2026, 1, 31),
            ]);
        }

        // Add Prestasi in Sem 4 (2024/2025 Genap)
        Prestasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama_prestasi' => 'Juara 1 Lomba Web Design',
            'tingkat' => 'Nasional',
            'pencapaian' => 'Juara 1',
            'penyelenggara' => 'Kemenristekdikti',
            'tanggal_mulai' => Carbon::create(2025, 5, 10),
            'tanggal_selesai' => Carbon::create(2025, 5, 12),
            'tempat' => 'Jakarta',
            'status' => 'Disetujui',
            'validated_at' => Carbon::create(2025, 5, 20),
            'created_at' => Carbon::create(2025, 5, 15), // Seed the created_at appropriately
            'updated_at' => Carbon::create(2025, 5, 20),
        ]);

        // Add Organisasi 1: HIMA (2023/2024 Genap)
        Organisasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'Himpunan Mahasiswa Informatika (HIMA-IF)',
            'jenis' => 'Organisasi',
            'jabatan' => 'Anggota Divisi Kominfo',
            'periode_mulai' => Carbon::create(2024, 3, 1),
            'periode_selesai' => Carbon::create(2025, 2, 28),
            'deskripsi' => 'Aktif dalam pembuatan konten sosial media HIMA-IF.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2024, 3, 10),
            'updated_at' => Carbon::create(2024, 3, 15),
        ]);

        // Add Organisasi 2: BEM (2025/2026 Ganjil)
        Organisasi::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'Badan Eksekutif Mahasiswa (BEM) ITG',
            'jenis' => 'Organisasi',
            'jabatan' => 'Sekretaris Kementerian Luar Negeri',
            'periode_mulai' => Carbon::create(2025, 10, 1),
            'periode_selesai' => Carbon::create(2026, 9, 30),
            'deskripsi' => 'Mengurus administrasi surat menyurat eksternal kampus.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2025, 10, 5),
            'updated_at' => Carbon::create(2025, 10, 10),
        ]);

        // Add Pelatihan Akademik (2024/2025 Ganjil)
        \App\Models\Pelatihan::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'Bootcamp Fullstack Laravel & React',
            'jenis' => 'Akademik',
            'penyelenggara' => 'BuildWithAngga',
            'tanggal_mulai' => Carbon::create(2024, 11, 1),
            'tanggal_selesai' => Carbon::create(2024, 11, 30),
            'tempat' => 'Online',
            'deskripsi' => 'Pelatihan intensif pembuatan aplikasi web modern.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2024, 12, 2),
            'updated_at' => Carbon::create(2024, 12, 5),
        ]);

        // Add Pelatihan Non-Akademik (2025/2026 Genap)
        \App\Models\Pelatihan::create([
            'mahasiswa_id' => $mhs->id,
            'nama' => 'Pelatihan Public Speaking & Leadership',
            'jenis' => 'Non-Akademik',
            'penyelenggara' => 'Kementerian Pemuda dan Olahraga',
            'tanggal_mulai' => Carbon::create(2026, 4, 15),
            'tanggal_selesai' => Carbon::create(2026, 4, 17),
            'tempat' => 'Bandung',
            'deskripsi' => 'Meningkatkan kemampuan berbicara di depan umum.',
            'status' => 'Disetujui',
            'created_at' => Carbon::create(2026, 4, 20),
            'updated_at' => Carbon::create(2026, 4, 22),
        ]);

        echo "Success creating dummy student Kailla Salsabila with 6 semesters of history!\n";
    }
}
