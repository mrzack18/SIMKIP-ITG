// Role types
export type Role = "admin" | "mahasiswa" | "prodi" | "warek";

export interface UserSession {
  id?: string;
  nama: string;
  nim?: string;
  role: Role;
  prodi?: string;
}

// Mahasiswa
export type MahasiswaKategori = "Reguler" | "Aspirasi";
export type MahasiswaStatus = "Aktif" | "Dicabut" | "Lulus" | "Cuti";
export type SPLevel = "SP1" | "SP2" | "SP3" | null;

export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  kategori: MahasiswaKategori;
  status: MahasiswaStatus;
  ipk: number;
  semester: number;
  sp: string | null;
}

// Dokumen
export type DokumenStatus = "Menunggu" | "Disetujui" | "Ditolak";
export type DokumenJenis =
  | "Sertifikat PKKMB"
  | "Sertifikat MABIM"
  | "SK Organisasi"
  | "Sertifikat Prestasi"
  | "Sertifikat Pelatihan"
  | "Berita Acara Kerja Praktik"
  | "Bukti Sidang Skripsi"
  | string;

export interface DokumenQueue {
  id: string | number;
  nim: string;
  nama: string;
  prodi: string;
  jenis: string;
  tanggalUpload: string;
  status: DokumenStatus;
}

// Surat Peringatan
export type SPStatus = "Aktif" | "Masa Tenggang" | "Pemberhentian" | "Selesai";

export interface SuratPeringatan {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  level: "SP1" | "SP2" | "SP3";
  alasan: string;
  tanggalTerbit: string;
  batasEvaluasi: string | null;
  status: SPStatus;
  sisa: number;
}

// IPK
export interface IPKHistory {
  semester: number;
  tahun: string;
  ipk: number;
  status: string;
}

// Mata Kuliah
export interface MataKuliah {
  kode: string;
  nama: string;
  sks: number;
  nilaiHuruf: string;
  nilaiMutu: number;
  lulus: boolean;
}

export interface SemesterDetail {
  semester: number;
  tahun: string;
  ipk: number;
  mataKuliah: MataKuliah[];
}

// Prestasi
export type PrestasiTingkat = "Internasional" | "Nasional" | "Wilayah" | "Institusi";
export type PrestasiStatus = "Disetujui" | "Menunggu Validasi" | "Menunggu" | "Ditolak";

export interface Prestasi {
  id: number;
  nim?: string;
  nama?: string;
  prodi?: string;
  angkatan?: number;
  kipk?: string;
  tab?: PrestasiTingkat;
  namaPrestasi: string;
  tingkat: PrestasiTingkat;
  pencapaian: string;
  penyelenggara: string;
  tanggal?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  tempat: string;
  deskripsi: string;
  link?: string;
  linkPenyelenggara?: string;
  fileSertifikat?: string;
  fileFoto?: string;
  status: PrestasiStatus;
  catatan?: string;
  catatanAdmin?: string;
}

// Organisasi
export type OrganisasiStatus = "Disetujui" | "Menunggu" | "Ditolak";

export interface Organisasi {
  id: number;
  nama: string;
  jenis?: string;
  jabatan: string;
  mulai: string;
  selesai: string;
  deskripsi: string;
  status: OrganisasiStatus;
  catatanAdmin?: string;
  fileSk?: string;
  fotoKegiatan?: string;
}

// Pelatihan
export type PelatihanStatus = "Disetujui" | "Menunggu" | "Ditolak";

export interface Pelatihan {
  id: number;
  nama: string;
  jenis: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  deskripsi: string;
  sertifikat?: string;
  fotoKegiatan?: string;
  status: PelatihanStatus;
  catatanAdmin?: string;
}

// Bebas Tanggungan
export type BebasTanggunganStatus = "Menunggu" | "Diproses" | "Disetujui" | "Ditolak";

export interface BebasTanggungan {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  tanggalPermohonan: string;
  status: BebasTanggunganStatus;
  keterangan?: string;
}

// Laporan
export type LaporanStatus = "Draft" | "Diajukan" | "Disetujui" | "Ditolak";

export interface Laporan {
  id: number;
  judul: string;
  periode: string;
  semester: string;
  tanggalBuat: string;
  tanggalAjukan?: string;
  status: LaporanStatus;
  dibuat?: string;
  catatan?: string;
}

// Prodi/Angkatan stats
export interface ProdiStats {
  name: string;
  total: number;
  reguler: number;
  aspirasi: number;
}

export interface AngkatanStats {
  angkatan: string;
  reguler: number;
  aspirasi: number;
}

// Audit Log
export interface AuditLog {
  id: number;
  waktu: string;
  user: string;
  role: string;
  aksi: string;
  detail: string;
  ip?: string;
}

// API response wrapper (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
