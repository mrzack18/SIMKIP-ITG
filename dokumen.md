# Dokumen Proyek SIMKIP-ITG
## Ide Awal Proyek, Komposisi Tim, dan Role Matrix

**Nama Proyek:** SIMKIP-ITG — Sistem Monitoring Mahasiswa KIP Kuliah
**Instansi:** Institut Teknologi Garut (ITG)
**Unit Pengguna:** Biro Kemahasiswaan
**Dokumen Versi:** 1.0 *(draf)*

| Atribut | Keterangan |
|---|---|
| Kode Proyek | `SIMKIP-ITG` |
| Jenis Proyek | Kerja Praktik / Tugas Kuliah Praktik (KP) — pengembangan *web application* dari nol |
| Metodologi | Rapid Application Development (RAD) |
| Status | Aktif — Fase 1–6 berjalan, MVP nearing *code freeze* |
| Repository | SIMKIP-ITG (Laravel + React + Inertia.js) |

> **Dokumen acuan yang sudah ada di repository:**
> `HLR_...md` (High-Level Requirements) · `SRS_...md` (Software Requirements Specification) ·
> `Roadmap_...md` (Roadmap 6 Fase) · `README.md` (Fitur & Tech Stack) ·
> `laporan/fase1/dokumentasi.md` & `laporan/fase2/dokumentasi.md` (Laporaneach Fase).
> Dokumen ini **tidak menggantikan** dokumen-dokumen tersebut, melainkan merangkum ide awal,
> komposisi tim, dan matriks peran dalam satu tempat.

---
---

# BAGIAN 1 — IDE AWAL PROYEK

## 1.1 Ringkasan Ide (Elevator Pitch)

> **SIMKIP-ITG** adalah sistem informasi berbasis web yang mengubah pengelolaan penerima
> beasiswa **KIP Kuliah (KIP-K)** di Institut Teknologi Garut dari proses **manual dan
 *tersebar** menjadi **terpusat, otomatis, dan dapat diaudit** — mulai dari input SK & NIM,
 * rekam jejak akademik per semester, pengarsipan dokumen wajib, penerbitan Surat
 * Peringatan (SP) berjenjang, hingga approval *Bebas Tanggungan* sebagai syarat sidang
> dan pelaporan resmi kepada Wakil Rektor III.

## 1.2 Ide Awal / Sinnyar debilidad Terdahulu

Ide proyek ini berangkat dari **wawancara elisitasi kebutuhan** bersamaETO heritage-runtime
narasumber kunci dari-client Biro Kemahasiswaan ITG (Bapak Encep — Pengelola KIP-Kuliah).
Pertemuan tersebutzjerno fakta-fakta vital:

| Temuan Wawancara | Implikasi terhadap Sistem |
|---|---|
| *"Data tersebar, tidak terpusat."* | Dibutuhkan *single source of truth* untuk seluruh data mahasiswa KIP-K. |
| *"Yang approve dokumen ya BKKH / dari Kemahasiswa."* | Peran **Admin/Kemahasiswaan** sebagai pengendali utama (validasi dokumen, SP, bebas tanggungan). |
| *"Nilai turun jadi 2.8, aturannya 3.0, itu SP 1."* | Ambang IPK **tidak boleh di-*hardcode*** — harus jadi konfigurasi (`system_settings`) yang dapat diubah. |
| *"Penting pisahkan Reguler vs Aspirasi."* | Kategori **`reguler` / `aspirasi`** wajib menjadi kolom utama pada entitas mahasiswa. |
| *"Kasus mahasiswa belum lulus baru tahu setelah bertahun-tahun."* | Butuh **monitoring masa studi (maks. 8 semester)** &扳 alert batas semester. |
| *"Sertifikat MABIM/KKN/KP sering hilang, нужuh buat sidang & SKPI."* | Butuh **Arsip Digital ("Drive Pribadi")** yang menyimpan dokumen tervalidasi. |
| *"Pelaporan ke Warek tiap semester."* | Butuh modul **laporan + e-approval** oleh Warek 3. |

## 1.3 Permasalahan Saat Ini (*As-Is*)

