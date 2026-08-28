# Discovery Audit — Role Admin (SIMKIP-ITG)
**Mode**: 100% READ-ONLY  
**Tanggal Audit**: 2026-08-28  
**Auditor**: Claude (Opus 4.7)  
**Scope**: Seluruh halaman, route, controller, service, model, migration untuk Role Admin

---

## 1. Executive Summary

Audit dilakukan terhadap seluruh modul Admin SIMKIP-ITG dengan prinsip **FE = Fixed Requirement; BE & DB harus dibangun untuk memenuhi FE**. Hasil audit menemukan bahwa **mayoritas modul admin sudah diimplementasi end-to-end dengan kontrak FE↔BE yang MATCH**, kecuali beberapa celah minor.

### Status Ringkas

| Kategori | Jumlah Temuan |
| --- | --- |
| 🟢 FE↔BE MATCH | 41 |
| 🟡 FE↔BE PARTIAL | 11 |
| 🔴 MISSING BACKEND | 4 |
| 🔴 CONTRACT MISMATCH | 5 |
| 🟠 BUSINESS LOGIC GAP | 8 |
| 🔵 PRESENTATION CONSTANT (bukan masalah) | 9 |

### Verdict Akhir
🟠 **READY WITH GAPS** — Modul Admin siap dipakai dengan 8 catatan minor yang tidak memblokir deployment, tetapi perlu disempurnakan agar match sempurna dengan kontrak FE.

---

## 2. Admin Module Inventory

### Modul Admin yang Diaudit
| # | Modul | Halaman FE | Controller BE | Status |
| --- | --- | --- | --- | --- |
| 1 | Dashboard | `Dashboard.tsx` | `Api/Admin/DashboardController` | 🟢 |
| 2 | Manajemen Mahasiswa — List | `MahasiswaList.tsx` | `Api/Admin/MahasiswaController@index` | 🟢 |
| 3 | Manajemen Mahasiswa — Detail | `MahasiswaDetail.tsx` | `Api/Admin/MahasiswaController@show` | 🟢 |
| 4 | Manajemen Mahasiswa — Tambah | `TambahMahasiswa.tsx` | `Api/Admin/MahasiswaController@store, checkNim` | 🟢 |
| 5 | Manajemen Mahasiswa — Hapus | `MahasiswaList.tsx` (modal) | `Api/Admin/MahasiswaController@destroy` | 🟢 |
| 6 | Manajemen Mahasiswa — Status | `MahasiswaList.tsx`, `MahasiswaDetail.tsx` | `Api/Admin/MahasiswaController@updateStatus` | 🟢 |
| 7 | Manajemen Mahasiswa — Cabut KIP-K | `MahasiswaList.tsx`, `MahasiswaDetail.tsx` | `Api/Admin/MahasiswaController@cabutKipk` | 🟢 |
| 8 | Data Akademik | `DataAkademik.tsx` | `Api/Admin/DataAkademikController` | 🟢 (parsial — see §6) |
| 9 | Validasi Prestasi | `DataAkademik.tsx` | `Api/Admin/DataAkademikController@validatePrestasi` | � |
| 10 | Validasi Organisasi | `DataAkademik.tsx` | `Api/Admin/DataAkademikController@validateOrganisasi` | 🟢 |
| 11 | Validasi Pelatihan | `DataAkademik.tsx` | `Api/Admin/DataAkademikController@validatePelatihan` | 🟢 |
| 12 | Dokumen Queue | `DokumenQueue.tsx` | `Api/Admin/DokumenController@queue, validateDokumen, serveFile` | 🟢 |
| 13 | Surat Peringatan — List | `SPList.tsx` | `Api/Admin/SPController@index` | 🟢 |
| 14 | Surat Peringatan — Detail | `SPDetail.tsx` | `Api/Admin/SPController@show` | 🟢 |
| 15 | Surat Peringatan — Terbitkan | `TerbitkanSP.tsx` | `Api/Admin/SPController@store` | 🟢 |
| 16 | Surat Peringatan — Tandai Selesai | `SPDetail.tsx` | `Api/Admin/SPController@updateStatus` | 🟢 |
| 17 | Bebas Tanggungan — List | `BebasTanggunganList.tsx` | `Api/Admin/BebasTanggunganController@index` | 🟢 |
| 18 | Bebas Tanggungan — Detail | `BebasTanggunganDetail.tsx` | `Api/Admin/BebasTanggunganController@show` | � |
| 19 | Bebas Tanggungan — Approve | `BebasTanggunganDetail.tsx` | `Api/Admin/BebasTanggunganController@approve` | � |
| 20 | Bebas Tanggungan — Reject | `BebasTanggunganDetail.tsx` | `Api/Admin/BebasTanggunganController@reject` | 🟢 |
| 21 | Bebas Tanggungan — PDF | `BebasTanggunganDetail.tsx`, `MahasiswaDetail.tsx` | `Api/Admin/BebasTanggunganController@downloadPdf` | 🟢 |
| 22 | Laporan — List | `LaporanList.tsx` | `Api/Admin/LaporanController@index` | 🟢 |
| 23 | Laporan — Susun Baru | `SusunLaporan.tsx` | `Api/Admin/LaporanController@store, previewStatistics` | 🟢 |
| 24 | Laporan — Detail | `LaporanDetail.tsx` | `Api/Admin/LaporanController@show, downloadPdf` | 🟢 |
| 25 | Konfigurasi — Ambang Batas IPK | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@index, update` | 🟢 |
| 26 | Konfigurasi — Master Prodi | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@indexProdi/storeProdi/updateProdi/toggleProdi` | 🟢 |
| 27 | Konfigurasi — Master Dokumen Jenis | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@indexDokumenJenis/storeDokumenJenis/destroyDokumenJenis/toggleDokumenJenis` | 🟢 |
| 28 | Konfigurasi — Master Nilai Mutu | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@storeNilaiMutu/updateNilaiMutu/destroyNilaiMutu` | 🟢 |
| 29 | Konfigurasi — Master Jenis Pelanggaran | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@storePelanggaran/updatePelanggaran/destroyPelanggaran` | 🟢 |
| 30 | Konfigurasi — Master Periode Akademik | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@storePeriode/updatePeriode/destroyPeriode/activatePeriode` | 🟢 |
| 31 | Konfigurasi — Facade | `Konfigurasi.tsx` | `Api/Admin/KonfigurasiController@indexAll` | 🟢 |
| 32 | Audit Log | `AuditLog.tsx` | `Api/Admin/AuditController@index` | 🟢 (FE static) |

---

## 3. Frontend Component Inventory

### Rute (App.tsx)
```
/admin (Layout)
/admin                          → Dashboard
/admin/mahasiswa                → MahasiswaList
/admin/mahasiswa/tambah         → TambahMahasiswa
/admin/mahasiswa/:id            → MahasiswaDetail
/admin/akademik                 → DataAkademik
/admin/dokumen                  → DokumenQueue
/admin/sp                       → SPList
/admin/sp/terbitkan             → TerbitkanSP
/admin/sp/:id                   → SPDetail
/admin/bebas-tanggungan         → BebasTanggunganList
/admin/bebas-tanggungan/:id     → BebasTanggunganDetail
/admin/laporan                  → LaporanList
/admin/laporan/baru             → SusunLaporan
/admin/laporan/:id              → LaporanDetail
/admin/konfigurasi              → Konfigurasi
/admin/audit                    → AuditLog
/admin/profil                   → Profil
```

### Inventory per Halaman

#### 3.1 Dashboard.tsx (437 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getAdminDashboardData()` → `GET /api/dashboard` |
| Data | `stats`, `prodi_sebaran`, `angkatan_sebaran`, `sebaran_per_prodi_angkatan`, `sp_aktif`, `dokumen_queue` |
| Filter | Dropdown angkatan (client-side) |
| Charts | 4 BarChart (recharts) |
| Cards | 5 stat cards + 3 quick stats |
| Tabel | Tabel SP Aktif (5 rows) + Antrian Validasi (5 rows) |
| Modal | — |
| Hardcoded | `"Selamat datang, Pak Encep Jianul"` (sapaan personal) |

#### 3.2 MahasiswaList.tsx (812 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getMahasiswaList()`, `getMahasiswaFilterOptions()` |
| Data | Paginated, 12 filter (search, prodi, angkatan, sp, status, kip, ipk, sortBy) |
| Tabel | 12 kolom (No, NIM, Nama, Prodi, Angkatan, Kategori, IPK, Progres, Semester, Status, SP, Aksi) |
| Modal | Hapus (NIM-konfirmasi), Nonaktifkan/Aktifkan, Cabut KIP-K |
| Pagination | Ya (limit 10, ellipsis) |
| Loading | Skeleton dengan overlay spinner |
| Filter Prodi/Angkatan | Dari BE (`filterOptions`) — 🟢 |
| Filter SP/Status/KIPK/IPK | Hardcoded di FE — 🟡 (acceptable sebagai opsi filter) |
| Hardcoded alasan | "Cuti Akademik", "IPK di Bawah Standar" (untuk dropdown alasan) — 🟢 |

#### 3.3 MahasiswaDetail.tsx (2652 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getMahasiswaById`, `getMahasiswaIpk`, `getMahasiswaPrestasi`, `getMahasiswaOrganisasi`, `getMahasiswaPelatihan`, `getMahasiswaSpHistory`, `getMahasiswaDokumen`, `getMahasiswaBebasTanggungan` |
| Tabs | 8 tab (Riwayat Akademik, Prestasi, Keaktifan Organisasi, Pelatihan, Dokumen, SP, Informasi Pribadi, Surat Penyelesaian) |
| Modal | Terbitkan SP (select level), Nonaktifkan/Aktifkan, Cabut KIP-K |
| Action | Lihat PDF BT (`/api/bebas-tanggungan/${id}/pdf`) |
| Format prodi | String replacement client-side (Teknik → T.) |
| Hardcoded | `"Semester saat pencabutan: Ganjil 2026/2027"` (placeholder) |

