# SIMKIP-ITG

**Sistem Monitoring KIP Kuliah — Institut Teknologi Garut**

Sistem informasi berbasis web untuk memantau dan mengelola penerima beasiswa KIP Kuliah (KIP-K) di Institut Teknologi Garut. Mengelola profil mahasiswa, rekam akademik (IPK/IP/SKS per semester), dokumen wajib, surat peringatan, bebas tanggungan, hingga penerbitan laporan resmi — dengan peran admin, mahasiswa, program studi, dan wakil rektor III.

---

## Fitur Utama

### Admin / Pengelola KIP-K (`/admin`)

- **Dashboard Statistik** — total mahasiswa aktif, distribusi kategori (Reguler/Aspirasi), status dicabut, sebaran per program studi dan angkatan, filter Tahun Ajaran
- **Kelola Mahasiswa** — CRUD mahasiswa, pencarian & filter (prodi, angkatan, kategori, status, IPK, SP), SK penerimaan, pencabutan KIP-K dengan alasan & catatan, riwayat status
- **Validasi KHS / IPK** — approve/tolak input KHS per mahasiswa dengan catatan, lihat rincian mata kuliah per semester
- **Queue Dokumen** — validasi dokumen wajib yang diunggah mahasiswa (PKKMB, MABIM, Bela Negara, Sertifikasi, Berita Acara KP)
- **Surat Peringatan (SP)** — terbitkan SP1/SP2/SP3 sesuai pelanggaran via `SPValidationService`:
  - Mahasiswa harus berstatus Aktif
  - Pelanggaran "Cuti Tanpa Izin" otomatis langsung SP3
  - Satu SP aktif per level; SP3 mensyaratkan SP1 + SP2 sudah diterbitkan
  - SP3 yang disahkan menetapkan status mahasiswa menjadi Dicabut
- **Bebas Tanggungan** — proses pengajuan menjadi surat resmi (Menunggu/Diproses/Disetujui/Ditolak), nomor surat otomatis, unduh PDF SK
- **Laporan** — susun laporan KIP-K (statistik otomatis), submit ke Warek, unduh Excel (.xlsx) dan PDF
- **Konfigurasi** — master program studi, jenis dokumen (+ field custom), jenis pelanggaran, nilai mutu (cached), periode akademik, pengaturan global (IPK minimum, batas semester, SKS kelulusan, identitas institusi)
- **Audit Log** — seluruh aktivitas tercatat (login, perubahan status, validasi, penerbitan SP) dengan filter pencarian

### Mahasiswa (`/mahasiswa`)

- **Dashboard** — ringkasan status akun, IPK terakhir, semester, kelengkapan dokumen, peringatan aktif; time-travel antar Tahun Ajaran
- **Input KHS / IPK** — unggah KHS per semester dengan rincian mata kuliah, perhitungan IPS/IPK otomatis via `IPKCalculatorService`, draft -> kirim ke admin untuk validasi; hanya dalam periode input aktif
- **Dokumen Wajib** — unggah dokumen sesuai jenis & kolom custom yang dikonfigurasi admin; hanya dokumen Ditolak yang dapat dihapus dan diunggah ulang
- **Prestasi / Organisasi / Pelatihan** — input portofolio non-akademik dengan file (sertifikat/foto), menunggu validasi admin
- **Arsip Digital** — kumpulan file yang sudah disetujui dalam satu arsip dengan deteksi tipe gambar/PDF
- **Surat Peringatan** — melihat daftar SP aktif/masa tenggang dan statusnya
- **Bebas Tanggungan** — melihat checklist 5 syarat kelayakan, lalu mengajukan permohonan

### Program Studi (`/prodi`)

- **Dashboard Prodi** — statistik per prodi: total aktif, Reguler/Aspirasi, SP aktif, IPK di bawah 3.0, grafik per angkatan
- **Mahasiswa** — daftar & detail mahasiswa prodi sendiri, rekap IPK/riwayat per semester, ekspor Data Mahasiswa dalam bentuk Excel/PDF
- **Laporan** — melihat laporan yang sudah disetujui dan ditujukan ke prodi

