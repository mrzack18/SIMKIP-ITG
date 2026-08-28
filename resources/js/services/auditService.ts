import type { ApiResponse, PaginatedResponse } from "@/types";
import { api } from "./api";

export interface AuditLogEntry {
  id: number;
  jenis: string;
  aktivitas: string;
  deskripsi: string | null;
  dilakukan_oleh: string;
  terkait_nim: string | null;
  terkait_nama: string | null;
  ip: string;
  waktu: string;
}

export interface AuditLogFilter {
  search?: string;
  jenis?: string;
  dari?: string;
  sampai?: string;
  page?: number;
  limit?: number;
}

type AuditLogApiResponse = {
  success: boolean;
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export async function getAuditLogs(filter: AuditLogFilter = {}): Promise<PaginatedResponse<AuditLogEntry>> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const res = await api.get<AuditLogApiResponse>(`/audit?${params.toString()}`);
  return {
    data: res.data ?? [],
    total: res.total ?? 0,
    page: res.page ?? 1,
    limit: res.limit ?? 20,
    totalPages: res.total_pages ?? 1,
  };
}