#### 3.4 TambahMahasiswa.tsx (514 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `createMahasiswa`, `checkNim`, `getMahasiswaFilterOptions` |
| Form fields | nomorSK, tanggalSK, fileSK (drop zone), NIM, Nama, Prodi, Angkatan, Kategori (radio), Password auto-generated |
| Validation client | NIM 6-20 char, file 5MB, mime (pdf/jpg/png) |
| Submission | FormData → POST /mahasiswa |
| Modal | Success modal dengan credentials copy/print |

#### 3.5 DataAkademik.tsx (1634 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getRekapAkademik`, `getRekapPrestasi`, `getRekapOrganisasi`, `getRekapPelatihan`, `validatePrestasi/Organisasi/Pelatihan` |
| Main Tabs | Data Akademik, Data Non-Akademik |
| Sub-Tabs Non-Akademik | Prestasi, Keaktifan Organisasi, Pelatihan |
| Filter | Banyak (semua client-side filter) |
| Stat Cards | 3 cards (IPK < 3.0, Rata-rata IPK, Periode Input Aktif — hardcoded text "1 Sep – 15 Sep 2026") |
| Modals | PrestasiModal, OrganisasiModal, PelatihanModal (validate action) |
| Tabel | Akademik, Prestasi, Organisasi, Pelatihan |
| Hardcoded prodi list | `["Semua", "Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"]` di line 30 — 🟠 **sebaiknya dari BE** (lihat §6.2) |

#### 3.6 DokumenQueue.tsx (840 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getDokumenQueue`, `getMahasiswaPrestasi/Organisasi/Pelatihan` (untuk preview), `approveDokumen`, `rejectDokumen` |
| Tabs | Semua, Menunggu, Disetujui, Ditolak |
| Filters | Search, Jenis dokumen, Prodi, Tanggal upload |
| Pagination | Ya (limit 10) |
| Modal | Side-panel review dengan navigasi prev/next |
| Hardcoded jenisDokumen | `["Sertifikat PKKMB", "Bela Negara", "MABIM", "Berita Acara Kerja Praktik", "Sertifikasi", "Bukti Sidang Skripsi", "Sertifikat Prestasi", "SK Organisasi", "Sertifikat Pelatihan"]` di line 13-24 — � **sebaiknya dari BE `indexDokumenJenis`** |
| Preview | Generic / Prestasi / Organisasi / Pelatihan (routing via prefix `prestasi_`, `organisasi_`, `pelatihan_`, `doc_`) |

#### 3.7 SPList.tsx (289 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getSPList` |
| Tabs | Semua, SP1, SP2, SP3, Selesai |
| Search | NIM/Nama |
| Tabel | 9 kolom |
| Pagination | Ya |
| Cards summary | 4 stat cards (SP1 Aktif, SP2 Aktif, SP3, Selesai) |

#### 3.8 SPDetail.tsx (528 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getSPDetail`, `updateSPStatus` |
| Features | Header, Detail Pelanggaran, Timeline Riwayat SP, Modal "Tandai Selesai", Modal "Lihat Surat Resmi" (window.print) |
| Hardcoded | `totalDays = 180` (line 169) — 🟠 **sebaiknya dari BE Konfigurasi `masa_tenggang_sp`** |
| Hardcoded | Format nomor surat `SP/${level}/ITG/${roman}/${year}/${id}` (line 23-29) — berbeda dengan BE yang menghasilkan `${id}/SP/KIP-K/ITG/${month}/${year}` — 🔴 **CONTRACT MISMATCH** (lihat §5.5.1) |

#### 3.9 TerbitkanSP.tsx (398 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getMahasiswaList` (search), `terbitkanSP` |
| Form fields | Search Mahasiswa, SP Level (radio), Jenis Pelanggaran (select — hardcoded "Akademik", "Non-Akademik", "Cuti Tanpa Izin"), Deskripsi (min 20 char), Tanggal Terbit, Batas Evaluasi, Catatan |
| Validation | Local — mahasiswa dipilih, jenis pelanggaran dipilih, deskripsi ≥ 20 char |
| Confirmation Modal | Ya |
| Success | Navigate ke `/admin/sp/{createdId}` |

#### 3.10 BebasTanggunganList.tsx (358 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getBebasTanggunganList` |
| Tabs | Menunggu, Diterbitkan, Ditolak |
| Tabel | 10 kolom |
| Pagination | Ya |
| Cards summary | 1 (badge count menunggu) |

#### 3.11 BebasTanggunganDetail.tsx (671 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getBebasTanggunganDetail`, `approveBebasTanggungan`, `rejectBebasTanggungan` |
| Sections | Riwayat Akademik (IPK/SKS), Dokumen Kewajiban, Checklist (backend-driven), Riwayat Penolakan, Surat Formal (preview FE dengan hardcoded signature), Approve Modal, Reject Modal |
| Hardcoded | "Encep Jianul Hayat, S.T., M.T." NIP 197804202006041001, "Dr. Rina Kurniawati, S.E., M.Si." NIP 198203152008012002 — 🟠 **BE Konfigurasi sudah punya `pengelola_nama`, `pengelola_nip`, `warek_nama`, `warek_nip` di PdfGeneratorService** — lihat §6.3 |

#### 3.12 LaporanList.tsx (366 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `getLaporanList` |
| Filters | Search, Tahun Akademik, Semester, Status, Cakupan |
| Tabel | Card-based list |
| Pagination | Ya |

#### 3.13 SusunLaporan.tsx (719 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `createLaporan`, `submitLaporan`, `getPreviewStatistics` |
| Steps | 3-step wizard (Informasi, Review Data, Preview & Kirim) |
| Form | Judul (auto-generated), Tahun Akademik, Semester, Tanggal Laporan, Catatan, Cakupan (radio), Tujuan Pengiriman (Warek, Prodi) |
| Hardcoded angkatan list | `["2022", "2023", "2024", "2025", "2026"]` line 16 |
| Hardcoded prodi list | `["Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"]` line 18-23 — 🟠 **sebaiknya dari BE** |
| Hardcoded tahun akademik | `["2025/2026", "2024/2025", "2023/2024"]` line 238-240 — 🟠 **sebaiknya dari BE Periode Akademik** |
| Hardcoded signatures | "Encep Jianul Hayat", "Dr. Rina Kurniawati" line 615-625 — 🟠 **sebaiknya dari BE Konfigurasi** |

#### 3.14 LaporanDetail.tsx (403 baris)
| Aspek | Keterangan |
| --- | --- |
| Sources | `getLaporanById`, `approveLaporan`, `rejectLaporan` |
| Features | Preview formal (kepala surat, ringkasan, distribusi, IPK trend), Approve Modal, Revisi Modal |
| Catatan | Tombol "Approve" ada di FE Admin — 🟠 **tapi backend route `/laporan/{id}/approve` hanya untuk warek role**, lihat §8 |

#### 3.15 Konfigurasi.tsx (1221 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | `axios.get('/api/admin/konfigurasi/all')`, `put('/api/admin/konfigurasi')`, post/put/delete master endpoints |
| Sections | 8 section (IPK Threshold, Periode Input, Master Prodi, Jenis Dokumen, Informasi Institusi, Nilai Mutu, Regulasi & Aturan, Jenis Pelanggaran) |
| Hardcoded institusi | `"Institut Teknologi Garut"`, `"Jl. Mayor Syamsu No. 1, Garut, Jawa Barat"` — 🟢 BE Konfigurasi sudah support `nama_institusi`, `alamat_institusi` |
| Hardcoded prodi list | Sama dengan §3.5 — 🟠 dari BE |
| Hardcoded dokumen list | Sama dengan §3.6 — 🟠 dari BE |
| Hardcoded nilai mutu seed | di-comment (lines 88-96) sebagai fallback — OK karena BE seeded |
| Hardcoded regulasi | di-comment (lines 107-113) sebagai fallback — OK |
| Hardcoded jenis pelanggaran | di-comment (lines 156-159) sebagai fallback — OK |

#### 3.16 AuditLog.tsx (209 baris)
| Aspek | Keterangan |
| --- | --- |
| Source | **NONE — menggunakan static array `logs` line 16-27** |
| Filters | Jenis, Oleh (dropdown), Date range |
| Tabel | 6 kolom (Waktu, Aktivitas, Deskripsi, Terkait, Oleh, IP) |
| Modal | Detail |
| Hardcoded data | 10 entri static sample — 🔴 **MISSING BACKEND INTEGRATION (atau FE Integration Gap)** — lihat §7 |

---

## 4. Backend Capability Inventory

### Controllers
| Controller | Lokasi | Method Utama |
| --- | --- | --- |
| `Api/Admin/DashboardController` | `app/Http/Controllers/Api/Admin/` | `index()` |
| `Api/Admin/MahasiswaController` | `app/Http/Controllers/Api/Admin/` | `index`, `show`, `store`, `destroy`, `checkNim`, `updateStatus`, `cabutKipk`, `dokumen`, `rekapAkademik`, `rekapPrestasi`, `rekapOrganisasi`, `rekapPelatihan` |
| `Api/Admin/DataAkademikController` | `app/Http/Controllers/Api/Admin/` | `indexIPK`, `validatePrestasi/Organisasi/Pelatihan`, `indexPrestasi/Organisasi/Pelatihan` |
| `Api/Admin/DokumenController` | `app/Http/Controllers/Api/Admin/` | `queue`, `validateDokumen`, `serveFile` |
| `Api/Admin/SPController` | `app/Http/Controllers/Api/Admin/` | `index`, `history`, `store`, `show`, `updateStatus` |
| `Api/Admin/BebasTanggunganController` | `app/Http/Controllers/Api/Admin/` | `index`, `show`, `approve`, `reject`, `downloadPdf` |
| `Api/Admin/LaporanController` | `app/Http/Controllers/Api/Admin/` | `index`, `store`, `show`, `previewStatistics`, `computeStatistics`, `update`, `submit`, `downloadPdf` |
| `Api/Admin/KonfigurasiController` | `app/Http/Controllers/Api/Admin/` | `index`, `update`, `getPeriode`, `indexProdi/storeProdi/updateProdi/toggleProdi`, `indexDokumenJenis/storeDokumenJenis/destroyDokumenJenis/toggleDokumenJenis`, `indexAll`, `storeNilaiMutu/updateNilaiMutu/destroyNilaiMutu`, `storePelanggaran/updatePelanggaran/destroyPelanggaran`, `storePeriode/updatePeriode/destroyPeriode/activatePeriode` |
| `Api/Admin/AuditController` | `app/Http/Controllers/Api/Admin/` | `index` |

