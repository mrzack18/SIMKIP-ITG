# Laporan Fase 2: Full Frontend Development (FE-First)

## 1. Daftar Task Fase 2
Seluruh *task* pada Fase 2 telah berhasil diselesaikan, yang mencakup pembuatan kerangka dasar antarmuka, *layouting* dinamis, perancangan seluruh halaman berbasis role (Admin, Mahasiswa, Prodi, Warek 3), dan integrasi statis dengan *mock data*.
Status: **SELESAI (100%)**.

## 2. Pekerjaan yang Dilakukan
Sesuai dengan pendekatan *FE-First*, pekerjaan difokuskan sepenuhnya pada lapisan *View* (React & Inertia). Kami tidak melakukan koneksi/query tabel MySQL pada tahap ini. Data statis (*mock data*) dikirim melalui *route* Laravel langsung ke setiap halaman agar *prototype* ini dapat meniru pengalaman produksi (*Production-like Experience*).

### 2.1 Fitur yang Berhasil Dibuat
- **Sistem Navigasi Dinamis:** Menulis ulang komponen `AuthenticatedLayout.jsx` menjadi layout modern yang memisahkan *Sidebar* kiri dan *Topbar* atas. Menu *sidebar* merespons tipe `role` yang dimiliki user yang sedang *login*.
- **Komponen UI Dasar:** Implementasi komponen standar terinspirasi *shadcn/ui* yang terdiri dari: `Button`, `Card`, `Input`, `Label`, `Select`, `Table`, `Badge`, dan `Alert`.
- **Integrasi Animasi:** Menggunakan ekosistem `framer-motion` untuk memberikan transisi halus (animasi mikro) antar tabel dan *alert* pemberitahuan.
- **Rute Frontend Mock:** Konfigurasi `web.php` untuk merender 12 halaman berbeda dan menginjeksi struktur *array* kosong yang merepresentasikan *database*.

### 2.2 Halaman/Komponen yang Dibuat
1. **Admin / Super Admin:**
   - `Admin/Dashboard/Index`: Dasbor statistik metrik (jumlah mahasiswa, sebaran jalur pendaftaran, antrean SP).
   - `Admin/Student/Index`: Halaman manajemen *(CRUD)* Mahasiswa (termasuk modal pop-up tambah data menggunakan `Modal.jsx`).
   - `Admin/Document/Validation`: Antrean validasi sertifikat, disertai layout layar pratinjau dokumen dan kolom alasan penolakan dokumen.
   - `Admin/WarningLetter/Index`: Sistem peringatan (SP) dengan tombol *trigger* SP otomatis maupun manual.
   - `Admin/Report/Index`: Riwayat persetujuan dokumen laporan akhir yang ditujukan kepada pimpinan.
   - `Admin/Settings/Index`: Form setelan *threshold* IPK batas bawah dan jendela buka-tutup sistem input.
2. **Mahasiswa:**
   - `Student/Dashboard/Index`: *Dashboard* khusus untuk notifikasi SP (dengan warna mencolok merah peringatan) dan pratinjau singkat akademik.
   - `Student/Academic/Index`: Tabel penyerahan form IPK dan upload tambahan dokumen bukti akademik/prestasi.
   - `Student/Document/Index`: Modul *Drive Pribadi* dengan susunan tabel *Grid* status 5 dokumen wajib lulus.
   - `Student/Clearance/Index`: Mekanisme validasi prasyarat (Semester 8, Dokumen Lengkap, Tidak ada SP) untuk cetak PDF Bebas Tanggungan.
3. **Prodi & Warek 3:**
   - `Prodi/Dashboard/Index` & `Prodi/Student/Index`: Tampilan hanya-baca (Read-Only).
   - `Warek3/Dashboard/Index` & `Warek3/Report/Approval`: Papan khusus pengesahan dokumen.

### 2.3 File yang Berubah & Dibuat
- **Ubah:** `resources/js/Layouts/AuthenticatedLayout.jsx` (Total rewrite untuk Sidebar).
- **Ubah:** `routes/web.php` (Penambahan puluhan *route endpoint* palsu Inertia).
- **Baru:** Seluruh folder di `resources/js/Components/ui/*` (`button.jsx`, `card.jsx`, `input.jsx`, `label.jsx`, `table.jsx`, dll).
- **Baru:** Seluruh folder di `resources/js/Pages/Admin/*`, `Student/*`, `Prodi/*`, `Warek3/*`.

### 2.4 Hasil Testing & Verifikasi
- **Validasi Build:** Uji kompilasi *Vite* dilakukan via eksekusi `docker compose exec -T node npm run build`. Seluruh 3000+ *modules* dan kode JSX/Tailwind berhasil ter- *build* secara sukses (*compiled into dist assets*) tanpa *error dependency*.
- **Kendala yang Ditemukan:** Perintah kompilasi *node* via root tidak memiliki *permission* memadai karena lingkungan VPS/Sandbox (EACCES di `node_modules/.vite-temp`).
- **Solusi/Perbaikan:** Kami merutekan ulang pengujian kompilasi *build* secara aman langsung melalui layanan kontainer Docker *node* bawaan sistem (*Sail/Docker Compose*) sehingga menjamin kesesuaian antara mesin pengembang dengan server penempatan akhir.

### 2.5 Daftar Rute (Routes) Simulasi
Agar Anda dapat meninjau hasil pratinjau halaman secara manual dari *browser*, berikut adalah daftar jalur (*routes*) yang telah dikonfigurasi dan dipasangkan *mock data* pada file `routes/web.php`:

**Rute Utama (Dinamis Berdasarkan Role yang Login):**
- `/dashboard` (Di-*redirect* internal ke Dasbor Admin/Mahasiswa/Prodi/Warek 3 tergantung role user)

**Rute Super Admin / Admin:**
- `/admin/students` : Halaman Daftar & Tambah Mahasiswa
- `/admin/documents` : Halaman Antrean Validasi Dokumen Wajib
- `/admin/warnings` : Halaman Deteksi IPK Rendah & Riwayat SP
- `/admin/reports` : Halaman Rekap Laporan & Bebas Tanggungan
- `/admin/settings` : Halaman Pengaturan (Threshold IPK & Jadwal)

**Rute Mahasiswa:**
- `/student/academic` : Halaman Input Nilai IPK & Prestasi
- `/student/documents` : Halaman Drive Pribadi & Unggah Dokumen Wajib
- `/student/clearance` : Halaman Pengajuan Bebas Tanggungan Akademik

**Rute Prodi & Warek 3:**
- `/prodi/students` : Halaman Read-Only Daftar Akademik Mahasiswa
- `/warek3/reports` : Halaman Persetujuan/E-Signature Laporan

## 3. Kesimpulan
Semua alur sistem dari ujung-ke-ujung (End-to-End) kini telah memiliki visualisasi utuh (Prototipe MVP). Pendekatan *FE-First* sukses mensimulasikan seluruh layar aplikasi sesuai kebutuhan *Product Owner* yang diminta dalam SRS sebelum kita memasuki *Logic Backend* MySQL.

**FASE 2: SELESAI**
