<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->decimal('ips', 3, 2)->after('tahun_ajaran')->default(0);
        });

        // Patch existing data: copy ipk -> ips
        DB::table('ipk_semestrs')->update([
            'ips' => DB::raw('ipk')
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->dropColumn('ips');
        });
    }
};
