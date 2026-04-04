// ─────────────────────────────────────────────────────────────────────────────
// Archive Service
//
// Endpoints expected from your backend:
//
//   GET    /archive                     → ArchiveEntry[]
//                                         (full list for Patient Archive table)
//
//   GET    /archive/patient/:patientId  → ArchiveEntry[]
//                                         (timeline of all snapshots for one
//                                          patient, newest-first)
//
//   POST   /archive                     body: ArchivePayload
//                                       → ArchiveEntry
//                                         (manually archive a patient record)
//
//   DELETE /archive/:id                 → 204 No Content
//                                         (restore / un-archive one snapshot)
//
// ── How the archive timeline works ───────────────────────────────────────────
//   Every time a staff member edits a patient, the OLD record is inserted into
//   the patient_archives table with:
//     • patientId     – links back to the patients table
//     • changedBy     – staff username who made the edit
//     • changedAt     – ISO timestamp of the change (used as the timeline label)
//   The Patient Archive screen fetches all archive rows, groups them by
//   patientId, and displays a timeline from the first snapshot to the latest.
//   Clicking any timeline entry calls getArchiveByPatientId() and then
//   displays that snapshot's full record.
// ─────────────────────────────────────────────────────────────────────────────

import {
  apiGet,
  apiPost,
  apiDelete,
} from "./config";
import type { ArchiveEntry } from "../app/components/mockData";

export type { ArchiveEntry };

// ── In-memory store ───────────────────────────────────────────────────────────


export async function getArchive(): Promise<ArchiveEntry[]> {
  return apiGet<ArchiveEntry[]>("/archive");
}

export async function getArchiveByPatientId(
  patientId: number
): Promise<ArchiveEntry[]> {
  return apiGet<ArchiveEntry[]>(`/archive/patient/${patientId}`);
}


export interface ArchivePayload {
  patientId     : number;
  lastName      : string;
  firstName     : string;
  middleInitial : string;
  startDatetime : string;   // ISO string or formatted date-time
  changedBy?    : string;   // staff username who triggered the archive
}

export async function archivePatient(
  payload: ArchivePayload
): Promise<ArchiveEntry> {
  return apiPost<ArchiveEntry>("/archive", payload);
}

// ─────────────────────────────────────────────────────────────────────────────
// restorePatient
//
// Removes a patient snapshot from the archive (un-archives / restores).
// Always call addLogbookEntry({ action: "Restore", … }) alongside this.
// ─────────────────────────────────────────────────────────────────────────────
export async function restorePatient(archiveId: number): Promise<void> {
  await apiDelete(`/archive/${archiveId}`);
}
