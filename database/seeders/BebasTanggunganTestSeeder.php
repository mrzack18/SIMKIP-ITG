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
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Faker\Factory as Faker;

class BebasTanggunganTestSeeder extends Seeder
{
    /** @var \Faker\Generator */
    private $faker;

    private const TESTAccounts = [
        [
            'nim'       => '2507101',
            'nama'      => 'Ahmad Rizky Pratama',
            'ipk_val'   => 3.45,
            'sks'       => 152,
            'mk_fail'   => 0,
            'sp'        => false,
            'doc_missing' => 'Bela Negara',
            'doc_reject'  => null,
            'catatan'   => '❌ Syarat: Dokumen "Bela Negara" belum diupload. Semua syarat lain terpenuhi.',
        ],
        [
            'nim'       => '2507102',
            'nama'      => 'Siti Nurhaliza',
            'ipk_val'   => 2.95,
            'sks'       => 156,
            'mk_fail'   => 0,
            'sp'        => false,
            'doc_missing' => null,
            'doc_reject'  => null,
            'catatan'   => '❌ Syarat: IPK 2.95 < 3.00. Semua syarat lain terpenuhi.',
        ],
        [
            'nim'       => '2507103',
            'nama'      => 'Muhammad Fadilah',
            'ipk_val'   => 3.60,
            'sks'       => 160,
            'mk_fail'   => 0,
            'sp'        => true,
            'sp_status' => 'Aktif',
            'doc_missing' => null,
            'doc_reject'  => null,
            'catatan'   => '❌ Syarat: Masih ada SP1 Aktif. Semua syarat lain terpenuhi.',
        ],
        [
            'nim'       => '2507104',
            'nama'      => 'Putri Amelia Sari',
            'ipk_val'   => 3.30,
            'sks'       => 140,
            'mk_fail'   => 0,
            'sp'        => false,
            'doc_missing' => null,
            'doc_reject'  => null,
            'catatan'   => '❌ Syarat: SKS 140 < 144. Semua syarat lain terpenuhi.',
        ],
        [
            'nim'       => '2507105',
            'nama'      => 'Dimas Agung Wicaksono',
            'ipk_val'   => 3.20,
            'sks'       => 148,
            'mk_fail'   => 1,
            'sp'        => false,
            'doc_missing' => null,
            'doc_reject'  => null,
            'catatan'   => '❌ Syarat: Ada 1 MK belum lulus (Pemrograman Web). Semua syarat lain terpenuhi.',
        ],
        [
            'nim'       => '2507106',
            'nama'      => 'Rina Marlina',
            'ipk_val'   => 3.75,
            'sks'       => 164,
            'mk_fail'   => 0,
            'sp'        => false,
            'doc_missing' => null,
            'doc_reject'  => null,
            'catatan'   => '✅ Semua syarat terpenuhi! Bisa langsung klik "Ajukan Bebas Tanggungan".',
        ],
        [
            'nim'       => '2507107',
            'nama'      => 'Farhan Maulana Ibrahim',
            'ipk_val'   => 3.50,
            'sks'       => 155,
            'mk_fail'   => 0,
            'sp'        => false,
            'doc_missing' => null,
            'doc_reject'  => 'MABIM',
            'catatan'   => '❌ Syarat: Dokumen "MABIM" ditolak admin. Upload ulang dulu.',
        ],
    ];

    public function run(): void
    {
        $this->faker = Faker::create('id_ID');
        $this->ensureDokumenJenis();
        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $this->command?->error('Admin user not found!');
            return;
        }
        $prodi = Prodi::firstOrCreate(['kode' => '06'], ['nama' => 'Teknik Informatika', 'is_aktif' => true]);
        $jenisWajib = DokumenJenis::where('is_wajib', true)->orderBy('urutan')->get();

