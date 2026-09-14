<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * IPK/IPS tidak boleh bernilai 0 hanya karena mahasiswa belum punya nilai.
     *
     * Sync LSIPD dulu menulis 0 sebagai placeholder untuk semester yang belum
     * berisi nilai (mis. seluruh semester angkatan 2026). Akibatnya mahasiswa
     * baru dianggap ber-IPK 0 dan ikut muncul di filter "IPK < 3".
     *
     * Sekarang "belum ada nilai" direpresentasikan sebagai NULL, sedangkan 0
     * tetap berarti nilai asli (mis. semua nilai E). Baris lama tanpa satu pun
     * MK bernilai dibersihkan lewat IPKCalculatorService::bersihkanNilaiTanpaMK().
     */
    public function up(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->decimal('ips', 3, 2)->nullable()->default(null)->change();
            $table->decimal('ipk', 3, 2)->nullable()->default(null)->change();
        });

        \App\Services\IPKCalculatorService::bersihkanNilaiTanpaMK();
    }

    public function down(): void
    {
        // Kembalikan NULL menjadi 0 sebelum kolom dibuat NOT NULL lagi.
        DB::table('ipk_semestrs')->whereNull('ips')->update(['ips' => 0]);
        DB::table('ipk_semestrs')->whereNull('ipk')->update(['ipk' => 0]);

        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->decimal('ips', 3, 2)->default(0)->nullable(false)->change();
            $table->decimal('ipk', 3, 2)->nullable(false)->change();
        });
    }
};
