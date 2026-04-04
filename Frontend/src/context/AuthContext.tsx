// ─────────────────────────────────────────────────────────────────────────────
// AuthContext
//
// Wraps the entire app (see App.tsx → <AuthProvider>).
// Any component can call useAuth() to get the logged-in user and auth actions.
//
// Usage:
//   const {
//     user, isAuthenticated,
//     login, logout,
//     sendEmailVerificationCode, updateEmail,
//     updatePassword,
//   } = useAuth();
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, ReactNode } from "react";
import * as authService from "../api/auth.service";
import type { AuthUser } from "../api/auth.service";

// ── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendEmailVerificationCode: (newEmail: string) => Promise<void>;
  updateEmail: (newEmail: string, verificationCode: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// ── Safe default (used when no AuthProvider is in the tree, e.g. Figma
//    component preview or React Fast Refresh before full tree is ready) ────────
const defaultUser: AuthUser = {
  id:       "",
  fullName: "Preview User",
  email:    "",
  role:     "Health Staff",
};

const AuthContext = createContext<AuthContextValue>({
  user:                       defaultUser,
  isAuthenticated:            false,
  login:                      async () => {},
  logout:                     async () => {},
  sendEmailVerificationCode:  async () => {},
  updateEmail:                async () => {},
  updatePassword:             async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(authService.getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("heart_token")
  );

  const login = async (identifier: string, password: string) => {
    const loggedIn = await authService.login(identifier, password);
    setUser(loggedIn);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  const sendEmailVerificationCode = async (newEmail: string) => {
    await authService.sendEmailVerificationCode(newEmail);
  };

  const updateEmail = async (newEmail: string, verificationCode: string) => {
    const updated = await authService.updateEmail(newEmail, verificationCode);
    setUser(updated);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await authService.updatePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        sendEmailVerificationCode,
        updateEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// Never throws — returns safe defaults when called outside a provider
// (e.g. Figma Make preview or HMR before the full tree is mounted).
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}