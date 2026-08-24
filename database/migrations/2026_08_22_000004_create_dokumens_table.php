<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokumen_jenis', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->boolean('is_wajib')->default(true);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });

        Schema::create('dokumens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->foreignId('dokumen_jenis_id')->constrained('dokumen_jenis');
            $table->string('nama_file');
            $table->string('path_file');
            $table->integer('ukuran')->nullable(); // bytes
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumens');
        Schema::dropIfExists('dokumen_jenis');
    }
};
