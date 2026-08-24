/**
 * Mock data for MahasiswaDetail page
 * TODO: Replace with API calls once backend is ready
 */
import { GraduationCap, Shield, Star, Briefcase, Award, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export interface DokumenKewajiban {
  id: number;
  nama: string;
  icon: LucideIcon;
  status: "Disetujui" | "Menunggu" | "Ditolak" | "Belum Diunggah";
  tanggal: string | null;
  catatan: string | null;
}

export interface MockSP {
  nomor: string;
  tanggal: string;
  perihal: string;
  mahasiswa: { nama: string; nim: string; prodi: string; semester: number };
  alasan: string;
  body: string;
}

export const semesterDetails: SemesterDetail[] = [
  {
    semester: 1, tahun: "2022/2023 Ganjil", ipk: 3.2,
    mataKuliah: [
      { kode: "IF101", nama: "Pengantar Teknologi Informasi", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF102", nama: "Kalkulus", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF103", nama: "Pemrograman Dasar", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF104", nama: "Bahasa Inggris Teknik", sks: 2, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF105", nama: "Pendidikan Pancasila", sks: 2, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF205", nama: "Fisika Dasar", sks: 2, nilaiHuruf: "D", nilaiMutu: 1.0, lulus: false },
    ],
  },
  {
    semester: 2, tahun: "2022/2023 Genap", ipk: 3.45,
    mataKuliah: [
      { kode: "IF201", nama: "Pemrograman Berorientasi Objek", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF202", nama: "Aljabar Linear", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF203", nama: "Sistem Digital", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF204", nama: "Bahasa Indonesia", sks: 2, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF205", nama: "Fisika Dasar", sks: 2, nilaiHuruf: "D", nilaiMutu: 1.0, lulus: false },
    ],
  },
  {
    semester: 3, tahun: "2023/2024 Ganjil", ipk: 3.65,
    mataKuliah: [
      { kode: "IF301", nama: "Algoritma", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF302", nama: "Basis Data", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF303", nama: "Jarkom", sks: 2, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF304", nama: "Struktur Data", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF205", nama: "Fisika Dasar (Perbaikan)", sks: 2, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
    ],
  },
  {
    semester: 4, tahun: "2023/2024 Genap", ipk: 3.3,
    mataKuliah: [
      { kode: "IF301", nama: "Algoritma", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF302", nama: "Basis Data", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF303", nama: "Jarkom", sks: 2, nilaiHuruf: "D", nilaiMutu: 1.0, lulus: false },
      { kode: "IF304", nama: "Struktur Data", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF305", nama: "Matematika Diskrit", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
    ],
  },
  {
    semester: 5, tahun: "2024/2025 Ganjil", ipk: 3.1,
    mataKuliah: [
      { kode: "IF501", nama: "Kecerdasan Buatan", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF502", nama: "Rekayasa Perangkat Lunak", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF503", nama: "Jaringan Komputer (Perbaikan)", sks: 2, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF504", nama: "Pemrograman Web", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
    ],
  },
  {
    semester: 6, tahun: "2024/2025 Genap", ipk: 3.45,
    mataKuliah: [
      { kode: "IF601", nama: "Proyek Perangkat Lunak", sks: 4, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
      { kode: "IF602", nama: "Keamanan Jaringan", sks: 3, nilaiHuruf: "B", nilaiMutu: 3.0, lulus: true },
      { kode: "IF603", nama: "Basis Data Lanjut", sks: 3, nilaiHuruf: "A", nilaiMutu: 4.0, lulus: true },
    ],
  },
];

export const mkBelumLulus = [
  { kode: "IF303", nama: "Jaringan Komputer", sks: 2, nilai: "D", semesterAwal: 4, statusPerbaikan: "belum" as const },
  { kode: "IF205", nama: "Fisika Dasar", sks: 2, nilai: "D", semesterAwal: 2, statusPerbaikan: "lulus" as const, lulusDiSem: 5 },
];

export const mockPrestasiDetail = [
  {
    id: 1, tingkat: "Internasional" as const, nama: "Best Paper IEEE Conference",
    pencapaian: "Best Paper Award", penyelenggara: "IEEE Indonesia",
    tanggalMulai: "12 Mar 2026", tanggalSelesai: "14 Mar 2026",
    tempat: "Jakarta",
    deskripsi: "Kompetisi paper internasional yang diselenggarakan oleh IEEE Indonesia, diikuti peserta dari 15 negara.",
    linkPenyelenggara: "https://ieee.org",
    fileSertifikat: "sertifikat_ieee.pdf", fileFoto: "foto_ieee.jpg",
    status: "Disetujui" as const, catatanAdmin: null as string | null,
  },
  {
    id: 2, tingkat: "Nasional" as const, nama: "Juara 2 Hackathon Nasional",
    pencapaian: "Juara 2", penyelenggara: "Kemendikbud",
    tanggalMulai: "5 Jan 2026", tanggalSelesai: "7 Jan 2026",
    tempat: "Bandung",
    deskripsi: "Hackathon tingkat nasional yang diselenggarakan oleh Kemendikbud dengan tema Smart City.",
    linkPenyelenggara: "https://kemendikbud.go.id",
    fileSertifikat: "sertifikat_hackathon.pdf", fileFoto: "foto_hackathon.jpg",
    status: "Disetujui" as const, catatanAdmin: null as string | null,
  },
];

export const mockOrganisasiDetail = [
  {
    id: 1, nama: "BEM Institut Teknologi Garut", jabatan: "Ketua Departemen Pendidikan",
    periodeMulai: "September 2024", periodeSelesai: "September 2025",
    deskripsi: "Bertanggung jawab atas program pendidikan dan kaderisasi BEM ITG.",
    status: "Disetujui" as const,
  },
  {
    id: 2, nama: "Himpunan Mahasiswa Teknik Informatika", jabatan: "Sekretaris Umum",
    periodeMulai: "September 2025", periodeSelesai: "September 2026",
    deskripsi: "Mengelola administrasi dan dokumentasi himpunan.",
    status: "Disetujui" as const,
  },
];

export const mockPelatihanAkademikDetail = [
  {
    id: 1, nama: "Pelatihan Machine Learning Dasar", penyelenggara: "Google DSC ITG",
    tanggalMulai: "10 Agustus 2026", tanggalSelesai: "12 Agustus 2026",
    tempat: "Garut",
    deskripsi: "Pelatihan pengenalan machine learning menggunakan Python dan TensorFlow.",
    status: "Disetujui" as const,
  },
  {
    id: 2, nama: "Workshop Data Science", penyelenggara: "ITG & BPPT",
    tanggalMulai: "5 Juli 2026", tanggalSelesai: "6 Juli 2026",
    tempat: "Bandung",
    deskripsi: "Workshop intensif data science untuk mahasiswa IT.",
    status: "Disetujui" as const,
  },
];

export const mockPelatihanNonAkademikDetail = [
  {
    id: 3, nama: "Leadership Training", penyelenggara: "ITG Career Center",
    tanggalMulai: "20 Agustus 2025", tanggalSelesai: "22 Agustus 2025",
    tempat: "Garut",
    deskripsi: "Pelatihan kepemimpinan untuk pengurus organisasi mahasiswa.",
    status: "Disetujui" as const,
  },
];

export const dokumenKewajibanDetail: DokumenKewajiban[] = [
  { id: 1, nama: "PKKMB", icon: GraduationCap, status: "Disetujui", tanggal: "15 Sep 2022", catatan: null },
  { id: 2, nama: "Bela Negara", icon: Shield, status: "Disetujui", tanggal: "20 Nov 2022", catatan: null },
  { id: 3, nama: "MABIM", icon: Star, status: "Disetujui", tanggal: "10 Agu 2022", catatan: null },
  { id: 4, nama: "Berita Acara KP", icon: Briefcase, status: "Ditolak", tanggal: "5 Jul 2026", catatan: "File buram, mohon upload ulang." },
  { id: 5, nama: "Sertifikasi", icon: Award, status: "Menunggu", tanggal: "10 Agu 2026", catatan: null },
  { id: 6, nama: "Bukti Sidang Skripsi", icon: BookOpen, status: "Belum Diunggah", tanggal: null, catatan: null },
];

export const mockSPDetail: MockSP = {
  nomor: "001/SP/KIP-K/ITG/III/2026",
  tanggal: "15 Maret 2026",
  perihal: "Surat Peringatan Pertama (SP1) Penerima KIP-K",
  mahasiswa: { nama: "Ahmad Rifaldi", nim: "2206001", prodi: "Teknik Informatika", semester: 6 },
  alasan: "IPK turun dari 3.20 ke 2.78 pada Semester IV",
  body: `Dengan hormat, sehubungan dengan hasil evaluasi akademik Semester IV Tahun Akademik 2023/2024, kami sampaikan bahwa Saudara/i mengalami penurunan Indeks Prestasi Kumulatif (IPK) dari 3.20 menjadi 2.78, yang berada di bawah standar minimum yang ditetapkan untuk penerima beasiswa KIP-K sebesar 3.00.\n\nSehubungan dengan hal tersebut, kami memberikan Surat Peringatan Pertama (SP1) sebagai bentuk pembinaan akademik. Saudara/i diwajibkan untuk:\n1. Meningkatkan IPK minimal menjadi 3.00 pada Semester V\n2. Aktif berkonsultasi dengan Dosen Wali\n3. Melaporkan perkembangan akademik kepada Pengelola KIP-K\n\nApabila pada evaluasi Semester V IPK belum mencapai standar minimum, maka akan diterbitkan Surat Peringatan Kedua (SP2).`,
};

export const syaratPenyelesaian = [
  { nama: "IPK ≥ 3.00 pada semester akhir", terpenuhi: true },
  { nama: "Semua dokumen kewajiban lengkap", terpenuhi: false },
  { nama: "Tidak memiliki SP aktif", terpenuhi: true },
  { nama: "Laporan akhir penggunaan beasiswa", terpenuhi: false },
  { nama: "Surat keterangan lulus dari akademik", terpenuhi: false },
  { nama: "Bukti yudisium / wisuda", terpenuhi: false },
];
