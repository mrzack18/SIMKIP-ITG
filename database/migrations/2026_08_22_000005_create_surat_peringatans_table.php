<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_peringatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->enum('level', ['SP1', 'SP2', 'SP3']);
            $table->enum('jenis_pelanggaran', ['Akademik', 'Non-Akademik', 'Cuti Tanpa Izin']);
            $table->text('deskripsi');
            $table->date('tanggal_terbit');
            $table->date('batas_evaluasi');
            $table->enum('status', ['Aktif', 'Masa Tenggang', 'Pemberhentian', 'Selesai'])->default('Aktif');
            $table->foreignId('diterbitkan_oleh')->constrained('users');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_peringatans');
    }
};
