# Roadmap Pengerjaan Sistem Monitoring KIP Kuliah ITG

Berdasarkan analisis dokumen HLR, hasil wawancara, dan spesifikasi SRS, pengerjaan proyek ini akan menggunakan pendekatan metodologi **Rapid Application Development (RAD)** dengan target operasional (MVP) dalam **kurang lebih satu bulan (4 minggu)** untuk mahasiswa angkatan 2026. 

Berikut adalah roadmap pengerjaan yang disusun secara sistematis agar dapat langsung dijadikan acuan (*backlog*) pengembangan dengan tech stack: **Laravel, React, Inertia.js, dan MySQL**.

---

## FASE 1: Inisialisasi Proyek & Sistem Autentikasi (Minggu ke-1)

**Tujuan Tahap:** 
Membangun fondasi dasar aplikasi, arsitektur *routing*, koneksi database, dan sistem login (Autentikasi & Otorisasi) yang mengunci hak akses pengguna.

* **Pekerjaan yang Dilakukan:**
  1. Setup *environment* lokal, instalasi Laravel, konfigurasi database MySQL, dan instalasi *package* Inertia.js (React).
  2. Pembuatan skema *migration* database secara lengkap berdasarkan desain SRS (tabel `users`, `students`, `system_settings`, dll.).
  3. Pembuatan *Seeder* untuk data konfigurasi dasar (System Settings seperti threshold IPK) dan akun Super Admin *default*.
  4. Pengembangan fitur Login, *Logout*, dan modul ganti *password* wajib bagi pengguna baru.
  5. Konfigurasi Role-Based Access Control (RBAC) *Middleware* untuk pemisahan *routing* (Admin, Mahasiswa, Prodi, Warek 3).
* **Output / Deliverable:** 
  - Struktur dasar proyek (Laravel + Inertia + React).
  - Halaman login berfungsi penuh.
  - Mahasiswa yang pertama kali masuk otomatis diarahkan ke form ganti *password*.
* **Dependency:** Tidak ada. Ini adalah pondasi mutlak.
* **Prioritas:** **Tinggi (Kritis)**
* **Teknologi/Tools:** Laravel (Breeze/Jetstream atau custom Auth), Inertia.js, React, MySQL.

---

## FASE 2: Modul Data Master Mahasiswa & Akademik (Minggu ke-1 & 2)

**Tujuan Tahap:** 
Mengelola data utama mahasiswa (pembuatan akun berbasis SK) dan melengkapi rekam jejak akademik per semester (IPK & Prestasi/Organisasi).

* **Pekerjaan yang Dilakukan:**
  1. **[Super Admin]** Form input data SK KIP, NIM, Angkatan, dan Kategori (Reguler/Aspirasi). Saat form di-submit, sistem akan *auto-generate* akun Mahasiswa.
  2. **[Admin]** Pengaturan konfigurasi buka/tutup kalender "Jendela Input Nilai" (mengikuti kalender akademik ITG).
  3. **[Mahasiswa]** Form pengisian capaian akademik (IPK) tiap semester yang terintegrasi dengan validasi jadwal.
  4. **[Mahasiswa]** Form *upload* prestasi dan keaktifan organisasi.
  5. Pembuatan halaman daftar riwayat akademik untuk diakses *(read-only)* oleh Prodi sesuai fakultas/jurusannya.
* **Output / Deliverable:** 
  - Admin dapat mendaftarkan/meng-*onboarding* mahasiswa penerima KIP.
  - Mahasiswa dapat melakukan input IPK, prestasi, dan organisasi di dalam rentang jadwal aktif.
* **Dependency:** Membutuhkan **Fase 1** selesai (karena butuh *session login* dan struktur tabel user/student).
* **Prioritas:** **Tinggi (MVP)**
* **Teknologi/Tools:** React (Form handling, Formik/React-Hook-Form), Laravel (Eloquent relationships, Form Validation).

---

## FASE 3: Manajemen Dokumen Kewajiban & Validasi (Minggu ke-2)

**Tujuan Tahap:** 
Memastikan seluruh persyaratan fisik administratif mahasiswa KIP-K (MABIM, KKN, KP, dsb.) terunggah ke sistem dan berubah menjadi Arsip Digital ("Drive Pribadi").

* **Pekerjaan yang Dilakukan:**
  1. **[Mahasiswa]** Antarmuka (UI) unggah file dokumen wajib berformat Gambar/PDF.
  2. **[Mahasiswa]** UI *Drive Pribadi* untuk melihat/men-download seluruh sertifikat yang telah diunggah dan tervalidasi.
  3. **[Super Admin]** Dashboard *To-Do-List* Dokumen yang "Menunggu Validasi".
  4. **[Super Admin]** Antarmuka pratinjau *(preview)* dokumen, disertai tombol *Approve* (Setuju) atau *Reject* (Tolak dengan input alasan penolakan).
* **Output / Deliverable:** 
  - Alur dua arah: Mahasiswa unggah, Admin menyetujui/menolak.
  - Status tiap dokumen dapat dilacak (*pending, approved, rejected*).
* **Dependency:** Bergantung pada data Mahasiswa di **Fase 2**.
* **Prioritas:** **Tinggi (MVP)**
* **Teknologi/Tools:** Sistem *File Storage* Laravel (`storage:link`), React (File *previewer* / UI Upload dengan *progress bar*).

---

## FASE 4: Sistem Peringatan (SP) Berjenjang (Minggu ke-3)

