<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Api\Admin\MahasiswaController as AdminMahasiswa;
use App\Http\Controllers\Api\Admin\DokumenController as AdminDokumen;
use App\Http\Controllers\Api\Admin\SPController as AdminSP;
use App\Http\Controllers\Api\Admin\BebasTanggunganController as AdminBT;
use App\Http\Controllers\Api\Admin\LaporanController as AdminLaporan;
use App\Http\Controllers\Api\Admin\DataAkademikController as AdminAkademik;
use App\Http\Controllers\Api\Admin\KonfigurasiController as AdminConfig;
use App\Http\Controllers\Api\Admin\AuditController as AdminAudit;
use App\Http\Controllers\Api\Mahasiswa\DashboardController as MhsDashboard;
use App\Http\Controllers\Api\Mahasiswa\IPKController as MhsIPK;
use App\Http\Controllers\Api\Mahasiswa\DokumenController as MhsDokumen;
use App\Http\Controllers\Api\Mahasiswa\PrestasiController as MhsPrestasi;
use App\Http\Controllers\Api\Mahasiswa\OrganisasiController as MhsOrganisasi;
use App\Http\Controllers\Api\Mahasiswa\PelatihanController as MhsPelatihan;
use App\Http\Controllers\Api\Mahasiswa\BebasTanggunganController as MhsBT;
use App\Http\Controllers\Api\Prodi\DashboardController as ProdiDashboard;
use App\Http\Controllers\Api\Prodi\MahasiswaController as ProdiMahasiswa;
use App\Http\Controllers\Api\Warek\DashboardController as WarekDashboard;
use App\Http\Controllers\Api\Warek\LaporanController as WarekLaporan;

/*
|--------------------------------------------------------------------------
| API Routes — SIMKIP-ITG
|--------------------------------------------------------------------------
*/

// ── Auth (Public) ────────────────────────────────────────────────────────────
Route::post('/auth/login', [AuthController::class, 'login']);

