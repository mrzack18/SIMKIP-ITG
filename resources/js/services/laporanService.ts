/**
 * Laporan Service
 * TODO: Replace mock implementations with real API calls
 */
import type { Laporan } from "@/types";

// Mock data — move to mockData.ts when needed
const mockLaporan: Laporan[] = [
  { id: 1, judul: "Laporan Semester Genap 2025/2026", periode: "Genap 2025/2026", semester: "6", tanggalBuat: "2026-06-01", tanggalAjukan: "2026-06-15", status: "Disetujui", dibuat: "Encep Jianul Hayat" },
  { id: 2, judul: "Laporan Semester Ganjil 2025/2026", periode: "Ganjil 2025/2026", semester: "5", tanggalBuat: "2025-12-01", tanggalAjukan: "2025-12-10", status: "Disetujui", dibuat: "Encep Jianul Hayat" },
  { id: 3, judul: "Laporan Semester Genap 2024/2025", periode: "Genap 2024/2025", semester: "4", tanggalBuat: "2025-06-01", tanggalAjukan: "2025-06-08", status: "Disetujui", dibuat: "Encep Jianul Hayat" },
  { id: 4, judul: "Draft Laporan Q3 2026", periode: "Ganjil 2026/2027", semester: "7", tanggalBuat: "2026-08-01", status: "Draft", dibuat: "Encep Jianul Hayat" },
];

/**
 * Get laporan list
 * Replace with: return api.get<Laporan[]>("/laporan");
 */
export async function getLaporanList(): Promise<Laporan[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockLaporan;
}

/**
 * Get laporan by ID
 * Replace with: return api.get<Laporan>(`/laporan/${id}`);
 */
export async function getLaporanById(id: number): Promise<Laporan | null> {
  await new Promise((r) => setTimeout(r, 200));
  return mockLaporan.find((l) => l.id === id) ?? null;
}

/**
 * Create laporan
 * Replace with: return api.post<Laporan>("/laporan", payload);
 */
export async function createLaporan(
  payload: Omit<Laporan, "id">
): Promise<Laporan> {
  await new Promise((r) => setTimeout(r, 600));
  const newId = Math.max(...mockLaporan.map((l) => l.id)) + 1;
  return { id: newId, ...payload };
}

/**
 * Submit laporan for approval
 * Replace with: return api.patch(`/laporan/${id}/submit`, {});
 */
export async function submitLaporan(id: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  console.log(`[Mock] Laporan ${id} diajukan`);
}

/**
 * Approve laporan (warek)
 * Replace with: return api.patch(`/laporan/${id}/approve`, { catatan });
 */
export async function approveLaporan(id: number, catatan?: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  console.log(`[Mock] Laporan ${id} disetujui. Catatan: ${catatan ?? "-"}`);
}
