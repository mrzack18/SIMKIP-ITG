<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('organisasis', function (Blueprint $table) {
            $table->enum('jenis', ['Organisasi', 'Kepanitiaan', 'Kegiatan'])->default('Organisasi')->after('nama');
            $table->string('foto_kegiatan')->nullable()->after('file_sk');
        });

        Schema::table('pelatihans', function (Blueprint $table) {
            $table->string('foto_kegiatan')->nullable()->after('file_sertifikat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organisasis', function (Blueprint $table) {
            $table->dropColumn(['jenis', 'foto_kegiatan']);
        });

        Schema::table('pelatihans', function (Blueprint $table) {
            $table->dropColumn(['foto_kegiatan']);
        });
    }
};
