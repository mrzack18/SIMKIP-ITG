# Planning Backend SIMKIP-ITG
> Perencanaan implementasi backend Laravel untuk mendukung frontend React yang sudah final.
> Dokumen ini **hanya mencakup perencanaan**, belum ada implementasi kode.

---

## PRINSIP UTAMA

> [!IMPORTANT]
> Frontend adalah **final dan tidak boleh diubah**. Backend harus menyesuaikan seluruh kontrak data (struktur request/response, nama field, tipe data, status enum) persis seperti yang diharapkan oleh frontend.

---

## 1. GAMBARAN ARSITEKTUR

```
Frontend (React + Vite)          Backend (Laravel 11)
──────────────────────           ──────────────────────────────
resources/js/services/     ←──→  routes/api.php
  api.ts (base HTTP)             app/Http/Controllers/Api/
  authService.ts                 app/Http/Middleware/
  mahasiswaService.ts            app/Models/
  dokumenService.ts              app/Http/Requests/
  spService.ts                   database/migrations/
  laporanService.ts              database/seeders/
                                 storage/app/public/ (uploads)
```

### Stack Backend
- **Framework**: Laravel 11
- **Auth**: Laravel Sanctum (token-based, disimpan di `localStorage` frontend)
- **Database**: MySQL / PostgreSQL
- **File Storage**: Laravel Storage (local disk → `storage/app/public`)
- **PDF Generation**: Barryvdh Laravel-DomPDF (untuk laporan & surat)
- **Excel Export**: Maatwebsite Laravel-Excel
- **API Format**: JSON REST API
- **Base URL API**: `http://localhost:8000/api` (dev) → disesuaikan dengan `VITE_API_URL`

---

## 2. ANALISIS KEBUTUHAN BACKEND

### 2.1 Dari Sudut Pandang Frontend → Backend

| Komponen Frontend | Kebutuhan Backend |
|---|---|
| `authService.login()` | Endpoint login, validasi credential, issue Sanctum token |
| `AuthContext` + `localStorage` | Token harus valid dan dapat di-verify lewat `/api/auth/me` |
| `mahasiswaService.getMahasiswaList()` | Endpoint list dengan filter + pagination |
| `mahasiswaService.createMahasiswa()` | Endpoint POST dengan upload file SK |
| `dokumenService.approveDokumen()` | Endpoint PATCH approve/reject |
| `spService.terbitkanSP()` | Endpoint POST SP dengan validasi urutan level |
| `laporanService.submitLaporan()` | Endpoint PATCH submit laporan ke warek |
| Role-based redirect di `App.tsx` | Token payload harus menyertakan `role` mahasiswa |
| Sidebar badge "5" pada Dokumen | Endpoint counter dokumen pending |
| Notifikasi bell di Topbar | Endpoint daftar notifikasi per user |

### 2.2 Dokumen Kewajiban (5 Jenis)
Backend harus tahu 5 jenis dokumen wajib ini persis:
1. PKKMB
2. MABIM
3. Bela Negara
4. Sertifikasi
5. Berita Acara KP

> Jenis ini dikonfigurasi dari tabel `dokumen_jenis` (bisa diubah dari halaman Konfigurasi).

### 2.3 Grade System
| Nilai Huruf | Nilai Mutu | Lulus? |
|---|---|---|
| A | 4.0 | Ya |
| AB | 3.5 | Ya |
| B | 3.0 | Ya |
| BC | 2.5 | Ya |
| C | 2.0 | Ya |
| D | 1.0 | Tidak |
| E | 0.0 | Tidak |

---

## 3. STRUKTUR DATABASE

### 3.1 Entity Relationship Diagram (Konseptual)

```
users ──────────── mahasiswas ─────────────────────────────────────────────┐
  │                    │                                                    │
  │               ┌────┴──────────────────────────────────────────┐        │
  │               │              │            │          │         │        │
  │           ipk_semestrs   dokumens    surat_perings  │    bebas_tanggungans
  │               │               │            │        │
  │           mata_kuliahs    (file)       (level)   prestasiS
  │                                                   organisasis
  │                                                   pelatihans
  │
  ├── laporans ──── laporan_catatan_wareks
  │
  ├── audit_logs
  ├── notifications
  └── konfigurasis
```

### 3.2 Tabel Detail

---

#### `users` (Akun Login semua Role)
```sql
id                  BIGINT PK AUTO_INCREMENT
name                VARCHAR(255)          -- nama lengkap
username            VARCHAR(100) UNIQUE   -- NIM (mahasiswa) atau username (lainnya)
email               VARCHAR(255) NULLABLE
password            VARCHAR(255)          -- bcrypt
role                ENUM('admin','mahasiswa','prodi','warek')
prodi_id            BIGINT FK NULLABLE    -- hanya untuk role 'prodi'
no_hp               VARCHAR(20) NULLABLE
foto_profil         VARCHAR(255) NULLABLE -- path file
is_password_changed TINYINT DEFAULT 0    -- flag ganti password pertama kali
remember_token      VARCHAR(100) NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `prodis` (Master Program Studi)
```sql
id          BIGINT PK AUTO_INCREMENT
kode        VARCHAR(20) UNIQUE          -- contoh: TI, SI, TS, AR, TI2
nama        VARCHAR(255)                -- Teknik Informatika, dst.
is_aktif    TINYINT DEFAULT 1
created_at, updated_at TIMESTAMPS
```

**Seed data:**
- Teknik Informatika (TI)
- Sistem Informasi (SI)
- Teknik Industri (TI2)
- Teknik Sipil (TS)
- Arsitektur (AR)

---

#### `mahasiswas` (Data Mahasiswa KIP-K)
```sql
id               BIGINT PK AUTO_INCREMENT
user_id          BIGINT FK → users.id UNIQUE
nim              VARCHAR(20) UNIQUE
nama             VARCHAR(255)
prodi_id         BIGINT FK → prodis.id
angkatan         YEAR
kategori         ENUM('Reguler','Aspirasi')
status           ENUM('Aktif','Dicabut','Lulus','Cuti') DEFAULT 'Aktif'
nomor_sk         VARCHAR(100)               -- SK penetapan KIP-K
tanggal_sk       DATE
file_sk          VARCHAR(255) NULLABLE      -- path file scan SK
created_at, updated_at TIMESTAMPS
```

---

#### `ipk_semestrs` (Riwayat IPK per Semester)
```sql
id            BIGINT PK AUTO_INCREMENT
mahasiswa_id  BIGINT FK → mahasiswas.id
semester      TINYINT                      -- 1, 2, 3, ...
tahun_ajaran  VARCHAR(20)                  -- "2024/2025 Ganjil"
ipk           DECIMAL(3,2)
file_khs      VARCHAR(255) NULLABLE        -- KHS yang diupload
is_verified   TINYINT DEFAULT 0            -- sudah diverifikasi admin?
created_at, updated_at TIMESTAMPS

