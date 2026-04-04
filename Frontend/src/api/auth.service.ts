// ─────────────────────────────────────────────────────────────────────────────
// Auth Service
//
// Endpoints expected from your backend:
//
//   POST   /auth/login                  { identifier, password }
//                                       → { token: string; user: AuthUser }
//
//   POST   /auth/logout                 {}   → 204
//
//   GET    /auth/me                     (Bearer token)
//                                       → AuthUser
//
//   POST   /auth/forgot-password        { email: string }
//                                       → { message: string }
//                                         (backend sends OTP to that email)
//
//   POST   /auth/verify-reset-code      { email: string; code: string }
//                                       → { token: string; user: AuthUser }
//                                         (verifies OTP; returns new session)
//
//   POST   /auth/me/email/send-code     { newEmail: string }  (Bearer token)
//                                       → { message: string }
//                                         (backend sends OTP to the NEW email)
//
//   PATCH  /auth/me/email               { newEmail: string; code: string }
//                                       → AuthUser
//                                         (verifies OTP then persists new email)
//
//   PATCH  /auth/me/password            { currentPassword, newPassword }
//                                       → 204
// ─────────────────────────────────────────────────────────────────────────────

import {
  tokenStorage,
  userStorage,
  apiGet,
  apiPost,
  apiPatch,
} from "./config";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function login(
  identifier: string,
  password: string
): Promise<AuthUser> {
  const res = await apiPost<{ token: string; user: AuthUser }>("/auth/login", {
    identifier,
    password,
  });
  tokenStorage.set(res.token);
  userStorage.set(res.user);
  return res.user;
}

export async function logout(): Promise<void> {
  await apiPost("/auth/logout", {});
  tokenStorage.clear();
}

export async function getMe(): Promise<AuthUser> {
  const user = await apiGet<AuthUser>("/auth/me");
  userStorage.set(user);
  return user;
}

export async function sendForgotPasswordCode(email: string): Promise<void> {
  await apiPost("/auth/forgot-password", { email });
}

export async function verifyForgotPasswordCode(
  email: string,
  code: string
): Promise<AuthUser> {
  const res = await apiPost<{ token: string; user: AuthUser }>(
    "/auth/verify-reset-code",
    { email, code }
  );
  tokenStorage.set(res.token);
  userStorage.set(res.user);
  return res.user;
}

export async function sendEmailVerificationCode(newEmail: string): Promise<void> {
  await apiPost("/auth/me/email/send-code", { newEmail });
}

export async function updateEmail(
  newEmail: string,
  verificationCode: string
): Promise<AuthUser> {
  const updated = await apiPatch<AuthUser>("/auth/me/email", {
    newEmail,
    code: verificationCode,
  });
  userStorage.set(updated);
  return updated;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiPatch("/auth/me/password", { currentPassword, newPassword });
}

export function getStoredUser(): AuthUser | null {
  return userStorage.get<AuthUser>();
}
