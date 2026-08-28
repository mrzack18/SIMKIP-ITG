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
        // Change enum to varchar using raw SQL for better compatibility
        DB::statement('ALTER TABLE surat_peringatans MODIFY jenis_pelanggaran VARCHAR(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot revert to enum without knowing the exact values present in DB
        // So we just leave it as varchar.
    }
};
