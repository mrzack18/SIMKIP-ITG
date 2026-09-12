<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MahasiswaController;
use App\Http\Controllers\Api\Mahasiswa\DashboardController as MahasiswaDashboard;
use App\Http\Controllers\Api\IPKController;
use App\Http\Controllers\Api\PrestasiController;
use App\Http\Controllers\Api\OrganisasiController;
use App\Http\Controllers\Api\PelatihanController;
use App\Http\Controllers\Api\DokumenController;
use App\Http\Controllers\Api\SPController;
use App\Http\Controllers\Api\BebasTanggunganController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\ReportingController;
use App\Http\Controllers\Api\Admin\KonfigurasiController as AdminConfig;
use App\Http\Controllers\Api\Admin\AuditController as AdminAudit;
use App\Http\Controllers\Api\Admin\LsipdSyncController as AdminLsipd;
use App\Http\Controllers\Api\Admin\UserController as AdminUser;
use App\Http\Controllers\Api\Prodi\MahasiswaController as ProdiMahasiswa;
use App\Models\Mahasiswa;

Route::post("/auth/login", [AuthController::class, "login"])
    ->middleware("throttle:5,1");

Route::middleware("auth:sanctum")->group(function () {

    // Auth & Profile
    Route::post("/auth/logout",          [AuthController::class, "logout"]);
    Route::get("/auth/me",               [AuthController::class, "me"]);
    Route::post("/auth/change-password", [AuthController::class, "changePassword"]);

    Route::get("/profile",                  [ProfileController::class, "show"]);
    Route::post("/profile",                 [ProfileController::class, "update"]);
    Route::post("/profile/password",        [ProfileController::class, "changePassword"]);

    // Admin contact info (accessible by all authenticated users)
    Route::get("/admin-contact", function (Request $request) {
        $admin = \App\Models\User::where('role', 'admin')->first();
        return response()->json([
            'success' => true,
            'data' => [
                'nama'  => $admin?->name ?? 'Biro Kemahasiswaan',
                'no_hp' => $admin?->no_hp ?? null,
                'email' => $admin?->email ?? null,
            ]
        ]);
    });

    // Notifications
    Route::get("/notifications",            [NotificationController::class, "index"]);
    Route::get("/notifications/count",      [NotificationController::class, "count"]);
    Route::patch("/notifications/read-all", [NotificationController::class, "markAllRead"]);
    Route::patch("/notifications/{id}/read",[NotificationController::class, "markRead"]);

    Route::get("/konfigurasi/periode", [AdminConfig::class, "getPeriode"]);

    // LSIPD sync (lsipd only)
    Route::middleware("role:lsipd")->prefix("lsipd")->group(function () {
        Route::get("/status",                       [AdminLsipd::class, "status"]);
        Route::get("/sync-progress",                [AdminLsipd::class, "syncProgress"]);
        // Daftar mahasiswa untuk tabel di halaman Sinkronisasi (filter + urut nama).
        Route::get("/mahasiswa",                    [AdminLsipd::class, "indexMahasiswa"]);
        // Mahasiswa yang ada di LSIPD tapi belum ada di SIMKIP (untuk sync seperlunya).
        Route::get("/belum-tersinkron",             [AdminLsipd::class, "belumTersinkron"]);
        Route::post("/sync-mahasiswa",              [AdminLsipd::class, "syncAllMahasiswa"]);
        // Batch: dipakai tabel mahasiswa di halaman Sinkronisasi (satu request, banyak NIM).
        Route::post("/sync-mahasiswa-batch",        [AdminLsipd::class, "syncMahasiswaBatch"]);
        Route::post("/sync-transkrip-batch",        [AdminLsipd::class, "syncTranskripBatch"]);
        Route::post("/sync-mahasiswa/{nim}",        [AdminLsipd::class, "syncMahasiswa"]);
        Route::post("/sync-transkrip/{nim}",        [AdminLsipd::class, "syncTranskrip"]);
        Route::post("/delete-all-mahasiswa",        [AdminLsipd::class, "deleteAllMahasiswa"]);
        Route::delete("/mahasiswa/{nim}",           [AdminLsipd::class, "deleteMahasiswa"]);
    });

    // User management (lsipd only)
    Route::middleware("role:lsipd")->prefix("users")->group(function () {
        Route::get("/",                         [AdminUser::class, "index"]);
        Route::post("/",                        [AdminUser::class, "store"]);
        Route::put("/{id}",                    [AdminUser::class, "update"]);
        Route::patch("/{id}/toggle",            [AdminUser::class, "toggleActive"]);
        Route::post("/{id}/reset-password",     [AdminUser::class, "resetPassword"]);
    });

    // Unified Resources
    Route::get("/dashboard", [DashboardController::class, "index"]);

    // Mahasiswa self-dashboard (authenticated student)
    Route::get("/mahasiswa/dashboard", [MahasiswaDashboard::class, "index"]);

    Route::get("/mahasiswa",                  [MahasiswaController::class, "index"]);
    Route::post("/mahasiswa",                 [MahasiswaController::class, "store"]);
    Route::get("/mahasiswa/check-nim/{nim}",  [MahasiswaController::class, "checkNim"]);
    Route::get("/mahasiswa/filter-options",   [MahasiswaController::class, "filterOptions"]);
    Route::get("/mahasiswa/{nim}",             [MahasiswaController::class, "show"]);
    Route::get("/mahasiswa/{nim}/ipk",         [MahasiswaController::class, "ipk"]);

    Route::get("/mahasiswa/{nim}/dokumen",     [MahasiswaController::class, "dokumen"]);
    Route::delete("/mahasiswa/{nim}",          [MahasiswaController::class, "destroy"]);
    Route::patch("/mahasiswa/{nim}/status",    [MahasiswaController::class, "updateStatus"]);
    Route::patch("/mahasiswa/{nim}/cabut-kipk",[MahasiswaController::class, "cabutKipk"]);
    Route::get("/mahasiswa/{nim}/catatan",     [MahasiswaController::class, "getCatatanInternal"]);
    Route::post("/mahasiswa/{nim}/catatan",    [MahasiswaController::class, "storeCatatanInternal"]);

    Route::get("/akademik/rekap-mahasiswa",   [MahasiswaController::class, "rekapAkademik"]);
    Route::get("/akademik/prestasi",          [MahasiswaController::class, "rekapPrestasi"]);
    Route::get("/akademik/organisasi",        [MahasiswaController::class, "rekapOrganisasi"]);
    Route::get("/akademik/pelatihan",         [MahasiswaController::class, "rekapPelatihan"]);

    // Reporting prestasi / organisasi / pelatihan (admin & prodi)
    Route::get("/reporting/{type}",     [ReportingController::class, "index"]);
    Route::get("/reporting/{type}/pdf", [ReportingController::class, "pdf"]);

    Route::get("/mahasiswa/{nim}/prestasi",    [MahasiswaController::class, "prestasi"]);
    Route::get("/mahasiswa/{nim}/organisasi",  [MahasiswaController::class, "organisasi"]);
    Route::get("/mahasiswa/{nim}/pelatihan",   [MahasiswaController::class, "pelatihan"]);
    Route::put("/mahasiswa/{nim}/prestasi/{itemId}/validate",   [MahasiswaController::class, "validatePrestasi"]);
    Route::put("/mahasiswa/{nim}/organisasi/{itemId}/validate", [MahasiswaController::class, "validateOrganisasi"]);
    Route::put("/mahasiswa/{nim}/pelatihan/{itemId}/validate",  [MahasiswaController::class, "validatePelatihan"]);
    Route::get("/ipk",  [IPKController::class, "index"]);
    Route::post("/ipk", [IPKController::class, "store"]);
    Route::post("/ipk/submit", [IPKController::class, "submit"]);

    Route::get("/prestasi",                [PrestasiController::class, "index"]);
    Route::post("/prestasi",               [PrestasiController::class, "store"]);
    Route::put("/prestasi/{id}",           [PrestasiController::class, "update"]);
    Route::delete("/prestasi/{id}",        [PrestasiController::class, "destroy"]);
    Route::patch("/prestasi/{id}/resubmit",[PrestasiController::class, "resubmit"]);
    Route::patch("/prestasi/{id}/validate",[PrestasiController::class, "validatePrestasi"]);

    Route::get("/organisasi",                [OrganisasiController::class, "index"]);
    Route::post("/organisasi",               [OrganisasiController::class, "store"]);
    Route::put("/organisasi/{id}",           [OrganisasiController::class, "update"]);
    Route::put("/organisasi/{id}/resubmit",  [OrganisasiController::class, "resubmit"]);
    Route::delete("/organisasi/{id}",        [OrganisasiController::class, "destroy"]);
    Route::patch("/organisasi/{id}/validate",[OrganisasiController::class, "validateOrganisasi"]);

    Route::get("/pelatihan",                [PelatihanController::class, "index"]);
    Route::post("/pelatihan",               [PelatihanController::class, "store"]);
    Route::put("/pelatihan/{id}",           [PelatihanController::class, "update"]);
    Route::put("/pelatihan/{id}/resubmit",  [PelatihanController::class, "resubmit"]);
    Route::get("/pelatihan/{id}",           [PelatihanController::class, "show"]);
    Route::delete("/pelatihan/{id}",        [PelatihanController::class, "destroy"]);
    Route::patch("/pelatihan/{id}/validate",[PelatihanController::class, "validatePelatihan"]);

    Route::get("/dokumen",              [DokumenController::class, "index"]);
    Route::post("/dokumen",             [DokumenController::class, "store"]);
    Route::delete("/dokumen/{id}",      [DokumenController::class, "destroy"]);

    Route::get("/arsip", [\App\Http\Controllers\Api\Mahasiswa\ArsipController::class, "index"]);
    
    // Unified Admin Dokumen Queue
    Route::middleware("role:admin")->prefix("admin/dokumen-queue")->group(function () {
        Route::get("/",                        [DokumenController::class, "queue"]);
        Route::put("/{id}/validate",           [DokumenController::class, "validateDokumen"]);
    });

    // Admin Badge Counts (sidebar notification badges)
    Route::middleware("role:admin")->get("/admin/badge-counts", [\App\Http\Controllers\Api\Admin\DashboardController::class, "badgeCounts"]);

    // File preview & download (role-based access)
    Route::get("/files/{type}/{id}/{field}/preview",  [\App\Http\Controllers\Api\FileController::class, "serve"])
        ->defaults('action', 'inline');
    Route::get("/files/{type}/{id}/{field}/download", [\App\Http\Controllers\Api\FileController::class, "serve"])
        ->defaults('action', 'download');

    Route::get("/sp",                      [SPController::class, "index"]);
    Route::post("/sp",                     [SPController::class, "store"]);
    Route::get("/sp/{id}",                 [SPController::class, "show"]);
    Route::patch("/sp/{id}/status",        [SPController::class, "updateStatus"]);
    Route::get("/mahasiswa/{nim}/sp",       [SPController::class, "history"]);
    Route::get("/mahasiswa/{nim}/bebas-tanggungan", [MahasiswaController::class, "bebasTanggungan"]);

    Route::get("/bebas-tanggungan",                [BebasTanggunganController::class, "index"]);
    Route::post("/bebas-tanggungan",               [BebasTanggunganController::class, "store"]);
    Route::get("/bebas-tanggungan/pdf",            [BebasTanggunganController::class, "downloadPdfMhs"]);
    Route::get("/bebas-tanggungan/{id}",           [BebasTanggunganController::class, "show"]);
    Route::patch("/bebas-tanggungan/{id}/approve", [BebasTanggunganController::class, "approve"])
        ->middleware("role:admin");
    Route::patch("/bebas-tanggungan/{id}/reject",  [BebasTanggunganController::class, "reject"])
        ->middleware("role:admin");
    Route::get("/bebas-tanggungan/{id}/pdf",       [BebasTanggunganController::class, "downloadPdfAdmin"]);

    Route::get("/laporan",                     [LaporanController::class, "index"]);
    Route::post("/laporan",                   [LaporanController::class, "store"]);
    Route::get("/laporan/preview-statistics", [LaporanController::class, "previewStatistics"]);
    Route::get("/laporan/{id}",               [LaporanController::class, "show"]);
    Route::put("/laporan/{id}",          [LaporanController::class, "update"]);
    Route::patch("/laporan/{id}/submit", [LaporanController::class, "submit"]);
    Route::patch("/laporan/{id}/approve",[LaporanController::class, "approve"]);
    Route::patch("/laporan/{id}/return", [LaporanController::class, "returnLaporan"]);
    Route::get("/laporan/{id}/pdf",      [LaporanController::class, "downloadPdf"]);

    // Konfigurasi — dipakai bersama admin & lsipd.
    // admin hanya boleh menulis ambang batas akademik (dijaga di KonfigurasiController::update).
    Route::middleware("role:lsipd,admin")->prefix("konfigurasi")->group(function () {
        Route::get("/all",                       [AdminConfig::class, "indexAll"]);
        Route::put("/",                          [AdminConfig::class, "update"]);

        Route::get("/dokumen-jenis",             [AdminConfig::class, "indexDokumenJenis"]);
        Route::post("/dokumen-jenis",            [AdminConfig::class, "storeDokumenJenis"]);
        Route::delete("/dokumen-jenis/{id}",     [AdminConfig::class, "destroyDokumenJenis"]);
        Route::patch("/dokumen-jenis/{id}/toggle",[AdminConfig::class, "toggleDokumenJenis"]);
        Route::post("/dokumen-jenis/{id}/fields", [AdminConfig::class, "storeDokumenJenisField"]);
        Route::delete("/dokumen-jenis-fields/{id}", [AdminConfig::class, "destroyDokumenJenisField"]);

        Route::post("/pelanggaran",              [AdminConfig::class, "storePelanggaran"]);
        Route::put("/pelanggaran/{id}",          [AdminConfig::class, "updatePelanggaran"]);
        Route::delete("/pelanggaran/{id}",       [AdminConfig::class, "destroyPelanggaran"]);
        Route::patch("/pelanggaran/{id}/toggle", [AdminConfig::class, "togglePelanggaran"]);
        Route::get("/pelanggaran",               [AdminConfig::class, "indexPelanggaran"]);

        Route::get("/periode-akademik",          [AdminConfig::class, "indexPeriode"]);
        Route::post("/periode-akademik",         [AdminConfig::class, "storePeriode"]);
        Route::put("/periode-akademik/{id}",     [AdminConfig::class, "updatePeriode"]);
        Route::delete("/periode-akademik/{id}",  [AdminConfig::class, "destroyPeriode"]);
        Route::patch("/periode-akademik/{id}/activate", [AdminConfig::class, "activatePeriode"]);
        Route::patch("/periode-akademik/{id}/deactivate", [AdminConfig::class, "deactivatePeriode"]);
    });

    // Konfigurasi — khusus lsipd: index mentah, Prodi, Nilai Mutu, Tahun Ajaran.
    Route::middleware("role:lsipd")->prefix("konfigurasi")->group(function () {
        Route::get("/",                          [AdminConfig::class, "index"]);

        Route::get("/prodi",                     [AdminConfig::class, "indexProdi"]);
        Route::post("/prodi",                    [AdminConfig::class, "storeProdi"]);
        Route::put("/prodi/{id}",                [AdminConfig::class, "updateProdi"]);
        Route::patch("/prodi/{id}/toggle",       [AdminConfig::class, "toggleProdi"]);

        Route::post("/nilai-mutu",               [AdminConfig::class, "storeNilaiMutu"]);
        Route::put("/nilai-mutu/{id}",           [AdminConfig::class, "updateNilaiMutu"]);
        Route::delete("/nilai-mutu/{id}",        [AdminConfig::class, "destroyNilaiMutu"]);

        Route::get("/tahun-ajaran",              [AdminConfig::class, "indexTahunAjaran"]);
        Route::post("/tahun-ajaran",             [AdminConfig::class, "storeTahunAjaran"]);
        Route::put("/tahun-ajaran/{id}",         [AdminConfig::class, "updateTahunAjaran"]);
        Route::delete("/tahun-ajaran/{id}",      [AdminConfig::class, "destroyTahunAjaran"]);
        Route::patch("/tahun-ajaran/{id}/activate", [AdminConfig::class, "activateTahunAjaran"]);
        Route::patch("/tahun-ajaran/{id}/deactivate", [AdminConfig::class, "deactivateTahunAjaran"]);
    });

    // WAREK-specific endpoints (read-only dashboard & export)
    Route::middleware("role:warek")->prefix("warek")->group(function () {
        Route::get("/dashboard", [\App\Http\Controllers\Api\Warek\DashboardController::class, "index"]);
        Route::get("/mahasiswa/export", [\App\Http\Controllers\Api\Warek\MahasiswaController::class, "export"]);
    });

    // Prodi-specific endpoints
    Route::middleware("role:prodi")->prefix("prodi")->group(function () {
        Route::get("/mahasiswa", function (Request $req) {
            return app(ProdiMahasiswa::class)->index($req);
        });
        Route::get("/mahasiswa/{nim}/detail", function (Request $req, $nim) {
            return app(ProdiMahasiswa::class)->detail($req, (int) Mahasiswa::where('nim', $nim)->firstOrFail()->id);
        });
    });

    // Ekspor Prodi
    Route::get("/ekspor/mahasiswa", function (Request $req) {
        if ($req->user()->role === "prodi") return app(ProdiMahasiswa::class)->ekspor($req);
        abort(403);
    });
    Route::get("/ekspor/mahasiswa/preview", function (Request $req) {
        if ($req->user()->role === "prodi") return app(ProdiMahasiswa::class)->eksporPreview($req);
        abort(403);
    });
    Route::get("/ekspor/mahasiswa/download", function (Request $req) {
        if ($req->user()->role === "prodi") return app(ProdiMahasiswa::class)->exportDownload($req);
        abort(403);
    });

    // Audit Admin
    Route::get("/audit", function (Request $req) {
        if ($req->user()->role === "admin") return app(AdminAudit::class)->index($req);
        abort(403);
    });

});