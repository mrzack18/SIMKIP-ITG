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
        Schema::table('mahasiswas', function (Blueprint $table) {
            $table->string('nik', 16)->nullable()->after('nama');
            $table->string('nisn', 20)->nullable()->after('nik');
            $table->string('tempat_lahir', 100)->nullable()->after('nisn');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable()->after('tanggal_lahir');
            $table->text('alamat')->nullable()->after('jenis_kelamin');
            $table->string('nama_ayah', 100)->nullable()->after('alamat');
            $table->string('nama_ibu', 100)->nullable()->after('nama_ayah');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswas', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'nisn',
                'tempat_lahir',
                'tanggal_lahir',
                'jenis_kelamin',
                'alamat',
                'nama_ayah',
                'nama_ibu'
            ]);
        });
    }
};
