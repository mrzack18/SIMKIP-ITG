/**
 * Mock data for DataAkademik page (admin view)
 * TODO: Replace with API calls once backend is ready
 */

// IPK override data per mahasiswa ID
export const ipkDataByMahasiswaId: Record<number, {
  ipk: number;
  delta: number;
  sem: number;
  mkBelumLulus: number;
  sp: string | null;
}> = {
  1: { ipk: 3.35, delta: 0.1,   sem: 7, mkBelumLulus: 0, sp: null },
  2: { ipk: 2.85, delta: -0.22, sem: 7, mkBelumLulus: 1, sp: "SP2" },
  3: { ipk: 3.12, delta: 0.05,  sem: 5, mkBelumLulus: 0, sp: "SP1" },
  4: { ipk: 3.45, delta: 0.15,  sem: 7, mkBelumLulus: 0, sp: null },
  5: { ipk: 3.78, delta: 0.2,   sem: 3, mkBelumLulus: 0, sp: null },
  6: { ipk: 3.92, delta: 0.08,  sem: 5, mkBelumLulus: 0, sp: null },
  7: { ipk: 2.95, delta: -0.1,  sem: 9, mkBelumLulus: 2, sp: "SP2" },
  8: { ipk: 2.7,  delta: -0.3,  sem: 5, mkBelumLulus: 2, sp: "SP3" },
  9: { ipk: 2.88, delta: -0.05, sem: 7, mkBelumLulus: 1, sp: "SP1" },
  10: { ipk: 3.2, delta: 0.12,  sem: 7, mkBelumLulus: 0, sp: null },
  11: { ipk: 3.55, delta: 0.18, sem: 5, mkBelumLulus: 0, sp: null },
  12: { ipk: 3.4,  delta: 0.02, sem: 7, mkBelumLulus: 0, sp: null },
};

export type PrestasiStatus = "Disetujui" | "Menunggu" | "Ditolak";
export type PrestasiTingkat = "Internasional" | "Nasional" | "Wilayah" | "Institusi";

export interface PrestasiDataAkademik {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kipk: string;
  namaPrestasi: string;
  tingkat: PrestasiTingkat;
  pencapaian: string;
  penyelenggara: string;
  tanggal: string;
  tempat: string;
  deskripsi: string;
  link: string;
  status: PrestasiStatus;
  catatan: string;
}

export const prestasiData: PrestasiDataAkademik[] = [
  {
    id: 1, nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", angkatan: 2022,
    kipk: "KIP-K Reguler", namaPrestasi: "Juara 2 Hackathon Nasional", tingkat: "Nasional",
    pencapaian: "Juara 2", penyelenggara: "Kemendikbud", tanggal: "5 – 7 Jan 2026", tempat: "Bandung",
    deskripsi: "Kompetisi hackathon tingkat nasional yang diselenggarakan oleh Kemendikbud, diikuti 200 tim dari seluruh Indonesia.",
    link: "https://kemendikbud.go.id", status: "Disetujui", catatan: "",
  },
  {
    id: 2, nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPrestasi: "Best Paper IEEE Conference", tingkat: "Internasional",
    pencapaian: "Best Paper", penyelenggara: "IEEE Indonesia", tanggal: "12 – 14 Mar 2026", tempat: "Jakarta",
    deskripsi: "Konferensi internasional IEEE yang membahas perkembangan teknologi informasi di Asia Tenggara.",
    link: "https://ieee.org", status: "Disetujui", catatan: "",
  },
  {
    id: 3, nim: "2303001", nama: "Budi Santoso", prodi: "Teknik Industri", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPrestasi: "Olimpiade Sains Jabar", tingkat: "Wilayah",
    pencapaian: "Juara 3", penyelenggara: "Diknas Jabar", tanggal: "20 Feb 2026", tempat: "Bandung",
    deskripsi: "Olimpiade sains tingkat wilayah Jawa Barat yang diselenggarakan oleh Dinas Pendidikan Jawa Barat.",
    link: "https://diknas.jabarprov.go.id", status: "Menunggu", catatan: "",
  },
  {
    id: 4, nim: "2306001", nama: "Krisna Bayu", prodi: "Teknik Informatika", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPrestasi: "Juara 1 App Developer Championship", tingkat: "Nasional",
    pencapaian: "Juara 1", penyelenggara: "Microsoft Indonesia", tanggal: "10 Apr 2026", tempat: "Jakarta",
    deskripsi: "Kompetisi pengembangan aplikasi yang diadakan Microsoft Indonesia, diikuti lebih dari 500 peserta.",
    link: "https://microsoft.com/id", status: "Disetujui", catatan: "",
  },
  {
    id: 5, nim: "2220001", nama: "Lena Pertiwi", prodi: "Arsitektur", angkatan: 2022,
    kipk: "KIP-K Aspirasi", namaPrestasi: "Best Design Award ARCH EXPO", tingkat: "Nasional",
    pencapaian: "Best Design", penyelenggara: "IAI Jabar", tanggal: "15 May 2026", tempat: "Bandung",
    deskripsi: "Pameran arsitektur nasional yang diselenggarakan oleh Ikatan Arsitek Indonesia wilayah Jawa Barat.",
    link: "https://iai.or.id", status: "Menunggu", catatan: "",
  },
];

export interface OrganisasiDataAkademik {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kipk: string;
  organisasi: string;
  jabatan: string;
  periodeMulai: string;
  periodeSelesai: string;
  periode: string;
  deskripsi: string;
  status: "Disetujui" | "Menunggu" | "Ditolak";
  catatan: string;
}

