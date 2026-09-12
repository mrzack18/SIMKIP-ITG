import { api } from "./api";

export interface LsipdStatus {
  configured: boolean;
  base_url: string;
  token_ok: boolean;
}

export interface LsipdAllResult {
  inserted: number;
  updated: number;
  unchanged: number;
  skipped: number;
  total: number;
  transkrip_success: number;
  transkrip_failed: number;
}

export interface LsipdSyncProgress {
  id: string;
  status: "pending" | "running" | "success" | "failed";
  phase: "biodata" | "transkrip";
  total: number;
  processed: number;
  percent: number;
  inserted: number;
  updated: number;
  unchanged: number;
  skipped: number;
  transkrip_success: number;
  transkrip_failed: number;
  message: string | null;
  started_at: string | null;
  finished_at: string | null;
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

export async function startSyncAllMahasiswa(): Promise<{ run_id: string }> {
  const res = await api.post<{ success: boolean; data: { run_id: string } }>("/lsipd/sync-mahasiswa", {});
  return res.data;
}

export async function getSyncProgress(runId?: string): Promise<LsipdSyncProgress | null> {
  const res = await api.get<{ success: boolean; data: LsipdSyncProgress | null }>(
    "/lsipd/sync-progress",
    runId ? { run_id: runId } : undefined,
  );
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

export interface LsipdDeleteAllResult {
  deleted: number;
}

export async function deleteAllMahasiswa(konfirmasi: string): Promise<LsipdDeleteAllResult> {
  const res = await api.post<{ success: boolean; data: LsipdDeleteAllResult }>(
    "/lsipd/delete-all-mahasiswa",
    { konfirmasi },
  );
  return res.data;
}

// ─── Daftar mahasiswa (tabel di halaman Sinkronisasi) ────────────────────────

export interface LsipdMahasiswaRow {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  status: string;
}

export interface LsipdMahasiswaResponse {
  success: boolean;
  data: LsipdMahasiswaRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filter_options?: { angkatans: number[] };
}

export async function getMahasiswaList(params?: {
  search?: string;
  angkatan?: string | number;
  prodi?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<LsipdMahasiswaResponse> {
  return api.get<LsipdMahasiswaResponse>("/lsipd/mahasiswa", params as Record<string, string | number>);
}

// ─── Sinkronisasi batch (banyak NIM dalam satu request) ──────────────────────

export interface LsipdBatchItem {
  nim: string;
  success: boolean;
  nama?: string | null;
  semester?: number;
  mk?: number;
  last_ipk?: number | null;
  message: string;
}

export interface LsipdBatchResult {
  hasil: LsipdBatchItem[];
  berhasil: number;
  total: number;
}

/** Sinkronkan biodata banyak mahasiswa sekaligus (maks. 200 NIM per request). */
export async function syncMahasiswaBatch(nims: string[]): Promise<LsipdBatchResult> {
  const res = await api.post<{ success: boolean; data: LsipdBatchResult }>(
    "/lsipd/sync-mahasiswa-batch",
    { nims },
  );
  return res.data;
}

/** Sinkronkan transkrip banyak mahasiswa sekaligus (maks. 50 NIM per request). */
export async function syncTranskripBatch(nims: string[]): Promise<LsipdBatchResult> {
  const res = await api.post<{ success: boolean; data: LsipdBatchResult }>(
    "/lsipd/sync-transkrip-batch",
    { nims },
  );
  return res.data;
}

// ─── Mahasiswa yang belum tersinkron ─────────────────────────────────────────

export interface LsipdBelumRow {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
}

export interface LsipdBelumResponse {
  success: boolean;
  data: LsipdBelumRow[];
  total: number;
  total_lsipd: number;
  total_lokal: number;
  filter_options?: { angkatans: number[]; prodis: string[] };
}

/**
 * Mahasiswa yang ada di LSIPD tapi belum ada di SIMKIP.
 *
 * Memicu satu tarikan daftar mahasiswa dari LSIPD (di sana tidak ada endpoint
 * per-NIM untuk biodata), jadi panggil hanya saat diperlukan.
 */
export async function getBelumTersinkron(): Promise<LsipdBelumResponse> {
  return api.get<LsipdBelumResponse>("/lsipd/belum-tersinkron");
}

// ─── Hapus data mahasiswa ────────────────────────────────────────────────────

export interface LsipdDeleteOneResult {
  nim: string;
  nama: string;
  rincian: { semester: number; dokumen: number };
}

/**
 * Hapus satu mahasiswa beserta seluruh data terkait dan akun loginnya.
 * Permanen dan tidak dapat dibatalkan.
 */
export async function deleteMahasiswa(nim: string): Promise<LsipdDeleteOneResult> {
  const res = await api.delete<{ success: boolean; data: LsipdDeleteOneResult }>(
    `/lsipd/mahasiswa/${encodeURIComponent(nim)}`,
  );
  return res.data;
}
