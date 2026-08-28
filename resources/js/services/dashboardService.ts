import { api } from "./api";

export interface DashboardStats {
  total_aktif: number;
  reguler: number;
  aspirasi: number;
  mahasiswa_dicabut: number;
  dokumen_menunggu: number;
  bebas_tanggungan_pending: number;
  semester_lebih_8: number;
  sp_semester_ini: number;
}

export interface ChartData {
  name: string;
  Reguler: number;
  Aspirasi: number;
  Dicabut: number;
}

export interface SpAktifItem {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  sp: string;
  sisa: number;
}

export interface DokumenQueueItem {
  id: number;
  nim: string;
  nama: string;
  jenis: string;
  tanggal_upload: string;
  status: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  prodi_sebaran: ChartData[];
  angkatan_sebaran: ChartData[];
  sebaran_per_prodi_angkatan: Record<string, ChartData[]>;
  sp_aktif: SpAktifItem[];
  dokumen_queue: DokumenQueueItem[];
}

export const getAdminDashboardData = async (): Promise<DashboardResponse> => {
  return api.get<DashboardResponse>("/dashboard");
};

// Prodi Dashboard types
export interface ProdiSpItem {
  id: number;
  nim: string;
  nama: string;
  sp: string;
  alasan: string;
  sisa: number;
}

export interface ProdiSemester7Item {
  id: number;
  nim: string;
  nama: string;
  sem: number;
  ipk: number;
}

export interface ProdiTrendItem {
  sem: string;
  ipk: number;
}

export interface ProdiDashboardResponse {
  success: boolean;
  stats: {
    total_aktif: number;
    reguler: number;
    aspirasi: number;
    sp_aktif: number;
    ipk_di_bawah_standar: number;
    rata_ipk: number;
  };
  prodi: { id: number; nama: string };
  sebaran_angkatan: ChartData[];
  trend_ipk: ProdiTrendItem[];
  sp_mahasiswa: ProdiSpItem[];
  semester_7plus: ProdiSemester7Item[];
}

export const getProdiDashboardData = async (): Promise<ProdiDashboardResponse> => {
  return api.get<ProdiDashboardResponse>("/dashboard");
}

export interface DokumenStatusItem {
  id_jenis: number;
  nama: string;
  status: string;
  pesan: string | null;
}

export interface StudentDashboardResponse {
  success: boolean;
  mahasiswa: {
    id: number;
    nim: string;
    nama: string;
    prodi: string;
    angkatan: number;
    kategori: string;
    status: string;
  };
  akademik: {
    ipk_terakhir: number;
    ipk_delta: number | null;
    semester: number;
    ipk_minimum: number;
    status_ipk: string;
    sp_aktif: { level: string; status: string; deskripsi: string } | null;
  };
  dokumen: {
    total_wajib: number;
    total_disetujui: number;
    lengkap: boolean;
    list_status: DokumenStatusItem[];
  };
  kegiatan: {
    prestasi: number;
    organisasi: number;
    pelatihan: number;
  };
  periode: {
    aktif: boolean;
    batas_waktu: string | null;
  };
  bebas_tanggungan: { status: string } | null;
  ipk_chart: { semester: number; ipk: number }[];
}

export const getStudentDashboardData = async (): Promise<StudentDashboardResponse> => {
  return api.get<StudentDashboardResponse>("/dashboard");
};