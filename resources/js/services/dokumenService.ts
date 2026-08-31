/**
 * Dokumen Service
 */
import type { DokumenQueue, DokumenStatus, ApiResponse } from "@/types";
import { api } from "./api";

export interface DokumenQueueResponse {
  data: DokumenQueue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DokumenFilter {
  search?: string;
  status?: DokumenStatus | "";
  jenis?: string;
  page?: number;
  limit?: number;
  tahun_ajaran?: string;
}

export async function getDokumenQueue(
  filter: DokumenFilter = {}
): Promise<DokumenQueueResponse> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  return api.get<DokumenQueueResponse>(`/admin/dokumen-queue?${params.toString()}`);
}

export async function approveDokumen(id: string): Promise<void> {
  await api.put(`/admin/dokumen-queue/${id}/validate`, {
    status: "Disetujui",
  });
}

export async function rejectDokumen(id: string, catatan: string): Promise<void> {
  await api.put(`/admin/dokumen-queue/${id}/validate`, {
    status: "Ditolak",
    catatan_admin: catatan,
  });
}

// Additional endpoints for mahasiswa
export async function uploadDokumen(payload: FormData): Promise<any> {
  return api.post("/dokumen", payload);
}

export async function getArsipDokumen(filter: { status?: string; jenis?: string } = {}): Promise<any[]> {
  const params = new URLSearchParams();
  if (filter.status) params.append("status", filter.status);
  if (filter.jenis) params.append("jenis", filter.jenis);
  const res = await api.get<ApiResponse<any[]>>(`/dokumen?${params.toString()}`);
  return res.data;
}

export async function deleteDokumen(id: number): Promise<void> {
  await api.delete(`/dokumen/${id}`);
}
