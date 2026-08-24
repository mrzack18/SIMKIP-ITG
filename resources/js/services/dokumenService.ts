/**
 * Dokumen Service
 * TODO: Replace mock implementations with real API calls
 */
import type { DokumenQueue, DokumenStatus } from "@/types";
import { dokumenQueue } from "@/data/mockData";

export interface DokumenFilter {
  search?: string;
  status?: DokumenStatus | "";
  jenis?: string;
}

/**
 * Get dokumen queue
 * Replace with: return api.get<DokumenQueue[]>("/dokumen/queue");
 */
export async function getDokumenQueue(
  filter: DokumenFilter = {}
): Promise<DokumenQueue[]> {
  await new Promise((r) => setTimeout(r, 300));

  let data = [...dokumenQueue] as DokumenQueue[];

  if (filter.search) {
    const q = filter.search.toLowerCase();
    data = data.filter(
      (d) => d.nama.toLowerCase().includes(q) || d.nim.includes(q)
    );
  }
  if (filter.status) data = data.filter((d) => d.status === filter.status);
  if (filter.jenis) data = data.filter((d) => d.jenis === filter.jenis);

  return data;
}

/**
 * Approve a document
 * Replace with: return api.patch(`/dokumen/${id}/approve`, {});
 */
export async function approveDokumen(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  console.log(`[Mock] Dokumen ${id} disetujui`);
}

/**
 * Reject a document
 * Replace with: return api.patch(`/dokumen/${id}/reject`, { catatan });
 */
export async function rejectDokumen(id: number, catatan: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  console.log(`[Mock] Dokumen ${id} ditolak. Catatan: ${catatan}`);
}
