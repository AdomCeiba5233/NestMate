import { LoginResult } from '../types/auth';
import { api, ApiError, setToken } from './apiClient';

/**
 * REAL implementation - calls the NESTMATE Spring Boot backend.
 * (Mock version replaced during integration; same signatures, callers untouched.)
 *
 * Seeded demo accounts (password: password123):
 *   ama@seed.nestmate.com · kojo@seed.nestmate.com
 *   abena@seed.nestmate.com · yaw@seed.nestmate.com
 */

interface BackendAuthResponse {
  userId: number;
  email: string;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const res = await api<BackendAuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(res.token);
    return { success: true, user: { email: res.email } };
  } catch (e) {
    const message =
      e instanceof ApiError ? e.message : 'Cannot reach the server. Is the backend running?';
    return { success: false, errorMessage: message };
  }
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<LoginResult> {
  try {
    const res = await api<BackendAuthResponse>('/api/auth/register', {
      method: 'POST',
      body: { email, password, fullName },
    });
    setToken(res.token);
    return { success: true, user: { email: res.email } };
  } catch (e) {
    const message =
      e instanceof ApiError ? e.message : 'Cannot reach the server. Is the backend running?';
    return { success: false, errorMessage: message };
  }
}

export function logout() {
  setToken(null);
}