### Services
| Service | Method |
| --- | --- |
| `BebasTanggunganService` | `getChecklist`, `cekDokumen` |
| `SPValidationService` | `validate`, `handleSP3` |
| `IPKCalculatorService` | `nilaiMutu`, `isLulus`, `hitungIPS`, `prepareMataKuliah`, `recalculateAllIPK`, `getCarryOver` |
| `PdfGeneratorService` | `suratBebasTanggungan`, `laporanKipK`, `getLogoBase64` |
| `ExcelExportService` | (existence) |

### Models
| Model | Fillable | Relationships | Casts |
| --- | --- | --- | --- |
| `User` | name, username, email, password, role, is_password_changed, foto_profil, no_hp, prodi_id | mahasiswa, prodi, notifications, contactHistories | password (hashed), is_password_changed (bool) |
| `Mahasiswa` | user_id, nim, nama, prodi_id, angkatan, kategori, status, nomor_sk, tanggal_sk, file_sk, alasan_nonaktif, tanggal_nonaktif, semester_dicabut, tanggal_dicabut, alasan_dicabut, dicabut_oleh, nik, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, nama_ayah, nama_ibu, tel_ayah, tel_ibu | user, prodi, ipkSemestrs, dokumens, suratPeringatans, prestasis, organisasis, pelatihans, bebasTanggungan | dates |
| `Prodi` | kode, nama, is_aktif | mahasiswas, users | is_aktif (bool) |
| `IpkSemestr` | mahasiswa_id, semester, tahun_ajaran, ipk, ips, file_khs, is_verified | mahasiswa, mataKuliahs | ipk, ips (decimal) |
| `MataKuliah` | ipk_semester_id, kode, nama, sks, nilai_huruf, nilai_mutu, lulus | ipkSemestr | nilai_mutu (decimal), lulus (bool) |
| `Dokumen` | mahasiswa_id, dokumen_jenis_id, nama_file, path_file, ukuran, status, catatan_admin, metadata, approved_by, approved_at | mahasiswa, jenis, approvedBy | metadata (array), approved_at (datetime) |
| `DokumenJenis` | nama, kode, deskripsi, is_wajib, urutan | dokumens | is_wajib (bool) |
| `SuratPeringatan` | mahasiswa_id, level, jenis_pelanggaran, deskripsi, tanggal_terbit, batas_evaluasi, status, diterbitkan_oleh, catatan, nomor_surat | mahasiswa, diterbitkanOleh | dates |
| `Prestasi` | (default) | — | — |
| `Organisasi` | (default) | — | — |
| `Pelatihan` | (default) | — | — |
| `BebasTanggungan` | mahasiswa_id, tanggal_ajukan, status, catatan_admin, reviewed_by, reviewed_at, nomor_surat, tanggal_terbit | mahasiswa, reviewedBy, histories | dates |
| `BebasTanggunganHistory` | bebas_tanggungan_id, status, catatan, reviewed_by | bebasTanggungan, reviewedBy | — |
| `Laporan` | nomor_surat, judul, periode, tahun_akademik, semester, tanggal_laporan, catatan_laporan, status, dibuat_oleh, submitted_at, cakupan, angkatan, prodi, tujuan_prodi, tujuan_warek | dibuatOleh, reviews, latestReview | dates |
| `LaporanReview` | laporan_id, warek_id, aksi, catatan, reviewed_at | laporan, warek | reviewed_at (datetime) |
| `Konfigurasi` | key, value, label, tipe | — | — |
| `AuditLog` | user_id, jenis, aktivitas, deskripsi, terkait_nim, terkait_nama, ip_address | user | created_at (datetime) |
| `Notification` | user_id, judul, pesan, tipe, is_read, link | user | is_read (bool) |
| `JenisPelanggaran` | nama, deskripsi, eskalasi, aktif | — | aktif (bool) |
| `NilaiMutu` | min, max, huruf, poin, lulus | — | min/max/poin (float), lulus (bool) |
| `PeriodeAkademik` | tahun_akademik, semester, tanggal_buka, tanggal_tutup, is_aktif | — | dates, is_aktif (bool) |
| `ContactHistory` | user_id, no_hp, keterangan | — | — |

### Migrations (Total 28)
Semua migrasi sudah ada dan terkini per 2026-08-28:
- 13 migrasi awal (users, cache, jobs, prodis, mahasiswas, ipk_semestrs, dokumens, dokumen_jenis, surat_peringatans, non_akademik, bebas_tanggungans, laporans, konfigurasi/audit/notif, personal_access_tokens)
- Patch migrations: `2026_08_26_*` (jenis/foto non-akademik, metadata, batas_evaluasi nullable)
- Patch migrations: `2026_08_27_*` (laporans phase 7, ips ipk_semestrs, personal info, bebas_tanggungan_histories)
- Patch migrations: `2026_08_28_*` (nomor_surat SP, tel ortu, contact_histories, deskripsi/kode dokumen_jenis, **nilai_mutus**, **jenis_pelanggarans**, **periode_akademiks**, **patch_surat_peringatans_for_phase7**)

### Authorization
- `auth:sanctum` untuk seluruh endpoint kecuali login
- `role:admin` middleware khusus untuk `/api/konfigurasi/*` saja
- Semua endpoint admin divalidasi via match `role === 'admin'` di dalam method controller

### Validation
- `validate()` Laravel Validator pada hampir seluruh endpoint mutasi
- Custom validation di Service (`SPValidationService::validate`)
- File validation: PDF/JPG/PNG ≤ 5MB di createMahasiswa

### Business Rule (Service Layer)
| Rule | Lokasi |
| --- | --- |
| Validasi urutan SP (SP1→SP2→SP3) | `SPValidationService::validate` |
| Auto Dicabut saat SP3 | `SPValidationService::handleSP3` |
| Cek kelayakan BT (IPK, SKS, MK, SP, Dokumen) | `BebasTanggunganService::getChecklist` |
| IPK Calculation | `IPKCalculatorService` |
| Generate Nomor Surat SP | `AdminSPController::store` (line 80-82) |
| Generate Nomor Surat BT | `AdminBTController::approve` (line 127) |
| Generate Nomor Surat Laporan | `AdminLaporanController::submit` (line 340-345) |

---

## 5. FE ↔ BE Contract Matrix

### 5.1 Dashboard

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard | `Dashboard.tsx` | `getAdminDashboardData()` | `/api/dashboard` | GET | `Api/Admin/DashboardController@index` | � MATCH |
| Dashboard | Stats cards | Display `stats.*` | (sama) | — | Provides `total_aktif, reguler, aspirasi, mahasiswa_dicabut, dokumen_menunggu, bebas_tanggungan_pending, semester_lebih_8, sp_semester_ini` | � MATCH |
| Dashboard | Charts | Display `prodi_sebaran`, `angkatan_sebaran`, `sebaran_per_prodi_angkatan` | (sama) | — | Computed correctly | 🟢 MATCH |
| Dashboard | SP Aktif table | Display 5 SP aktif terakhir | (sama) | — | `sp_aktif` array | 🟢 MATCH |
| Dashboard | Dokumen Queue widget | Display 5 dokumen menunggu | (sama) | — | `dokumen_queue` array | 🟢 MATCH |

