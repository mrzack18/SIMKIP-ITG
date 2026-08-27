/**
 * Laporan Service
 * TODO: Replace mock implementations with real API calls
 */
import type { Laporan } from "@/types";

import type { Laporan, ApiResponse, PaginatedResponse } from "@/types";
import { api } from "./api";

export async function getLaporanList(filter: { search?: string, status?: string, page?: number, limit?: number } = {}): Promise<PaginatedResponse<Laporan>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const res = await api.get<ApiResponse<PaginatedResponse<Laporan>>>(`/laporan?${params.toString()}`);
  return res.data;
}

export async function getLaporanById(id: number): Promise<Laporan | null> {
  const res = await api.get<ApiResponse<Laporan>>(`/laporan/${id}`);
  return res.data;
}

export async function createLaporan(
  payload: Omit<Laporan, "id" | "status" | "periode" | "tanggalBuat" | "dibuat">
): Promise<Laporan> {
  const res = await api.post<ApiResponse<Laporan>>("/laporan", payload);
  return res.data;
}

export async function updateLaporan(id: number, payload: Partial<Laporan>): Promise<Laporan> {
  const res = await api.put<ApiResponse<Laporan>>(`/laporan/${id}`, payload);
  return res.data;
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
