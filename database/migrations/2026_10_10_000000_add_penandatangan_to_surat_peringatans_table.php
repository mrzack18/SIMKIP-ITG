<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->string('tempat', 255)->nullable()->after('catatan');
            $table->string('penandatangan_nama', 255)->nullable()->after('tempat');
            $table->string('penandatangan_nidn', 50)->nullable()->after('penandatangan_nama');
            $table->string('penandatangan_jabatan', 255)->nullable()->after('penandatangan_nidn');
        });
    }

    public function down(): void
    {
        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->dropColumn(['tempat', 'penandatangan_nama', 'penandatangan_nidn', 'penandatangan_jabatan']);
        });
    }
};
