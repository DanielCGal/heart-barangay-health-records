// ─────────────────────────────────────────────────────────────────────────────
// Staff Service
//
// Endpoints expected from your backend:
//
//   GET    /staff                       → StaffMember[]
//                                         (list of all staff for dropdowns /
//                                          logbook username select)
//
//   GET    /staff/:id                   → StaffMember
//                                         (profile of a specific staff member)
//
// ── Note on the logged-in staff's own profile ─────────────────────────────────
//   To fetch the current staff member's own profile (for the Settings modal),
//   use getMe() in auth.service.ts (GET /auth/me) — NOT this service.
//   This service is for looking up OTHER staff members or populating lists.
// ─────────────────────────────────────────────────────────────────────────────

import {
  fakeDelay,
  apiGet,
  apiPost,
} from "./config";
import { mockStaff } from "../app/components/mockData";

export interface StaffMember {
  id: string;
  fullName: string;
  username: string;
  role: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffPayload {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "Admin" | "Staff";
}

export async function getStaff(): Promise<string[]> {
  // REAL API
  const members = await apiGet<StaffMember[]>("/staff");
  return members.map((s) => s.username);
}

export async function getStaffById(id: string): Promise<StaffMember | null> {
  return apiGet<StaffMember>(`/staff/${id}`);
}

export async function createStaffAccount(data: CreateStaffPayload): Promise<StaffMember> {
  return apiPost<StaffMember>("/auth/staff", data);
}
