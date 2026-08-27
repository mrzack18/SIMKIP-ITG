<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dokumens', function (Blueprint $table) {
            $table->json('metadata')->nullable()->after('catatan_admin');
        });

        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->date('batas_evaluasi')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('dokumens', function (Blueprint $table) {
            $table->dropColumn('metadata');
        });

        Schema::table('surat_peringatans', function (Blueprint $table) {
            $table->date('batas_evaluasi')->nullable(false)->change();
        });
    }
};
