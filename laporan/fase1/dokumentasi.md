# Dokumentasi Fase 1 - Inisialisasi Proyek & Sistem Autentikasi

## Pendahuluan
Dokumen ini merupakan laporan dari penyelesaian **Fase 1: Inisialisasi Proyek & Sistem Autentikasi** untuk Sistem Monitoring KIP Kuliah Institut Teknologi Garut (ITG). Pengerjaan ini didasarkan pada dokumen SRS dan Roadmap yang telah disetujui sebelumnya.

## Pekerjaan yang Telah Diselesaikan

### 1. Inisialisasi Proyek & Setup Environment
- Laravel 11 berhasil diinstal di dalam struktur Docker yang sudah disediakan, meliputi container `simokip-app` (PHP), `simokip-mysql` (MySQL), dan `simokip-node` (Node.js/Vite).
- Laravel Breeze dengan stack React + Inertia.js berhasil di-scaffold.
- Kebutuhan frontend UI seperti Tailwind CSS (v4/v3 via Vite), Framer Motion, dan komponen dasar shadcn/ui (`lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`) telah diinstal dengan penyesuaian dependensi Vite (menggunakan `--legacy-peer-deps` untuk menyelesaikan bentrok dependensi *peer*).
- File konfigurasi Nginx (`default.conf`) disesuaikan agar me-*route* request ke Laravel server (melalui proxy pass ke port 8000 karena keterbatasan built-in PHP-FPM di docker image bawaan awal).

### 2. Database Migrations & Models
Skema database telah dibuat dan di-migrate sesuai dengan rancangan pada SRS, meliputi:
- `users`: Penambahan kolom `username` (NIM untuk mahasiswa, username unik untuk admin/prodi/warek3), `role` (enum: 'admin', 'mahasiswa', 'prodi', 'warek3'), dan `is_password_changed` (boolean).
- `students`: Data mahasiswa (NIM, Nama, Prodi, Fakultas, Angkatan, Status Akademik, Status KIP, Semester, No HP, No Rekening).
- `academic_records`: Riwayat KHS dan nilai IPK/IPS per semester.
- `achievement_organizations`: Data prestasi dan keterlibatan organisasi mahasiswa.
- `mandatory_documents`: Dokumen wajib (Pakta Integritas, dll) dengan status validasinya.
- `warning_letters`: Riwayat Surat Peringatan (SP) yang pernah dikeluarkan.
- `reports`: Penyimpanan laporan sistem.
- `system_settings`: Pengaturan konfigurasi sistem seperti `min_ipk`, `max_sp`, `max_semester`.
- `audit_logs`: Rekam jejak seluruh aktivitas penting pengguna (login, update status, dll).

### 3. Database Seeders
Seeder telah dibuat dan dieksekusi:
- **SystemSettingSeeder**: Mengisi konfigurasi dasar (`min_ipk` = 3.0, `max_sp` = 3, `max_semester` = 8).
- **SuperAdminSeeder**: Membuat akun default Super Admin (Username: `admin_kemahasiswaan`, Role: `admin`, Password default: `password`).

### 4. Sistem Autentikasi & RBAC
- **Modifikasi Login**: `LoginRequest` (app/Http/Requests/Auth/LoginRequest.php) dan komponen antarmuka login (resources/js/Pages/Auth/Login.jsx) diubah agar menggunakan `username` alih-alih `email`.
- **Middleware CheckRole**: Dibuat untuk melindungi rute berdasarkan role pengguna (Admin, Mahasiswa, Prodi, Warek3).
- **Middleware ForcePasswordChange**: Dibuat untuk mengecek status `is_password_changed`. Apabila pengguna (terutama mahasiswa yang digenerate oleh sistem) belum mengubah password default mereka, mereka akan dipaksa (*redirected*) menuju halaman ganti password terlebih dahulu sebelum dapat mengakses fitur lain. Halaman antarmuka React untuk form ganti password (`ChangePassword.jsx`) beserta route/controller yang menangani update juga telah diimplementasikan.

### 5. Testing & Verifikasi
- Aplikasi telah diverifikasi berjalan di `http://localhost:8000` dengan Nginx melayani konten statis maupun proxy ke Laravel.
- Proses autentikasi dengan akun Super Admin telah diverifikasi berjalan lancar (password hash check).
- Validasi middleware untuk perlindungan *Role* dan fitur "Wajib Ganti Password" juga telah diuji menggunakan script integrasi.

## Kendala dan Solusi
Selama pengerjaan, terdapat beberapa kendala jaringan dan integrasi:
1. **Network Timeout saat Instalasi Breeze**: Proses `composer require laravel/breeze` sempat mengalami *connection timeout* ke repo.packagist.org karena masalah resolusi IPv6 di dalam Docker network. **Solusi**: Proses diulang, yang mana pada percobaan kedua berhasil terselesaikan dengan baik.
2. **NPM Dependency Conflict (ERESOLVE)**: Terdapat bentrokan versi antara Vite ^8 dan plugin `@vitejs/plugin-react` yang membutuhkan Vite ^7. **Solusi**: Instalasi dilanjutkan menggunakan argumen `--legacy-peer-deps` untuk membiarkan NPM menggunakan resolusi *legacy* dan mencegah build gagal.
3. **Nginx ke PHP-FPM (502 Bad Gateway)**: Nginx tidak dapat meneruskan *request* `fastcgi_pass` ke `app:9000` karena image `simokip-app` awal (diinstruksikan dengan command CLI, bukan fpm). **Solusi**: Nginx diubah menggunakan konfigurasi `proxy_pass http://app:8000;` yang me-*reverse proxy* langsung ke server artisan bawaan Laravel. Konfigurasi ini menjamin aplikasi dapat diakses tanpa perlu mengganti base image PHP CLI yang dipakai dalam docker environment saat ini.

## Kesimpulan
Fase 1 telah selesai secara menyeluruh. Proyek kini memiliki *baseline* yang solid dengan struktur tabel yang lengkap, environment React+Inertia.js yang telah terkonfigurasi beserta *dependencies* UI (shadcn/ui), dan alur autentikasi/otorisasi yang ketat menggunakan RBAC serta fitur proteksi keamanan password (wajib ganti).

Selanjutnya, proyek siap untuk beralih ke **Fase 2: Modul Manajemen Pengguna & Mahasiswa**.
