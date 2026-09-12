<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lsipd_sync_progresses', function (Blueprint $table) {
            $table->string('phase', 20)->default('biodata')->after('status');
            $table->unsignedInteger('unchanged')->default(0)->after('skipped');
            $table->unsignedInteger('transkrip_success')->default(0)->after('unchanged');
            $table->unsignedInteger('transkrip_failed')->default(0)->after('transkrip_success');
        });
    }

    public function down(): void
    {
        Schema::table('lsipd_sync_progresses', function (Blueprint $table) {
            $table->dropColumn(['phase', 'unchanged', 'transkrip_success', 'transkrip_failed']);
        });
    }
};
