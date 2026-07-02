import { LoginResult } from '../types/auth';

const MOCK_NETWORK_DELAY_MS = 1200;

// To exercise the failure path during testing, submit this password.
const MOCK_FAILING_PASSWORD = 'wrongpassword';

export async function login(email: string, password: string): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));

  if (password === MOCK_FAILING_PASSWORD) {
    return { success: false, errorMessage: 'Invalid email or password.' };
  }

  return { success: true, user: { email } };
}