UNIQUE (mahasiswa_id, semester)
```

---

#### `mata_kuliahs` (Detail MK per Semester)
```sql
id              BIGINT PK AUTO_INCREMENT
ipk_semester_id BIGINT FK → ipk_semestrs.id
kode            VARCHAR(20)
nama            VARCHAR(255)
sks             TINYINT
nilai_huruf     ENUM('A','AB','B','BC','C','D','E')
nilai_mutu      DECIMAL(3,1)               -- auto-calculated
lulus           TINYINT                    -- auto-calculated dari nilai
created_at, updated_at TIMESTAMPS
```

---

#### `dokumen_jenis` (Master Jenis Dokumen Wajib)
```sql
id          BIGINT PK AUTO_INCREMENT
nama        VARCHAR(255)       -- PKKMB, MABIM, Bela Negara, Sertifikasi, Berita Acara KP
is_wajib    TINYINT DEFAULT 1  -- bisa di-toggle dari halaman Konfigurasi
urutan      INT                -- urutan tampil di frontend
created_at, updated_at TIMESTAMPS
```

---

#### `dokumens` (Upload Dokumen oleh Mahasiswa)
```sql
id              BIGINT PK AUTO_INCREMENT
mahasiswa_id    BIGINT FK → mahasiswas.id
dokumen_jenis_id BIGINT FK → dokumen_jenis.id
nama_file       VARCHAR(255)
path_file       VARCHAR(255)            -- path storage
ukuran          INT                     -- bytes
status          ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu'
catatan_admin   TEXT NULLABLE
approved_by     BIGINT FK → users.id NULLABLE
approved_at     TIMESTAMP NULLABLE
tanggal_upload  TIMESTAMP DEFAULT NOW()
created_at, updated_at TIMESTAMPS
```

---

#### `surat_peringatans` (SP / Warning Letter)
```sql
id              BIGINT PK AUTO_INCREMENT
mahasiswa_id    BIGINT FK → mahasiswas.id
level           ENUM('SP1','SP2','SP3')
jenis_pelanggaran ENUM('Akademik','Non-Akademik','Cuti Tanpa Izin')
deskripsi       TEXT
tanggal_terbit  DATE
batas_evaluasi  DATE
status          ENUM('Aktif','Masa Tenggang','Pemberhentian','Selesai') DEFAULT 'Aktif'
diterbitkan_oleh BIGINT FK → users.id
catatan         TEXT NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `prestasiS` (Prestasi Mahasiswa)
```sql
id                BIGINT PK AUTO_INCREMENT
mahasiswa_id      BIGINT FK → mahasiswas.id
nama_prestasi     VARCHAR(255)
tingkat           ENUM('Internasional','Nasional','Wilayah','Institusi')
pencapaian        VARCHAR(255)           -- Juara 1, Best Presenter, Finalis, ...
penyelenggara     VARCHAR(255)
tanggal_mulai     DATE
tanggal_selesai   DATE
tempat            VARCHAR(255)
deskripsi         TEXT
link_penyelenggara VARCHAR(500) NULLABLE
file_sertifikat   VARCHAR(255) NULLABLE
file_foto         VARCHAR(255) NULLABLE
status            ENUM('Menunggu Validasi','Disetujui','Ditolak') DEFAULT 'Menunggu Validasi'
catatan_admin     TEXT NULLABLE
validated_by      BIGINT FK → users.id NULLABLE
validated_at      TIMESTAMP NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `organisasis` (Keaktifan Organisasi)
```sql
id            BIGINT PK AUTO_INCREMENT
mahasiswa_id  BIGINT FK → mahasiswas.id
nama          VARCHAR(255)
jabatan       VARCHAR(255)
periode_mulai DATE
periode_selesai DATE
deskripsi     TEXT
file_sk       VARCHAR(255) NULLABLE
status        ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu'
catatan_admin TEXT NULLABLE
validated_by  BIGINT FK → users.id NULLABLE
validated_at  TIMESTAMP NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `pelatihans` (Pelatihan Mahasiswa)
```sql
id              BIGINT PK AUTO_INCREMENT
mahasiswa_id    BIGINT FK → mahasiswas.id
nama            VARCHAR(255)
jenis           ENUM('Akademik','Non-Akademik')
penyelenggara   VARCHAR(255)
tanggal_mulai   DATE
tanggal_selesai DATE
tempat          VARCHAR(255)
deskripsi       TEXT
file_sertifikat VARCHAR(255) NULLABLE
status          ENUM('Menunggu','Disetujui','Ditolak') DEFAULT 'Menunggu'
catatan_admin   TEXT NULLABLE
validated_by    BIGINT FK → users.id NULLABLE
validated_at    TIMESTAMP NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `bebas_tanggungans` (Permohonan Surat Penyelesaian Studi)
```sql
id              BIGINT PK AUTO_INCREMENT
mahasiswa_id    BIGINT FK → mahasiswas.id UNIQUE  -- 1 per mahasiswa
tanggal_ajukan  DATE
status          ENUM('Menunggu','Diterbitkan','Ditolak') DEFAULT 'Menunggu'
catatan_admin   TEXT NULLABLE
reviewed_by     BIGINT FK → users.id NULLABLE
reviewed_at     TIMESTAMP NULLABLE
nomor_surat     VARCHAR(100) NULLABLE    -- auto-generate saat diterbitkan
tanggal_terbit  DATE NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `laporans` (Laporan Semester KIP-K)
```sql
id              BIGINT PK AUTO_INCREMENT
nomor_surat     VARCHAR(100) UNIQUE      -- auto-generate
judul           VARCHAR(500)
periode         VARCHAR(100)             -- "Semester Genap 2025/2026"
tahun_akademik  VARCHAR(20)              -- "2025/2026"
semester        ENUM('Ganjil','Genap')
tanggal_laporan DATE
cakupan         ENUM('Semua','Angkatan','Prodi','Keduanya')
filter_angkatan YEAR NULLABLE
filter_prodi_id BIGINT FK → prodis.id NULLABLE
catatan_laporan TEXT NULLABLE
status          ENUM('Draft','Diajukan','Disetujui','Dikembalikan') DEFAULT 'Draft'
dibuat_oleh     BIGINT FK → users.id
submitted_at    TIMESTAMP NULLABLE
created_at, updated_at TIMESTAMPS
```

---

#### `laporan_reviews` (Catatan Review Warek)
```sql
id          BIGINT PK AUTO_INCREMENT
laporan_id  BIGINT FK → laporans.id
warek_id    BIGINT FK → users.id
aksi        ENUM('Disetujui','Dikembalikan')
catatan     TEXT NULLABLE
reviewed_at TIMESTAMP DEFAULT NOW()
created_at, updated_at TIMESTAMPS
```

---

#### `konfigurasis` (Pengaturan Sistem)
```sql
id          BIGINT PK AUTO_INCREMENT
key         VARCHAR(100) UNIQUE
value       TEXT
label       VARCHAR(255)
tipe        ENUM('number','text','boolean','date')
created_at, updated_at TIMESTAMPS
```

**Seed data konfigurasi:**
| Key | Value | Label |
|---|---|---|
| `ipk_minimum` | `3.0` | IPK Minimum KIP-K |
| `max_semester` | `8` | Batas Semester Studi |
| `nama_institusi` | `Institut Teknologi Garut` | Nama Institusi |
| `alamat_institusi` | `Jl. Mayor Syamsu No. 1, ...` | Alamat |
| `logo_institusi` | `logo_itg.jpg` | Logo |
| `periode_input_aktif` | `1` | Periode Input Nilai Aktif |
| `periode_input_buka` | `2026-08-01` | Tanggal Buka Input |
| `periode_input_tutup` | `2026-09-15` | Tanggal Tutup Input |

---

#### `audit_logs` (Log Aktivitas Sistem)
```sql
id              BIGINT PK AUTO_INCREMENT
user_id         BIGINT FK → users.id NULLABLE
jenis           ENUM('SP','Validasi','Hapus','Approve','Login','Ubah','Ekspor','Laporan')
aktivitas       VARCHAR(255)            -- judul singkat aksi
deskripsi       TEXT                    -- detail aksi
terkait_nim     VARCHAR(20) NULLABLE    -- NIM yang terkait (jika ada)
terkait_nama    VARCHAR(255) NULLABLE
ip_address      VARCHAR(45) NULLABLE
created_at      TIMESTAMP DEFAULT NOW()
```

---

#### `notifications` (Notifikasi Per User)
```sql
id          BIGINT PK AUTO_INCREMENT
user_id     BIGINT FK → users.id
judul       VARCHAR(255)
pesan       TEXT
tipe        ENUM('info','warning','success','error')
is_read     TINYINT DEFAULT 0
link        VARCHAR(500) NULLABLE       -- deep link ke halaman terkait
created_at, updated_at TIMESTAMPS
```

---

### 3.3 Ringkasan Relasi Tabel

| Relasi | Tipe | Catatan |
|---|---|---|
| `users` → `mahasiswas` | 1:1 | Setiap mahasiswa punya akun |
| `users` → `prodis` | N:1 | User role 'prodi' punya prodi |
| `mahasiswas` → `ipk_semestrs` | 1:N | Satu mahasiswa, banyak semester |
| `ipk_semestrs` → `mata_kuliahs` | 1:N | Satu semester, banyak MK |
| `mahasiswas` → `dokumens` | 1:N | Per jenis dokumen |
| `mahasiswas` → `surat_peringatans` | 1:N | Riwayat SP |
| `mahasiswas` → `prestasiS` | 1:N | |
| `mahasiswas` → `organisasis` | 1:N | |
| `mahasiswas` → `pelatihans` | 1:N | |
| `mahasiswas` → `bebas_tanggungans` | 1:1 | Satu permohonan per mahasiswa |
| `laporans` → `laporan_reviews` | 1:N | Bisa dikembalikan & direvisi berkali-kali |
| `prodis` ← `mahasiswas` | 1:N | |

