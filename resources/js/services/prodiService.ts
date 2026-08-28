/**
 * Prodi Service
 * Endpoint untuk mengambil daftar Program Studi.
 */
import { api } from "./api";

export interface Prodi {
  id: number;
  kode: string;
  nama: string;
  is_aktif?: boolean;
}

export async function getProdiList(): Promise<Prodi[]> {
  const res = await api.get<{ success: boolean; data: Prodi[] }>("/konfigurasi/prodi");
  return res.data;
}
