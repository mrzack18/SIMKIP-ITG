# Software Requirements Specification (SRS)
**Sistem Monitoring Mahasiswa KIP Kuliah — Institut Teknologi Garut (ITG)**

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen Software Requirements Specification (SRS) ini bertujuan untuk mendefinisikan secara rinci kebutuhan perangkat lunak untuk **Sistem Monitoring Mahasiswa KIP Kuliah Institut Teknologi Garut (ITG)**. Dokumen ini disusun berdasarkan analisis komparatif antara dokumen High-Level Requirements (HLR) dan transkrip wawancara dengan Bapak Encep (Pengelola KIP-Kuliah / Biro Kemahasiswaan ITG). SRS ini akan menjadi acuan utama bagi tim pengembang (developer) dalam proses perancangan, implementasi, dan pengujian sistem.

### 1.2 Latar Belakang & Permasalahan Saat Ini (As-Is)
Saat ini, pengelolaan dan evaluasi mahasiswa penerima KIP Kuliah (KIP-K) di ITG masih dilakukan secara **manual**. Permasalahan utama yang ditemukan meliputi:
- **Data Tercecer:** Data mahasiswa, termasuk dokumen Surat Keputusan (SK), prestasi, keaktifan organisasi, dan sertifikat kegiatan, tidak tersimpan secara terpusat.
- **Kesulitan Audit & Pelacakan:** Biro Kemahasiswaan kesulitan melakukan pemeriksaan menyeluruh per angkatan, melacak riwayat mahasiswa yang mengundurkan diri, maupun mahasiswa yang masa studinya telah melebihi batas 8 semester.
- **Kehilangan Dokumen Mahasiswa:** Mahasiswa sering kehilangan sertifikat fisik (MABIM, KKN, KP, dll.) yang sangat dibutuhkan sebagai syarat sidang akhir maupun pembuatan Surat Keterangan Pendamping Ijazah (SKPI).
- **Pemantauan SP Tidak Terstruktur:** Evaluasi kepatuhan terhadap Surat Perjanjian KIP-K dan penerbitan Surat Peringatan (SP) masih mengandalkan pendataan manual, sehingga rentan terjadi kelalaian.

### 1.3 Tujuan Bisnis & Proses yang Diharapkan (To-Be)
Sistem ini diharapkan akan mendigitalisasi dan mengotomatisasi proses evaluasi menjadi satu pintu (*single source of truth*), dengan tujuan:
- **Integrasi Data & Rekam Jejak:** Seluruh capaian akademik (IPK) dan non-akademik (prestasi, organisasi) mahasiswa terekam rapi setiap semester.
- **Monitoring yang Proaktif:** Sistem dapat membantu memantau dan memicu Surat Peringatan (SP) secara berjenjang apabila terjadi pelanggaran akademik/non-akademik.
- **Arsip Digital (Drive Pribadi):** Sistem menjadi tempat penyimpanan aman bagi sertifikat mahasiswa, mempermudah persyaratan kelulusan dan penyusunan SKPI.
- **Kontrol Kelulusan:** Penerapan validasi "Bebas Tanggungan" melalui sistem sebelum mahasiswa diizinkan mengikuti sidang akhir.

---

## 2. Analisis HLR vs Hasil Wawancara (Konflik & Identifikasi)

Setelah dilakukan perbandingan antara `HLR_Sistem_Monitoring_KIP_Kuliah_ITG.md` dan `wawancara kemahasiswaan(1).docx`, HLR sudah sangat representatif dan akurat merangkum wawancara. Namun, terdapat beberapa poin yang perlu mendapat perhatian khusus (klarifikasi) sebelum implementasi final:

1. **Ambang Batas IPK (IPK Threshold):** 
   - *Wawancara:* Pewawancara memberi contoh < 2.75, namun narasumber (Pak Encep) mengilustrasikan "turun jadi 2.8, aturannya kan 3.0, itu SP 1".
   - *Analisis/Tindakan:* Karena aturan dapat berubah, nilai threshold **3.0** tidak boleh di-*hardcode* di dalam kode. Harus dibuatkan pengaturan (Settings/Config) di dalam tabel database (misalnya tabel `system_settings`) yang dapat diubah oleh Super Admin.
2. **Entitas "BKKH":**
   - *Wawancara:* Narasumber menyebutkan pihak yang meng-*approve* adalah "BKKH aja... dari kemahasiswa pengelola KIP".
   - *Analisis/Tindakan:* BKKH tampaknya merupakan singkatan struktural internal di ITG (kemungkinan Biro Kemahasiswaan dan Karir Alumni/sejenisnya). Secara sistem, peran ini akan dipetakan ke dalam role **Super Admin (Biro Kemahasiswaan)**.