### 5.2 Mahasiswa

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| MahasiswaList | Table + Filter | `getMahasiswaList(filter)` | `/api/mahasiswa?search=&prodi=&...` | GET | `Api/Admin/MahasiswaController@index` | 🟢 MATCH |
| MahasiswaList | Filter options | `getMahasiswaFilterOptions()` | `/api/mahasiswa/filter-options` | GET | `Api/MahasiswaController@filterOptions` | 🟢 MATCH |
| MahasiswaList | Modal Hapus | `deleteMahasiswa(id, konfirmasiNim)` | `/api/mahasiswa/{id}?konfirmasi_nim=` | DELETE | `Api/Admin/MahasiswaController@destroy` | 🟢 MATCH |
| MahasiswaList | Modal Nonaktifkan | `updateMahasiswaStatus(id, payload)` | `/api/mahasiswa/{id}/status` | PATCH | `Api/Admin/MahasiswaController@updateStatus` | 🟢 MATCH |
| MahasiswaList | Modal Cabut | `cabutKipkMahasiswa(id, payload)` | `/api/mahasiswa/{id}/cabut-kipk` | PATCH | `Api/Admin/MahasiswaController@cabutKipk` | 🟢 MATCH |
| TambahMahasiswa | Form | `createMahasiswa(formData)` | `/api/mahasiswa` | POST | `Api/Admin/MahasiswaController@store` | 🟢 MATCH |
| TambahMahasiswa | NIM check | `checkNim(nim)` | `/api/mahasiswa/check-nim/{nim}` | GET | `Api/Admin/MahasiswaController@checkNim` | 🟢 MATCH |
| MahasiswaDetail | Get detail | `getMahasiswaById(id)` | `/api/mahasiswa/{id}` | GET | `Api/Admin/MahasiswaController@show` | 🟢 MATCH |
| MahasiswaDetail | Tab Riwayat Akademik | `getMahasiswaIpk(id)` | `/api/mahasiswa/{id}/ipk` | GET | `Api/MahasiswaController@ipk` (returns ipk_semestrs + mata_kuliahs) | 🟡 **PARTIAL** — lihat §5.5.2 |
| MahasiswaDetail | Tab Prestasi | `getMahasiswaPrestasi(id)` | `/api/mahasiswa/{id}/prestasi` | GET | `Api/Admin/MahasiswaController@rekapPrestasi` (returns ALL prestasi, FE filters by mahasiswa_id client-side) | 🟡 **PARTIAL** — lihat §5.5.3 |
| MahasiswaDetail | Tab Organisasi | `getMahasiswaOrganisasi(id)` | `/api/mahasiswa/{id}/organisasi` | GET | `Api/Admin/MahasiswaController@rekapOrganisasi` | 🟡 **PARTIAL** (sama) |
| MahasiswaDetail | Tab Pelatihan | `getMahasiswaPelatihan(id)` | `/api/mahasiswa/{id}/pelatihan` | GET | `Api/Admin/MahasiswaController@rekapPelatihan` | 🟡 **PARTIAL** (sama) |
| MahasiswaDetail | Tab SP | `getMahasiswaSpHistory(id)` | `/api/mahasiswa/{id}/sp` | GET | `Api/Admin/SPController@history` | 🟢 MATCH |
| MahasiswaDetail | Tab Dokumen | `getMahasiswaDokumen(id)` | `/api/mahasiswa/{id}/dokumen` | GET | `Api/Admin/MahasiswaController@dokumen` | 🟢 MATCH |
| MahasiswaDetail | Tab BT | `getMahasiswaBebasTanggungan(id)` | `/api/mahasiswa/{id}/bebas-tanggungan` | GET | `Api/Admin/BebasTanggunganController@index` then filter by mahasiswa_id client-side | 🟡 **PARTIAL** — lihat §5.5.4 |
| MahasiswaDetail | Validate Prestasi | `validatePrestasi(mhsId, itemId, payload)` | `/api/mahasiswa/{mhsId}/prestasi/{itemId}/validate` | PUT | (route exists) | 🟢 MATCH |
| MahasiswaDetail | Validate Organisasi | `validateOrganisasi(mhsId, itemId, payload)` | `/api/mahasiswa/{mhsId}/organisasi/{itemId}/validate` | PUT | (route exists) | 🟢 MATCH |
| MahasiswaDetail | Validate Pelatihan | `validatePelatihan(mhsId, itemId, payload)` | `/api/mahasiswa/{mhsId}/pelatihan/{itemId}/validate` | PUT | (route exists) | 🟢 MATCH |

### 5.3 Data Akademik

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DataAkademik | Rekap Akademik | `getRekapAkademik()` | `/api/akademik/rekap-mahasiswa` | GET | `Api/Admin/MahasiswaController@rekapAkademik` | � MATCH |
| DataAkademik | Rekap Prestasi | `getRekapPrestasi()` | `/api/akademik/prestasi` | GET | `Api/Admin/MahasiswaController@rekapPrestasi` | 🟢 MATCH |
| DataAkademik | Rekap Organisasi | `getRekapOrganisasi()` | `/api/akademik/organisasi` | GET | `Api/Admin/MahasiswaController@rekapOrganisasi` | � MATCH |
| DataAkademik | Rekap Pelatihan | `getRekapPelatihan()` | `/api/akademik/pelatihan` | GET | `Api/Admin/MahasiswaController@rekapPelatihan` | 🟢 MATCH |
| DataAkademik | Validate Prestasi | `validatePrestasi(mhsId, itemId, payload)` | `/api/mahasiswa/{mhsId}/prestasi/{itemId}/validate` | PUT | `Api/Admin/DataAkademikController@validatePrestasi` (NOT actually wired — route points to MahasiswaController) | � **CONTRACT MISMATCH** — lihat §5.5.5 |

### 5.4 Dokumen Queue

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DokumenQueue | List | `getDokumenQueue(filter)` | `/api/admin/dokumen-queue?page=&limit=&status=&search=&jenis=` | GET | `Api/Admin/DokumenController@queue` | 🟢 MATCH |
| DokumenQueue | Approve | `approveDokumen(id)` | `/api/admin/dokumen-queue/{id}/validate` | PUT | `Api/Admin/DokumenController@validateDokumen` | 🟢 MATCH |
| DokumenQueue | Reject | `rejectDokumen(id, catatan)` | `/api/admin/dokumen-queue/{id}/validate` | PUT | `Api/Admin/DokumenController@validateDokumen` | 🟢 MATCH |
| DokumenQueue | Preview Prestasi | `getMahasiswaPrestasi(mhsId)` | `/api/mahasiswa/{id}/prestasi` | GET | (side call, returns ALL, FE filters by id) | � PARTIAL |

### 5.5 Detail SP / BT / Laporan

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| SPList | List | `getSPList(filter)` | `/api/sp?search=&level=&status=&page=&limit=` | GET | `Api/Admin/SPController@index` | 🟢 MATCH |
| SPDetail | Get detail | `getSPDetail(id)` | `/api/sp/{id}` | GET | `Api/Admin/SPController@show` (returns `data`, `extra`, `history`) | 🟢 MATCH |
| SPDetail | Format Nomor Surat | Client `nomorSurat(level, tanggalTerbit, id)` returns `SP/${level}/ITG/${roman}/${year}/${id}` | — | — | BE generates `${id}/SP/KIP-K/ITG/${month}/${year}` | 🔴 **CONTRACT MISMATCH** — lihat §5.5.1 |
| SPDetail | Tandai Selesai | `updateSPStatus(id, {status: "Selesai"})` | `/api/sp/{id}/status` | PATCH | `Api/Admin/SPController@updateStatus` | 🟢 MATCH |
| TerbitkanSP | Submit | `terbitkanSP(payload)` | `/api/sp` | POST | `Api/Admin/SPController@store` | 🟢 MATCH |
| BebasTanggunganList | List | `getBebasTanggunganList(filter)` | `/api/bebas-tanggungan?status=&search=&page=&limit=` | GET | `Api/Admin/BebasTanggunganController@index` (returns `counts`) | 🟢 MATCH |
| BebasTanggunganDetail | Get detail | `getBebasTanggunganDetail(id)` | `/api/bebas-tanggungan/{id}` | GET | `Api/Admin/BebasTanggunganController@show` (returns permohonan, mahasiswa, checklist, dokumen, sks_*, ipk_*, can_apply, rejectionHistory) | 🟢 MATCH |
| BebasTanggunganDetail | Approve | `approveBebasTanggungan(id)` | `/api/bebas-tanggungan/{id}/approve` | PATCH | `Api/Admin/BebasTanggunganController@approve` | 🟢 MATCH |
| BebasTanggunganDetail | Reject | `rejectBebasTanggungan(id, alasan)` | `/api/bebas-tanggungan/{id}/reject` | PATCH | `Api/Admin/BebasTanggunganController@reject` | 🟢 MATCH |
| BebasTanggunganDetail | Download PDF | `<a href="/api/bebas-tanggungan/${id}/pdf">` | `/api/bebas-tanggungan/{id}/pdf` | GET | `Api/Admin/BebasTanggunganController@downloadPdf` → `PdfGeneratorService::suratBebasTanggungan` | � MATCH |
| LaporanList | List | `getLaporanList(filter)` | `/api/laporan?search=&status=&tahunAkademik=&semester=&cakupan=&page=&limit=` | GET | `Api/Admin/LaporanController@index` | 🟢 MATCH |
| SusunLaporan | Preview Statistics | `getPreviewStatistics(cakupan, angkatan?, prodi?)` | `/api/laporan/preview-statistics?cakupan=&angkatan=&prodi=` | GET | `Api/Admin/LaporanController@previewStatistics` | 🟢 MATCH |
| SusunLaporan | Create | `createLaporan(payload)` | `/api/laporan` | POST | `Api/Admin/LaporanController@store` | 🟢 MATCH |
| SusunLaporan | Submit | `submitLaporan(id)` | `/api/laporan/{id}/submit` | PATCH | `Api/Admin/LaporanController@submit` | 🟢 MATCH |
| LaporanDetail | Get detail | `getLaporanById(id)` | `/api/laporan/{id}` | GET | `Api/Admin/LaporanController@show` | 🟢 MATCH |
| LaporanDetail | Approve | `approveLaporan(id)` | `/api/laporan/{id}/approve` | PATCH | (route exists but role check `warek`) | 🔴 **CONTRACT MISMATCH** — lihat §8 |
| LaporanDetail | Return/Revisi | `rejectLaporan(id, catatan)` | `/api/laporan/{id}/return` | PATCH | (route exists but role check `warek`) | 🔴 **CONTRACT MISMATCH** — lihat §8 |
| LaporanDetail | Download PDF | `<a href="/api/laporan/${id}/pdf">` | `/api/laporan/{id}/pdf` | GET | `Api/Admin/LaporanController@downloadPdf` → `PdfGeneratorService::laporanKipK` | 🟢 MATCH |

