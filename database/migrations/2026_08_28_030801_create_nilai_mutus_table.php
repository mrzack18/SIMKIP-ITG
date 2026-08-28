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
        Schema::create('nilai_mutus', function (Blueprint $table) {
            $table->id();
            $table->decimal('min', 4, 1);
            $table->decimal('max', 4, 1);
            $table->string('huruf', 5)->unique();
            $table->decimal('poin', 3, 2);
            $table->boolean('lulus')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_mutus');
    }
};
