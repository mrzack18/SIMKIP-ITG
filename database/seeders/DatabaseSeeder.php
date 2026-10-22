<?php

namespace Database\Seeders;

use App\Models\DokumenJenis;
use App\Models\JenisPelanggaran;
use App\Models\Konfigurasi;
use App\Models\Mahasiswa;
use App\Models\NilaiMutu;
use App\Models\PeriodeAkademik;
use App\Models\Prodi;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seeder akun awal dan data referensi untuk production.
     *
     * Membuat 5 akun: admin, warek3, prodi, mahasiswa, dan lsipd.
     * Password default semua akun: "password" (wajib diganti saat login pertama).
     *
     * Jalankan: php artisan db:seed --class=DatabaseSeeder --force
     */
    public function run(): void
    {
        $password = Hash::make('password');

        $this->seedProdi();

        $prodi = Prodi::where('kode', '06')->firstOrFail();

        $this->account('admin', 'Administrator SIMKIP', 'admin@itg.ac.id', 'admin', $password);
        $this->account('warek3', 'Wakil Rektor III', 'warek3@itg.ac.id', 'warek', $password);
        $this->account('prodi', 'Kaprodi Teknik Informatika', 'prodi@itg.ac.id', 'prodi', $password, $prodi->id);

        $mahasiswaUser = $this->account(
            'mahasiswa',
            'Mahasiswa SIMKIP',
            'mahasiswa@student.itg.ac.id',
            'mahasiswa',
            $password,
            $prodi->id,
        );

        Mahasiswa::updateOrCreate(
            ['user_id' => $mahasiswaUser->id],
            [
                'nim' => '0000001',
                'nama' => 'Mahasiswa SIMKIP',
                'prodi_id' => $prodi->id,
                'angkatan' => now()->year,
                'kategori' => 'Reguler',
                'status' => 'Aktif',
                'nomor_sk' => 'SK-PROD-0000001',
                'tanggal_sk' => now()->toDateString(),
            ],
        );

        $this->account('lsipd', 'Operator LSIPD', 'lsipd@itg.ac.id', 'lsipd', $password);

        $this->seedTahunAjaran();
        $this->seedPeriodeAkademik();
        $this->seedDokumenJenis();
        $this->seedJenisPelanggaran();
        $this->seedNilaiMutu();
        $this->seedKonfigurasi();
    }

    private function seedProdi(): void
    {
        $prodis = [
            ['kode' => '06', 'nama' => 'Teknik Informatika', 'is_aktif' => true],
            ['kode' => '07', 'nama' => 'Sistem Informasi', 'is_aktif' => true],
            ['kode' => '03', 'nama' => 'Teknik Industri', 'is_aktif' => true],
            ['kode' => '11', 'nama' => 'Teknik Sipil', 'is_aktif' => true],
            ['kode' => '24', 'nama' => 'Arsitektur', 'is_aktif' => true],
        ];

        foreach ($prodis as $prodi) {
            Prodi::firstOrCreate(['kode' => $prodi['kode']], $prodi);
        }
    }

    private function seedTahunAjaran(): void
    {
        $tahunAjarans = [
            ['tahun_akademik' => '2022/2023', 'semester' => 'Ganjil', 'is_aktif' => false],
            ['tahun_akademik' => '2022/2023', 'semester' => 'Genap', 'is_aktif' => false],
            ['tahun_akademik' => '2023/2024', 'semester' => 'Ganjil', 'is_aktif' => false],
            ['tahun_akademik' => '2023/2024', 'semester' => 'Genap', 'is_aktif' => false],
            ['tahun_akademik' => '2024/2025', 'semester' => 'Ganjil', 'is_aktif' => false],
            ['tahun_akademik' => '2024/2025', 'semester' => 'Genap', 'is_aktif' => false],
            ['tahun_akademik' => '2025/2026', 'semester' => 'Ganjil', 'is_aktif' => false],
            ['tahun_akademik' => '2025/2026', 'semester' => 'Genap', 'is_aktif' => false],
            ['tahun_akademik' => '2026/2027', 'semester' => 'Ganjil', 'is_aktif' => false],
        ];

        foreach ($tahunAjarans as $tahunAjaran) {
            TahunAjaran::firstOrCreate(
                [
                    'tahun_akademik' => $tahunAjaran['tahun_akademik'],
                    'semester' => $tahunAjaran['semester'],
                ],
                ['is_aktif' => $tahunAjaran['is_aktif']],
            );
        }
    }

    private function seedPeriodeAkademik(): void
    {
        $periodes = [
            ['tahun_akademik' => '2025/2026', 'semester' => 'Genap', 'tanggal_buka' => '2026-08-01', 'tanggal_tutup' => '2026-09-30', 'is_aktif' => false],
            ['tahun_akademik' => '2025/2026', 'semester' => 'Ganjil', 'tanggal_buka' => '2026-08-05', 'tanggal_tutup' => '2026-09-30', 'is_aktif' => false],
            ['tahun_akademik' => '2024/2025', 'semester' => 'Genap', 'tanggal_buka' => '2025-08-01', 'tanggal_tutup' => '2025-09-30', 'is_aktif' => false],
            ['tahun_akademik' => '2026/2027', 'semester' => 'Ganjil', 'tanggal_buka' => '2026-09-08', 'tanggal_tutup' => '2026-09-30', 'is_aktif' => true],
        ];

        foreach ($periodes as $periode) {
            PeriodeAkademik::firstOrCreate(
                [
                    'tahun_akademik' => $periode['tahun_akademik'],
                    'semester' => $periode['semester'],
                ],
                [
                    'tanggal_buka' => $periode['tanggal_buka'],
                    'tanggal_tutup' => $periode['tanggal_tutup'],
                    'is_aktif' => $periode['is_aktif'],
                ],
            );
        }
    }

    private function seedDokumenJenis(): void
    {
        $dokumenJenis = [
            ['nama' => 'PKKMB', 'is_wajib' => true, 'urutan' => 1],
            ['nama' => 'MABIM', 'is_wajib' => true, 'urutan' => 2],
            ['nama' => 'Bela Negara', 'is_wajib' => true, 'urutan' => 3],
            ['nama' => 'Sertifikasi', 'is_wajib' => false, 'urutan' => 4],
            ['nama' => 'Berita Acara KP', 'is_wajib' => false, 'urutan' => 5],
            ['nama' => 'KHS', 'is_wajib' => false, 'urutan' => 0],
            ['nama' => 'Pakta Integritas', 'is_wajib' => true, 'urutan' => 0],
        ];

        foreach ($dokumenJenis as $jenis) {
            DokumenJenis::firstOrCreate(
                ['nama' => $jenis['nama']],
                ['is_wajib' => $jenis['is_wajib'], 'urutan' => $jenis['urutan']],
            );
        }
    }

    private function seedJenisPelanggaran(): void
    {
        $jenisPelanggarans = [
            ['nama' => 'Akademik', 'deskripsi' => 'Pelanggaran IPK di bawah standar minimum yang ditetapkan', 'eskalasi' => 'normal', 'aktif' => true],
            ['nama' => 'Keuangan', 'deskripsi' => 'Melanggar ketentuan keuangan (tunggakan UKT, etc.)', 'eskalasi' => 'otomatis', 'aktif' => true],
            ['nama' => 'Kedisiplinan', 'deskripsi' => 'Melanggar aturan kedisiplinan kampus', 'eskalasi' => 'otomatis', 'aktif' => true],
            ['nama' => 'Integritas', 'deskripsi' => 'Melanggar integritas akademik (plagiarisme, kecurangan, etc.)', 'eskalasi' => 'otomatis', 'aktif' => true],
            ['nama' => 'Cuti Tanpa Izin', 'deskripsi' => 'Tidak melakukan registrasi ulang tanpa keterangan', 'eskalasi' => 'langsung_sp3', 'aktif' => true],
            ['nama' => 'Pelaporan', 'deskripsi' => 'Tidak memenuhi kewajiban pelaporan KIP-K', 'eskalasi' => 'otomatis', 'aktif' => true],
            ['nama' => 'Pelayanan', 'deskripsi' => 'Melanggar ketentuan pelayanan/asesment', 'eskalasi' => 'otomatis', 'aktif' => true],
            ['nama' => 'Non-Akademik', 'deskripsi' => 'Pelanggaran kode etik atau tata tertib kampus', 'eskalasi' => 'normal', 'aktif' => true],
        ];

        foreach ($jenisPelanggarans as $jenis) {
            JenisPelanggaran::firstOrCreate(
                ['nama' => $jenis['nama']],
                ['deskripsi' => $jenis['deskripsi'], 'eskalasi' => $jenis['eskalasi'], 'aktif' => $jenis['aktif']],
            );
        }
    }

    private function seedNilaiMutu(): void
    {
        $nilaiMutus = [
            ['huruf' => 'A', 'min' => 80.0, 'max' => 100.0, 'poin' => 4.00, 'lulus' => true],
            ['huruf' => 'AB', 'min' => 75.0, 'max' => 79.9, 'poin' => 3.50, 'lulus' => true],
            ['huruf' => 'B', 'min' => 70.0, 'max' => 74.9, 'poin' => 3.00, 'lulus' => true],
            ['huruf' => 'BC', 'min' => 65.0, 'max' => 69.9, 'poin' => 2.50, 'lulus' => true],
            ['huruf' => 'C', 'min' => 60.0, 'max' => 64.9, 'poin' => 2.00, 'lulus' => true],
            ['huruf' => 'D', 'min' => 55.0, 'max' => 59.9, 'poin' => 1.00, 'lulus' => false],
            ['huruf' => 'E', 'min' => 0.0, 'max' => 54.9, 'poin' => 0.00, 'lulus' => false],
        ];

        foreach ($nilaiMutus as $nilai) {
            NilaiMutu::firstOrCreate(
                ['huruf' => $nilai['huruf']],
                ['min' => $nilai['min'], 'max' => $nilai['max'], 'poin' => $nilai['poin'], 'lulus' => $nilai['lulus']],
            );
        }
    }

    private function seedKonfigurasi(): void
    {
        $configs = [
            ['key' => 'ipk_minimum', 'value' => '3.0', 'label' => 'IPK Minimum KIP-K', 'tipe' => 'number'],
            ['key' => 'max_semester', 'value' => '8', 'label' => 'Batas Semester Studi', 'tipe' => 'number'],
            ['key' => 'sks_minimum_lulus', 'value' => '144', 'label' => 'Minimum SKS Kelulusan', 'tipe' => 'number'],
            ['key' => 'nama_institusi', 'value' => 'Institut Teknologi Garut', 'label' => 'Nama Institusi', 'tipe' => 'text'],
            ['key' => 'singkatan_institusi', 'value' => 'ITG', 'label' => 'Singkatan Institusi', 'tipe' => 'text'],
            ['key' => 'alamat_institusi', 'value' => 'Jl. Mayor Syamsu No.1, Garut 44151', 'label' => 'Alamat Institusi', 'tipe' => 'text'],
            ['key' => 'telp_institusi', 'value' => '(0262) 540895', 'label' => 'Telepon Institusi', 'tipe' => 'text'],
            ['key' => 'logo_institusi', 'value' => '', 'label' => 'Logo Institusi', 'tipe' => 'text'],
            ['key' => 'periode_input_aktif', 'value' => '1', 'label' => 'Periode Input Aktif', 'tipe' => 'boolean'],
            ['key' => 'periode_input_buka', 'value' => '2026-09-08', 'label' => 'Tanggal Buka', 'tipe' => 'date'],
            ['key' => 'periode_input_tutup', 'value' => '2026-09-30', 'label' => 'Tanggal Tutup', 'tipe' => 'date'],
            ['key' => 'tahun_akademik_aktif', 'value' => null, 'label' => 'Tahun Akademik Aktif', 'tipe' => 'text'],
            ['key' => 'semester_aktif', 'value' => null, 'label' => 'Semester Aktif', 'tipe' => 'text'],
            ['key' => 'masa_tenggang_sp', 'value' => '90', 'label' => 'Masa Tenggang SP', 'tipe' => 'number'],
            ['key' => 'sks_minimum_semester', 'value' => '18', 'label' => 'Minimum SKS per Semester', 'tipe' => 'number'],
            ['key' => 'periode_input_ta', 'value' => '2025/2026 Genap', 'label' => 'Tahun Ajaran Input Nilai', 'tipe' => 'text'],
            ['key' => 'periode_input_tahun_ajaran', 'value' => '2026/2027 Ganjil', 'label' => 'Periode Input TA', 'tipe' => 'text'],
        ];

        foreach ($configs as $config) {
            Konfigurasi::firstOrCreate(['key' => $config['key']], $config);
        }
    }

    private function account(
        string $username,
        string $name,
        string $email,
        string $role,
        string $password,
        ?int $prodiId = null,
    ): User {
        $user = User::updateOrCreate(
            ['username' => $username],
            [
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'role' => $role,
                'prodi_id' => $prodiId,
                'is_password_changed' => false,
            ],
        );

        // is_active tidak termasuk fillable User, jadi ditulis langsung.
        $user->forceFill(['is_active' => true])->save();

        return $user->refresh();
    }
}