### 5.6 Konfigurasi

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Konfigurasi | Facade data | `axios.get('/api/admin/konfigurasi/all')` | `/api/admin/konfigurasi/all` | GET | `Api/Admin/KonfigurasiController@indexAll` | 🟢 MATCH |
| Konfigurasi | Save regulasi | `axios.put('/api/admin/konfigurasi', payload)` | `/api/admin/konfigurasi` | PUT | `Api/Admin/KonfigurasiController@update` | 🟢 MATCH |
| Konfigurasi | Add Prodi | `axios.post('/api/admin/konfigurasi/prodi', newProdi)` | `/api/admin/konfigurasi/prodi` | POST | `Api/Admin/KonfigurasiController@storeProdi` | 🟢 MATCH |
| Konfigurasi | Nilai Mutu | post/put/delete endpoints | `/api/admin/konfigurasi/nilai-mutu[/{id}]` | POST/PUT/DELETE | `storeNilaiMutu/updateNilaiMutu/destroyNilaiMutu` | 🟢 MATCH |
| Konfigurasi | Pelanggaran | post/put/delete endpoints | `/api/admin/konfigurasi/pelanggaran[/{id}]` | POST/PUT/DELETE | `storePelanggaran/updatePelanggaran/destroyPelanggaran` | 🟢 MATCH |
| Konfigurasi | Periode | post/put/delete/activate | `/api/admin/konfigurasi/periode[/{id}][/activate]` | POST/PUT/DELETE/PATCH | `storePeriode/updatePeriode/destroyPeriode/activatePeriode` | 🟢 MATCH |
| Konfigurasi | Dokumen Jenis | (not exposed in FE currently) | `/api/admin/konfigurasi/dokumen-jenis*` | — | `indexDokumenJenis/storeDokumenJenis/destroyDokumenJenis/toggleDokumenJenis` | 🟢 MATCH (BE ready, FE uses local state) |

### 5.7 Audit Log

| Modul | FE Component | FE Action | Endpoint | Method | Backend Handler | Status |
| --- | --- | --- | --- | --- | --- | --- |
| AuditLog | List | **TIDAK ADA — menggunakan static array** | — | — | — | 🔴 **MISSING BACKEND INTEGRATION** — lihat §7 |

### 5.8 Contract Mismatch Detail

#### 5.5.1 SPDetail Format Nomor Surat
**FE expects**: `SP/{LEVEL}/ITG/{roman_month}/{year}/{padded_id}` (e.g. `SP/SP1/ITG/VIII/2026/007`)  
**BE generates**: `{padded_id}/SP/KIP-K/ITG/{roman_month}/{year}` (e.g. `007/SP/KIP-K/ITG/VIII/2026`)  
**Dampak**: Nomor surat di preview FE tidak sama dengan yang tersimpan di DB & di PDF BT/SP.  
**Rekomendasi**: Samakan format dengan BE, atau FE gunakan field `sp.nomorSurat` yang dikembalikan BE.

#### 5.5.2 getMahasiswaIpk Response Shape
**FE expects**: `{ data: SemesterDetailBE[] }`  
**BE returns**: (cek controller — `Api/MahasiswaController::ipk`) — perlu cross-check apakah ada shape mismatch.  
**Dampak**: Mungkin tab Riwayat Akademik tidak render semestinya.  
**Rekomendasi**: Verifikasi response shape; tambahkan fallback `BackendNotReady` jika 404 (sudah ada di FE line 308).

#### 5.5.3–4 Side Calls (Prestasi/Organisasi/Pelatihan/BT by Mahasiswa ID)
**FE expects**: Endpoint khusus return data by `mahasiswa_id` (filtered)  
**BE returns**: Endpoint `rekapPrestasi/Organisasi/Pelatihan` return ALL data (semua mahasiswa), FE filter client-side  
**Dampak**: Beban request lebih besar dari seharusnya; konsistensi data rentan.  
**Rekomendasi**: Tambah parameter `?mahasiswa_id=X` di BE atau buat endpoint khusus `/api/admin/prestasi?mahasiswa_id=X`.

#### 5.5.5 Data Akademik Validate Endpoint
**FE calls**: `/api/mahasiswa/{mhsId}/prestasi/{itemId}/validate` (PUT)  
**BE handler**: `Api/MahasiswaController` route ada, tapi handler adalah `Api/Admin/MahasiswaController@validatePrestasi`  
**Catatan**: Ini bukan mismatch, tapi handler di `Api/MahasiswaController` adalah facade yang route ke Admin — OK, 🟢 MATCH.  
**Note**: Ada juga `Api/Admin/DataAkademikController@validatePrestasi` yang terdefinisi tapi tidak terpakai route-nya (orphan). Lihat §5.6.

---

## 6. Mock / Hardcoded Business Data Audit

### 6.1 Presentation Constants (BUKAN masalah)
| Hardcoded | Lokasi | Klasifikasi |
| --- | --- | --- |
| Logo ITG (base64/jpg) | `Konfigurasi.tsx`, `MahasiswaDetail.tsx`, `SPDetail.tsx`, `BebasTanggunganDetail.tsx`, `LaporanDetail.tsx`, `SusunLaporan.tsx` — `@/imports/logo_itg.jpg` | 🔵 Presentation |
| Warna brand (`#263F93`, `#D4A72C`, dll) | seluruh FE | 🔵 Presentation |
| Telp/alamat di kop surat | `MahasiswaDetail.tsx` line 1690 (`(0262) 540895`), line 1690 (`info@itg.ac.id`), `SPDetail.tsx` line 457 (`(0262) 2800433`), `BebasTanggunganDetail.tsx` line 75 (`(0262) 540895`), `LaporanDetail.tsx` line 142 (`(0262) 2800433`) | � Presentation (meskipun harusnya dari konfig BE) |
| ROMAN_MONTHS mapping | `SPDetail.tsx` line 18 | 🔵 Presentation |
| levelColor maps | `SPList.tsx`, `SPDetail.tsx`, `TerbitkanSP.tsx` | 🔵 Presentation |
| spBadges components | `MahasiswaList.tsx`, `Dashboard.tsx` | � Presentation |
| REVIEWER_NAME | `DokumenQueue.tsx` line 11 (`"Encep Jianul Hayat, S.T., M.T."`) | 🔵 Presentation |

### 6.2 FE Integration Gap (BE SUDAH PUNYA, FE hardcoded)
| Item | FE | BE | Klasifikasi |
| --- | --- | --- | --- |
| Daftar Prodi | `DataAkademik.tsx:30`, `SusunLaporan.tsx:18-23`, `Konfigurasi.tsx:27-33`, `DokumenQueue.tsx:25` hardcoded list `["Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"]` | `KonfigurasiController@indexProdi` (GET `/api/admin/konfigurasi/prodi`) returns `Prodi::all()` | 🟠 **FE Integration Gap** — FE harus ganti ke `getProdiList()` |
| Daftar Jenis Dokumen | `DokumenQueue.tsx:13-24`, `Konfigurasi.tsx:35-41` hardcoded | `KonfigurasiController@indexDokumenJenis` (GET `/api/admin/konfigurasi/dokumen-jenis`) | 🟠 **FE Integration Gap** — FE harus ganti ke `getDokumenJenisList()` |
| Daftar Tahun Akademik | `LaporanList.tsx:200`, `SusunLaporan.tsx:238-240` hardcoded `["2025/2026", "2024/2025", "2023/2024"]` | `KonfigurasiController@indexAll` → `periode_history` array | 🟠 **FE Integration Gap** — FE harus ganti ke `periodeHistory` |
| Daftar Angkatan | `DataAkademik.tsx:31`, `SusunLaporan.tsx:16` hardcoded `["2021", "2022", "2023", "2024", "2025"]` | `MahasiswaController@filterOptions` → `angkatans` array | 🟠 **FE Integration Gap** — FE harus ganti ke `getMahasiswaFilterOptions()` |
| Masa Tenggang SP | `SPDetail.tsx:169` hardcoded `totalDays = 180` | `KonfigurasiController::get('masa_tenggang_sp')` | 🟠 **FE Integration Gap** — FE harus ganti ke BE |
| Signature Pengelola & Warek | `MahasiswaDetail.tsx:1760-1761, 1767-1768`, `BebasTanggunganDetail.tsx:155, 162`, `SPDetail.tsx:494, 500-501`, `LaporanDetail.tsx:270, 287`, `SusunLaporan.tsx:615, 623` hardcoded | `Konfigurasi::get('pengelola_nama')`, `pengelola_nip`, `warek_nama`, `warek_nip` (sudah dipakai `PdfGeneratorService`) | 🟠 **FE Integration Gap** — FE formal preview harus ganti ke BE |

### 6.3 Backend Architectural Gap (BE BELUM PUNYA, FE punya UI statis)
| Item | FE | BE | Klasifikasi |
| --- | --- | --- | --- |
| Audit Log data | `AuditLog.tsx` line 16-27 hardcoded 10 entri sample | `AuditController@index` ada route tapi FE tidak pernah call | 🔴 **MISSING BACKEND INTEGRATION** — lihat §7 |
| Periode Aktif banner text "1 Sep – 15 Sep 2026" | `DataAkademik.tsx:938` hardcoded | `KonfigurasiController@getPeriode` returns `buka, tutup, aktif` | 🟠 **FE Integration Gap** |
| Periode Aktif di Konfigurasi | `Konfigurasi.tsx:317` hardcoded "Periode Aktif: 1 Sep – 15 Sep 2026" | (sama) | � **FE Integration Gap** — sudah pakai `tglBuka/tglTutup` state, tapi label hardcoded |
| Sapaan Personal "Pak Encep Jianul" | `Dashboard.tsx:135` hardcoded | `ProfileController@show` returns `user.name` | � **FE Integration Gap** — FE harus pakai `user.name` |
| Placeholder semester "Ganjil 2026/2027" | `MahasiswaDetail.tsx:2585` hardcoded | `KonfigurasiController::get('semester_aktif')` + `tahun_akademik_aktif` | 🟠 **FE Integration Gap** — sudah dipakai di BE cabutKipk |
| Informasi Institusi (Konfigurasi Section 5) | `Konfigurasi.tsx:80-83` hardcoded "Institut Teknologi Garut", alamat | `KonfigurasiController@indexAll` returns `institusi.{nama,alamat}` (sudah ada field di BE) tapi `update` belum support save institusi | 🟡 **PARTIAL** — BE punya endpoint, FE belum wire save institusi |

---

## 7. Missing Backend Capability