---

## 4. SISTEM AUTENTIKASI & OTORISASI

### 4.1 Laravel Sanctum

Frontend menyimpan token di `localStorage` dengan key `simkip_token`. Backend menggunakan Laravel Sanctum API tokens (bukan session/cookie).

```
POST /api/auth/login
← Response: { user: UserSession, token: string, redirect_path: string }

Header untuk setiap request setelah login:
Authorization: Bearer {token}

GET /api/auth/me  (verifikasi token + restore session)
POST /api/auth/logout
```

### 4.2 Struktur Token Response

Frontend membaca field `user` dari response login dan menyimpannya sebagai `simkip_user` di localStorage. Format yang **harus persis sama**:

```json
{
  "user": {
    "id": "1",
    "nama": "Ahmad Rifaldi",
    "nim": "2206001",
    "role": "mahasiswa",
    "prodi": "Teknik Informatika"
  },
  "token": "1|abc123...",
  "redirect_path": "/mahasiswa"
}
```

> [!IMPORTANT]
> Field `role` harus menggunakan value persis: `"admin"`, `"mahasiswa"`, `"prodi"`, `"warek"`. Frontend menggunakan nilai ini untuk routing dan kondisional UI.

### 4.3 Redirect Path per Role
| Role | `redirect_path` |
|---|---|
| `admin` | `/admin` |
| `mahasiswa` | `/mahasiswa` |
| `prodi` | `/prodi` |
| `warek` | `/warek` |

### 4.4 Middleware Stack

```
app/Http/Middleware/
├── Authenticate.php          (default Sanctum)
├── CheckRole.php             (BARU: validasi role dari token)
└── LogActivity.php           (BARU: auto-insert audit_logs)
```

**CheckRole Middleware:**
```
Route::middleware(['auth:sanctum', 'role:admin'])
Route::middleware(['auth:sanctum', 'role:mahasiswa'])
Route::middleware(['auth:sanctum', 'role:prodi'])
Route::middleware(['auth:sanctum', 'role:warek'])
Route::middleware(['auth:sanctum', 'role:admin,warek'])  // multi-role
```

### 4.5 Otorisasi Resource

| Action | Admin | Mahasiswa | Prodi | Warek |
|---|---|---|---|---|
| Lihat semua mahasiswa | ✅ | ❌ | Prodi-nya saja | ✅ semua |
| Tambah/Edit mahasiswa | ✅ | ❌ | ❌ | ❌ |
| Hapus mahasiswa | ✅ | ❌ | ❌ | ❌ |
| Lihat detail mahasiswa | ✅ | Diri sendiri | Prodi-nya | ✅ semua |
| Upload dokumen | ❌ | Diri sendiri | ❌ | ❌ |
| Approve/reject dokumen | ✅ | ❌ | ❌ | ❌ |
| Terbitkan SP | ✅ | ❌ | ❌ | ❌ |
| Input IPK | ❌ | Diri sendiri | ❌ | ❌ |
| Tambah prestasi/org/latih | ❌ | Diri sendiri | ❌ | ❌ |
| Validasi prestasi/org/latih | ✅ | ❌ | ❌ | ❌ |
| Buat/submit laporan | ✅ | ❌ | ❌ | ❌ |
| Approve/kembalikan laporan | ❌ | ❌ | ❌ | ✅ |
| Lihat laporan | ✅ | ❌ | ❌ | ✅ |
| Ekspor laporan | ✅ | ❌ | ✅ (prodi-nya) | ❌ |
| Konfigurasi sistem | ✅ | ❌ | ❌ | ❌ |
| Lihat audit log | ✅ | ❌ | ❌ | ❌ |
| Ajukan bebas tanggungan | ❌ | Diri sendiri | ❌ | ❌ |
| Review bebas tanggungan | ✅ | ❌ | ❌ | ❌ |

### 4.6 First-Login Password Change

Field `is_password_changed` di tabel `users`:
- `0` = belum ganti password
- `1` = sudah ganti

Response login akan menyertakan flag ini:
```json
{ "user": {...}, "token": "...", "must_change_password": true }
```

Frontend menampilkan halaman ganti password wajib sebelum masuk dashboard.

---

## 5. DAFTAR ENDPOINT API LENGKAP

### 5.1 Authentication

```
POST   /api/auth/login
POST   /api/auth/logout              [auth]
GET    /api/auth/me                  [auth]
POST   /api/auth/change-password     [auth]
```

---

### 5.2 Dashboard

```
GET    /api/admin/dashboard          [auth, role:admin]
GET    /api/mahasiswa/dashboard      [auth, role:mahasiswa]
GET    /api/prodi/dashboard          [auth, role:prodi]
GET    /api/warek/dashboard          [auth, role:warek]
```

---

### 5.3 Mahasiswa (Admin CRUD)

```
GET    /api/mahasiswa                [auth, role:admin,prodi,warek]
POST   /api/mahasiswa                [auth, role:admin]         -- multipart/form-data
GET    /api/mahasiswa/check-nim/:nim [auth, role:admin]         -- cek NIM duplikat
GET    /api/mahasiswa/:id            [auth, role:admin,prodi,warek]
PUT    /api/mahasiswa/:id            [auth, role:admin]
DELETE /api/mahasiswa/:id            [auth, role:admin]
```

---

### 5.4 IPK & Mata Kuliah

```
-- Admin (semua mahasiswa)
GET    /api/akademik/ipk             [auth, role:admin]
-- Filter: search, prodi, angkatan, kategori, status (atas/bawah standar)

-- Mahasiswa (diri sendiri)
GET    /api/mahasiswa/ipk            [auth, role:mahasiswa]
POST   /api/mahasiswa/ipk            [auth, role:mahasiswa]     -- multipart (+ file KHS)
GET    /api/mahasiswa/ipk/:semester  [auth, role:mahasiswa]

-- Admin lihat IPK mahasiswa tertentu
GET    /api/mahasiswa/:id/ipk        [auth, role:admin,prodi,warek]
```

---

### 5.5 Prestasi

```
-- Admin (semua mahasiswa, dengan aksi validasi)
GET    /api/akademik/prestasi        [auth, role:admin]
PATCH  /api/prestasi/:id/validate    [auth, role:admin]         -- approve/reject

-- Mahasiswa (diri sendiri)
GET    /api/mahasiswa/prestasi       [auth, role:mahasiswa]
POST   /api/mahasiswa/prestasi       [auth, role:mahasiswa]     -- multipart
PUT    /api/mahasiswa/prestasi/:id   [auth, role:mahasiswa]
DELETE /api/mahasiswa/prestasi/:id   [auth, role:mahasiswa]

-- Admin/Prodi/Warek lihat prestasi mahasiswa tertentu
GET    /api/mahasiswa/:id/prestasi   [auth, role:admin,prodi,warek]
```

---

### 5.6 Organisasi

```
GET    /api/akademik/organisasi      [auth, role:admin]
PATCH  /api/organisasi/:id/validate  [auth, role:admin]

GET    /api/mahasiswa/organisasi     [auth, role:mahasiswa]
POST   /api/mahasiswa/organisasi     [auth, role:mahasiswa]     -- multipart
PUT    /api/mahasiswa/organisasi/:id [auth, role:mahasiswa]
DELETE /api/mahasiswa/organisasi/:id [auth, role:mahasiswa]

GET    /api/mahasiswa/:id/organisasi [auth, role:admin,prodi,warek]
```

---

### 5.7 Pelatihan

