import type { UserSession } from "@/types";

export const MOCK_USERS: Record<string, UserSession> = {
  admin: {
    id: "ADM001",
    nama: "Encep Jianul Hayat, S.T., M.T.",
    role: "admin",
  },
  mahasiswa: {
    id: "2206001",
    nama: "Ahmad Rifaldi",
    nim: "2206001",
    role: "mahasiswa",
    prodi: "Teknik Informatika",
  },
  prodi: {
    id: "PRD001",
    nama: "Teknik Informatika",
    role: "prodi",
    prodi: "Teknik Informatika",
  },
  warek: {
    id: "WRK001",
    nama: "Dr. Rina Kurniawati, S.E., M.Si.",
    role: "warek",
  },
};

export const DEMO_PASSWORD = "kip2026";

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
