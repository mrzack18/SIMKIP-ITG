import type { UserSession } from "@/types";

export const MOCK_USERS: Record<string, { user: UserSession; password?: string; realUsername?: string }> = {
  admin: {
    user: { id: "ADM001", nama: "Encep Jianul Hayat, S.T., M.T.", role: "admin" },
    password: "admin123",
    realUsername: "admin",
  },
  mahasiswa: {
    user: { id: "2206001", nama: "Ahmad Rifaldi", nim: "2206001", role: "mahasiswa", prodi: "Teknik Informatika" },
    password: "kip22060012026",
    realUsername: "2206001",
  },
  prodi: {
    user: { id: "PRD001", nama: "Teknik Informatika", role: "prodi", prodi: "Teknik Informatika" },
    password: "prodi123",
    realUsername: "prodi_ti",
  },
  warek: {
    user: { id: "WRK001", nama: "Dr. Rina Kurniawati, S.E., M.Si.", role: "warek" },
    password: "warek123",
    realUsername: "warek3",
  },
};

export const DEMO_PASSWORD = "admin123";

export const ROLE_LABELS: Record<string, string> = {
  admin: "Pengelola KIP-K",
  mahasiswa: "Mahasiswa",
  prodi: "Program Studi",
  warek: "Wakil Rektor III",
};

export const ROLE_PATHS: Record<string, string> = {
  admin: "/admin",
  mahasiswa: "/mahasiswa",
  prodi: "/prodi",
  warek: "/warek",
};