```
GET    /api/akademik/pelatihan       [auth, role:admin]         -- ?jenis=Akademik|Non-Akademik
PATCH  /api/pelatihan/:id/validate   [auth, role:admin]

GET    /api/mahasiswa/pelatihan      [auth, role:mahasiswa]     -- ?jenis=Akademik|Non-Akademik
POST   /api/mahasiswa/pelatihan      [auth, role:mahasiswa]     -- multipart
PUT    /api/mahasiswa/pelatihan/:id  [auth, role:mahasiswa]
DELETE /api/mahasiswa/pelatihan/:id  [auth, role:mahasiswa]

GET    /api/mahasiswa/:id/pelatihan  [auth, role:admin,prodi,warek]
```

---

### 5.8 Dokumen Kewajiban

```
-- Antrian admin
GET    /api/dokumen/queue            [auth, role:admin]         -- ?search=&status=&jenis=
PATCH  /api/dokumen/:id/approve      [auth, role:admin]
PATCH  /api/dokumen/:id/reject       [auth, role:admin]         -- Body: {catatan}
GET    /api/dokumen/:id/file         [auth, role:admin]         -- serve file (preview)
GET    /api/dokumen/:id/download     [auth]                     -- download file

-- Mahasiswa
GET    /api/mahasiswa/dokumen        [auth, role:mahasiswa]
POST   /api/mahasiswa/dokumen        [auth, role:mahasiswa]     -- multipart: {jenis_id, file}
DELETE /api/mahasiswa/dokumen/:id    [auth, role:mahasiswa]     -- hanya jika status=Ditolak

-- Admin/Prodi/Warek lihat dokumen mahasiswa tertentu
GET    /api/mahasiswa/:id/dokumen    [auth, role:admin,prodi,warek]

-- Arsip mahasiswa
GET    /api/mahasiswa/arsip          [auth, role:mahasiswa]     -- ?jenis=&status=
```

---

### 5.9 Surat Peringatan (SP)

```
GET    /api/sp                       [auth, role:admin]         -- ?search=&level=&status=
POST   /api/sp                       [auth, role:admin]
GET    /api/sp/:id                   [auth, role:admin]
PATCH  /api/sp/:id/status            [auth, role:admin]         -- Body: {status, catatan?}

-- Mahasiswa lihat SP-nya sendiri
GET    /api/mahasiswa/sp             [auth, role:mahasiswa]

-- Admin/Prodi/Warek lihat SP mahasiswa tertentu
GET    /api/mahasiswa/:id/sp         [auth, role:admin,prodi,warek]
```

---

### 5.10 Bebas Tanggungan

```
GET    /api/bebas-tanggungan         [auth, role:admin]         -- ?search=&status=
GET    /api/bebas-tanggungan/:id     [auth, role:admin]
PATCH  /api/bebas-tanggungan/:id/approve  [auth, role:admin]
PATCH  /api/bebas-tanggungan/:id/reject   [auth, role:admin]   -- Body: {alasan}

-- Mahasiswa
GET    /api/mahasiswa/bebas-tanggungan    [auth, role:mahasiswa]
POST   /api/mahasiswa/bebas-tanggungan    [auth, role:mahasiswa]  -- ajukan permohonan
```

---

### 5.11 Laporan Semester

```
GET    /api/laporan                  [auth, role:admin,warek]   -- ?search=&status=
POST   /api/laporan                  [auth, role:admin]
GET    /api/laporan/:id              [auth, role:admin,warek]
PUT    /api/laporan/:id              [auth, role:admin]          -- edit draft
PATCH  /api/laporan/:id/submit       [auth, role:admin]          -- kirim ke warek
PATCH  /api/laporan/:id/approve      [auth, role:warek]          -- Body: {agreed: true}
PATCH  /api/laporan/:id/return       [auth, role:warek]          -- Body: {catatan}
GET    /api/laporan/:id/pdf          [auth, role:admin,warek]    -- generate PDF laporan
```

---

### 5.12 Konfigurasi Sistem

```
GET    /api/konfigurasi              [auth, role:admin]
PUT    /api/konfigurasi              [auth, role:admin]          -- Body: {key: value, ...}
PUT    /api/konfigurasi/logo         [auth, role:admin]          -- multipart logo
GET    /api/konfigurasi/periode      [auth]                      -- cek periode aktif (publik bagi mahasiswa)

-- Master Prodi
GET    /api/konfigurasi/prodi        [auth, role:admin]
POST   /api/konfigurasi/prodi        [auth, role:admin]
PUT    /api/konfigurasi/prodi/:id    [auth, role:admin]
PATCH  /api/konfigurasi/prodi/:id/toggle [auth, role:admin]

-- Master Dokumen Jenis
GET    /api/konfigurasi/dokumen-jenis [auth, role:admin]
POST   /api/konfigurasi/dokumen-jenis [auth, role:admin]
DELETE /api/konfigurasi/dokumen-jenis/:id [auth, role:admin]
PATCH  /api/konfigurasi/dokumen-jenis/:id/toggle [auth, role:admin]

-- Konfigurasi Grade
GET    /api/konfigurasi/grade        [auth, role:admin]
PUT    /api/konfigurasi/grade        [auth, role:admin]
```

---

### 5.13 Audit Log

```
GET    /api/audit                    [auth, role:admin]
-- ?search=&jenis=&dilakukan_oleh=&dari=&sampai=&page=&limit=
```

---

### 5.14 Ekspor (Prodi)

```
POST   /api/prodi/ekspor             [auth, role:prodi,admin]   -- generate file
GET    /api/prodi/ekspor/preview     [auth, role:prodi,admin]   -- preview data
```

---

### 5.15 Profil & Notifikasi

```
GET    /api/profile                  [auth]
PUT    /api/profile                  [auth]                      -- multipart (foto)
POST   /api/profile/password         [auth]

GET    /api/notifications            [auth]
PATCH  /api/notifications/:id/read   [auth]
PATCH  /api/notifications/read-all   [auth]
GET    /api/notifications/count      [auth]                      -- untuk badge topbar
```

---

## 6. REQUEST & RESPONSE SPECS