        foreach (self::TESTAccounts as $acc) {
            $user = User::updateOrCreate(
                ['username' => $acc['nim']],
                [
                    'name'     => $acc['nama'],
                    'email'    => $acc['nim'] . '@student.itg.ac.id',
                    'password' => Hash::make('password'),
                    'role'     => 'mahasiswa',
                    'prodi_id' => $prodi->id,
                ]
            );

            $mhs = Mahasiswa::updateOrCreate(
                ['nim' => $acc['nim']],
                [
                    'user_id'     => $user->id,
                    'nim'         => $acc['nim'],
                    'nama'        => $acc['nama'],
                    'prodi_id'    => $prodi->id,
                    'angkatan'    => '2025',
                    'kategori'    => 'Reguler',
                    'status'      => 'Aktif',
                    'nomor_sk'    => "SK/KIP-K/ITG/2025/{$acc['nim']}",
                    'tanggal_sk'  => Carbon::create(2025, 8, 15),
                    'created_at'  => Carbon::create(2025, 8, 20),
                    'updated_at'  => Carbon::now(),
                ]
            );

            // --- IPK & MK ---
            $this->buildIpkRecords($mhs, $acc, $prodi, $admin);

            // --- Dokumen wajib ---
            $this->buildDocuments($mhs, $acc, $jenisWajib, $admin);

            // --- SP aktif (opsional) ---
            if ($acc['sp']) {
                SuratPeringatan::updateOrCreate(
                    ['mahasiswa_id' => $mhs->id, 'level' => 'SP1'],
                    [
                        'jenis_pelanggaran' => 'Akademik',
                        'deskripsi'          => 'IPK Semester 3 turun di bawah standar minimum',
                        'tanggal_terbit'     => Carbon::create(2026, 3, 15),
                        'batas_evaluasi'     => Carbon::create(2026, 9, 15),
                        'status'             => $acc['sp_status'] ?? 'Aktif',
                        'diterbitkan_oleh'   => $admin->id,
                        'nomor_surat'        => "{$mhs->id}/SP1/SIMKIP/2026",
                    ]
                );
            } else {
                SuratPeringatan::where('mahasiswa_id', $mhs->id)->delete();
            }

            $this->command?->info("  ✓ {$acc['nim']} - {$acc['nama']} | {$acc['catatan']}");
        }