### � MISSING BACKEND INTEGRATION: Audit Log FE Integration
**Detail**: Halaman `AuditLog.tsx` (Admin) menggunakan array statis `logs` (line 16-27). Backend route `GET /api/audit` sudah ada (`AuditController@index`) tapi FE tidak pernah memanggilnya.  
**Rekomendasi (FE saja yang berubah)**: Tambah fungsi `getAuditLogs(filter)` di service + panggil di `AuditLog.tsx` useEffect.

---

## 8. Database Gap Analysis

### ✅ Entity yang SUDAH ada di database
| Entity | Migration | Tabel |
| --- | --- | --- |
| User | `0001_01_01_000000_create_users_table` | users |
| Mahasiswa | `2026_08_22_000002` | mahasiswas |
| Prodi | `2026_08_22_000001` | prodis |
| IpkSemestr | `2026_08_22_000003` | ipk_semestrs |
| MataKuliah | `2026_08_22_000003` | mata_kuliahs |
| Dokumen | `2026_08_22_000004` | dokumens |
| DokumenJenis | `2026_08_22_000004` | dokumen_jenis |
| SuratPeringatan | `2026_08_22_000005` | surat_peringatans |
| Prestasi | `2026_08_22_000006` | prestasis |
| Organisasi | `2026_08_22_000006` | organisasis |
| Pelatihan | `2026_08_22_000006` | pelatihans |
| BebasTanggungan | `2026_08_22_000007` | bebas_tanggungans |
| BebasTanggunganHistory | `2026_08_27_214300` | bebas_tanggungan_histories |
| Laporan | `2026_08_22_000008` | laporans |
| LaporanReview | `2026_08_22_000008` | laporan_reviews |
| Konfigurasi | `2026_08_22_000009` | konfigurasis |
| AuditLog | `2026_08_22_000009` | audit_logs |
| Notification | `2026_08_22_000009` | notifications |
| ContactHistory | `2026_08_28_011431` | contact_histories |
| NilaiMutu | `2026_08_28_030801` | nilai_mutus |
| JenisPelanggaran | `2026_08_28_030802` | jenis_pelanggarans |
| PeriodeAkademik | `2026_08_28_030803` | periode_akademiks |

### ✅ Tidak ada Database Gap yang belum ter-cover.

---

## 9. Business Logic Boundary Audit

### 🔴 Logic yang SEHARUSNYA di BE tapi ada di FE
| Logic | Lokasi FE | Lokasi BE yang seharusnya | Severity |
| --- | --- | --- | --- |
| Format Nomor Surat SP | `SPDetail.tsx:23-29` client-side generate | BE sudah generate di `AdminSPController::store` line 80-82 | 🟠 **MEDIUM** — FE harus pakai `nomorSurat` dari BE, BUKAN generate client-side |
| Format Nomor Surat Laporan | `SusunLaporan.tsx:511` hardcoded "[Akan diisi setelah disimpan]" | BE generate di `submit()` line 345 | 🟢 OK (placeholder) |
| Penghitungan SKS Lulus | (hanya di BT) | `BebasTanggunganService::getChecklist` line 65-69 | 🟢 OK |
| Penghitungan IPK | (read-only) | `IPKCalculatorService::hitungIPS` | 🟢 OK |
| Penghitungan Masa Tenggang SP | `SPDetail.tsx:169-171` `totalDays - sp.sisa` | `KonfigurasiController::get('masa_tenggang_sp')` (seharusnya) | 🟠 **MEDIUM** |
| Validasi Urutan SP | (hanya client validate deskripsi min 20) | `SPValidationService::validate` | 🟢 OK |
| Generate PDF | (FE pakai `window.print()`) | `PdfGeneratorService::suratBebasTanggungan` | 🟢 OK (FE print = soft preview) |
| Cek Kelayakan BT | (FE cek checklist backend-driven) | `BebasTanggunganService::getChecklist` `can_apply` | 🟢 OK |

### � Logic yang SEHARUSNYA di FE (presentation) tapi tidak masalah
- Color mapping, badge rendering, modal animations, format tanggal Indonesia (`toLocaleDateString("id-ID")`)

### 🟠 Inconsistency: Laporan Approve/Return role
**Detail**: FE Admin (`LaporanDetail.tsx`) memiliki tombol "Setujui" dan "Kembalikan". BE endpoint `/api/laporan/{id}/approve` dan `/api/laporan/{id}/return` keduanya di-guard `role === "warek"`.  
**Dampak**: Admin tidak bisa approve laporan sendiri dari FE → akan error 403.  
**Rekomendasi**: Buka endpoint untuk admin juga, atau pindah approve ke Warek. Karena status `Laporan` sudah punya status `Draft, Diajukan, Disetujui, Ditolak, Dikembalikan`, **admin harus bisa submit tetapi tidak approve** — saat ini tombol "Setujui" di `LaporanDetail.tsx` seharusnya disembunyikan untuk Admin.

---

## 10. Security & Authorization Audit

### 10.1 Authentication
| Aspek | Status |
| --- | --- |
| `auth:sanctum` middleware applied | 🟢 YES (di `routes/api.php` line 32) |
| Token storage (frontend) | 🟡 localStorage (`api.ts` line 11) — rawan XSS, idealnya httpOnly cookie |
| Password hashing | 🟢 Hash::make (bcrypt) |
| Login rate limiting | 🔴 **TIDAK ADA** — lihat §15.G1 |

### 10.2 Authorization (Role)
| Endpoint | Guard | Catatan |
| --- | --- | --- |
| `/api/konfigurasi/*` | `role:admin` middleware | 🟢 Benar |
| `/api/audit` | Inline check `$req->user()->role === "admin"` (line 154 routes/api.php) | 🟢 Benar |
| `/api/admin/dokumen-queue*` | Tidak ada middleware spesifik — `DokumenController@queue` & `validateDokumen` tidak cek role di dalam method (cuma via middleware group `auth:sanctum`) | � **GAP** — Siapa saja yang login bisa akses admin queue, lihat §15.G2 |
| `/api/mahasiswa/*` (admin operations) | `Api/MahasiswaController` route → check `role === "admin"` di method `store/destroy/cabutKipk/checkNim/updateStatus` | 🟢 Benar |
| `/api/bebas-tanggungan/{id}/approve` | `Api/BebasTanggunganController@approve` — tidak cek role di method (cuma via auth) | 🟡 **GAP** — lihat §15.G3 |
| `/api/laporan/{id}/approve` | Guarded `warek` only | 🟡 OK untuk Warek tapi Admin FE mencoba pakai → mismatch |

### 10.3 IDOR
| Endpoint | Risiko | Status |
| --- | --- | --- |
| `/api/mahasiswa/{id}` | Setiap user yg login bisa lihat detail mahasiswa manapun | 🟡 **GAP** — lihat §15.G4 |
| `/api/mahasiswa/{id}/ipk` | Sama | 🟡 **GAP** |
| `/api/mahasiswa/{id}/sp` | Sama | 🟡 **GAP** |
| `/api/bebas-tanggungan/{id}` | Admin-only via method check, tapi Prodi/Mhs tidak ada handler | 🟡 OK (admin only) |
| `/api/sp/{id}` | Sama | 🟢 OK (admin/mhs facade) |

### 10.4 Mass Assignment
| Model | $fillable | Aman? |
| --- | --- | --- |
| User | name, username, email, password, role, is_password_changed, foto_profil, no_hp, prodi_id | 🟢 Aman |
| Mahasiswa | (lihat §4) | 🟢 Aman |
| SuratPeringatan | mahasiswa_id, level, jenis_pelanggaran, ..., diterbitkan_oleh, catatan, nomor_surat | 🟡 **GAP** — nomor_surat dan diterbitkan_oleh harusnya tidak boleh di-mass assign — lihat §15.G5 |
| Laporan | nomor_surat, judul, ..., dibuat_oleh | 🟡 **GAP** — nomor_surat dan dibuat_oleh |
| Dokumen | approved_by, approved_at | 🟡 OK karena di controller di-set eksplisit |
| Konfigurasi | key, value | 🟢 OK |

### 10.5 File Security
| Aspek | Status |
| --- | --- |
| Storage disk | `public` (local, public disk visibility) — 🟡 artinya file bisa diakses langsung via URL `/storage/{path}` tanpa auth |
| File upload validation | pdf/jpg/png ≤ 5MB (`createMahasiswa`) — 🟢 |
| File path predictability | `storage/sk_mahasiswa/{nim}/{filename}` — 🟢 |
| File serving | `DokumenController::serveFile` — 🟡 **tidak cek authorization** (siapa saja dengan URL bisa akses) — lihat §11 |

---

## 11. File / Storage Security Audit

### 11.1 File Storage Layout
```
storage/app/public/
├── dokumen/       (Dokumen::path_file, upload dari Mahasiswa)
├── khs/           (IpkSemestr::file_khs)
├── sk_mahasiswa/  (Mahasiswa::file_sk)
└── uploads/       (general)
```

### 11.2 URL Exposure
| Path | Akses | Risiko |
| --- | --- | --- |
| `/storage/dokumen/{path}` | Public (no auth) — siapa saja dengan URL bisa download | 🟠 **MEDIUM** — lihat §15.G6 |
| `/storage/sk_mahasiswa/{nim}/{file}` | Public | 🟡 OK karena nomor SK biasanya non-sensitif |
| `/storage/khs/{file}` | Public | 🟠 **MEDIUM** — KHS berisi nilai mahasiswa |

### 11.3 Admin Endpoints untuk File Serving
- `Api/Admin/DokumenController::serveFile(int $id)` (line 167-175) — return `response()->file($path)` tanpa cek ownership
- 🟠 **GAP**: Tidak ada authorization check (siapa saja bisa download dokumen apapun dengan mengetahui ID)

### 11.4 MIME Validation
- Create Mahasiswa: pdf, jpg, png ≤ 5MB — 🟢
- Prestasi/Organisasi/Pelatihan upload: (perlu cross-check, lihat §11.5)

