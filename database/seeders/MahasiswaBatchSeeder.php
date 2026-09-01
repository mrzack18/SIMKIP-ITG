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
use App\Models\BebasTanggungan;
use App\Models\BebasTanggunganHistory;
use App\Models\CatatanInternal;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Faker\Factory as Faker;

class MahasiswaBatchSeeder extends Seeder
{
    /**
     * Prodi codes: TI=06, SI=07, TE=03, TS=11, AR=24
     */
    private const PRODIS = [
        'TI' => ['kode' => '06', 'nama' => 'Teknik Informatika'],
        'SI' => ['kode' => '07', 'nama' => 'Sistem Informasi'],
        'TE' => ['kode' => '03', 'nama' => 'Teknik Industri'],
        'TS' => ['kode' => '11', 'nama' => 'Teknik Sipil'],
        'AR' => ['kode' => '24', 'nama' => 'Arsitektur'],
    ];

    private const ANGKATAN_COHORTS = [
        // 'ta_mulai' => ['semesters' => X, 'ipk_max_sem' => N]
        '2022' => ['semesters' => 8,  'ipk_max' => 4], // S1:2022/2023 Ganjil ... S8:2025/2026 Genap
        '2023' => ['semesters' => 6,  'ipk_max' => 6], // S1:2023/2024 Ganjil ... S6:2025/2026 Genap
        '2024' => ['semesters' => 4,  'ipk_max' => 4], // S1:2024/2025 Ganjil ... S4:2025/2026 Genap
        '2025' => ['semesters' => 2,  'ipk_max' => 2], // S1:2025/2026 Ganjil ... S2:2025/2026 Genap
        '2026' => ['semesters' => 1,  'ipk_max' => 1], // S1:2026/2027 Ganjil (belum ada IPK validasi)
    ];

    /** @var \Faker\Generator */
    private $faker;

    public function run(): void
    {
        $this->faker = Faker::create('id_ID');

        // Ensure DokumenJenis exist
        $this->ensureDokumenJenis();

        // Get or create Prodis
        $prodis = [];
        foreach (self::PRODIS as $key => $info) {
            $prodis[$key] = Prodi::firstOrCreate(
                ['kode' => $info['kode']],
                ['nama' => $info['nama'], 'is_aktif' => true]
            );
        }

        $admin = User::where('role', 'admin')->first();

        $counter = []; // [ta][prodi] = sequence number

        foreach (self::ANGKATAN_COHORTS as $ta => $cohort) {
            foreach (self::PRODIS as $prodiKey => $prodiInfo) {
                $kodeProdi = $prodiInfo['kode'];

                if (!isset($counter[$ta])) $counter[$ta] = [];
                if (!isset($counter[$ta][$prodiKey])) $counter[$ta][$prodiKey] = 0;

                for ($m = 1; $m <= 3; $m++) {
                    $counter[$ta][$prodiKey]++;
                    $seq = $counter[$ta][$prodiKey];
                    $nim = $ta . $kodeProdi . str_pad($seq, 3, '0', STR_PAD_LEFT);

                    // Student archetype/differentiator
                    $archetype = $this->pickArchetype($ta, $prodiKey, $m);

                    $mhsData = $this->buildStudent($nim, $ta, $prodiKey, $prodis[$prodiKey], $archetype, $cohort, $admin);

                    echo "  ✓ {$nim} - {$mhsData['nama']} ({$prodiKey}, TA {$ta})\n";
                }
            }
        }

        echo "\nMahasiswaBatchSeeder done.\n";
    }

