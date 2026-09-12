<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Mahasiswa wajib mengisi alasan (free text) setiap kali mengubah
     * Nilai Huruf sebuah mata kuliah yang datanya sudah tersimpan.
     * Kolom ini menyimpan alasan tersebut agar dapat ditinjau oleh
     * Pengelola KIP-K saat validasi.
     */
    public function up(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->text('alasan_perubahan')->nullable()->after('nilai_mutu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->dropColumn('alasan_perubahan');
        });
    }
};