### Wakil Rektor III (`/warek`)

- **Dashboard** — ringkasan data seluruh mahasiswa, statistik, daftar laporan
- **Laporan** — setujui / kembalikan laporan dari admin, lihat detail statistik, unduh hasil
- **Mahasiswa** — lihat data seluruh mahasiswa lintas prodi (read-only), ekspor

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13.17, PHP ^8.3 |
| Auth | Laravel Sanctum 4 (Bearer Token) |
| Database | MySQL 8.4 (Docker) / SQLite (lokal) |
| ORM | Eloquent (33 tabel) |
| Frontend | React 18, TypeScript, React Router 7, Tailwind CSS 4 |
| Build | Vite 8 |
| Rendering | Inertia.js (SPA fallback) |
| Excel/PDF | maatwebsite/excel 4, laravel-dompdf 3 |
| Routing | tightenco/ziggy 2 |
| UI | Radix UI, Lucide icons, Recharts, Framer Motion |
| Dev | laravel/breeze 2.4, fakerphp (id_ID), Laravel Pint |

---

## Arsitektur

```
Request
  -> routes/api.php
  -> Dispatcher Controllers (role-based match)
       |
       +-- Admin/        (admin, warek)
       +-- Mahasiswa/    (mahasiswa self)
       +-- Prodi/        (prodi scoped)
       +-- Warek/        (warek read-only)
       |
  -> Services
       +-- BebasTanggunganService   (checklist kelayakan 5 syarat)
       +-- IPKCalculatorService     (nilai mutu cached, hitung IPS/IPK, carry-over)
       +-- SPValidationService      (aturan penerbitan SP1/SP2/SP3)
       +-- PdfGeneratorService      (SK Bebas Tanggungan & Laporan via DOMPDF)
       +-- ExcelExportService       (MahasiswaExport / LaporanExport)
       +-- TahunAjaranHelper        (parsing & filter rentang TA)
  -> Models (20+ Eloquent models)
  -> Resources (14 API resources)
```

### Alur Autentikasi

1. `POST /api/auth/login` (throttle:5,1) -> validasi username + password -> `createToken('simkip_token')` -> `{ user, token, redirectPath, mustChangePassword }`
2. Token dikirim selaku Bearer; setiap request menetapkan `X-Requested-With: XMLHttpRequest` dan `Accept: application/json`
3. Role middleware (`CheckRole`) -> JSON 403 "Akses ditolak"
4. Mode mock (development): `?role=admin|mahasiswa|prodi|warek` me-bypass login via `HandleInertiaRequests`

---

## Penyiapan

### Prasyarat

- PHP ^8.3
- Composer
- Node.js ^22

### Lokal (SQLite)

```bash
composer install --ignore-scripts --no-interaction
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
npm install
npm run dev
```

Atau satu perintah:

```bash
composer setup
```

Script `setup` otomatis: install -> copy `.env` -> `key:generate` -> `migrate --force` -> `npm install --ignore-scripts` -> `npm run build`.

Server Vite di `http://localhost:5173`, API di `http://localhost:8000/api`.

### Docker

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Nginx (app) | `http://localhost:8000` |
| Node (Vite) | `http://localhost:5174` |
| MySQL | `localhost:3308` |

Konfigurasi Docker:
- Database: `simokip`, user: `simokip`, password: `root`
- Seed: `docker compose exec app php artisan db:seed --force`

---

## Akun Demo (Seeder)

### Akun Staff

| Role | Username | Password | Nama |
|------|----------|----------|------|
| Admin | `admin` | `admin123` | Encep Jianul Hayat |
| Warek III | `warek3` | `warek123` | Dr. Rina Kurniawati, S.E., M.Si. |
| Prodi TI | `prodi_ti` | `prodi123` | Kaprodi Teknik Informatika |
| Prodi SI | `prodi_si` | `prodi123` | Kaprodi Sistem Informasi |