### 6.1 POST `/api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "kip2026"
}
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "nama": "Encep Jianul Hayat",
    "nim": null,
    "role": "admin",
    "prodi": null
  },
  "token": "1|abc123tokenstring",
  "redirect_path": "/admin",
  "must_change_password": false
}
```

**Response 401:**
```json
{ "success": false, "message": "Username atau password salah." }
```

---

### 6.2 GET `/api/mahasiswa` (Admin List)

**Query Params:**
```
search=         (NIM atau nama)
prodi=          (nama prodi atau ID)
angkatan=       (tahun)
sp=             (Semua|SP1|SP2|SP3|Tanpa SP)
kategori=       (Semua|Reguler|Aspirasi)
ipk=            (Semua|Di Bawah Standar|Di Atas Standar)
sort=           (ipk_desc|ipk_asc|nama_asc|angkatan_desc)
page=1
limit=10
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nim": "2206001",
      "nama": "Ahmad Rifaldi",
      "prodi": "Teknik Informatika",
      "angkatan": 2022,
      "kategori": "Reguler",
      "status": "Aktif",
      "ipk": 3.45,
      "ipk_delta": 0.21,
      "semester": 6,
      "sp": "SP1"
    }
  ],
  "total": 167,
  "page": 1,
  "limit": 10,
  "total_pages": 17
}
```

> [!NOTE]
> Field `ipk_delta` adalah selisih IPK semester terakhir dengan semester sebelumnya. Dihitung di backend dari tabel `ipk_semestrs`.

---

### 6.3 POST `/api/mahasiswa` (Tambah Mahasiswa)

**Request:** `multipart/form-data`
```
nomor_sk        string (required)
tanggal_sk      date   (required)
file_sk         file   (optional, PDF/JPG/PNG, max 5MB)
nim             string (required, unique)
nama            string (required)
prodi_id        int    (required)
angkatan        int    (required, 2020-2027)
kategori        string (required, Reguler|Aspirasi)
```

**Response 201:**
```json
{
  "success": true,
  "mahasiswa": {
    "id": 13,
    "nim": "2406001",
    "nama": "Budi Santoso",
    "prodi": "Teknik Informatika"
  },
  "credentials": {
    "username": "2406001",
    "password": "kip24060012026"
  }
}
```

---

### 6.4 GET `/api/mahasiswa/check-nim/:nim`

**Response:**
```json
{ "exists": false }
// atau
{ "exists": true, "nama": "Ahmad Rifaldi" }
```

---

### 6.5 POST `/api/sp` (Terbitkan SP)

**Request:**
```json
{
  "mahasiswa_id": 1,
  "level": "SP1",
  "jenis_pelanggaran": "Akademik",
  "deskripsi": "IPK semester 6 turun menjadi 2.78...",
  "tanggal_terbit": "2026-08-17",
  "batas_evaluasi": "2027-02-15",
  "catatan": null
}
```

**Validasi Business Logic (di backend):**
- Mahasiswa harus `status = Aktif`
- Level SP harus urut (tidak bisa SP2 jika belum pernah SP1, kecuali `jenis = 'Cuti Tanpa Izin'`)
- `jenis = 'Cuti Tanpa Izin'` → paksa `level = 'SP3'`

**Response 201:**
```json
{
  "success": true,
  "sp": {
    "id": 5,
    "nim": "2206001",
    "nama": "Ahmad Rifaldi",
    "level": "SP1",
    "status": "Aktif"
  }
}
```

---

### 6.6 POST `/api/mahasiswa/ipk` (Input IPK Mahasiswa)

**Request:** `multipart/form-data`
```
semester        int    (required, 1-14)
tahun_ajaran    string (required, "2025/2026 Ganjil")
ipk             float  (required, 0.00-4.00)
file_khs        file   (optional, PDF/JPG)
mata_kuliah     JSON array (required)
```

**`mata_kuliah` array:**
```json
[
  { "kode": "IF401", "nama": "Kecerdasan Buatan", "sks": 3, "nilai_huruf": "A" }
]
```

**Backend auto-calculate:**
- `nilai_mutu` dari mapping nilai_huruf
- `lulus` dari nilai_huruf (D/E = false)

**Validasi:**
- `periode_input_aktif` harus `true` (dari konfigurasi)
- Semester yang sama tidak bisa di-submit dua kali (kecuali admin reset)

---

### 6.7 PATCH `/api/laporan/:id/return` (Warek Kembalikan Laporan)

**Request:**
```json
{ "catatan": "Tolong tambahkan grafik distribusi per prodi..." }
```

> [!IMPORTANT]
> Frontend menggunakan istilah **"Dikembalikan"** (bukan "Ditolak") untuk status laporan yang di-return Warek. Pastikan enum di database menggunakan `Dikembalikan`.

**Response 200:**
```json
{
  "success": true,
  "laporan": { "id": 1, "status": "Dikembalikan" }
}
```

---

### 6.8 GET `/api/admin/dashboard`

**Response 200:**
```json
{
  "success": true,
  "stats": {
    "total_aktif": 167,
    "reguler": 102,
    "aspirasi": 65,
    "dokumen_menunggu": 5,
    "mahasiswa_semester_8_plus": 14,
    "sp_semester_ini": 7,
    "bebas_tanggungan_pending": 3
  },
  "prodi_sebaran": [
    { "prodi": "Teknik Informatika", "reguler": 42, "aspirasi": 20 }
  ],
  "angkatan_sebaran": [
    { "angkatan": 2022, "reguler": 30, "aspirasi": 15 }
  ],
  "sp_aktif": [
    { "id": 1, "nim": "2206001", "nama": "Ahmad Rifaldi", "prodi": "TI", "sp": "SP1", "sisa": 180 }
  ],
  "dokumen_queue": [
    { "id": 1, "nim": "2206001", "nama": "Ahmad Rifaldi", "jenis": "PKKMB", "tanggal_upload": "2026-08-10", "status": "Menunggu" }
  ]
}
```

---

### 6.9 GET `/api/mahasiswa/bebas-tanggungan`

**Response 200 (belum mengajukan):**
```json
{
  "success": true,
  "status": null,
  "permohonan": null,
  "checklist": [
    { "syarat": "Semua dokumen wajib disetujui", "terpenuhi": true },
    { "syarat": "IPK memenuhi standar (≥ 3.0)", "terpenuhi": true },
    { "syarat": "Tidak ada SP aktif", "terpenuhi": false, "keterangan": "Memiliki SP1 aktif" },
    { "syarat": "SKS mencukupi (144 SKS)", "terpenuhi": true },
    { "syarat": "Tidak ada MK belum lulus", "terpenuhi": false }
  ],
  "can_apply": false
}
```

**Response 200 (sudah mengajukan):**
```json
{
  "success": true,
  "status": "Menunggu",
  "permohonan": {
    "id": 3,
    "tanggal_ajukan": "2026-08-10",
    "catatan_admin": null
  },
  "checklist": [...],
  "can_apply": false
}
```

---

### 6.10 GET `/api/bebas-tanggungan/:id` (Admin Detail)

**Response 200:**
```json
{
  "success": true,
  "permohonan": {
    "id": 1,
    "status": "Menunggu",
    "tanggal_ajukan": "2026-08-10"
  },
  "mahasiswa": {
    "id": 1, "nim": "2206001", "nama": "Ahmad Rifaldi",
    "prodi": "Teknik Informatika", "angkatan": 2022, "semester": 8
  },
  "checklist": {
    "sks_ditempuh": 144, "sks_total": 144, "sks_ok": true,
    "dokumen": [
      { "nama": "PKKMB", "status": "Disetujui", "tgl": "2022-09-20" },
      { "nama": "MABIM", "status": "Disetujui", "tgl": "2022-09-22" },
      { "nama": "Bela Negara", "status": "Menunggu", "tgl": "2026-08-01" },
      { "nama": "Sertifikasi", "status": null, "tgl": null },
      { "nama": "Berita Acara KP", "status": null, "tgl": null }
    ],
    "sp_bersih": false,
    "ipk_ok": true
  },
  "ipk_per_semester": [
    { "sem": 1, "ipk": 3.20 }, { "sem": 2, "ipk": 3.45 }
  ],
  "penolakan_history": []
}
```

---

## 7. VALIDASI DATA

### 7.1 Form Login
| Field | Aturan |
|---|---|
| `username` | required, string, max 100 |
| `password` | required, string |

### 7.2 Tambah Mahasiswa
| Field | Aturan |
|---|---|
| `nomor_sk` | required, string, max 100 |
| `tanggal_sk` | required, date, before_or_equal:today |
| `file_sk` | nullable, mimes:pdf,jpg,jpeg,png, max:5120 (KB) |
| `nim` | required, string, max 20, unique:mahasiswas |
| `nama` | required, string, max 255 |
| `prodi_id` | required, exists:prodis,id |
| `angkatan` | required, integer, between:2015,2030 |
| `kategori` | required, in:Reguler,Aspirasi |

### 7.3 Input IPK
| Field | Aturan |
|---|---|
| `semester` | required, integer, min:1, max:14 |
| `tahun_ajaran` | required, string, max 30 |
| `ipk` | required, numeric, between:0,4 |
| `file_khs` | nullable, mimes:pdf,jpg,jpeg, max:5120 |
| `mata_kuliah` | required, array, min:1 |
| `mata_kuliah.*.kode` | required, string, max 20 |
| `mata_kuliah.*.nama` | required, string, max 255 |
| `mata_kuliah.*.sks` | required, integer, between:1,6 |
| `mata_kuliah.*.nilai_huruf` | required, in:A,AB,B,BC,C,D,E |
| **Extra** | periode_input harus aktif |
| **Extra** | kombinasi (mahasiswa_id, semester) belum ada di DB |

### 7.4 Upload Dokumen
| Field | Aturan |
|---|---|
| `dokumen_jenis_id` | required, exists:dokumen_jenis,id |
| `file` | required, mimes:pdf,jpg,jpeg,png, max:5120 |

### 7.5 Tambah Prestasi
| Field | Aturan |
|---|---|
| `nama_prestasi` | required, string, max 255 |
| `tingkat` | required, in:Internasional,Nasional,Wilayah,Institusi |
| `pencapaian` | required, string, max 255 |
| `penyelenggara` | required, string, max 255 |
| `tanggal_mulai` | required, date |
| `tanggal_selesai` | required, date, after_or_equal:tanggal_mulai |
| `tempat` | required, string, max 255 |
| `deskripsi` | required, string |
| `link_penyelenggara` | nullable, url, max 500 |
| `file_sertifikat` | nullable, mimes:pdf,jpg,jpeg,png, max:5120 |
| `file_foto` | nullable, mimes:jpg,jpeg,png, max:5120 |

### 7.6 Tambah Organisasi
| Field | Aturan |
|---|---|
| `nama` | required, string, max 255 |
| `jabatan` | required, string, max 255 |
| `periode_mulai` | required, date |
| `periode_selesai` | required, date, after_or_equal:periode_mulai |
| `deskripsi` | required, string |
| `file_sk` | nullable, mimes:pdf,jpg,jpeg,png, max:5120 |

### 7.7 Terbitkan SP
| Field | Aturan |
|---|---|
| `mahasiswa_id` | required, exists:mahasiswas,id, status=Aktif |
| `level` | required, in:SP1,SP2,SP3 |
| `jenis_pelanggaran` | required, in:Akademik,Non-Akademik,Cuti Tanpa Izin |
| `deskripsi` | required, string, min:20 |
| `tanggal_terbit` | required, date |
| `batas_evaluasi` | required, date, after:tanggal_terbit |
| **Extra** | Jika jenis=Cuti Tanpa Izin → paksa level=SP3 |
| **Extra** | Level harus lebih besar dari SP aktif terakhir |

### 7.8 Ganti Password
| Field | Aturan |
|---|---|
| `password_lama` | required, matches current password |
| `password_baru` | required, string, min:8 |
| `konfirmasi` | required, same:password_baru |

### 7.9 Ajukan Bebas Tanggungan
| Kondisi | Aturan |
|---|---|
| Semua 5 dokumen wajib | harus berstatus `Disetujui` |
| IPK terakhir | ≥ nilai `ipk_minimum` di konfigurasi |
| SP aktif | tidak boleh ada SP dengan status `Aktif` atau `Masa Tenggang` |
| SKS | `sksDitempuh` ≥ `sksTotal` (144) |
| Belum pernah ajukan | `bebas_tanggungans` belum ada untuk mahasiswa ini |

### 7.10 Kembalikan Laporan (Warek)
| Field | Aturan |
|---|---|
| `catatan` | required, string, min:10 |

---

## 8. FILE UPLOAD STRATEGY

### 8.1 Konfigurasi Storage

```php
// config/filesystems.php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root'   => storage_path('app/public'),
        'url'    => env('APP_URL').'/storage',
    ],
]
```

Jalankan: `php artisan storage:link`

### 8.2 Struktur Folder Storage

```
storage/app/public/
├── sk_mahasiswa/       -- Scan SK KIP-K per mahasiswa
│   └── {nim}/
├── dokumen/            -- Dokumen kewajiban mahasiswa
│   └── {nim}/{jenis}/
├── prestasi/           -- File prestasi
│   └── {nim}/
│       ├── sertifikat/
│       └── foto/
├── organisasi/         -- SK Organisasi
│   └── {nim}/
├── pelatihan/          -- Sertifikat pelatihan
│   └── {nim}/
├── khs/                -- Kartu Hasil Studi
│   └── {nim}/
├── profil/             -- Foto profil
│   └── {nim}/
└── logo/               -- Logo institusi
```

### 8.3 URL Pattern

```php
// Akses file:
URL::to('/storage/dokumen/2206001/PKKMB/pkkmb_2206001.pdf')
// atau via API dengan auth:
GET /api/dokumen/{id}/file  → stream file dengan header Content-Type
```

> [!NOTE]
> File yang sensitif (dokumen mahasiswa) sebaiknya dilayani **via controller** (bukan direct URL), supaya bisa dicek auth & permission sebelum file dikirim ke browser.

---

## 9. ALUR KOMUNIKASI FRONTEND ↔ BACKEND

### 9.1 Alur Login

```
Frontend                        Backend
─────────────────────────────────────────────────────
1. User input username + password
2. authService.login()
3. POST /api/auth/login  ────────────────────────→  Validate credential
                                                     Buat Sanctum token
                         ←──────────────────────    {user, token, redirect_path}
