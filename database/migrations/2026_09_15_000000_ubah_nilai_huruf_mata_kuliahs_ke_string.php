<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Data akademik LSIPD mengirim nilai huruf "-" (belum dinilai) dan "T"
     * (dosen belum menginput nilai) selain A/AB/B/BC/C/D/E. ENUM tidak bisa
     * menampung keduanya, sehingga kolom diubah menjadi string.
     */
    public function up(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->string('nilai_huruf', 10)->default('')->change();
        });
    }

    public function down(): void
    {
        // Kembalikan ke nilai huruf yang valid sebelum mengubah kembali ke ENUM.
        DB::table('mata_kuliahs')
            ->where('nilai_huruf', 'T')
            ->update(['nilai_huruf' => 'E']);
        DB::table('mata_kuliahs')
            ->where('nilai_huruf', '-')
            ->update(['nilai_huruf' => 'E']);

        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->enum('nilai_huruf', ['A', 'AB', 'B', 'BC', 'C', 'D', 'E'])->change();
        });
    }
};
