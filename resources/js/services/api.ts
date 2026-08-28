/**
 * API Base Configuration
 * 
 * This file contains the base configuration for API calls.
 * When the backend is ready, update BASE_URL and replace
 * mock data returns with actual fetch/axios calls.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// HTTP helper with auth token support
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("simkip_token");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Set Content-Type only if it's not FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  } else if (options.body instanceof FormData) {
    // If it's FormData, we must let the browser set the Content-Type with boundary
    headers.delete("Content-Type");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const err = new Error(body?.message ?? `HTTP ${response.status}`);
    (err as any).status = response.status;
    (err as any).error = body;
    throw err;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: "DELETE" }),
};