    private function pickArchetype(string $ta, string $prodiKey, int $m): array
    {
        // Every 3rd student in a group gets a specific archetype
        $archetypes = [
            // index 0: Excellent student
            [
                'label' => 'excellent',
                'ipk_pattern' => 'excellent',
                'org' => true, 'org_role' => 'Ketua Divisi',
                'prestasi' => true, 'pelatihan' => true,
                'sp' => false, 'dokumen_lengkap' => true,
                'catatan_internal' => false,
                'status' => 'Aktif',
                'bebas_tanggungan' => false,
            ],
            // index 1: Struggling student (had IPK drop, SP)
            [
                'label' => 'struggling',
                'ipk_pattern' => 'drop_then_recover',
                'ipk_drop_sem' => 3,
                'org' => false, 'org_role' => null,
                'org_active' => false,
                'prestasi' => false, 'pelatihan' => false,
                'sp' => true, 'sp_level' => 'SP1', 'sp_status' => 'Selesai',
                'sp_alasan' => 'IPK Semester 3 turun di bawah standar minimum (2.80)',
                'dokumen_lengkap' => false, 'dokumen_belum' => ['KHS'],
                'catatan_internal' => true, 'catatan_text' => 'Mahasiswa perlu perhatian khusus. Pernah mendapat peringatan IPK rendah.',
                'status' => 'Aktif',
                'bebas_tanggungan' => false,
            ],
            // index 2: Mixed - moderate IPK, aktif organisasi, some issues
            [
                'label' => 'mixed',
                'ipk_pattern' => 'moderate',
                'org' => true, 'org_role' => 'Anggota',
                'org_active' => true,
                'prestasi' => false, 'pelatihan' => true,
                'sp' => false,
                'dokumen_lengkap' => true,
                'catatan_internal' => false,
                'status' => 'Aktif',
                'bebas_tanggungan' => false,
            ],
        ];

        $idx = ($m - 1) % count($archetypes);
        return $archetypes[$idx];
    }

    private function buildStudent(string $nim, string $ta, string $prodiKey, Prodi $prodi, array $archetype, array $cohort, ?User $admin): array
    {
        $nama = $this->generateNama($nim, $ta, $prodiKey, $archetype);
        $email = strtolower($nim) . '@student.itg.ac.id';

        // Determine semester count based on angkatan and student status
        $semCount = $cohort['semesters'];
        $isCuti = isset($archetype['status']) && $archetype['status'] === 'Cuti';
        $isAktif = isset($archetype['status']) ? $archetype['status'] === 'Aktif' : true;

        if ($isCuti) {
            $semCount = max(1, $semCount - 2); // Fewer semesters recorded
        }

        $tahunAjaranMulai = (int)$ta;
        $semesters = $this->buildSemesters($ta, $semCount, $archetype, $prodiKey);

        $allIps = collect($semesters)->pluck('ipk')->toArray();
        $ipkCalc = $this->calcIpk($allIps);
        $ipsTerakhir = $semesters[count($semesters) - 1]['ipk'] ?? 0;

        // Determine student status
        $studentStatus = 'Aktif';
        if ($ta === '2022' && $archetype['label'] === 'excellent') {
            $studentStatus = 'Aktif'; // Bisa juga 'Lulus' atau 'Non-Aktif'
        }
        if ($archetype['status'] ?? null) {
            $studentStatus = $archetype['status'];
        }

        // Create user
        $user = User::updateOrCreate(
            ['username' => $nim],
            [
                'name' => $nama,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
                'prodi_id' => $prodi->id,
            ]
        );

        // Create mahasiswa
        $mhs = Mahasiswa::updateOrCreate(
            ['nim' => $nim],
            [
                'user_id' => $user->id,
                'nim' => $nim,
                'nama' => $nama,
                'prodi_id' => $prodi->id,
                'angkatan' => $ta,
                'kategori' => 'Reguler',
                'status' => $studentStatus,
                'nomor_sk' => "SK/KIP-K/ITG/{$ta}/{$nim}",
                'tanggal_sk' => Carbon::create($tahunAjaranMulai, 8, 15),
                'created_at' => Carbon::create($tahunAjaranMulai, 8, 20),
                'updated_at' => Carbon::now(),
            ]
        );

        // Create IPK semester records
        $this->buildIpkRecords($mhs, $ta, $semesters, $prodi);

        // Create documents
        $this->buildDocuments($mhs, $ta, $archetype);

        // Create SP if needed
        if (!empty($archetype['sp'])) {
            $this->buildSp($mhs, $archetype, $admin, $ta);
        }

        // Create organisasi
        if (!empty($archetype['org'])) {
            $this->buildOrganisasi($mhs, $ta, $archetype, $prodiKey);
        }

        // Create prestasi
        if (!empty($archetype['prestasi'])) {
            $this->buildPrestasi($mhs, $ta, $archetype);
        }

        // Create pelatihan
        if (!empty($archetype['pelatihan'])) {
            $this->buildPelatihan($mhs, $ta);
        }

        // Create catatan internal (kendala mahasiswa)
        $this->buildCatatanInternal($mhs, $ta, $archetype);

        return ['nama' => $nama, 'ipk' => $ipkCalc];
    }