4. Simpan ke localStorage:
   simkip_token = token
   simkip_user  = JSON.stringify(user)
5. Navigate ke redirect_path
```

### 9.2 Alur Setiap Request API

```
Frontend                        Backend
─────────────────────────────────────────────────────
1. api.get('/mahasiswa')
2. HTTP GET /api/mahasiswa
   Header: Authorization: Bearer {simkip_token}  ──→  auth:sanctum middleware
                                                       role:admin middleware
                                                       Controller logic
                         ←──────────────────────    JSON response
3. Display data di komponen React
```

### 9.3 Alur Upload File

```
Frontend                        Backend
─────────────────────────────────────────────────────
1. User drag/drop file
2. POST /api/mahasiswa/dokumen
   Content-Type: multipart/form-data
   Body: { dokumen_jenis_id: 1, file: [File object] }  ──→  Validate file
                                                              Store file
                                                              Update DB
                         ←──────────────────────    { success: true, dokumen: {...} }
3. Update state UI (status → "Menunggu")
```

### 9.4 Alur Validasi Dokumen (Admin)

```
Admin Frontend              Backend              Mahasiswa Frontend
────────────────────────────────────────────────────────────────────
1. Lihat antrian dokumen
   GET /api/dokumen/queue  ──→  Query DB
                         ←──   dokumen[]

2. Klik "Setujui"
   PATCH /api/dokumen/1/approve  ──→  Update status = 'Disetujui'
                                       Catat audit_log
                                       Insert notification → mahasiswa
                          ←──  { success: true }

3. State antrian update

                                          4. Mahasiswa buka app:
                                             GET /api/notifications/count
                                         ←── { count: 1 }
                                          5. Buka notifikasi:
                                             "Dokumen PKKMB Anda telah disetujui"
```

### 9.5 Alur Approval Laporan (Warek)

```
Admin               Backend              Warek
────────────────────────────────────────────────────────
1. Buat laporan (Draft)
   POST /api/laporan  ──→  Insert laporan status='Draft'
                    ←──   { id: 1, status: 'Draft' }

2. Submit ke Warek
   PATCH /api/laporan/1/submit  ──→  Update status='Diajukan'
                                      Insert notification → warek
                    ←──   { status: 'Diajukan' }

                                   3. Warek terima notifikasi
                                      GET /api/laporan  (tab Menunggu)
                                      GET /api/laporan/1

                                   4. Warek approve:
                                      PATCH /api/laporan/1/approve  ──→  Update status='Disetujui'
                                                                          Insert laporan_review
                                                                          Insert notification → admin
                                                                          Generate TTD QR placeholder
                                                          ←──  { status: 'Disetujui' }
