<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

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

$data = [];

// 1. Counts
$data['counts'] = [
    'User' => User::count(),
    'Prodi' => Prodi::count(),
    'Mahasiswa' => Mahasiswa::count(),
    'IpkSemestr' => IpkSemestr::count(),
    'MataKuliah' => MataKuliah::count(),
    'Prestasi' => Prestasi::count(),
    'Organisasi' => Organisasi::count(),
    'Pelatihan' => Pelatihan::count(),
    'Dokumen' => Dokumen::count(),
    'SuratPeringatan' => SuratPeringatan::count(),
    'BebasTanggungan' => BebasTanggungan::count(),
];

// 2. Orphans (Should be 0) - Using ID checks to avoid missing relationship methods
$data['orphans'] = [
    'MahasiswaWithoutUser' => Mahasiswa::whereNull('user_id')->count(),
    'MahasiswaWithoutProdi' => Mahasiswa::whereNull('prodi_id')->count(),
    'IpkWithoutMahasiswa' => IpkSemestr::whereNull('mahasiswa_id')->count(),
    'MataKuliahWithoutIpk' => MataKuliah::whereNull('ipk_semester_id')->count(),
    'PrestasiWithoutMahasiswa' => Prestasi::whereNull('mahasiswa_id')->count(),
    'OrganisasiWithoutMahasiswa' => Organisasi::whereNull('mahasiswa_id')->count(),
    'PelatihanWithoutMahasiswa' => Pelatihan::whereNull('mahasiswa_id')->count(),
    'DokumenWithoutMahasiswa' => Dokumen::whereNull('mahasiswa_id')->count(),
    'SpWithoutMahasiswa' => SuratPeringatan::whereNull('mahasiswa_id')->count(),
    'BtWithoutMahasiswa' => BebasTanggungan::whereNull('mahasiswa_id')->count(),
];

// 3. States
$data['states'] = [
    'Mahasiswa' => [
        'Aktif' => Mahasiswa::where('status', 'Aktif')->count(),
        'Cuti' => Mahasiswa::where('status', 'Cuti')->count(),
        'Lulus' => Mahasiswa::where('status', 'Lulus')->count(),
        'Dicabut' => Mahasiswa::where('status', 'Dicabut')->count(),
        'Reguler' => Mahasiswa::where('kategori', 'Reguler')->count(),
        'Aspirasi' => Mahasiswa::where('kategori', 'Aspirasi')->count(),
    ],
    'Prestasi' => [
        'Menunggu Validasi' => Prestasi::where('status', 'Menunggu Validasi')->count(),
        'Disetujui' => Prestasi::where('status', 'Disetujui')->count(),
        'Ditolak' => Prestasi::where('status', 'Ditolak')->count(),
        'Internasional' => Prestasi::where('tingkat', 'Internasional')->count(),
        'Nasional' => Prestasi::where('tingkat', 'Nasional')->count(),
        'Wilayah' => Prestasi::where('tingkat', 'Wilayah')->count(),
    ],
    'Organisasi' => [
        'Menunggu' => Organisasi::where('status', 'Menunggu')->count(),
        'Disetujui' => Organisasi::where('status', 'Disetujui')->count(),
        'Ditolak' => Organisasi::where('status', 'Ditolak')->count(),
    ],
    'Pelatihan' => [
        'Menunggu' => Pelatihan::where('status', 'Menunggu')->count(),
        'Disetujui' => Pelatihan::where('status', 'Disetujui')->count(),
        'Ditolak' => Pelatihan::where('status', 'Ditolak')->count(),
    ],
    'Dokumen' => [
        'Menunggu' => Dokumen::where('status', 'Menunggu')->count(),
        'Disetujui' => Dokumen::where('status', 'Disetujui')->count(),
        'Ditolak' => Dokumen::where('status', 'Ditolak')->count(),
    ],
    'SuratPeringatan' => [
        'SP1' => SuratPeringatan::where('level', 'SP1')->count(),
        'SP2' => SuratPeringatan::where('level', 'SP2')->count(),
        'SP3' => SuratPeringatan::where('level', 'SP3')->count(),
        'Aktif' => SuratPeringatan::where('status', 'Aktif')->count(),
        'Selesai' => SuratPeringatan::where('status', 'Selesai')->count(),
        'Masa Tenggang' => SuratPeringatan::where('status', 'Masa Tenggang')->count(),
    ],
    'BebasTanggungan' => [
        'Menunggu' => BebasTanggungan::where('status', 'Menunggu')->count(),
        'Diterbitkan' => BebasTanggungan::where('status', 'Diterbitkan')->count(),
        'Ditolak' => BebasTanggungan::where('status', 'Ditolak')->count(),
    ],
];