    private function buildSemesters(string $ta, int $count, array $archetype, string $prodiKey): array
    {
        $semesters = [];
        $taInt = (int)$ta;

        $patterns = [
            'excellent' => [3.70, 3.80, 3.85, 3.88, 3.90, 3.92, 3.94, 3.95],
            'good'      => [3.20, 3.30, 3.35, 3.40, 3.45, 3.50, 3.52, 3.55],
            'moderate'  => [2.90, 3.00, 3.10, 3.15, 3.20, 3.25, 3.28, 3.30],
            'drop_then_recover' => [3.40, 3.50, 2.80, 3.20, 3.35, 3.45, 3.50, 3.55],
            'declining' => [3.50, 3.40, 3.20, 3.00, 2.85, 2.70, 2.60, 2.50],
        ];

        $pattern = $patterns[$archetype['ipk_pattern']] ?? $patterns['moderate'];
        $dropSem = $archetype['ipk_drop_sem'] ?? null;

        for ($s = 1; $s <= $count; $s++) {
            $taSem = $this->getTahunAjaran($taInt, $s);
            $date = $this->getSemesterDate($taInt, $s);

            $base = $pattern[min($s - 1, count($pattern) - 1)] ?? 3.00;

            // Variasi kecil-kecilan agar tidak monotan
            $variasi = $this->faker->randomFloat(2, -0.05, 0.05);
            $ipk = min(4.00, max(2.00, round($base + $variasi, 2)));
            $ips = $ipk;

            $semesters[] = [
                'sem' => $s,
                'ta' => $taSem,
                'date' => $date,
                'ipk' => $ipk,
                'ips' => $ips,
            ];
        }

        return $semesters;
    }