### Akun Mahasiswa (Deterministik)

| NIM | Password | Nama | Prodi |
|-----|----------|------|-------|
| `2206001` | `kip22060012026` | Ahmad Rifaldi | TI |
| `2206015` | `kip22060152026` | Budi Setiawan | TI |
| `2206033` | `kip22060332026` | Citra Dewi | TI |
| `2306005` | `kip23060052026` | Eka Saputra | TI |
| `2306018` | `kip23060182026` | Fani Rahayu | SI |
| `2306064` | `password` | Kailla Salsabila | TI |
| `2307094` | `password123` | Zaki Muhamad | SI |

### Akun Uji Bebas Tanggungan

Seluruh password: `password`

| NIM | Nama | Skenario |
|-----|------|----------|
| `2507101` | Ahmad Rizky Pratama | Dokumen Bela Negara belum diunggah |
| `2507102` | Siti Nurhaliza | IPK 2.95 < 3.00 |
| `2507103` | Muhammad Fadilah | Ada SP1 Aktif |
| `2507104` | Putri Amelia Sari | SKS 140 < 144 |
| `2507105` | Dimas Agung Wicaksono | 1 MK belum lulus (Pemrograman Web) |
| `2507106` | Rina Marlina | Semua syarat terpenuhi |
| `2507107` | Farhan Maulana Ibrahim | Dokumen MABIM ditolak admin |

### Akun Tambahan

- `MahasiswaBatchSeeder` — 125 mahasiswa (5 prodi x 5 angkatan x 3), password: `password`
- `MockDataSeeder` — ~28 akun random via factory, password: `kip2026`

> Akun mahasiswa dengan `is_password_changed = false` akan dipaksa ganti kata sandi saat login pertama (middleware `force_password_change`).

---

## Konfigurasi Global

Tersimpan di tabel `konfigurasis`, diakses via Admin -> Konfigurasi.

| Key | Default | Tipe | Keterangan |
|-----|---------|------|------------|
| `ipk_minimum` | 3.0 | number | IPK minimum untuk Bebas Tanggungan |
| `max_semester` | 8 | number | Batas maksimal semester |
| `sks_minimum_lulus` | 144 | number | SKS minimum untuk kelulusan |
| `nama_institusi` | Institut Teknologi Garut | text | |
| `singkatan_institusi` | ITG | text | |
| `alamat_institusi` | Jl. Mayor Syamsu No.1, Garut 44151 | text | |
| `telp_institusi` | (0262) 540895 | text | |
| `logo_institusi` | - | text | Base64/URL |
| `periode_input_aktif` | 1 | boolean | Aktif/tidak periode input nilai |
| `periode_input_buka` | 2026-08-01 | date | Tanggal buka input |
| `periode_input_tutup` | 2026-09-30 | date | Tanggal tutup input |
| `periode_input_tahun_ajaran` | null | text | TA untuk periode input |
| `tahun_akademik_aktif` | 2025/2026 | text | |
| `semester_aktif` | Genap | text | Ganjil/Genap |

Mengaktifkan periode akademik (`periode_akademiks`) oleh admin otomatis menyinkronkan `periode_input_aktif/buka/tutup/tahun_ajaran` via `PeriodeAkademikObserver`.

---

## Basis Data

### Ringkasan Tabel (33 tabel)