```

---

## 10. AUDIT LOG STRATEGY

Setiap aksi penting di backend **otomatis** mencatat ke `audit_logs` via middleware atau `observe()` model.

| Aksi | Jenis Log | Keterangan |
|---|---|---|
| Login | Login | User, IP, timestamp |
| Tambah mahasiswa | Ubah | NIM baru, dibuat oleh siapa |
| Hapus mahasiswa | Hapus | NIM, nama, siapa yang hapus |
| Upload dokumen | Validasi | NIM, jenis dokumen |
| Approve/reject dokumen | Validasi | Dokumen apa, mahasiswa siapa |
| Terbitkan SP | SP | Level, NIM mahasiswa |
| Ubah status SP | SP | SP berapa, status baru |
| Approve bebas tanggungan | Approve | NIM mahasiswa |
| Submit laporan | Laporan | Nomor laporan |
| Approve laporan | Approve | Laporan oleh Warek siapa |
| Ubah konfigurasi | Ubah | Key apa yang diubah |
| Ekspor data | Ekspor | Format, filter yang digunakan |

---

## 11. NOTIFIKASI

Backend menginsert ke tabel `notifications` pada event berikut:

```php
// Contoh helper:
Notification::send($mahasiswa->user, [
    'judul' => 'Dokumen PKKMB Disetujui',
    'pesan' => 'Dokumen PKKMB Anda telah diverifikasi dan disetujui.',
    'tipe'  => 'success',
    'link'  => '/mahasiswa/dokumen',
]);
```

| Event | Target | Tipe |
|---|---|---|
| Upload dokumen baru | Admin (semua admin) | info |
| Dokumen disetujui | Mahasiswa | success |
| Dokumen ditolak | Mahasiswa | error |
| SP diterbitkan | Mahasiswa | warning |
| Bebas tanggungan disetujui | Mahasiswa | success |
| Bebas tanggungan ditolak | Mahasiswa | error |
| Laporan disubmit | Warek | info |
| Laporan disetujui | Admin | success |
| Laporan dikembalikan | Admin | warning |
| Prestasi divalidasi | Mahasiswa | success/error |

---

## 12. PDF GENERATION

Backend perlu generate 2 jenis PDF:

### 12.1 Surat Keterangan Penyelesaian Studi
- Digunakan di: Bebas Tanggungan → status Diterbitkan
- Endpoint: `GET /api/bebas-tanggungan/:id/pdf`
- Template: Kop surat ITG, identitas mahasiswa, checklist kewajiban, TTD pengelola + warek

### 12.2 Laporan Evaluasi Semester
- Digunakan di: Laporan → status Disetujui
- Endpoint: `GET /api/laporan/:id/pdf`
- Template: Kop ITG, statistik semester, chart distribusi IPK (embed sebagai image), tabel sample, TTD admin + QR warek

**Library:** `barryvdh/laravel-dompdf`

---

## 13. EXCEL EXPORT

Endpoint: `POST /api/prodi/ekspor` dan `POST /api/admin/ekspor` (jika diperlukan)

**Kolom default Excel:**
NIM | Nama | Angkatan | Kategori | IPK Terakhir | Semester | SP | Status

**Kolom kondisional (berdasarkan checkbox frontend):**
- `sertakanIPK` → kolom IPK per semester (1..8)
- `sertakanDokumen` → kolom PKKMB, MABIM, Bela Negara, Sertifikasi, Berita Acara KP
- `sertakanSP` → kolom riwayat SP

**Library:** `maatwebsite/excel`

---

## 14. ROADMAP IMPLEMENTASI

### Phase 1 — Foundation & Auth (Prioritas Tertinggi)
> Estimasi: 2-3 hari

- [ ] Setup Laravel project + install Sanctum
- [ ] Buat semua migrations (20 tabel)
- [ ] Buat semua Seeders (prodis, konfigurasis, dokumen_jenis, users default)
- [ ] Implementasi `POST /api/auth/login`
- [ ] Implementasi `GET /api/auth/me`
- [ ] Implementasi `POST /api/auth/logout`
- [ ] Buat middleware `CheckRole`
- [ ] Buat middleware `LogActivity` (auto audit log)
- [ ] Setup Storage & file serving controller
- [ ] Test auth flow end-to-end dengan frontend

**Deliverable:** Semua 4 role bisa login, token valid, redirect berjalan

---

### Phase 2 — Manajemen Mahasiswa (Admin Core)
> Estimasi: 2-3 hari

- [ ] `GET /api/mahasiswa` dengan semua filter + pagination + `ipk_delta`
- [ ] `GET /api/mahasiswa/check-nim/:nim`
- [ ] `POST /api/mahasiswa` dengan upload file SK + auto-create user
- [ ] `GET /api/mahasiswa/:id` (detail lengkap)
- [ ] `DELETE /api/mahasiswa/:id` (dengan konfirmasi NIM)
- [ ] `GET /api/admin/dashboard` (stats + chart data)
- [ ] Test halaman Admin: MahasiswaList, TambahMahasiswa

**Deliverable:** Admin bisa lihat, tambah, hapus mahasiswa

---

### Phase 3 — IPK, Dokumen, SP (Core Business)
> Estimasi: 3-4 hari

- [ ] `POST /api/mahasiswa/ipk` + `GET /api/mahasiswa/ipk` (mahasiswa)
- [ ] `GET /api/mahasiswa/:id/ipk` (admin/prodi/warek)
- [ ] `GET /api/akademik/ipk` (admin semua mahasiswa)
- [ ] `GET /api/mahasiswa/dashboard` (mahasiswa)
- [ ] `GET /api/dokumen/queue` + `PATCH approve/reject`
- [ ] `POST /api/mahasiswa/dokumen` + `GET /api/mahasiswa/dokumen`
- [ ] `GET/POST /api/sp` + `PATCH /api/sp/:id/status`
- [ ] `GET /api/mahasiswa/sp`
- [ ] Validasi urutan SP di backend
- [ ] Test: InputIPK, DokumenQueue, TerbitkanSP, SPMahasiswa

**Deliverable:** Alur IPK, dokumen, dan SP berjalan penuh

---

### Phase 4 — Non-Akademik & Bebas Tanggungan
> Estimasi: 2-3 hari

- [ ] CRUD Prestasi (mahasiswa) + validasi (admin)
- [ ] CRUD Organisasi (mahasiswa) + validasi (admin)
- [ ] CRUD Pelatihan (mahasiswa) + validasi (admin)
- [ ] `GET /api/akademik/prestasi|organisasi|pelatihan` (admin DataAkademik)
- [ ] `GET/POST /api/mahasiswa/bebas-tanggungan` dengan checklist logic
- [ ] `GET /api/bebas-tanggungan` + `PATCH approve/reject` (admin)
- [ ] Test: Prestasi, Organisasi, Pelatihan, BebasTanggungan

**Deliverable:** Seluruh alur mahasiswa selesai

---

### Phase 5 — Laporan, Prodi, Warek
> Estimasi: 2-3 hari

- [ ] `GET/POST/PUT /api/laporan` (admin)
- [ ] `PATCH /api/laporan/:id/submit|approve|return`
- [ ] `GET /api/prodi/dashboard` + `GET /api/prodi/mahasiswa`
- [ ] `GET /api/warek/dashboard` + `GET /api/laporan` (warek)
- [ ] `POST /api/prodi/ekspor` (Excel/PDF)
- [ ] PDF generation: Laporan + Surat Bebas Tanggungan
- [ ] Test: SusunLaporan, LaporanDetail (admin), WarekLaporanDetail

**Deliverable:** Seluruh alur laporan dan approval warek berjalan

---

### Phase 6 — Konfigurasi, Notifikasi, Profil, Audit
> Estimasi: 2-3 hari

- [ ] `GET/PUT /api/konfigurasi` + master prodi + master dokumen_jenis + grade
- [ ] `GET/PUT /api/profile` + `POST /api/profile/password`
- [ ] `GET /api/notifications` + count + mark-read
- [ ] `GET /api/audit` dengan filter
- [ ] Implementasi auto-insert notifikasi pada semua event penting
- [ ] Test: Konfigurasi, Profil, AuditLog, Notifikasi bell

**Deliverable:** Sistem lengkap dan siap production

---

## 15. INTEGRASI FRONTEND PER HALAMAN

### ✅ Checklist Integrasi per Halaman

#### ADMIN
| Halaman | Service/Endpoint | Status Integrasi |
|---|---|---|
| Login | `POST /api/auth/login` | ⬜ Belum |
| Dashboard | `GET /api/admin/dashboard` | ⬜ Belum |
| MahasiswaList | `GET /api/mahasiswa` | ⬜ Belum |
| TambahMahasiswa | `POST /api/mahasiswa` + check-nim | ⬜ Belum |
| MahasiswaDetail | `GET /api/mahasiswa/:id` + semua sub-resource | ⬜ Belum |
| DataAkademik (tab IPK) | `GET /api/akademik/ipk` | ⬜ Belum |
| DataAkademik (tab Non-Akademik) | `GET /api/akademik/prestasi|organisasi|pelatihan` | ⬜ Belum |
| DokumenQueue | `GET /api/dokumen/queue` + approve/reject | ⬜ Belum |
| SPList | `GET /api/sp` | ⬜ Belum |
| TerbitkanSP | `POST /api/sp` | ⬜ Belum |
| SPDetail | `GET /api/sp/:id` + `PATCH status` | ⬜ Belum |
| BebasTanggunganList | `GET /api/bebas-tanggungan` | ⬜ Belum |
| BebasTanggunganDetail | `GET /api/bebas-tanggungan/:id` + approve/reject | ⬜ Belum |
| LaporanList | `GET /api/laporan` | ⬜ Belum |
| SusunLaporan | `POST /api/laporan` | ⬜ Belum |
| LaporanDetail | `GET /api/laporan/:id` + submit | ⬜ Belum |
| Konfigurasi | `GET/PUT /api/konfigurasi` | ⬜ Belum |
| AuditLog | `GET /api/audit` | ⬜ Belum |

#### MAHASISWA
| Halaman | Service/Endpoint | Status Integrasi |
|---|---|---|
| Dashboard | `GET /api/mahasiswa/dashboard` | ⬜ Belum |
| InputIPK | `GET/POST /api/mahasiswa/ipk` | ⬜ Belum |
| Prestasi | `GET/POST/PUT/DELETE /api/mahasiswa/prestasi` | ⬜ Belum |
| Organisasi | `GET/POST/PUT/DELETE /api/mahasiswa/organisasi` | ⬜ Belum |
| Pelatihan | `GET/POST/PUT/DELETE /api/mahasiswa/pelatihan` | ⬜ Belum |
| UploadDokumen | `GET/POST /api/mahasiswa/dokumen` | ⬜ Belum |
| ArsipDigital | `GET /api/mahasiswa/arsip` | ⬜ Belum |
| SPMahasiswa | `GET /api/mahasiswa/sp` | ⬜ Belum |
| BebasTanggungan | `GET/POST /api/mahasiswa/bebas-tanggungan` | ⬜ Belum |
| Profil | `GET/PUT /api/profile` + password | ⬜ Belum |

#### PRODI
| Halaman | Service/Endpoint | Status Integrasi |
|---|---|---|
| Dashboard | `GET /api/prodi/dashboard` | ⬜ Belum |
| MahasiswaList | `GET /api/prodi/mahasiswa` | ⬜ Belum |
| MahasiswaDetail | `GET /api/mahasiswa/:id` (read-only) | ⬜ Belum |
| EksporLaporan | `POST /api/prodi/ekspor` + preview | ⬜ Belum |

#### WAREK
| Halaman | Service/Endpoint | Status Integrasi |
|---|---|---|
| Dashboard | `GET /api/warek/dashboard` | ⬜ Belum |
| LaporanList | `GET /api/laporan` | ⬜ Belum |
| LaporanDetail | `GET /api/laporan/:id` + approve/return | ⬜ Belum |
| MahasiswaList | `GET /api/mahasiswa` (read-only) | ⬜ Belum |

#### SHARED
| Fitur | Endpoint | Status Integrasi |
|---|---|---|
| Notifikasi Bell (count) | `GET /api/notifications/count` | ⬜ Belum |
| Notifikasi Dropdown | `GET /api/notifications` | ⬜ Belum |
| Topbar Profil Info | dari `simkip_user` di localStorage | N/A |

---

## 16. STRUKTUR FOLDER LARAVEL (REKOMENDASI)

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── Auth/
│   │       │   └── AuthController.php
│   │       ├── Admin/
│   │       │   ├── DashboardController.php
│   │       │   ├── MahasiswaController.php
│   │       │   ├── DokumenController.php
│   │       │   ├── SPController.php
│   │       │   ├── BebasTanggunganController.php
│   │       │   ├── LaporanController.php
│   │       │   ├── DataAkademikController.php
│   │       │   ├── KonfigurasiController.php
│   │       │   └── AuditController.php
│   │       ├── Mahasiswa/
│   │       │   ├── DashboardController.php
│   │       │   ├── IPKController.php
│   │       │   ├── PrestasiController.php
│   │       │   ├── OrganisasiController.php
│   │       │   ├── PelatihanController.php
│   │       │   ├── DokumenController.php
│   │       │   └── BebasTanggunganController.php
│   │       ├── Prodi/
│   │       │   ├── DashboardController.php
│   │       │   ├── MahasiswaController.php
│   │       │   └── EksporController.php
│   │       ├── Warek/
│   │       │   ├── DashboardController.php
│   │       │   └── LaporanController.php
│   │       ├── ProfileController.php
│   │       └── NotificationController.php
│   ├── Middleware/
│   │   ├── CheckRole.php
│   │   └── LogActivity.php
│   └── Requests/                   -- Form Request validation
│       ├── LoginRequest.php
│       ├── StoreMahasiswaRequest.php
│       ├── StoreIPKRequest.php
│       ├── StoreDokumenRequest.php
│       ├── StorePrestasiRequest.php
│       ├── StoreOrganisasiRequest.php
│       ├── StorePelatihanRequest.php
│       └── StoreSPRequest.php
├── Models/
│   ├── User.php
│   ├── Prodi.php
│   ├── Mahasiswa.php
│   ├── IPKSemester.php
│   ├── MataKuliah.php
│   ├── DokumenJenis.php
│   ├── Dokumen.php
│   ├── SuratPeringatan.php
│   ├── Prestasi.php
│   ├── Organisasi.php
│   ├── Pelatihan.php
│   ├── BebasTanggungan.php
│   ├── Laporan.php
│   ├── LaporanReview.php
│   ├── Konfigurasi.php
│   ├── AuditLog.php
│   └── Notification.php
├── Services/                       -- Business Logic
│   ├── IPKCalculatorService.php    -- hitung nilai mutu, cek lulus
│   ├── SPValidationService.php     -- validasi urutan SP
│   ├── BebasTanggunganService.php  -- cek semua syarat
│   ├── NotificationService.php     -- kirim notifikasi
│   ├── PdfGeneratorService.php     -- generate PDF
│   └── ExcelExportService.php      -- export Excel
└── Observers/                      -- Auto audit log
    ├── MahasiswaObserver.php
    ├── DokumenObserver.php
    ├── SPObserver.php
    └── LaporanObserver.php

database/
├── migrations/                     -- 1 file per tabel
├── seeders/
│   ├── DatabaseSeeder.php
│   ├── ProdiSeeder.php
│   ├── UserSeeder.php              -- default users semua role
│   ├── KonfigurasiSeeder.php
│   └── DokumenJenisSeeder.php
└── factories/
    └── MahasiswaFactory.php        -- untuk testing

routes/
└── api.php                         -- semua route API (menggantikan web.php untuk SPA)
```

