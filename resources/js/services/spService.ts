/**
 * Surat Peringatan Service
 * TODO: Replace mock implementations with real API calls
 */
import type { SuratPeringatan } from "@/types";
import { spList } from "@/data/mockData";

export interface SPFilter {
  search?: string;
  level?: string;
  status?: string;
}

/**
 * Get SP list
 * Replace with: return api.get<SuratPeringatan[]>("/sp");
 */
export async function getSPList(filter: SPFilter = {}): Promise<SuratPeringatan[]> {
  await new Promise((r) => setTimeout(r, 300));

  let data = [...spList] as SuratPeringatan[];

  if (filter.search) {
    const q = filter.search.toLowerCase();
    data = data.filter(
      (s) => s.nama.toLowerCase().includes(q) || s.nim.includes(q)
    );
  }
  if (filter.level) data = data.filter((s) => s.level === filter.level);
  if (filter.status) data = data.filter((s) => s.status === filter.status);

  return data;
}

/**
 * Get SP by ID
 * Replace with: return api.get<SuratPeringatan>(`/sp/${id}`);
 */
export async function getSPById(id: number): Promise<SuratPeringatan | null> {
  await new Promise((r) => setTimeout(r, 200));
  return (spList as SuratPeringatan[]).find((s) => s.id === id) ?? null;
}

/**
 * Terbitkan SP
 * Replace with: return api.post<SuratPeringatan>("/sp", payload);
 */
export async function terbitkanSP(
  payload: Omit<SuratPeringatan, "id">
): Promise<SuratPeringatan> {
  await new Promise((r) => setTimeout(r, 600));
  const newId = Math.max(...spList.map((s) => s.id)) + 1;
  return { id: newId, ...payload } as SuratPeringatan;
}
