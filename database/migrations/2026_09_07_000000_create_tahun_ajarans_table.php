<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tahun_ajarans', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_akademik', 20);
            $table->string('semester', 20);
            $table->boolean('is_aktif')->default(false);
            $table->timestamps();

            $table->unique(['tahun_akademik', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tahun_ajarans');
    }
};
