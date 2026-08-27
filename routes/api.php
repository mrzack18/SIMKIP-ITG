<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MahasiswaController;
use App\Http\Controllers\Api\IPKController;
use App\Http\Controllers\Api\PrestasiController;
use App\Http\Controllers\Api\OrganisasiController;
use App\Http\Controllers\Api\PelatihanController;
use App\Http\Controllers\Api\DokumenController;
use App\Http\Controllers\Api\SPController;
use App\Http\Controllers\Api\BebasTanggunganController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\Admin\KonfigurasiController as AdminConfig;
use App\Http\Controllers\Api\Admin\AuditController as AdminAudit;
use App\Http\Controllers\Api\Prodi\MahasiswaController as ProdiMahasiswa;

Route::post("/auth/login", [AuthController::class, "login"]);

Route::middleware("auth:sanctum")->group(function () {

    // Auth & Profile
    Route::post("/auth/logout",          [AuthController::class, "logout"]);
    Route::get("/auth/me",               [AuthController::class, "me"]);
    Route::post("/auth/change-password", [AuthController::class, "changePassword"]);

    Route::get("/profile",                  [ProfileController::class, "show"]);
    Route::post("/profile",                 [ProfileController::class, "update"]);
    Route::post("/profile/password",        [ProfileController::class, "changePassword"]);

    // Notifications
    Route::get("/notifications",            [NotificationController::class, "index"]);
    Route::get("/notifications/count",      [NotificationController::class, "count"]);
    Route::patch("/notifications/read-all", [NotificationController::class, "markAllRead"]);
    Route::patch("/notifications/{id}/read",[NotificationController::class, "markRead"]);

    Route::get("/konfigurasi/periode", [AdminConfig::class, "getPeriode"]);

    // Unified Resources
    Route::get("/dashboard", [DashboardController::class, "index"]);

    Route::get("/mahasiswa",                  [MahasiswaController::class, "index"]);
    Route::post("/mahasiswa",                 [MahasiswaController::class, "store"]);
    Route::get("/mahasiswa/check-nim/{nim}",  [MahasiswaController::class, "checkNim"]);
    Route::get("/mahasiswa/{id}",             [MahasiswaController::class, "show"]);
    Route::get("/mahasiswa/{id}/ipk",         [MahasiswaController::class, "ipk"]);
    Route::delete("/mahasiswa/{id}",          [MahasiswaController::class, "destroy"]);

    Route::get("/mahasiswa/{id}/prestasi",    [MahasiswaController::class, "prestasi"]);
    Route::get("/mahasiswa/{id}/organisasi",  [MahasiswaController::class, "organisasi"]);
    Route::get("/mahasiswa/{id}/pelatihan",   [MahasiswaController::class, "pelatihan"]);
    Route::put("/mahasiswa/{id}/prestasi/{itemId}/validate",   [MahasiswaController::class, "validatePrestasi"]);
    Route::put("/mahasiswa/{id}/organisasi/{itemId}/validate", [MahasiswaController::class, "validateOrganisasi"]);
    Route::put("/mahasiswa/{id}/pelatihan/{itemId}/validate",  [MahasiswaController::class, "validatePelatihan"]);
    Route::get("/ipk",  [IPKController::class, "index"]);
    Route::post("/ipk", [IPKController::class, "store"]);

    Route::get("/prestasi",                [PrestasiController::class, "index"]);
    Route::post("/prestasi",               [PrestasiController::class, "store"]);
    Route::put("/prestasi/{id}",           [PrestasiController::class, "update"]);
    Route::delete("/prestasi/{id}",        [PrestasiController::class, "destroy"]);
    Route::patch("/prestasi/{id}/validate",[PrestasiController::class, "validatePrestasi"]);

    Route::get("/organisasi",                [OrganisasiController::class, "index"]);
    Route::post("/organisasi",               [OrganisasiController::class, "store"]);
    Route::put("/organisasi/{id}",           [OrganisasiController::class, "update"]);
    Route::delete("/organisasi/{id}",        [OrganisasiController::class, "destroy"]);
    Route::patch("/organisasi/{id}/validate",[OrganisasiController::class, "validateOrganisasi"]);

    Route::get("/pelatihan",                [PelatihanController::class, "index"]);
    Route::post("/pelatihan",               [PelatihanController::class, "store"]);
    Route::put("/pelatihan/{id}",           [PelatihanController::class, "update"]);
    Route::get("/pelatihan/{id}",           [PelatihanController::class, "show"]);
    Route::delete("/pelatihan/{id}",        [PelatihanController::class, "destroy"]);
    Route::patch("/pelatihan/{id}/validate",[PelatihanController::class, "validatePelatihan"]);

    Route::get("/dokumen",              [DokumenController::class, "index"]);
    Route::post("/dokumen",             [DokumenController::class, "store"]);
    Route::delete("/dokumen/{id}",      [DokumenController::class, "destroy"]);
    
    // Unified Admin Dokumen Queue
    Route::get("/admin/dokumen-queue", [DokumenController::class, "queue"]);
    Route::put("/admin/dokumen-queue/{id}/validate", [DokumenController::class, "validateDokumen"]);

    Route::get("/sp",               [SPController::class, "index"]);
    Route::post("/sp",              [SPController::class, "store"]);
    Route::get("/mahasiswa/{id}/sp",[SPController::class, "history"]);

    Route::get("/bebas-tanggungan",                [BebasTanggunganController::class, "index"]);
    Route::post("/bebas-tanggungan",               [BebasTanggunganController::class, "store"]);
    Route::get("/bebas-tanggungan/pdf",            [BebasTanggunganController::class, "downloadPdfMhs"]);
    Route::get("/bebas-tanggungan/{id}",           [BebasTanggunganController::class, "show"]);
    Route::patch("/bebas-tanggungan/{id}/approve", [BebasTanggunganController::class, "approve"]);
    Route::patch("/bebas-tanggungan/{id}/reject",  [BebasTanggunganController::class, "reject"]);
    Route::get("/bebas-tanggungan/{id}/pdf",       [BebasTanggunganController::class, "downloadPdfAdmin"]);

    Route::get("/laporan",               [LaporanController::class, "index"]);
    Route::post("/laporan",              [LaporanController::class, "store"]);
    Route::get("/laporan/{id}",          [LaporanController::class, "show"]);
    Route::put("/laporan/{id}",          [LaporanController::class, "update"]);
    Route::patch("/laporan/{id}/submit", [LaporanController::class, "submit"]);
    Route::patch("/laporan/{id}/approve",[LaporanController::class, "approve"]);
    Route::patch("/laporan/{id}/return", [LaporanController::class, "returnLaporan"]);
    Route::get("/laporan/{id}/pdf",      [LaporanController::class, "downloadPdf"]);

    // Konfigurasi Admin
    Route::middleware("role:admin")->prefix("konfigurasi")->group(function () {
        Route::get("/",                          [AdminConfig::class, "index"]);
        Route::put("/",                          [AdminConfig::class, "update"]);
        Route::get("/prodi",                     [AdminConfig::class, "indexProdi"]);
        Route::post("/prodi",                    [AdminConfig::class, "storeProdi"]);
        Route::put("/prodi/{id}",                [AdminConfig::class, "updateProdi"]);
        Route::patch("/prodi/{id}/toggle",       [AdminConfig::class, "toggleProdi"]);
        Route::get("/dokumen-jenis",             [AdminConfig::class, "indexDokumenJenis"]);
        Route::post("/dokumen-jenis",            [AdminConfig::class, "storeDokumenJenis"]);
        Route::delete("/dokumen-jenis/{id}",     [AdminConfig::class, "destroyDokumenJenis"]);
        Route::patch("/dokumen-jenis/{id}/toggle",[AdminConfig::class, "toggleDokumenJenis"]);
    });

    // Ekspor Prodi
    Route::get("/ekspor/mahasiswa", function (Request $req) {
        if ($req->user()->role === "prodi") return app(ProdiMahasiswa::class)->ekspor($req);
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