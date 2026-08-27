/**
 * Mahasiswa Service
 * TODO: Replace mock implementations with real API calls
 */
import type { Mahasiswa, PaginatedResponse } from "@/types";
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

export async function getMahasiswaById(id: number): Promise<Mahasiswa | null> {
  const res = await api.get<ApiResponse<Mahasiswa>>(`/mahasiswa/${id}`);
  return res.data;
}

export async function createMahasiswa(
  payload: FormData
): Promise<Mahasiswa> {
  const res = await api.post<ApiResponse<Mahasiswa>>("/mahasiswa", payload);
  return res.data;
}

export async function checkNim(nim: string): Promise<{ exists: boolean; nama?: string }> {
  return api.get<{ exists: boolean; nama?: string }>(`/mahasiswa/check-nim/${nim}`);
}

export async function deleteMahasiswa(id: number, konfirmasiNim: string): Promise<void> {
  await api.delete<{ success: boolean; message: string }>(`/mahasiswa/${id}?konfirmasi_nim=${konfirmasiNim}`);
}