1. **Data tercecer.** Data mahasiswa, SK, prestasi, organisasi, dan sertifikat tidak
   tersimpan terpusat.
2. **Audit & pelacakan sulit.** Biro Kemahasiswaan kesulitan melakukan pemeriksaan
   menyeluruh per angkatan, termasuk melacak mahasiswa yang mengundurkan diri.
3. **Dokumen hilang.** Mahasiswa kehilangan sertifikat fisik (MABIM, KKN, KP, bela negara)
   yang dibutuhkan sebagai syarat sidang dan penerbitan SKPI.
4. **SP tidak terstruktur.** Pemantauan kepatuhan terhadap Surat Perjanjian KIP-K dan
   penerbitan SP masih manual, rentan kelalaian.
5. **Tanpa visibilitas kelulusan.** Tidak ada pantauan *real-time* status kelulusan
   mahasiswa yang masa studinya sudah melewati batas 8 semester.

## 1.4 Solusi yang Diusulkan (*To-Be*)

```
  SEBELUM (Manual)                          SESUDAH (SIMKIP-ITG)
  ────────────────────                      ────────────────────────────
  Buku & Excel tersebar          ──────►     Satu basis data terpusat
  Arsip fisik sertifikat        ──────►     Arsip Digital ("Drive Pribadi")
  Penilaian IPK manual           ──────►     Auto-kalkulasi IPS/IPK + deteksi SP
  Surat peringatan manual       ──────►     SP berjenjang otomatis (SP1→SP2→SP3)
  Surat bebas tanggunganmanual  ──────►     PDF resmi ber-QR Code
  Laporan Word/Excel manual     ──────►     Dashboard statistik + e-Signature Warek 3
  Tidak ada audit trail         ──────►     Audit log setiap aksi kritikal
```

## 1.5 Tujuan Proyek

| No | Tujuan | Indikator Keberhasilan |
|---|---|---|
| 1 | Terpusatkannya seluruh data mahasiswa KIP-K | 100% data mahasiswa KIP-K aktif terdaftar di sistem |
| 2 | Rekam jejak akademik yang tertata | Rekam 8 semester tiap mahasiswa dapat ditelusuri kapan saja |
| 3 | Otomatisasi pemantauan kepatuhan | SP berjenjang terbit otomatis berdasarkan IPK & jenis pelanggaran |
| 4 | Pengarsipan dokumen yang aman | Tidak ada dokumen wajib yang hilang; arsip digital tersedia 24/7 |
| 5 | Kontrol kelulusan |tombol "Ajukan Bebas Tanggungan" hanya aktif bila seluruh syarat terpenuhi |
| 6 | Pelaporan yang siap tanda tangan | Laporan semesteran ter-*approve* Warek 3 dan dapat diunduh Excel/PDF |

## 1.6 Ruang Lingkup

### Termasuk (In Scope)
1. Autentikasi & manajemen akun berbasis peran (*Role-Based Access Control*).
2. Manajemen data master mahasiswa (SK, NIM, angkatan, prodi, kategori Reguler/Aspirasi).
3. Rekam akademik per semester (KHS, IPS, IPK) beserta proses validasi oleh admin.
4. Prestasi, keaktifan organisasi, dan pelatihan (portofolio non-akademik).
5. Manajemen dokumen wajib (MABIM, KKN, KP, Bela Negara, PKKMB, Sertifikasi) +
   validasi/penolakan + arsip digital.
6. Sistem Peringatan (SP) berjenjang: SP1, SP2, SP3, *grace period*, dan pencabutan KIP-K.
7. Approval Bebas Tanggungan + generate surat PDF.
8. Dashboard statistik & ekspor laporan (Excel/PDF) + e-approval Warek 3.
9. Konfigurasi sistem (ambang IPK, jenis dokumen, jenis pelanggaran, periode akademik).
10. Integrasi/sinkronisasi data mahasiswa dari **LSIPD** (sistem informasi akademik kampus).

### Tidak Termasuk (*Out of Scope*)
1. **Modul PMB/seleksi pendaftaran mahasiswa** — sengaja dipisah agar sistem tetap fokus
   pada *monitoring*.
