/**
 * Mahasiswa Service — handles CRUD and sub-resource fetching for mahasiswa.
 */
import type { Mahasiswa, PaginatedResponse, ApiResponse } from "@/types";
import { api } from "./api";

export interface MahasiswaFilter {
  search?: string;
  prodi?: string;
  angkatan?: string;
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

  return api.get<PaginatedResponse<Mahasiswa>>(`/mahasiswa?${params.toString()}`);
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


export async function getMahasiswaById(id: number): Promise<Mahasiswa | null> {
  const res = await api.get<ApiResponse<Mahasiswa>>(`/mahasiswa/${id}`);
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

export async function deleteMahasiswa(id: number, konfirmasiNim: string): Promise<void> {
  await api.delete<{ success: boolean; message: string }>(`/mahasiswa/${id}?konfirmasi_nim=${konfirmasiNim}`);
}

export async function updateMahasiswaStatus(id: number, payload: { status: "Aktif" | "Nonaktif"; alasan_status?: string; catatan_status?: string }): Promise<void> {
  await api.patch(`/mahasiswa/${id}/status`, payload);
}

export async function cabutKipkMahasiswa(id: number, payload: { alasan_cabut: string; catatan_cabut?: string; konfirmasi_nim: string }): Promise<void> {
  await api.patch(`/mahasiswa/${id}/cabut-kipk`, payload);
}

export async function getRekapAkademik(): Promise<{ data: any[] }> {
  return await api.get("/akademik/rekap-mahasiswa");
}

export async function getRekapPrestasi(): Promise<{ data: any[] }> {
  return await api.get("/akademik/prestasi");
}

export async function getRekapOrganisasi(): Promise<{ data: any[] }> {
  return await api.get("/akademik/organisasi");
}

export async function getRekapPelatihan(): Promise<{ data: any[] }> {
  return await api.get("/akademik/pelatihan");
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
  semester: number;
  tahun: string;
  ipk: number;
  mataKuliah: MataKuliahItem[];
}

export async function getMahasiswaIpk(id: number): Promise<SemesterDetailBE[]> {
  const res = await api.get<{ data: SemesterDetailBE[] }>(`/mahasiswa/${id}/ipk`);
  return res.data || [];
}

export async function getMahasiswaPrestasi(id: number): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${id}/prestasi`);
  return res.data || [];
}

export async function getMahasiswaOrganisasi(id: number): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${id}/organisasi`);
  return res.data || [];
}

export async function getMahasiswaPelatihan(id: number): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${id}/pelatihan`);
  return res.data || [];
}

export async function getMahasiswaSpHistory(id: number): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${id}/sp`);
  return res.data || [];
}

export async function getMahasiswaDokumen(id: number): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/mahasiswa/${id}/dokumen`);
  return res.data || [];
}

export async function getMahasiswaBebasTanggungan(id: number): Promise<any> {
  const res = await api.get(`/mahasiswa/${id}/bebas-tanggungan`);
  return res;
}

export async function validatePrestasi(mahasiswaId: number, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaId}/prestasi/${itemId}/validate`, payload);
}

export async function validateOrganisasi(mahasiswaId: number, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaId}/organisasi/${itemId}/validate`, payload);
}

export async function validatePelatihan(mahasiswaId: number, itemId: number, payload: { status: string; catatan_admin?: string }): Promise<void> {
  await api.put(`/mahasiswa/${mahasiswaId}/pelatihan/${itemId}/validate`, payload);
}