3. **Pemisahan Reguler vs Aspirasi:**
   - *Wawancara:* Narasumber menekankan pentingnya pelaporan yang memisahkan "Reguler" dan "Aspirasi" untuk kebutuhan audit BPK/Inspektorat.
   - *Analisis/Tindakan:* Kategori ini mutlak harus menjadi kolom (enum/foreign key) di tabel `students`.
4. **Bentuk Dokumen Bebas Tanggungan:**
   - *Wawancara:* Tidak spesifik menyebutkan format akhir (apakah PDF yang di-generate sistem ber-barcode atau sekadar status di layar).
   - *Analisis/Tindakan:* Sistem akan dirancang untuk men-generate dokumen PDF ber-barcode/QR code agar sah dan dapat di-print mahasiswa sebagai syarat lampiran sidang.

---

## 3. Stakeholder & Aktor Sistem

### 3.1 Stakeholder
1. **Biro Kemahasiswaan ITG (Bpk. Encep & Tim):** Pemilik produk (Product Owner), pihak yang menyetujui requirement, dan pengguna utama (Super Admin).
2. **Wakil Rektor III (Warek 3):** Pimpinan yang membutuhkan laporan evaluasi dan memberikan otorisasi akhir.
3. **USI / LSIPD ITG:** Tim infrastruktur IT kampus yang akan menyiapkan server dan hosting.
4. **BPK & Inspektorat:** Pihak auditor eksternal yang kepentingannya diakomodasi melalui fitur dashboard dan pelaporan (Reguler vs Aspirasi).

### 3.2 Aktor Sistem & Kebutuhan Hak Akses

| Aktor Sistem | Deskripsi & Kebutuhan Hak Akses |
|---|---|
| **Super Admin (Kemahasiswaan)** | Akses penuh. Menginput SK & NIM, validasi dokumen, terbitkan SP, *approve* bebas tanggungan, hapus data (dengan konfirmasi), kelola laporan, dan konfigurasi master data (threshold IPK, kalender input). |
| **Mahasiswa (Penerima KIP-K)** | Akses terbatas pada datanya sendiri. Wajib ubah password *default*. Menginput nilai IPK, prestasi, keaktifan; mengunggah sertifikat; melihat notifikasi SP; dan mengajukan serta mengunduh surat Bebas Tanggungan. |
| **Prodi (Program Studi)** | Akses *Read-Only* (Viewer). Hanya dapat melihat dashboard dan rekam jejak mahasiswa yang berada di lingkup Prodinya sendiri, serta dapat mengekspor laporan Prodinya. |
| **Warek 3 (Wakil Rektor III)** | Akses *Approver*. Menyetujui (digital signature/barcode) laporan resmi evaluasi semesteran yang diajukan oleh Kemahasiswaan. |

---

## 4. Kebutuhan Sistem (System Requirements)

### 4.1 Kebutuhan Fungsional (Functional Requirements)

Aplikasi akan dikembangkan menggunakan **Laravel (Backend), React (Frontend), dan Inertia.js (Penghubung).** Kebutuhan fungsional dibagi menjadi beberapa modul:

#### Modul 1: Autentikasi & Manajemen Akun
- **FR-1.1:** Sistem harus memungkinkan Super Admin membuat akun Mahasiswa berbasis NIM dan Nomor SK.
- **FR-1.2:** Sistem harus men-generate *default password* dan memaksa Mahasiswa untuk mengganti password pada saat login pertama kali.
- **FR-1.3:** Sistem harus mengunci akses login Mahasiswa jika statusnya dinonaktifkan (karena Drop/SP3 atau Lulus).

#### Modul 2: Manajemen Data Akademik & Non-Akademik
- **FR-2.1:** Sistem harus menyediakan form bagi Mahasiswa untuk menginput nilai IPK per semester pada jendela waktu (periode) yang dibuka oleh Admin.
- **FR-2.2:** Sistem harus menyediakan fitur *upload* bukti sertifikat prestasi dan keaktifan organisasi (file gambar/PDF).
- **FR-2.3:** Sistem harus membedakan Mahasiswa berdasarkan kategori `Reguler` dan `Aspirasi`.
- **FR-2.4:** Sistem menyediakan fitur bagi Admin untuk mencatat "Informasi Pribadi" Mahasiswa (Catatan Anggaran & Permasalahan) secara rahasia (hanya bisa dilihat Admin).

