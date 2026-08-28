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
        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->string('nomor_surat')->nullable()->unique()->after('mahasiswa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->dropColumn('nomor_surat');
        });
    }
};
