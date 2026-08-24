<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat', 100)->nullable()->unique();
            $table->string('judul');
            $table->string('periode', 100);
            $table->string('tahun_akademik', 20);
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->date('tanggal_laporan');
            $table->text('catatan_laporan')->nullable();
            $table->enum('status', ['Draft', 'Diajukan', 'Disetujui', 'Dikembalikan'])->default('Draft');
            $table->foreignId('dibuat_oleh')->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('laporan_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporans')->cascadeOnDelete();
            $table->foreignId('warek_id')->constrained('users');
            $table->enum('aksi', ['Disetujui', 'Dikembalikan']);
            $table->text('catatan')->nullable();
            $table->timestamp('reviewed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_reviews');
        Schema::dropIfExists('laporans');
    }
};
