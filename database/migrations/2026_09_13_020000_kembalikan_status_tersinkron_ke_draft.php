<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Batalkan nilai status 'Tersinkron' dan kembalikan ke 'Draft'.
     *
     * Keputusannya: data akademik hasil sync LSIPD cukup ditandai 'Draft' (belum
     * final, belum divalidasi pengelola) — tidak perlu nilai status tersendiri.
     * Ini juga mengembalikan nilai enum ke bentuk semula sehingga tidak ada nilai
     * status baru yang harus ditangani di seluruh aplikasi.
     *
     * Guard-nya sama seperti migrasi sebelumnya supaya baris yang benar-benar
     * divalidasi pengelola tidak ikut tersentuh.
     */
    public function up(): void
    {
        DB::table('ipk_semestrs')
            ->where('status', 'Tersinkron')
            ->whereNull('file_khs')
            ->whereNull('validated_at')
            ->whereNull('validated_by')
            ->whereNull('catatan_admin')
            ->update(['status' => 'Draft']);

        // Jaring pengaman: sisa baris 'Tersinkron' apa pun (mis. sudah punya jejak
        // validasi) tetap harus dipindahkan sebelum enum-nya dipersempit, kalau
        // tidak MySQL akan menggagalkan ALTER atau mengosongkan nilainya.
        DB::table('ipk_semestrs')
            ->where('status', 'Tersinkron')
            ->update(['status' => 'Draft']);

        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak','Draft','Diajukan') NOT NULL DEFAULT 'Menunggu'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak','Draft','Diajukan','Tersinkron') NOT NULL DEFAULT 'Menunggu'");

        DB::table('ipk_semestrs')
            ->where('status', 'Draft')
            ->whereNull('file_khs')
            ->whereNull('validated_at')
            ->whereNull('validated_by')
            ->whereNull('catatan_admin')
            ->update(['status' => 'Tersinkron']);
    }
};
