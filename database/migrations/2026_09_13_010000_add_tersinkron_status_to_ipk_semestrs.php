<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Status 'Tersinkron' = data akademik hasil impor LSIPD.
     *
     * Sebelumnya sync menulis 'Disetujui', sehingga ribuan baris transkrip tampak
     * seolah sudah divalidasi Pengelola KIP-K padahal belum pernah dilihat manusia
     * (file_khs NULL, validated_at NULL). Akibatnya antrian validasi KHS
     * (DokumenQueue) penuh oleh baris yang tidak pernah diajukan mahasiswa.
     *
     * 'Disetujui' sekarang hanya boleh berarti: benar-benar divalidasi pengelola.
     *
     * CATATAN: nilai 'Tersinkron' yang ditambahkan di sini DIBATALKAN dan diganti
     * 'Draft' oleh migrasi 2026_09_13_020000_kembalikan_status_tersinkron_ke_draft.
     * Keduanya sengaja dibiarkan terpisah agar jejak perubahan skema tetap jujur.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak','Draft','Diajukan','Tersinkron') NOT NULL DEFAULT 'Menunggu'");

        // Backfill baris lama hasil sync. Guard-nya ketat supaya baris yang benar-benar
        // divalidasi pengelola tidak ikut tersentuh: wajib tidak punya file KHS,
        // tidak punya jejak validasi (validated_at & validated_by), tidak punya
        // catatan admin, dan tahun_ajaran-nya mengikuti format helper (bukan
        // "Semester N" yang dulu sempat tersimpan).
        DB::table('ipk_semestrs')
            ->where('status', 'Disetujui')
            ->whereNull('file_khs')
            ->whereNull('validated_at')
            ->whereNull('validated_by')
            ->whereNull('catatan_admin')
            ->whereRaw("tahun_ajaran REGEXP '^[0-9]{4}/[0-9]{4} (Ganjil|Genap)$'")
            ->update(['status' => 'Tersinkron']);
    }

    public function down(): void
    {
        // Kembalikan ke nilai lama sebelum enum-nya dipersempit.
        DB::table('ipk_semestrs')
            ->where('status', 'Tersinkron')
            ->update(['status' => 'Disetujui']);

        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak','Draft','Diajukan') NOT NULL DEFAULT 'Menunggu'");
    }
};
