// ─────────────────────────────────────────────────────────────────────────────
// Patients Service
//
// Endpoints expected from your backend:
//
//   GET    /patients                    → Patient[]
//                                         (full list shown in Patient Information table)
//
//   GET    /patients/:id                → Patient
//                                         (detail view when a row is clicked)
//
//   POST   /patients                    body: Omit<Patient,"id">
//                                       → Patient
//                                         (new patient or maternal registration)
//
//   PUT    /patients/:id                body: EditPatientPayload
//                                       → Patient
//                                         (edit existing patient; backend also
//                                          writes the old snapshot to archive)
//
//   DELETE /patients/:id                → 204 No Content
//
// ── Age-group logic ───────────────────────────────────────────────────────────
//   Frontend determines the age group from `patient.birthday` before rendering:
//     • "adult"  → 6 years old and above  → ITR 6+ tabs
//     • "child"  → 5 years old and below  → ITR ≤5 tabs
//   Use getPatientAgeGroup(patient) exported below.
//
// ── Edit flow (what the frontend sends on save) ───────────────────────────────
//   When a staff member saves edits, the frontend calls updatePatient() with:
//     • `id`          – patient's ID
//     • `newData`     – the full updated Patient object
//     • `oldData`     – snapshot of the patient BEFORE edits
//     • `changedBy`   – staff username performing the edit
//   The backend is expected to:
//     1. Overwrite the patient row with `newData`.
//     2. Insert the `oldData` snapshot into the patient_archives table
//        (with `changedAt` timestamp + `changedBy` staff name).
//   The frontend separately calls addLogbookEntry() after a successful save.
//
// ── Patient payload field notes ───────────────────────────────────────────────
//   • birthday        : "YYYY-MM-DD"        (e.g. "1993-03-15")
//   • lastVisit       : "YYYY-MM-DD"        (e.g. "2026-02-14")
//   • contactNumber   : digits only, 11 chars
//   • spouseContact   : digits only, 11 chars
//   • bloodPressure   : "X/Y mmHg"          (e.g. "120/80 mmHg")
//   • weight          : "X kg"              (e.g. "58 kg")
//   • height          : "X cm"              (e.g. "155 cm")
//   • coMorbidities   : comma-joined values (e.g. "Hypertension, Diabetes")
//                       or "None"
//   • cancer          : "None" | free-text
//   • allergies       : "None" | free-text
//   • tt1–tt5 (maternalRecord) : "Month YYYY" (e.g. "March 2021") or ""
// ─────────────────────────────────────────────────────────────────────────────

import { apiGet, apiPost, apiPut, apiDelete } from "./config";
import { mockPatients } from "../app/components/mockData";
import type { Patient } from "../app/components/mockData";

// Re-export the type so consumers can import from here
export type { Patient };

// ── In-memory store (acts as the database in mock mode) ───────────────────────
let _patients: Patient[] = [...mockPatients];

// ── Edit payload (includes old snapshot for automatic archiving) ──────────────
export interface EditPatientPayload {
  newData   : Patient;   // the updated patient record to save
  oldData   : Patient;   // snapshot before changes (backend archives this)
  changedBy : string;    // staff username who made the edit
  changedAt : string;    // ISO timestamp of the edit
}