2. **Impor data historis** angkatan sebelum 2026 — masuk fase lanjutan.
3. **Integrasi real-time penuh** dengan sistem PMB — belum wajib untuk rilis pertama.
4. Modul keuangan/pencairan dana KIP-K.

## 1.7 Pengguna Sasaran (Aktor)

| Aktor | Deskripsi Singkat |
|---|---|
| **Admin / Super Admin (Biro Kemahasiswaan)** | Pengelola KIP-K; kendali penuh sistem. |
| **Mahasiswa (Penerima KIP-K)** | Mengidata & mengunggah dokumennya sendiri. |
| **Program Studi (Prodi)** | Pemantau (*viewer*) data mahasiswa di lingkup prodinya. |
| **Wakil Rektor III (Warek 3)** | Pemberi *e-approval* atas laporan resmi semester. |
| **USI / LSIPD ITG** | Mitra teknis: sinkronisasi data akademik & konfigurasi master. |

> Rincian hak akses masing-masing aktor disajikan pada **Bagian 3 — Role Matrix**.

## 1.8 Indikator Evaluasi Akademik Mahasiswa

Empat indikator yang menjadi dasar evaluasi tiap semester (dinyatakan几种哈 pada wawancara):

| No | Indikator | Peran dalam Sistem |
|---|---|---|
| 1 | **IPK** | Indikator utama; pemicu Surat Peringatan. |
| 2 | **Prestasi** | Dicatat & dilampirkan bukti dokumen. |
| 3 | **Keaktifan Organisasi** | Dicatat & dilampirkan bukti dokumen. |
| 4 | **Informasi Pribadi** | Catatan anggaran & permasalahan; bersifat rahasia (khusus Admin). |

## 1.9 Pendekatan & Metodologi

Metodologi yang dipilih adalah **Rapid Application Development (RAD)**, dengan target
operasional (MVP) sekitar **4 minggu (1 bulan)** untuk mahasiswa KIP-K angkatan 2026.
Pendekatan ini dipilih karena:

- Kebutuhan bisnis sudah **terdefinisi jelas** lewat HLR, SRS, dan wawancara.
- 時間Iterasi cepat dan *feedback loop* langsung dari Product Owner (Kemahasiswaan) sangat
  dibutuhkan.
- Cakupan MVP **sempit dan terukur** (6 fitur inti + turunan wajibnya).

### Roadmap 6 Fase (ringkas)

| Fase | Nama Fase | Periode | Output Utama | Status |
|:---:|---|---|---|:---:|
| 1 | Inisialisasi Proyek & Autentikasi | Minggu 1 | Struktur Laravel+Inertia, RBAC, ganti password wajib | ✅ Selesai |
| 2 | Data Master & Akademik | Minggu 1–2 | CRUD mahasiswa, input KHS/IPK, nestasi validasi | ✅ Selesai |
| 3 | Manajemen Dokumen & Validasi | Minggu 2 | Upload dokumen, antrean validasi, Arsip Digital | ✅ Selesai |
| 4 | Sistem Peringatan (SP) Berjenjang | Minggu 3 | Terbitan SP1–SP3, *grace period*, auto-pencabutan | ✅ Selesai |
| 5 | Bebas Tanggungan & Pelaporan | Minggu 3–4 | PDF Surat, dashboard grafis, ekspor, e-Signature Warek 3 | ✅ Selesai |
| 6 | UAT & Deployment | Minggu 4 | Testing E2E, *deployment* server, pelatihan | 🔄 Berjalan |

## 1.10 Arsitektur & Teknologi (*Tech Stack*)

