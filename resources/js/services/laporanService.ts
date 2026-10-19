/**
 * Laporan Service
 */
import type { Laporan } from "@/types";
import type { PaginatedResponse } from "@/types";
import { api, API_BASE_URL } from "./api";

function normalizePagination<T>(raw: any): PaginatedResponse<T> {
  return {
    data: raw?.data ?? [],
    total: raw?.total ?? 0,
    page: raw?.page ?? 1,
    limit: raw?.limit ?? 10,
    totalPages: raw?.totalPages ?? raw?.total_pages ?? 1,
  };
}

export interface LaporanFilter {
  search?: string;
  status?: string;
  tahunAkademik?: string;
  semester?: string;
  prodi?: string;
  angkatan?: string;
  cakupan?: string;
  page?: number;
  limit?: number;
}

type LaporanApiResponse = {
  success: boolean;
  data: Laporan[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export async function getLaporanList(filter: LaporanFilter = {}): Promise<PaginatedResponse<Laporan>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const res = await api.get<LaporanApiResponse>(`/laporan?${params.toString()}`);
  return normalizePagination<Laporan>(res);
}

export interface LaporanStatistics {
  totalMahasiswa: number;
  kipk: {
    reguler: { total: number; persen: number };
    aspirasi: { total: number; persen: number };
  };
  rataIpk: number | null;
  distribusiAngkatan: { angkatan: string; total: number }[];
  ipkTrend: { semester: string; ipk: number }[];
}

export interface LaporanDetailResponse {
  success: boolean;
  data: Laporan;
  statistics: LaporanStatistics;
}

export interface LaporanPreviewStatistics {
  success: boolean;
  total_mahasiswa: number;
  total_reguler: number;
  total_aspirasi: number;
  rata_ipk: number | null;
  distribusi_angkatan: { angkatan: string; total: number }[];
  ipk_trend: { semester: string; ipk: number }[];
  ipk_distribution: { range: string; count: number }[];
  mahasiswa: {
    id: number;
    nim: string;
    nama: string;
    prodi: string;
    angkatan: number;
    ipk: number;
    sp: string | null;
    status: string;
    kategori: string;
  }[];
  total_sp: number;
  nama_sp: string[];
  total_prestasi: number;
  nama_prestasi: string[];
  jenis: LaporanJenis;
  columns: Record<string, string>;
  rows: Record<string, string | number>[];
  total_rows: number;
}

export async function getPreviewStatistics(cakupan: string, angkatan?: string, prodi?: string, jenis: LaporanJenis = "akademik"): Promise<LaporanPreviewStatistics> {
  const params = new URLSearchParams({ cakupan, jenis });
  if (angkatan) params.append('angkatan', angkatan);
  if (prodi) params.append('prodi', prodi);
  const res = await api.get<LaporanPreviewStatistics>(`/laporan/preview-statistics?${params.toString()}`);
  return res;
}

export async function getLaporanById(id: number): Promise<{
  laporan: Laporan | null;
  statistics: LaporanStatistics | null;
}> {
  const res = await api.get<LaporanDetailResponse>(`/laporan/${id}`);
  if (!res.data) return { laporan: null, statistics: null };
  return { laporan: res.data, statistics: res.data.statistics };
}

export type LaporanJenis = "akademik" | "organisasi" | "prestasi";

export interface CreateLaporanPayload {
  judul: string;
  tahunAkademik: string;
  semester: "Ganjil" | "Genap";
  tanggalLaporan: string;
  catatanLaporan?: string;
  cakupan?: string;
  jenis?: LaporanJenis;
  angkatan?: string;
  prodi?: string;
  tujuanWarek?: boolean;
  tujuanProdi?: boolean;
}

export async function createLaporan(payload: CreateLaporanPayload): Promise<Laporan> {
  const body = {
    judul: payload.judul,
    tahun_akademik: payload.tahunAkademik,
    semester: payload.semester,
    tanggal_laporan: payload.tanggalLaporan,
    catatan_laporan: payload.catatanLaporan,
    cakupan: payload.cakupan,
    jenis: payload.jenis,
    angkatan: payload.angkatan,
    prodi: payload.prodi,
    tujuan_warek: payload.tujuanWarek,
    tujuan_prodi: payload.tujuanProdi,
  };
  const res = await api.post<{ success: boolean; laporan: Laporan }>("/laporan", body);
  return res.laporan;
}

export async function updateLaporan(id: number, payload: Partial<CreateLaporanPayload>): Promise<Laporan> {
  const body = payload ? {
    ...(payload.judul !== undefined && { judul: payload.judul }),
    ...(payload.tahunAkademik !== undefined && { tahun_akademik: payload.tahunAkademik }),
    ...(payload.semester !== undefined && { semester: payload.semester }),
    ...(payload.tanggalLaporan !== undefined && { tanggal_laporan: payload.tanggalLaporan }),
    ...(payload.catatanLaporan !== undefined && { catatan_laporan: payload.catatanLaporan }),
    ...(payload.cakupan !== undefined && { cakupan: payload.cakupan }),
    ...(payload.angkatan !== undefined && { angkatan: payload.angkatan }),
    ...(payload.prodi !== undefined && { prodi: payload.prodi }),
    ...(payload.tujuanWarek !== undefined && { tujuan_warek: payload.tujuanWarek }),
    ...(payload.tujuanProdi !== undefined && { tujuan_prodi: payload.tujuanProdi }),
  } : {};
  const res = await api.put<{ success: boolean; laporan: Laporan }>(`/laporan/${id}`, body);
  return res.laporan;
}

export async function submitLaporan(id: number): Promise<void> {
  await api.patch(`/laporan/${id}/submit`, {});
}

export async function approveLaporan(id: number): Promise<void> {
  await api.patch(`/laporan/${id}/approve`, {});
}

export async function rejectLaporan(id: number, catatan: string): Promise<void> {
  await api.patch(`/laporan/${id}/return`, { catatan });
}

async function fetchLaporanPdf(id: number): Promise<{ blob: Blob; filename: string }> {
  const token = localStorage.getItem("simkip_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["X-Requested-With"] = "XMLHttpRequest";
  headers["Accept"] = "application/pdf";

  const response = await fetch(`${API_BASE_URL}/laporan/${id}/pdf`, { method: "GET", headers });
  if (!response.ok) throw new Error(`Gagal memuat PDF (HTTP ${response.status})`);

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  let filename = `Laporan_${id}.pdf`;
  const match = disposition?.match(/filename="?([^";\s]+)"?/);
  if (match?.[1]) filename = match[1];
  return { blob, filename };
}

export async function downloadLaporanPdf(id: number): Promise<void> {
  const { blob, filename } = await fetchLaporanPdf(id);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function previewLaporanPdf(id: number): Promise<void> {
  const win = window.open("about:blank", "_blank");
  try {
    const { blob } = await fetchLaporanPdf(id);
    const url = window.URL.createObjectURL(blob);
    if (win) win.location.href = url;
    else window.open(url, "_blank");
  } catch (err) {
    win?.close();
    throw err;
  }
}