function splitFindings(s?: string | null): string[] {
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizePhysicalExam(pe: any): any {
  if (!pe) return pe;

  // Already normalized (new shape)
  if (pe.sheent && typeof pe.sheent === "object") return pe;

  // Backend flat shape -> convert to nested
  return {
    sheent: {
      essentiallyNormal: !!pe.sheentNormal,
      findings: splitFindings(pe.sheentFindings),
      othersSpecify: pe.sheentOthers ?? "",
    },
    chestBreastLungs: {
      essentiallyNormal: !!pe.chestBreastLungsNormal,
      findings: splitFindings(pe.chestBreastLungsFindings),
      othersSpecify: pe.chestBreastLungsOthers ?? "",
    },
    heart: {
      essentiallyNormal: !!pe.heartNormal,
      findings: splitFindings(pe.heartFindings),
      othersSpecify: pe.heartOthers ?? "",
    },
    abdomen: {
      essentiallyNormal: !!pe.abdomenNormal,
      findings: splitFindings(pe.abdomenFindings),
      othersSpecify: pe.abdomenOthers ?? "",
    },
    genitourinary: {
      essentiallyNormal: !!pe.genitourinaryNormal,
      findings: splitFindings(pe.genitourinaryFindings),
      othersSpecify: pe.genitourinaryOthers ?? "",
    },
    extremities: {
      essentiallyNormal: !!pe.extremitiesNormal,
      findings: splitFindings(pe.extremitiesFindings),
      othersSpecify: pe.extremitiesOthers ?? "",
    },
    neurological: {
      essentiallyNormal: !!pe.neurologicalNormal,
      findings: splitFindings(pe.neurologicalFindings),
      othersSpecify: pe.neurologicalOthers ?? "",
    },
  };
}

export async function deleteProgramInformation(
  patientId: number,
  programName: string,
  changedBy: string,
  archive: boolean = true
): Promise<void> {
  await apiDelete(
    `/patients/${patientId}/program-information/${encodeURIComponent(programName)}?changedBy=${encodeURIComponent(changedBy)}&archive=${archive}`
  );
}

function normalizeMaternalRecord(mr: any) {
  if (!mr) return mr;

  if ("gravida" in mr || "para" in mr || "bloodType" in mr || "dateOfDelivery" in mr) {
    return {
      gravida: mr.gravida ?? 0,
      para: mr.para ?? 0,
      fullTerm: mr.fullTerm ?? 0,
      preterm: mr.preterm ?? 0,
      abortion: mr.abortion ?? 0,
      living: mr.living ?? 0,

      menarcheAge: mr.menarcheAge ?? 0,
      menstrualCycle: mr.menstrualCycle ?? "Regular",
      menstrualFlowDays: mr.menstrualFlowDays ?? 0,
      coitarcheAge: mr.coitarcheAge ?? 0,
      currentFpMethod: mr.currentFpMethod ?? "",

      papSmear: !!mr.papSmear,
      papSmearDate: mr.papSmearDate ?? "",
      papSmearResult: mr.papSmearResult ?? "",

      via: !!mr.via,
      viaDate: mr.viaDate ?? "",
      viaResult: mr.viaResult ?? "",

      historyOfSti: !!mr.historyOfSti,
      stiDate: mr.stiDate ?? "",
      stiResult: mr.stiResult ?? "",

      riskCode: mr.riskCode ?? "",
      motherBabyBook: !!mr.motherBabyBook,
      lmp: mr.lmp ?? "",
      edd: mr.edd ?? "",
      planToDeliverAt: mr.planToDeliverAt ?? "",
      ageOfGestation: mr.ageOfGestation ?? "",
      accompanyingPerson: mr.accompanyingPerson ?? "",

      seenByDentist: !!mr.seenByDentist,
      dentistDate: mr.dentistDate ?? "",
      seenByPhysician: !!mr.seenByPhysician,
      physicianDate: mr.physicianDate ?? "",

      tt1: mr.tt1 ?? "",
      tt2: mr.tt2 ?? "",
      tt3: mr.tt3 ?? "",
      tt4: mr.tt4 ?? "",
      tt5: mr.tt5 ?? "",

      iodizedSalt: !!mr.iodizedSalt,
      ironSupplement: !!mr.ironSupplement,

      bloodType: mr.bloodType ?? "",
      bloodTypeDate: mr.bloodTypeDate ?? "",
      fbsRbsHba1c: mr.fbsRbsHba1c ?? "",
      fbsRbsHba1cDate: mr.fbsRbsHba1cDate ?? "",
      hbsag: mr.hbsag ?? "",
      hbsagDate: mr.hbsagDate ?? "",
      hemoglobinPrenatal: mr.hemoglobinPrenatal ?? "",
      hemoglobinPrenatalDate: mr.hemoglobinPrenatalDate ?? "",
      hiv: mr.hiv ?? "",
      hivDate: mr.hivDate ?? "",
      syphilis: mr.syphilis ?? "",
      syphilisDate: mr.syphilisDate ?? "",
      tuberculosis: mr.tuberculosis ?? "",
      tuberculosisDate: mr.tuberculosisDate ?? "",
      urinalysisPrenatal: mr.urinalysisPrenatal ?? "",
      urinalysisPrenatalDate: mr.urinalysisPrenatalDate ?? "",
      otherTestsPrenatal: mr.otherTestsPrenatal ?? "",
      otherTestsPrenatalDate: mr.otherTestsPrenatalDate ?? "",

      dateOfDelivery: mr.dateOfDelivery ?? "",
      postnatalPlaceOfDelivery: mr.postnatalPlaceOfDelivery ?? "",
      typeOfDelivery: mr.typeOfDelivery ?? "",
      outcomeOfPregnancy: mr.outcomeOfPregnancy ?? "",
      attendedBy: mr.attendedBy ?? "",
      complications: mr.complications ?? "",
      sexOfNewborn: mr.sexOfNewborn ?? "",
      birthweight: mr.birthweight ?? "",

      hemoglobinDone: !!mr.hemoglobinDone,
      hemoglobinPostnatal: mr.hemoglobinPostnatal ?? "",
      hemoglobinPostnatalDate: mr.hemoglobinPostnatalDate ?? "",

      breastfeeding: !!mr.breastfeeding,
      breastfeedingDateInitiated: mr.breastfeedingDateInitiated ?? "",

      vitaminA: !!mr.vitaminA,
      vitaminADate: mr.vitaminADate ?? "",

      counseling: !!mr.counseling,
      counselingDate: mr.counselingDate ?? "",

      dentistPostnatalYes: !!mr.dentistPostnatalYes,
      dentistPostnatalVisits1: mr.dentistPostnatalVisits1 ?? 0,
      dentistPostnatalVisits2: mr.dentistPostnatalVisits2 ?? 0,
      dentistPostnatalVisits3: mr.dentistPostnatalVisits3 ?? 0,

      physicianPostnatalYes: !!mr.physicianPostnatalYes,
      physicianPostnatalVisits1: mr.physicianPostnatalVisits1 ?? 0,
      physicianPostnatalVisits2: mr.physicianPostnatalVisits2 ?? 0,
      physicianPostnatalVisits3: mr.physicianPostnatalVisits3 ?? 0,

      bloodTypePostnatal: mr.bloodTypePostnatal ?? "",
      bloodTypePostnatalDate: mr.bloodTypePostnatalDate ?? "",
      fbsRbsHba1cPostnatal: mr.fbsRbsHba1cPostnatal ?? "",
      fbsRbsHba1cPostnatalDate: mr.fbsRbsHba1cPostnatalDate ?? "",
      hbsagPostnatal: mr.hbsagPostnatal ?? "",
      hbsagPostnatalDate: mr.hbsagPostnatalDate ?? "",
      hemoglobinLabPostnatal: mr.hemoglobinLabPostnatal ?? "",
      hemoglobinLabPostnatalDate: mr.hemoglobinLabPostnatalDate ?? "",
      hivPostnatal: mr.hivPostnatal ?? "",
      hivPostnatalDate: mr.hivPostnatalDate ?? "",
      syphilisPostnatal: mr.syphilisPostnatal ?? "",
      syphilisPostnatalDate: mr.syphilisPostnatalDate ?? "",
      tuberculosisPostnatal: mr.tuberculosisPostnatal ?? "",
      tuberculosisPostnatalDate: mr.tuberculosisPostnatalDate ?? "",
      urinalysisPostnatal: mr.urinalysisPostnatal ?? "",
      urinalysisPostnatalDate: mr.urinalysisPostnatalDate ?? "",
      otherTestsPostnatal: mr.otherTestsPostnatal ?? "",
      otherTestsPostnatalDate: mr.otherTestsPostnatalDate ?? "",
    };
  }

  return mr;
}

function normalizePatient(p: any) {
  if (!p) return p;
  return {
    ...p,
    physicalExam: normalizePhysicalExam(p.physicalExam),
    maternalRecord: normalizeMaternalRecord(p.maternalRecord),
  };
}


export async function getPatients(): Promise<Patient[]> {
  const raw = await apiGet<any[]>("/patients");
  return raw.map(normalizePatient) as Patient[];
}


export async function getPatientById(id: number): Promise<Patient> {
  const raw = await apiGet<any>(`/patients/${id}`);
  return normalizePatient(raw) as Patient;
}

export async function createPatient(data: Omit<Patient, "id">): Promise<Patient> {
  return apiPost<Patient>("/patients", data);
}


//   await addLogbookEntry({
//     staffUsername : payload.changedBy,
//     action        : "Edit Record",
//     patientName   : `${payload.newData.lastName}, ${payload.newData.firstName}`,
//     patientId     : payload.newData.id,
//   });



export async function updatePatient(
  id: number,
  patient: Patient,
  changedBy: string,
  archive: boolean = true
): Promise<Patient> {
  const raw = await apiPut<any>(
    `/patients/${id}?changedBy=${encodeURIComponent(changedBy)}&archive=${archive}`,
    patient
  );
  return normalizePatient(raw) as Patient;
}

export async function saveMaternalRecord(
  patientId: number,
  maternalRecord: Patient["maternalRecord"],
  changedBy: string,
  archive: boolean = true
): Promise<Patient> {
  const raw = await apiPut<any>(
    `/patients/${patientId}/maternal-record?changedBy=${encodeURIComponent(changedBy)}&archive=${archive}`,
    maternalRecord
  );
  return normalizePatient(raw) as Patient;
}


export function getPatientAgeGroup(patient: Patient): "adult" | "child" {
  if (typeof patient.age === "number" && !Number.isNaN(patient.age)) {
    return patient.age >= 6 ? "adult" : "child";
  }

  if (!patient.birthday) return "adult";

  const birth = new Date(patient.birthday);
  if (isNaN(birth.getTime())) return "adult";

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 6 ? "adult" : "child";
}

export function isMonthsOldPatient(patient: Patient): boolean {
  return (patient.age ?? 0) === 0 && (patient.ageMonths ?? 0) > 0;
}

export function formatPatientAge(patient: Patient): string {
  if (isMonthsOldPatient(patient)) {
    return `${patient.ageMonths}M`;
  }
  return String(patient.age ?? 0);
}

export function formatPatientAgeWithLabel(patient: Patient): string {
  if (isMonthsOldPatient(patient)) {
    return `${patient.ageMonths} months old`;
  }
  return `${patient.age ?? 0} years old`;
}

export async function saveImmunizationStatus(
  patientId: number,
  immunizationStatus: Patient["immunizationStatus"],
  changedBy: string,
  archive: boolean = true
): Promise<Patient> {
  return apiPut<Patient>(
    `/patients/${patientId}/immunization-status?changedBy=${encodeURIComponent(changedBy)}&archive=${archive}`,
    immunizationStatus
  );
}

export interface ProgramInformationPayload {
  programName: string;
  details: Record<string, any>;
}

export async function saveProgramInformation(
  patientId: number,
  payload: ProgramInformationPayload,
  changedBy: string,
  archive: boolean = true
) {
  return apiPut(
    `/patients/${patientId}/program-information?changedBy=${encodeURIComponent(changedBy)}&archive=${archive}`,
    payload
  );
}

export async function getProgramInformation(patientId: number) {
  return apiGet(
    `/patients/${patientId}/program-information`
  );
}



