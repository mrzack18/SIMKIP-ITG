# DOKUMEN HIGH-LEVEL REQUIREMENTS (HLR)
## Sistem Monitoring Mahasiswa KIP Kuliah — Institut Teknologi Garut (ITG)

| | |
|---|---|
| **Nama Proyek** | Sistem Monitoring Mahasiswa KIP Kuliah ITG |
| **Jenis Dokumen** | High-Level Requirements (HLR) — hasil sintesis wawancara elisitasi kebutuhan |
| **Tanggal Wawancara** | 13 Agustus 2026 |
| **Narasumber** | Bpk. Encep — Pengelola KIP-Kuliah / Biro Kemahasiswaan ITG |
| **Pewawancara** | Kailla, Zaki |
| **Metodologi Pengembangan** | Rapid Application Development (RAD) |
| **Versi Dokumen** | 1.0 |
| **Tanggal Disusun** | 17 Agustus 2026 |
| **Status** | Draf — memerlukan validasi narasumber sebelum masuk tahap desain rinci |

> **Catatan metodologi penyusunan.** Dokumen ini menyintesis satu sesi wawancara menjadi kebutuhan tingkat tinggi yang terstruktur. Di seluruh dokumen, setiap butir kebutuhan diberi penanda status agar jelas mana yang *fakta* dari narasumber dan mana yang *interpretasi* tim analis:
> - **[Dinyatakan]** — langsung berdasarkan jawaban eksplisit narasumber.
> - **[Turunan/Asumsi]** — kebutuhan pendukung yang disimpulkan tim analis agar sistem dapat berfungsi secara utuh, belum dikonfirmasi kata per kata.
> - **[Klarifikasi]** — pertanyaan yang diajukan namun tidak terjawab tuntas, atau jawaban yang ambigu/tidak konsisten.
>
> Semua item **[Klarifikasi]** dikumpulkan di Bagian 13 agar mudah ditindaklanjuti bersama narasumber.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Tujuan Bisnis](#2-latar-belakang--tujuan-bisnis)
3. [Ruang Lingkup Proyek](#3-ruang-lingkup-proyek)
4. [Pengguna Sistem & Hak Akses](#4-pengguna-sistem--hak-akses)
5. [Aturan Bisnis (Business Rules)](#5-aturan-bisnis-business-rules)
6. [Alur Proses Bisnis Utama](#6-alur-proses-bisnis-utama)
7. [Kebutuhan Fungsional Tingkat Tinggi](#7-kebutuhan-fungsional-tingkat-tinggi)
8. [Kebutuhan Data](#8-kebutuhan-data)
9. [Kebutuhan Pelaporan & Dashboard](#9-kebutuhan-pelaporan--dashboard)
10. [Kebutuhan Non-Fungsional & Infrastruktur](#10-kebutuhan-non-fungsional--infrastruktur)
11. [Manajemen Proyek & Governance](#11-manajemen-proyek--governance)
12. [Asumsi](#12-asumsi)
13. [Risiko & Item Terbuka yang Perlu Klarifikasi](#13-risiko--item-terbuka-yang-perlu-klarifikasi)
14. [Glosarium](#14-glosarium)
15. [Lampiran A — Rangkuman Hasil Wawancara Sumber](#lampiran-a--rangkuman-hasil-wawancara-sumber)

---

## 1. Ringkasan Eksekutif

Biro Kemahasiswaan Institut Teknologi Garut (ITG) saat ini mengelola dan mengevaluasi mahasiswa penerima KIP Kuliah (KIP-K) secara manual, sehingga data akademik, prestasi, keaktifan organisasi, serta dokumen kelengkapan (SK, sertifikat, dsb.) tersebar dan tidak terpusat. Kondisi ini menyulitkan proses pemeriksaan/audit, pelacakan mahasiswa yang mengundurkan diri, serta pemantauan kepatuhan mahasiswa terhadap Surat Perjanjian KIP-K.

Untuk mengatasi hal ini, ITG berencana membangun **Sistem Monitoring Mahasiswa KIP Kuliah** yang dikembangkan dari nol (*from scratch*) menggunakan metodologi **Rapid Application Development (RAD)**, dengan target rilis operasional MVP dalam kurang lebih **satu bulan** untuk mahasiswa KIP-K angkatan 2026. Sistem ini akan menjadi pusat data (*single source of truth*) untuk memantau capaian akademik (IPK), prestasi, keaktifan organisasi, dan kelengkapan dokumen wajib mahasiswa KIP-K — sekaligus menjadi dasar penerbitan Surat Peringatan (SP) berjenjang, persetujuan bebas tanggungan sebagai syarat sidang akhir, dan pelaporan berkala kepada pimpinan (Wakil Rektor III).

Dokumen ini menyusun hasil wawancara elisitasi kebutuhan bersama narasumber (Bpk. Encep) menjadi kebutuhan tingkat tinggi yang terstruktur: latar belakang, ruang lingkup, peran pengguna, aturan bisnis, alur proses, kebutuhan fungsional, kebutuhan data, kebutuhan pelaporan, kebutuhan non-fungsional, hingga risiko dan item yang masih memerlukan klarifikasi lebih lanjut sebelum masuk tahap desain rinci (SRS).

## 2. Latar Belakang & Tujuan Bisnis

### 2.1 Permasalahan Saat Ini **[Dinyatakan]**

- Pengelolaan data mahasiswa KIP-K masih manual, menyebabkan data — termasuk Surat Keputusan (SK) — tercecer dan tidak terpusat.
- Sulit melakukan pemeriksaan/audit menyeluruh karena tidak ada akses terpusat ke riwayat mahasiswa per angkatan, termasuk mahasiswa yang mengundurkan diri.
- Tidak ada mekanisme terstruktur untuk memantau kepatuhan mahasiswa terhadap kewajiban non-akademik (sertifikat MABIM, KKN, Kerja Praktik, dll.) yang sering hilang atau sulit ditelusuri saat mahasiswa akan sidang akhir.
- Kemahasiswaan tidak memiliki visibilitas atas status kelulusan mahasiswa KIP-K secara real-time — pernah terjadi kasus mahasiswa yang seharusnya sudah lulus (KIP-K mewajibkan penyelesaian studi maksimal 8 semester) baru diketahui belum lulus setelah bertahun-tahun tanpa terdeteksi.

### 2.2 Tujuan Bisnis **[Dinyatakan]**

- Mempermudah proses monitoring dan evaluasi mahasiswa KIP-K oleh Biro Kemahasiswaan.
- Menyediakan satu sumber data yang jelas dan terpusat bagi institusi.
- Meningkatkan kontrol atas capaian mahasiswa KIP-K melalui pencatatan konsisten setiap semester.
- Menjadikan sistem sekaligus sebagai media pengarsipan digital pribadi mahasiswa ("drive" pribadi) atas seluruh capaian dan dokumen selama masa studi — turut mendukung penyusunan **SKPI** (Surat Keterangan Pendamping Ijazah) menjelang kelulusan.

### 2.3 Kriteria Keberhasilan **[Dinyatakan]**

Sistem dianggap berhasil apabila mencapai:
- **Integrasi data** — seluruh data mahasiswa KIP-K (akademik, non-akademik, dokumen) tersimpan dan dapat diakses dari satu sistem terpusat.
- **Rekam jejak (track record)** — riwayat capaian mahasiswa per semester tersusun rapi dan dapat ditelusuri kapan saja, termasuk lintas 8 semester masa studi.

> **[Klarifikasi]** Narasumber tidak menyebutkan target metrik kuantitatif (mis. persentase percepatan validasi dokumen). Disarankan mendefinisikan KPI terukur bersama pada tahap desain rinci — lihat Bagian 13, item 10.

### 2.4 Indikator Evaluasi Akademik Mahasiswa **[Dinyatakan]**

Evaluasi mahasiswa KIP-K setiap semester didasarkan pada empat indikator utama:

| No. | Indikator | Keterangan |
|---|---|---|
| 1 | **IPK** (Indeks Prestasi Kumulatif) | Indikator akademik utama; menjadi dasar utama pemicu Surat Peringatan (SP). |
| 2 | **Prestasi** | Pencapaian non-kurikuler mahasiswa (kompetisi, penghargaan, dsb.), dibuktikan dengan dokumen unggahan. |
| 3 | **Keaktifan Organisasi** | Keterlibatan mahasiswa dalam organisasi kemahasiswaan (BEM, HIMA, UKM, dll.), dibuktikan dengan dokumen unggahan. |
| 4 | **Informasi Pribadi** | Mencakup penggunaan anggaran/dana KIP-K dan catatan permasalahan pribadi mahasiswa (jika ada) — dinyatakan narasumber sebagai komponen **"sangat penting"** dalam menentukan keberhasilan mahasiswa. |

## 3. Ruang Lingkup Proyek

### 3.1 Target Rilis **[Dinyatakan]**

- Sistem dibangun dari nol (*from scratch*).
- Target rilis operasional: **± 1 bulan** sejak pengembangan dimulai.
- Target pengguna awal: mahasiswa KIP-K **angkatan 2026**; mahasiswa angkatan sebelumnya menyusul pada fase lanjutan (lihat 8.2).

### 3.2 Fitur Prioritas MVP (Rilis Pertama)

**[Dinyatakan]** — fitur mutlak yang disebutkan eksplisit oleh narasumber:
1. Input nilai IPK per semester.
2. Input data prestasi mahasiswa.
3. Input data keaktifan organisasi mahasiswa.

**[Turunan/Asumsi]** — agar ketiga fitur inti di atas berfungsi sebagai satu proses bisnis yang utuh (bukan sekadar formulir input tanpa tindak lanjut), kebutuhan berikut turut dimasukkan ke cakupan rilis pertama karena dibahas secara rinci di bagian lain wawancara sebagai kebutuhan yang mendesak, bukan fase lanjutan: unggah & validasi dokumen kewajiban, penerbitan Surat Peringatan (SP), approval bebas tanggungan, serta dashboard rekap dasar. Rincian lengkap ada di Bagian 7.

### 3.3 Di Luar Cakupan Rilis Pertama (Fase Lanjutan) **[Dinyatakan]**

- **Input/impor data historis** mahasiswa KIP-K angkatan sebelum 2026 — dilakukan setelah sistem inti selesai dibangun, bukan bagian rilis pertama.
- **Bridging/integrasi otomatis** dengan sistem pendaftaran KIP/SIAKAD yang sudah ada — tidak wajib pada rilis pertama; sistem berdiri sendiri (*standalone*) terlebih dahulu.

### 3.4 Batasan Tegas / Out of Scope **[Dinyatakan]**

> Narasumber menegaskan agar modul pendaftaran/seleksi mahasiswa baru (**PMB**), termasuk jalur KIP, **tidak digabung** ke dalam sistem ini — sengaja dipisah agar sistem monitoring tetap fokus. Titik awal (*starting point*) data mahasiswa dalam sistem ini adalah **setelah mahasiswa dinyatakan diterima sebagai penerima KIP-K, memiliki NIM, dan SK Penetapan KIP telah diinput oleh Admin**. Proses seleksi/pendaftaran menjadi tanggung jawab sistem PMB (reguler maupun jalur KIP) yang terpisah, walau berpotensi diintegrasikan di masa depan (lihat HLR-F-38).

## 4. Pengguna Sistem & Hak Akses

### 4.1 Daftar Peran (Roles)

**a. Super Admin (Kemahasiswaan / Pengelola KIP-K)** — **[Dinyatakan]**
Dijabat oleh Biro Kemahasiswaan (diwakili narasumber). Kendali penuh: input data SK & NIM mahasiswa, validasi dokumen, penerbitan SP, approval bebas tanggungan, penghapusan data (dengan konfirmasi), serta akses penuh dashboard dan pelaporan.

**b. Program Studi (Prodi)** — **[Dinyatakan]**
Berperan sebagai **pemantau (viewer)** atas mahasiswa KIP-K di lingkup program studinya sendiri. **Tidak memiliki wewenang validasi/approval** — hanya dapat melihat dan mengunduh (*export*) laporan data mahasiswa di prodinya.

**c. Mahasiswa (Penerima KIP-K)** — **[Dinyatakan]**
Login dengan password default yang wajib dapat diganti; input IPK/prestasi/keaktifan organisasi; unggah dokumen kewajiban; melihat notifikasi SP; mengunduh riwayat/dokumen miliknya sendiri. **Tidak memiliki hak hapus data.**

**d. Wakil Rektor III (Warek 3, Bidang Kemahasiswaan dan Kerja Sama)** — **[Dinyatakan, sebagian Klarifikasi]**
Berperan pada tahap **approval laporan resmi semester** yang diajukan Kemahasiswaan (memberi tanda tangan/approval sebelum laporan dicetak final). Cakupan hak akses langsung ke dashboard/sistem masih akan dikoordinasikan dengan USI/LSIPD — belum final (lihat Bagian 13).

**e. USI / LSIPD (Unit Teknologi Informasi ITG)** — **[Dinyatakan]**
Bukan pengguna fungsional sistem monitoring, melainkan **mitra teknis** untuk koordinasi infrastruktur server/hosting dan kemungkinan hak akses tambahan bagi aktor lain. Belum dikoordinasikan secara resmi pada saat wawancara.

### 4.2 Matriks Hak Akses

| Aktivitas / Fitur | Super Admin | Prodi | Mahasiswa | Warek 3 |
|---|:---:|:---:|:---:|:---:|
| Input SK Penetapan KIP & aktivasi akun mahasiswa | ✅ Penuh | – | – | – |
| Input IPK, prestasi, keaktifan organisasi | 👁️ Lihat semua | 👁️ Lihat (prodi sendiri) | ✅ Input data sendiri | – |
| Unggah dokumen kewajiban (sertifikat, dsb.) | 👁️ Lihat & validasi | 👁️ Lihat (prodi sendiri) | ✅ Unggah milik sendiri | – |
| Validasi/approve dokumen unggahan | ✅ | – | – | – |
| Terbitkan Surat Peringatan (SP1–SP3) | ✅ | – | 🔔 Terima notifikasi | – |
| Approve Bebas Tanggungan (syarat sidang) | ✅ | – | 📝 Ajukan permohonan | – |
| Hapus data mahasiswa | ✅ (wajib konfirmasi) | – | – | – |
| Lihat dashboard rekap keseluruhan | ✅ Penuh | 👁️ Terbatas prodi sendiri | – | 🔄 Dikoordinasikan lanjut |
| Unduh (*export*) laporan data mahasiswa | ✅ | ✅ (prodi sendiri) | ✅ (data sendiri) | ✅ (laporan resmi semester) |
| Approve laporan resmi semester ke pimpinan | 📝 Susun & ajukan | – | – | ✅ Approve final |

*Keterangan: ✅ akses/wewenang penuh · 👁️ lihat saja (view-only) · 📝 mengajukan/menyusun · 🔔 menerima notifikasi · 🔄 masih dikoordinasikan · – tidak ada akses.*

## 5. Aturan Bisnis (Business Rules)

### BR-1 — Prasyarat Aktivasi Akun Mahasiswa **[Dinyatakan]**
Mahasiswa baru dapat memiliki akun & mengakses sistem **setelah** Admin menginput **NIM** dan **SK Penetapan KIP** mahasiswa bersangkutan. Ini adalah titik masuk (*entry point*) mahasiswa ke sistem monitoring, terlepas dari proses seleksi/pendaftaran KIP sebelumnya (di luar sistem ini).

### BR-2 — Password Default & Keamanan Akun **[Dinyatakan]**
Setiap akun mahasiswa baru dibuatkan dengan **password default** oleh Admin. Sistem harus menyediakan fitur ubah password saat/setelah login pertama untuk mengurangi risiko penyalahgunaan akun oleh pihak lain.

### BR-3 — Sistem Peringatan (SP) Berjenjang **[Dinyatakan]**
Ini adalah **inti bisnis** sistem monitoring. Aturan pelanggaran mengacu pada **Surat Perjanjian KIP-K** yang ditandatangani setiap mahasiswa penerima KIP-K.

| Tingkat | Pemicu | Konsekuensi |
|---|---|---|
| **SP1** | Pelanggaran pertama atas Surat Perjanjian (mis. IPK di bawah standar minimum). Diterbitkan setelah Admin **memverifikasi data terlebih dahulu** — bukan otomatis tanpa pemeriksaan. | Mahasiswa wajib melakukan perbaikan; diberi masa evaluasi **1 semester berikutnya**. |
| **SP2** | Pelanggaran yang sama terulang, **atau** pelanggaran lain atas Surat Perjanjian, setelah masa evaluasi SP1 terlewati tanpa perbaikan memadai. | Diberi kesempatan perbaikan lanjutan. |
| **SP3** | Pelanggaran terus berlanjut/bertambah setelah SP2 (mis. IPK terus menurun antar-semester alih-alih membaik), **atau** termasuk pelanggaran dengan pemberhentian langsung (BR-4). | **Pemberhentian/pencabutan status kepesertaan KIP-K** — bersifat final. |

**Catatan penting:**
- Contoh angka yang diberikan narasumber: standar minimum IPK **3,0**; penurunan ke **2,8** sudah memicu SP1. Jika pada evaluasi semester berikutnya IPK **kembali ≥ 3,0**, status dianggap selesai/pulih (tidak lanjut ke SP2). Jika terus menurun (mis. 2,8 → 2,7 → 2,3), dianggap tidak berkomitmen memperbaiki diri dan berujung pemberhentian.
- Skema ini berlaku untuk pelanggaran **akademik** (IPK) maupun **non-akademik/kode etik** — untuk non-akademik, SP diterbitkan **manual oleh Admin** (lihat BR-6).
- **[Klarifikasi]** Ambang batas IPK persis perlu dikonfirmasi ulang: contoh narasumber menyebut standar 3,0, sedangkan pertanyaan interviewer sempat mencontohkan angka berbeda (di bawah 2,75). Lihat Bagian 13, item 1.

### BR-4 — Pelanggaran dengan Pemberhentian Langsung **[Dinyatakan]**
Pelanggaran tertentu **tidak melalui tahapan SP1→SP2** dan langsung berujung pemberhentian (setara SP3). Contoh eksplisit dari narasumber: **mahasiswa KIP-K mengambil cuti akademik tanpa konfirmasi**, kecuali cuti tersebut atas alasan **sakit**. Ketentuan KIP-K melarang cuti akademik biasa bagi penerimanya.

### BR-5 — Masa Tenggang (Grace Period) **[Dinyatakan]**
Setiap kali SP diterbitkan atas dasar capaian akademik (IPK), mahasiswa diberi **masa tenggang satu semester berikutnya** untuk evaluasi/perbaikan sebelum status dieskalasi ke tingkat SP berikutnya.

### BR-6 — Alur Penerbitan SP untuk Pelanggaran Non-Akademik **[Dinyatakan]**
Untuk pelanggaran non-akademik/kode etik, SP **diterbitkan manual oleh Admin** (bukan otomatis oleh sistem). Sistem menyediakan fitur bagi Admin untuk "menerbitkan surat peringatan", yang memicu **notifikasi visual** (contoh dari narasumber: penanda merah) pada akun mahasiswa terkait, lengkap dengan keterangan alasan pelanggaran.

### BR-7 — Kewajiban Unggah Dokumen **[Dinyatakan]**
**Seluruh** bukti fisik kewajiban non-akademik **wajib** diunggah mahasiswa ke sistem — termasuk (namun tidak terbatas pada) sertifikat MABIM, KKN, Kerja Praktik/Magang, Skripsi, dan Bela Negara. Tujuan rangkap tiga: (1) syarat evaluasi rutin, (2) mempermudah mahasiswa saat sidang akhir (menghindari dokumen hilang/sulit ditelusuri — masalah nyata yang masih dialami narasumber hingga saat wawancara), dan (3) berfungsi sebagai **arsip digital pribadi** yang mendukung penyusunan SKPI menjelang kelulusan.

### BR-8 — Validasi Dokumen **[Dinyatakan]**
Setiap dokumen yang diunggah mahasiswa **wajib divalidasi satu per satu oleh Admin**, dengan status minimal: **Menunggu Validasi**, **Disetujui**, atau **Ditolak/Revisi**.

### BR-9 — Catatan Penolakan Dokumen **[Dinyatakan]**
Penyediaan kolom catatan/komentar Admin saat menolak dokumen dinyatakan **bersifat opsional** oleh narasumber ("bebas") — keputusan akhir diserahkan ke tim pengembang pada tahap desain rinci. *Rekomendasi tim analis: tetap sediakan sebagai praktik UX yang baik, walau tidak diwajibkan.*

### BR-10 — Jadwal Input Nilai (IPK) **[Dinyatakan]**
Periode input nilai IPK **mengikuti kalender akademik resmi kampus** — dibuka melalui pengumuman resmi setelah periode UAS, dengan estimasi jendela waktu **± 2 minggu**. Jadwal pasti mengikuti pengumuman kalender akademik tiap semester, bukan tanggal tetap yang di-*hardcode*.

> **[Klarifikasi]** Wawancara tidak menetapkan tenggat waktu untuk unggahan dokumen non-akademik (sertifikat, dsb.) di luar nilai IPK. Lihat Bagian 13, item 7.

### BR-11 — Kebijakan Hapus Data **[Dinyatakan]**
**Mahasiswa tidak diberikan fitur hapus data** dalam bentuk apa pun, untuk mencegah penyalahgunaan (contoh dari narasumber: potensi penghapusan data oleh pihak lain yang mengetahui kredensial akun mahasiswa). Kewenangan hapus data **hanya dimiliki Admin/Pengelola**, dan proses penghapusan **wajib melalui tahap konfirmasi**.

### BR-12 — Approval Bebas Tanggungan sebagai Syarat Sidang **[Dinyatakan]**
Mahasiswa KIP-K **wajib memperoleh approval "Bebas Tanggungan"** dari Kemahasiswaan/Pengelola KIP-K sebelum dapat mengikuti sidang akhir, dan harus melampirkan bukti approval tersebut sebagai syarat administratif. Latar belakang aturan: pernah ada kasus mahasiswa KIP-K yang belum lulus melewati batas 8 semester tanpa terdeteksi Kemahasiswaan; approval wajib ini memastikan status setiap mahasiswa (lulus/belum) selalu diketahui pasti.

> **[Klarifikasi]** Bentuk akhir dokumen approval (dokumen digital yang dapat dicetak mahasiswa vs. sekadar perubahan status di sistem) **tidak terjawab eksplisit** dalam wawancara. Lihat Bagian 13, item 3.

### BR-13 — Batas Masa Studi KIP-K **[Dinyatakan]**
Ketentuan KIP-K mewajibkan penyelesaian studi maksimal **8 semester**. Sistem perlu melacak & menampilkan posisi semester berjalan tiap mahasiswa relatif terhadap batas ini, mendukung deteksi dini mahasiswa berisiko melewati batas masa studi (terkait BR-12).

### BR-14 — Akses Setelah Pemberhentian/Kelulusan **[Turunan/Asumsi]**
Jika status kepesertaan KIP-K dicabut (SP3) atau dinonaktifkan Admin, mahasiswa **tidak dapat login kembali mulai semester berikutnya** (dinyatakan eksplisit oleh narasumber). Data historis mahasiswa tersebut diasumsikan **tetap disimpan** untuk kebutuhan audit/pelaporan, bukan dihapus — lihat Bagian 12.

## 6. Alur Proses Bisnis Utama

### 6.1 Onboarding Akun Mahasiswa KIP-K
1. Mahasiswa dinyatakan diterima sebagai penerima KIP-K dan memperoleh NIM.
2. Admin menginput SK Penetapan KIP dan NIM mahasiswa ke sistem.
3. Sistem membuatkan akun mahasiswa dengan password default.
4. Mahasiswa login pertama kali dan disarankan segera mengganti password default.
5. Mahasiswa mulai dapat menginput data akademik dan non-akademik.

### 6.2 Input & Validasi Data Semesteran
1. Mahasiswa login dan menginput IPK sesuai jendela waktu yang dibuka mengikuti kalender akademik (± 2 minggu setelah UAS).
2. Mahasiswa mengunggah bukti prestasi, keaktifan organisasi, dan dokumen kewajiban (MABIM, KKN, KP, Skripsi, Bela Negara, dll.).
3. Admin memvalidasi tiap dokumen yang diunggah → status berubah menjadi Disetujui atau Ditolak/Revisi.
4. Data yang telah tervalidasi menjadi bagian dari rekam jejak permanen mahasiswa bersangkutan.

### 6.3 Penerbitan Surat Peringatan (SP)
1. Sistem/Admin mendeteksi indikasi pelanggaran (IPK di bawah standar Surat Perjanjian, atau laporan pelanggaran non-akademik).
2. Admin memverifikasi/mengonfirmasi data pelanggaran.
3. Admin menerbitkan SP (SP1/SP2/SP3) secara manual melalui sistem, disertai keterangan alasan.
4. Notifikasi SP tampil pada akun/dashboard mahasiswa terkait.
5. Mahasiswa menjalani masa tenggang satu semester untuk perbaikan (BR-5), kecuali pelanggaran yang berujung pemberhentian langsung (BR-4).
6. Jika mencapai SP3, status kepesertaan KIP-K dicabut permanen dan akses login dinonaktifkan mulai semester berikutnya.

### 6.4 Approval Bebas Tanggungan / Kelulusan Sidang
1. Mahasiswa mengajukan permohonan Bebas Tanggungan sebagai syarat administratif sidang akhir.
2. Kemahasiswaan/Pengelola KIP-K (Super Admin) meninjau rekam jejak dan kelengkapan dokumen mahasiswa.
3. Kemahasiswaan menyetujui (approve) permohonan.
4. Sistem menerbitkan bukti/status approval, dilampirkan mahasiswa sebagai syarat sidang.

### 6.5 Pelaporan Semester ke Pimpinan
1. Kemahasiswaan menyusun laporan evaluasi semester dari data sistem (nomor surat, nomor kegiatan, rekap IPK/prestasi/masalah tiap mahasiswa), dapat diekspor ke Excel/PDF.
2. Kemahasiswaan menandatangani laporan dan mengajukannya ke Warek 3.
3. Warek 3 memberikan approval/tanda tangan (mis. via barcode) atas laporan.
4. Laporan final dicetak dan diarsipkan; laporan historis dapat diunduh kembali berdasarkan filter semester, lengkap dengan grafik perkembangan IPK mahasiswa lintas semester (hingga 8 semester).

## 7. Kebutuhan Fungsional Tingkat Tinggi

*Legenda prioritas: **[MVP]** wajib rilis pertama · **[Lanjutan]** fase berikutnya · **[Klarifikasi]** menunggu konfirmasi sebelum difinalisasi.*

### Modul A — Manajemen Pengguna & Autentikasi
- **HLR-F-01** [MVP] Sistem menyediakan pembuatan akun mahasiswa oleh Admin berbasis NIM dan SK Penetapan KIP yang telah diinput.
- **HLR-F-02** [MVP] Sistem menyediakan password default untuk akun baru dan fitur ubah password saat/pasca login pertama.
- **HLR-F-03** [MVP] Sistem mendukung otentikasi & otorisasi berbasis peran: Super Admin, Prodi, Mahasiswa (Warek 3 pada modul pelaporan — cakupan akses menunggu koordinasi, lihat Bagian 13).
- **HLR-F-04** [MVP] Admin dapat menonaktifkan akses akun mahasiswa (pemberhentian KIP atau kelulusan), mencegah login pada semester berikutnya.

### Modul B — Data Akademik & Non-Akademik Mahasiswa
- **HLR-F-05** [MVP] Mahasiswa dapat menginput data IPK per semester.
- **HLR-F-06** [MVP] Mahasiswa dapat menginput data prestasi beserta bukti dokumen pendukung.
- **HLR-F-07** [MVP] Mahasiswa dapat menginput data keaktifan organisasi beserta bukti dokumen pendukung.
- **HLR-F-08** [MVP] Sistem mencatat kategori kepesertaan mahasiswa (Reguler/Aspirasi), Program Studi, dan Angkatan untuk keperluan rekap dan pelaporan.
- **HLR-F-09** [MVP][Klarifikasi] Sistem mencatat informasi pribadi terkait penggunaan anggaran KIP-K dan catatan permasalahan pribadi mahasiswa. *Sensitivitas data ini terhadap privasi dan pembatasan akses perlu didetailkan pada fase desain.*

### Modul C — Manajemen Dokumen & Kewajiban
- **HLR-F-10** [MVP] Mahasiswa dapat mengunggah seluruh dokumen bukti kewajiban non-akademik yang dipersyaratkan (MABIM, KKN, Kerja Praktik/Magang, Skripsi, Bela Negara, dan dokumen lain yang ditetapkan) — seluruhnya wajib.
- **HLR-F-11** [MVP] Setiap dokumen unggahan memiliki status: Menunggu Validasi, Disetujui, atau Ditolak/Revisi.
- **HLR-F-12** [MVP] Admin dapat memvalidasi (menyetujui/menolak) dokumen yang diunggah mahasiswa.
- **HLR-F-13** [Rekomendasi — opsional sesuai BR-9] Admin dapat menambahkan catatan alasan saat menolak dokumen.
- **HLR-F-14** [MVP] Mahasiswa dapat melihat/mengunduh seluruh dokumen dan riwayat kewajiban miliknya sendiri sewaktu-waktu (fungsi arsip/"drive" pribadi), termasuk untuk kebutuhan SKPI.
- **HLR-F-15** [MVP] Jadwal pembukaan input nilai IPK dapat dikonfigurasi Admin mengikuti kalender akademik tiap semester.

### Modul D — Sistem Peringatan (SP) & Sanksi
- **HLR-F-16** [MVP] Admin dapat menerbitkan Surat Peringatan bertingkat (SP1, SP2, SP3) sesuai pelanggaran Surat Perjanjian KIP-K (BR-3).
- **HLR-F-17** [MVP] Sistem mendukung logika eskalasi SP1→SP2→SP3 dengan masa tenggang satu semester di tiap tahap (BR-5).
- **HLR-F-18** [MVP] Sistem mendukung jalur pemberhentian langsung (setara SP3) untuk pelanggaran tertentu yang tidak melalui tahapan bertingkat, mis. cuti akademik tanpa keterangan sakit (BR-4).
- **HLR-F-19** [MVP] Admin dapat menerbitkan SP manual untuk pelanggaran non-akademik/kode etik, disertai keterangan alasan (BR-6).
- **HLR-F-20** [MVP] Sistem menampilkan notifikasi SP secara jelas (indikator visual) pada akun/dashboard mahasiswa terkait, beserta alasannya.
- **HLR-F-21** [MVP] Status SP3 otomatis menonaktifkan akses login mahasiswa mulai semester berikutnya (terhubung HLR-F-04).

### Modul E — Approval & Kelulusan
- **HLR-F-22** [MVP] Mahasiswa dapat mengajukan permohonan Bebas Tanggungan sebagai syarat sidang akhir.
- **HLR-F-23** [MVP] Hanya Super Admin (Kemahasiswaan) yang dapat memberikan approval Bebas Tanggungan.
- **HLR-F-24** [Klarifikasi] Sistem menghasilkan bukti approval yang dilampirkan mahasiswa sebagai syarat sidang — bentuk final (dokumen tercetak vs status sistem) menunggu konfirmasi (BR-12; Bagian 13 item 3).
- **HLR-F-25** [MVP] Prodi memiliki akses lihat (*view-only*) atas rekam jejak mahasiswa di lingkup program studinya, tanpa kewenangan validasi/approval.
- **HLR-F-26** [MVP] Prodi dapat mengunduh (*export*) laporan data mahasiswa di lingkup program studinya.

### Modul F — Dashboard & Pelaporan
- **HLR-F-27** [MVP] Dashboard utama menampilkan jumlah total mahasiswa KIP-K aktif secara keseluruhan.
- **HLR-F-28** [MVP] Dashboard menampilkan sebaran jumlah mahasiswa per Program Studi.
- **HLR-F-29** [MVP] Dashboard menampilkan sebaran jumlah mahasiswa per Angkatan.
- **HLR-F-30** [MVP] Dashboard menampilkan rekap jumlah mahasiswa berdasarkan kategori Reguler vs Aspirasi (relevan untuk kebutuhan audit BPK/Inspektorat).
- **HLR-F-31** [Rekomendasi turunan] Dashboard menampilkan ringkasan jumlah mahasiswa per status SP aktif — disebut sebagai contoh oleh interviewer namun tidak dikonfirmasi eksplisit oleh narasumber; direkomendasikan untuk konsistensi dengan tujuan monitoring.
- **HLR-F-32** [MVP] Sistem dapat mengekspor laporan evaluasi semester ke format Excel dan/atau PDF, memuat nomor surat, nomor kegiatan, serta rekap aktivitas/IPK/prestasi/catatan masalah tiap mahasiswa.
- **HLR-F-33** [MVP] Laporan dapat difilter berdasarkan periode semester, menampilkan riwayat/grafik perkembangan IPK mahasiswa antar semester (hingga 8 semester).
- **HLR-F-34** [MVP][perlu detail desain] Sistem mendukung alur approval berjenjang untuk laporan resmi: disusun & ditandatangani Kemahasiswaan → diajukan ke Warek 3 → Warek 3 approve (mekanisme tanda tangan digital/barcode) → siap cetak final.

### Modul G — Data Historis & Migrasi (Fase Lanjutan)
- **HLR-F-35** [Lanjutan] Sistem menyediakan mekanisme input/impor data riwayat akademik mahasiswa KIP-K angkatan sebelum 2026, baik input mandiri retroaktif oleh mahasiswa bersangkutan saat login pertama kali, maupun impor massal oleh Admin (mis. dari Excel/Google Form).
- **HLR-F-36** [Lanjutan] Struktur data untuk input historis ditentukan setelah desain skema data inti selesai dibangun.

### Modul H — Integrasi & Infrastruktur
- **HLR-F-37** [MVP — keputusan desain] Rilis pertama beroperasi *standalone* tanpa keharusan *bridging* otomatis ke sistem pendaftaran KIP/SIAKAD yang sudah ada.
- **HLR-F-38** [Future / Out of Scope rilis pertama] Potensi pengembangan lanjutan untuk mengintegrasikan proses pendaftaran-seleksi-pengumuman KIP dapat dipertimbangkan di masa depan, dengan syarat tetap terpisah secara fungsi/modul dari sistem monitoring dan dari PMB reguler.
- **HLR-F-39** [Risiko/Perlu koordinasi] Infrastruktur server/hosting akan dikoordinasikan dengan LSIPD; kepastian ketersediaan infrastruktur relatif terhadap target rilis (± 1 bulan) masih menjadi risiko terbuka pada saat wawancara (Bagian 13, item 8).

## 8. Kebutuhan Data

### 8.1 Entitas Data Utama (usulan tingkat tinggi)

| Entitas | Atribut Kunci (indikatif) |
|---|---|
| **Mahasiswa** | NIM, Nama, Program Studi, Angkatan, Kategori (Reguler/Aspirasi), Status Akun (Aktif/Nonaktif), Status Kelulusan |
| **SK Penetapan KIP** | Nomor SK, Tanggal SK, File SK, NIM terkait |
| **Data Akademik Semester** | NIM, Semester ke-, IPK, Tanggal Input |
| **Prestasi** | NIM, Jenis/Nama Prestasi, Tingkat (jika ada), File Bukti, Tanggal |
| **Keaktifan Organisasi** | NIM, Nama Organisasi, Peran/Jabatan, File Bukti, Periode |
| **Dokumen Kewajiban** | NIM, Jenis Dokumen (MABIM/KKN/KP/Skripsi/Bela Negara/dll.), File, Status Validasi, Tanggal Unggah, Catatan Admin (opsional) |
| **Informasi Pribadi** | NIM, Catatan Penggunaan Anggaran, Catatan Permasalahan Pribadi |
| **Surat Peringatan (SP)** | NIM, Tingkat SP (1/2/3), Alasan/Pelanggaran, Tanggal Terbit, Status (Aktif/Selesai) |
| **Approval Bebas Tanggungan** | NIM, Status Approval, Tanggal, Disetujui Oleh |
| **Laporan Semester** | Nomor Surat, Nomor Kegiatan, Periode Semester, Status Approval Warek 3, File Laporan |

> Skema di atas bersifat indikatif tingkat tinggi (bukan desain basis data final) dan perlu diturunkan menjadi ERD/skema basis data pada tahap desain rinci.

### 8.2 Data Historis & Migrasi **[Dinyatakan]**
- Mahasiswa KIP-K angkatan sebelum 2026 (mis. 2024, 2025) **tetap perlu dimasukkan**, namun prosesnya **dijadwalkan setelah sistem inti selesai dibangun** (bukan bagian MVP awal).
- Mekanisme pengisian bersifat **hybrid**: mahasiswa lama login dan mengisi seluruh riwayat semester sebelumnya sekaligus (bukan input real-time per aktivitas), **dan/atau** Admin melakukan impor massal (idealnya dari Excel/Google Form) untuk mempercepat proses.
- Proses input data lama **tidak mengubah alur kerja** yang dirancang untuk mahasiswa baru — perbedaannya murni pada waktu pengisian (retroaktif vs berjalan).

### 8.3 Sumber Data & Integrasi **[Dinyatakan]**
- **MVP:** sistem berdiri sendiri (*standalone*); tidak ada keharusan *bridging* otomatis ke sistem lain pada rilis pertama.
- Sistem pendaftaran KIP berbasis web yang sudah ada saat ini **hanya mencakup pendaftaran dan pengumuman**, dan secara eksplisit **tidak digabungkan secara fungsional** dengan sistem monitoring ini (lihat 3.4).
- Potensi integrasi lanjutan (mis. dengan SIAKAD/URHJ atau sistem pendaftaran KIP) terbuka untuk roadmap berikutnya, namun bukan prasyarat rilis pertama.

## 9. Kebutuhan Pelaporan & Dashboard

### 9.1 Dashboard Utama (Super Admin) **[Dinyatakan]**
Halaman utama (dashboard) yang dilihat Kemahasiswaan saat login pertama kali perlu menampilkan **sebaran data mahasiswa KIP-K** secara berlapis:
1. Jumlah total mahasiswa KIP-K aktif secara keseluruhan.
2. Sebaran jumlah mahasiswa per **Program Studi**.
3. Sebaran jumlah mahasiswa per **Angkatan**.
4. Rekap jumlah mahasiswa berdasarkan **kategori kepesertaan** (Reguler vs Aspirasi) — dikaitkan eksplisit oleh narasumber dengan **kesiapan audit** BPK (Badan Pemeriksa Keuangan) dan Inspektorat, yang kerap menanyakan rincian jumlah per kategori dan per angkatan.

> **Catatan akurasi data:** contoh angka yang disebutkan narasumber saat menjelaskan skenario ini (mis. "total 167", lalu "100" dan "500 sekian" untuk pembagian reguler/aspirasi) tidak konsisten secara matematis dan tampaknya merupakan ilustrasi spontan saat wawancara, bukan data riil/final. Angka tersebut **tidak** dijadikan acuan kuantitatif dalam dokumen ini.

### 9.2 Ekspor Laporan **[Dinyatakan, sebagian Turunan]**
- Sistem harus mendukung ekspor laporan evaluasi semester ke format **Excel dan/atau PDF**.
- Muatan laporan yang dikonfirmasi: nomor surat, nomor kegiatan (contoh judul: *"Laporan Kegiatan Evaluasi Semester [n]"*), rekap aktivitas mahasiswa, IPK, prestasi, dan catatan permasalahan.
- **[Turunan]** Kolom tambahan yang diusulkan interviewer (NIM, Nama, Prodi, IPK Terakhir, Status Sanksi) selaras dengan kebutuhan di atas dan direkomendasikan untuk dimasukkan, meski tidak diulang eksplisit oleh narasumber dalam jawabannya — disarankan dikonfirmasi ulang saat menyusun spesifikasi rinci laporan.
- Alur approval laporan: Kemahasiswaan menyusun & menandatangani → diajukan ke Warek 3 → Warek 3 memberi approval (tanda tangan/barcode) → dicetak sebagai dokumen final.
- Laporan historis dapat difilter/diunduh per semester, lengkap dengan grafik perkembangan IPK mahasiswa individual sepanjang masa studinya (hingga 8 semester).

## 10. Kebutuhan Non-Fungsional & Infrastruktur

| Aspek | Kebutuhan |
|---|---|
| **Keamanan Akun** | Password default awal wajib dapat diganti mahasiswa; fitur hapus data dibatasi hanya untuk Admin dengan konfirmasi (BR-11). |
| **Ketertelusuran (Audit Trail)** | **[Turunan]** Tindakan sensitif (validasi dokumen, penerbitan SP, penghapusan data, approval bebas tanggungan) sebaiknya tercatat — tidak diminta eksplisit, namun direkomendasikan mengingat sistem ini akan menjadi rujukan audit BPK/Inspektorat. |
| **Infrastruktur Server & Hosting** | Belum dipastikan pada saat wawancara; akan dikoordinasikan dengan LSIPD. Risiko terhadap target rilis ± 1 bulan (Bagian 13, item 8). |
| **Konfigurasi Kalender Akademik** | Jendela input nilai perlu dapat dikonfigurasi Admin mengikuti kalender akademik tiap semester (bukan *hardcoded*). |
| **Metodologi Pengembangan** | Rapid Application Development (RAD) — implikasi: pengembangan berbasis prototipe cepat dengan siklus revisi singkat selama fase konstruksi. |
| **Timeline** | Target rilis operasional ± 1 bulan sejak mulai pengembangan, dengan fokus MVP pada angkatan 2026. |

## 11. Manajemen Proyek & Governance

- **Otoritas Persetujuan Perubahan (Change Control):** Selama fase konstruksi RAD, jika ada kebutuhan penyesuaian alur kerja atau revisi tampilan, **Kemahasiswaan (Bpk. Encep)** adalah pihak tunggal yang berwenang memberikan **ACC (persetujuan akhir)** agar pengerjaan tidak melenceng dari jadwal.
- **Koordinasi Eksternal yang Masih Diperlukan:**
  - Dengan **USI/LSIPD** — untuk menentukan hak akses tambahan bagi aktor lain (mis. Warek 3) dan kepastian infrastruktur server/hosting.
  - Kedua koordinasi ini **belum final** pada saat wawancara dan berpotensi memengaruhi jadwal rilis (lihat Bagian 13).

## 12. Asumsi

Asumsi yang digunakan tim analis untuk melengkapi kebutuhan yang tidak dinyatakan eksplisit oleh narasumber, dan perlu divalidasi:

1. Data historis mahasiswa yang statusnya dicabut/dinonaktifkan (SP3 atau lulus) **tetap disimpan** dalam sistem untuk kebutuhan audit dan pelaporan, bukan dihapus (selaras BR-11 yang membatasi hak hapus hanya pada Admin).
2. Setiap tindakan penting (validasi, penerbitan SP, approval, penghapusan) idealnya memiliki **jejak audit (log)**, mengingat sistem akan dirujuk saat pemeriksaan BPK/Inspektorat.
3. Kriteria pembeda kategori **Reguler vs Aspirasi** mengikuti ketentuan resmi program KIP-K yang berlaku secara nasional/institusional (bukan didefinisikan ulang oleh sistem ini) — sistem hanya perlu mencatat & merekap kategori tersebut.
4. Ambang batas IPK minimum yang memicu SP1 mengacu pada ketentuan tertulis di **Surat Perjanjian KIP-K** resmi (berpotensi berubah per kebijakan/angkatan), bukan nilai tetap yang di-*hardcode* — sistem sebaiknya dirancang agar ambang batas ini **dapat dikonfigurasi** Admin.
5. Cakupan "Prodi" meliputi seluruh program studi aktif di ITG (saat ini: Teknik Informatika, Teknik Industri, Teknik Sipil, Arsitektur, dan Sistem Informasi), masing-masing dengan akses termonitor sesuai Bagian 4–5.

## 13. Risiko & Item Terbuka yang Perlu Klarifikasi

| No. | Item | Deskripsi | Dampak jika Tidak Diklarifikasi |
|---|---|---|---|
| 1 | **Ambang batas IPK pasti** | Contoh narasumber menyebut standar 3,0 (2,8 sudah SP1); pertanyaan interviewer sempat mencontohkan angka di bawah 2,75. Perlu konfirmasi angka resmi sesuai Surat Perjanjian KIP-K, dan apakah berlaku sama untuk seluruh angkatan/prodi. | Logika SP — fitur terpenting sistem — berisiko salah implementasi. |
| 2 | **Kepanjangan & struktur "BKKH"** | Disebut narasumber sebagai pihak approval Bebas Tanggungan; kepanjangan/posisi struktural pastinya tidak dijelaskan dalam wawancara dan tidak ditemukan pada sumber lain yang tersedia. | Alur approval (BR-12) berisiko salah *routing*/otorisasi. |
| 3 | **Bentuk akhir dokumen Bebas Tanggungan** | Dokumen digital yang dapat dicetak mahasiswa, atau sekadar perubahan status di sistem — pertanyaan diajukan namun tidak terjawab eksplisit dalam wawancara. | Desain fitur approval (HLR-F-24) belum dapat difinalisasi. |
| 4 | **Kewajiban kolom catatan penolakan dokumen** | Dijawab "bebas" oleh narasumber — belum ada keputusan final. | Desain form validasi dokumen (HLR-F-13) menunggu keputusan. |
| 5 | **Cakupan akses Warek 3 & pihak lain** | Baru sebatas "akan dikoordinasikan dengan USI/LSIPD"; belum ada kepastian hak akses langsung ke dashboard/sistem. | Modul hak akses (Bagian 4) berpotensi perlu direvisi pasca-koordinasi. |
| 6 | **Kriteria pembeda mahasiswa Reguler vs Aspirasi** | Disebut sebagai kategori pelaporan, namun definisi/kriteria pembeda tidak dijelaskan rinci dalam wawancara. | Struktur data & filter dashboard (HLR-F-08, HLR-F-30) memerlukan definisi pasti. |
| 7 | **Tenggat waktu unggahan dokumen non-akademik** | Hanya jadwal input nilai (IPK) yang eksplisit mengikuti kalender akademik; tenggat unggah sertifikat/dokumen lain tidak dijelaskan. | Berpotensi memengaruhi desain notifikasi/*reminder* sistem. |
| 8 | **Kepastian infrastruktur server/hosting** | Narasumber menyatakan akan dikoordinasikan dengan LSIPD; belum final saat wawancara. | **Risiko tertinggi terhadap target rilis ± 1 bulan** — perlu ditindaklanjuti segera. |
| 9 | **Detail teknis *bridging* ke sistem pendaftaran KIP eksisting** | Dibahas sebagai kemungkinan pengembangan lanjutan, tanpa keputusan teknis (protokol, format data, dsb.). | Tidak berdampak pada MVP, namun perlu direncanakan untuk roadmap fase lanjutan. |
| 10 | **Metrik keberhasilan kuantitatif (KPI)** | Kriteria sukses saat ini bersifat kualitatif ("integrasi data", "rekam jejak rapi"). | Sulit mengukur pencapaian tujuan proyek secara objektif pasca-rilis. |

## 14. Glosarium

| Istilah | Keterangan |
|---|---|
| **KIP-K / KIP Kuliah** | Kartu Indonesia Pintar Kuliah — program bantuan biaya pendidikan tinggi dari Pemerintah Indonesia bagi calon mahasiswa dari keluarga kurang mampu namun berprestasi. |
| **ITG** | Institut Teknologi Garut — perguruan tinggi swasta di Kabupaten Garut, Jawa Barat, pengembangan dari Sekolah Tinggi Teknologi Garut (STT-Garut). |
| **HLR** | High-Level Requirements — kebutuhan tingkat tinggi hasil elisitasi, sebelum diturunkan menjadi spesifikasi kebutuhan rinci (SRS). |
| **RAD** | Rapid Application Development — metodologi pengembangan perangkat lunak yang menekankan prototipe cepat dan iterasi konstruksi. |
| **SK** | Surat Keputusan — dokumen resmi penetapan, mis. SK Penetapan penerima KIP-K. |
| **IPK** | Indeks Prestasi Kumulatif — nilai rata-rata akademik kumulatif mahasiswa. |
| **SP** | Surat Peringatan — sanksi bertingkat (SP1, SP2, SP3) atas pelanggaran ketentuan KIP-K. |
| **MABIM** | Masa Bimbingan — kegiatan orientasi/pembinaan awal bagi mahasiswa baru. |
| **KKN** | Kuliah Kerja Nyata — program pengabdian masyarakat wajib bagi mahasiswa. |
| **KP** | Kerja Praktik — praktik kerja lapangan/magang mahasiswa. |
| **Bela Negara** | Program pelatihan wawasan kebangsaan/bela negara — salah satu kewajiban non-akademik mahasiswa KIP-K di ITG. |
| **Skripsi** | Tugas akhir jenjang sarjana (S1). |
| **SKPI** | Surat Keterangan Pendamping Ijazah — dokumen resmi pendamping ijazah yang merangkum capaian & pengalaman mahasiswa selama studi. |
| **Prodi** | Program Studi — unit akademik/jurusan (di ITG: Teknik Informatika, Teknik Industri, Teknik Sipil, Arsitektur, Sistem Informasi). |
| **Bebas Tanggungan** | Status/dokumen yang menyatakan mahasiswa tidak memiliki kewajiban tertunggak — syarat administratif sidang akhir. |
| **Sidang (Akhir)** | Ujian/sidang tugas akhir (skripsi) mahasiswa jenjang sarjana. |
| **NIM** | Nomor Induk Mahasiswa. |
| **Warek 3 / Wakil Rektor III** | Pimpinan struktural ITG untuk Bidang **Kemahasiswaan dan Kerja Sama**; pada proses ini berperan memberi approval akhir atas laporan evaluasi semester. |
| **USI** | Unit Sistem Informasi — nama unit teknologi informasi ITG pada masa institusi masih bernama STT-Garut. |
| **LSIPD** | Lembaga Sistem Informasi dan Pangkalan Data — unit yang saat ini mengelola infrastruktur teknologi informasi (jaringan, hardware, software) di lingkungan ITG; kemungkinan penerus/nama baru dari USI pasca-transformasi STT-Garut menjadi ITG. Narasumber menyebut kedua istilah ("USI atau LSIPD") sehingga kemungkinan merujuk unit yang sama. |
| **BKKH** | Disebut narasumber sebagai pihak pemberi approval Bebas Tanggungan. Kepanjangan dan posisi struktural resminya **tidak ditemukan** pada sumber yang tersedia — **perlu dikonfirmasi langsung** ke narasumber/institusi (Bagian 13, item 2). |
| **PMB** | Penerimaan Mahasiswa Baru — proses pendaftaran & seleksi calon mahasiswa baru, termasuk jalur KIP-K; secara eksplisit **di luar cakupan** sistem monitoring ini. |
| **SIAKAD** | Sistem Informasi Akademik — sistem akademik kampus yang telah ada; berpotensi menjadi target *bridging* pada fase lanjutan. |
| **BPK** | Badan Pemeriksa Keuangan — lembaga audit keuangan negara Republik Indonesia. |
| **Inspektorat** | Unit pengawasan internal pemerintah/institusi. |
| **Reguler vs Aspirasi** | Dua kategori kepesertaan mahasiswa KIP-K yang perlu direkap terpisah dalam pelaporan (kriteria pembeda perlu klarifikasi — lihat Bagian 13, item 6). |

## Lampiran A — Rangkuman Hasil Wawancara Sumber

*Disusun ulang secara ringkas per bagian untuk kebutuhan ketertelusuran. Jawaban telah dirapikan dari gaya dikte lisan tanpa mengubah substansi.*

### Bagian 1: Latar Belakang & Tujuan Bisnis
- **Kendala utama pengelolaan manual?** Data tercecer, tidak terpusat (termasuk SK); sulit ditelusuri saat pemeriksaan menyeluruh, mis. mencari SK angkatan 2021 atau status mahasiswa yang mengundurkan diri.
- **Tujuan utama aplikasi?** Mempermudah monitoring & evaluasi mahasiswa; memberi lembaga sumber data yang jelas; capaian mahasiswa lebih terkontrol.
- **Ukuran keberhasilan sistem?** Integrasi data dan rekam jejak.
- **Indikator evaluasi akademik tiap semester?** IPK, prestasi, keaktifan organisasi, dan informasi pribadi (termasuk penggunaan anggaran & permasalahan pribadi) — dinilai sangat penting.

### Bagian 2: Ruang Lingkup & Aturan Bisnis
- **Fitur MVP rilis pertama (angkatan 2026)?** Input IPK, prestasi, keaktifan organisasi.
- **Parameter sistem peringatan?** Mengikuti Surat Perjanjian KIP-K; peringatan muncul jika surat perjanjian dilanggar.
- **Kewajiban unggah dokumen non-akademik?** Wajib semuanya (MABIM, KKN, KP, dll.) — memudahkan mahasiswa saat sidang akhir, dan berfungsi sebagai arsip pribadi yang turut membantu penyusunan SKPI.

### Bagian 3: Pengguna Sistem & Hak Akses
- **Wewenang Prodi?** Hanya kontrol/viewer, tanpa validasi; melihat perkembangan mahasiswa di prodinya.
- **Otoritas approval bebas tanggungan?** Wajib approval dari pengelola KIP (Kemahasiswaan/"BKKH") sebelum sidang; melatarbelakangi karena pernah ada mahasiswa KIP yang belum lulus melewati 8 semester tanpa terdeteksi.
- **Aktor lain selain Kemahasiswaan, Prodi, Mahasiswa?** Akan dikoordinasikan dengan USI/LSIPD; kemungkinan aktor lain adalah Warek 3.

### Bagian 4: Manajemen Data & Ekosistem Teknis
- **Mekanisme data historis (angkatan sebelum 2026)?** Dilakukan di akhir, setelah sistem inti selesai; mahasiswa lama mengisi retroaktif saat login, dan/atau impor massal oleh Admin (Excel/Google Form). Mahasiswa dapat login & ubah password; hak hapus data hanya di Admin (dengan konfirmasi) untuk mencegah penyalahgunaan.
- **Standalone atau bridging ke SIAKAD/sistem pendaftaran existing?** Standalone dahulu; sistem pendaftaran existing hanya untuk pendaftaran & pengumuman (PMB), sengaja dipisah dari sistem monitoring. Titik mulai: mahasiswa sudah diterima, punya NIM & SK KIP.
- **Kesiapan infrastruktur server/hosting?** Akan dikoordinasikan dengan LSIPD.

### Bagian 5: Manajemen Proyek
- **Otoritas ACC perubahan selama fase konstruksi RAD?** Kemahasiswaan (Bpk. Encep).

### Pertanyaan Penggali (Probing Questions)

**1. Logika Evaluasi & Sistem Peringatan**
- Tingkatan SP & syarat eskalasi: SP1 (pelanggaran pertama atas Surat Perjanjian) → diberi 1 semester untuk perbaikan → SP2 (pelanggaran berulang/lain) → SP3 (pelanggaran terus berlanjut) → pemberhentian permanen. Contoh: standar IPK 3,0; turun ke 2,8 = SP1; jika membaik ke 3,0 = selesai; jika terus turun = dianggap tidak berkomitmen, diberhentikan.
- Pelanggaran dengan pemberhentian langsung: cuti akademik tanpa keterangan sakit (dilarang bagi penerima KIP-K).
- Masa tenggang: 1 semester setelah SP diterbitkan, sebelum eskalasi berikutnya.
- Pelanggaran non-akademik: SP diterbitkan manual oleh Admin melalui fitur khusus; muncul notifikasi (indikator merah) pada akun mahasiswa berikut alasannya.

**2. Manajemen Dokumen & Kewajiban**
- Jadwal unggah nilai: mengikuti kalender akademik, dibuka ± 2 minggu setelah UAS.
- Validasi dokumen: wajib satu per satu oleh Admin (status: menunggu validasi/disetujui/ditolak).
- Kolom catatan penolakan dokumen: bebas (opsional, tidak diwajibkan).

**3. Pelaporan & Dashboard Admin**
- Dashboard awal: sebaran total mahasiswa, per prodi, per angkatan, dan rekap reguler vs aspirasi (relevan untuk audit BPK/Inspektorat).
- Ekspor laporan: diperlukan (Excel/PDF), memuat nomor surat/kegiatan, rekap aktivitas/IPK/prestasi/masalah; alur approval: Kemahasiswaan susun & tanda tangan → Warek 3 approve → cetak final; laporan dapat difilter per semester dengan grafik riwayat IPK.

**4. Hak Akses & Persetujuan Akhir**
- Bentuk approval kelulusan sidang: pertanyaan diajukan, **tidak dijawab eksplisit** dalam wawancara.
- Hak unduh laporan oleh Prodi: **berhak** (dikonfirmasi ya).

---

## Riwayat Dokumen

| Versi | Tanggal | Deskripsi | Disusun oleh |
|---|---|---|---|
| 1.0 | 17 Agustus 2026 | Draf awal HLR hasil sintesis wawancara tanggal 13 Agustus 2026 | Tim Analis (dibantu Claude) |

**Status akhir:** Dokumen ini adalah hasil sintesis satu sesi wawancara dan **perlu divalidasi/disetujui** oleh narasumber (Bpk. Encep) serta pemangku kepentingan terkait — khususnya 10 item pada Bagian 13 — sebelum digunakan sebagai dasar desain sistem (SRS/desain rinci).
