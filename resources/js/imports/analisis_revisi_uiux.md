# Analisis Revisi UI/UX — SIMKIP-ITG (v2)
## Berdasarkan Transkrip Presentasi, Feedback Pak Encep, & Klarifikasi Tambahan

> Dokumen ini mengidentifikasi seluruh temuan dari presentasi UI/UX (file [revisi part 1.docx](file:///c:/laragon/www/SIMKIP-ITG/revisi%20part%201.docx)), membandingkan dengan implementasi UI/UX saat ini, dan menyusun rekomendasi perbaikan beserta prompt visualisasi yang diperlukan.

> [!IMPORTANT]
> **UPDATE v2 — 5 Klarifikasi Tambahan:**
> 1. ~~KKN ada sertifikat~~ → KKN adalah **mata kuliah**, bukan kegiatan bersertifikat → **dihapus dari dokumen kewajiban**
> 2. Selain input IPK, harus juga **input nilai per mata kuliah** (termasuk nilai mutu) → MK dengan nilai D/E = belum lulus
> 3. R-17 dikoreksi: alur = Mahasiswa **mengajukan permohonan** → Pengelola **mengecek kelayakan** → Pengelola **menerbitkan surat**
> 4. Semua kata **"KIP"** diganti menjadi **"KIP-K"** secara konsisten di seluruh sistem
> 5. Warna utama diganti dari **Navy (#1E3A5F)** menjadi **Biru Persib (#263F93)** dengan aksen kuning **#FFF200**

---

## BAGIAN 1: TEMUAN REVISI DARI TRANSKRIP PRESENTASI

### 1.1 Perubahan Terminologi & Penamaan

| # | Item | Kondisi Saat Ini | Revisi Diminta | Prioritas |
|---|---|---|---|---|
| R-01 | **Label role Admin** | `"Super Admin"` dan `"Admin"` | Harus diganti menjadi **"Pengelola KIP-K"** agar sesuai SK | 🔴 Tinggi |
| R-02 | **Nama fitur Bebas Tanggungan** | `"Bebas Tanggungan"` | Harus diganti menjadi **"Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K Kuliah"** | 🔴 Tinggi |
| R-03 | **Label "Grafik IPK"** | `"Tren IPK"` / `"Riwayat IPK per Semester"` | Ganti label menjadi **"Progres IPK"** atau **"Grafik IPK"** | 🟡 Sedang |
| R-04 | **Nama dokumen "MABIM"** | `"Sertifikat MABIM"` | Ganti menjadi **"PKKMB"** (Pengenalan Kehidupan Kampus Bagi Mahasiswa Baru) | 🔴 Tinggi |
| R-05 | **Nama dokumen "Laporan KP"** | `"Laporan Kerja Praktik"` | Ganti menjadi **"Berita Acara Kerja Praktik"** (bukti sidang KP, bukan draft laporan) | 🔴 Tinggi |
| R-06 | **Nama dokumen "Draft Skripsi"** | `"Draft Skripsi"` | Ganti menjadi **"Bukti Sidang Skripsi"** (bukti skripsi sudah selesai/disidangkan) | 🔴 Tinggi |
| R-31 | **Semua kata "KIP"** | `"KIP"` digunakan di banyak tempat | Ganti menjadi **"KIP-K"** secara konsisten di seluruh sistem | 🔴 Tinggi |
| R-32 | **Warna utama UI** | Navy `#1E3A5F` | Ganti menjadi **Biru Persib `#263F93`** dengan aksen kuning **`#FFF200`** | 🔴 Tinggi |

---

### 1.2 Perubahan Urutan Dokumen Kewajiban

> [!IMPORTANT]
> Pak Encep menekankan urutan kronologis yang benar sesuai perjalanan studi mahasiswa KIP-K.

> [!WARNING]
> **KOREKSI v2:** KKN adalah **mata kuliah biasa**, bukan kegiatan bersertifikat. KKN **dihapus** dari daftar dokumen kewajiban upload.

| # | Urutan Lama | Urutan Baru (Revisi v2) |
|---|---|---|
| 1 | Sertifikat MABIM | **PKKMB** (Sertifikat Pengenalan Kehidupan Kampus Bagi Mahasiswa Baru) |
| 2 | ~~Sertifikat KKN~~ | **Bela Negara** (Sertifikat keikutsertaan program Bela Negara) |
| 3 | Laporan Kerja Praktik | **MABIM** (Sertifikat Masa Bimbingan — berbeda dari PKKMB) |
| 4 | Draft Skripsi | **Berita Acara Kerja Praktik** (Bukti sidang KP) |
| 5 | Sertifikat Bela Negara | **Sertifikasi** ⭐ *(BARU — minimal 1 sertifikasi profesional wajib)* |
| 6 | *(tidak ada)* | **Bukti Sidang Skripsi** (Bukti skripsi telah disidangkan) |

> Total dokumen kewajiban: **6 dokumen** (bukan 7 — KKN dihapus karena mata kuliah)

---

### 1.3 Perubahan pada Halaman Prestasi (Mahasiswa)

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-07 | **Kategorisasi prestasi** | Level dropdown: Prodi/Universitas/Regional/Nasional/Internasional | Ubah menjadi **3 tab kategori**: Internasional, Nasional, Wilayah | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |
| R-08 | **Tanggal prestasi** | Hanya `tanggal` (input type month) | Ubah menjadi **Tanggal Mulai** dan **Tanggal Selesai** | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |
| R-09 | **Field "Juara"** | Tidak ada field khusus | Tambahkan field **"Juara ke-"** / **"Pencapaian"** | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |
| R-10 | **Field "Tempat"** | Tidak ada | Tambahkan field **"Tempat"** pelaksanaan kegiatan | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |
| R-11 | **Upload ganda** | Hanya 1 file upload (sertifikat) | Ubah menjadi **2 file upload**: Sertifikat/Piagam + Foto podium/kegiatan | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |
| R-12 | **Link penyelenggara** | Tidak ada | Tambahkan field **"Link Penyelenggara"** untuk pelaporan Simkat Mawa | [Prestasi.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Prestasi.tsx) |

---

### 1.4 Perubahan pada Halaman Input Nilai Semester (Mahasiswa)

> [!IMPORTANT]
> **REVISI BESAR v2:** Halaman ini tidak lagi hanya "Input IPK". Mahasiswa harus juga **menginput nilai per mata kuliah** (Kode MK, Nama MK, SKS, Nilai Huruf, Nilai Mutu). Dari sini sistem mendeteksi MK yang belum lulus (nilai D dan E).

#### Pendekatan yang Direkomendasikan: **Input Manual Terstruktur + Upload KHS sebagai Bukti**

> [!TIP]
> **Mengapa bukan upload transkrip PDF?**
> - Upload PDF + OCR/scan per mata kuliah terlalu kompleks secara teknis (harus parsing format yang berbeda-beda antar universitas/fakultas)
> - Rawan error dan butuh validasi manual ulang
> - Tidak bisa langsung menghitung atau mendeteksi masalah
>
> **Pendekatan hybrid yang direkomendasikan:**
> 1. Mahasiswa **input manual** daftar mata kuliah per semester di form terstruktur
> 2. Mahasiswa **upload KHS (PDF/foto)** sebagai bukti pendukung — ini hanya untuk verifikasi oleh Pengelola, bukan untuk data extraction
> 3. Sistem otomatis menghitung IPK dari data yang diinput dan menandai MK bernilai D/E sebagai "Belum Lulus"
> 4. Pengelola KIP-K memvalidasi kesesuaian input manual dengan KHS yang diupload

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-13 | **Input nilai mata kuliah** | ❌ Hanya input IPK (1 angka per semester) | ⭐ **TAMBAH**: Input tabel mata kuliah per semester: Kode MK, Nama MK, SKS, Nilai Huruf (A/B/C/D/E), Nilai Mutu (4.0/3.0/2.0/1.0/0.0). Sistem auto-hitung IPK. MK bernilai D/E = **belum lulus** dan otomatis masuk daftar "MK Belum Lulus". | [InputIPK.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/InputIPK.tsx) |
| R-33 | **Upload KHS sebagai bukti** | Upload KHS opsional | Upload KHS tetap ada sebagai **bukti pendukung** yang divalidasi Pengelola — bukan untuk data extraction | [InputIPK.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/InputIPK.tsx) |
| R-34 | **Daftar MK belum lulus (carry-over)** | ❌ Tidak ada | MK bernilai D/E dari semester sebelumnya yang belum diperbaiki otomatis muncul di semester baru. Jika sudah lulus, MK hilang dari daftar. | [InputIPK.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/InputIPK.tsx) |

---

### 1.5 Perubahan pada Halaman Profil (Mahasiswa)

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-14 | **Data profil lengkap** | Hanya: NIM, Nama, Prodi, Angkatan, Kategori, Status | Tambahkan: **Foto**, **Tanggal Lahir**, **Alamat Lengkap**, **Nama Ayah**, **Nama Ibu** | [Profil.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Profil.tsx) |
| R-15 | **Riwayat nomor kontak** | ❌ Tidak ada | ⭐ **TAMBAH FITUR BARU**: Nomor kontak dengan **riwayat perubahan** per semester | [Profil.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/student/Profil.tsx) |

---

### 1.6 Perubahan pada Surat Keterangan Penyelesaian (sebelumnya "Bebas Tanggungan")

> [!IMPORTANT]
> **KOREKSI v2 — Alur yang Benar (R-17):**
> 1. **Mahasiswa MENGAJUKAN** permohonan penerbitan surat ke Kemahasiswaan
> 2. **Pengelola KIP-K MENGECEK** apakah mahasiswa sudah layak (semua kewajiban terpenuhi)
> 3. Jika layak → **Pengelola MENERBITKAN** surat keterangan penyelesaian
> 4. Surat tersedia di akun mahasiswa untuk diunduh
>
> Jadi bukan murni admin-initiated, tapi **mahasiswa yang memulai pengajuan**, lalu pengelola yang memverifikasi dan menerbitkan.

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-16 | **Nama halaman & dokumen** | "Bebas Tanggungan" | Ganti menjadi **"Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K Kuliah"** | Semua file terkait |
| R-17 | **Alur pengajuan** | Mahasiswa mengajukan sendiri (langsung approve) | **Mahasiswa mengajukan** → **Pengelola mengecek kelayakan** → **Pengelola menerbitkan** surat | Semua file terkait |
| R-18 | **Isi surat** | Hanya status approval | Surat resmi: redaksi Pengelola KIP-K menerangkan mahasiswa telah menyelesaikan seluruh kewajiban, dengan rincian recap. TTD Pengelola KIP-K, diketahui Warek 3 | Semua file terkait |

---

### 1.7 Perubahan pada Dashboard Admin (Pengelola)

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-19 | **Label role** | "Super Admin" | Ganti ke **"Pengelola KIP-K"** | Semua referensi |
| R-20 | **Label stat cards** | "Mahasiswa KIP Reguler" / "Mahasiswa KIP Aspirasi" | Ganti menjadi **"KIP-K Reguler"** dan **"KIP-K Aspirasi"** | [Dashboard.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/admin/Dashboard.tsx) |
| R-21 | **Chart drill-down** | Chart per prodi dan per angkatan terpisah | Tambahkan interaktivitas drill-down | [Dashboard.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/admin/Dashboard.tsx) |
| R-22 | **Semester batas studi** | semester ≥ 7 | Koreksi: **semester > 8** (melebihi batas studi KIP-K) | [Dashboard.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/admin/Dashboard.tsx) |

---

### 1.8 Perubahan pada Surat Peringatan (Mahasiswa View)

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-23 | **Format SP** | Alert banner saja | SP harus berbentuk **surat resmi** dengan **nomor surat kemahasiswaan** dan detail alasan | Semua file SP |
| R-24 | **Riwayat SP** | Kurang detail | Riwayat SP harus ada **penjelasan detail** per SP | Semua file SP |

---

### 1.9 Perubahan pada Data Akademik Admin

| # | Item | Kondisi Saat Ini | Revisi Diminta | File Terkait |
|---|---|---|---|---|
| R-25 | **Data non-akademik** | Hanya ada "Data Akademik" | Tambahkan **"Data Non-Akademik"** (recap prestasi dan organisasi) | [DataAkademik.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/admin/DataAkademik.tsx) |

---

### 1.10 Perubahan Warna & Estetika

> [!IMPORTANT]
> **REVISI v2:** Bapak meminta warna diganti dari Navy menjadi **Biru Persib**.

| # | Item | Kondisi Saat Ini | Revisi Diminta |
|---|---|---|---|
| R-26 | **Warna primer** | Navy `#1E3A5F` | **Biru Persib `#263F93`** |
| R-32 | **Warna aksen** | Emas `#D4A843` | **Kuning Persib `#FFF200`** |

**Palette Baru:**

| Token | Lama | Baru | Penggunaan |
|---|---|---|---|
| `--primary` | `#1E3A5F` (Navy) | **`#263F93`** (Biru Persib) | Sidebar, tombol utama, header, badge aktif |
| `--primary-dark` | `#162D4A` | **`#1B2F73`** | Gradient bawah sidebar |
| `--accent` | `#D4A843` (Emas) | **`#FFF200`** (Kuning Persib) | Active nav, highlight, badge SP1, aksen |
| `--accent-hover` | - | **`#E6DA00`** | Hover state untuk aksen |

**Files yang perlu diubah warnanya:**
- [Sidebar.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/components/Sidebar.tsx) — gradient background, nav active color
- [Login.tsx](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/pages/Login.tsx) — hero panel gradient
- [index.css](file:///c:/laragon/www/SIMKIP-ITG/uiux/src/index.css) — CSS variables
- **Seluruh 35 halaman** — semua `style={{ background: "#1E3A5F" }}` dan referensi `#D4A843`

---

### 1.11 Perubahan pada Halaman Organisasi (Mahasiswa)

| # | Item | Kondisi Saat Ini | Revisi Diminta |
|---|---|---|---|
| R-27 | **Upload bukti** | 1 file upload | Bukti: **SK Kepengurusan** ✅ (sudah benar di implementasi) |
| R-28 | **Status validasi** | ✅ Sudah bagus | **Tidak ada perubahan** |

---

### 1.12 Perubahan pada Halaman Warek 3

| # | Item | Kondisi Saat Ini | Revisi Diminta |
|---|---|---|---|
| R-29 | **Fungsi Warek 3** | Approve laporan + lihat mahasiswa | ✅ Sudah sesuai — Warek 3 bisa melihat progres mahasiswa (view-only) |

---

### 1.13 Perubahan pada Laporan Semester

| # | Item | Kondisi Saat Ini | Revisi Diminta |
|---|---|---|---|
| R-30 | **Laporan per angkatan** | Laporan bersifat umum | Laporan harus bisa **dibuat per angkatan** |

---

## BAGIAN 2: ANALISIS KESENJANGAN (GAP ANALYSIS)

### 2.1 Fitur yang Belum Ada (Perlu Ditambah)

| # | Fitur Baru | Dampak | Halaman Terkait |
|---|---|---|---|
| GAP-01 | **Input Nilai Mata Kuliah per Semester** (termasuk nilai mutu) | Perlu UI baru: tabel input MK per semester (Kode MK, Nama MK, SKS, Nilai Huruf, Nilai Mutu), auto-hitung IPK, deteksi MK tidak lulus (D/E) | InputIPK.tsx |
| GAP-02 | **Daftar MK Belum Lulus** dengan carry-over antar semester | MK bernilai D/E dari semester sebelumnya otomatis muncul di semester baru | InputIPK.tsx |
| GAP-03 | **Riwayat Nomor Kontak** di halaman Profil | Daftar nomor HP dengan history perubahan per semester | Profil.tsx |
| GAP-04 | **Dokumen Sertifikasi** sebagai kewajiban baru | Penambahan item di daftar dokumen kewajiban | UploadDokumen.tsx, DokumenQueue.tsx, Konfigurasi.tsx |
| GAP-05 | **Tab/Halaman Data Non-Akademik** di admin | Recap prestasi dan organisasi seluruh mahasiswa | DataAkademik.tsx atau halaman baru |
| GAP-06 | **Foto profil mahasiswa** | Upload area di halaman profil | Profil.tsx, TambahMahasiswa.tsx |

### 2.2 Inkonsistensi Penamaan (Perlu Diperbaiki)

| # | Label Lama | Label Baru | File yang Harus Diubah |
|---|---|---|---|
| INC-01 | "Super Admin" / "Admin" | **"Pengelola KIP-K"** | Sidebar.tsx, Profil.tsx, Login.tsx, Layout.tsx, App.tsx, semua admin pages |
| INC-02 | "Bebas Tanggungan" | **"Surat Keterangan Penyelesaian"** | Sidebar.tsx, semua file terkait |
| INC-03 | "MABIM" (yang pertama) | **"PKKMB"** + MABIM tetap ada sebagai dokumen terpisah | UploadDokumen.tsx, DokumenQueue.tsx, dll |
| INC-04 | "Laporan Kerja Praktik" | **"Berita Acara Kerja Praktik"** | UploadDokumen.tsx |
| INC-05 | "Draft Skripsi" | **"Bukti Sidang Skripsi"** | UploadDokumen.tsx |
| INC-06 | "Tren IPK" | **"Progres IPK"** / **"Grafik IPK"** | InputIPK.tsx, student/Dashboard.tsx |
| INC-07 | "KIP" (tanpa K) | **"KIP-K"** | Seluruh 35+ file |
| INC-08 | ~~"Sertifikat KKN"~~ | **HAPUS** (KKN adalah mata kuliah) | UploadDokumen.tsx, DokumenQueue.tsx |
| INC-09 | `#1E3A5F` (Navy) | **`#263F93`** (Biru Persib) | Seluruh 35+ file |
| INC-10 | `#D4A843` (Emas) | **`#FFF200`** (Kuning Persib) | Seluruh 35+ file |

---

## BAGIAN 3: REKOMENDASI PERBAIKAN & PROMPT UI/UX REVISI

### P-01: Perubahan Terminologi Global

> [!IMPORTANT]
> Perubahan ini harus diterapkan di **seluruh file** secara konsisten.

**Daftar find & replace global:**

| Cari | Ganti Menjadi | Catatan |
|---|---|---|
| `Super Admin` | `Pengelola KIP-K` | Semua label role |
| `"Admin"` (sebagai label) | `"Pengelola KIP-K"` | Kecuali route path |
| `Bebas Tanggungan` | `Surat Penyelesaian` (sidebar) / `Surat Keterangan Penyelesaian` (halaman) | |
| `#1E3A5F` | `#263F93` | Warna primer Biru Persib |
| `#162D4A` | `#1B2F73` | Warna primer dark |
| `#D4A843` | `#FFF200` | Warna aksen Kuning Persib |
| `KIP Kuliah` | `KIP-K Kuliah` | Atau cukup `KIP-K` |
| `KIP-K` (sudah) | (biarkan) | Jangan double |
| `Sertifikat MABIM` (pertama) | `Sertifikat PKKMB` | Dokumen kewajiban |
| `Sertifikat KKN` | **HAPUS** | KKN = matkul |
| `Laporan Kerja Praktik` | `Berita Acara Kerja Praktik` | |
| `Draft Skripsi` | `Bukti Sidang Skripsi` | |

---

### P-02: Revisi Halaman Prestasi (Mahasiswa)

**Prompt UI/UX Revisi:**
```
REVISI halaman "Prestasi Saya" untuk SIMKIP-ITG student panel.
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

PERUBAHAN UTAMA:
1. TAMBAH kategorisasi prestasi berbasis 3 TAB: "Internasional" | "Nasional" | "Wilayah"
   - Setiap tab menampilkan daftar prestasi yang sesuai levelnya
   - Tombol "+ Tambah Prestasi" ada di dalam setiap tab
   - Counter badge per tab menunjukkan jumlah prestasi

2. UBAH form input prestasi:
   - Nama Prestasi / Penghargaan (required)
   - Penyelenggara (required)
   - Pencapaian / Juara ke- (misal: "Juara 2", "Best Paper", "Peserta")
   - Tanggal Mulai (date picker) & Tanggal Selesai (date picker)
   - Tempat pelaksanaan (text input)
   - Deskripsi (opsional, textarea)
   - Link Penyelenggara (URL input — Instagram, website event, dll.)
     Info: "Digunakan untuk pelaporan Simkat Mawa"
   - Upload Sertifikat/Piagam (file upload area #1)
   - Upload Foto Kegiatan/Podium (file upload area #2)
     Info: "Foto saat di podium atau saat kegiatan berlangsung"

3. Card display harus menampilkan:
   - Tab level sebagai grouping
   - Nama prestasi + pencapaian badge
   - Penyelenggara + tanggal mulai-selesai + tempat
   - 2 thumbnail (sertifikat & foto)
   - Link penyelenggara (clickable)
   - Status validasi
```

---

### P-03: Revisi Halaman Input Nilai Semester (sebelumnya "Input IPK")

> [!IMPORTANT]
> **PERUBAHAN KONSEP BESAR v2:** Halaman ini sekarang menjadi "Input Nilai Semester" — bukan hanya input 1 angka IPK, tapi input seluruh mata kuliah beserta nilainya.

**Prompt UI/UX Revisi:**
```
REVISI BESAR halaman "Input IPK Semester" menjadi "Input Nilai Semester"
untuk SIMKIP-ITG student panel.
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

KONSEP BARU:
Mahasiswa menginput SELURUH mata kuliah per semester beserta nilainya.
Sistem otomatis menghitung IPK dari data yang diinput.
MK bernilai D dan E = BELUM LULUS dan otomatis masuk daftar "MK Belum Lulus".

LAYOUT HALAMAN:

=== SECTION 1: Header & Status ===
- Judul: "Input Nilai Semester"
- Sub: "Catat nilai mata kuliah dan pantau perkembangan akademik Anda"
- Period banner (aktif/nonaktif) — tetap seperti sekarang

=== SECTION 2: Stat Cards (3 kartu) ===
- IPK Tertinggi | IPK Terendah | IPK Rata-rata — tetap seperti sekarang

=== SECTION 3: Grafik Progres IPK ===
- Ganti label "Tren IPK" menjadi "Progres IPK"
- Chart AreaChart tetap sama

=== SECTION 4: Input Nilai Mata Kuliah — Semester [n] ===
(Section baru — menggantikan form input IPK 1 angka)

- Heading: "Nilai Mata Kuliah — Semester 7 (TA 2025/2026 Ganjil)"
- Tabel input editable:
  | No | Kode MK | Nama Mata Kuliah | SKS | Nilai Huruf | Nilai Mutu | Status |
  |----|---------|------------------|-----|-------------|------------|--------|
  | 1  | IF401   | Kecerdasan Buatan| 3   | A           | 4.00       | ✅ Lulus|
  | 2  | IF402   | Pemrograman Web  | 3   | B           | 3.00       | ✅ Lulus|
  | 3  | IF403   | Praktikum Jarkom | 2   | D           | 1.00       | ❌ Belum Lulus|
  | 4  | IF404   | Etika Profesi    | 2   | A           | 4.00       | ✅ Lulus|

- Input per row: Kode MK (text), Nama MK (text), SKS (number 1-6),
  Nilai Huruf (dropdown: A/B/C/D/E), Nilai Mutu (auto-fill: 4/3/2/1/0)
- Status otomatis: D/E = "❌ Belum Lulus" (merah), A/B/C = "✅ Lulus" (hijau)
- Button "+ Tambah Mata Kuliah" — menambah row baru
- Button "Hapus" per row (icon trash)

- Footer section:
  - Auto-calculated: "Total SKS: 10 | IPK Semester: 3.20"
    (rumus: Σ(SKS × Nilai Mutu) / Σ(SKS))
  - IPK otomatis dihitung — mahasiswa TIDAK perlu input IPK manual lagi

- Upload KHS: "Upload KHS (Bukti Pendukung)"
  - Dropzone area untuk upload PDF/foto KHS
  - Info: "KHS digunakan sebagai bukti verifikasi oleh Pengelola KIP-K"

- Tombol "Simpan Nilai Semester"

=== SECTION 5: Daftar Mata Kuliah Belum Lulus (Carry-Over) ===
- Heading: "⚠️ Mata Kuliah Belum Lulus"
- Info: "Mata kuliah bernilai D/E yang belum diperbaiki dari semester sebelumnya"

- Tabel read-only:
  | Kode MK | Nama Mata Kuliah | SKS | Nilai | Semester Awal | Status |
  |---------|------------------|-----|-------|---------------|--------|
  | IF301   | Statistika       | 3   | E     | Semester 4    | ⏳ Belum Diperbaiki |
  | IF205   | Fisika Dasar     | 2   | D     | Semester 3    | ✅ Lulus di Sem 5 |

- Logika carry-over:
  - MK bernilai D/E dari semester sebelumnya otomatis muncul
  - Jika di semester berikutnya mahasiswa mengulang dan mendapat nilai ≥ C,
    status berubah menjadi "✅ Lulus di Semester [n]" (hijau)
  - Jika belum diperbaiki, status "⏳ Belum Diperbaiki" (kuning/merah)

- Alert box jika ada MK belum lulus yang menghambat:
  "⚠️ Anda memiliki [n] mata kuliah belum lulus yang berpotensi
  menghambat Kerja Praktik / Skripsi. Segera perbaiki."

=== SECTION 6: Riwayat Nilai per Semester ===
- Tabel riwayat IPK tetap ada, TAMBAH kolom:
  | Semester | TA | IPK | Perubahan | MK Belum Lulus | Status |
  - Kolom "MK Belum Lulus" menampilkan count (misal: "2 MK")
  - Klik baris → expand menampilkan detail MK semester tersebut

TUJUAN:
- Mendeteksi hambatan studi dini (belum praktikum → belum KP → terhambat lulus)
- Menggantikan input IPK manual dengan auto-calculate dari nilai MK
- Memberikan data granular untuk Pengelola KIP-K
```

---

### P-04: Revisi Halaman Profil (Mahasiswa)

**Prompt UI/UX Revisi:**
```
REVISI halaman "Profil Saya" untuk SIMKIP-ITG student panel.
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

PERUBAHAN UTAMA:

1. PERLUAS data profil:
   Section "Informasi Pribadi":
   - Upload Foto Profil (circle avatar, max 2MB)
   - NIM, Nama Lengkap, Tanggal Lahir, Alamat Lengkap
   - Program Studi, Angkatan, Kategori KIP-K, Status Akun

   Section "Data Orang Tua":
   - Nama Ayah, Nama Ibu
   - Tombol "Simpan Perubahan"

2. TAMBAH "Riwayat Nomor Kontak":
   - Nomor HP aktif + badge "Aktif" + "Sejak Semester 5"
   - Button "Ganti Nomor" → form input nomor baru
   - Riwayat timeline semua nomor sebelumnya
   - Warning: "Segera perbarui jika ganti nomor HP"

3. Section "Ubah Password" tetap sama.
```

---

### P-05: Revisi Halaman Upload Dokumen Kewajiban (Mahasiswa)

**Prompt UI/UX Revisi:**
```
REVISI halaman "Upload Dokumen Kewajiban" untuk SIMKIP-ITG student panel.
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

PERUBAHAN UTAMA:

1. UBAH urutan dan nama dokumen (6 dokumen — KKN DIHAPUS karena matkul):
   1. PKKMB — "Sertifikat Pengenalan Kehidupan Kampus Bagi Mahasiswa Baru"
   2. Bela Negara — "Sertifikat keikutsertaan program Bela Negara"
   3. MABIM — "Sertifikat keikutsertaan Masa Bimbingan Mahasiswa"
   4. Berita Acara KP — "Berita acara/bukti sidang Kerja Praktik"
   5. Sertifikasi — "Sertifikat profesional/kompetensi (minimal 1 wajib)" ⭐ BARU
   6. Bukti Sidang Skripsi — "Bukti skripsi telah disidangkan dan dinyatakan lulus"

2. Progress bar: "X dari 6 dokumen telah disetujui"

3. Semua logika lainnya (status validasi, upload modal, preview) tetap sama.
```

---

### P-06: Revisi Surat Keterangan Penyelesaian (sebelumnya "Bebas Tanggungan")

**Prompt UI/UX Revisi:**
```
REVISI halaman "Bebas Tanggungan" — GANTI KONSEP.
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

NAMA BARU: "Surat Keterangan Penyelesaian Studi Mahasiswa KIP-K Kuliah"

ALUR YANG BENAR (v2):
1. Mahasiswa MENGAJUKAN permohonan penerbitan surat
2. Pengelola KIP-K MENGECEK kelayakan (semua kewajiban terpenuhi?)
3. Jika layak → Pengelola MENERBITKAN surat
4. Surat tersedia di akun mahasiswa

HALAMAN MAHASISWA:
- State 1 "Belum Mengajukan":
  - Progress checklist kewajiban (6 dokumen, IPK, dll.)
  - Jika semua kewajiban terpenuhi → tombol "Ajukan Permohonan Penerbitan Surat"
  - Jika belum terpenuhi → tombol disabled + keterangan apa yang kurang
- State 2 "Menunggu Review":
  - "Permohonan Anda sedang dicek oleh Pengelola KIP-K"
  - Tanggal pengajuan, estimasi waktu
- State 3 "Surat Diterbitkan":
  - Preview surat resmi + tombol Download PDF
- State 4 "Ditolak":
  - Alasan penolakan + link perbaikan

HALAMAN PENGELOLA (Admin):
- Daftar permohonan masuk dari mahasiswa
- Filter: Menunggu | Diterbitkan | Ditolak
- Klik → Detail: cek kelayakan mahasiswa → Tombol "Terbitkan Surat" atau "Tolak"

SIDEBAR: Ganti label "Bebas Tanggungan" menjadi "Surat Penyelesaian"
```

---

### P-07: Revisi Dashboard Admin (Pengelola KIP-K)

**Prompt UI/UX Revisi:**
```
REVISI Dashboard Pengelola KIP-K SIMKIP-ITG:
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

1. UBAH label:
   - "Super Admin" → "Pengelola KIP-K"
   - "Mahasiswa KIP Reguler" → "KIP-K Reguler"
   - "Mahasiswa KIP Aspirasi" → "KIP-K Aspirasi"

2. UBAH "Mahasiswa Semester ≥ 7":
   - Ganti menjadi "Mahasiswa Semester > 8 (Melebihi Batas Studi)"

3. UBAH chart agar lebih interaktif:
   - Drill-down: klik prodi → lihat per angkatan dan sebaliknya

4. UBAH semua warna dari Navy ke Biru Persib
```

---

### P-08: Revisi Surat Peringatan (Mahasiswa View)

**Prompt UI/UX Revisi:**
```
REVISI halaman "Surat Peringatan" di student panel:
Warna primer: #263F93 (Biru Persib), aksen: #FFF200 (Kuning Persib).

1. SP berbentuk SURAT RESMI:
   - Nomor surat kemahasiswaan
   - Layout formal: kop surat, nomor, perihal, isi
   - Detail alasan pelanggaran (contoh: "Penurunan IPK dari 3.0 menjadi 2.8")

2. Riwayat SP dengan PENJELASAN DETAIL per SP

3. Semua referensi "KIP" → "KIP-K"
```

---

## BAGIAN 4: RINGKASAN PRIORITAS PERBAIKAN

### 🔴 Prioritas Tinggi (Harus Diperbaiki Segera)

| # | Perbaikan | Effort |
|---|---|---|
| 1 | Ubah warna seluruh UI: `#1E3A5F` → `#263F93`, `#D4A843` → `#FFF200` | Sedang (35+ file) |
| 2 | Ubah "Admin/Super Admin" → "Pengelola KIP-K" + "KIP" → "KIP-K" | Rendah (find & replace) |
| 3 | Ubah "Bebas Tanggungan" → "Surat Keterangan Penyelesaian" + koreksi alur pengajuan | Tinggi |
| 4 | Ubah nama & urutan dokumen kewajiban + hapus KKN + tambah "Sertifikasi" & "PKKMB" | Sedang |
| 5 | Revisi form Prestasi (3 tab, tanggal mulai/selesai, 2 upload, link penyelenggara) | Tinggi |
| 6 | **BARU:** Input Nilai Mata Kuliah per semester (menggantikan input IPK 1 angka) + auto-hitung IPK + deteksi MK belum lulus | Tinggi |

### 🟡 Prioritas Sedang

| # | Perbaikan | Effort |
|---|---|---|
| 7 | Perluas data Profil (foto, TTL, alamat, orang tua, riwayat nomor kontak) | Sedang |
| 8 | Ubah "semester ≥ 7" menjadi "semester > 8" di dashboard | Rendah |
| 9 | Ubah chart label "Tren" → "Progres/Grafik IPK" | Rendah |
| 10 | SP berbentuk surat resmi dengan nomor surat | Sedang |
| 11 | Tambah halaman/tab Data Non-Akademik di admin | Sedang |

### 🟢 Prioritas Rendah

| # | Perbaikan | Effort |
|---|---|---|
| 12 | Chart drill-down interaktif (prodi ↔ angkatan) | Sedang |
| 13 | Laporan per angkatan | Rendah (filter) |

---

> [!NOTE]
> **TOTAL: 35 item revisi** (30 asli + 5 klarifikasi tambahan), memerlukan modifikasi pada **35+ file**. Setiap item dilengkapi prompt UI/UX revisi yang siap digunakan.
>
> **Perubahan konsep terbesar:** Input Nilai Semester (bukan hanya IPK) — ini mengubah fundamental cara mahasiswa menginput data akademik dan cara sistem mendeteksi MK yang belum lulus.
