/**
 * Mahasiswa Service
 * TODO: Replace mock implementations with real API calls
 */
import type { Mahasiswa, PaginatedResponse } from "@/types";
import { mahasiswaList } from "@/data/mockData";

export interface MahasiswaFilter {
  search?: string;
  prodi?: string;
  angkatan?: string;
  kategori?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Get paginated list of mahasiswa
 * Replace with: return api.get<PaginatedResponse<Mahasiswa>>(`/mahasiswa?${params}`);
 */
export async function getMahasiswaList(
  filter: MahasiswaFilter = {}
): Promise<PaginatedResponse<Mahasiswa>> {
  await new Promise((r) => setTimeout(r, 300));

  let data = [...mahasiswaList] as Mahasiswa[];

  if (filter.search) {
    const q = filter.search.toLowerCase();
    data = data.filter(
      (m) => m.nama.toLowerCase().includes(q) || m.nim.includes(q)
    );
  }
  if (filter.prodi) data = data.filter((m) => m.prodi === filter.prodi);
  if (filter.angkatan) data = data.filter((m) => m.angkatan === Number(filter.angkatan));
  if (filter.kategori) data = data.filter((m) => m.kategori === filter.kategori);
  if (filter.status) data = data.filter((m) => m.status === filter.status);

  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const sliced = data.slice((page - 1) * limit, page * limit);

  return { data: sliced, total, page, limit, totalPages };
}

/**
 * Get mahasiswa by ID
 * Replace with: return api.get<Mahasiswa>(`/mahasiswa/${id}`);
 */
export async function getMahasiswaById(id: number): Promise<Mahasiswa | null> {
  await new Promise((r) => setTimeout(r, 200));
  return (mahasiswaList as Mahasiswa[]).find((m) => m.id === id) ?? null;
}

/**
 * Create mahasiswa
 * Replace with: return api.post<Mahasiswa>("/mahasiswa", payload);
 */
export async function createMahasiswa(
  payload: Omit<Mahasiswa, "id">
): Promise<Mahasiswa> {
  await new Promise((r) => setTimeout(r, 500));
  const newId = Math.max(...mahasiswaList.map((m) => m.id)) + 1;
  const newMahasiswa = { id: newId, ...payload } as Mahasiswa;
  // In real: mahasiswaList is immutable — backend handles persistence
  return newMahasiswa;
}

/**
 * Update mahasiswa
 * Replace with: return api.put<Mahasiswa>(`/mahasiswa/${id}`, payload);
 */
export async function updateMahasiswa(
  id: number,
  payload: Partial<Mahasiswa>
): Promise<Mahasiswa> {
  await new Promise((r) => setTimeout(r, 500));
  const existing = (mahasiswaList as Mahasiswa[]).find((m) => m.id === id);
  if (!existing) throw new Error(`Mahasiswa ID ${id} tidak ditemukan`);
  return { ...existing, ...payload };
}