#### Modul 3: Manajemen Dokumen (Kewajiban Kewarganegaraan & Akademik)
- **FR-3.1:** Sistem harus memungkinkan Mahasiswa mengunggah dokumen wajib (MABIM, KKN, KP, Skripsi, Bela Negara).
- **FR-3.2:** Sistem harus memiliki *status tracking* untuk setiap dokumen: `Menunggu Validasi`, `Disetujui`, atau `Ditolak/Revisi`.
- **FR-3.3:** Admin dapat memberikan validasi (Approve/Reject) beserta kolom catatan (opsional) atas dokumen yang ditolak.
- **FR-3.4:** Dokumen yang divalidasi akan menjadi Arsip Digital ("Drive Pribadi") yang bisa diunduh kapan saja oleh Mahasiswa.

#### Modul 4: Sistem Peringatan (Surat Peringatan - SP)
- **FR-4.1:** Sistem dapat menyoroti Mahasiswa yang IPK-nya berada di bawah standar (*threshold dinamis*) sebagai rekomendasi penerbitan SP1.
- **FR-4.2:** Admin dapat mengeksekusi penerbitan SP (1, 2, atau 3) baik karena alasan akademik maupun non-akademik secara manual melalui sistem.
- **FR-4.3:** Sistem memberikan *alert* merah di dashboard Mahasiswa jika mereka menerima SP, beserta rincian alasannya.
- **FR-4.4:** Sistem menerapkan *grace period* (masa tenggang) 1 semester untuk mahasiswa dengan status SP1 atau SP2 memperbaiki nilai IPK-nya.

#### Modul 5: Approval Bebas Tanggungan
- **FR-5.1:** Mahasiswa dapat menekan tombol "Ajukan Bebas Tanggungan" pada semester akhir (ke-8).
- **FR-5.2:** Admin melakukan pengecekan kelengkapan data historis dan dokumen sebelum menekan "Approve".
- **FR-5.3:** Jika di-approve, sistem menghasilkan dokumen PDF Surat Keterangan Bebas Tanggungan ber-QR Code untuk diunduh Mahasiswa.

#### Modul 6: Laporan, Dashboard, & Monitoring
- **FR-6.1:** Dashboard Admin menampilkan statistik: Total Mahasiswa KIP aktif, Sebaran per Prodi, Sebaran per Angkatan, dan Komparasi Kategori (Reguler vs Aspirasi).
- **FR-6.2:** Sistem dapat mengekspor laporan evaluasi per semester dalam format Excel/PDF (memuat NIM, Nama, IPK, Sanksi, Prestasi).
- **FR-6.3:** Modul e-Signature: Admin mengajukan laporan -> disetujui (di-klik/barcode) oleh Warek 3 -> Laporan siap cetak final.

### 4.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **NFR-1 (UI/UX):** Menggunakan React & Inertia.js untuk menciptakan *Single Page Application (SPA)* yang responsif, *seamless* tanpa *page reload*, dan intuitif.
- **NFR-2 (Keamanan):** Penggunaan CSRF Protection bawaan Laravel. File dokumen rahasia di-store di direktori yang tidak *publicly accessible* (via *storage:link* dengan middleware otorisasi).
- **NFR-3 (Performa):** Query database menggunakan *Eager Loading* Eloquent untuk mencegah *N+1 query problem* saat menampilkan riwayat data mahasiswa.
- **NFR-4 (Audit Trail):** Semua aktivitas kritikal (Terbitkan SP, Approve Dokumen, Hapus Data) wajib dicatat dalam tabel `audit_logs` (NIM, Aksi, Waktu, Oleh Siapa).

---

## 5. Business Rules Utama

- **BR-1:** Pendaftaran Mahasiswa KIP-K dilakukan di luar sistem. Mahasiswa masuk sistem ini hanya setelah memiliki NIM dan SK Penetapan.
- **BR-2:** Mahasiswa dilarang mengambil cuti akademik (kecuali alasan sakit). Cuti tanpa izin = SP3 (Pemberhentian Langsung).
- **BR-3:** Ambang batas IPK evaluasi disesuaikan dengan Surat Perjanjian KIP-K (default referensi = 3.0).
- **BR-4:** Tidak ada fitur hapus data (Delete) untuk peran Mahasiswa dan Prodi. Hapus data hanya oleh Super Admin dengan mekanisme *Soft Deletes* (Laravel) dan pop-up konfirmasi.
- **BR-5:** Jadwal Input Nilai IPK dikonfigurasi mengikuti kalender akademik (± 2 minggu setelah UAS), tidak dibuka terus-menerus.