        $this->command?->info("\nPassword semua akun: password");
        $this->command?->info("BebasTanggunganTestSeeder done.");
    }

    private function buildIpkRecords(Mahasiswa $mhs, array $acc, Prodi $prodi, User $admin): void
    {
        IpkSemestr::where('mahasiswa_id', $mhs->id)->delete();
        $jenisKHS = DokumenJenis::where('nama', 'KHS')->first();

        // 8 semester, target IPK rata-rata = ipk_val
        $target = $acc['ipk_val'];
        $ipSemesters = [];
        for ($s = 1; $s <= 8; $s++) {
            $base = $target + ($this->faker->randomFloat(2, -0.15, 0.15));
            $ipk = round(min(4.00, max(2.00, $base)), 2);
            $ipSemesters[] = $ipk;
        }
        // Fine-tune agar rata-rata mendekati target
        $avg = array_sum($ipSemesters) / count($ipSemesters);
        $diff = $target - $avg;
        $ipSemesters[7] = round(min(4.00, max(2.00, $ipSemesters[7] + $diff)), 2);

        $mkNames = [
            'Matematika Diskrit', 'Algoritma & Pemrograman', 'Struktur Data',
            'Basis Data', 'Jaringan Komputer', 'Rekayasa Perangkat Lunak',
            'Kalkulus I', 'Fisika Dasar', 'Pemrograman Web', 'Sistem Operasi',
            'Statistika', 'Desain Grafis', 'Kecerdasan Buatan', 'Cloud Computing',
            'Pemrograman Mobile', 'Interaksi Manusia Komputer', 'Machine Learning',
        ];

        for ($s = 1; $s <= 8; $s++) {
            $taSem = $this->getTahunAjaran(2025, $s);
            $date  = $this->getSemesterDate(2025, $s);
            $ipk   = $ipSemesters[$s - 1];

            $ipkRec = IpkSemestr::create([
                'mahasiswa_id' => $mhs->id,
                'semester'     => $s,
                'tahun_ajaran' => $taSem,
                'ipk'          => $ipk,
                'ips'          => $ipk,
                'file_khs'     => "khs_sem_{$s}_{$mhs->nim}.pdf",
                'status'       => 'Disetujui',
                'created_at'   => $date,
                'updated_at'   => $date->copy()->addDays(2),
            ]);

            // MK per semester (4-6 MK, total SKS ~152-164)
            $semMkCount = ($s <= 2) ? 6 : 5;
            $totalSksSem = 0;
            for ($mk = 1; $mk <= $semMkCount; $mk++) {
                $sks = ($mk <= 3) ? 4 : 3;
                $totalSksSem += $sks;

                $isFailed = false;
                // Semester 7: 1 MK gagal untuk akun #5
                if ($s === 7 && $mk === 5 && $acc['mk_fail'] > 0) {
                    $isFailed = true;
                }

                $nilaiHuruf = $isFailed ? 'D' : $this->ipkToHuruf($ipk);
                $nilaiMutu  = $isFailed ? 1.0 : $ipk;
                $lulus      = !$isFailed;
                $kodeIdx    = (($s - 1) * $semMkCount + $mk);
                $mkNama     = $mkNames[($kodeIdx - 1) % count($mkNames)];

                MataKuliah::create([
                    'ipk_semester_id' => $ipkRec->id,
                    'kode'            => $prodi->kode . str_pad($kodeIdx, 3, '0', STR_PAD_LEFT),
                    'nama'            => $mkNama,
                    'sks'             => $sks,
                    'nilai_huruf'     => $nilaiHuruf,
                    'nilai_mutu'      => $nilaiMutu,
                    'lulus'           => $lulus,
                ]);
            }

            // KHS doc
            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id'      => $mhs->id,
                    'dokumen_jenis_id'  => $jenisKHS->id,
                    'catatan_admin'     => "Semester {$s} ({$taSem})",
                ],
                [
                    'nama_file'   => "KHS_Semester_{$s}.pdf",
                    'path_file'   => "dokumen/khs_sem_{$s}_{$mhs->nim}.pdf",
                    'status'      => 'Disetujui',
                    'approved_by' => $admin->id,
                    'approved_at' => $date->copy()->addDays(3),
                    'created_at'  => $date,
                    'updated_at'  => $date->copy()->addDays(2),
                ]
            );
        }
    }

    private function buildDocuments(Mahasiswa $mhs, array $acc, $jenisWajib, User $admin): void
    {
        $tahunInt = 2025;

        $docDates = [
            'Pakta Integritas' => Carbon::create($tahunInt, 8, 21),
            'PKKMB'            => Carbon::create($tahunInt, 8, 25),
            'Bela Negara'      => Carbon::create($tahunInt, 9, 15),
            'MABIM'            => Carbon::create($tahunInt + 1, 3, 20),
        ];

        foreach ($jenisWajib as $jenis) {
            $docDate = $docDates[$jenis->nama] ?? Carbon::create($tahunInt, 10, 1);

            // Skip if this doc should be missing
            if ($acc['doc_missing'] === $jenis->nama) {
                Dokumen::where('mahasiswa_id', $mhs->id)
                    ->where('dokumen_jenis_id', $jenis->id)
                    ->delete();
                continue;
            }

            // Determine status
            $status = 'Disetujui';
            if ($acc['doc_reject'] === $jenis->nama) {
                $status = 'Ditolak';
            }

            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id'      => $mhs->id,
                    'dokumen_jenis_id'  => $jenis->id,
                ],
                [
                    'nama_file'   => "{$jenis->nama}_{$mhs->nim}.pdf",
                    'path_file'   => "dokumen/dummy_{$jenis->nama}.pdf",
                    'status'      => $status,
                    'catatan_admin' => $status === 'Ditolak' ? 'Dokumen tidak sesuai format, mohon upload ulang.' : null,
                    'approved_by' => $status === 'Disetujui' ? $admin->id : null,
                    'approved_at' => $status === 'Disetujui' ? $docDate->copy()->addDays(2) : null,
                    'created_at'  => $docDate,
                    'updated_at'  => $docDate->copy()->addDays(2),
                ]
            );
        }
    }

    private function ipkToHuruf(float $ipk): string
    {
        if ($ipk >= 3.75) return 'A';
        if ($ipk >= 3.50) return 'AB';
        if ($ipk >= 3.25) return 'B';
        if ($ipk >= 3.00) return 'BC';
        if ($ipk >= 2.50) return 'C';
        if ($ipk >= 2.00) return 'D';
        return 'E';
    }

    private function getTahunAjaran(int $taInt, int $sem): string
    {
        $ganjil = $taInt + intdiv($sem - 1, 2);
        $genap  = $ganjil + 1;
        $label  = ($sem % 2 === 1) ? 'Ganjil' : 'Genap';
        return "{$ganjil}/{$genap} {$label}";
    }

    private function getSemesterDate(int $taInt, int $sem): Carbon
    {
        $year  = $taInt + intdiv($sem - 1, 2);
        $month = ($sem % 2 === 1) ? 2 : 8;
        return Carbon::create($year, $month, 10);
    }

    private function ensureDokumenJenis(): void
    {
        $items = [
            ['nama' => 'KHS', 'is_wajib' => false],
            ['nama' => 'Pakta Integritas', 'is_wajib' => true],
            ['nama' => 'PKKMB', 'is_wajib' => true],
            ['nama' => 'Bela Negara', 'is_wajib' => true],
            ['nama' => 'MABIM', 'is_wajib' => true],
            ['nama' => 'Sertifikasi', 'is_wajib' => false],
        ];
        foreach ($items as $item) {
            DokumenJenis::updateOrCreate(['nama' => $item['nama']], ['is_wajib' => $item['is_wajib']]);
        }
    }
}
