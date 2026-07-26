"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { decodeToken, extractRoles, isExpired } from "@/lib/jwt";
import type { AuthUser, AuthContextValue } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function setTokenCookie(token: string) {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie = "token=; path=/; max-age=0";
}

function buildUser(token: string | null): AuthUser | null {
  const payload = decodeToken(token);
  if (!payload || isExpired(payload)) return null;

  return {
    token: token!,
    username: (payload.sub ?? payload.username ?? null) as string | null,
    fullName: (payload.fullName ?? payload.name ?? null) as string | null,
    email: (payload.email ?? null) as string | null,
    roles: extractRoles(payload),
    payload,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = getTokenFromCookie();
    const u = buildUser(token);
    if (!u && token) clearTokenCookie();
    return u;
  });

  const login = useCallback((token: string) => {
    setTokenCookie(token);
    setUser(buildUser(token));
  }, []);

  const logout = useCallback(() => {
    clearTokenCookie();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: string) => !!user?.roles.includes(role),
    [user],
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => roles.some((r) => user?.roles.includes(r)),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      roles: user?.roles ?? [],
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
      hasAnyRole,
    }),
    [user, login, logout, hasRole, hasAnyRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
