# Analisis Mendalam Frontend SIMKIP-ITG
> Dokumen ini akan terus diperbarui seiring pembacaan file frontend selesai dilakukan.

---

## 1. GAMBARAN UMUM SISTEM

SIMKIP-ITG adalah **Sistem Informasi Monitoring Mahasiswa KIP-K** (Kartu Indonesia Pintar - Kuliah) di Institut Teknologi Garut. Sistem ini dibangun dengan:

- **Framework Frontend**: React + TypeScript (via Vite)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **Icons**: Lucide React
- **State Management**: React `useState` + `useContext` (AuthContext)
- **Backend Target**: Laravel (PHP) dengan Inertia.js (sebagian masih mockup)
- **Auth Token Storage**: `localStorage` (`simkip_token`, `simkip_user`)

---

## 2. ARSITEKTUR ROUTING & ROLE-BASED ACCESS

### 2.1 Struktur URL per Role

```
/ atau /login          → Login (publik)
/admin/*               → Role: admin (Pengelola KIP-K)
/mahasiswa/*           → Role: mahasiswa
/prodi/*               → Role: prodi (Program Studi)
/warek/*               → Role: warek (Wakil Rektor III)
```

### 2.2 Peta Route Lengkap

#### Admin Routes (`/admin/*`)
| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/admin` | `AdminDashboard` | Dashboard utama admin |
| `/admin/mahasiswa` | `MahasiswaList` | Daftar semua mahasiswa KIP-K |
| `/admin/mahasiswa/tambah` | `TambahMahasiswa` | Form registrasi mahasiswa baru |
| `/admin/mahasiswa/:id` | `MahasiswaDetail` | Detail lengkap satu mahasiswa |
| `/admin/akademik` | `DataAkademik` | Monitoring data akademik semua mahasiswa |
| `/admin/dokumen` | `DokumenQueue` | Antrian validasi dokumen |
| `/admin/sp` | `SPList` | Daftar surat peringatan |
| `/admin/sp/terbitkan` | `TerbitkanSP` | Form terbitkan SP baru |
| `/admin/sp/:id` | `SPDetail` | Detail SP spesifik |
| `/admin/bebas-tanggungan` | `BebasTanggunganList` | Daftar permohonan bebas tanggungan |
| `/admin/bebas-tanggungan/:id` | `BebasTanggunganDetail` | Detail permohonan bebas tanggungan |
| `/admin/laporan` | `LaporanList` | Daftar laporan semester |
| `/admin/laporan/baru` | `SusunLaporan` | Form buat laporan baru |
| `/admin/laporan/:id` | `LaporanDetail` | Detail laporan |
| `/admin/konfigurasi` | `Konfigurasi` | Pengaturan sistem |
| `/admin/audit` | `AuditLog` | Log aktivitas sistem |
| `/admin/profil` | `Profil` | Profil admin |

#### Student Routes (`/mahasiswa/*`)
| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/mahasiswa` | `StudentDashboard` | Dashboard mahasiswa |
| `/mahasiswa/ipk` | `InputIPK` | Input nilai/IPK per semester |
| `/mahasiswa/prestasi` | `Prestasi` | Manajemen prestasi |
| `/mahasiswa/organisasi` | `Organisasi` | Keaktifan organisasi |
| `/mahasiswa/pelatihan` | `Pelatihan` | Pelatihan yang diikuti |
| `/mahasiswa/upload` | `UploadDokumen` | Upload dokumen kewajiban |
| `/mahasiswa/arsip` | `ArsipDigital` | Arsip semua dokumen |
| `/mahasiswa/sp` | `SPMahasiswa` | Lihat surat peringatan |
| `/mahasiswa/bebas-tanggungan` | `BebasTanggungan` | Permohonan bebas tanggungan |
| `/mahasiswa/profil` | `Profil` | Profil mahasiswa |

#### Prodi Routes (`/prodi/*`)
| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/prodi` | `ProdiDashboard` | Dashboard program studi |
| `/prodi/mahasiswa` | `ProdiMahasiswaList` | Daftar mahasiswa prodi ini |
| `/prodi/mahasiswa/:id` | `ProdiMahasiswaDetail` | Detail mahasiswa (sama dgn prodi) |
| `/prodi/ekspor` | `EksporLaporan` | Ekspor laporan ke Excel/PDF |
| `/prodi/profil` | `Profil` | Profil prodi |

#### Warek Routes (`/warek/*`)
| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/warek` | `WarekDashboard` | Dashboard warek |
| `/warek/laporan` | `WarekLaporanList` | Daftar laporan (read-only + approval) |
| `/warek/laporan/:id` | `WarekLaporanDetail` | Detail laporan untuk disetujui |
| `/warek/mahasiswa` | `WarekMahasiswaList` | Daftar mahasiswa (read-only) |
| `/warek/mahasiswa/:id` | `ProdiMahasiswaDetail` | Detail mahasiswa (shared component) |
| `/warek/profil` | `Profil` | Profil warek |

---

## 3. AUTENTIKASI

### 3.1 Alur Login
1. User buka `/login` → tampil halaman Login
2. Form: `username` (NIM atau username role) + `password`
3. Checkbox "Ingat Saya" (state lokal, belum terintegrasi ke backend)
4. Submit → `authService.login()`
5. Jika berhasil: simpan `simkip_token` & `simkip_user` di `localStorage`
6. Redirect ke path sesuai role: `/admin`, `/mahasiswa`, `/prodi`, `/warek`
7. Jika gagal: tampil pesan error

### 3.2 Mock Users (Sementara)
| Username | Role | Password | Redirect |
|----------|------|----------|----------|
| `admin` | admin (Pengelola KIP-K) | `kip2026` | `/admin` |
| `mahasiswa` | mahasiswa | `kip2026` | `/mahasiswa` |
| `prodi` | prodi (Program Studi) | `kip2026` | `/prodi` |
| `warek` | warek (Wakil Rektor III) | `kip2026` | `/warek` |

### 3.3 Session Management
- Token disimpan di `localStorage["simkip_token"]`
- User disimpan di `localStorage["simkip_user"]` (JSON serialized `UserSession`)
- `AuthContext` restore session dari localStorage saat app load
- Logout: hapus kedua key dari localStorage, redirect ke `/`

### 3.4 Format Token Backend yang Diharapkan
```
Response login:
{ user: UserSession, token: string, redirectPath: string }

UserSession:
{ id?: string, nama: string, nim?: string, role: Role, prodi?: string }
```

---

## 4. LAYOUT & NAVIGASI

### 4.1 Komponen Layout
- **Layout.tsx**: Wrapper utama untuk semua halaman post-login
  - Sidebar (kiri, fixed, collapsible)
  - Topbar (sticky, search global, notifikasi bell, profil dropdown)
  - `<Outlet />` untuk konten halaman

### 4.2 Sidebar per Role
- **Admin**: Dashboard, Manajemen Mahasiswa, Data Akademik, Validasi Dokumen (badge 5), Surat Peringatan, Surat Penyelesaian, Laporan Semester, Konfigurasi, Audit Log
- **Mahasiswa**: Dashboard, Input Nilai Semester, Prestasi, Keaktifan Organisasi, Pelatihan, Upload Dokumen, Arsip Digital, Surat Peringatan, Surat Penyelesaian, Profil
- **Prodi**: Dashboard, Daftar Mahasiswa, Ekspor Laporan, Profil
- **Warek**: Dashboard, Laporan, Mahasiswa, Profil

### 4.3 Topbar
- Search global: "Cari mahasiswa, NIM..." (placeholder, belum terintegrasi)
- Notifikasi bell: badge angka (hardcoded 3), dropdown notifikasi (mock data)
- Profil dropdown: nama user, link ke profil, logout

---

## 5. DATA TYPES & MODEL

### 5.1 UserSession
```typescript
{ id?: string; nama: string; nim?: string; role: Role; prodi?: string; }
Role = "admin" | "mahasiswa" | "prodi" | "warek"
```

### 5.2 Mahasiswa
```typescript
{ id: number; nim: string; nama: string; prodi: string;
  angkatan: number; kategori: "Reguler"|"Aspirasi";
  status: "Aktif"|"Dicabut"|"Lulus"|"Cuti";
  ipk: number; semester: number; sp: string|null; }
```

### 5.3 DokumenQueue (Admin)
```typescript
{ id: number; nim: string; nama: string; prodi: string;
  jenis: string; tanggalUpload: string; status: "Menunggu"|"Disetujui"|"Ditolak"; }
```

### 5.4 SuratPeringatan (SP)
```typescript
{ id: number; nim: string; nama: string; prodi: string; angkatan: number;
  level: "SP1"|"SP2"|"SP3"; alasan: string; tanggalTerbit: string;
  batasEvaluasi: string; status: "Aktif"|"Masa Tenggang"|"Pemberhentian"|"Selesai";
  sisa: number; }
```

### 5.5 IPKHistory
```typescript
{ semester: number; tahun: string; ipk: number; status: string; }
```

### 5.6 MataKuliah
```typescript
{ kode: string; nama: string; sks: number; nilaiHuruf: string; nilaiMutu: number; lulus: boolean; }
```

### 5.7 Prestasi
```typescript
{ id: number; nim?; nama?; prodi?; angkatan?; kipk?;
  namaPrestasi: string; tingkat: "Internasional"|"Nasional"|"Wilayah"|"Institusi";
  pencapaian: string; penyelenggara: string; tanggal?; tanggalMulai?; tanggalSelesai?;
  tempat: string; deskripsi: string; link?; linkPenyelenggara?;
  fileSertifikat?; fileFoto?;
  status: "Disetujui"|"Menunggu Validasi"|"Menunggu"|"Ditolak"; catatan?; catatanAdmin?; }
```

### 5.8 Organisasi
```typescript
{ id: number; nama: string; jabatan: string; mulai: string; selesai: string;
  deskripsi: string; status: "Disetujui"|"Menunggu"|"Ditolak"; catatanAdmin?; }
```

### 5.9 Pelatihan
```typescript
{ id: number; nama: string; jenis: string; penyelenggara: string;
  tanggalMulai: string; tanggalSelesai: string; tempat: string;
  deskripsi: string; sertifikat?; status: "Disetujui"|"Menunggu"|"Ditolak"; catatanAdmin?; }
```

### 5.10 BebasTanggungan
```typescript
{ id: number; nim: string; nama: string; prodi: string; angkatan: number;
  tanggalPermohonan: string; status: "Menunggu"|"Diproses"|"Disetujui"|"Ditolak"; keterangan?; }
```

### 5.11 Laporan
```typescript
{ id: number; judul: string; periode: string; semester: string;
  tanggalBuat: string; tanggalAjukan?; status: "Draft"|"Diajukan"|"Disetujui"|"Ditolak";
  dibuat?; catatan?; }
```

### 5.12 AuditLog
```typescript
{ id: number; waktu: string; user: string; role: string;
  aksi: string; detail: string; ip?; }
```

### 5.13 API Response Wrappers
```typescript
ApiResponse<T>: { data: T; message?; success: boolean; }
PaginatedResponse<T>: { data: T[]; total: number; page: number; limit: number; totalPages: number; }
```

---

## 6. HALAMAN-HALAMAN ADMIN (Detail)

### 6.1 Dashboard Admin (`/admin`)

**Data yang ditampilkan:**
- Stat Cards (4 card):
  - Total Mahasiswa KIP-K Aktif: `167` (+3 dari semester lalu)
  - KIP-K Reguler: `102` (61%)
  - KIP-K Aspirasi: `65` (39%)
  - Dokumen Menunggu Validasi: `5` → link ke `/admin/dokumen`

- Chart "Sebaran per Program Studi" (horizontal stacked bar):
  - Data: Reguler + Aspirasi per prodi (5 prodi)
  - Warna: Reguler=#263F93 (biru), Aspirasi=#D4A72C (kuning)

- Chart "Sebaran per Angkatan" (vertical stacked bar):
  - Data: Reguler + Aspirasi per angkatan (2022–2026)

- Chart "Sebaran Mahasiswa KIP-K per Prodi" (horizontal bar + filter angkatan):
  - Filter dropdown: Semua, 2022, 2023, 2024, 2025, 2026
  - Custom tooltip dengan total

- Widget "Mahasiswa dengan SP Aktif" (mini table):
  - Kolom: Nama, NIM, Prodi, SP badges, Sisa hari
  - SP badges: SP1 (amber), SP2 (red), SP3 (dark red)
  - Link "Lihat Semua" → `/admin/sp`

- Widget "Antrian Validasi Dokumen" (list cards):
  - Setiap item: jenis dokumen, nama mahasiswa, badge "Menunggu"
  - Link "Review" → `/admin/dokumen`

- Quick Stats (3 card bawah):
  - Mahasiswa Semester >8: `14`
  - SP Diterbitkan Semester Ini: `7`
  - Permohonan Surat Penyelesaian Pending: `3`

**API Backend yang dibutuhkan:**
```
GET /api/admin/dashboard → {
  totalAktif, reguler, aspirasi, dokumenMenunggu,
  prodiSebaran[], angkatanSebaran[], sebaranPerProdiAngkatan{},
  spAktif[], dokumenQueue[],
  mahasiswaSemester8Plus, spSemesterIni, bebasTanggunganPending
}
```

---

### 6.2 Manajemen Mahasiswa (`/admin/mahasiswa`)

**Filter:**
- Search: NIM atau Nama
- Prodi: Semua | Teknik Informatika | Sistem Informasi | Teknik Industri | Teknik Sipil | Arsitektur
- Angkatan: Semua | 2021 | 2022 | 2023 | 2024
- Status SP: Semua | Tanpa SP | SP1 | SP2 | SP3
- Kategori KIP-K: Semua | KIP-K Reguler | KIP-K Aspirasi
- Standar IPK: Semua | Di Bawah Standar (<3.0) | Di Atas Standar (≥3.0)
- Sort: IPK Tertinggi→Terendah | IPK Terendah→Tertinggi | Nama A–Z | Angkatan Terbaru
- Tombol "Reset Filter" muncul jika ada filter aktif

**Tabel (12 kolom):**
No | NIM | Nama | Program Studi | Angkatan | Kategori | IPK | Progres IPK | Semester | Status | SP | Aksi

**Kolom khusus:**
- Kategori: badge "Reguler" (biru) / "Aspirasi" (ungu)
- IPK: badge hijau (≥3.0) / merah (<3.0)
- Progres IPK: ikon TrendingUp/Down/Minus + delta value
- Status: badge Aktif (hijau) / Dicabut (merah) / lainnya (abu)
- SP: accumulated badges (SP1 → SP2 → SP3)
- Aksi: tombol MoreVertical → dropdown [Lihat Detail, Hapus Data]

**Pagination:** 10 item/halaman, navigasi halaman

**Tombol aksi:**
- "Import Massal" (belum terimplementasi)
- "Tambah Mahasiswa" → `/admin/mahasiswa/tambah`

**Delete Modal:**
- Muncul setelah klik "Hapus Data"
- Konfirmasi dengan mengetik NIM
- Tombol "Hapus Permanen" aktif hanya jika NIM cocok

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa?search=&prodi=&angkatan=&sp=&kategori=&ipk=&sortBy=&page=&limit=
→ PaginatedResponse<Mahasiswa + trendDelta>

DELETE /api/mahasiswa/:id  (dengan body konfirmasi NIM)
```

---

### 6.3 Tambah Mahasiswa (`/admin/mahasiswa/tambah`)

**Form 3 Section:**

**Section 1: Data SK Penetapan KIP-K**
- Nomor SK (required): format SK/KIP/ITG/[TAHUN]/[NO]
- Tanggal SK (required): date picker
- File SK: drag-drop upload, accept PDF/JPG/PNG, max 5MB
  - Preview nama file + size setelah upload
  - Tombol hapus file

**Section 2: Data Mahasiswa**
- NIM (required): input text + NIM check onBlur
  - Status indicator: checking (spinner), ok (checkmark hijau), error (X merah)
  - Error jika NIM sudah terdaftar
- Nama Lengkap (required): sesuai KTP
- Program Studi (required): dropdown pilih
- Angkatan (required): dropdown 2020–2026
- Kategori: Radio cards — "Reguler" / "Aspirasi" dengan deskripsi

**Section 3: Kredensial Akun (Otomatis)**
- Username = NIM (disabled, auto-generated)
- Password = `kip{NIM}2026` (disabled, masked, show/hide toggle)
- Info box: mahasiswa wajib ganti password saat login pertama

**Validasi:**
- Semua field required divalidasi sebelum submit
- NIM duplikat ditolak
- File SK format + ukuran divalidasi

**Tombol submit:**
- "Simpan & Tambah Lagi": submit + reset form
- "Simpan & Daftarkan": submit + tampilkan Success Modal

**Success Modal:**
- Nama mahasiswa yang didaftarkan
- Tabel kredensial (NIM/username + password default)
- Tombol: Salin | Cetak | Tutup (redirect ke list)

**API Backend yang dibutuhkan:**
```
POST /api/mahasiswa
Body: { nomorSK, tanggalSK, fileSK (multipart), nim, nama, prodi, angkatan, kategori }
Response: { mahasiswa: Mahasiswa, credentials: { username, password } }

GET /api/mahasiswa/check-nim/:nim  → { exists: boolean }
```

---

### 6.4 Detail Mahasiswa Admin (`/admin/mahasiswa/:id`)

> File terbesar (76KB, ~1800+ baris) — analisis akan dilengkapi dari subagent output

**Tabs yang ada:**
- Profil (data identitas lengkap)
- Akademik (IPK per semester, grafik, tabel mata kuliah)
- Prestasi (daftar prestasi dengan status validasi)
- Organisasi (keaktifan organisasi)
- Pelatihan (pelatihan akademik & non-akademik)
- Dokumen (dokumen yang diupload)
- Surat Peringatan (riwayat SP)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/:id → detail lengkap mahasiswa
GET /api/mahasiswa/:id/ipk → riwayat IPK
GET /api/mahasiswa/:id/prestasi → daftar prestasi
GET /api/mahasiswa/:id/organisasi → daftar organisasi
GET /api/mahasiswa/:id/pelatihan → daftar pelatihan
GET /api/mahasiswa/:id/dokumen → daftar dokumen
GET /api/mahasiswa/:id/sp → riwayat SP
```

---

### 6.5 Data Akademik (`/admin/akademik`)

**Tabs utama:**
- **IPK Semua Mahasiswa**: tabel IPK per mahasiswa, filter, indikator progres
- **Prestasi**: tabel semua prestasi mahasiswa, modal detail
- **Organisasi**: data keaktifan organisasi semua mahasiswa
- **Pelatihan Akademik**: data pelatihan akademik
- **Pelatihan Non-Akademik**: data pelatihan non-akademik

**Filter IPK tab:** search (NIM/nama), prodi, angkatan, KIP-K, status IPK  
**Actions:** Download laporan

**API Backend yang dibutuhkan:**
```
GET /api/akademik/ipk?search=&prodi=&angkatan=&kategori=&status=
GET /api/akademik/prestasi?...
GET /api/akademik/organisasi?...
GET /api/akademik/pelatihan?jenis=akademik|non-akademik&...
```

---

### 6.6 Validasi Dokumen (`/admin/dokumen`)

**Filter:**
- Search (NIM/nama)
- Status: Semua | Menunggu | Disetujui | Ditolak
- Jenis dokumen: dropdown

**Tabel dokumen:**
- NIM, Nama, Prodi, Jenis Dokumen, Tanggal Upload, Status, Aksi

**Aksi per dokumen:**
- Setujui → `approveDokumen(id)`
- Tolak → modal input catatan penolakan → `rejectDokumen(id, catatan)`
- Lihat Dokumen (preview)

**API Backend yang dibutuhkan:**
```
GET /api/dokumen/queue?search=&status=&jenis=
PATCH /api/dokumen/:id/approve
PATCH /api/dokumen/:id/reject  Body: { catatan: string }
GET /api/dokumen/:id/preview  (file serving)
```

---

### 6.7 Surat Peringatan - List (`/admin/sp`)

**Filter:**
- Search (NIM/nama)
- Level SP: Semua | SP1 | SP2 | SP3
- Status: Semua | Aktif | Masa Tenggang | Pemberhentian | Selesai

**Tabel SP:**
- NIM, Nama, Prodi, Angkatan, Level, Alasan, Tanggal Terbit, Batas Evaluasi, Status, Sisa Hari

**Tombol aksi:**
- "Terbitkan SP" → `/admin/sp/terbitkan`
- Per row: "Lihat Detail" → `/admin/sp/:id`

**API Backend yang dibutuhkan:**
```
GET /api/sp?search=&level=&status=
```

---

### 6.8 Terbitkan SP (`/admin/sp/terbitkan`)

**Form:**
- Pilih Mahasiswa: search + dropdown (NIM + Nama)
- Level SP: SP1 | SP2 | SP3 (radio/select)
- Alasan terbit SP (textarea)
- Tanggal Terbit (date)
- Batas Evaluasi (date)
- Catatan tambahan (optional)

**Validasi:**
- Semua field required
- Level SP harus mengikuti urutan (tidak bisa SP3 jika belum pernah SP1/SP2)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa?status=Aktif  (untuk dropdown pemilihan mahasiswa)
POST /api/sp
Body: { nim, level, alasan, tanggalTerbit, batasEvaluasi, catatan? }
```

---

### 6.9 Detail SP (`/admin/sp/:id`)

**Data yang ditampilkan:**
- Informasi lengkap SP (level, alasan, tanggal, batas, status)
- Progress sisa hari evaluasi
- Informasi mahasiswa (profil singkat)
- Riwayat SP sebelumnya

**Aksi:**
- Ubah Status SP (misal dari Aktif ke Selesai)
- Tambah catatan

**API Backend yang dibutuhkan:**
```
GET /api/sp/:id
PATCH /api/sp/:id/status  Body: { status, catatan? }
```

---

### 6.10 Bebas Tanggungan - List (`/admin/bebas-tanggungan`)

**Tampil:** daftar permohonan bebas tanggungan dari mahasiswa

**Filter:**
- Search (NIM/nama)  
- Status: Semua | Menunggu | Diproses | Disetujui | Ditolak

**Tabel:**
- NIM, Nama, Prodi, Angkatan, Tanggal Permohonan, Status, Aksi

**Aksi per row:**
- "Lihat Detail" → `/admin/bebas-tanggungan/:id`

**API Backend yang dibutuhkan:**
```
GET /api/bebas-tanggungan?search=&status=
```

---

### 6.11 Detail Bebas Tanggungan (`/admin/bebas-tanggungan/:id`)

**Data yang ditampilkan:**
- Identitas mahasiswa + status permohonan
- Checklist syarat bebas tanggungan:
  - Status KIP-K aktif/selesai  
  - Dokumen wajib lengkap (PKKMB, MABIM, dll)
  - IPK memenuhi standar
  - Tidak ada SP aktif
  - Status akademik (lulus/tidak)
- Dokumen yang diupload mahasiswa

**Aksi admin:**
- Setujui Permohonan
- Tolak Permohonan (dengan alasan)
- Minta Perbaikan

**API Backend yang dibutuhkan:**
```
GET /api/bebas-tanggungan/:id
→ { permohonan, mahasiswa, checklist[], dokumen[] }

PATCH /api/bebas-tanggungan/:id/approve
PATCH /api/bebas-tanggungan/:id/reject  Body: { alasan }
PATCH /api/bebas-tanggungan/:id/revision  Body: { catatan }
```

---

### 6.12 Laporan Semester - List (`/admin/laporan`)

**Filter:**
- Search
- Status: Semua | Draft | Diajukan | Disetujui | Ditolak

**Tabel:**
- ID, Judul, Periode, Semester, Dibuat Oleh, Tanggal Buat, Tanggal Ajukan, Status, Aksi

**Tombol:**
- "Buat Laporan Baru" → `/admin/laporan/baru`
- Per row: "Lihat Detail" → `/admin/laporan/:id`
- Submit laporan (dari Draft → Diajukan)

**API Backend yang dibutuhkan:**
```
GET /api/laporan?search=&status=
POST /api/laporan  (buat draft baru)
PATCH /api/laporan/:id/submit  (ajukan ke warek)
```

---

### 6.13 Susun Laporan (`/admin/laporan/baru`)

**Form:**
- Judul Laporan
- Periode (semester ganjil/genap + tahun)
- Nomor Semester
- Section-section laporan (konten bebas/template)

**Fitur:**
- Preview laporan
- Simpan sebagai draft
- Ajukan ke Warek

**API Backend yang dibutuhkan:**
```
POST /api/laporan
Body: { judul, periode, semester, konten? }

PATCH /api/laporan/:id
Body: { judul?, periode?, semester?, konten? }
```

---

### 6.14 Detail Laporan (`/admin/laporan/:id`)

**Data yang ditampilkan:**
- Header laporan (judul, periode, status, dibuat oleh, tanggal)
- Konten laporan (data statistik, grafik, tabel)
- Catatan dari warek (jika ada)

**Aksi admin:**
- Submit laporan ke warek (jika Draft)
- Edit laporan (jika Draft)

**API Backend yang dibutuhkan:**
```
GET /api/laporan/:id
PATCH /api/laporan/:id/submit
```

---

### 6.15 Konfigurasi (`/admin/konfigurasi`)

**Section-section yang ada (perlu dikonfirmasi dari subagent):**
- Standar IPK minimum KIP-K
- Batas semester maksimum
- Jenis dokumen wajib
- Template SP
- Pengaturan notifikasi
- Manajemen prodi/angkatan

**API Backend yang dibutuhkan:**
```
GET /api/konfigurasi
PUT /api/konfigurasi  Body: { key: value, ... }
```

---

### 6.16 Audit Log (`/admin/audit`)

**Filter:**
- Search (user/aksi/detail)
- Role: Semua | admin | mahasiswa | prodi | warek
- Rentang waktu (date range)

**Tabel:**
- Waktu, User, Role, Aksi, Detail, IP

**API Backend yang dibutuhkan:**
```
GET /api/audit?search=&role=&dari=&sampai=&page=&limit=
→ PaginatedResponse<AuditLog>
```

---

## 7. HALAMAN-HALAMAN MAHASISWA (Detail)

### 7.1 Dashboard Mahasiswa (`/mahasiswa`)

**Data yang ditampilkan:**
- Kartu identitas: nama, NIM, prodi, angkatan, kategori KIP-K
- Status akademik saat ini (Aktif/Warning)
- IPK terkini + status (Di atas/bawah standar)
- Semester aktif
- SP aktif (jika ada) — dengan level dan batas evaluasi
- Progress checklist kewajiban KIP-K:
  - Dokumen PKKMB ✓/✗
  - Dokumen MABIM ✓/✗
  - IPK semester ini sudah diinput ✓/✗
  - Prestasi (opsional)
- Link cepat ke halaman lain (Input IPK, Upload Dokumen, dll)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/dashboard  (auto dari token = mahasiswa yang login)
→ { profil, ipkTerkini, spAktif, checklistKewajiban[], statistik }
```

---

### 7.2 Input IPK (`/mahasiswa/ipk`)

**Tabs:**
- **Riwayat IPK**: tabel + grafik IPK per semester
- **Input Nilai Baru**: form input nilai mata kuliah

**Riwayat IPK:**
- Tabel: Semester, Tahun Ajaran, IPK, Status (Di atas/bawah standar)
- Grafik line chart IPK per semester
- Highlight jika IPK < 3.0

**Form Input Nilai:**
- Semester (angka)
- Tahun Ajaran (format "2024/2025 Ganjil")
- IPK semester (0.00–4.00)
- Daftar mata kuliah:
  - Kode MK
  - Nama MK
  - SKS
  - Nilai Huruf (A/B+/B/C+/C/D/E)
  - Nilai Mutu (auto-calculate)
  - Status lulus (auto dari nilai)
- Tombol tambah/hapus baris mata kuliah
- Validasi: IPK harus konsisten dengan nilai MK

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/ipk  → IPKHistory[]
POST /api/mahasiswa/ipk
Body: { semester, tahunAjaran, ipk, mataKuliah: MataKuliah[] }

GET /api/mahasiswa/ipk/:semester  → SemesterDetail
```

---

### 7.3 Prestasi (`/mahasiswa/prestasi`)

**Tabs:** Internasional | Nasional | Wilayah | Institusi

**Per tab:** daftar prestasi dengan status

**Tampilan prestasi (card):**
- Nama prestasi, tingkat, pencapaian, penyelenggara
- Tanggal, tempat
- Status badge: Disetujui (hijau) | Menunggu Validasi (kuning) | Ditolak (merah)
- Catatan admin (jika ada)
- Tombol: Edit | Hapus

**Tombol tambah prestasi:**
- Buka modal form

**Form Tambah/Edit Prestasi:**
- Nama Prestasi (required)
- Tingkat: Internasional | Nasional | Wilayah | Institusi
- Pencapaian (juara 1, 2, 3, finalis, dll)
- Nama Penyelenggara
- Tanggal Mulai + Tanggal Selesai
- Tempat
- Deskripsi
- Link bukti (URL)
- Link penyelenggara (URL)
- Upload Sertifikat (file)
- Upload Foto (file)

**Validasi:**
- Nama, tingkat, pencapaian, penyelenggara, tanggal, tempat, deskripsi = required
- File ukuran max 5MB

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/prestasi?tingkat=
POST /api/mahasiswa/prestasi  (multipart, sertifikat + foto)
PUT /api/mahasiswa/prestasi/:id
DELETE /api/mahasiswa/prestasi/:id
```

---

### 7.4 Keaktifan Organisasi (`/mahasiswa/organisasi`)

**Tampilan:** daftar kartu organisasi

**Per kartu:**
- Nama organisasi, jabatan
- Periode aktif (mulai – selesai)
- Deskripsi
- Status badge: Disetujui | Menunggu | Ditolak
- Catatan admin

**Form Tambah/Edit Organisasi (modal):**
- Nama Organisasi (required)
- Jabatan/Posisi (required)
- Periode Mulai (required)
- Periode Selesai (required)
- Deskripsi kegiatan (required)
- Upload SK Organisasi (file, optional)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/organisasi
POST /api/mahasiswa/organisasi
PUT /api/mahasiswa/organisasi/:id
DELETE /api/mahasiswa/organisasi/:id
```

---

### 7.5 Pelatihan (`/mahasiswa/pelatihan`)

**Tabs:** Akademik | Non-Akademik

**Per kartu pelatihan:**
- Nama pelatihan
- Jenis pelatihan
- Penyelenggara
- Tanggal mulai – selesai
- Tempat
- Deskripsi
- Status badge: Disetujui | Menunggu | Ditolak
- Catatan admin

**Form Tambah/Edit:**
- Nama Pelatihan (required)
- Jenis (Akademik/Non-Akademik): auto dari tab aktif
- Penyelenggara (required)
- Tanggal Mulai & Selesai (required)
- Tempat (required)
- Deskripsi (required)
- Upload Sertifikat (file, optional)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/pelatihan?jenis=akademik|non-akademik
POST /api/mahasiswa/pelatihan
PUT /api/mahasiswa/pelatihan/:id
DELETE /api/mahasiswa/pelatihan/:id
```

---

### 7.6 Upload Dokumen (`/mahasiswa/upload`)

**Jenis dokumen wajib KIP-K:**
- Sertifikat PKKMB
- Sertifikat MABIM
- SK Organisasi
- Sertifikat Prestasi
- Sertifikat Pelatihan
- Berita Acara Kerja Praktik
- Bukti Sidang Skripsi

**Per jenis dokumen:**
- Status upload (Belum | Menunggu | Disetujui | Ditolak)
- Tombol Upload (drag-drop atau klik)
- Preview dokumen yang sudah upload
- Catatan penolakan (jika Ditolak)

**Validasi upload:**
- Format: PDF, JPG, PNG
- Ukuran max: 5MB

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/dokumen
POST /api/mahasiswa/dokumen  (multipart)
Body: { jenis: string, file: File }

DELETE /api/mahasiswa/dokumen/:id  (hapus & re-upload jika ditolak)
```

---

### 7.7 Arsip Digital (`/mahasiswa/arsip`)

**Tampilan:** grid/list semua dokumen yang pernah diupload

**Filter:**
- Jenis dokumen
- Status: Semua | Disetujui | Menunggu | Ditolak

**Per dokumen:**
- Jenis, nama file, tanggal upload, ukuran, status
- Tombol: Preview | Download

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/arsip?jenis=&status=
GET /api/mahasiswa/arsip/:id/download  (file serving)
```

---

### 7.8 Surat Peringatan Mahasiswa (`/mahasiswa/sp`)

**Tampilan:**
- Status SP aktif mahasiswa (atau "Tidak Ada SP Aktif")
- Progress timeline SP (SP1 → SP2 → SP3)
- Riwayat SP lengkap

**Per SP card:**
- Level SP, alasan terbit
- Tanggal terbit, batas evaluasi
- Sisa hari evaluasi
- Status (Aktif | Masa Tenggang | Pemberhentian | Selesai)

**Read-only** — mahasiswa hanya bisa melihat, tidak bisa mengubah

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/sp  → SuratPeringatan[]
```

---

### 7.9 Bebas Tanggungan Mahasiswa (`/mahasiswa/bebas-tanggungan`)

**Tampilan (jika belum mengajukan):**
- Checklist syarat bebas tanggungan:
  - Lulus semua mata kuliah ✓/✗
  - Dokumen PKKMB ✓/✗
  - Dokumen MABIM ✓/✗
  - IPK memenuhi standar ✓/✗
  - Tidak ada SP aktif ✓/✗
  - Selesai KP/Skripsi ✓/✗
- Tombol "Ajukan Permohonan" (aktif hanya jika semua syarat terpenuhi)

**Tampilan (jika sudah mengajukan):**
- Status permohonan: Menunggu | Diproses | Disetujui | Ditolak
- Tanggal permohonan
- Catatan admin (jika ditolak)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/bebas-tanggungan
→ { status, checklist[], permohonan? }

POST /api/mahasiswa/bebas-tanggungan  (ajukan permohonan)
```

---

### 7.10 Profil (`/mahasiswa/profil`, `/admin/profil`, dll.)

**Data yang ditampilkan:**
- Foto profil
- Informasi identitas: Nama, NIM (jika mahasiswa), Role
- Untuk mahasiswa: Prodi, Angkatan, Kategori KIP-K
- Form edit profil (sebagian field)
- Form ganti password

**Form Edit:**
- Nama (editable)
- Email (editable)
- No. HP (editable)
- Foto profil (upload)

**Form Ganti Password:**
- Password Lama
- Password Baru
- Konfirmasi Password Baru
- Validasi: min 8 karakter

**API Backend yang dibutuhkan:**
```
GET /api/profile
PUT /api/profile  Body: { nama?, email?, noHp?, foto? }
POST /api/profile/password  Body: { passwordLama, passwordBaru, konfirmasi }
```

---

## 8. HALAMAN-HALAMAN PRODI (Detail)

### 8.1 Dashboard Prodi (`/prodi`)

**Data yang ditampilkan:**
- **Header**: "Dashboard — [Nama Prodi]", subtitle: "Pantau perkembangan mahasiswa KIP-K di program studi Anda (read-only)"
- **Stat Cards (4)**: Mahasiswa KIP-K Aktif (prodi ini), Reguler, Aspirasi, Rata-rata IPK
- **Chart 1** (BarChart stacked): Sebaran per Angkatan — Reguler+Aspirasi per tahun angkatan
- **Chart 2** (LineChart): Tren Rata-rata IPK per Semester — 6 semester
- **Mini tabel**: Mahasiswa dengan SP Aktif — kolom: NIM/Nama, Level SP, Alasan
- **Mini tabel**: Mahasiswa Semester ≥ 7 — kolom: NIM/Nama, Semester, IPK
- Link "Lihat Semua" di tiap tabel → `/prodi/mahasiswa`

**Note:** Dashboard ini **read-only**. Prodi tidak bisa mengubah data apapun.

**API Backend yang dibutuhkan:**
```
GET /api/prodi/dashboard  (auto dari token = prodi yang login)
→ { prodiNama, totalAktif, reguler, aspirasi, ipkRata,
    angkatanSebaran[], trendIPK[], spAktif[], mahasiswaSemester7Plus[] }
```

---

### 8.2 Daftar Mahasiswa Prodi (`/prodi/mahasiswa`)

**Filter:**
- Search (NIM/nama)
- Angkatan: Semua | tahun-tahun yang ada
- Kategori: Semua | Reguler | Aspirasi
- Status: Semua | Aktif | Lulus | Dicabut

**Tabel (10 kolom):** No | NIM | Nama | Angkatan | Kategori | IPK Terakhir | Semester | Status | SP | Aksi

**Kolom Aksi:** Tombol "Lihat" (mata) → `/prodi/mahasiswa/:nim`

**Tombol header:** "Export Excel" (disabled di mock, akan aktif di backend)

**Pagination:** PAGE_SIZE=5, navigasi halaman kiri/kanan

**Note:** Halaman ini **read-only** — tidak ada tombol tambah, edit, atau hapus.

**API Backend yang dibutuhkan:**
```
GET /api/prodi/mahasiswa?search=&angkatan=&kategori=&status=&page=&limit=
→ PaginatedResponse<Mahasiswa>  (hanya mahasiswa prodi dari token)
```

---

### 8.3 Detail Mahasiswa Prodi (`/prodi/mahasiswa/:id`)

**Komponen yang sama dengan admin** — prodi dan warek sama-sama menggunakan `ProdiMahasiswaDetail` (shared component), tetapi:
- **Tidak ada aksi** (create/edit/delete SP, approve dokumen, dll.)
- **Read-only** dari semua tab: Profil, Akademik, Prestasi, Organisasi, Pelatihan, Dokumen, SP
- Breadcrumb menunjukkan path `/prodi/mahasiswa/:id` atau `/warek/mahasiswa/:id`

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa/:id  (sama dengan admin tapi permission berbeda)
→ Semua data lengkap, namun tidak bisa dimodifikasi
```

---

### 8.4 Ekspor Laporan Prodi (`/prodi/ekspor`)

**Form Parameter Laporan (kolom kiri):**
- Tahun Akademik: dropdown (2025/2026, 2024/2025, 2023/2024)
- Semester: Ganjil | Genap
- Angkatan: Semua | 2022 | 2021 | 2020 | 2023
- Kategori: Semua | Reguler | Aspirasi
- **Sertakan Data** (checkboxes):
  - Riwayat IPK per semester ✓ (default)
  - Status dokumen kewajiban ✓ (default)
  - Riwayat surat peringatan ✗ (default off)
- **Format File** (radio): Excel (.xlsx) | PDF
- Tombol "Generate Laporan"

**Preview (kolom kanan):**
- Sebelum generate: tampil empty state "Klik Generate Laporan"
- Setelah generate: pratinjau tabel data + stat summary (Total Mahasiswa, Rata-rata IPK, Mahasiswa dengan SP)
- Tombol "Download [FORMAT]" di header preview

**Loading state:** spinner "Memproses..." saat generate (1 detik mock)

**Kolom tabel preview:** NIM | Nama | Angkatan | Kategori | IPK Terakhir | Semester | SP | Dokumen (kondisional)

**API Backend yang dibutuhkan:**
```
POST /api/prodi/ekspor
Body: { tahunAkademik, semester, angkatan, kategori, sertakanIPK, sertakanDokumen, sertakanSP, format }
→ File download (Excel/PDF) atau preview JSON

GET /api/prodi/ekspor/preview (parameter sama)
→ { data: PreviewRow[], summary: { total, avgIPK, spCount } }
```

---

## 9. HALAMAN-HALAMAN WAREK (Detail)

### 9.1 Dashboard Warek (`/warek`)

**Data yang ditampilkan:**
- **Header**: "Dashboard Warek III", subtitle: "Overview KIP-K Institut Teknologi Garut"
- **Banner notifikasi** (kuning): "Terdapat N laporan semester menunggu persetujuan Anda" → tombol "Review Sekarang" → `/warek/laporan`
- **Stat Cards (3)**: Total Mahasiswa KIP-K Aktif (167), Reguler/Aspirasi (112/55), Laporan Disetujui Semester Ini
- **Section "Laporan Menunggu Persetujuan"** (card list):
  - Setiap card: ikon FileCheck, judul laporan, nomor, diajukan oleh, tanggal, summary data ("167 mahasiswa, rata-rata IPK 3.18")
  - Tombol "Review & Approve" → `/warek/laporan/:id`
- **Section "Laporan Telah Disetujui"** (list):
  - Setiap item: ikon CheckCircle, judul, nomor, tanggal disetujui
  - Tombol "Unduh PDF"

**API Backend yang dibutuhkan:**
```
GET /api/warek/dashboard
→ { totalAktif, reguler, aspirasi, laporanMenunggu[], laporanDisetujui[], laporanDisetujuiSemIni }
```

---

### 9.2 Laporan - List Warek (`/warek/laporan`)

**Tabs (bukan tabel):**
- Menunggu Approval (N)
- Disetujui (N)
- Dikembalikan (N)

**Tampilan:** Card per laporan (bukan tabel) berisi:
- Ikon FileText biru
- Judul laporan + badge status (kuning/hijau/orange)
- Nomor laporan
- Periode + tanggal diajukan
- Summary: "167 mahasiswa, rata-rata IPK 3.18, 3 SP aktif"
- Tanggal disetujui (jika sudah disetujui)

**Aksi per kartu:**
- Status Menunggu → tombol "Review Detail" (hijau) → `/warek/laporan/:id`
- Status Disetujui → tombol "Unduh PDF"
- Status Dikembalikan → tombol "Lihat Detail" (orange) → `/warek/laporan/:id`

**Status yang ada di data:** Menunggu | Disetujui | Dikembalikan *(bukan Ditolak)*

**API Backend yang dibutuhkan:**
```
GET /api/laporan?role=warek&status=Menunggu|Disetujui|Dikembalikan
→ Laporan[] dengan field tambahan: approvedDate, returnNote
```

---

### 9.3 Detail Laporan Warek (`/warek/laporan/:id`)

**Konten Laporan (Tampilan Formal Surat):**
- Letterhead ITG: logo + nama institusi + alamat
- Judul laporan (uppercase, bold, underline)
- Nomor laporan
- Stat cards: Total Mahasiswa | Rata-rata IPK | SP Aktif | Surat Penyelesaian
- Bar chart: Distribusi IPK (range < 2.5, 2.5–2.9, 3.0–3.4, 3.5–3.9, 4.0)
- Tabel sample mahasiswa: NIM | Nama | Prodi | IPK | Status
- **Blok tanda tangan dua kolom:**
  - Kiri: Biro Kemahasiswaan — sudah ditandatangani (CheckCircle hijau)
  - Kanan: Wakil Rektor III — menunggu tanda tangan (QR code abu-abu → hijau setelah approve)

**Aksi Warek (sticky bottom bar, muncul sebelum approve/return):**
1. "Download Preview"
2. **"Kembalikan untuk Revisi"** → modal input catatan revisi (required) → status: "Dikembalikan"
3. **"Setujui & Tanda Tangani"** → modal konfirmasi dengan checkbox "Saya telah membaca..." → tanda tangan QR digital aktif

**Setelah Approve:** Banner hijau + tombol "Unduh PDF Final", sticky bar hilang
**Setelah Return:** Banner orange "Laporan telah dikembalikan ke Admin untuk revisi", sticky bar hilang

**Validasi:**
- Approve: Checkbox persetujuan harus dicentang
- Return: Field catatan revisi tidak boleh kosong

**API Backend yang dibutuhkan:**
```
GET /api/laporan/:id
PATCH /api/laporan/:id/approve
  Body: { agreed: true } → generate QR/TTD digital
PATCH /api/laporan/:id/return
  Body: { catatan: string }
→ update status laporan ke 'Dikembalikan'
```

---

### 9.4 Daftar Mahasiswa Warek (`/warek/mahasiswa`)

**Filter:** Search (NIM/nama), Prodi, Angkatan, Kategori KIP-K

**Tabel:** Ringkasan semua mahasiswa KIP-K dari semua prodi

**Kolom:** No | NIM | Nama | Prodi | Angkatan | Kategori | IPK | Semester | Status | SP | Aksi

**Aksi:** "Lihat Detail" → `/warek/mahasiswa/:nim` → komponen **shared** `ProdiMahasiswaDetail` (read-only)

**Note:** Warek bisa melihat mahasiswa dari semua prodi (tidak dibatasi per prodi seperti role `prodi`)

**API Backend yang dibutuhkan:**
```
GET /api/mahasiswa?page=&limit=&search=&prodi=&angkatan=&kategori=
→ PaginatedResponse<Mahasiswa>  (akses semua prodi)
```

---

## 10. SERVICES (API LAYER)

### 10.1 api.ts — Base HTTP Client
- Base URL: `import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"`
- Auth header: `Authorization: Bearer {token}` dari localStorage
- Methods: `api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`
- Error handling: `response.json()` jika respons tidak OK → throw Error

### 10.2 authService.ts
| Fungsi | Endpoint Target | Keterangan |
|--------|----------------|------------|
| `login(payload)` | `POST /auth/login` | Mock saat ini |
| `logout()` | - | Clear localStorage |
| `getCurrentUser()` | - | Read localStorage |
| `isAuthenticated()` | - | Check token di localStorage |

### 10.3 mahasiswaService.ts
| Fungsi | Endpoint Target |
|--------|----------------|
| `getMahasiswaList(filter)` | `GET /mahasiswa?{params}` |
| `getMahasiswaById(id)` | `GET /mahasiswa/{id}` |
| `createMahasiswa(payload)` | `POST /mahasiswa` |
| `updateMahasiswa(id, payload)` | `PUT /mahasiswa/{id}` |

### 10.4 dokumenService.ts
| Fungsi | Endpoint Target |
|--------|----------------|
| `getDokumenQueue(filter)` | `GET /dokumen/queue` |
| `approveDokumen(id)` | `PATCH /dokumen/{id}/approve` |
| `rejectDokumen(id, catatan)` | `PATCH /dokumen/{id}/reject` |

### 10.5 spService.ts
| Fungsi | Endpoint Target |
|--------|----------------|
| `getSPList(filter)` | `GET /sp` |
| `getSPById(id)` | `GET /sp/{id}` |
| `terbitkanSP(payload)` | `POST /sp` |

### 10.6 laporanService.ts
| Fungsi | Endpoint Target |
|--------|----------------|
| `getLaporanList()` | `GET /laporan` |
| `getLaporanById(id)` | `GET /laporan/{id}` |
| `createLaporan(payload)` | `POST /laporan` |
| `submitLaporan(id)` | `PATCH /laporan/{id}/submit` |
| `approveLaporan(id, catatan)` | `PATCH /laporan/{id}/approve` |

---

## 11. MOCK DATA YANG SUDAH ADA

### 11.1 Mahasiswa (12 data)
- Prodi: Teknik Informatika, Teknik Industri, Teknik Sipil, Arsitektur, Sistem Informasi
- Angkatan: 2021–2024
- Kategori: Reguler & Aspirasi
- Status: Aktif, Dicabut
- SP: null, SP1, SP2, SP3

### 11.2 Dokumen Queue (7 data)
- Status: Menunggu (5), Disetujui (1), Ditolak (1)
- Jenis: Sertifikat KKN, MABIM, Bukti Keaktifan Organisasi, dll.

### 11.3 SP List (4 data)
- Level: SP1 (2), SP2 (1), SP3 (1)
- Status: Aktif, Masa Tenggang, Pemberhentian

### 11.4 IPK History (6 semester)
- Semester 1–6 untuk satu mahasiswa

### 11.5 Prodi Stats (5 prodi)
### 11.6 Angkatan Stats (2022–2026)

### 11.7 Laporan (4 data)
- Status: Disetujui (3), Draft (1)

---

## 12. ALUR BISNIS UTAMA

### 12.1 Alur Registrasi Mahasiswa KIP-K
```
Admin → Tambah Mahasiswa → Input SK + Data + Kategori
     → Sistem generate kredensial (NIM = username, password = kip{NIM}2026)
     → Success Modal → Salin/Cetak kredensial
     → Mahasiswa login pertama → Wajib ganti password
```

### 12.2 Alur Upload & Validasi Dokumen
```
Mahasiswa → Upload Dokumen (jenis tertentu) → Status "Menunggu"
          ↓
Admin → Lihat Antrian Dokumen → Preview → Setujui/Tolak
     → Jika Ditolak: input catatan penolakan
     → Mahasiswa terima notifikasi → Re-upload jika perlu
```

### 12.3 Alur Penerbitan SP
```
Admin deteksi IPK < 3.0 → Terbitkan SP (SP1)
  → Sistem simpan SP dengan batas evaluasi
  → Mahasiswa lihat SP di halaman SPMahasiswa
  → Setelah batas evaluasi, admin review:
     - IPK membaik → Status "Selesai"
     - IPK tetap buruk → Terbitkan SP2
  → SP3 → Status "Pemberhentian" → Proses cabut KIP-K
```

### 12.4 Alur Bebas Tanggungan
```
Mahasiswa cek checklist syarat bebas tanggungan
  → Semua syarat terpenuhi → Ajukan Permohonan
  → Admin review → Cek checklist + dokumen
  → Setujui/Tolak/Minta Perbaikan
  → Disetujui → Generate Surat Bebas Tanggungan
```

### 12.5 Alur Laporan Semester
```
Admin susun laporan (template + data real)
  → Simpan sebagai Draft
  → Review → Submit ke Warek (status: Diajukan)
  → Warek review laporan
  → Setujui (dengan catatan opsional) atau Tolak (dengan alasan)
  → Admin revisi jika ditolak → Submit ulang
```

---

## 13. KOMPONEN BERSAMA (Shared Components)

### 13.1 UI Components
- `Badge.tsx`: badge status dengan varian warna
- `EmptyState.tsx`: tampilan ketika data kosong
- `Modal.tsx`: modal container reusable
- `PageHeader.tsx`: header halaman dengan breadcrumb
- `SearchFilter.tsx`: komponen search + filter
- `StatCard.tsx`: kartu statistik

### 13.2 Admin Components
- `DokumenCard.tsx`: kartu dokumen antrian
- `IPKChart.tsx`: grafik line IPK
- `MahasiswaSummaryCard.tsx`: kartu ringkasan mahasiswa
- `SPProgressBadge.tsx`: badge progress SP

### 13.3 Student Components
- `DokumenUploadCard.tsx`: kartu upload dokumen
- `OrganisasiCard.tsx`: kartu organisasi
- `PrestasiCard.tsx`: kartu prestasi

---

## 14. VALIDASI FORM — RINGKASAN

| Halaman | Field | Validasi |
|---------|-------|----------|
| Login | username | required |
| Login | password | required |
| Tambah Mahasiswa | nomorSK | required |
| Tambah Mahasiswa | tanggalSK | required |
| Tambah Mahasiswa | nim | required + unik (async check) |
| Tambah Mahasiswa | nama | required |
| Tambah Mahasiswa | prodi | required |
| Tambah Mahasiswa | angkatan | required |
| Tambah Mahasiswa | fileSK | format (PDF/JPG/PNG), max 5MB |
| Upload Dokumen | file | format (PDF/JPG/PNG), max 5MB |
| Tambah Prestasi | semua field | required + file max 5MB |
| Tambah Organisasi | semua field | required |
| Tambah Pelatihan | semua field | required |
| Hapus Mahasiswa | nim konfirmasi | harus sama dengan NIM |
| Ganti Password | passwordLama | required |
| Ganti Password | passwordBaru | required, min 8 char |
| Ganti Password | konfirmasi | harus sama dengan passwordBaru |

---

## 15. STATE MANAGEMENT PATTERNS

### 15.1 Page-level State (useState)
- Filter state (search, prodi, angkatan, dll.)
- Pagination state (page, totalPages)
- Modal open/close state
- Form data state
- Loading/error state
- File upload state

### 15.2 Global State (AuthContext)
- `user: UserSession | null`
- `setUser`: update user setelah login
- `logout`: clear session
- `isLoading`: cek apakah session sedang di-restore

### 15.3 Data Fetching Pattern (Saat Ini Mock)
```typescript
// Pattern yang digunakan di semua service:
await new Promise(r => setTimeout(r, 300)); // simulate delay
return mockData.filter(...);

// Pattern yang akan dipakai setelah backend:
return api.get<T>("/endpoint");
```

---

## 16. ENVIRONMENT VARIABLES

| Variable | Nilai Default | Keterangan |
|----------|---------------|------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Base URL API backend |

---

## 17. RINGKASAN API ENDPOINTS YANG DIBUTUHKAN BACKEND

### Auth
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me  (restore session)
```

### Mahasiswa
```
GET    /api/mahasiswa  (dengan filter & pagination)
POST   /api/mahasiswa
GET    /api/mahasiswa/:id
PUT    /api/mahasiswa/:id
DELETE /api/mahasiswa/:id
GET    /api/mahasiswa/check-nim/:nim

GET    /api/mahasiswa/:id/ipk
POST   /api/mahasiswa/:id/ipk
GET    /api/mahasiswa/:id/prestasi
POST   /api/mahasiswa/:id/prestasi
PUT    /api/mahasiswa/:id/prestasi/:pid
DELETE /api/mahasiswa/:id/prestasi/:pid
GET    /api/mahasiswa/:id/organisasi
POST   /api/mahasiswa/:id/organisasi
PUT    /api/mahasiswa/:id/organisasi/:oid
DELETE /api/mahasiswa/:id/organisasi/:oid
GET    /api/mahasiswa/:id/pelatihan
POST   /api/mahasiswa/:id/pelatihan
PUT    /api/mahasiswa/:id/pelatihan/:pid
DELETE /api/mahasiswa/:id/pelatihan/:pid
GET    /api/mahasiswa/:id/dokumen
POST   /api/mahasiswa/:id/dokumen  (multipart)
GET    /api/mahasiswa/:id/sp
GET    /api/mahasiswa/:id/bebas-tanggungan
```

### Dokumen (Admin)
```
GET    /api/dokumen/queue
PATCH  /api/dokumen/:id/approve
PATCH  /api/dokumen/:id/reject
GET    /api/dokumen/:id/preview
GET    /api/dokumen/:id/download
```

### Surat Peringatan
```
GET    /api/sp
POST   /api/sp
GET    /api/sp/:id
PATCH  /api/sp/:id/status
```

### Bebas Tanggungan
```
GET    /api/bebas-tanggungan
GET    /api/bebas-tanggungan/:id
PATCH  /api/bebas-tanggungan/:id/approve
PATCH  /api/bebas-tanggungan/:id/reject
PATCH  /api/bebas-tanggungan/:id/revision
POST   /api/mahasiswa/bebas-tanggungan  (dari sisi mahasiswa)
```

### Laporan
```
GET    /api/laporan
POST   /api/laporan
GET    /api/laporan/:id
PUT    /api/laporan/:id
PATCH  /api/laporan/:id/submit
PATCH  /api/laporan/:id/approve
PATCH  /api/laporan/:id/reject
```

### Dashboard
```
GET    /api/admin/dashboard
GET    /api/mahasiswa/dashboard
GET    /api/prodi/dashboard
GET    /api/warek/dashboard
```

### Konfigurasi
```
GET    /api/konfigurasi
PUT    /api/konfigurasi
```

### Audit Log
```
GET    /api/audit?search=&role=&dari=&sampai=&page=&limit=
```

### Prodi
```
GET    /api/prodi/mahasiswa  (filter berdasarkan prodi dari token)
POST   /api/prodi/ekspor
```

### Profile
```
GET    /api/profile
PUT    /api/profile  (multipart untuk foto)
POST   /api/profile/password
```

---

---

## 18. CATATAN KHUSUS IMPLEMENTASI BACKEND

### 18.1 Nama Role & Penyesuaian
| Role Frontend | Redirect Path | Deskripsi |
|---|---|---|
| `admin` | `/admin` | Pengelola KIP-K (Biro Kemahasiswaan) |
| `mahasiswa` | `/mahasiswa` | Penerima KIP-K |
| `prodi` | `/prodi` | Kaprodi/staff Program Studi — read-only |
| `warek` | `/warek` | Wakil Rektor III — hanya approve laporan |

### 18.2 Fitur File (Multipart Upload)
| Entitas | File yang Diupload | Format | Maks |
|---|---|---|---|
| Mahasiswa | Scan SK KIP-K | PDF/JPG/PNG | 5MB |
| Dokumen Kewajiban | File dokumen | PDF/JPG/PNG | 5MB |
| Prestasi | Sertifikat + Foto | PDF/JPG/PNG | 5MB |
| Organisasi | SK Organisasi | PDF/JPG/PNG | 5MB |
| Pelatihan | Sertifikat | PDF/JPG/PNG | 5MB |
| IPK | KHS (Kartu Hasil Studi) | PDF/JPG | 5MB |
| Profil | Foto profil | JPG/PNG | 2MB |
| Konfigurasi | Logo institusi | PNG/SVG | 2MB |

### 18.3 Auto-Generate Data
- **Username mahasiswa**: otomatis = NIM
- **Password awal**: `kip{NIM}2026` (harus diganti saat login pertama)
- **Nomor Surat SP**: format `SP{level}/KIP-K/ITG/{TAHUN}/{NO}`
- **Nomor Laporan**: format `{NO}/LAP/ITG/{BULAN_ROMAWI}/{TAHUN}`
- **Nomor Surat Bebas Tanggungan**: format `SKPS/KIP-K/ITG/{BULAN_ROMAWI}/{TAHUN}/{NO}`

### 18.4 Konfigurasi Sistem (Default Values)
| Parameter | Nilai Default |
|---|---|
| IPK minimum KIP-K | 3.0 |
| Masa perbaikan SP | 1 semester |
| Max semester studi | 8 |
| Jenis dokumen wajib | PKKMB, MABIM, Bela Negara, Sertifikasi, Berita Acara KP |
| Grade system | A=4.0, AB=3.5, B=3.0, BC=2.5, C=2.0, D=1.0, E=0.0 |

### 18.5 Business Rules
1. **SP Level sequence**: SP1 → SP2 → SP3 (tidak bisa langsung SP3 kecuali Cuti Tanpa Izin)
2. **SP3 = Pemberhentian Permanen** dari kepesertaan KIP-K
3. **Bebas Tanggungan** hanya bisa diajukan jika: semua dokumen wajib disetujui + tidak ada SP aktif + IPK memenuhi standar + SKS lengkap (144 SKS)
4. **Periode input nilai** dikontrol admin (buka/tutup), mahasiswa tidak bisa input jika periode tutup
5. **Laporan** harus disetujui Warek III sebelum dianggap final
6. **Laporan yang Dikembalikan** oleh Warek → admin bisa revisi + submit ulang
7. **Dokumen yang Ditolak** admin → mahasiswa bisa upload ulang
8. **Prestasi/Organisasi/Pelatihan** dari mahasiswa harus disetujui admin sebelum dianggap valid

### 18.6 Notifikasi yang Diperlukan
| Event | Penerima |
|---|---|
| Upload dokumen baru | Admin (badge antrian) |
| Dokumen disetujui/ditolak | Mahasiswa |
| SP diterbitkan | Mahasiswa |
| Bebas tanggungan disetujui/ditolak | Mahasiswa |
| Laporan disubmit ke Warek | Warek |
| Laporan disetujui/dikembalikan | Admin |
| Prestasi/Organisasi/Pelatihan divalidasi | Mahasiswa |

---

*Dokumen ini merupakan analisis lengkap berdasarkan pembacaan langsung seluruh file frontend SIMKIP-ITG.*
