<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak','Draft','Diajukan') NOT NULL DEFAULT 'Menunggu'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE ipk_semestrs MODIFY COLUMN status ENUM('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu'");
    }
};
