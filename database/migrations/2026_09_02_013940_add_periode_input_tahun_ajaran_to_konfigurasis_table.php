<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::table('konfigurasis')->where('key', 'periode_input_tahun_ajaran')->exists();
        if (!$exists) {
            DB::table('konfigurasis')->insert([
                'key'   => 'periode_input_tahun_ajaran',
                'label' => 'TA Periode Input Nilai',
                'value' => null,
                'tipe'  => 'text',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('konfigurasis')->where('key', 'periode_input_tahun_ajaran')->delete();
    }
};
