import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string | null) {
  if (!token) return null;
  try {
    return jwtDecode<Record<string, unknown>>(token);
  } catch {
    return null;
  }
}

export function extractRoles(payload: Record<string, unknown> | null): string[] {
  if (!payload) return [];
  const raw =
    (payload.roles ?? payload.authorities ?? payload.role ?? payload.scope ?? []) as
      | string
      | string[]
      | { authority?: string; name?: string }[];

  const arr = Array.isArray(raw) ? raw : String(raw).split(/[\s,]+/);
  return arr
    .map((r) => (typeof r === "object" ? (r as { authority?: string; name?: string }).authority ?? (r as { name?: string }).name : r))
    .filter(Boolean)
    .map((r) => String(r).replace(/^ROLE_/, ""));
}

export function isExpired(payload: Record<string, unknown> | null): boolean {
  if (!payload?.exp) return false;
  return (payload.exp as number) * 1000 < Date.now();
}
