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
        Schema::create('periode_akademiks', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_akademik', 20); // e.g. "2025/2026"
            $table->string('semester', 20); // e.g. "Genap" or "Ganjil"
            $table->date('tanggal_buka');
            $table->date('tanggal_tutup');
            $table->boolean('is_aktif')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periode_akademiks');
    }
};
