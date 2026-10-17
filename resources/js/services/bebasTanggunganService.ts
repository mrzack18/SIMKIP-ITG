/**
 * Bebas Tanggungan Admin Service
 * Handles fetching and mutations for the admin Bebas Tanggungan list and detail.
 */
import { api, API_BASE_URL } from "./api";
import type {
  BebasTanggunganListResponse,
  BebasTanggunganDetailResponse,
} from "@/types";

export interface BebasTanggunganFilter {
  status?: "menunggu" | "diterbitkan" | "ditolak";
  search?: string;
  page?: number;
  limit?: number;
  tahun_ajaran?: string;
  prodi?: string;
  angkatan?: string;
}

export async function getBebasTanggunganList(
  filter: BebasTanggunganFilter = {}
): Promise<BebasTanggunganListResponse> {
  const params = new URLSearchParams();
  if (filter.status) params.append("status", filter.status);
  if (filter.search) params.append("search", filter.search);
  if (filter.page)   params.append("page", String(filter.page));
  if (filter.limit)  params.append("limit", String(filter.limit));
  if (filter.tahun_ajaran) params.append("tahun_ajaran", filter.tahun_ajaran);
  if (filter.prodi && filter.prodi !== "Semua Prodi") params.append("prodi", filter.prodi);
  if (filter.angkatan && filter.angkatan !== "Semua Angkatan") params.append("angkatan", filter.angkatan);

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

async function fetchBTPdf(id?: number): Promise<{ blob: Blob; filename: string }> {
  const token = localStorage.getItem("simkip_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["X-Requested-With"] = "XMLHttpRequest";
  headers["Accept"] = "application/pdf";

  const endpoint = id ? `/bebas-tanggungan/${id}/pdf` : "/bebas-tanggungan/pdf";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: "GET", headers });
  if (!response.ok) throw new Error(`Gagal memuat PDF (HTTP ${response.status})`);

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  let filename = "SKPS_KIP-K.pdf";
  if (disposition) {
    const match = disposition.match(/filename="?([^";\s]+)"?/);
    if (match && match[1]) filename = match[1];
  }
  return { blob, filename };
}

export async function downloadBTPdf(id?: number): Promise<void> {
  const { blob, filename } = await fetchBTPdf(id);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function previewBTPdf(id?: number): Promise<void> {
  const win = window.open("about:blank", "_blank");
  try {
    const { blob } = await fetchBTPdf(id);
    const url = window.URL.createObjectURL(blob);
    if (win) win.location.href = url;
    else window.open(url, "_blank");
  } catch (err) {
    win?.close();
    throw err;
  }
}
