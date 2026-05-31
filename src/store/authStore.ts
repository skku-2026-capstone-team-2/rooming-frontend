import type { AccountType } from "../types";

const AUTH_KEY = "rooming_auth";

export interface AuthState {
  accountType: AccountType;
  profileComplete: boolean;
}

export function setAuth(state: AuthState): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function getAuth(): AuthState | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
