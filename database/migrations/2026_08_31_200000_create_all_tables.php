<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Prodi (standalone, no deps) ────────────────────────────
        Schema::create('prodis', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20)->unique();
            $table->string('nama');
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
        });

        // ── 2. Users (depends on prodis) ──────────────────────────────
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'mahasiswa', 'prodi', 'warek'])->default('mahasiswa');
            $table->boolean('is_password_changed')->default(false);
            $table->string('foto_profil')->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->foreignId('prodi_id')->nullable()->constrained('prodis')->nullOnDelete();
            $table->rememberToken();
            $table->timestamps();
        });

        // ── 3. Laravel Defaults (no app deps) ──────────────────────────
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->bigInteger('expiration')->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->bigInteger('expiration')->index();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedSmallInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('connection');
            $table->string('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
            $table->index(['connection', 'queue', 'failed_at']);
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        // ── 4. Core Domain Tables (depend on prodis / users) ───────────
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nim', 20)->unique();
            $table->string('nama');
            $table->string('nik', 16)->nullable();
            $table->string('nisn', 20)->nullable();
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable();
            $table->text('alamat')->nullable();
            $table->string('nama_ayah', 100)->nullable();
            $table->string('nama_ibu', 100)->nullable();
            $table->string('tel_ayah', 20)->nullable();
            $table->string('tel_ibu', 20)->nullable();
            $table->foreignId('prodi_id')->constrained('prodis');
            $table->year('angkatan');
            $table->enum('kategori', ['Reguler', 'Aspirasi']);
            $table->enum('status', ['Aktif', 'Nonaktif', 'Dicabut', 'Lulus'])->default('Aktif');
            $table->string('alasan_nonaktif')->nullable();
            $table->date('tanggal_nonaktif')->nullable();
            $table->string('semester_dicabut')->nullable();
            $table->date('tanggal_dicabut')->nullable();
            $table->string('alasan_dicabut')->nullable();
            $table->string('dicabut_oleh')->nullable();
            $table->string('nomor_sk', 100);
            $table->date('tanggal_sk');
            $table->string('file_sk')->nullable();
            $table->timestamps();
        });

        Schema::create('ipk_semestrs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->tinyInteger('semester')->unsigned();
            $table->string('tahun_ajaran', 30);
            $table->decimal('ips', 3, 2)->default(0);
            $table->decimal('ipk', 3, 2);
            $table->string('file_khs')->nullable();
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
            $table->unique(['mahasiswa_id', 'semester']);
        });

        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ipk_semester_id')->constrained('ipk_semestrs')->cascadeOnDelete();
            $table->string('kode', 20);
            $table->string('nama');
            $table->tinyInteger('sks')->unsigned();
            $table->enum('nilai_huruf', ['A', 'AB', 'B', 'BC', 'C', 'D', 'E']);
            $table->decimal('nilai_mutu', 3, 1);
            $table->boolean('lulus')->default(true);
            $table->timestamps();
        });

        Schema::create('dokumen_jenis', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kode')->nullable();
            $table->text('deskripsi')->nullable();
            $table->boolean('is_wajib')->default(true);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });

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

        Schema::create('dokumens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->foreignId('dokumen_jenis_id')->constrained('dokumen_jenis');
            $table->string('nama_file');
            $table->string('path_file');
            $table->integer('ukuran')->nullable();
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('dokumen_field_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_id')->constrained('dokumens')->cascadeOnDelete();
            $table->foreignId('dokumen_jenis_field_id')->constrained('dokumen_jenis_fields')->cascadeOnDelete();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('surat_peringatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->string('nomor_surat')->nullable()->unique();
            $table->enum('level', ['SP1', 'SP2', 'SP3']);
            $table->string('jenis_pelanggaran', 255);
            $table->text('deskripsi');
            $table->date('tanggal_terbit');
            $table->date('batas_evaluasi')->nullable();
            $table->enum('status', ['Aktif', 'Masa Tenggang', 'Pemberhentian', 'Selesai'])->default('Aktif');
            $table->foreignId('diterbitkan_oleh')->constrained('users');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('bebas_tanggungans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->date('tanggal_ajukan');
            $table->enum('status', ['Menunggu', 'Diproses', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('nomor_surat', 100)->nullable();
            $table->date('tanggal_terbit')->nullable();
            $table->timestamps();
        });

        Schema::create('bebas_tanggungan_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bebas_tanggungan_id')->constrained('bebas_tanggungans')->cascadeOnDelete();
            $table->string('status');
            $table->text('catatan')->nullable();
            $table->foreignId('reviewed_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat', 100)->nullable()->unique();
            $table->string('judul');
            $table->string('periode', 100);
            $table->string('tahun_akademik', 20);
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->date('tanggal_laporan');
            $table->text('catatan_laporan')->nullable();
            $table->string('cakupan', 50)->nullable();
            $table->string('angkatan', 20)->nullable();
            $table->string('prodi', 100)->nullable();
            $table->boolean('tujuan_prodi')->default(false);
            $table->boolean('tujuan_warek')->default(true);
            $table->enum('status', ['Draft', 'Diajukan', 'Disetujui', 'Ditolak', 'Dikembalikan'])->default('Draft');
            $table->foreignId('dibuat_oleh')->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('laporan_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporans')->cascadeOnDelete();
            $table->foreignId('warek_id')->constrained('users');
            $table->enum('aksi', ['Disetujui', 'Ditolak', 'Dikembalikan']);
            $table->text('catatan')->nullable();
            $table->timestamp('reviewed_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('konfigurasis', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->string('label');
            $table->enum('tipe', ['number', 'text', 'boolean', 'date'])->default('text');
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('jenis', ['SP', 'Validasi', 'Hapus', 'Approve', 'Login', 'Ubah', 'Ekspor', 'Laporan', 'Tambah']);
            $table->string('aktivitas');
            $table->text('deskripsi')->nullable();
            $table->string('terkait_nim', 20)->nullable();
            $table->string('terkait_nama')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('judul');
            $table->text('pesan');
            $table->enum('tipe', ['info', 'warning', 'success', 'error'])->default('info');
            $table->boolean('is_read')->default(false);
            $table->string('link', 500)->nullable();
            $table->timestamps();
        });

        Schema::create('catatan_internals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->string('tahun_ajaran', 50);
            $table->string('kategori', 50);
            $table->text('deskripsi');
            $table->timestamps();
        });

        Schema::create('nilai_mutus', function (Blueprint $table) {
            $table->id();
            $table->decimal('min', 4, 1);
            $table->decimal('max', 4, 1);
            $table->string('huruf', 5)->unique();
            $table->decimal('poin', 3, 2);
            $table->boolean('lulus')->default(true);
            $table->timestamps();
        });

        Schema::create('jenis_pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->text('deskripsi')->nullable();
            $table->string('eskalasi', 50)->default('normal');
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });

        Schema::create('periode_akademiks', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_akademik', 20);
            $table->string('semester', 20);
            $table->date('tanggal_buka');
            $table->date('tanggal_tutup');
            $table->boolean('is_aktif')->default(false);
            $table->timestamps();
        });

        Schema::create('contact_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('no_hp', 20);
            $table->string('keterangan', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('organisasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->string('nama');
            $table->enum('jenis', ['Organisasi', 'Kepanitiaan', 'Kegiatan'])->default('Organisasi');
            $table->string('jabatan');
            $table->date('periode_mulai');
            $table->date('periode_selesai');
            $table->text('deskripsi')->nullable();
            $table->string('file_sk')->nullable();
            $table->string('foto_kegiatan')->nullable();
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('pelatihans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->string('nama');
            $table->enum('jenis', ['Akademik', 'Non-Akademik']);
            $table->string('penyelenggara');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('tempat');
            $table->text('deskripsi')->nullable();
            $table->string('file_sertifikat')->nullable();
            $table->string('foto_kegiatan')->nullable();
            $table->enum('status', ['Menunggu', 'Disetujui', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('prestasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->cascadeOnDelete();
            $table->string('nama_prestasi');
            $table->enum('tingkat', ['Internasional', 'Nasional', 'Wilayah', 'Institusi']);
            $table->string('pencapaian');
            $table->string('penyelenggara');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('tempat');
            $table->text('deskripsi')->nullable();
            $table->string('link_penyelenggara', 500)->nullable();
            $table->string('file_sertifikat')->nullable();
            $table->string('file_foto')->nullable();
            $table->enum('status', ['Menunggu Validasi', 'Disetujui', 'Ditolak'])->default('Menunggu Validasi');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestasis');
        Schema::dropIfExists('pelatihans');
        Schema::dropIfExists('organisasis');
        Schema::dropIfExists('contact_histories');
        Schema::dropIfExists('periode_akademiks');
        Schema::dropIfExists('jenis_pelanggarans');
        Schema::dropIfExists('nilai_mutus');
        Schema::dropIfExists('catatan_internals');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('konfigurasis');
        Schema::dropIfExists('laporan_reviews');
        Schema::dropIfExists('laporans');
        Schema::dropIfExists('bebas_tanggungan_histories');
        Schema::dropIfExists('bebas_tanggungans');
        Schema::dropIfExists('surat_peringatans');
        Schema::dropIfExists('dokumen_field_values');
        Schema::dropIfExists('dokumen_jenis_fields');
        Schema::dropIfExists('dokumens');
        Schema::dropIfExists('dokumen_jenis');
        Schema::dropIfExists('mata_kuliahs');
        Schema::dropIfExists('ipk_semestrs');
        Schema::dropIfExists('mahasiswas');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('prodis');
    }
};