| Lapisan | Teknologi | Keterangan |
|---|---|---|
| *Backend* | Laravel 13 · PHP ^8.3 | Routing, logika bisnis, ORM, RBAC *middleware*, PDF. |
| *Autentikasi* | Laravel Sanctum 4 | *Bearer token* untuk API. |
| *Frontend* | React 18 · Inertia.js 2 | SPA tanpa *page reload*; komponen berbasis peran. |
| *Styling* | Tailwind CSS 4 · Radix/shadcn-ui | Komponen UI konsisten & responsif. |
| *Build Tool* | Vite 8 | Bundling aset frontend. |
| *Database* | MySQL 8.4 (Docker) / SQLite (lokal) | ±33 tabel relasional via Eloquent ORM. |
| *Dokumen PDF* | `barryvdh/laravel-dompdf` | Surat Bebas Tanggungan ber-QR Code. |
| *Ekspor* | Excel / PDF | Rekap laporan & data mahasiswa. |
| *Integrasi* | LSIPD API | Sinkronisasi data mahasiswa & transkrip. |
| *Lingkungan* | Docker Compose | Container `app` (PHP), `node` (Vite), `mysql` (DB), Nginx *reverse proxy*. |

### Prinsip Arsitektur
1. **Monolitik modern** — Laravel sebagai *backend* sekaligus penyaji halaman lewat Inertia
   (tanpa API RESTful terpisah), sehingga waktu pengembangan lebih efektif.
2. **Role-Based Access Control** — *middleware* `CheckRole` melindungi setiap *route* group
   sesuai peran pengguna; `ForcePasswordChange` memaksa mahasiswa mengganti *password* default.
3. **Konfigurasi bukan *hardcode*** — seluruh aturan bisnis (ambang IPK, batas semester,
   jenis dokumen, jenis pelanggaran) disimpan di database dan dapat diubah lewat UI Konfigurasi.
4. **Auditability** — setiap aksi kritikal (validasi, penerbitan SP, perubahan status,
   hapus data) tercatat pada tabel `audit_logs`.
5. **File aman** — dokumen disimpan di direktori non-*public* dan hanya dilayani melalui
   *endpoint* terautentikasi.

---
---

# BAGIAN 2 — KOMPOSISI TIM

## 2.1 Identitas Tim Pengembang

| No | Nama | NIM | Kontak (ITG Mail) | Git Handle | Peran |
|:---:|---|---|---|---|---|
| 1 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |
| 2 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |
| 3 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |
| 4 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |
| 5 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |
| 6 | *(isi)* | *(isi)* | *(isi)* | *(isi)* | *(isi)* |

## 2.2 Ringkasan Peran

| Kode Peran | Nama Peran | Jumlah | FokusUtama |
|:---:|---|:---:|---|
| PM | *Project Manager* / Koordinator | *(isi)* | Koordinasi,Requirement, komunikasi dengan Product Owner |
| BE | *Backend Developer* | *(isi)* | Laravel, Eloquent, RBAC, logika bisnis, PDF |
| FE | *Frontend Developer* | *(isi)* | React, Inertia, Tailwind, komponen UI |
| DB | *Database & Integrasi* | *(isi)* | Skema basis data, seeder, integrasi LSIPD |
| QA | *Quality Assurance* | *(isi)* | Pengujian E2E, validasi, perbaikan *bug* |
| DOC | *Dokumentasi & UI/UX* | *(isi)* | HLR/SRS/Roadmap, mockup, laporan fase |

## 2.3 Pembagian Tugas per Modul (RACI Tim Dev)

Legenda: **R** = *Responsible* (pelaksana) · **A** = *Accountable* (penanggung jawab) ·
**C** = *Consulted* (pendapat) · **I** = *Informed* (diberi tahu).
*(Baris diisi sebagai A = [Nama], R = [Nama], dst. setelah data tim tersedia.)*

| Modul / Pekerjaan | PM | BE | FE | DB | QA | DOC |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Requirement & interviewing Product Owner | A | C | C | C | I | R |
| Penulisan HLR / SRS / Roadmap | A | C | C | I | I | R |
| Fase 1 — Setup, Auth, RBAC, migrasi | C | A | R | R | C | I |
| Fase 2 — CRUD Mahasiswa & akademik | C | A | R | R | C | I |
| Fase 3 — Dokumen wajib & validasi | C | A | R | C | C | I |
| Fase 4 — Logika SP berjenjang | I | A | R | C | C | I |
| Fase 5 — Bebas tanggungan, PDF, laporan | I | A | R | C | C | I |
| Fase 6 — UAT, *deployment*, pelatihan | A | R | R | R | R | C |
| Dokumentasi & laporan fase | I | C | C | I | C | A |
| Desain UI/UX & *mockup* | C | I | A | I | C | R |
| Integrasi LSIPD | I | C | I | A | C | I |

