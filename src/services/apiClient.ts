/**
 * Shared API client for the NESTMATE backend.
 *
 * The backend runs on the same laptop during development, so localhost works
 * for web mode (npm run web). For a real phone on shared Wi-Fi, change
 * BASE_URL to the backend laptop's IP, e.g. 'http://192.168.43.17:8080'.
 */
export const BASE_URL = 'http://localhost:8080';

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
  try {
    if (typeof localStorage !== 'undefined') {
      if (token) localStorage.setItem('nestmate_token', token);
      else localStorage.removeItem('nestmate_token');
    }
  } catch {
    // localStorage unavailable (native) - in-memory token is fine
  }
}

export function getToken(): string | null {
  if (authToken) return authToken;
  try {
    if (typeof localStorage !== 'undefined') {
      authToken = localStorage.getItem('nestmate_token');
    }
  } catch {
    // ignore
  }
  return authToken;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data && typeof data.error === 'string' ? data.error : `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }
  return data as T;
}
