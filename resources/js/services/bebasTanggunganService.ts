/**
 * Bebas Tanggungan Admin Service
 * Handles fetching and mutations for the admin Bebas Tanggungan list and detail.
 */
import { api } from "./api";
import type {
  BebasTanggunganListResponse,
  BebasTanggunganDetailResponse,
} from "@/types";

export interface BebasTanggunganFilter {
  status?: "menunggu" | "diterbitkan" | "ditolak";
  search?: string;
  page?: number;
  limit?: number;
}

export async function getBebasTanggunganList(
  filter: BebasTanggunganFilter = {}
): Promise<BebasTanggunganListResponse> {
  const params = new URLSearchParams();
  if (filter.status) params.append("status", filter.status);
  if (filter.search) params.append("search", filter.search);
  if (filter.page)   params.append("page", String(filter.page));
  if (filter.limit)  params.append("limit", String(filter.limit));

  return api.get<BebasTanggunganListResponse>(`/bebas-tanggungan?${params.toString()}`);
}

export async function getBebasTanggunganDetail(
  id: number
): Promise<BebasTanggunganDetailResponse> {
  return api.get<BebasTanggunganDetailResponse>(`/bebas-tanggungan/${id}`);
}

export async function approveBebasTanggungan(id: number): Promise<{ success: boolean; nomor_surat: string }> {
  return api.patch<{ success: boolean; nomor_surat: string }>(`/bebas-tanggungan/${id}/approve`, {});
}

export async function rejectBebasTanggungan(id: number, alasan: string): Promise<{ success: boolean; message: string }> {
  return api.patch<{ success: boolean; message: string }>(`/bebas-tanggungan/${id}/reject`, { alasan });
}