| Grup | Tabel | Keterangan |
|------|-------|------------|
| Identitas | `prodis` | Program studi (kode, nama) |
| | `users` | Akun pengguna (role enum, is_password_changed) |
| | `mahasiswas` | Data mahasiswa (status: Aktif/Lulus/Cuti/Nonaktif/Dicabut; kategori: Reguler/Aspirasi) |
| Akademik | `ipk_semestrs` | IPK per semester (status: Menunggu/Disetujui/Ditolak/Draft/Diajukan) |
| | `mata_kuliahs` | Mata kuliah per semester |
| | `nilai_mutus` | Master nilai mutu (huruf -> poin, lulus/tidak) |
| Dokumen | `dokumen_jenis` | Jenis dokumen (wajib/pilihan) |
| | `dokumen_jenis_fields` | Field custom per jenis dokumen |
| | `dokumens` | Dokumen yang diunggah mahasiswa |
| | `dokumen_field_values` | Nilai field custom per dokumen |
| Non-Akademik | `prestasis` | Prestasi mahasiswa |
| | `organisasis` | Keanggotaan organisasi |
| | `pelatihans` | Pelatihan yang diikuti |
| Disiplin | `surat_peringatans` | Surat peringatan (SP1/SP2/SP3) |
| | `jenis_pelanggarans` | Master jenis pelanggaran (eskalasi) |
| Bebas Tanggungan | `bebas_tanggungans` | Pengajuan bebas tanggungan |
| | `bebas_tanggungan_histories` | Riwayat review bebas tanggungan |
| Laporan | `laporans` | Laporan KIP-K |
| | `laporan_reviews` | Review laporan oleh Warek |
| Sistem | `konfigurasis` | Pengaturan global |
| | `periode_akademiks` | Periode akademik |
| | `audit_logs` | Log aktivitas |
| | `notifications` | Notifikasi pengguna |
| | `catatan_internals` | Catatan internal admin |
| | `contact_histories` | Riwayat perubahan kontak |
| Framework | `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `password_reset_tokens`, `personal_access_tokens` | Laravel framework tables |

---

## Struktur Direktori

```
app/
  Http/
    Controllers/Api/
      Admin/                  # 9 controllers (Dashboard, Mahasiswa, DataAkademik, Laporan, BebasTanggungan, Dokumen, SP, Konfigurasi, Audit)
      Mahasiswa/              # 8 controllers (Dashboard, Arsip, Prestasi, Organisasi, Pelatihan, IPK, Dokumen, BebasTanggungan)
      Prodi/                  # 3 controllers (Dashboard, Mahasiswa, Laporan)
      Warek/                  # 3 controllers (Dashboard, Mahasiswa, Laporan)
      *.php                   # 14 dispatcher controllers (role-based routing)
    Middleware/
      CheckRole.php           # Role-based access control
      ForcePasswordChange.php # Paksa ganti password
      HandleInertiaRequests.php
    Resources/                # 14 API resources (CamelCase base)
    Requests/                 # LoginRequest, ProfileUpdateRequest
  Models/                     # 26 Eloquent models
  Services/
    BebasTanggunganService.php
    IPKCalculatorService.php
    SPValidationService.php
    PdfGeneratorService.php
    ExcelExportService.php
  Helpers/
    TahunAjaranHelper.php
  Exports/
    MahasiswaExport.php
    LaporanExport.php
    GenericArrayExport.php
  Observers/
    PeriodeAkademikObserver.php

resources/js/
  pages/
    admin/        # 16 pages
    student/      # 10 pages
    prodi/        # 6 pages
    warek/        # 5 pages
  services/
    api.ts        # Axios wrapper, token management
  context/
    AuthContext.tsx
  components/     # Shared UI components
  constants/      # Status definitions, etc.
  types/          # TypeScript type definitions
  utils/          # Utility functions

database/
  migrations/     # 4 migration files (33 tables)
  seeders/        # 12 seeders
  factories/      # Model factories

routes/
  api.php         # 235 lines, ~70 endpoints
  web.php         # Inertia SPA fallback
  auth.php        # Breeze auth routes
  console.php     # Artisan commands

docker/
  php/Dockerfile
  nginx/default.conf

docs/
  lsiped-api-spec.md
  lsiped-api-spec.json
  lsiped-api-spec.pdf
