/**
 * Auth Service
 * TODO: Replace mock implementation with real API calls to backend
 */
import type { UserSession } from "@/types";
import { MOCK_USERS, DEMO_PASSWORD, ROLE_PATHS } from "@/data/mockUsers";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  user: UserSession;
  token: string;
  redirectPath: string;
}

/**
 * Login — currently uses mock data.
 * Replace body with: return api.post<LoginResult>("/auth/login", payload);
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const user = MOCK_USERS[payload.username.toLowerCase()];
  if (!user || payload.password !== DEMO_PASSWORD) {
    throw new Error("NIM atau password salah.");
  }

  const token = `mock_token_${user.role}_${Date.now()}`;
  localStorage.setItem("simkip_token", token);
  localStorage.setItem("simkip_user", JSON.stringify(user));

  return {
    user,
    token,
    redirectPath: ROLE_PATHS[user.role],
  };
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
