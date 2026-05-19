export const ADMIN_ROLE = "administrator" as const;

export type AdminRole = typeof ADMIN_ROLE;
export type AuthProvider = "password" | "google";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: AdminRole;
}

export interface AuthResult {
  ok: boolean;
  message?: string;
}
