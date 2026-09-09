<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('jenis', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->enum('jenis', [
                'SP', 'Validasi', 'Hapus', 'Approve',
                'Login', 'Ubah', 'Ekspor', 'Laporan', 'Tambah', 'LSIPD',
            ])->change();
        });
    }
};
