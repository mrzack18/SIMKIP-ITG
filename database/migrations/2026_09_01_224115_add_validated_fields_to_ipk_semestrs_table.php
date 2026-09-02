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
            $table->unsignedBigInteger('validated_by')->nullable()->after('catatan_admin');
            $table->foreign('validated_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable()->after('validated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ipk_semestrs', function (Blueprint $table) {
            $table->unsignedBigInteger('validated_by')->nullable()->after('catatan_admin');
            $table->foreign('validated_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable()->after('validated_by');
        });
    }
};
