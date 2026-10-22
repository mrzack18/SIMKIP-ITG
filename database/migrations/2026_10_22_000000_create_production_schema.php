<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared(file_get_contents(database_path('migrations/production_schema.sql')));
    }

    public function down(): void
    {
        // The production schema is a baseline and is not reversibly dropped.
    }
};
