import { api } from "./api";

export interface DokumenJenisItem {
  id: number;
  nama: string;
  kode: string | null;
  deskripsi: string | null;
  is_wajib: boolean;
  urutan: number;
}

export interface SignatureConfig {
  pengelola_nama: string;
  pengelola_nip: string;
  warek_nama: string;
  warek_nip: string;
}

export interface InstitusiConfig {
  nama: string;
  alamat: string;
  telp: string;
}

export interface RegulasiItem {
  id: number;
  nama: string;
  deskripsi: string;
  nilai: string;
  tipe: string;
  aktif: boolean;
}

export interface PeriodeItem {
  id: number;
  tahun_akademik: string;
  semester: string;
  tanggal_buka: string;
  tanggal_tutup: string;
  is_aktif: boolean;
}

interface KonfigurasiAllData {
  institusi: InstitusiConfig;
  signature: SignatureConfig;
  regulasi: RegulasiItem[];
  nilai_mutu: any[];
  jenis_pelanggaran: any[];
  periode_history: PeriodeItem[];
  prodis: any[];
  dokumens: DokumenJenisItem[];
}

interface KonfigurasiAllResponse {
  success: boolean;
  data: KonfigurasiAllData;
}

export async function getKonfigurasiAll(): Promise<KonfigurasiAllResponse> {
  return api.get<KonfigurasiAllResponse>("/admin/konfigurasi/all");
}

export async function getDokumenJenisList(): Promise<DokumenJenisItem[]> {
  const res = await api.get<{ success: boolean; data: DokumenJenisItem[] }>("/admin/konfigurasi/dokumen-jenis");
  return res.data ?? [];
}

export interface PelanggaranItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  eskalasi: string;
  aktif: boolean;
}

export async function getPelanggaranList(): Promise<PelanggaranItem[]> {
  const res = await api.get<{ success: boolean; data: PelanggaranItem[] }>("/konfigurasi/pelanggaran");
  return res.data ?? [];
}