// 5. Data Akademik
// Use manual counting since relations might be absent
$ipkCounts = IpkSemestr::selectRaw('mahasiswa_id, count(*) as count')->groupBy('mahasiswa_id')->pluck('count', 'mahasiswa_id')->toArray();
$mhsCountByIpk = array_count_values($ipkCounts);
$totalMhsWithIpk = array_sum($mhsCountByIpk);
$data['akademik'] = [
    '0_semester' => Mahasiswa::count() - $totalMhsWithIpk,
    '2_semester' => $mhsCountByIpk[2] ?? 0,
    '3_semester' => $mhsCountByIpk[3] ?? 0,
    '4_semester' => $mhsCountByIpk[4] ?? 0,
    '5_semester' => $mhsCountByIpk[5] ?? 0,
    'min_ipk' => IpkSemestr::min('ipk'),
    'max_ipk' => IpkSemestr::max('ipk'),
];

// 12. Edge Cases
$data['edge_cases'] = [
    'tanpa_ipk' => Mahasiswa::whereNotIn('id', IpkSemestr::pluck('mahasiswa_id'))->first()?->nim,
    'tanpa_prestasi' => Mahasiswa::whereNotIn('id', Prestasi::pluck('mahasiswa_id'))->first()?->nim,
    'tanpa_organisasi' => Mahasiswa::whereNotIn('id', Organisasi::pluck('mahasiswa_id'))->first()?->nim,
    'tanpa_pelatihan' => Mahasiswa::whereNotIn('id', Pelatihan::pluck('mahasiswa_id'))->first()?->nim,
    'tanpa_sp' => Mahasiswa::whereNotIn('id', SuratPeringatan::pluck('mahasiswa_id'))->first()?->nim,
    'banyak_aktivitas' => Mahasiswa::whereIn('id', Prestasi::pluck('mahasiswa_id'))
                                   ->whereIn('id', Organisasi::pluck('mahasiswa_id'))
                                   ->whereIn('id', Pelatihan::pluck('mahasiswa_id'))
                                   ->first()?->nim,
    'dokumen_ditolak' => Dokumen::where('status', 'Ditolak')->first()?->mahasiswa_id ? Mahasiswa::find(Dokumen::where('status', 'Ditolak')->first()->mahasiswa_id)->nim : null,
    'prestasi_ditolak' => Prestasi::where('status', 'Ditolak')->first()?->mahasiswa_id ? Mahasiswa::find(Prestasi::where('status', 'Ditolak')->first()->mahasiswa_id)->nim : null,
    'sp_aktif' => SuratPeringatan::where('status', 'Aktif')->first()?->mahasiswa_id ? Mahasiswa::find(SuratPeringatan::where('status', 'Aktif')->first()->mahasiswa_id)->nim : null,
    'sp_selesai' => SuratPeringatan::where('status', 'Selesai')->first()?->mahasiswa_id ? Mahasiswa::find(SuratPeringatan::where('status', 'Selesai')->first()->mahasiswa_id)->nim : null,
    'sp_masa_tenggang' => SuratPeringatan::where('status', 'Masa Tenggang')->first()?->mahasiswa_id ? Mahasiswa::find(SuratPeringatan::where('status', 'Masa Tenggang')->first()->mahasiswa_id)->nim : null,
    'lulus' => Mahasiswa::where('status', 'Lulus')->first()?->nim,
    'dicabut' => Mahasiswa::where('status', 'Dicabut')->first()?->nim,
];

// 13. Users
$data['users'] = [
    'admin_exists' => User::where('username', 'admin')->exists(),
    'warek3_exists' => User::where('username', 'warek3')->exists(),
    'prodi_ti_exists' => User::where('username', 'prodi_ti')->exists(),
    'prodi_si_exists' => User::where('username', 'prodi_si')->exists(),
];
$testUser = User::where('role', 'mahasiswa')->first();
$data['users']['test_mahasiswa_auth'] = [
    'username' => $testUser?->username,
    'password_verify' => $testUser ? (password_verify('kip2026', $testUser->password) || password_verify('kip' . $testUser->username . '2026', $testUser->password)) : false,
];

echo json_encode($data, JSON_PRETTY_PRINT);