## 2.4 Alur Kerja Tim (ringkas)

1. **Requirement** — PM + DOC meng尤为重要 hasil wawancara menjadi HLR → SRS → Roadmap.
2. **Perencanaan** — PM membagi task per Fase; setiap modul ditetapkan *owner*-nya.
3. **Pengembangan** — BE & FE mengerjakan task secara paralel dengan *daily commit* ke
   repository bersama pada `main` (dengan *branch* per fitur bila diperlukan).
4. **Integrasi & Pengujian** — QA memverifikasi alur ujung-ke-ujung tiap use case;
   *bug* dicatat dan di-*fix* oleh pemilik modul terkait.
5. **Pelaporan** — DOC menyusun laporan fase (`laporan/faseX/dokumentasi.md`) sebagai
   lampiran laporan KP.
6. **Demo & Approval** — PM Pirda一些问题oster demo ke Product Owner (Biro Kemahasiswaan)
   untuk obtain *sign-off*edeploy.

## 2.5heiraKlien &eaxternal Party

|_party | Peran dalam Proyek |PIC |
|---|---|---|
| Biro Kemahasiswaan ITG | *Product Owner* — pemilik kebutuhan, pengesah fitur | *(isi)* |
| Warek 3 | *Approver* laporan resmi | *(isi)* |
| USI / LSIPD ITG | Mitra teknis — server, sinkronisasi data | *(isi)* |
| Dosen Pembimbing | Pembimbing KP — supervisi & persetujuan laporan | *(isi)* |

> **Catatanonteknis riwayatnya.** Dua akun *git* dengan kontribusi kode aktif pada
> repository adalah `mrzack18` dan `xbracaa`. *Sel komposisi tim di atas dapat dilengkapi
> oleh masing-masing anggota sesuai pembagian tugas final tim.*

---
---

# BAGIAN 3 — ROLE MATRIX

## 3.1 Daftar Peran (*Roles*) pada Sistem

| Kode | Nama Peran |ichlet | Pengguna | Tanggung Jawab Utama |
|:---:|---|---|---|---|
| **A** | **Admin / Super Admin** | `admin` | Biro Kemahasiswaan (Bpk. Encep & tim) | Kendali penuh: input SK/NIM, validasi KHS & dokumen, terbitkan SP, approval bebas tanggungan, kelola laporan, hapus data (dengan konfirmasi). |
| **M** | **Mahasiswa** | `mahasiswa` | Penerima KIP-K | Input KHS/IPK, prestasi, organisasi, pelatihan; unggah dokumen wajib; lihat notifikasi SP; ajukan & unduh Surat Bebas Tanggungan. |
| **P** | **Program Studi** | `prodi` | Zul‚ Heads/ lightenings Capsule Program Studi | *Viewer* data & rekap mahasiswa **prodinya saja**; ekspor laporan. Tidak punya wewenang validasi/approval. |
| **W** | **Warek 3** | `warek` | Wakil Rektor III | *Approver* laporan resmi semester yang diajukan Admin; akses *read-only* dashboard & data mahasiswa lintas prodi. |
| **L** | **LSIPD / USI** | `lsipd` | Tim TI ITG | Sinkronisasi data mahasiswa & transkrip dari LSIPD; master Prodi, Nilai Mutu, Tahun Ajaran; manajemen user sistem. |

## 3.2 Matriks Hak Akses (Ringkasan)

