<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use App\Models\DokumenJenis;
use App\Models\IpkSemestr;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Mahasiswa dengan SEMUA syarat Surat Penyelesaian (Bebas Tanggungan) terpenuhi:
 * - Semua dokumen wajib Disetujui
 * - IPK ≥ 3.00
 * - Total SKS lulus ≥ 144
 * - Tidak ada MK belum lulus
 * - Tidak ada SP aktif
 * - Langsung punya permohonan Disetujui (siap test download PDF)
 */
class MahasiswaSelesaiSeeder extends Seeder
{
    private const NIM    = '2507101';
    private const NAMA   = 'Budi Santoso';
    private const PRODI_ID = 7;   // Sistem Informasi
    private const ANGKATAN = 2025;
    private const PASSWORD = 'password';
    private const WAJIB  = ['PKKMB', 'MABIM', 'Bela Negara', 'Pakta Integritas'];

    public function run(): void
    {
        // ── 1. User + Mahasiswa ─────────────────────────────────────────────
        $user = User::updateOrCreate(
            ['username' => self::NIM],
            [
                'name'     => self::NAMA,
                'email'    => strtolower(self::NIM).'@student.itg.ac.id',
                'password' => Hash::make(self::PASSWORD),
                'role'     => 'mahasiswa',
                'prodi_id' => self::PRODI_ID,
            ]
        );

        $mhs = Mahasiswa::updateOrCreate(
            ['nim' => self::NIM],
            [
                'user_id'    => $user->id,
                'nim'        => self::NIM,
                'nama'       => self::NAMA,
                'prodi_id'   => self::PRODI_ID,
                'angkatan'   => self::ANGKATAN,
                'kategori'   => 'Reguler',
                'status'     => 'Aktif',
                'nomor_sk'   => 'SK/KIP-K/ITG/'.self::ANGKATAN.'/'.self::NIM,
                'tanggal_sk' => now()->subYear(),
            ]
        );

        echo "[1/4] Mahasiswa {$mhs->nim} ({$mhs->nama}) ready".PHP_EOL;

        // ── 2. Dokumen wajib (semua Disetujui) ─────────────────────────────
        $wajibJenis = DokumenJenis::whereIn('nama', self::WAJIB)->where('is_wajib', true)->get();

        foreach ($wajibJenis as $jenis) {
            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id'  => $mhs->id,
                    'dokumen_jenis_id' => $jenis->id,
                ],
                [
                    'nama_file' => strtolower(str_replace(' ', '_', $jenis->nama)).'_'.self::NIM.'.pdf',
                    'path_file' => 'dokumen/'.self::NIM.'/'.strtolower(str_replace(' ', '_', $jenis->nama)).'.pdf',
                    'ukuran'    => random_int(50000, 500000),
                    'status'    => 'Disetujui',
                    'catatan_admin' => null,
                    'approved_by'   => 1,
                    'approved_at'   => now()->subMonths(rand(1, 4)),
                ]
            );
        }
        echo "[2/4] {$wajibJenis->count()} dokumen wajib → Disetujui".PHP_EOL;

        // ── 3. IPK + Mata Kuliah (8 semester, total ~148 SKS, semua lulus) ──
        $taBase = 2024;
        $skPerSem = [
            1 => ['MK' => ['Pengantar Teknologi Informasi','Kalkulus I','Bahasa Inggris','Pendidikan Pancasila','Algoritma Pemrograman','Kalkulus II','Fisika Dasar','Pendidikan Agama'],'sks' => [3,3,2,2,3,3,2,2]],
            2 => ['MK' => ['Struktur Data','Basis Data','Matematika Diskrit','Logika Informatika','Sistem Operasi','Jaringan Komputer','Pemrograman Web','Statistika'],'sks' => [3,3,3,3,3,3,3,3]],
            3 => ['MK' => ['Rekayasa Perangkat Lunak','Pemrograman Berorientasi Objek','Teori Graf','Interaksi Manusia & Komputer','Keamanan Sistem','Sistem Basis Data Lanjut','Mobile Programming','Metodologi Penelitian'],'sks' => [3,3,3,3,3,3,3,2]],
            4 => ['MK' => ['Kecerdasan Buatan','Machine Learning','Data Mining','Cloud Computing','Internet of Things','Pengolahan Citra Digital','Sistem Informasi Manajemen','Etika Profesi'],'sks' => [3,3,3,3,3,3,3,2]],
            5 => ['MK' => ['Deep Learning','Blockchain','Big Data Analytics','Cyber Security','Pengembangan Aplikasi Mobile','Arsitektur Enterprise','Manajemen Proyek TI','Seminari'],'sks' => [3,3,3,3,3,3,3,2]],
            6 => ['MK' => ['Natural Language Processing','Computer Vision','Distributed Systems','IT Governance','Digital Entrepreneurship','Capstone Project I','Studi Independen','Praktikum RPL'],'sks' => [3,3,3,3,2,3,2,3]],
            7 => ['MK' => ['Capstone Project II','Kerja Praktek','Seminar Proposal','Topik Khusus AI','Komputasi Paralel','Rekayasa Data','Sistem Cerdas','Manajemen Risiko TI'],'sks' => [3,3,3,3,3,3,3,2]],
            8 => ['MK' => ['Tugas Akhir','Magang Industri','Publishing Paper','Review Jurnal','Komprehensif'],'sks' => [6,3,2,2,2]],
        ];

        $totalSks = 0;
        foreach ($skPerSem as $sem => $data) {
            $ipk = round(3.5 + (random_int(0, 50) / 100), 2);
            $taSem = $this->taForSemester($sem, $taBase);

            $ipkRec = IpkSemestr::updateOrCreate(
                ['mahasiswa_id' => $mhs->id, 'semester' => $sem],
                [
                    'tahun_ajaran' => $taSem,
                    'ipk'          => $ipk,
                    'ips'          => $ipk,
                    'file_khs'     => 'khs_sem_'.$sem.'_'.self::NIM.'.pdf',
                    'status'       => 'Disetujui',
                    'validated_by' => null,
                    'validated_at' => null,
                    'catatan_admin'=> null,
                ]
            );

            foreach ($data['MK'] as $i => $mkNama) {
                MataKuliah::updateOrCreate(
                    [
                        'ipk_semester_id' => $ipkRec->id,
                        'kode'            => 'MK'.str_pad($sem, 2, '0', STR_PAD_LEFT).str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                    ],
                    [
                        'nama'       => $mkNama,
                        'sks'        => $data['sks'][$i],
                        'nilai_huruf'=> 'A',
                        'nilai_mutu' => 4.0,
                        'lulus'      => true,
                    ]
                );
                $totalSks += $data['sks'][$i];
            }
        }
        echo "[3/4] 8 semester IPK (total {$totalSks} SKS, semua lulus, IPK akhir ≥ 3.50)".PHP_EOL;

        // ── 4. (Opsional) Permohonan Disetujui + nomor surat ────────────────
        $existingBt = $mhs->bebasTanggungan()->first();
        if (!$existingBt) {
            $bt = \App\Models\BebasTanggungan::create([
                'mahasiswa_id'  => $mhs->id,
                'tanggal_ajukan' => now()->subMonths(2)->toDateString(),
                'status'        => 'Disetujui',
                'catatan_admin' => null,
                'reviewed_by'   => 1,
                'reviewed_at'   => now()->subMonths(1),
                'nomor_surat'   => '050/SKPS/KIP-K/ITG/'.date('m').'/'.date('Y'),
                'tanggal_terbit'=> now()->subMonth()->toDateString(),
            ]);

            \App\Models\BebasTanggunganHistory::create([
                'bebas_tanggungan_id' => $bt->id,
                'status'              => 'Disetujui',
                'catatan'             => 'Syarat lengkap, diterbitkan otomatis via seeder.',
                'reviewed_by'         => 1,
            ]);

            $mhs->update(['status' => 'Lulus']);
            echo "[4/4] Permohonan Disetujui → nomor surat: {$bt->nomor_surat}".PHP_EOL;
        } else {
            echo "[4/4] Permohonan sudah ada (skip): status={$existingBt->status}".PHP_EOL;
        }

        echo PHP_EOL."✅ SELESAI. Login: username=".self::NIM." password=".self::PASSWORD.PHP_EOL;
    }

    private function taForSemester(int $sem, int $base): string
    {
        $offset = (int) floor(($sem - 1) / 2);
        $genap  = ($sem % 2 === 0) ? 'Genap' : 'Ganjil';
        return ($base + $offset).'/'.($base + $offset + 1).' '.$genap;
    }
}
