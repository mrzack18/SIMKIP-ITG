/**
 * Surat Peringatan Service
 * TODO: Replace mock implementations with real API calls
 */
import type { SuratPeringatan } from "@/types";
import type { SuratPeringatan, ApiResponse, PaginatedResponse } from "@/types";
import { api } from "./api";

export interface SPFilter {
  search?: string;
  level?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getSPList(filter: SPFilter = {}): Promise<PaginatedResponse<SuratPeringatan>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const res = await api.get<ApiResponse<PaginatedResponse<SuratPeringatan>>>(`/sp?${params.toString()}`);
  return res.data;
}

export async function getSPById(id: number): Promise<SuratPeringatan | null> {
  // Not explicitly defined in API, fallback to finding from list or implement in backend if needed
  throw new Error("getSPById is not implemented via backend API directly");
}

export async function terbitkanSP(
  payload: Omit<SuratPeringatan, "id" | "status" | "sisa" | "tanggalTerbit" | "batasEvaluasi">
): Promise<SuratPeringatan> {
  const res = await api.post<ApiResponse<SuratPeringatan>>("/sp", payload);
  return res.data;
}