| Aktivitas / Fitur | **Admin** | **Mahasiswa** | **Prodi** | **Warek 3** | **LSIPD** |
|---|:---:|:---:|:---:|:---:|:---:|
| Login & ganti *password* | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard & statistik | ✅ Penuh | ✅ Milik sendiri | ✅ Prodi sendiri | ✅ Ringkasan nasional | ✅ |
| Input SK & aktivasi akun mahasiswa | ✅ | – | – | – | 🔄 (via sync) |
| Input KHS / IPS / IPK | 👁️ Lihat & validasi | ✅ Data sendiri | 👁️ Lihat prodi sendiri | 👁️ Lihat | – |
| Validasi KHS | ✅ | – | – | – | – |
| Input prestasi / organisasi / pelatihan | 👁️ Validasi | ✅ Data sendiri | 👁️ Lihat prodi sendiri | – | – |
| Unggah dokumen wajib | 👁️ Lihat & validasi | ✅ Milik sendiri | 👁️ Lihat prodi sendiri | – | – |
| Validasi dokumen (Approve/Reject) | ✅ | – | – | – | – |
| Terbitkan SP1 / SP2 / SP3 | ✅ | – | 👁️ Lihat status | 👁️ Lihat | – |
| Terima notifikasi SP | – | 🔔 Notifikasi | – | – | – |
| Ajukan Bebas Tanggungan | – | 📝 Ajukan | – | – | – |
| Approve Bebas Tanggungan | ✅ | – | – | – | – |
| Unduh PDF Surat Bebas Tanggungan | ✅ | ✅ Milik sendiri | – | – | – |
| Susun laporan semester | 📝 Susun & ajukan | – | – | – | – |
| Approve/kembalikan laporan | – | – | – | ✅ Approve final | – |
| Ekspor data/laporan (Excel/PDF) | ✅ | ✅ Data sendiri | ✅ Prodi sendiri | ✅ | – |
| Konfigurasi ambang IPK / batas semester | ✅ | – | – | – | ✅ |
| Konfigurasi jenis dokumen & field custom | ✅ | – | – | – | ✅ |
| Konfigurasi jenis pelanggaran | ✅ | – | – | – | ✅ |
| Master Prodi, Nilai Mutu, Tahun Ajaran | – | – | – | – | ✅ |
| Manajemen User (tambah/edit/reset *password*) | – | – | – | – | ✅ |
| Sinkronisasi Data LSIPD | – | – | – | – | ✅ |
| Hapus data | ✅ (wajib konfirmasi) | – | – | – | ✅ |
| Akses Audit Log | ✅ | – | – | – | ✅ |

**Legenda:** ✅ = akses penuh · 👁️ = lihat saja (*read-only*) · 📝 = mengajukan/menyusun ·
🔔 = menerima notifikasi · 🔄 = sebagian/terkoordinasi · – = tidak ada akses.

## 3.3 Matriks Otorisasi per Modul (CRUD)

| Modul | Admin | Mahasiswa | Prodi | Warek 3 | LSIPD |
|---|---|---|---|---|---|
| **Data Mahasiswa** | C R U D | R (data sendiri, sebagian) | R (prodi sendiri) | R (baca) | C R U D (via sync) |
| **KHS / Akademik** | C R U D | C R U (dalam periode) | R (prodi sendiri) | R (baca) | C R (sync transkrip) |
| **Dokumen Wajib** | C R U D | C R U D (diri sendiri) | R (prodi sendiri) | – | – |
| **Prestasi / Org / Pelatihan** | C R U D | C R U (diri sendiri) | R (prodi sendiri) | – | – |
| **Surat Peringatan (SP)** | C R U D | R (lihat milik sendiri) | R (lihat status) | R (ringkasan) | – |
| **Bebas Tanggungan** | C R U D | C R ( checklists & ajukan) | R (baca) | – | – |
| **Laporan** | C R U (approve request) | – | R (baca) | C R U (approve) | – |
| **Konfigurasi** | R U (ambang & operasional) | – | – | – | C R U D |
| **Manajemen User** | – | R U (profil sendiri) | – | – | C R U D |
| **Audit Log** | R | – | – | – | R |

> **Penjelasan kode:** `C` = Create, `R` = Read, `U` = Update, `D` = Delete.
> Biawa hapus (**D**) hanya dimiliki Admin & LSIPD, dan untuk Admin disertai konfirmasi.

## 3.4 Aturan & Batasan Keamanan Per Peran