**Tujuan Tahap:** 
Mengotomasikan pengawasan kepatuhan *Surat Perjanjian KIP-K* baik dari sisi capaian IPK, maupun teguran kode etik (pelanggaran manual).

* **Pekerjaan yang Dilakukan:**
  1. **[Sistem/Admin]** Pembuatan *Logic/Script* yang secara otomatis menyoroti IPK mahasiswa jika di bawah batas minimum (*threshold*).
  2. **[Super Admin]** UI/UX penerbitan Surat Peringatan (SP 1, SP 2, SP 3). Form input alasan spesifik jika pelanggaran bersifat non-akademik (seperti cuti tanpa alasan medis).
  3. **[Sistem]** Logika *Grace Period*: Menunda eskalasi SP (memberikan waktu masa perbaikan 1 semester).
  4. **[Mahasiswa]** Panel Notifikasi (*Alert Banner* berwarna merah mencolok) di halaman *dashboard* mahasiswa saat SP diterbitkan.
  5. **[Sistem]** Penonaktifan *trigger* akun otomatis secara permanen jika mahasiswa telah mencapai batas "SP 3".
* **Output / Deliverable:** 
  - Mahasiswa yang tidak patuh (akademik maupun etik) ter-monitor dan mendapatkan notifikasi SP resmi di akun mereka.
* **Dependency:** Bergantung pada nilai IPK di **Fase 2** dan konfigurasi master dari **Fase 1**.
* **Prioritas:** **Tinggi (MVP - Inti Bisnis)**
* **Teknologi/Tools:** Laravel (Jobs/Schedule/Events & Observers untuk mendeteksi trigger status SP), UI React (TailwindCSS alerts).

---

## FASE 5: Persetujuan Bebas Tanggungan & Modul Pelaporan (Minggu ke-3 & 4)

**Tujuan Tahap:** 
Memfasilitasi fitur penutupan/kelulusan studi melalui *approval* Bebas Tanggungan dan pelaporan utuh (*Reporting*) ke jajaran Pimpinan (Warek 3).

* **Pekerjaan yang Dilakukan:**
  1. **[Mahasiswa]** Tombol pengajuan "Bebas Tanggungan" aktif apabila mencapai semester 8 dan semua dokumen wajib `approved`.
  2. **[Super Admin]** UI memverifikasi dan menyetujui (Approve) Bebas Tanggungan.
  3. **[Sistem]** Pembuatan fungsi *Generate* dokumen PDF (Surat Bebas Tanggungan ber-QR Code).
  4. **[Super Admin & Prodi]** Dashboard statistik grafikal: Jumlah mahasiswa aktif per prodi, angkatan, kategori (Reguler/Aspirasi). 
  5. **[Super Admin]** Modul rekap laporan semesteran dengan fitur *Export* ke format Excel & PDF.
  6. **[Warek 3]** UI Otentikasi Warek 3 untuk memberikan e-Signature (*Approval Barcode*) terhadap laporan yang diajukan oleh Biro Kemahasiswaan.
* **Output / Deliverable:** 
  - Surat PDF Bebas Tanggungan sebagai syarat sah sidang akhir.
  - Statistik monitoring (dashboard) dan Laporan Semester final yang sudah disahkan Warek 3.
* **Dependency:** Bergantung pada seluruh proses **Fase 2, 3, & 4** telah selesai dikerjakan agar data *report* akurat.
* **Prioritas:** **Sedang-Tinggi** (Untuk MVP Angkatan 2026 pelaporan sangat krusial, namun bebas tanggungan belum dipakai secara *real-time* hingga 4 tahun ke depan).
* **Teknologi/Tools:** `barryvdh/laravel-dompdf` (Generate PDF), Laravel Excel / `maatwebsite/excel`, Recharts / Chart.js (Untuk UI Dashboard React), library QR Code generator.

---

## FASE 6: UAT (User Acceptance Testing) & Deployment (Minggu ke-4)

**Tujuan Tahap:** 
Menguji kelayakan fungsional (*testing*), memperbaiki *bug* terakhir, dan menaikkan sistem ke lingkungan *server/production*.

* **Pekerjaan yang Dilakukan:**
  1. Melakukan pengujian internal (QA) terhadap setiap Use Case dari ujung ke ujung (*End-to-End Testing*).
  2. *Deployment* aplikasi (Backend & Frontend) ke server *hosting* yang sudah dikoordinasikan dengan tim IT (USI/LSIPD).
  3. Demonstrasi prototipe akhir kepada Biro Kemahasiswaan (Pak Encep) untuk memperoleh *Approval* peluncuran (*ACC* mutlak).
  4. Penyesuaian/revisi minor UI (jika ada *feedback* RAD).
  5. Pelatihan penggunaan (*training*) sistem kepada admin ITG.
* **Output / Deliverable:** 
  - Aplikasi *live*, stabil, bebas bug mayor, dan dapat diakses publik/mahasiswa ITG angkatan 2026.
* **Dependency:** Membutuhkan koordinasi ketersediaan server dari USI/LSIPD (Risiko HLR no. 8). Seluruh sistem Fase 1-5 *code freeze*.
* **Prioritas:** **Tinggi (Mutlak)**
* **Teknologi/Tools:** Git (Version Control), SSH, Nginx/Apache, integrasi CI/CD (opsional), PHPUnit/Pest (Unit Testing).

---
*Roadmap ini berlaku mengikat untuk proses pengembangan dengan fokus pengerjaan bertahap sesuai urutan. Jika ada prioritas teknis yang mendesak, penyesuaian hari/minggu dapat diakomodir atas persetujuan Product Owner (Kemahasiswaan).*
