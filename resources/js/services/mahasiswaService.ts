/**
 * Mahasiswa Service — handles CRUD and sub-resource fetching for mahasiswa.
 */
import type { Mahasiswa, PaginatedResponse, ApiResponse } from "@/types";
import { api } from "./api";
import { useAuth } from "@/context/AuthContext";

export interface MahasiswaFilter {
  search?: string;
  prodi?: string;
  angkatan?: string;
  tahun_ajaran?: string;
  kategori?: string;
  status?: string;
  page?: number;
  limit?: number;
  kipFilter?: string;
  spFilter?: string;
  ipkFilter?: string;
  sortBy?: string;
}

export async function getMahasiswaList(
  filter: MahasiswaFilter = {}
): Promise<PaginatedResponse<Mahasiswa>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  // Prodi uses scoped endpoint; Admin/Mahasiswa/Warek use the unified endpoint
  const endpoint = "/mahasiswa";
  return api.get<PaginatedResponse<Mahasiswa>>(`${endpoint}?${params.toString()}`);
}

/**
 * Get prodi-scoped mahasiswa list. Used by Prodi role pages.
 * Returns same shape as getMahasiswaList but via /prodi/mahasiswa.
 */
export async function getProdiMahasiswaList(
  filter: MahasiswaFilter = {}
): Promise<PaginatedResponse<Mahasiswa>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  return api.get<PaginatedResponse<Mahasiswa>>(`/prodi/mahasiswa?${params.toString()}`);
}

export interface MahasiswaFilterOptions {
  prodis: { id: number; nama: string; kode: string }[];
  angkatans: number[];
}

export async function getMahasiswaFilterOptions(): Promise<MahasiswaFilterOptions> {
  const res = await api.get<{ success: boolean; prodis: { id: number; nama: string; kode: string }[]; angkatans: number[] }>(
    "/mahasiswa/filter-options"
  );
  return { prodis: res.prodis, angkatans: res.angkatans };
}


export async function getMahasiswaById(nim: string, tahunAjaran?: string): Promise<Mahasiswa | null> {
  const url = tahunAjaran ? `/mahasiswa/${nim}?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : `/mahasiswa/${nim}`;
  const res = await api.get<ApiResponse<Mahasiswa>>(url);
  return res.data;
}

export interface CreateMahasiswaResult {
  id: number;
  nim: string;
  nama: string;
  credentials: {
    username: string;
    password: string;
  };
}

export async function createMahasiswa(
  payload: FormData
): Promise<CreateMahasiswaResult> {
  const res = await api.post<{
    success: boolean;
    mahasiswa: { id: number; nim: string; nama: string };
    credentials: { username: string; password: string };
  }>("/mahasiswa", payload);
  return { ...res.mahasiswa, credentials: res.credentials };
}

export async function checkNim(nim: string): Promise<{ exists: boolean; nama?: string }> {
  return api.get<{ exists: boolean; nama?: string }>(`/mahasiswa/check-nim/${nim}`);
}

export async function deleteMahasiswa(nim: string, konfirmasiNim: string): Promise<void> {
  await api.delete<{ success: boolean; message: string }>(`/mahasiswa/${nim}?konfirmasi_nim=${konfirmasiNim}`);
}

export async function updateMahasiswaStatus(nim: string, payload: { status: "Aktif" | "Nonaktif"; alasan_status?: string; catatan_status?: string }): Promise<void> {
  await api.patch(`/mahasiswa/${nim}/status`, payload);
}

export async function cabutKipkMahasiswa(nim: string, payload: { alasan_cabut: string; catatan_cabut?: string; konfirmasi_nim: string }): Promise<void> {
  await api.patch(`/mahasiswa/${nim}/cabut-kipk`, payload);
}

export async function getRekapAkademik(tahunAjaran?: string): Promise<{ data: any[] }> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  return await api.get(`/akademik/rekap-mahasiswa${qs}`);
}

export async function getRekapPrestasi(tahunAjaran?: string): Promise<{ data: any[] }> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  return await api.get(`/akademik/prestasi${qs}`);
}

export async function getRekapOrganisasi(tahunAjaran?: string): Promise<{ data: any[] }> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  return await api.get(`/akademik/organisasi${qs}`);
}

export async function getRekapPelatihan(tahunAjaran?: string): Promise<{ data: any[] }> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  return await api.get(`/akademik/pelatihan${qs}`);
}

export interface MataKuliahItem {
  kode: string;
  nama: string;
  sks: number;
  nilaiHuruf: string;
  nilaiMutu: number;
  lulus: boolean;
}

export interface SemesterDetailBE {
  id: number;
  semester: number;
  tahun: string;
  ipk: number;
  ips: number;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  catatan_admin?: string | null;
  file_khs?: string | null;
  mataKuliah: MataKuliahItem[];
}

export async function getMahasiswaIpk(nim: string, tahunAjaran?: string): Promise<SemesterDetailBE[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}&_t=${Date.now()}` : `?_t=${Date.now()}`;
  const res = await api.get<{ data: SemesterDetailBE[] }>(`/mahasiswa/${nim}/ipk${qs}`);
  return res.data || [];
}

export async function getMahasiswaPrestasi(nim: string, tahunAjaran?: string): Promise<any[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${nim}/prestasi${qs}`);
  return res.data || [];
}

export async function getMahasiswaOrganisasi(nim: string, tahunAjaran?: string): Promise<any[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${nim}/organisasi${qs}`);
  return res.data || [];
}

export async function getMahasiswaPelatihan(nim: string, tahunAjaran?: string): Promise<any[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${nim}/pelatihan${qs}`);
  return res.data || [];
}

export async function getMahasiswaSpHistory(nim: string, tahunAjaran?: string): Promise<any[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${nim}/sp${qs}`);
  return res.data || [];
}

export async function getMahasiswaDokumen(nim: string, tahunAjaran?: string): Promise<any[]> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${nim}/dokumen${qs}`);
  return res.data || [];
}

export async function getMahasiswaBebasTanggungan(nim: string, tahunAjaran?: string): Promise<any> {
  const qs = tahunAjaran ? `?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : '';
  const res = await api.get(`/mahasiswa/${nim}/bebas-tanggungan${qs}`);
  return res;
}

export async function validatePrestasi(mahasiswaNim: string, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaNim}/prestasi/${itemId}/validate`, payload);
}

export async function validateOrganisasi(mahasiswaNim: string, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaNim}/organisasi/${itemId}/validate`, payload);
}

export async function validatePelatihan(mahasiswaNim: string, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaNim}/pelatihan/${itemId}/validate`, payload);
}

export async function getCatatanInternal(nim: string, tahunAjaran?: string) {
  const url = tahunAjaran ? `/mahasiswa/${nim}/catatan?tahun_ajaran=${encodeURIComponent(tahunAjaran)}` : `/mahasiswa/${nim}/catatan`;
  const res = await api.get(url);
  return res.data;
}

export async function storeCatatanInternal(nim: string, payload: { tahun_ajaran: string; kategori: string; deskripsi: string }) {
  const res = await api.post(`/mahasiswa/${nim}/catatan`, payload);
  return res.data;
}
