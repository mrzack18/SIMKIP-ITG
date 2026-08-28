<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bebas_tanggungan_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bebas_tanggungan_id')->constrained()->cascadeOnDelete();
            $table->string('status'); // e.g. Ditolak
            $table->text('catatan')->nullable();
            $table->foreignId('reviewed_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bebas_tanggungan_histories');
    }
};