    private function buildIpkRecords(Mahasiswa $mhs, string $ta, array $semesters, Prodi $prodi): void
    {
        // Hapus IPK lama
        IpkSemestr::where('mahasiswa_id', $mhs->id)->delete();

        $jenisKHS = DokumenJenis::where('nama', 'KHS')->first();

        foreach ($semesters as $semData) {
            $ipkRec = IpkSemestr::create([
                'mahasiswa_id' => $mhs->id,
                'semester' => $semData['sem'],
                'tahun_ajaran' => $semData['ta'],
                'ipk' => $semData['ipk'],
                'ips' => $semData['ips'],
                'file_khs' => "khs_sem_{$semData['sem']}_{$mhs->nim}.pdf",
                'status' => 'Disetujui',
                'created_at' => $semData['date'],
                'updated_at' => $semData['date']->copy()->addDays(2),
            ]);

            // 1 dummy MK per semester
            $mkNama = $this->faker->randomElement([
                'Matematika Diskrit', 'Algoritma & Pemrograman', 'Struktur Data',
                'Basis Data', 'Jaringan Komputer', 'Rekayasa Perangkat Lunak',
                'Kalkulus I', 'Fisika Dasar', 'Pemrograman Web', 'Sistem Operasi',
                'Statistika', 'Desain Grafis', 'Kecerdasan Buatan', 'Cloud Computing',
            ]);
            $nilaiHuruf = $this->ipkToHuruf($semData['ipk']);
            MataKuliah::create([
                'ipk_semester_id' => $ipkRec->id,
                'kode' => $prodi->kode . ($semData['sem'] * 10 + $this->faker->numberBetween(1, 9)),
                'nama' => $mkNama,
                'sks' => $this->faker->randomElement([2, 3, 4]),
                'nilai_huruf' => $nilaiHuruf,
                'nilai_mutu' => $semData['ipk'],
                'lulus' => true,
            ]);

            // KHS dokumen record
            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id' => $mhs->id,
                    'dokumen_jenis_id' => $jenisKHS->id,
                    'catatan_admin' => "Semester {$semData['sem']} ({$semData['ta']})",
                ],
                [
                    'nama_file' => "KHS_Semester_{$semData['sem']}.pdf",
                    'path_file' => "dokumen/khs_sem_{$semData['sem']}_{$mhs->nim}.pdf",
                    'status' => 'Disetujui',
                    'created_at' => $semData['date'],
                    'updated_at' => $semData['date']->copy()->addDays(2),
                ]
            );
        }
    }

    private function buildDocuments(Mahasiswa $mhs, string $ta, array $archetype): void
    {
        $tahunInt = (int)$ta;
        $jenisPakta = DokumenJenis::where('nama', 'Pakta Integritas')->first();
        $jenisPkkmb = DokumenJenis::where('nama', 'PKKMB')->first();
        $jenisBelaNegara = DokumenJenis::where('nama', 'Bela Negara')->first();
        $jenisMabim = DokumenJenis::where('nama', 'MABIM')->first();
        $jenisSertifikasi = DokumenJenis::where('nama', 'Sertifikasi')->first();

        $dokumenWajib = [
            ['jenis' => $jenisPakta, 'file' => "Pakta_Integritas_{$mhs->nim}.pdf", 'path' => 'dokumen/dummy_pakta.pdf', 'created' => Carbon::create($tahunInt, 8, 21)],
            ['jenis' => $jenisPkkmb, 'file' => "Sertifikat_PKKMB_{$mhs->nim}.pdf", 'path' => 'dokumen/dummy_pkkmb.pdf', 'created' => Carbon::create($tahunInt, 8, 25)],
            ['jenis' => $jenisBelaNegara, 'file' => "Sertifikat_BelaNegara_{$mhs->nim}.pdf", 'path' => 'dokumen/dummy_belanegara.pdf', 'created' => Carbon::create($tahunInt, 9, 15)],
            ['jenis' => $jenisMabim, 'file' => "Sertifikat_MABIM_{$mhs->nim}.pdf", 'path' => 'dokumen/dummy_mabim.pdf', 'created' => Carbon::create($tahunInt + 1, 3, 20)],
        ];

        foreach ($dokumenWajib as $dok) {
            if (!$dok['jenis']) continue;
            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id' => $mhs->id,
                    'dokumen_jenis_id' => $dok['jenis']->id,
                ],
                [
                    'nama_file' => $dok['file'],
                    'path_file' => $dok['path'],
                    'status' => 'Disetujui',
                    'created_at' => $dok['created'],
                    'updated_at' => $dok['created']->copy()->addDays(2),
                ]
            );
        }

        // Sertifikasi: hanya untuk archetype excellent
        if (!empty($archetype['dokumen_lengkap']) && $archetype['label'] === 'excellent' && $jenisSertifikasi) {
            Dokumen::updateOrCreate(
                [
                    'mahasiswa_id' => $mhs->id,
                    'dokumen_jenis_id' => $jenisSertifikasi->id,
                ],
                [
                    'nama_file' => "Sertifikat_Kompetensi_{$mhs->nim}.pdf",
                    'path_file' => "dokumen/dummy_sertifikasi.pdf",
                    'status' => 'Disetujui',
                    'created_at' => Carbon::create($tahunInt + 3, 5, 10),
                    'updated_at' => Carbon::create($tahunInt + 3, 5, 15),
                ]
            );
        }
    }

    private function buildSp(Mahasiswa $mhs, array $archetype, ?User $admin, string $ta): void
    {
        $taInt = (int)$ta;
        $level = $archetype['sp_level'] ?? 'SP1';
        $status = $archetype['sp_status'] ?? 'Selesai';
        $alasan = $archetype['sp_alasan'] ?? "IPK turun di bawah standar minimum pada semester berjalan.";

        $tanggalTerbit = Carbon::create($taInt + 2, 2, 20);
        $batasEvaluasi = Carbon::create($taInt + 2, 8, 20);
        // Generate globally unique nomor_surat (include mhs.id to avoid duplicate across students)
        $existingSp = SuratPeringatan::where('mahasiswa_id', $mhs->id)->where('level', $level)->first();
        $nomorSurat = $existingSp?->nomor_surat
            ?? "{$mhs->id}/{$level}/SIMKIP/" . ($taInt + 2);

        SuratPeringatan::updateOrCreate(
            [
                'mahasiswa_id' => $mhs->id,
                'level' => $level,
            ],
            [
                'jenis_pelanggaran' => 'Akademik',
                'deskripsi' => $alasan,
                'tanggal_terbit' => $tanggalTerbit,
                'batas_evaluasi' => $batasEvaluasi,
                'status' => $status,
                'diterbitkan_oleh' => $admin?->id,
                'catatan' => $status === 'Selesai' ? 'Dievaluasi dan dinyatakan perbaikan.' : null,
                'nomor_surat' => $nomorSurat,
                'created_at' => $tanggalTerbit,
                'updated_at' => $batasEvaluasi,
            ]
        );

        // SP2 escalation for some
        if (!empty($archetype['sp_level']) && $archetype['sp_level'] === 'SP2') {
            $existingSp2 = SuratPeringatan::where('mahasiswa_id', $mhs->id)->where('level', 'SP2')->first();
            $nomorSurat2 = $existingSp2?->nomor_surat
                ?? "{$mhs->id}/SP2/SIMKIP/" . ($taInt + 3);
            SuratPeringatan::updateOrCreate(
                [
                    'mahasiswa_id' => $mhs->id,
                    'level' => 'SP2',
                ],
                [
                    'jenis_pelanggaran' => 'Non-Akademik',
                    'deskripsi' => 'Melanggar kode etik asrama/perilaku kampus.',
                    'tanggal_terbit' => Carbon::create($taInt + 3, 3, 10),
                    'batas_evaluasi' => Carbon::create($taInt + 3, 9, 10),
                    'status' => $status,
                    'diterbitkan_oleh' => $admin?->id,
                    'catatan' => $status === 'Selesai' ? 'Selesai menjalani sanksi.' : null,
                    'nomor_surat' => $nomorSurat2,
                    'created_at' => Carbon::create($taInt + 3, 3, 10),
                    'updated_at' => Carbon::create($taInt + 3, 9, 10),
                ]
            );
        }
    }

    private function buildOrganisasi(Mahasiswa $mhs, string $ta, array $archetype, string $prodiKey): void
    {
        $taInt = (int)$ta;
        $role = $archetype['org_role'] ?? 'Anggota';
        $isActive = $archetype['org_active'] ?? false;

        $orgList = [
            'HIMA-IF' => 'Himpunan Mahasiswa Informatika',
            'HIMA-SI' => 'Himpunan Mahasiswa Sistem Informasi',
            'HIMATEK' => 'Himpunan Mahasiswa Teknik Industri',
            'HIMAKIMSIP' => 'Himpunan Mahasiswa Teknik Sipil & Arsitektur',
            'BEM FT' => 'Badan Eksekutif Mahasiswa Fakultas Teknik',
            'UKM Penalaran' => 'Unit Kegiatan Mahasiswa Penalaran & Riset',
            'UKM Olahraga' => 'Unit Kegiatan Mahasiswa Olahraga',
            'UKM Seni' => 'Unit Kegiatan Mahasiswa Seni & Budaya',
        ];

        $orgKeys = array_keys($orgList);
        $orgName = $orgKeys[array_rand($orgKeys)];
        $orgFullName = $orgList[$orgName];

        $mulai = Carbon::create($taInt + 1, 3, 1);
        $selesai = Carbon::create($taInt + 2, 2, 28);

        Organisasi::updateOrCreate(
            [
                'mahasiswa_id' => $mhs->id,
                'nama' => $orgFullName,
            ],
            [
                'jenis' => 'Organisasi',
                'jabatan' => $role,
                'periode_mulai' => $mulai,
                'periode_selesai' => $selesai,
                'deskripsi' => "Aktif dalam kegiatan {$orgFullName}.",
                'status' => 'Disetujui',
                'created_at' => $mulai,
                'updated_at' => $mulai->copy()->addDays(5),
            ]
        );
    }

    private function buildPrestasi(Mahasiswa $mhs, string $ta, array $archetype): void
    {
        $taInt = (int)$ta;

        $prestasis = [
            ['nama' => 'Juara 1 Lomba Web Design Nasional', 'tingkat' => 'Nasional', 'pencapaian' => 'Juara 1', 'penyelenggara' => 'Kemendikbudristek', 'tempat' => 'Jakarta'],
            ['nama' => 'Juara 2 Hackathon ITG', 'tingkat' => 'Institusi', 'pencapaian' => 'Juara 2', 'penyelenggara' => 'ITG', 'tempat' => 'Garut'],
            ['nama' => 'Finalis Lomba Cybersecurity Competition', 'tingkat' => 'Wilayah', 'pencapaian' => 'Finalis', 'penyelenggara' => 'Politeknik Negeri Bandung', 'tempat' => 'Bandung'],
            ['nama' => 'Best Presenter Seminar Nasional AI', 'tingkat' => 'Nasional', 'pencapaian' => 'Best Presenter', 'penyelenggara' => 'UNDIP', 'tempat' => 'Semarang'],
            ['nama' => 'Juara 3 Lomba Debat Bahasa Inggris', 'tingkat' => 'Wilayah', 'pencapaian' => 'Juara 3', 'penyelenggara' => 'Kanwil Dikti Jawa Barat', 'tempat' => 'Bandung'],
        ];

        $p = $prestasis[array_rand($prestasis)];

        Prestasi::updateOrCreate(
            [
                'mahasiswa_id' => $mhs->id,
                'nama_prestasi' => $p['nama'],
            ],
            [
                'tingkat' => $p['tingkat'],
                'pencapaian' => $p['pencapaian'],
                'penyelenggara' => $p['penyelenggara'],
                'tanggal_mulai' => Carbon::create($taInt + 2, $this->faker->numberBetween(3, 6), 10),
                'tanggal_selesai' => Carbon::create($taInt + 2, $this->faker->numberBetween(3, 6), 12),
                'tempat' => $p['tempat'],
                'status' => 'Disetujui',
                'validated_at' => Carbon::create($taInt + 2, $this->faker->numberBetween(3, 6), 20),
                'created_at' => Carbon::create($taInt + 2, $this->faker->numberBetween(3, 6), 15),
                'updated_at' => Carbon::create($taInt + 2, $this->faker->numberBetween(3, 6), 20),
            ]
        );
    }

    private function buildPelatihan(Mahasiswa $mhs, string $ta): void
    {
        $taInt = (int)$ta;

        $pelatihans = [
            ['nama' => 'Bootcamp Fullstack Laravel & React', 'jenis' => 'Akademik', 'penyelenggara' => 'BuildWithAngga', 'tempat' => 'Online', 'durasi' => 1],
            ['nama' => 'Pelatihan Public Speaking & Leadership', 'jenis' => 'Non-Akademik', 'penyelenggara' => 'Kemendikbud', 'tempat' => 'Bandung', 'durasi' => 3],
            ['nama' => 'Workshop Data Science with Python', 'jenis' => 'Akademik', 'penyelenggara' => 'Dicoding', 'tempat' => 'Online', 'durasi' => 2],
            ['nama' => 'Pelatihan Grafika Komputer & Blender 3D', 'jenis' => 'Akademik', 'penyelenggara' => 'Gamelab Indonesia', 'tempat' => 'Online', 'durasi' => 1],
            ['nama' => 'Kelas Intensif TOEFL Preparation', 'jenis' => 'Non-Akademik', 'penyelenggara' => 'ILEC Indonesia', 'tempat' => 'Online', 'durasi' => 2],
        ];

        $p = $pelatihans[array_rand($pelatihans)];
        $bulan = $this->faker->numberBetween(3, 8);

        Pelatihan::updateOrCreate(
            [
                'mahasiswa_id' => $mhs->id,
                'nama' => $p['nama'],
            ],
            [
                'jenis' => $p['jenis'],
                'penyelenggara' => $p['penyelenggara'],
                'tanggal_mulai' => Carbon::create($taInt + 2, $bulan, 1),
                'tanggal_selesai' => Carbon::create($taInt + 2, $bulan + $p['durasi'], 28),
                'tempat' => $p['tempat'],
                'deskripsi' => "Pelatihan intensif {$p['nama']} selama {$p['durasi']} bulan.",
                'status' => 'Disetujui',
                'created_at' => Carbon::create($taInt + 2, $bulan, 5),
                'updated_at' => Carbon::create($taInt + 2, $bulan + $p['durasi'], 5),
            ]
        );
    }

    private function buildCatatanInternal(Mahasiswa $mhs, string $ta, array $archetype): void
    {
        // Only struggling & mixed archetypes generate kendala records
        if ($archetype['label'] === 'excellent') return;

        $taInt = (int) $ta;

        // Distribusi: Finansial 45%, Akademik 30%, Fasilitas 15%, Lainnya 10%
        // archtype 'struggling' → more serious kendala, 1-2 records
        // archetype 'mixed' → minor kendala, 0-1 record
        $kategoriList = [
            'Finansial' => [
                'Kesulitan membayar uang kuliah tepat waktu karena keterbatasan ekonomi keluarga.',
                'Membutuhkan beasiswa tambahan untuk menutupi biaya hidup selama semester berjalan.',
                'Biaya transportasi ke kampus menjadi beban mengingat jarak dari rumah ke kampus cukup jauh.',
                'Tidak mampu membeli buku ajar dan referensi untuk beberapa mata kuliah.',
                'Kehabisan dana untuk membeli perangkat praktikum yang diperlukan.',
            ],
            'Akademik' => [
                'Kesulitan mengikuti materi perkuliahan karena metode pengajaran yang kurang cocok.',
                'IPK turun drastis di semester sebelumnya, butuh bimbingan akademik intensif.',
                'Mengalami plagiarisme tidak sengaja pada tugas makalah dan perlu pendampingan.',
                'Sulit menyesuaikan diri dengan sistem evaluasi di beberapa mata kuliah.',
                'Nilai beberapa mata kuliah praktikum di bawah standar kelulusan.',
            ],
            'Fasilitas' => [
                'Laboratorium komputer sering rusak dan tidak tersedia untuk praktikum.',
                'Akses internet di area asrama sangat lambat, mengganggu pembelajaran online.',
                'Ruang kuliah overcrowded danAC sering rusak, kondisi tidak nyaman.',
                'Perpustakaan sering penuh dan waktu borrow buku sangat singkat.',
                'Fasilitas olahraga di kampus perlu perbaikan agar bisa digunakan optimal.',
            ],
            'Lainnya' => [
                'Kesulitan menyesuaikan diri dengan lingkungan kampus yang baru.',
                'Masalah kesehatan yang sering kambuh dan mengganggu keaktifan kuliah.',
                'Konflik jadwal antara kegiatan organisasi dan tugas akademik.',
                'Butuh konseling untuk manajemen stres dan time management.',
                'Kendala keluarga yang mempengaruhi konsentrasi dalam belajar.',
            ],
        ];

        $recordCount = $archetype['label'] === 'struggling'
            ? $this->faker->numberBetween(1, 2)
            : ($archetype['label'] === 'mixed' ? $this->faker->numberBetween(0, 1) : 0);

        // Weighted category selection: Finansial gets more weight
        $weightedCategories = [];
        foreach (['Finansial','Finansial','Finansial','Finansial','Finansial',
                   'Akademik','Akademik','Akademik',
                   'Fasilitas','Fasilitas',
                   'Lainnya'] as $kat) {
            $weightedCategories[] = $kat;
        }

        $usedCategories = [];
        for ($i = 0; $i < $recordCount; $i++) {
            // Pick a unique category
            $available = array_diff($weightedCategories, $usedCategories);
            if (empty($available)) break;
            $kat = $this->randomEl($available);
            $usedCategories[] = $kat;

            $descriptions = $kategoriList[$kat];
            $deskripsi = $this->randomEl($descriptions);

            // tahun ajaran when the issue was recorded
            $taOpt1 = "{$taInt}/" . ($taInt+1) . " Ganjil";
            $taOpt2 = "{$taInt}/" . ($taInt+1) . " Genap";
            $taOpt3 = ($taInt+1) . '/' . ($taInt+2) . ' Ganjil';
            $tahunAjaran = $this->faker->randomElement([$taOpt1, $taOpt1, $taOpt2, $taOpt3]);

            CatatanInternal::updateOrCreate(
                [
                    'mahasiswa_id' => $mhs->id,
                    'kategori'     => $kat,
                    'tahun_ajaran' => $tahunAjaran,
                ],
                [
                    'deskripsi' => $deskripsi,
                ]
            );
        }
    }

    private function randomEl(array $arr): string
    {
        return $arr[array_rand($arr)];
    }

    private function generateNama(string $nim, string $ta, string $prodiKey, array $archetype): string
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstMale = $this->faker->firstNameMale;
        $firstFemale = $this->faker->firstNameFemale;
        $first = $gender === 'male' ? $firstMale : $firstFemale;
        $last = $this->faker->lastName;

        // Vary name length based on archetype
        if ($archetype['label'] === 'excellent') {
            return $first . ' ' . $last;
        }

        $sufix = $this->faker->randomElement(['', '', $this->faker->randomElement(['S.Kom', 'S.T.', 'S.Ars'])]);
        return trim($first . ' ' . $last . ' ' . $sufix);
    }

    private function calcIpk(array $ipsList): float
    {
        if (empty($ipsList)) return 0.00;
        $total = array_sum($ipsList);
        $count = count($ipsList);
        return round($total / $count, 2);
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
        $ganjil = $taInt + floor(($sem - 1) / 2);
        $genap = $taInt + floor(($sem - 1) / 2) + 1;
        $label = ($sem % 2 === 1) ? 'Ganjil' : 'Genap';
        return "{$ganjil}/{$genap} {$label}";
    }

    private function getSemesterDate(int $taInt, int $sem): Carbon
    {
        $year = $taInt + floor(($sem - 1) / 2);
        $month = ($sem % 2 === 1) ? 2 : 8; // Feb for ganjil, Aug for genap
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
