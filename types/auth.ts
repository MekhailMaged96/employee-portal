export interface AuthUser {
  token: string;
  username: string | null;
  fullName: string | null;
  email: string | null;
  roles: string[];
  payload: Record<string, unknown>;
}

export interface AuthContextValue {
  user: AuthUser | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}
