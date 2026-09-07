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

// ─── Tahun Ajaran CRUD ────────────────────────────────────────────

export interface TahunAjaranItem {
  id: number;
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif: boolean;
}

export async function getTahunAjaranList(): Promise<TahunAjaranItem[]> {
  const res = await api.get<{ success: boolean; data: TahunAjaranItem[] }>("/konfigurasi/tahun-ajaran");
  return res.data ?? [];
}

export async function createTahunAjaran(input: {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif?: boolean;
}): Promise<TahunAjaranItem> {
  const res = await api.post<{ success: boolean; data: TahunAjaranItem }>("/konfigurasi/tahun-ajaran", input);
  return res.data;
}

export async function updateTahunAjaran(id: number, input: {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  is_aktif?: boolean;
}): Promise<TahunAjaranItem> {
  const res = await api.put<{ success: boolean; data: TahunAjaranItem }>(`/konfigurasi/tahun-ajaran/${id}`, input);
  return res.data;
}

export async function deleteTahunAjaran(id: number): Promise<void> {
  await api.delete(`/konfigurasi/tahun-ajaran/${id}`);
}

export async function activateTahunAjaran(id: number): Promise<TahunAjaranItem> {
  const res = await api.patch<{ success: boolean; data: TahunAjaranItem }>(`/konfigurasi/tahun-ajaran/${id}/activate`);
  return res.data;
}

// ─── Periode Akademik CRUD ────────────────────────────────────────────

export interface PeriodeCreateInput {
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  tanggal_buka: string;
  tanggal_tutup: string;
  is_aktif?: boolean;
}

export async function getPeriodeList(): Promise<PeriodeItem[]> {
  const res = await api.get<{ success: boolean; data: PeriodeItem[] }>("/konfigurasi/periode-akademik");
  return res.data ?? [];
}

export async function createPeriode(input: PeriodeCreateInput): Promise<PeriodeItem> {
  const res = await api.post<{ success: boolean; data: PeriodeItem }>("/konfigurasi/periode-akademik", input);
  return res.data;
}

export async function updatePeriode(id: number, input: Partial<PeriodeCreateInput>): Promise<PeriodeItem> {
  const res = await api.put<{ success: boolean; data: PeriodeItem }>(`/konfigurasi/periode-akademik/${id}`, input);
  return res.data;
}

export async function deletePeriode(id: number): Promise<void> {
  await api.delete(`/konfigurasi/periode-akademik/${id}`);
}

export async function activatePeriode(id: number): Promise<PeriodeItem> {
  const res = await api.patch<{ success: boolean; data: PeriodeItem }>(`/konfigurasi/periode-akademik/${id}/activate`);
  return res.data;
}
