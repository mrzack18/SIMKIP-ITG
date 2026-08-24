<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ipk_semestrs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->tinyInteger('semester')->unsigned();
            $table->string('tahun_ajaran', 30); // "2024/2025 Ganjil"
            $table->decimal('ipk', 3, 2);
            $table->string('file_khs')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->unique(['mahasiswa_id', 'semester']);
        });

        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ipk_semester_id')->constrained('ipk_semestrs')->cascadeOnDelete();
            $table->string('kode', 20);
            $table->string('nama');
            $table->tinyInteger('sks')->unsigned();
            $table->enum('nilai_huruf', ['A', 'AB', 'B', 'BC', 'C', 'D', 'E']);
            $table->decimal('nilai_mutu', 3, 1);
            $table->boolean('lulus')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mata_kuliahs');
        Schema::dropIfExists('ipk_semestrs');
    }
};