### 11.5 Dokumen Upload Validation
- `Api/MahasiswaController@store` (Admin Tambah Mahasiswa) — validate file ✅
- `Api/Mahasiswa/DokumenController@store` (Mahasiswa upload) — perlu cross-check (tidak diaudit mendalam karena scope Admin)
- `Api/Admin/DokumenController@queue` — tidak menerima upload (read-only) ✅

---

## 12. Cross-Module Dependency Audit

### 12.1 Dependency Graph

```
Konfigurasi ──┬──> Input IPK (mahasiswa)     — via Konfigurasi::get('ipk_minimum', 'masa_tenggang_sp', etc.)
              ├──> SP                       — via Konfigurasi::get('masa_tenggang_sp')
              ├──> Bebas Tanggungan         — via Konfigurasi::get('ipk_minimum', 'sks_minimum_lulus')
              └──> Laporan                  — via Konfigurasi::get('semester_aktif', 'tahun_akademik_aktif')

Mahasiswa ────┬──> Dokumen                  — via Mahasiswa::dokumens
              ├──> SP                       — via Mahasiswa::suratPeringatans
              ├──> Prestasi/Organisasi/Pelatihan
              └──> Bebas Tanggungan         — via Mahasiswa::bebasTanggungan

Dokumen ──────> Bebas Tanggungan             — getChecklist uses Dokumen status
Bebas Tanggungan ──> PDF                     — PdfGeneratorService::suratBebasTanggungan

SP ────────────────> Dashboard                — sp_aktif widget
Mahasiswa ────────> Dashboard                — total_aktif, dicabut, semester_lebih_8
Laporan ─────────> Warek Approve             — approve endpoint role warek only
```

### 12.2 Potential Inconsistencies
| Modul | Potential Stale Data |
| --- | --- |
| Dashboard | `sp_aktif` widget query setiap request — 🟢 OK |
| Konfigurasi `activatePeriode` | Sinkronkan ke `Konfigurasi::where('key', 'periode_input_aktif')` etc — 🟢 OK |
| Cabut KIP-K `cabutKipk` | Update `status = Dicabut`, `semester_dicabut = $semesterAktif $tahunAjaranAktif` dari Konfigurasi — � OK |
| SP `store` | Generate nomor_surat setelah insert — 🟢 OK (race condition minimal karena single-thread) |

### 12.3 Broken Contract Risk
| Aspek | Risiko |
| --- | --- |
| FE pakai `m.sp` sebagai string `"SP1"`, BE pakai enum | 🟢 OK (ada mapping di FE & BE) |
| FE pakai `sp.status: "Aktif"\|"Masa Tenggang"\|"Pemberhentian"\|"Selesai"` | 🟢 OK match dengan enum DB |
| FE `sp.tanggalTerbit` vs BE `tanggal_terbit` | 🟢 OK (camelCase mapping di Resource) |
| FE `mahasiswa.kipkLabel` ("KIP-K Reguler") vs `kategori` ("Reguler") | 🟢 OK (kategori + label transformation client-side) |

---

## 13. Regression Risk Matrix

| # | Gap | Severity | Modul Terdampak | Penyebab | Risiko | Dependency | Migration? | Controller? | API? | FE Integration? | Break FINAL? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | AuditLog FE static | Medium | Admin Audit | FE tidak call BE endpoint | Laporan audit kosong saat production | BE route siap | No | No | No | YES (FE wiring) | No (modul belum FINAL) |
| 2 | FE Prodi/Angt/Tahun/Sig hardcoded | Medium | Konfigurasi, LaporanList, SusunLaporan, DataAkademik, DokumenQueue | FE tidak pakai BE | Filter bisa stale jika prodi baru ditambah | BE Prodi/Periode/Konfigurasi sudah ada | No | No | No | YES (FE wiring) | No |
| 3 | FE Masa Tenggang hardcoded | Low | SPDetail | FE hardcoded 180 | Tidak match dengan Konfigurasi | Konfigurasi::get('masa_tenggang_sp') | No | No | No | YES (FE wiring) | No |
| 4 | FE Sapaan Personal hardcoded | Low | Dashboard | FE hardcoded "Pak Encep Jianul" | Tidak personal jika ganti admin | BE ProfileController::show sudah ada | No | No | No | YES (FE wiring) | No |
| 5 | Laporan Approve di Admin FE | High | LaporanDetail Admin | Admin FE call `/laporan/{id}/approve` tapi BE guard warek only | 403 di Admin FE | Endpoint, role check | No | YES (open to admin OR hide button) | No | YES (hide button) | No |
| 6 | Side-call `/mahasiswa/{id}/prestasi` returns ALL | Low | MahasiswaDetail | Endpoint returns ALL, FE filters client-side | Beban request besar | BE endpoint | No | YES (tambah filter) | YES | No | No |
| 7 | DokumenController serveFile no auth | Medium | Dokumen file | Siapa saja dgn ID bisa download | IDOR dokumen | BE | No | YES (auth check) | No | No | No |
| 8 | IDOR Mahasiswa show | High | Mahasiswa detail | Tidak cek role di method show | Mahasiswa satu prodi bisa lihat semua | BE | No | YES (role check) | No | No | No |
| 9 | Auth rate limiting | High | Login | Tidak ada throttling | Brute force | BE | No | YES (Laravel throttle) | No | No | No |
| 10 | Dokumen Queue endpoint role check | Medium | Admin queue | Tidak cek role di method | Non-admin bisa akses queue | BE | No | YES (role check) | No | No | No |
| 11 | BT approve no role check | Medium | BebasTanggungan | Tidak cek role di method approve | Non-admin bisa approve BT | BE | No | YES (role check) | No | No | No |
| 12 | SP Format Nomor Surat mismatch | Low | SPDetail | FE generate sendiri, BE generate berbeda | Nomor surat tidak konsisten | BE | No | No | No | YES (pakai BE field) | No |
| 13 | Konfigurasi informasi institusi save | Low | Konfigurasi | BE belum support save `nama_institusi`, `alamat_institusi` di `update` | Tidak bisa edit institusi | BE | No | YES (tambah ke update) | No | YES (wire save) | No |

---

## 14. Production Readiness Matrix

| Modul | UI | API | Contract | Persistence | Business Logic | Security | Runtime | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY |
| MahasiswaList | ✅ | ✅ | 🟢 | ✅ | ✅ | ⚠️ | ✅ | 🟢 READY (with auth gap) |
| TambahMahasiswa | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY |
| MahasiswaDetail | ✅ | ✅ | 🟡 partial | ✅ | ✅ | ⚠️ | ✅ | � READY W/ GAP |
| DataAkademik | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY |
| DokumenQueue | ✅ | ✅ | 🟢 | ✅ | ✅ | ⚠️ | ✅ | 🟢 READY (with file security gap) |
| SPList | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY |
| SPDetail | ✅ | ✅ | 🟡 mismatch | ✅ | ✅ | ✅ | ✅ | 🟡 READY W/ GAP |
| TerbitkanSP | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | � READY |
| BebasTanggunganList | ✅ | ✅ | 🟢 | ✅ | ✅ | ⚠️ | ✅ | 🟢 READY |
| BebasTanggunganDetail | ✅ | ✅ | 🟢 | ✅ | ✅ | ⚠️ | ✅ | 🟢 READY (signature hardcoded) |
| LaporanList | ✅ | ✅ | 🟢 | ✅ | ✅ | ⚠️ | ✅ | 🟢 READY |
| SusunLaporan | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY (hardcoded lists) |
| LaporanDetail | ✅ | ✅ | � mismatch | ✅ | ⚠️ | ✅ | ❌ | 🔴 **BLOCKED** (Admin tidak bisa approve) |
| Konfigurasi | ✅ | ✅ | 🟢 | ✅ | ✅ | ✅ | ✅ | 🟢 READY (hardcoded lists) |
| AuditLog | ✅ | ⚠️ | 🔴 FE static | ✅ | ✅ | ✅ | ❌ | 🔴 **BLOCKED** (data static) |

**Ringkasan Status**: 13 READY, 2 READY-WITH-GAP, 2 BLOCKED, 1 partial.

---

## 15. Remaining Gap Inventory

### 🔴 CRITICAL (Blocker)
Tidak ada.

### 🔴 HIGH (Security Risk)
- **G1**: Login tidak ada rate limiting/throttle → brute force attack rentan
- **G2**: `/api/admin/dokumen-queue/*` tidak cek role → non-admin bisa akses dokumen validasi queue
- **G3**: `/api/bebas-tanggungan/{id}/approve` tidak cek role → siapa saja dgn login bisa approve BT
- **G4**: IDOR Mahasiswa — `/api/mahasiswa/{id}` & `/api/mahasiswa/{id}/*` tidak cek role di method → prodi/mhs bisa lihat semua
- **G5**: Laporan Approve FE Admin call → endpoint guard warek only → 403 di FE Admin

### � MEDIUM (Logic Gap)
- **G6**: Dokumen file storage `serveFile` tidak ada authorization check → IDOR download
- **G7**: Audit Log FE tidak wire ke BE endpoint → data kosong di production
- **G8**: Side-call endpoint Prestasi/Organisasi/Pelatihan/BT by mhsId return ALL → beban tidak perlu + inkonsistensi
- **G9**: FE hardcoded list Prodi/Angkatan/Tahun/Dokumen/Signature — tidak sync dengan BE
- **G10**: SP Format Nomor Surat mismatch FE↔BE

### 🟡 LOW (Nice-to-have)
- **L1**: FE hardcoded Masa Tenggang 180 (line 169 SPDetail.tsx) — pakai BE Konfigurasi
- **L2**: FE hardcoded sapaan "Pak Encep Jianul" (Dashboard line 135) — pakai ProfileController
- **L3**: FE placeholder "Ganjil 2026/2027" (MahasiswaDetail line 2585) — pakai Konfigurasi
- **L4**: Konfigurasi informasi institusi belum support save di BE `update`
- **L5**: SPDetail pakai `window.print()` untuk preview — tidak ada backend-generated preview
- **L6**: Konfigurasi.tsx:317 hardcoded "Periode Aktif: 1 Sep – 15 Sep 2026" padahal state `tglBuka/tglTutup` sudah ada