export const organisasiData: OrganisasiDataAkademik[] = [
  {
    id: 1, nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", angkatan: 2022,
    kipk: "KIP-K Reguler", organisasi: "Himpunan Mahasiswa Teknik Informatika (HMTI)",
    jabatan: "Ketua Umum", periodeMulai: "September 2024", periodeSelesai: "September 2026",
    periode: "Sep 2024 – Sep 2026",
    deskripsi: "Memimpin himpunan mahasiswa Teknik Informatika, mengoordinasikan program kerja, dan menjadi penghubung antara mahasiswa dengan pihak program studi.",
    status: "Disetujui", catatan: "",
  },
  {
    id: 2, nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", angkatan: 2023,
    kipk: "KIP-K Reguler", organisasi: "Badan Eksekutif Mahasiswa (BEM) ITG",
    jabatan: "Wakil Sekretaris Jenderal", periodeMulai: "Januari 2025", periodeSelesai: "Januari 2027",
    periode: "Jan 2025 – Jan 2027",
    deskripsi: "Membantu Sekretaris Jenderal dalam mengelola administrasi, korespondensi, dan dokumentasi kegiatan BEM ITG.",
    status: "Disetujui", catatan: "",
  },
  {
    id: 3, nim: "2420001", nama: "Deni Kurniawan", prodi: "Arsitektur", angkatan: 2024,
    kipk: "KIP-K Aspirasi", organisasi: "Unit Kegiatan Mahasiswa Islam (UKMI)",
    jabatan: "Anggota Departemen Dakwah", periodeMulai: "Maret 2025", periodeSelesai: "Maret 2026",
    periode: "Mar 2025 – Mar 2026",
    deskripsi: "Berpartisipasi aktif dalam kegiatan dakwah dan kajian Islam yang diselenggarakan UKMI ITG.",
    status: "Menunggu", catatan: "",
  },
];

export interface PelatihanDataAkademik {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kipk: string;
  namaPelatihan: string;
  jenis: "Akademik" | "Non-Akademik";
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tanggal: string;
  tempat: string;
  deskripsi: string;
  status: "Disetujui" | "Menunggu" | "Ditolak";
}

export const pelatihanAkademikData: PelatihanDataAkademik[] = [
  {
    id: 1, nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", angkatan: 2022,
    kipk: "KIP-K Reguler", namaPelatihan: "Workshop Machine Learning dengan TensorFlow",
    jenis: "Akademik", penyelenggara: "Google Developer Student Clubs ITG",
    tanggalMulai: "10 November 2025", tanggalSelesai: "12 November 2025", tanggal: "10–12 Nov 2025",
    tempat: "Aula Kampus ITG, Garut",
    deskripsi: "Pelatihan intensif pengenalan machine learning menggunakan Python dan TensorFlow, mencakup supervised learning, unsupervised learning, dan implementasi model prediktif.",
    status: "Disetujui",
  },
  {
    id: 2, nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPelatihan: "Seminar AI for Healthcare",
    jenis: "Akademik", penyelenggara: "IEEE Indonesia Section",
    tanggalMulai: "5 November 2025", tanggalSelesai: "5 November 2025", tanggal: "5 Nov 2025",
    tempat: "Hotel Savoy Homann, Bandung",
    deskripsi: "Seminar internasional yang membahas penerapan kecerdasan buatan dan machine learning di bidang layanan kesehatan, dihadiri oleh akademisi dan praktisi dari seluruh Indonesia.",
    status: "Disetujui",
  },
];

export const pelatihanNonAkademikData: PelatihanDataAkademik[] = [
  {
    id: 3, nim: "2303001", nama: "Budi Santoso", prodi: "Teknik Industri", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPelatihan: "Pelatihan Kepemimpinan Nasional Pemuda",
    jenis: "Non-Akademik", penyelenggara: "Kementerian Pemuda dan Olahraga RI",
    tanggalMulai: "5 Agustus 2025", tanggalSelesai: "9 Agustus 2025", tanggal: "5–9 Agu 2025",
    tempat: "Balai Pelatihan Nasional, Jakarta",
    deskripsi: "Program pengembangan kepemimpinan bagi mahasiswa penerima beasiswa KIP-K tingkat nasional. Materi meliputi kepemimpinan transformasional, manajemen konflik, dan pengembangan karakter.",
    status: "Disetujui",
  },
  {
    id: 4, nim: "2306001", nama: "Krisna Bayu", prodi: "Teknik Informatika", angkatan: 2023,
    kipk: "KIP-K Reguler", namaPelatihan: "Public Speaking & Presentation Skills Workshop",
    jenis: "Non-Akademik", penyelenggara: "Toastmasters International — Garut Club",
    tanggalMulai: "20 Juli 2025", tanggalSelesai: "20 Juli 2025", tanggal: "20 Jul 2025",
    tempat: "Ruang Serbaguna ITG, Garut",
    deskripsi: "Workshop satu hari yang berfokus pada teknik berbicara di depan umum, penyampaian presentasi yang efektif, dan pengelolaan rasa percaya diri.",
    status: "Menunggu",
  },
];

// Options for filter selects
export const prodiOptions = ["Semua", "Teknik Informatika", "Sistem Informasi", "Teknik Industri", "Teknik Sipil", "Arsitektur"];
export const angkatanOptions = ["Semua", "2021", "2022", "2023", "2024"];
export const kipkOptions = ["Semua", "KIP-K Reguler", "KIP-K Aspirasi"];
