<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE laporans MODIFY COLUMN status ENUM('Draft', 'Diajukan', 'Disetujui', 'Ditolak', 'Dikembalikan') DEFAULT 'Draft'");
        DB::statement("ALTER TABLE laporan_reviews MODIFY COLUMN aksi ENUM('Disetujui', 'Ditolak', 'Dikembalikan') NOT NULL");

        Schema::table('laporans', function (Blueprint $table) {
            $table->string('cakupan', 50)->nullable()->after('catatan_laporan');
            $table->string('angkatan', 20)->nullable()->after('cakupan');
            $table->string('prodi', 100)->nullable()->after('angkatan');
            $table->boolean('tujuan_prodi')->default(false)->after('prodi');
            $table->boolean('tujuan_warek')->default(true)->after('tujuan_prodi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            $table->dropColumn(['cakupan', 'angkatan', 'prodi', 'tujuan_prodi', 'tujuan_warek']);
        });
        
        DB::statement("ALTER TABLE laporans MODIFY COLUMN status ENUM('Draft', 'Diajukan', 'Disetujui', 'Ditolak') DEFAULT 'Draft'");
        DB::statement("ALTER TABLE laporan_reviews MODIFY COLUMN aksi ENUM('Disetujui', 'Ditolak') NOT NULL");
    }
};
