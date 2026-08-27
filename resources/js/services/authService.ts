/**
 * Auth Service
 * TODO: Replace mock implementation with real API calls to backend
 */
import type { UserSession } from "@/types";
import { ROLE_PATHS } from "@/data/mockUsers";
import { api } from "./api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  user: UserSession;
  token: string;
  redirectPath: string;
}

export interface AuthResponse {
  user: UserSession;
  token: string;
  message?: string;
}

/**
 * Login — calls the real backend API.
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    const res = await api.post<AuthResponse>("/auth/login", payload);
    const { token, user } = res;
    
    if (!token || !user) {
        throw new Error("Invalid response from server");
    }

    localStorage.setItem("simkip_token", token);
    localStorage.setItem("simkip_user", JSON.stringify(user));

    return {
      user,
      token,
      redirectPath: ROLE_PATHS[user.role] ?? "/dashboard",
    };
  } catch (error: any) {
    throw new Error(error.message ?? "NIM atau password salah.");
  }
}

/**
 * Logout — clears local session.
 */
export function logout(): void {
  localStorage.removeItem("simkip_token");
  localStorage.removeItem("simkip_user");
}

/**
 * Get current session from localStorage.
 */
export function getCurrentUser(): UserSession | null {
  const raw = localStorage.getItem("simkip_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated.
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("simkip_token");
}
