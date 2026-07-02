export interface AuthUser {
  email: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  errorMessage?: string;
}