// ── Authenticated Routes ─────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout',          [AuthController::class, 'logout']);
    Route::get('/auth/me',               [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // ── Profile & Notifications (semua role) ─────────────────────────────────
    Route::get('/profile',                  [ProfileController::class, 'show']);
    Route::post('/profile',                 [ProfileController::class, 'update']);
    Route::post('/profile/password',        [ProfileController::class, 'changePassword']);

    Route::get('/notifications',            [NotificationController::class, 'index']);
    Route::get('/notifications/count',      [NotificationController::class, 'count']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{id}/read',[NotificationController::class, 'markRead']);

    // Konfigurasi periode (diakses oleh mahasiswa untuk cek periode input)
    Route::get('/konfigurasi/periode', [AdminConfig::class, 'getPeriode']);

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index']);

        // Mahasiswa CRUD
        Route::get('/mahasiswa',                  [AdminMahasiswa::class, 'index']);
        Route::post('/mahasiswa',                 [AdminMahasiswa::class, 'store']);
        Route::get('/mahasiswa/check-nim/{nim}',  [AdminMahasiswa::class, 'checkNim']);
        Route::get('/mahasiswa/{id}',             [AdminMahasiswa::class, 'show']);
        Route::delete('/mahasiswa/{id}',          [AdminMahasiswa::class, 'destroy']);

        // Dokumen antrian admin
        Route::get('/dokumen',              [AdminDokumen::class, 'queue']);
        Route::patch('/dokumen/{id}/approve',[AdminDokumen::class, 'approve']);
        Route::patch('/dokumen/{id}/reject', [AdminDokumen::class, 'reject']);
        Route::get('/dokumen/{id}/file',    [AdminDokumen::class, 'serveFile']);

        // Surat Peringatan
        Route::get('/sp',              [AdminSP::class, 'index']);
        Route::post('/sp',             [AdminSP::class, 'store']);
        Route::get('/sp/{id}',         [AdminSP::class, 'show']);
        Route::patch('/sp/{id}/status',[AdminSP::class, 'updateStatus']);

        // Bebas Tanggungan
        Route::get('/bebas-tanggungan',                [AdminBT::class, 'index']);
        Route::get('/bebas-tanggungan/{id}',           [AdminBT::class, 'show']);
        Route::patch('/bebas-tanggungan/{id}/approve', [AdminBT::class, 'approve']);
        Route::patch('/bebas-tanggungan/{id}/reject',  [AdminBT::class, 'reject']);

        // Laporan
        Route::get('/laporan',              [AdminLaporan::class, 'index']);
        Route::post('/laporan',             [AdminLaporan::class, 'store']);
        Route::get('/laporan/{id}',         [AdminLaporan::class, 'show']);
        Route::put('/laporan/{id}',         [AdminLaporan::class, 'update']);
        Route::patch('/laporan/{id}/submit',[AdminLaporan::class, 'submit']);

        // Data Akademik
        Route::get('/akademik/ipk',       [AdminAkademik::class, 'indexIPK']);
        Route::get('/akademik/prestasi',  [AdminAkademik::class, 'indexPrestasi']);
        Route::get('/akademik/organisasi',[AdminAkademik::class, 'indexOrganisasi']);
        Route::get('/akademik/pelatihan', [AdminAkademik::class, 'indexPelatihan']);

        Route::patch('/prestasi/{id}/validate',  [AdminAkademik::class, 'validatePrestasi']);
        Route::patch('/organisasi/{id}/validate',[AdminAkademik::class, 'validateOrganisasi']);
        Route::patch('/pelatihan/{id}/validate', [AdminAkademik::class, 'validatePelatihan']);

        // Konfigurasi
        Route::get('/konfigurasi',                          [AdminConfig::class, 'index']);
        Route::put('/konfigurasi',                          [AdminConfig::class, 'update']);
        Route::get('/konfigurasi/prodi',                    [AdminConfig::class, 'indexProdi']);
        Route::post('/konfigurasi/prodi',                   [AdminConfig::class, 'storeProdi']);
        Route::put('/konfigurasi/prodi/{id}',               [AdminConfig::class, 'updateProdi']);
        Route::patch('/konfigurasi/prodi/{id}/toggle',      [AdminConfig::class, 'toggleProdi']);
        Route::get('/konfigurasi/dokumen-jenis',            [AdminConfig::class, 'indexDokumenJenis']);
        Route::post('/konfigurasi/dokumen-jenis',           [AdminConfig::class, 'storeDokumenJenis']);
        Route::delete('/konfigurasi/dokumen-jenis/{id}',    [AdminConfig::class, 'destroyDokumenJenis']);
        Route::patch('/konfigurasi/dokumen-jenis/{id}/toggle',[AdminConfig::class, 'toggleDokumenJenis']);

        // Audit Log
        Route::get('/audit', [AdminAudit::class, 'index']);
    });

    // ── MAHASISWA ─────────────────────────────────────────────────────────────
    Route::middleware('role:mahasiswa')->prefix('mahasiswa')->group(function () {
        Route::get('/dashboard',  [MhsDashboard::class, 'index']);

        Route::get('/ipk',        [MhsIPK::class, 'index']);
        Route::post('/ipk',       [MhsIPK::class, 'store']);

        Route::get('/dokumen',    [MhsDokumen::class, 'index']);
        Route::post('/dokumen',   [MhsDokumen::class, 'store']);
        Route::delete('/dokumen/{id}', [MhsDokumen::class, 'destroy']);
        Route::get('/arsip',      [MhsDokumen::class, 'arsip']);

        Route::get('/sp', function (\Illuminate\Http\Request $req) {
            $m = $req->user()->mahasiswa()->with('suratPeringatans')->first();
            return response()->json(['success' => true, 'data' => $m->suratPeringatans]);
        });

        Route::get('/prestasi',      [MhsPrestasi::class, 'index']);
        Route::post('/prestasi',     [MhsPrestasi::class, 'store']);
        Route::put('/prestasi/{id}', [MhsPrestasi::class, 'update']);
        Route::delete('/prestasi/{id}', [MhsPrestasi::class, 'destroy']);

        Route::get('/organisasi',      [MhsOrganisasi::class, 'index']);
        Route::post('/organisasi',     [MhsOrganisasi::class, 'store']);
        Route::put('/organisasi/{id}', [MhsOrganisasi::class, 'update']);
        Route::delete('/organisasi/{id}', [MhsOrganisasi::class, 'destroy']);

        Route::get('/pelatihan',      [MhsPelatihan::class, 'index']);
        Route::post('/pelatihan',     [MhsPelatihan::class, 'store']);
        Route::put('/pelatihan/{id}', [MhsPelatihan::class, 'update']);
        Route::delete('/pelatihan/{id}', [MhsPelatihan::class, 'destroy']);

        Route::get('/bebas-tanggungan',  [MhsBT::class, 'show']);
        Route::post('/bebas-tanggungan', [MhsBT::class, 'store']);
    });

    // ── PRODI ─────────────────────────────────────────────────────────────────
    Route::middleware('role:prodi')->prefix('prodi')->group(function () {
        Route::get('/dashboard',          [ProdiDashboard::class, 'index']);
        Route::get('/mahasiswa',          [ProdiMahasiswa::class, 'index']);
        Route::get('/mahasiswa/{id}',     [ProdiMahasiswa::class, 'show']);
        Route::get('/ekspor',             [ProdiMahasiswa::class, 'ekspor']);
    });

    // ── WAREK ─────────────────────────────────────────────────────────────────
    Route::middleware('role:warek')->prefix('warek')->group(function () {
        Route::get('/dashboard',            [WarekDashboard::class, 'index']);
        Route::get('/laporan',              [WarekLaporan::class, 'index']);
        Route::get('/laporan/{id}',         [WarekLaporan::class, 'show']);
        Route::patch('/laporan/{id}/approve',[WarekLaporan::class, 'approve']);
        Route::patch('/laporan/{id}/return', [WarekLaporan::class, 'return']);

        // Warek juga bisa lihat semua mahasiswa (read-only)
        Route::get('/mahasiswa', function (\Illuminate\Http\Request $req) {
            $query = \App\Models\Mahasiswa::with('prodi');
            if ($s = $req->search) $query->where(fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
            $limit = (int)($req->limit ?? 10);
            $page  = (int)($req->page ?? 1);
            $total = $query->count();
            $data  = $query->skip(($page-1)*$limit)->take($limit)->get();
            return response()->json(['success'=>true,'data'=>$data,'total'=>$total,'page'=>$page,'limit'=>$limit,'total_pages'=>(int)ceil($total/$limit)]);
        });
    });
});
