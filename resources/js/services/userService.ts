import { api } from "./api";
import type { Role } from "@/types";

export interface UserRow {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: Role;
  prodi_id: number | null;
  prodi_nama: string | null;
  /** Atribut mahasiswa — null untuk akun non-mahasiswa. */
  angkatan: number | null;
  nim: string | null;
  is_active: boolean;
  is_password_changed: boolean;
  created_at: string;
}

export interface UsersResponse {
  success: boolean;
  data: UserRow[];
  total: number;
  current_page: number;
  last_page: number;
  filter_options?: { angkatans: number[] };
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email?: string;
  role: "admin" | "mahasiswa" | "prodi" | "warek";
  prodi_id?: number;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  email?: string;
  role?: "admin" | "mahasiswa" | "prodi" | "warek";
  prodi_id?: number;
}

export function getUsers(params?: {
  search?: string;
  role?: string;
  /** Filter atribut mahasiswa — hanya menyaring baris ber-role mahasiswa. */
  angkatan?: string | number;
  prodi?: string;
  /** "asc" = Nama A–Z (bawaan), "desc" = Nama Z–A. */
  sort?: "asc" | "desc";
  page?: number;
  per_page?: number;
}): Promise<UsersResponse> {
  return api.get<UsersResponse>("/users", params as Record<string, string | number>);
}

export function createUser(payload: CreateUserPayload): Promise<{ success: boolean; message: string; password: string }> {
  return api.post("/users", payload);
}

export function updateUser(id: number, payload: UpdateUserPayload): Promise<{ success: boolean; message: string }> {
  return api.put(`/users/${id}`, payload);
}

export function toggleUserActive(id: number): Promise<{ success: boolean; is_active: boolean }> {
  return api.patch(`/users/${id}/toggle`, {});
}

export function resetUserPassword(id: number): Promise<{ success: boolean; password: string }> {
  return api.post(`/users/${id}/reset-password`, {});
}