---

## 6. Skenario Use Case Utama

1. **UC-1: Validasi Dokumen.** 
   - *Aktor:* Super Admin
   - *Alur:* Admin melihat daftar "Menunggu Validasi" -> Klik detail mahasiswa -> Lihat file dokumen -> Klik 'Setuju' atau 'Tolak' (dengan input alasan).
2. **UC-2: Monitoring & SP.** 
   - *Aktor:* Super Admin, Mahasiswa
   - *Alur:* Sistem menampilkan IPK semester berjalan < 3.0 -> Admin verifikasi ulang -> Admin terbitkan SP1 -> Mahasiswa menerima notifikasi merah di dashboard -> Akses masa tenggang 1 semester dimulai.
3. **UC-3: Cetak Bebas Tanggungan.** 
   - *Aktor:* Mahasiswa, Super Admin
   - *Alur:* Mahasiswa melengkapi 8 semester dan semua dokumen wajib tervalidasi -> Mahasiswa klik "Ajukan" -> Admin memeriksa tidak ada tanggungan SP/Masalah -> Admin klik "Approve" -> Mahasiswa men-download PDF.

---

## 7. Kebutuhan Data & Basis Data (MySQL)

Berdasarkan arsitektur Laravel, berikut adalah rancangan entitas tabel utama:

1. **`users`** (Tabel Autentikasi Induk)
   - Kolom: `id`, `name`, `username/nim`, `password`, `role` (enum: superadmin, mahasiswa, prodi, warek3), `prodi_id` (nullable).
2. **`students`**
   - Kolom: `id`, `user_id`, `nim`, `sk_number`, `sk_date`, `angkatan`, `category` (enum: reguler, aspirasi), `status` (enum: aktif, lulus, dicabut).
3. **`academic_records`** (Input IPK & Evaluasi)
   - Kolom: `id`, `student_id`, `semester`, `ipk`, `academic_year`.
4. **`achievements_organizations`** (Prestasi & Organisasi)
   - Kolom: `id`, `student_id`, `type` (enum: prestasi, organisasi), `name`, `file_path`.
5. **`mandatory_documents`** (Kewajiban: MABIM, KKN, dll)
   - Kolom: `id`, `student_id`, `document_type` (enum: mabim, kkn, kp, skripsi, bela_negara), `file_path`, `status` (enum: pending, approved, rejected), `admin_notes`.
6. **`warning_letters`** (Surat Peringatan)
   - Kolom: `id`, `student_id`, `level` (enum: 1, 2, 3), `reason`, `issued_date`, `is_active`.
7. **`reports`** (Laporan Evaluasi Semester ke Warek 3)
   - Kolom: `id`, `letter_number`, `title`, `semester`, `academic_year`, `status` (enum: draft, pending_warek3, approved), `approved_at`, `approved_by`.
8. **`system_settings`** (Konfigurasi)
   - Kolom: `id`, `key` (misal: `min_ipk`, `ipk_input_start`, `ipk_input_end`), `value`.
9. **`audit_logs`**
   - Kolom: `id`, `user_id`, `action`, `description`, `created_at`.

---

## 8. Arsitektur Teknis & Implementasi

Sistem akan dikembangkan dengan prinsip modern *web development*:
1. **Backend (Laravel):** Menangani routing, logika bisnis, Eloquent ORM (relasi database), *middleware* otorisasi (RBAC), validasi *request*, dan pembuatan file PDF (menggunakan package seperti `barryvdh/laravel-dompdf`).
2. **Frontend (React.js):** Membangun komponen UI interaktif (Dashboard Charts dengan Recharts/Chart.js), tabel data (DataTables), form dinamis, dan *state management*.
3. **Inertia.js:** Menghilangkan kebutuhan untuk membangun API RESTful terpisah. Inertia memungkinkan rendering komponen React langsung dari *controller* Laravel secara mulus, memberikan pengalaman SPA tanpa kompleksitas *routing* sisi klien yang berat.
4. **Database (MySQL):** RDBMS yang handal untuk menyimpan struktur data relasional di atas.

---
*Dokumen ini bersifat final-draft dan dapat digunakan sebagai blueprint teknis (backlog) untuk pembuatan sistem.*