| No | Aturan | Berlaku Untuk |
|:---:|---|---|
| 1 | **Password default wajib diganti** pada login pertama (`ForcePasswordChange`) | Mahasiswa (utama), semua role baru |
| 2 | **Tidak ada hak hapus data** | Mahasiswa & Prodi (hard rule BR-4) |
| 3 | **Akun dinonaktifkan** otomatis bila SP3 disahkan / mahasiswaSTATUS *Dicabut* / *Lulus* | Mahasiswa |
| 4 | **Cakupan data Prodi terbatas** pada fakultas/prodi-nya sendiri | Prodi |
| 5 | **Warek 3 bersifat *read-only*** terhadap data operasional; wewenangnya hanya *approve* laporan | Warek 3 |
| 6 | **Ambang IPK & batas semester** dapat dikonfigurasi (tidak *hardcode*) | Admin & LSIPD |
| 7 | **Dokumen hanya dapat di-*delete* oleh Admin** dengan konfirmasi; mahasiswa hanya bisa menghapus dokumen yang *ditolak* untuk diunggah ulang | Admin & Mahasiswa |
| 8 | **Seluruh aksi kritikal dicatat** pada tabel `audit_logs` (siapa, kapan, aksi apa) | Seluruh role |
| 9 | **File dokumen** disimpan di direktori non-*public* dan dilayani hanya lewat *endpoint* terautentikasi | Seluruh role |
| 10 | **Cuti tanpa izin** langsung berimplikasi SP3 (Pemberhentian) | Mahasiswa |

## 3.5 Proses Kunci Per Peran (Ringkas Alur)

| Alur | Pemicu | Aktif Utama | Aktif Pendukung | Output |
|---|---|---|---|---|
| Onboarding Mahasiswa KIP-K | Penetapan SK KIP | **Admin** | – | Akun mahasiswa aktif |
| Input & Validasi Semester | Periode input dibuka | **Mahasiswa** | **Admin** | KHS tervalidasi, IPS/IPK tercatat |
| Peng sustaininganDokumen | Checklist dokumen belum lengkap | **Mahasiswa** | **Admin** | Dokumen tervalidasi → Arsip Digital |
| Penerbitan SP | IPK < ambang / pelanggaran | **Admin** | **Sistem** (deteksi otomatis) | SP1/SP2/SP3 + status update |
| Bebas Tanggungan | Sem-8 & syarat lengkap | **Mahasiswa** | **Admin** | Surat PDF ber-QR Code |
| Pelaporan ke Warek | Akhir semester | **Admin** | **Warek 3** | Laporan ter-*approve*, siap cetak |

---
---

# LAMPIRAN — DAFTAR DOKUMEN & SUMBER

| Dokumen | Isi | Lokasi |
|---|---|---|
| HLR | High-Level Requirements (tingkat tinggi, elisitasi kebutuhan) | `HLR_Sistem_Monitoring_KIP_Kuliah_ITG.md` |
| SRS | Software Requirements Specification (rinci, acuan backlog) | `SRS_Sistem_Monitoring_KIP_Kuliah_ITG.md` |
| Roadmap | Roadmap 6 Fase RAD | `Roadmap_Sistem_Monitoring_KIP_Kuliah_ITG.md` |
| README | Ringkasan fitur & tech stack | `README.md` |
| Laporan Fase 1 | Inisialisasi & Autentikasi | `laporan/fase1/dokumentasi.md` |
| Laporan Fase 2 | Full Frontend (FE-First) | `laporan/fase2/dokumentasi.md` |
| Wawancara | Transkrip wawancara dengan Biro Kemahasiswaan | `wawancara.txt` |
| Analisis FE | Analisis & temuan frontend | `analisis_frontend_simkip.md` |
| Acceptance Audit | Audit acceptance role Prodi & Warek | `final_acceptance_audit_*.md` |

---

*Dokumen ini akan diperbarui seiring perkembangan proyek. Bagian 2 (Komposisi Tim) dapat
diisi lengkap oleh anggota tim, sedangkan Bagian 1 dan 3 menjadi rujukan bersama untuk
seluruh anggota dan stakeholder.*
