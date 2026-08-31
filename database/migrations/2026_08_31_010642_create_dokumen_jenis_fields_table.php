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
        Schema::create('dokumen_jenis_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_jenis_id')->constrained('dokumen_jenis')->cascadeOnDelete();
            $table->string('label');
            $table->enum('tipe', ['text', 'number', 'date', 'url', 'dropdown', 'checkbox']);
            $table->json('opsi')->nullable();
            $table->boolean('is_required')->default(false);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_jenis_fields');
    }
};
