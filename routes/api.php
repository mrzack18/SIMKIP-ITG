<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout',          [AuthController::class, 'logout']);
    Route::get('/auth/me',               [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    Route::get('/profile',                  [ProfileController::class, 'show']);
    Route::post('/profile',                 [ProfileController::class, 'update']);
    Route::post('/profile/password',        [ProfileController::class, 'changePassword']);

    Route::get('/notifications',            [NotificationController::class, 'index']);
    Route::get('/notifications/count',      [NotificationController::class, 'count']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{id}/read',[NotificationController::class, 'markRead']);

    Route::get('/konfigurasi/periode', [AdminConfig::class, 'getPeriode']);

    // ── DASHBOARD ─────────────────────────────────────────────────────────────
    Route::get('/dashboard', function (Request $req) {
        return match($req->user()->role) {
            'admin'     => app(AdminDashboard::class)->index($req),
            'mahasiswa' => app(MhsDashboard::class)->index($req),
            'prodi'     => app(ProdiDashboard::class)->index($req),
            'warek'     => app(WarekDashboard::class)->index($req),
            default     => abort(403),
        };
    });

    // ── MAHASISWA ─────────────────────────────────────────────────────────────
    Route::get('/mahasiswa', function (Request $req) {
        return match($req->user()->role) {
            'admin' => app(AdminMahasiswa::class)->index($req),
            'prodi' => app(ProdiMahasiswa::class)->index($req),
            'warek' => (function() use ($req) {
                // Warek read-only
                $query = \App\Models\Mahasiswa::with('prodi');
                if ($s = $req->search) $query->where(fn($q) => $q->where('nim','like',"%$s%")->orWhere('nama','like',"%$s%"));
                $limit = (int)($req->limit ?? 10);
                $page  = (int)($req->page ?? 1);
                $total = $query->count();
                $data  = $query->skip(($page-1)*$limit)->take($limit)->get();
                return response()->json(['success'=>true,'data'=>$data,'total'=>$total,'page'=>$page,'limit'=>$limit,'total_pages'=>(int)ceil($total/$limit)]);
            })(),
            default => abort(403),
        };
    });

    Route::post('/mahasiswa', function (Request $req) {
        if ($req->user()->role === 'admin') return app(AdminMahasiswa::class)->store($req);
        abort(403);
    });

    Route::get('/mahasiswa/{id}', function (Request $req, $id) {
        return match($req->user()->role) {
            'admin' => app(AdminMahasiswa::class)->show($id),
            'prodi' => app(ProdiMahasiswa::class)->show($id),
            default => abort(403),
        };
    });

    Route::delete('/mahasiswa/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminMahasiswa::class)->destroy($req, $id);
        abort(403);
    });

    Route::get('/mahasiswa/check-nim/{nim}', function (Request $req, $nim) {
        if ($req->user()->role === 'admin') return app(AdminMahasiswa::class)->checkNim($nim);
        abort(403);
    });

    // ── AKADEMIK (IPK) ────────────────────────────────────────────────────────
    Route::get('/ipk', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => app(MhsIPK::class)->index($req),
            'admin'     => app(AdminAkademik::class)->indexIPK($req),
            default     => abort(403),
        };
    });
    Route::post('/ipk', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsIPK::class)->store($req);
        abort(403);
    });

    // ── PRESTASI ─────────────────────────────────────────────────────────────
    Route::get('/prestasi', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => app(MhsPrestasi::class)->index($req),
            'admin'     => app(AdminAkademik::class)->indexPrestasi($req),
            default     => abort(403),
        };
    });
    Route::post('/prestasi', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPrestasi::class)->store($req);
        abort(403);
    });
    Route::put('/prestasi/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPrestasi::class)->update($req, $id);
        abort(403);
    });
    Route::delete('/prestasi/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPrestasi::class)->destroy($id);
        abort(403);
    });
    Route::patch('/prestasi/{id}/validate', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminAkademik::class)->validatePrestasi($req, $id);
        abort(403);
    });

    // ── ORGANISASI ─────────────────────────────────────────────────────────────
    Route::get('/organisasi', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => app(MhsOrganisasi::class)->index($req),
            'admin'     => app(AdminAkademik::class)->indexOrganisasi($req),
            default     => abort(403),
        };
    });
    Route::post('/organisasi', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsOrganisasi::class)->store($req);
        abort(403);
    });
    Route::put('/organisasi/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsOrganisasi::class)->update($req, $id);
        abort(403);
    });
    Route::delete('/organisasi/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsOrganisasi::class)->destroy($id);
        abort(403);
    });
    Route::patch('/organisasi/{id}/validate', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminAkademik::class)->validateOrganisasi($req, $id);
        abort(403);
    });

    // ── PELATIHAN ─────────────────────────────────────────────────────────────
    Route::get('/pelatihan', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => app(MhsPelatihan::class)->index($req),
            'admin'     => app(AdminAkademik::class)->indexPelatihan($req),
            default     => abort(403),
        };
    });
    Route::post('/pelatihan', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPelatihan::class)->store($req);
        abort(403);
    });
    Route::put('/pelatihan/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPelatihan::class)->update($req, $id);
        abort(403);
    });
    Route::get('/pelatihan/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPelatihan::class)->show($id);
        abort(403);
    });
    Route::delete('/pelatihan/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsPelatihan::class)->destroy($id);
        abort(403);
    });
    Route::patch('/pelatihan/{id}/validate', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminAkademik::class)->validatePelatihan($req, $id);
        abort(403);
    });

    // ── DOKUMEN ───────────────────────────────────────────────────────────────
    Route::get('/dokumen', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsDokumen::class)->index($req);
        abort(403);
    });
    Route::post('/dokumen', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsDokumen::class)->store($req);
        abort(403);
    });
    Route::delete('/dokumen/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'mahasiswa') return app(MhsDokumen::class)->destroy($id);
        abort(403);
    });
    Route::get('/dokumen/arsip', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsDokumen::class)->arsip($req);
        abort(403);
    });
    Route::get('/dokumen/queue', function (Request $req) {
        if ($req->user()->role === 'admin') return app(AdminDokumen::class)->queue($req);
        abort(403);
    });
    Route::patch('/dokumen/{id}/approve', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminDokumen::class)->approve($req, $id);
        abort(403);
    });
    Route::patch('/dokumen/{id}/reject', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminDokumen::class)->reject($req, $id);
        abort(403);
    });
    Route::get('/dokumen/{id}/file', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminDokumen::class)->serveFile($id);
        abort(403);
    });

    // ── SURAT PERINGATAN ──────────────────────────────────────────────────────
    Route::get('/sp', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => (function() use ($req) {
                $m = $req->user()->mahasiswa()->with('suratPeringatans')->first();
                return response()->json(['success' => true, 'data' => $m->suratPeringatans]);
            })(),
            'admin' => app(AdminSP::class)->index($req),
            default => abort(403),
        };
    });
    Route::post('/sp', function (Request $req) {
        if ($req->user()->role === 'admin') return app(AdminSP::class)->store($req);
        abort(403);
    });
    Route::get('/sp/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminSP::class)->show($id);
        abort(403);
    });
    Route::patch('/sp/{id}/status', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminSP::class)->updateStatus($req, $id);
        abort(403);
    });

    // ── BEBAS TANGGUNGAN ──────────────────────────────────────────────────────
    Route::get('/bebas-tanggungan', function (Request $req) {
        return match($req->user()->role) {
            'mahasiswa' => app(MhsBT::class)->show($req),
            'admin'     => app(AdminBT::class)->index($req),
            default     => abort(403),
        };
    });
    Route::post('/bebas-tanggungan', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsBT::class)->store($req);
        abort(403);
    });
    Route::get('/bebas-tanggungan/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminBT::class)->show($id);
        abort(403);
    });
    Route::patch('/bebas-tanggungan/{id}/approve', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminBT::class)->approve($req, $id);
        abort(403);
    });
    Route::patch('/bebas-tanggungan/{id}/reject', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminBT::class)->reject($req, $id);
        abort(403);
    });
    Route::get('/bebas-tanggungan/pdf', function (Request $req) {
        if ($req->user()->role === 'mahasiswa') return app(MhsBT::class)->downloadPdf($req);
        abort(403);
    });
    Route::get('/bebas-tanggungan/{id}/pdf', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminBT::class)->downloadPdf($id);
        abort(403);
    });

    // ── LAPORAN ───────────────────────────────────────────────────────────────
    Route::get('/laporan', function (Request $req) {
        return match($req->user()->role) {
            'admin' => app(AdminLaporan::class)->index($req),
            'warek' => app(WarekLaporan::class)->index($req),
            default => abort(403),
        };
    });
    Route::post('/laporan', function (Request $req) {
        if ($req->user()->role === 'admin') return app(AdminLaporan::class)->store($req);
        abort(403);
    });
    Route::get('/laporan/{id}', function (Request $req, $id) {
        return match($req->user()->role) {
            'admin' => app(AdminLaporan::class)->show($id),
            'warek' => app(WarekLaporan::class)->show($id),
            default => abort(403),
        };
    });
    Route::put('/laporan/{id}', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminLaporan::class)->update($req, $id);
        abort(403);
    });
    Route::patch('/laporan/{id}/submit', function (Request $req, $id) {
        if ($req->user()->role === 'admin') return app(AdminLaporan::class)->submit($id);
        abort(403);
    });
    Route::patch('/laporan/{id}/approve', function (Request $req, $id) {
        if ($req->user()->role === 'warek') return app(WarekLaporan::class)->approve($req, $id);
        abort(403);
    });
    Route::patch('/laporan/{id}/return', function (Request $req, $id) {
        if ($req->user()->role === 'warek') return app(WarekLaporan::class)->return($req, $id);
        abort(403);
    });
    Route::get('/laporan/{id}/pdf', function (Request $req, $id) {
        return match($req->user()->role) {
            'admin' => app(AdminLaporan::class)->downloadPdf($id),
            'warek' => app(WarekLaporan::class)->downloadPdf($id),
            default => abort(403),
        };
    });

    // ── KONFIGURASI ADMIN ─────────────────────────────────────────────────────
    Route::middleware('role:admin')->prefix('konfigurasi')->group(function () {
        Route::get('/',                          [AdminConfig::class, 'index']);
        Route::put('/',                          [AdminConfig::class, 'update']);
        Route::get('/prodi',                    [AdminConfig::class, 'indexProdi']);
        Route::post('/prodi',                   [AdminConfig::class, 'storeProdi']);
        Route::put('/prodi/{id}',               [AdminConfig::class, 'updateProdi']);
        Route::patch('/prodi/{id}/toggle',      [AdminConfig::class, 'toggleProdi']);
        Route::get('/dokumen-jenis',            [AdminConfig::class, 'indexDokumenJenis']);
        Route::post('/dokumen-jenis',           [AdminConfig::class, 'storeDokumenJenis']);
        Route::delete('/dokumen-jenis/{id}',    [AdminConfig::class, 'destroyDokumenJenis']);
        Route::patch('/dokumen-jenis/{id}/toggle',[AdminConfig::class, 'toggleDokumenJenis']);
    });
    
    // Ekspor (Prodi)
    Route::get('/ekspor/mahasiswa', function (Request $req) {
        if ($req->user()->role === 'prodi') return app(ProdiMahasiswa::class)->ekspor($req);
        abort(403);
    });
    Route::get('/ekspor/mahasiswa/download', function (Request $req) {
        if ($req->user()->role === 'prodi') return app(ProdiMahasiswa::class)->exportDownload($req);
        abort(403);
    });

    // ── AUDIT LOG ─────────────────────────────────────────────────────────────
    Route::get('/audit', function (Request $req) {
        if ($req->user()->role === 'admin') return app(AdminAudit::class)->index($req);
        abort(403);
    });

});
