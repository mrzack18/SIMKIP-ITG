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
        Schema::create('dokumen_field_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_id')->constrained('dokumens')->cascadeOnDelete();
            $table->foreignId('dokumen_jenis_field_id')->constrained('dokumen_jenis_fields')->cascadeOnDelete();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_field_values');
    }
};
