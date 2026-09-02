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
  // Inertia middleware detects non-Inertia GETs via X-Requested-With absence
  // and renders the SPA shell instead of returning JSON. Mark every request
  // as XHR so api endpoints always respond with their declared JSON body.
  // Accept: application/json ensures Laravel returns JSON 401 on unauth, not a redirect.
  headers.set("X-Requested-With", "XMLHttpRequest");
  headers.set("Accept", "application/json");

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

  const text = await response.text();
  // If the "JSON" response is actually HTML (e.g. Laravel redirect to login),
  // the token is missing/expired — throw an auth error so the caller can redirect.
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    const authErr = new Error("UNAUTHENTICATED");
    (authErr as any).status = 401;
    throw authErr;
  }

  return JSON.parse(text);
}

export const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ) => {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
          )
          .join('&')
      : '';
    return apiCall<T>(endpoint + qs, { method: 'GET' });
  },
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
