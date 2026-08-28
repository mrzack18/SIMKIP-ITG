/**
 * Laporan Service
 */
import type { Laporan } from "@/types";
import type { PaginatedResponse } from "@/types";
import { api } from "./api";

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
  totalMahasiswa: number;
  kipk: {
    reguler: { total: number; persen: number };
    aspirasi: { total: number; persen: number };
  };
  rataIpk: number | null;
  distribusiAngkatan: { angkatan: string; total: number }[];
  ipkTrend: { semester: string; ipk: number }[];
  ipkBuckets: { range: string; count: number }[];
  mahasiswas: {
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
}

export async function getPreviewStatistics(cakupan: string, angkatan?: string, prodi?: string): Promise<LaporanPreviewStatistics> {
  const params = new URLSearchParams({ cakupan });
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

export interface CreateLaporanPayload {
  judul: string;
  tahunAkademik: string;
  semester: "Ganjil" | "Genap";
  tanggalLaporan: string;
  catatanLaporan?: string;
  cakupan?: string;
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