---

## 17. ENV CONFIGURATION

```bash
# .env additions untuk SIMKIP
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Storage
FILESYSTEM_DISK=public

# Mail (untuk reset password jika diperlukan nanti)
MAIL_MAILER=smtp
```

**Tambahan di `config/cors.php`:**
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => false,  // token-based, bukan cookie
```

---

## 18. CATATAN PENTING INTEGRASI

> [!WARNING]
> **Jangan ubah nama field di response API!** Frontend sudah hard-code nama field seperti `nim`, `nama`, `ipk`, `sp`, `kategori`, `prodi`, `angkatan`. Jika nama field berubah, frontend akan break tanpa perubahan kode.

> [!IMPORTANT]
> **Status Enum harus persis sama** dengan yang digunakan frontend:
> - SP: `"Aktif"`, `"Masa Tenggang"`, `"Pemberhentian"`, `"Selesai"`
> - Dokumen: `"Menunggu"`, `"Disetujui"`, `"Ditolak"`
> - Prestasi: `"Menunggu Validasi"`, `"Disetujui"`, `"Ditolak"`
> - Laporan: `"Draft"`, `"Diajukan"`, `"Disetujui"`, `"Dikembalikan"` *(bukan Ditolak)*
> - Bebas Tanggungan: `"Menunggu"`, `"Diterbitkan"`, `"Ditolak"`

> [!NOTE]
> **Pagination**: Frontend menggunakan field `total_pages` (bukan `last_page`). Pastikan response pagination menggunakan format yang sama dengan yang ada di `types/index.ts` frontend: `{ data, total, page, limit, totalPages }`.

> [!CAUTION]
> **CORS**: Frontend berjalan di port 5173, backend di 8000. Konfigurasi CORS di Laravel wajib mengizinkan origin frontend sebelum integrasi bisa dilakukan.

---

*Planning ini dibuat berdasarkan analisis mendalam seluruh 30+ halaman frontend SIMKIP-ITG.*
*Versi: 1.0 | Tanggal: 22 Agustus 2026*