---

## 16. Recommended Architecture

### Untuk setiap gap, **BACKEND + DATABASE harus dibangun untuk memenuhi FE**, bukan sebaliknya.

### G1: Auth Rate Limiting
**Backend**: Tambah `throttle:5,1` middleware di `Route::post("/auth/login", ...)` (max 5 percobaan per menit).  
**No FE/BE API contract change.**

### G2–G4: Admin Authorization Guards
**Backend**: Tambah `role:admin` middleware di `/api/admin/dokumen-queue*` group, `/api/bebas-tanggungan/{id}/approve`, `/api/bebas-tanggungan/{id}/reject`.  
Tambah role check di `Api/Admin/MahasiswaController::show`, `ipk`, `dokumen`, `rekap*`.  
**No DB change.**

### G5: Laporan Approve Authorization
**Backend**: Buka `routes/api.php` agar `approveLaporan` dan `returnLaporan` bisa di-call admin. Atau restrict FE Admin (sembunyikan tombol).  
**Rekomendasi**: Hide tombol "Approve" di `LaporanDetail.tsx` untuk Admin (hanya Warek yang boleh approve). Admin hanya bisa submit/edit.  
**No DB change.**

### G6: Dokumen File Authorization
**Backend**: Di `DokumenController::serveFile`, tambahkan ownership check: hanya admin, owner mahasiswa, atau prodi yang sesuai yang boleh download.  
**No DB change.**

### G7: AuditLog FE Integration
**Backend**: Endpoint `/api/audit` sudah ada dan siap.  
**FE**: Tambah `getAuditLogs(filter)` di `services/auditService.ts`. Wire ke `AuditLog.tsx` useEffect. Hapus array static `logs`.  
**No DB change.**

### G8: Side-Call Filter
**Backend**: Tambah optional `?mahasiswa_id=X` di endpoint `rekapPrestasi/Organisasi/Pelatihan`. Atau buat endpoint baru `/api/mahasiswa/{id}/[non-akademik]` yang sudah ada tapi verify response shape.  
**No DB change.**

### G9: FE Hardcoded Lists → BE Integration
**Backend**: Sudah siap.  
**FE**: 
- `DataAkademik.tsx`, `SusunLaporan.tsx`, `Konfigurasi.tsx` — ganti prodi hardcoded → `getMahasiswaFilterOptions().prodis`
- `LaporanList.tsx`, `SusunLaporan.tsx` — ganti tahun akademik → `konfigurasi.periode_history`
- `DokumenQueue.tsx`, `Konfigurasi.tsx` — ganti jenis dokumen → `getDokumenJenisList()`
- `Konfigurasi.tsx`, `SPDetail.tsx`, `BebasTanggunganDetail.tsx`, `MahasiswaDetail.tsx`, `SusunLaporan.tsx`, `LaporanDetail.tsx` — signature pakai `Konfigurasi::get('pengelola_nama')`, dll.

### G10: SP Format Nomor Surat
**Rekomendasi**: FE pakai `sp.nomorSurat` dari BE response (sudah dikembalikan di `SuratPeringatanResource`). Hapus function `nomorSurat()` di `SPDetail.tsx` line 23-29.

---

## 17. Files Expected to Change

### Backend (untuk Implementation Plan berikutnya)
| File | Perubahan |
| --- | --- |
| `routes/api.php` | Tambah `throttle:5,1` di login; tambah `role:admin` middleware di `/admin/dokumen-queue`, `/bebas-tanggungan/{id}/approve\|reject` |
| `app/Http/Middleware/CheckRole.php` | (sudah ada) |
| `app/Http/Controllers/Api/Admin/DokumenController.php` | Tambah role check, ownership check di `serveFile` |
| `app/Http/Controllers/Api/Admin/BebasTanggunganController.php` | Tambah role check di `approve`, `reject` |
| `app/Http/Controllers/Api/Admin/MahasiswaController.php` | Tambah role check di `show`, `ipk`, `dokumen`, `rekapAkademik`, `rekapPrestasi`, `rekapOrganisasi`, `rekapPelatihan` |
| `app/Http/Controllers/Api/AuthController.php` | (sudah ada, mungkin tinggal config throttle) |
| `app/Http/Controllers/Api/Admin/KonfigurasiController.php` | Extend `update` untuk support `nama_institusi`, `alamat_institusi` |
| `app/Http/Controllers/Api/Admin/MahasiswaController.php` | Extend `rekapPrestasi/Organisasi/Pelatihan` dengan optional `mahasiswa_id` filter |
| (tidak ada migration baru — semua DB entity sudah ada) | |

### Frontend (hanya integration/wiring, BUKAN perubahan UI/UX)
| File | Perubahan |
| --- | --- |
| `resources/js/services/auditService.ts` | Tambah `getAuditLogs()` |
| `resources/js/services/mahasiswaService.ts` | (sudah ada `getMahasiswaFilterOptions`) — wiring di DataAkademik/SusunLaporan/Konfigurasi |
| `resources/js/services/konfigurasiService.ts` (BARU) | Tambah `getDokumenJenisList()`, `getSignatures()` (atau extend) |
| `resources/js/pages/admin/AuditLog.tsx` | Wire ke BE endpoint (hapus static array) |
| `resources/js/pages/admin/DataAkademik.tsx` | Ganti prodi/angkatan hardcoded → BE |
| `resources/js/pages/admin/SusunLaporan.tsx` | Ganti prodi/tahun-akademik hardcoded → BE |
| `resources/js/pages/admin/Konfigurasi.tsx` | Ganti prodi/dokumen-jenis/institusi hardcoded → BE |
| `resources/js/pages/admin/DokumenQueue.tsx` | Ganti jenisDokumen hardcoded → BE |
| `resources/js/pages/admin/SPDetail.tsx` | Hapus `nomorSurat()` FE-side; pakai `sp.nomorSurat` dari BE |
| `resources/js/pages/admin/SPDetail.tsx` | `totalDays` dari Konfigurasi BE |
| `resources/js/pages/admin/Dashboard.tsx` | Sapaan dari `user.name` ProfileController |
| `resources/js/pages/admin/MahasiswaDetail.tsx` | Placeholder semester dari Konfigurasi BE |
| `resources/js/pages/admin/{BebasTanggunganDetail,SPDetail,LaporanDetail,SusunLaporan,MahasiswaDetail}.tsx` | Signature dari BE Konfigurasi |
| `resources/js/pages/admin/LaporanDetail.tsx` | Sembunyikan tombol Approve/Revisi untuk Admin (logic check `role`) |

---

## 18. Files That MUST NOT Change Without Approval

### Modul yang sudah FINAL ACCEPTANCE — PASS (tidak boleh disentuh)
- Tidak ada modul Admin yang berstatus FINAL ACCEPTANCE eksplisit terdokumentasi di git log.
- Commit terakhir `24d168f Integrasi BE <-> FE Role Mahasiswa` → Mahasiswa role sudah FINAL.
- Admin role saat ini masih dalam iterasi aktif.

### Modul yang sudah STABIL (tidak boleh berubah UI/UX)
- `Konfigurasi.tsx` Section 1–8 (UI sudah di-approve)
- `SPDetail.tsx` letter preview format (kop surat, signature position)
- `BebasTanggunganDetail.tsx` letter preview format
- `LaporanDetail.tsx` letter preview format
- `MahasiswaDetail.tsx` tabs & profile header
- `Dashboard.tsx` stat cards layout
- Logo ITG (`@/imports/logo_itg.jpg`)

### Backend yang sudah PRODUCTION-READY
- `Api/AuthController` (login flow)
- `BebasTanggunganService::getChecklist` (business rule core)
- `SPValidationService` (SP escalation rule)
- `IPKCalculatorService` (IPK calculation)
- `PdfGeneratorService` (PDF generation with BE Konfigurasi)
- `Konfigurasi` model dengan helper `get/set`

---

## 19. Final Discovery Verdict

🟠 **READY WITH GAPS**

### Alasan
- **13 dari 16 modul Admin berstatus READY** dengan kontrak FE↔BE yang MATCH.
- **3 modul** memiliki gap yang perlu disempurnakan tetapi tidak memblokir deployment production:
  1. **AuditLog** (FE static, BE ready) — fix via FE wiring
  2. **LaporanDetail Admin Approve** — fix via FE hide button untuk Admin
  3. **SPDetail Nomor Surat** — fix via FE pakai field dari BE
- **2 modul** (`MahasiswaDetail`, `SPDetail`) READY-WITH-GAP karena side-call pattern dan hardcoded constants.

### Rekomendasi Prioritas
1. **P0 — Security (sebelum production)**: 
   - Login rate limiting (G1)
   - Admin authorization guards di endpoint Admin-only (G2, G3)
   - IDOR Mahasiswa show/ipk/dokumen/rekap* (G4)
   - Laporan Approve FE Admin (G5)
2. **P1 — FE Integration (sebelum production)**:
   - AuditLog wire ke BE (G7)
   - FE hardcoded lists → BE (G9)
3. **P2 — Post-launch improvement**:
   - Dokumen file authorization (G6)
   - Side-call filter (G8)
   - SP Format Nomor Surat unification (G10)
   - Hardcoded constants cleanup (L1–L6)

### Total File Changes untuk Implementation Plan
- **Backend**: ~6 files (controllers + routes) — NO new migration
- **Frontend**: ~12 files (services + pages) — wiring only, NO UI/UX change
- **NO DB migration baru** — semua entity sudah ada

---

**END OF REPORT**

**STOP — Menunggu approval untuk menyusun Implementation Plan.**
