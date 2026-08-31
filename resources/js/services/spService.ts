/**
 * Surat Peringatan Service
 */
import type { SuratPeringatan, ApiResponse, PaginatedResponse } from "@/types";
import { api } from "./api";

export interface SPFilter {
  search?: string;
  prodi?: string;
  angkatan?: string | number;
  level?: string;
  status?: string;
  page?: number;
  limit?: number;
  tahun_ajaran?: string; // added snake_case for backend
}

export async function getSPList(filter: SPFilter = {}): Promise<PaginatedResponse<SuratPeringatan>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const res = await api.get<{ success: boolean; data: SuratPeringatan[]; total: number; page: number; limit: number; total_pages: number }>(`/sp?${params.toString()}`);
  return {
    data: res.data,
    total: res.total,
    page: res.page,
    limit: res.limit,
    totalPages: res.total_pages,
  };
}

export interface SPDetailResponse {
  success: boolean;
  data: SuratPeringatan;
  extra: {
    jenisPelanggaran: string | null;
    catatan: string | null;
    diterbitkanOleh: string | null;
    mahasiswaId: number;
    kategori: string | null;
  };
  history: SuratPeringatan[];
}

export async function getSPDetail(id: number): Promise<SPDetailResponse> {
  return api.get<SPDetailResponse>(`/sp/${id}`);
}

export async function updateSPStatus(
  id: number,
  payload: { status: "Aktif" | "Masa Tenggang" | "Selesai"; catatan?: string }
): Promise<{ success: boolean; message: string }> {
  return api.patch<{ success: boolean; message: string }>(`/sp/${id}/status`, payload);
}

export async function terbitkanSP(
  payload: Omit<SuratPeringatan, "id" | "status" | "sisa" | "tanggalTerbit" | "batasEvaluasi">
): Promise<SuratPeringatan> {
  const res = await api.post<ApiResponse<SuratPeringatan>>("/sp", payload);
  return res.data;
}
