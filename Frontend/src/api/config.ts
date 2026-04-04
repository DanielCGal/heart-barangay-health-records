/// <reference types="vite/client" />

// ─────────────────────────────────────────────────────────────────────────────
// API Configuration
//
// Set VITE_API_BASE_URL in your .env file (copy .env.example → .env).
// All service functions are organised with clearly-labelled blocks:
//
//   ── MOCK MODE ──   active code that uses local data
//   ── REAL API ──    commented-out code ready to uncomment
//
// To connect to your backend, for each function:
//   1. Delete the MOCK block.
//   2. Uncomment the REAL API block.
// ─────────────────────────────────────────────────────────────────────────────

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

// ── Token / user storage ──────────────────────────────────────────────────────
const TOKEN_KEY = "heart_token";
const USER_KEY  = "heart_user";

export const tokenStorage = {
  get:   ()          => localStorage.getItem(TOKEN_KEY),
  set:   (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: ()          => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStorage = {
  get: <T>(): T | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set: <T>(u: T) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
};

// ── Shared request headers ────────────────────────────────────────────────────
export function authHeaders(): HeadersInit {
  const token = tokenStorage.get();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Generic fetch helpers ─────────────────────────────────────────────────────
// These are ready to use once VITE_API_BASE_URL is set.

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Try to extract message from backend
    let msg = `Request failed (${res.status})`;
    try {
      const text = await res.text(); // read once
      if (text) {
        // Spring sometimes returns JSON, sometimes plain text
        try {
          const json = JSON.parse(text) as any;
          msg =
            json?.message ||
            json?.error ||
            json?.detail ||
            msg;
        } catch {
          msg = text;
        }
      }
    } catch {}

    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text) as any;
          msg = json?.message || json?.error || json?.detail || msg;
        } catch {
          msg = text;
        }
      }
    } catch {}
    throw new Error(msg);
  }

  // ✅ 204 No Content (or empty body) should not call res.json()
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${path} → ${res.status} ${res.statusText}`);
}

/** Simulates a small network delay for mock services. */
export const fakeDelay = (ms = 120) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
