// ─────────────────────────────────────────────────────────────────────────────
// Logbook Service
//
// Endpoints expected from your backend:
//
//   GET    /logbook                     → LogbookEntry[]
//                                         (full list for Logbook Activity screen)
//
//   POST   /logbook                     body: NewLogbookEntry
//                                       → LogbookEntry
//                                         (add one activity entry)
//
//   PUT    /logbook/:id                 body: LogbookEntry
//                                       → LogbookEntry  (rarely needed)
//
// ── When to call addLogbookEntry() ───────────────────────────────────────────
//   Call this after EVERY staff action that changes patient data:
//
//   Action value       When to call
//   ─────────────────  ─────────────────────────────────────────────
//   "Add Record"       After createPatient() succeeds
//   "Edit Record"      After updatePatient() succeeds
//   "Delete Record"    After deletePatient() succeeds
//   "Archive"          After archivePatient() succeeds
//   "Restore"          After restorePatient() succeeds
//
//   The backend stores: staffUsername, action, patientName, patientId,
//   and a server-generated timestamp (ISO 8601).
// ─────────────────────────────────────────────────────────────────────────────

import {

  apiGet,  
  apiPost, 
  apiPut, 
} from "./config";
import { mockLogbook } from "../app/components/mockData";
import type { LogbookEntry } from "../app/components/mockData";

export type { LogbookEntry };



export async function getLogbook(): Promise<LogbookEntry[]> {
  return apiGet<LogbookEntry[]>("/logbook");
}

// ─────────────────────────────────────────────────────────────────────────────
// addLogbookEntry
//
// Logs a staff activity. Call this after every patient create/edit/delete/
// archive/restore. The timestamp is generated server-side in the real API.
//
// Usage example (after editing a patient):
//   await addLogbookEntry({
//     staffUsername : "m.santos",
//     action        : "Edit Record",
//     patientName   : "del Rosario, Juniel",
//     patientId     : 1,
//   });
// ─────────────────────────────────────────────────────────────────────────────
export interface NewLogbookEntry {
  staffUsername : string;   // staff who performed the action
  action        : string;   // "Add Record" | "Edit Record" | "Delete Record" | "Archive" | "Restore"
  patientName   : string;   // full name snapshot — format: "LastName, FirstName"
  patientId?    : number;   // optional FK reference to patients.id
}

export async function addLogbookEntry(entry: {
  staffUsername: string;
  action: string;
  patientName: string;
  patientId?: number;
}): Promise<LogbookEntry> {
  return apiPost<LogbookEntry>("/logbook", entry);
}


export async function updateLogbookEntry(
  id: number,
  data: LogbookEntry
): Promise<LogbookEntry> {
  return apiPut<LogbookEntry>(`/logbook/${id}`, data);
}
