<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nim', 20)->unique();
            $table->string('nama');
            $table->foreignId('prodi_id')->constrained('prodis');
            $table->year('angkatan');
            $table->enum('kategori', ['Reguler', 'Aspirasi']);
            $table->enum('status', ['Aktif', 'Lulus', 'Dicabut', 'Cuti'])->default('Aktif');
            $table->string('nomor_sk', 100);
            $table->date('tanggal_sk');
            $table->string('file_sk')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