```

---

## Endpoint API Utama

| Method | Endpoint | Role | Keterangan |
|--------|----------|------|------------|
| POST | `/api/auth/login` | Public | Login (throttle:5,1) |
| POST | `/api/auth/logout` | Auth | Logout |
| GET | `/api/auth/me` | Auth | Data user saat ini |
| GET | `/api/dashboard` | Auth | Dashboard (dispatch per role) |
| GET/POST | `/api/mahasiswa` | Admin/Prodi/Warek | CRUD mahasiswa |
| GET | `/api/mahasiswa/{id}` | Auth | Detail mahasiswa |
| PATCH | `/api/mahasiswa/{id}/cabut-kipk` | Admin | Pencabutan KIP-K |
| GET/POST | `/api/ipk` | Auth | Data IPK per semester |
| POST | `/api/ipk/submit` | Mahasiswa | Submit KHS ke admin |
| GET/POST | `/api/prestasi` | Auth | Prestasi mahasiswa |
| GET/POST | `/api/organisasi` | Auth | Organisasi mahasiswa |
| GET/POST | `/api/pelatihan` | Auth | Pelatihan mahasiswa |
| GET/POST | `/api/dokumen` | Mahasiswa | Dokumen wajib |
| GET | `/api/arsip` | Mahasiswa | Arsip digital |
| GET/POST | `/api/sp` | Admin | Surat peringatan |
| GET/POST | `/api/bebas-tanggungan` | Auth | Bebas tanggungan |
| PATCH | `/api/bebas-tanggungan/{id}/approve` | Admin | Setujui BT |
| GET/POST | `/api/laporan` | Auth | Laporan KIP-K |
| PATCH | `/api/laporan/{id}/approve` | Warek | Setujui laporan |
| PUT | `/api/konfigurasi` | Admin | Update pengaturan |
| GET | `/api/konfigurasi/all` | Auth | Ambil semua konfigurasi |
| GET | `/api/audit` | Admin | Audit log |
| GET | `/api/admin/dokumen-queue` | Admin | Queue validasi dokumen |

---

## Keputusan Desain

- **Nomor surat otomatis** — SK Bebas Tanggungan, SP (`{id}/SP{level}/SIMKIP/...`), dan laporan (`LAP/KIP-K/ITG/...`)
- **Time-travel TA** — semua query histori (IPK, SP, dokumen, dashboard) mendukung filter `tahun_ajaran` dengan rentang Ganjil (1 Sep - 31 Jan) dan Genap (1 Feb - 31 Agu)
- **Validasi IPK** — `IPKCalculatorService` menghitung ulang IPK kumulatif berjenjang (carry-over) dari semester 1; nilai mutu diambil dari master `nilai_mutus` (cached)
- **Dispatcher pattern** — controller root mendispatch ke controller spesifik role berdasarkan `$req->user()->role`, menjaga loose coupling antar modul
- **Ekspor** — `MahasiswaExport` mendukung opsi sertakan IPK per semester & status dokumen wajib; `LaporanExport` untuk laporan; ditulis via DOMPDF saat diminta PDF
- **Audit trail** — `AuditLog::catat()` dipanggil pada login, validasi, perubahan status, penerbitan SP, dan aktivitas penting lainnya
- **Bebas Tanggungan checklist** — 5 syarat kelayakan: dokumen wajib lengkap & disetujui, IPK >= 3.0, bebas SP aktif/masa tenggang, SKS >= 144, tanpa mata kuliah gagal

---

## Dokumentasi Tambahan

- [LSI PED API Specification](docs/lsiped-api-spec.md) — spesifikasi API lengkap
- [SRS Sistem Monitoring KIP Kuliah](SRS_Sistem_Monitoring_KIP_Kuliah_ITG.md) — Software Requirements Specification
- [HLR Sistem Monitoring KIP Kuliah](HLR_Sistem_Monitoring_KIP_Kuliah_ITG.md) — High Level Design

---

## License

MIT License
