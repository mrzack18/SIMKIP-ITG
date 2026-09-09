import { api } from "./api";

export interface LsipdStatus {
  configured: boolean;
  base_url: string;
  token_ok: boolean;
}

export interface LsipdAllResult {
  inserted: number;
  updated: number;
  skipped: number;
  total: number;
}

export interface LsipdTranskripResult {
  semester_inserted: number;
  mata_kuliah_inserted: number;
  last_ipk: number | null;
}

export async function getLsipdStatus(): Promise<LsipdStatus> {
  const res = await api.get<{ success: boolean; data: LsipdStatus }>("/lsipd/status");
  return res.data;
}

export async function syncAllMahasiswa(): Promise<LsipdAllResult> {
  const res = await api.post<{ success: boolean; data: LsipdAllResult }>("/lsipd/sync-mahasiswa");
  return res.data;
}

export async function syncMahasiswaByNim(nim: string): Promise<unknown> {
  const res = await api.post<{ success: boolean; data: unknown }>(
    `/lsipd/sync-mahasiswa/${encodeURIComponent(nim)}`,
  );
  return res.data;
}

export async function syncTranskrip(nim: string): Promise<LsipdTranskripResult> {
  const res = await api.post<{ success: boolean; data: LsipdTranskripResult }>(
    `/lsipd/sync-transkrip/${encodeURIComponent(nim)}`,
  );
  return res.data;
}
