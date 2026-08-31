export const mahasiswaList = [
  { id: 1, nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Reguler", status: "Aktif", ipk: 3.45, semester: 6, sp: null },
  { id: 2, nim: "2206002", nama: "Sari Dewi Lestari", prodi: "Teknik Informatika", angkatan: 2022, kategori: "Aspirasi", status: "Aktif", ipk: 2.78, semester: 6, sp: "SP1" },
  { id: 3, nim: "2303001", nama: "Budi Santoso", prodi: "Teknik Industri", angkatan: 2023, kategori: "Reguler", status: "Aktif", ipk: 3.62, semester: 4, sp: null },
  { id: 4, nim: "2211001", nama: "Rina Marlina", prodi: "Teknik Sipil", angkatan: 2022, kategori: "Reguler", status: "Aktif", ipk: 3.10, semester: 6, sp: null },
  { id: 5, nim: "2420001", nama: "Deni Kurniawan", prodi: "Arsitektur", angkatan: 2024, kategori: "Aspirasi", status: "Aktif", ipk: 2.65, semester: 2, sp: "SP1" },
  { id: 6, nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", angkatan: 2023, kategori: "Reguler", status: "Aktif", ipk: 3.78, semester: 4, sp: null },
  { id: 7, nim: "2106001", nama: "Gunawan Prakoso", prodi: "Teknik Informatika", angkatan: 2021, kategori: "Reguler", status: "Aktif", ipk: 2.90, semester: 8, sp: "SP2" },
  { id: 8, nim: "2303002", nama: "Hesti Rahayu", prodi: "Teknik Industri", angkatan: 2023, kategori: "Aspirasi", status: "Aktif", ipk: 3.25, semester: 4, sp: null },
  { id: 9, nim: "2211002", nama: "Indra Permana", prodi: "Teknik Sipil", angkatan: 2022, kategori: "Reguler", status: "Dicabut", ipk: 2.40, semester: 5, sp: "SP3" },
  { id: 10, nim: "2207001", nama: "Juwita Ramadhani", prodi: "Sistem Informasi", angkatan: 2022, kategori: "Aspirasi", status: "Aktif", ipk: 3.55, semester: 6, sp: null },
  { id: 11, nim: "2306001", nama: "Krisna Bayu", prodi: "Teknik Informatika", angkatan: 2023, kategori: "Reguler", status: "Aktif", ipk: 3.32, semester: 4, sp: null },
  { id: 12, nim: "2220001", nama: "Lena Pertiwi", prodi: "Arsitektur", angkatan: 2022, kategori: "Aspirasi", status: "Aktif", ipk: 3.48, semester: 6, sp: null },
];

export const dokumenQueue = [
  { id: 1, nim: "2206002", nama: "Sari Dewi Lestari", prodi: "Teknik Informatika", jenis: "Sertifikat KKN", tanggalUpload: "2026-08-15T08:30:00", status: "Menunggu" },
  { id: 2, nim: "2420001", nama: "Deni Kurniawan", prodi: "Arsitektur", jenis: "Sertifikat MABIM", tanggalUpload: "2026-08-15T10:15:00", status: "Menunggu" },
  { id: 3, nim: "2206001", nama: "Ahmad Rifaldi", prodi: "Teknik Informatika", jenis: "Bukti Keaktifan Organisasi", tanggalUpload: "2026-08-14T14:20:00", status: "Menunggu" },
  { id: 4, nim: "2303002", nama: "Hesti Rahayu", prodi: "Teknik Industri", jenis: "Sertifikat Bela Negara", tanggalUpload: "2026-08-14T09:45:00", status: "Menunggu" },
  { id: 5, nim: "2307001", nama: "Fitriyani Hasanah", prodi: "Sistem Informasi", jenis: "Sertifikat Prestasi Nasional", tanggalUpload: "2026-08-13T16:00:00", status: "Menunggu" },
  { id: 6, nim: "2303001", nama: "Budi Santoso", prodi: "Teknik Industri", jenis: "Laporan Kerja Praktik", tanggalUpload: "2026-08-13T11:30:00", status: "Disetujui" },
  { id: 7, nim: "2207001", nama: "Juwita Ramadhani", prodi: "Sistem Informasi", jenis: "Sertifikat MABIM", tanggalUpload: "2026-08-12T09:00:00", status: "Ditolak" },
];

export const spList = [
  { id: 1, nim: "2206002", nama: "Sari Dewi Lestari", prodi: "Teknik Informatika", angkatan: 2022, level: "SP1", alasan: "IPK semester 5 di bawah standar minimum (2.78 < 3.0)", tanggalTerbit: "2026-03-15", batasEvaluasi: "2026-09-15", status: "Aktif", sisa: 29 },
  { id: 2, nim: "2420001", nama: "Deni Kurniawan", prodi: "Arsitektur", angkatan: 2024, level: "SP1", alasan: "IPK semester 1 di bawah standar minimum (2.65 < 3.0)", tanggalTerbit: "2026-03-15", batasEvaluasi: "2026-09-15", status: "Aktif", sisa: 29 },
  { id: 3, nim: "2106001", nama: "Gunawan Prakoso", prodi: "Teknik Informatika", angkatan: 2021, level: "SP2", alasan: "IPK tetap di bawah standar setelah SP1 (2.90 < 3.0)", tanggalTerbit: "2026-03-01", batasEvaluasi: "2026-09-01", status: "Masa Tenggang", sisa: 15 },
  { id: 4, nim: "2211002", nama: "Indra Permana", prodi: "Teknik Sipil", angkatan: 2022, level: "SP3", alasan: "IPK tidak membaik setelah SP2, pemberhentian KIP-K", tanggalTerbit: "2026-02-01", batasEvaluasi: "-", status: "Pemberhentian", sisa: 0 },
];

export const ipkHistory = [
  { semester: 1, tahun: "2022/2023 Ganjil", ipk: 3.20, status: "Di atas standar" },
  { semester: 2, tahun: "2022/2023 Genap", ipk: 3.45, status: "Di atas standar" },
  { semester: 3, tahun: "2023/2024 Ganjil", ipk: 3.65, status: "Di atas standar" },
  { semester: 4, tahun: "2023/2024 Genap", ipk: 2.78, status: "Di bawah standar" },
  { semester: 5, tahun: "2024/2025 Ganjil", ipk: 3.10, status: "Di atas standar" },
  { semester: 6, tahun: "2024/2025 Genap", ipk: 3.45, status: "Di atas standar" },
];

export const prodiStats = [
  { name: "Teknik Informatika", total: 42, reguler: 28, aspirasi: 14 },
  { name: "Teknik Industri", total: 35, reguler: 22, aspirasi: 13 },
  { name: "Teknik Sipil", total: 31, reguler: 20, aspirasi: 11 },
  { name: "Arsitektur", total: 28, reguler: 17, aspirasi: 11 },
  { name: "Sistem Informasi", total: 31, reguler: 15, aspirasi: 16 },
];

export const angkatanStats = [
  { angkatan: "2022", reguler: 38, aspirasi: 24 },
  { angkatan: "2023", reguler: 31, aspirasi: 19 },
  { angkatan: "2024", reguler: 22, aspirasi: 14 },
  { angkatan: "2025", reguler: 8, aspirasi: 5 },
  { angkatan: "2026", reguler: 3, aspirasi: 3 },
];

export const spHistoryData = [
  { level: "SP1", tahunAjaran: "2023/2024 Genap", alasan: "IPK turun menjadi 2.78", tanggal: "15 Maret 2024" },
  { level: "SP2", tahunAjaran: "2024/2025 Ganjil", alasan: "Belum ada perbaikan IPK", tanggal: "15 September 2024" }
];

export const kendalaList = [
  { id: 1, tahunAjaran: "2023/2024 Genap", kategori: "Akademik", deskripsi: "Kesulitan dalam mata kuliah pemrograman", tanggal: "10 April 2024" }
];