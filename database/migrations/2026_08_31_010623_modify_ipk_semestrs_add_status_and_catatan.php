<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu')->after('file_khs');
            $table->text('catatan_admin')->nullable()->after('status');
            $table->dropColumn('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->after('file_khs');
            $table->dropColumn(['status', 'catatan_admin']);
        });
    }
};
