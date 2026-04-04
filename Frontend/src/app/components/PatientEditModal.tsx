import { useState } from "react";
import { X, Save, User, MapPin, Heart, Pill, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Patient,
  PersonalSocialHistory,
  PhysicalExam,
  PhysicalExamFindings,
  MaternalRecord,
  ProgramInformation,
  FamilyPlanningProgramInfo,
  CardiovascularDiseaseProgramInfo,
} from "./mockData";
import { getPatientAgeGroup } from "../../api/patients.service";

interface PatientEditModalSavePayload {
  patient: Patient;
  familyPlanningProgramInfo?: FamilyPlanningProgramInfo;
  cardiovascularDiseaseProgramInfo?: CardiovascularDiseaseProgramInfo;
}

interface PatientEditModalProps {
  patient: Patient;
  onClose: () => void;
  onSave: (payload: PatientEditModalSavePayload) => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const programs = [
  "Prenatal Care",
  "Family Planning",
  "National Immunization",
  "National Tuberculosis",
  "Cardiovascular Disease",
  "Consultation",
  "Geriatric Screening",
  "Vaccination",
];

const puroks = [
  "Bagong Buhay 1",
  "Bagong Buhay 2",
  "Cory",
  "Dacudao",
  "FPAULBIVAC",
  "Maligaya",
  "RGA",
  "Rivera",
  "Sampaguita",
  "Sta. Theresa",
  "Others/OUT OF ZONE",
];
const CO_MORB_OPTIONS = ["Hypertension", "Diabetes", "STI/HIV", "Heart Disease", "Kidney Failure", "TB"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TT_YEARS = Array.from({ length: 17 }, (_, i) => String(2026 - i)); // 2026..2010
const PROGRAM_OPTIONS = [
  "Prenatal Care",
  "Family Planning",
  "National Immunization",
  "National Tuberculosis",
  "Cardiovascular Disease",
  "Consultation",
  "Geriatric Screening",
  "Vaccination",
];

const SHEENT_OPTIONS = ["Pallor/Cyanosis", "Poor Skin Turgor", "Sunken Eyeball", "Sunken Fontanelle", "Icteric Sclerae", "Pale Conjunctivae", "Poor Vision", "Deafness", "Ear Discharges", "Nasal Congestion", "Lymphadenopathy", "Dental Caries", "Neck Mass"];
const CHEST_OPTIONS = ["Asymmetrical Expansion", "Chest Retraction", "Breast Discharge/Lump", "Crackles/Rales/Wheeze"];
const HEART_OPTIONS = ["Precordial Bulge", "Chest Pain", "Orthopnea"];
const ABDOMEN_OPTIONS = ["Bloody Stool", "Nausea", "Constipation", "Anorexia"];
const GU_OPTIONS = ["Frequency/Urgency", "Dysuria/Polyuria", "Abnormal Discharge", "Bloody Discharge"];
const EXTREMITIES_OPTIONS = ["Nail Clubbing", "Back/Joint Pain", "Joint Swelling", "Lymphedema"];
const NEURO_OPTIONS = ["Abnormal Gait", "Tremor/Seizure", "Numbness/Weakness", "Anxiety/Depression"];

const RELIGION_OPTIONS = [
  "Catholic",
  "Islam",
  "Protestant (NCCP)",
  "Iglesia ni Cristo",
  "Seventh-day Adventist",
  "Jehova's Witnesses",
  "Church of Christ",
  "Jesus is Lord Church",
  "Latter-day Saints",
  "Others",
  "None",
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const MONTH_MAP: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};

function parsePrograms(programValue?: string): string[] {
  if (!programValue) return [];
  return programValue
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}

function joinPrograms(programs: string[]): string {
  return programs.map((p) => p.trim()).filter(Boolean).join(",");
}

function hasProgram(programValue: string | undefined, target: string): boolean {
  return parsePrograms(programValue).includes(target);
}

function toDateInput(str: string): string {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // "Month DD, YYYY" or "Month D, YYYY"
  const m = str.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (m) {
    const mo = MONTH_MAP[m[1].toLowerCase()];
    if (mo) return `${m[3]}-${mo}-${m[2].padStart(2, "0")}`;
  }
  return "";
}

function getTodayLocalDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clampToToday(date: string): string {
  if (!date) return "";
  const today = getTodayLocalDate();
  return date > today ? today : date;
}

function calculateAgeFromBirthday(birthday: string): { years: number; months: number } {
  if (!birthday) return { years: 0, months: 0 };

  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return { years: 0, months: 0 };

  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  const days = today.getDate() - birth.getDate();

  if (days < 0) months -= 1;

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return { years: 0, months: 0 };

  return {
    years,
    months: years === 0 ? months : 0,
  };
}

function parseTTDate(tt: string): { month: string; year: string } {
  if (!tt) return { month: "", year: "" };
  const parts = tt.trim().split(" ");
  return { month: parts[0] || "", year: parts[1] || "" };
}

function formatTTDate(month: string, year: string): string {
  if (month && year) return `${month} ${year}`;
  return month || year || "";
}

function initCoMorbChecks(coMorb: string): string[] {
  const lower = coMorb.toLowerCase();
  return CO_MORB_OPTIONS.filter((opt) => {
    if (opt === "TB") return lower.includes("tuberculosis") || lower.includes(" tb") || lower === "tb";
    if (opt === "STI/HIV") return lower.includes("sti") || lower.includes("hiv");
    if (opt === "Heart Disease") return lower.includes("heart disease") || lower.includes("cardiac");
    if (opt === "Kidney Failure") return lower.includes("kidney") || lower.includes("renal failure");
    return lower.includes(opt.toLowerCase());
  });
}

// ── Defaults ───────────────────────────────────────────────────────────────────
const DEFAULT_PSH: PersonalSocialHistory = {
  eatsHealthyDiet: false, adequatePhysicalActivity: false, sufficientRestSleep: false,
  normalGrowthDevelopment: false, multiplePartners: false, smokesTobacco: false,
  tobaccoPacksPerYear: 0, drinksAlcohol: false, alcoholBottlesPerYear: 0,
  takesIllegalDrugs: false, illegalDrugsSpecify: "",
};
const DEFAULT_PE: PhysicalExam = {
  sheent: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  abdomen: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
  neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
};
const DEFAULT_MR: MaternalRecord = {
  gravida: 0,
  para: 0,
  fullTerm: 0,
  preterm: 0,
  abortion: 0,
  living: 0,

  menarcheAge: 0,
  menstrualCycle: "Regular",
  menstrualFlowDays: 0,
  coitarcheAge: 0,
  currentFpMethod: "",

  papSmear: false,
  papSmearDate: "",
  papSmearResult: "",

  via: false,
  viaDate: "",
  viaResult: "",

  historyOfSti: false,
  stiDate: "",
  stiResult: "",

  riskCode: "",
  motherBabyBook: false,
  lmp: "",
  edd: "",
  planToDeliverAt: "",
  ageOfGestation: "",
  accompanyingPerson: "",

  seenByDentist: false,
  dentistDate: "",
  dentistVisit1: 0,
  dentistVisit2: 0,
  dentistVisit3: 0,

  seenByPhysician: false,
  physicianDate: "",
  physicianVisit1: 0,
  physicianVisit2: 0,
  physicianVisit3: 0,

  tt1: "",
  tt2: "",
  tt3: "",
  tt4: "",
  tt5: "",

  iodizedSalt: false,
  ironSupplement: false,

  bloodType: "",
  bloodTypeDate: "",
  fbsRbsHba1c: "",
  fbsRbsHba1cDate: "",
  hbsag: "",
  hbsagDate: "",
  hemoglobinPrenatal: "",
  hemoglobinPrenatalDate: "",
  hiv: "",
  hivDate: "",
  syphilis: "",
  syphilisDate: "",
  tuberculosis: "",
  tuberculosisDate: "",
  urinalysisPrenatal: "",
  urinalysisPrenatalDate: "",
  otherTestsPrenatal: "",
  otherTestsPrenatalDate: "",

  dateOfDelivery: "",
  postnatalPlaceOfDelivery: "",
  typeOfDelivery: "",
  outcomeOfPregnancy: "",
  attendedBy: "",
  complications: "",
  sexOfNewborn: "",
  birthweight: "",

  hemoglobinDone: false,
  hemoglobinPostnatal: "",
  hemoglobinPostnatalDate: "",

  vitaminA: false,
  vitaminADate: "",

  breastfeeding: false,
  breastfeedingDateInitiated: "",

  counseling: false,
  counselingDate: "",

  dentistPostnatalYes: false,
  dentistPostnatalVisits1: 0,
  dentistPostnatalVisits2: 0,
  dentistPostnatalVisits3: 0,

  physicianPostnatalYes: false,
  physicianPostnatalVisits1: 0,
  physicianPostnatalVisits2: 0,
  physicianPostnatalVisits3: 0,

  bloodTypePostnatal: "",
  bloodTypePostnatalDate: "",
  fbsRbsHba1cPostnatal: "",
  fbsRbsHba1cPostnatalDate: "",
  hbsagPostnatal: "",
  hbsagPostnatalDate: "",
  hemoglobinLabPostnatal: "",
  hemoglobinLabPostnatalDate: "",
  hivPostnatal: "",
  hivPostnatalDate: "",
  syphilisPostnatal: "",
  syphilisPostnatalDate: "",
  tuberculosisPostnatal: "",
  tuberculosisPostnatalDate: "",
  urinalysisPostnatal: "",
  urinalysisPostnatalDate: "",
  otherTestsPostnatal: "",
  otherTestsPostnatalDate: "",
};

// ── Shared style tokens ────────────────────────────────────────────────────────
const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#004b96] focus:ring-1 focus:ring-[#004b96]/20";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1";
const errorCls = "flex items-center gap-1 text-red-500 text-[10px] mt-1";

function getProgramInformation(patient: Patient, programName: string): ProgramInformation | undefined {
  return patient.programsInformation?.find((info) => info.programName === programName);
}

const blankFamilyPlanningProgramInfo = (): FamilyPlanningProgramInfo => ({
  takeCocPills: false,
  cocPillsLastDateTaken: "",
  takePopPills: false,
  popPillsLastDateTaken: "",
  usedCondoms: false,
  injectables: false,
  iudPostpartum: false,
  iudInterval: false,
  haveImplant: false,
  btl: false,
  vasectomy: false,
  lam: false,
  knowCalendarMethod: false,
});

const blankCardiovascularDiseaseProgramInfo = (): CardiovascularDiseaseProgramInfo => ({
  takenLosartan50mg: false,
  losartan50mgLastDateTaken: "",
  takenLosartan100mg: false,
  losartan100mgLastDateTaken: "",
  takenAmlodipine10mg: false,
  amlodipine10mgLastDateTaken: "",
  takenAmlodipine5mg: false,
  amlodipine5mgLastDateTaken: "",
  takenMetformin500mg: false,
  metformin500mgLastDateTaken: "",
  takenAtorvastatin20mg: false,
  atorvastatin20mgLastDateTaken: "",
  takenAtorvastatin40mg: false,
  atorvastatin40mgLastDateTaken: "",
  takenMetoprolol50mg: false,
  metoprolol50mgLastDateTaken: "",
  takenGliclazide30mg: false,
  gliclazide30mgLastDateTaken: "",
});



// ── Small reusable components ──────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[#004b96] font-bold text-xs uppercase tracking-wider mb-3 pb-1.5 border-b-2 border-[#004b96]/20">
      {children}
    </h4>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 border transition-all ${
        value ? "bg-[#e8f4fd] border-[#004b96]/30" : "bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      <span className="text-xs text-gray-700">{label}</span>
      <div className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${value ? "bg-[#004b96]" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
    </div>
  );
}

function YesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-xs text-gray-700">{label}</span>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1 cursor-pointer text-[11px] font-medium text-gray-600">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            className="accent-[#004b96]"
          />
          YES
        </label>

        <label className="flex items-center gap-1 cursor-pointer text-[11px] font-medium text-gray-600">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            className="accent-[#004b96]"
          />
          NO
        </label>
      </div>
    </div>
  );
}

/** Input with a fixed unit suffix (mmHg / kg / cm) */
function UnitInput({
  rawValue, suffix, onChange, placeholder,
}: { rawValue: string; suffix: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#004b96] focus-within:ring-1 focus-within:ring-[#004b96]/20">
      <input
        className="flex-1 px-3 py-1.5 text-sm bg-white focus:outline-none min-w-0"
        value={rawValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 flex-shrink-0 select-none">
        {suffix}
      </span>
    </div>
  );
}

/** TT dose selector: month + year dropdowns */
function TTSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { month, year } = parseTTDate(value);
  return (
    <div className="flex flex-col gap-1">
      <select
        className="w-full text-center text-[10px] bg-white border border-[#004b96]/30 rounded focus:outline-none focus:border-[#004b96] text-gray-700 py-0.5"
        value={month}
        onChange={(e) => onChange(formatTTDate(e.target.value, year))}
      >
        <option value="">Month</option>
        {MONTHS.map((m) => <option key={m} value={m}>{m.slice(0, 3)}</option>)}
      </select>
      <select
        className="w-full text-center text-[10px] bg-white border border-[#004b96]/30 rounded focus:outline-none focus:border-[#004b96] text-gray-700 py-0.5"
        value={year}
        onChange={(e) => onChange(formatTTDate(month, e.target.value))}
      >
        <option value="">Year</option>
        {TT_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

function ExamSystemEditor({
  title, data, options, onChange,
}: { title: string; data: PhysicalExamFindings; options: string[]; onChange: (d: PhysicalExamFindings) => void }) {
  const toggleFinding = (opt: string) => {
    const already = data.findings.includes(opt);
    const newFindings = already ? data.findings.filter((f) => f !== opt) : [...data.findings, opt];
    onChange({ ...data, essentiallyNormal: newFindings.length === 0, findings: newFindings });
  };
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-xs text-gray-700 uppercase tracking-wide">{title}</p>
        <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-medium select-none ${data.essentiallyNormal && data.findings.length === 0 ? "text-green-600" : "text-gray-500"}`}>
          <input
            type="checkbox"
            checked={data.essentiallyNormal && data.findings.length === 0}
            onChange={(e) => onChange({ ...data, essentiallyNormal: e.target.checked, findings: e.target.checked ? [] : data.findings })}
            className="accent-green-600"
          />
          Essentially Normal
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = data.findings.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleFinding(opt)}
              className={`px-2 py-1 rounded-full text-xs border transition-all ${
                active ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-500 border-gray-300 hover:border-red-300 hover:text-red-500"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!data.essentiallyNormal && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Others (specify)</label>
          <input
            className={inputCls}
            value={data.othersSpecify}
            onChange={(e) => onChange({ ...data, othersSpecify: e.target.value })}
            placeholder="Other finding…"
          />
        </div>
      )}
    </div>
  );
}

// ── Tab key type ───────────────────────────────────────────────────────────────
type TabKey =
  | "identifying"
  | "medical"
  | "social"
  | "physical"
  | "vitals"
  | "programInformation"
  | "maternal";

// ── Main component ─────────────────────────────────────────────────────────────
export function PatientEditModal({ patient, onClose, onSave }: PatientEditModalProps) {
  const [form, setForm] = useState<Patient>({
    ...patient,
    personalSocialHistory: patient.personalSocialHistory ?? { ...DEFAULT_PSH },
    physicalExam: patient.physicalExam ?? { ...DEFAULT_PE },
    maternalRecord: patient.maternalRecord ?? (hasProgram(patient.program, "Prenatal Care") ? { ...DEFAULT_MR } : undefined),
  });
  const [activeTab, setActiveTab] = useState<TabKey>("identifying");

  const ageGroup = getPatientAgeGroup(form);
const isChild = ageGroup === "child";
const isAdult = ageGroup === "adult";

const showAgeMonths = (form.age ?? 0) === 0;

const today = getTodayLocalDate();

const setBirthdayWithAge = (birthday: string) => {
  const safeBirthday = clampToToday(birthday);
  const { years, months } = calculateAgeFromBirthday(safeBirthday);

  setForm((prev) => ({
    ...prev,
    birthday: safeBirthday,
    age: years,
    ageMonths: years === 0 ? months : 0,
  }));
};

const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
  parsePrograms(patient.program)
);

const toggleProgram = (programName: string) => {
  setSelectedPrograms((prev) => {
    const next = prev.includes(programName)
      ? prev.filter((p) => p !== programName)
      : [...prev, programName];

    setForm((current) => ({
  ...current,
  program: joinPrograms(next),
}));

    return next;
  });
};

function normalizeMaternalRecordForApi(mr: MaternalRecord | undefined): MaternalRecord | undefined {
  if (!mr) return undefined;

  return {
    ...DEFAULT_MR,
    ...mr,
    gravida: mr.gravida ?? 0,
    para: mr.para ?? 0,
    fullTerm: mr.fullTerm ?? 0,
    preterm: mr.preterm ?? 0,
    abortion: mr.abortion ?? 0,
    living: mr.living ?? 0,
  };
}

const [familyPlanningProgramInfo, setFamilyPlanningProgramInfo] =
  useState<FamilyPlanningProgramInfo>(() => {
    const existing = getProgramInformation(patient, "Family Planning");
    return (existing?.details as FamilyPlanningProgramInfo) ?? blankFamilyPlanningProgramInfo();
  });

const [cardiovascularDiseaseProgramInfo, setCardiovascularDiseaseProgramInfo] =
  useState<CardiovascularDiseaseProgramInfo>(() => {
    const existing = getProgramInformation(patient, "Cardiovascular Disease");
    return (existing?.details as CardiovascularDiseaseProgramInfo) ?? blankCardiovascularDiseaseProgramInfo();
  });

const showProgramInformationTab =
  selectedPrograms.includes("Family Planning") ||
  selectedPrograms.includes("Cardiovascular Disease");



  // ── Co-morbidities checkbox state (adult patients) ─────────────────────────
  const [selectedCoMorbs, setSelectedCoMorbs] = useState<string[]>(() =>
    initCoMorbChecks(patient.coMorbidities)
  );

  // ── Allergies dropdown state ───────────────────────────────────────────────
  const [allergyChoice, setAllergyChoice] = useState<"none" | "custom">(() =>
    (!patient.allergies || patient.allergies === "None" || patient.allergies === "") ? "none" : "custom"
  );

  // ── Cancer dropdown state ──────────────────────────────────────────────────
  const [cancerChoice, setCancerChoice] = useState<"none" | "custom">(() =>
    (!patient.cancer || patient.cancer === "None" || patient.cancer === "") ? "none" : "custom"
  );

  // ── Validation errors ──────────────────────────────────────────────────────
  const [contactError, setContactError] = useState("");
  const [spouseContactError, setSpouseContactError] = useState("");

  // ── Setters ────────────────────────────────────────────────────────────────
  const set = <K extends keyof Patient>(key: K, value: Patient[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setPsh = <K extends keyof PersonalSocialHistory>(key: K, value: PersonalSocialHistory[K]) =>
    setForm((prev) => ({ ...prev, personalSocialHistory: { ...(prev.personalSocialHistory ?? DEFAULT_PSH), [key]: value } }));

  const setPe = <K extends keyof PhysicalExam>(key: K, value: PhysicalExam[K]) =>
    setForm((prev) => ({ ...prev, physicalExam: { ...(prev.physicalExam ?? DEFAULT_PE), [key]: value } }));

  const setMr = <K extends keyof MaternalRecord>(key: K, value: MaternalRecord[K]) =>
    setForm((prev) => ({ ...prev, maternalRecord: { ...(prev.maternalRecord ?? DEFAULT_MR), [key]: value } }));

  // ── Contact number handler (digits only, max 11) ───────────────────────────
  const handleContactChange = (raw: string, field: "contactNumber" | "spouseContact") => {
    const numeric = raw.replace(/\D/g, "").slice(0, 11);
    set(field, numeric);
    const errMsg = numeric.length > 0 && numeric.length !== 11 ? "Must be exactly 11 digits" : "";
    if (field === "contactNumber") setContactError(errMsg);
    else setSpouseContactError(errMsg);
  };

  // ── Co-morbidities toggle ──────────────────────────────────────────────────
  const toggleCoMorb = (opt: string) => {
    const next = selectedCoMorbs.includes(opt)
      ? selectedCoMorbs.filter((o) => o !== opt)
      : [...selectedCoMorbs, opt];
    setSelectedCoMorbs(next);
    set("coMorbidities", next.length > 0 ? next.join(", ") : "None");
  };

  // ── BP / Weight / Height strip helpers ────────────────────────────────────
  const bpRaw = form.bloodPressure.replace(/\s*mmhg\s*$/i, "").trim();
  const weightRaw = form.weight.replace(/\s*kg\s*$/i, "").trim();
  const heightRaw = form.height.replace(/\s*cm\s*$/i, "").trim();

  // ── Derived ────────────────────────────────────────────────────────────────
  const hasMaternalTab = isAdult && !!form.maternalRecord;
  const psh = form.personalSocialHistory ?? DEFAULT_PSH;
  const pe = form.physicalExam ?? DEFAULT_PE;
  const mr = form.maternalRecord ?? DEFAULT_MR;

const tabs: { key: TabKey; label: string }[] = [
  { key: "identifying", label: "Identifying Data" },
  { key: "medical", label: "Medical History" },
  { key: "social", label: "Social History" },
  { key: "physical", label: "Physical Exam" },
  { key: "vitals", label: "Vitals & Programs" },
  ...(showProgramInformationTab
    ? [{ key: "programInformation" as TabKey, label: "Program Information" }]
    : []),
  ...(hasMaternalTab ? [{ key: "maternal" as TabKey, label: "Maternal Record" }] : []),
];

  const handleSave = () => {
  const cleaned: Patient = {
    ...form,
    spouseName: isChild ? "" : form.spouseName,
    spouseOccupation: isChild ? "" : form.spouseOccupation,
    spouseContact: isChild ? "" : form.spouseContact,
    children: isChild ? 0 : form.children,
    maternalRecord:
      isAdult && form.maternalRecord
        ? normalizeMaternalRecordForApi(form.maternalRecord)
        : undefined,
  };

  onSave({
    patient: cleaned,
    familyPlanningProgramInfo: selectedPrograms.includes("Family Planning")
      ? familyPlanningProgramInfo
      : undefined,
    cardiovascularDiseaseProgramInfo: selectedPrograms.includes("Cardiovascular Disease")
      ? cardiovascularDiseaseProgramInfo
      : undefined,
  });
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div className="bg-[#004b96] rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="bg-white/20 rounded-full p-2"><User size={22} className="text-white" /></div>
            <div>
              <h2 className="text-white font-bold text-lg">Edit Patient Record</h2>
              <p className="text-white/75 text-xs">{patient.firstName} {patient.lastName}</p>
            </div>
          </motion.div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="px-6 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-0.5 min-w-max">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-[#004b96] text-[#004b96]"
                    : "border-transparent text-gray-500 hover:text-[#004b96]"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-5"
            >

              {/* ══ IDENTIFYING DATA ══════════════════════════════════════════ */}
              {activeTab === "identifying" && (
                <>
                  <div>
                    <SectionTitle>Personal Information</SectionTitle>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} /></div>
                      <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} /></div>
                      <div><label className={labelCls}>Middle Initial</label><input className={inputCls} value={form.middleInitial} onChange={(e) => set("middleInitial", e.target.value)} maxLength={3} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
  <div>
    <label className={labelCls}>Age (Years)</label>
    <input
      className={inputCls}
      type="number"
      min={0}
      value={form.age ?? 0}
      onChange={(e) => {
        const nextAge = parseInt(e.target.value) || 0;
        set("age", nextAge);

        // once patient becomes 1 year old or more, hide/reset months
        if (nextAge >= 1) {
          set("ageMonths", 0);
        }
      }}
    />
  </div>

  <div>
    <label className={labelCls}>Sex</label>
    <select
      className={inputCls}
      value={form.sex}
      onChange={(e) => set("sex", e.target.value as "Male" | "Female")}
    >
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>

  <div>
    <label className={labelCls}>
      Birthday <span className="text-gray-400 font-normal">(YYYY-MM-DD)</span>
    </label>
    <input
  type="date"
  className={inputCls}
  value={toDateInput(form.birthday)}
  max={today}
  onChange={(e) => setBirthdayWithAge(e.target.value)}
/>
  </div>
</div>

{showAgeMonths && (
  <div className="grid grid-cols-3 gap-3 mt-3">
    <div>
      <label className={labelCls}>Age (Months)</label>
      <input
        className={inputCls}
        type="number"
        min={0}
        max={11}
        value={form.ageMonths ?? 0}
        onChange={(e) =>
          set("ageMonths", Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))
        }
      />
    </div>
  </div>
)}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
  <label className={labelCls}>Religion</label>
  <select
    className={inputCls}
    value={form.religion || ""}
    onChange={(e) => set("religion", e.target.value)}
  >
    <option value="">Select Religion</option>
    {RELIGION_OPTIONS.map((religion) => (
      <option key={religion} value={religion}>
        {religion}
      </option>
    ))}
  </select>
</div>
                      <div>
                        <label className={labelCls}>Civil Status</label>
                        <select className={inputCls} value={form.civilStatus} onChange={(e) => set("civilStatus", e.target.value)}>
                          <option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div><label className={labelCls}>Educational Attainment</label><input className={inputCls} value={form.educationalAttainment} onChange={(e) => set("educationalAttainment", e.target.value)} /></div>
                      <div><label className={labelCls}>Occupation</label><input className={inputCls} value={form.occupation} onChange={(e) => set("occupation", e.target.value)} /></div>
                    </div>
                    <div className="mt-3">
                      <label className={labelCls}>
                        Contact Number <span className="text-gray-400 font-normal">(11 digits, numbers only)</span>
                      </label>
                      <input
                        className={`${inputCls} ${contactError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
                        value={form.contactNumber}
                        onChange={(e) => handleContactChange(e.target.value, "contactNumber")}
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="e.g. 09171234567"
                      />
                      {contactError && (
                        <p className={errorCls}><AlertCircle size={11} /> {contactError}</p>
                      )}
                      {!contactError && form.contactNumber && form.contactNumber.length === 11 && (
                        <p className="text-green-600 text-[10px] mt-1">✓ Valid 11-digit number</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <SectionTitle><span className="flex items-center gap-1.5"><MapPin size={11} /> Address</span></SectionTitle>
                    <div><label className={labelCls}>Street / House Address</label><input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div><label className={labelCls}>Barangay</label><input className={inputCls} value={form.barangay} onChange={(e) => set("barangay", e.target.value)} /></div>
                      <div><label className={labelCls}>City</label><input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
                    </div>
                  </div>

                  {isAdult && (
  <div>
    <SectionTitle>Spouse Information</SectionTitle>
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className={labelCls}>Spouse Name</label>
        <input
          className={inputCls}
          value={form.spouseName || ""}
          onChange={(e) => set("spouseName", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Spouse Occupation</label>
        <input
          className={inputCls}
          value={form.spouseOccupation || ""}
          onChange={(e) => set("spouseOccupation", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>
          Spouse Contact <span className="text-gray-400 font-normal">(11 digits)</span>
        </label>
        <input
          className={`${inputCls} ${spouseContactError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}`}
          value={form.spouseContact || ""}
          onChange={(e) => handleContactChange(e.target.value, "spouseContact")}
          inputMode="numeric"
          maxLength={11}
          placeholder="e.g. 09181234567"
        />
        {spouseContactError && (
          <p className={errorCls}><AlertCircle size={11} /> {spouseContactError}</p>
        )}
        {!spouseContactError && (form.spouseContact || "").length === 11 && (
          <p className="text-green-600 text-[10px] mt-1">✓ Valid 11-digit number</p>
        )}
      </div>
    </div>
  </div>
)}
                </>
              )}

              {/* ══ MEDICAL HISTORY ═══════════════════════════════════════════ */}
              {activeTab === "medical" && (
                <>
                  <div>
                    <SectionTitle><span className="flex items-center gap-1.5"><Pill size={11} /> Past Medical History</span></SectionTitle>

                    {isChild && (
  <div>
    <SectionTitle>Newborn Care</SectionTitle>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={labelCls}>Type of Delivery</label>
        <input
          className={inputCls}
          value={form.typeOfDelivery || ""}
          onChange={(e) => set("typeOfDelivery", e.target.value)}
          placeholder="e.g. Normal / CS"
        />
      </div>

      <div>
        <label className={labelCls}>Mother Tetanus Toxoid Status</label>
        <input
          className={inputCls}
          value={form.motherTetanusShots || ""}
          onChange={(e) => set("motherTetanusShots", e.target.value)}
          placeholder="e.g. 2"
        />
      </div>

      <div>
        <label className={labelCls}>Birth Weight</label>
        <input
          className={inputCls}
          value={form.birthWeight || ""}
          onChange={(e) => set("birthWeight", e.target.value)}
          placeholder="e.g. 2.8 kg"
        />
      </div>

      <div>
        <label className={labelCls}>Birth Height</label>
        <input
          className={inputCls}
          value={form.birthHeight || ""}
          onChange={(e) => set("birthHeight", e.target.value)}
          placeholder="e.g. 49 cm"
        />
      </div>

      <div>
        <label className={labelCls}>BCG Date</label>
        <input
  type="date"
  className={inputCls}
  value={toDateInput(form.bcgDate || "")}
  max={today}
  onChange={(e) => set("bcgDate", clampToToday(e.target.value))}
/>
      </div>

      <div>
        <label className={labelCls}>Hep B Date</label>
        <input
  type="date"
  className={inputCls}
  value={toDateInput(form.hepBDate || "")}
  max={today}
  onChange={(e) => set("hepBDate", clampToToday(e.target.value))}
/>
      </div>

      <div>
        <label className={labelCls}>Vitamin K Date</label>
        <input
  type="date"
  className={inputCls}
  value={toDateInput(form.vitaminKDate || "")}
  max={today}
  onChange={(e) => set("vitaminKDate", clampToToday(e.target.value))}
/>
      </div>

      <div>
        <label className={labelCls}>Place of Delivery</label>
        <input
          className={inputCls}
          value={form.placeOfDelivery || ""}
          onChange={(e) => set("placeOfDelivery", e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <Toggle
        value={!!form.newbornScreening}
        onChange={(v) => set("newbornScreening", v)}
        label="Newborn Screening"
      />
      <Toggle
        value={!!form.initiatedBreastfeeding}
        onChange={(v) => set("initiatedBreastfeeding", v)}
        label="Initiated Breastfeeding"
      />
    </div>

    {form.newbornScreening && (
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className={labelCls}>Screening Date</label>
          <input
  type="date"
  className={inputCls}
  value={toDateInput(form.screeningDate || "")}
  max={today}
  onChange={(e) => set("screeningDate", clampToToday(e.target.value))}
/>
        </div>
        <div>
          <label className={labelCls}>Screening Results</label>
          <input
            className={inputCls}
            value={form.screeningResults || ""}
            onChange={(e) => set("screeningResults", e.target.value)}
          />
        </div>
      </div>
    )}

    {form.initiatedBreastfeeding && (
      <div className="mt-3">
        <label className={labelCls}>Breastfeeding Date</label>
        <input
  type="date"
  className={inputCls}
  value={toDateInput(form.breastfeedingDate || "")}
  max={today}
  onChange={(e) => set("breastfeedingDate", clampToToday(e.target.value))}
/>
      </div>
    )}
  </div>
)}

                    {/* Co-Morbidities */}
                    <div className="mb-4">
                      <label className={labelCls}>Co-Morbidities</label>
                      {isChild ? (
                        <div className="bg-[#e8f4fd] border border-[#004b96]/20 rounded-lg px-3 py-2 text-xs text-[#004b96]">
                          Patient is 5 years old or below — only <strong>Allergies</strong> and <strong>Cancer</strong> are shown below.
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {CO_MORB_OPTIONS.map((opt) => {
                              const checked = selectedCoMorbs.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleCoMorb(opt)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                    checked
                                      ? "bg-[#004b96] text-white border-[#004b96]"
                                      : "bg-white text-gray-600 border-gray-200 hover:border-[#004b96]/50"
                                  }`}
                                >
                                  <span className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                                    checked ? "bg-white border-white" : "border-current"
                                  }`}>
                                    {checked && (
                                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                                      </svg>
                                    )}
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {/* Read-only result textbox */}
                          <div className={`${inputCls} bg-gray-50 text-gray-600 min-h-[36px] cursor-default`}>
                            {selectedCoMorbs.length > 0
                              ? selectedCoMorbs.join(", ")
                              : <span className="text-gray-400">None selected</span>
                            }
                          </div>
                        </>
                      )}
                    </div>

                    {/* Allergies */}
                    <div className="mb-4">
                      <label className={labelCls}>Allergies</label>
                      <select
                        className={inputCls}
                        value={allergyChoice}
                        onChange={(e) => {
                          const v = e.target.value as "none" | "custom";
                          setAllergyChoice(v);
                          if (v === "none") set("allergies", "None");
                          else set("allergies", "");
                        }}
                      >
                        <option value="none">None</option>
                        <option value="custom">Other (specify)</option>
                      </select>
                      {allergyChoice === "custom" && (
                        <input
                          className={`${inputCls} mt-2`}
                          value={form.allergies === "None" ? "" : form.allergies}
                          onChange={(e) => set("allergies", e.target.value)}
                          placeholder="e.g. Penicillin, Sulfa drugs, Aspirin…"
                        />
                      )}
                    </div>

                    {/* Cancer */}
                    <div className="mb-4">
                      <label className={labelCls}>Cancer</label>
                      <select
                        className={inputCls}
                        value={cancerChoice}
                        onChange={(e) => {
                          const v = e.target.value as "none" | "custom";
                          setCancerChoice(v);
                          if (v === "none") set("cancer", "None");
                          else set("cancer", "");
                        }}
                      >
                        <option value="none">None</option>
                        <option value="custom">Other (specify)</option>
                      </select>
                      {cancerChoice === "custom" && (
                        <input
                          className={`${inputCls} mt-2`}
                          value={(form.cancer === "None" || !form.cancer) ? "" : form.cancer}
                          onChange={(e) => set("cancer", e.target.value)}
                          placeholder="e.g. Breast Cancer, Leukemia, Lung Cancer…"
                        />
                      )}
                    </div>

                    <div className="mt-3"><label className={labelCls}>Maintenance Medication, Dose & Frequency</label><textarea className={`${inputCls} resize-none`} rows={2} value={form.maintenanceMedication} onChange={(e) => set("maintenanceMedication", e.target.value)} /></div>
                    <div className="mt-3"><label className={labelCls}>Previous Illnesses / Surgeries</label><textarea className={`${inputCls} resize-none`} rows={2} value={form.previousIllnesses} onChange={(e) => set("previousIllnesses", e.target.value)} /></div>
                  </div>

                  <div>
                    <SectionTitle>Family History</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Asthma/Allergies", "Birth Defects", "Cancer", "Dementia", "Diabetes", "Hypertension", "Lung Disease", "Mental Illness"].map((cond) => {
                        const checked = form.familyHistoryConditions.includes(cond);
                        return (
                          <label key={cond} className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border text-xs font-medium transition-all ${checked ? "bg-[#004b96] text-white border-[#004b96]" : "bg-white text-gray-600 border-gray-200 hover:border-[#004b96]/50"}`}>
                            <input type="checkbox" checked={checked} onChange={() => set("familyHistoryConditions", checked ? form.familyHistoryConditions.filter((c) => c !== cond) : [...form.familyHistoryConditions, cond])} className="sr-only" />
                            <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${checked ? "bg-white border-white" : "border-gray-400"}`}>
                              {checked && <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.5 5l2.5 2.5 4.5-4.5" /></svg>}
                            </span>
                            {cond}
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-3"><label className={labelCls}>Other Family History (specify)</label><input className={inputCls} value={form.familyHistoryOther} onChange={(e) => set("familyHistoryOther", e.target.value)} /></div>
                  </div>
                </>

                

                
              )}

              {/* ══ SOCIAL HISTORY ════════════════════════════════════════════ */}
              {activeTab === "social" && (
  <>
    {isAdult ? (
      <>
        <div>
          <SectionTitle>Personal / Social History</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Toggle value={!!psh.eatsHealthyDiet} onChange={(v) => setPsh("eatsHealthyDiet", v)} label="Eats Healthy Diet" />
            <Toggle value={!!psh.adequatePhysicalActivity} onChange={(v) => setPsh("adequatePhysicalActivity", v)} label="Adequate Physical Activity" />
            <Toggle value={!!psh.sufficientRestSleep} onChange={(v) => setPsh("sufficientRestSleep", v)} label="Sufficient Rest / Sleep" />
            <Toggle value={!!psh.normalGrowthDevelopment} onChange={(v) => setPsh("normalGrowthDevelopment", v)} label="Normal Growth and Development" />
            <Toggle value={!!psh.multiplePartners} onChange={(v) => setPsh("multiplePartners", v)} label="Engage with Multiple Sex Partners" />
          </div>
        </div>

        <div>
          <SectionTitle>Substances</SectionTitle>
          <div className="space-y-3">
            <Toggle value={!!psh.smokesTobacco} onChange={(v) => setPsh("smokesTobacco", v)} label="Smokes Tobacco" />
            {psh.smokesTobacco && (
              <div className="ml-4">
                <label className={labelCls}>Packs per Year</label>
                <input
                  className={`${inputCls} w-32`}
                  type="number"
                  min={0}
                  value={psh.tobaccoPacksPerYear ?? 0}
                  onChange={(e) => setPsh("tobaccoPacksPerYear", parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            <Toggle value={!!psh.drinksAlcohol} onChange={(v) => setPsh("drinksAlcohol", v)} label="Drinks Alcohol" />
            {psh.drinksAlcohol && (
              <div className="ml-4">
                <label className={labelCls}>Bottles per Year</label>
                <input
                  className={`${inputCls} w-32`}
                  type="number"
                  min={0}
                  value={psh.alcoholBottlesPerYear ?? 0}
                  onChange={(e) => setPsh("alcoholBottlesPerYear", parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            <Toggle value={!!psh.takesIllegalDrugs} onChange={(v) => setPsh("takesIllegalDrugs", v)} label="Takes Illegal Drugs" />
            {psh.takesIllegalDrugs && (
              <div className="ml-4">
                <label className={labelCls}>Specify Drug(s)</label>
                <input
                  className={inputCls}
                  value={psh.illegalDrugsSpecify || ""}
                  onChange={(e) => setPsh("illegalDrugsSpecify", e.target.value)}
                  placeholder="e.g. Methamphetamine"
                />
              </div>
            )}
          </div>
        </div>
      </>
    ) : (
      <>
        <div>
          <SectionTitle>Personal / Social History</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Toggle value={!!psh.livesWithImmediateFamily} onChange={(v) => setPsh("livesWithImmediateFamily", v)} label="Lives with Immediate Family" />
            <Toggle value={!!psh.uneventfulBirthAndInfancy} onChange={(v) => setPsh("uneventfulBirthAndInfancy", v)} label="Uneventful Birth and Infancy" />
            <Toggle value={!!psh.normalGrowthDevelopment} onChange={(v) => setPsh("normalGrowthDevelopment", v)} label="Normal Growth and Development" />
            <Toggle value={!!psh.normalMoodsAndAttitudes} onChange={(v) => setPsh("normalMoodsAndAttitudes", v)} label="Normal Moods and Attitudes" />
            <Toggle value={!!psh.normalInterestInFamilyAndFriends} onChange={(v) => setPsh("normalInterestInFamilyAndFriends", v)} label="Normal Interest in Family and Friends" />
            <Toggle value={!!psh.normalInterestInWorkAndPlay} onChange={(v) => setPsh("normalInterestInWorkAndPlay", v)} label="Normal Interest in Work and Play" />
            <Toggle value={!!psh.adequatePhysicalActivity} onChange={(v) => setPsh("adequatePhysicalActivity", v)} label="Adequate Physical Activity" />
            <Toggle value={!!psh.sufficientRestSleep} onChange={(v) => setPsh("sufficientRestSleep", v)} label="Sufficient Rest / Sleep" />
          </div>
        </div>

        <div>
          <SectionTitle>Others</SectionTitle>
          <label className={labelCls}>Other Social Notes</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={psh.socialOther || ""}
            onChange={(e) => setPsh("socialOther", e.target.value)}
            placeholder="Other observations..."
          />
        </div>
      </>
    )}
  </>
)}

              {/* ══ PHYSICAL EXAM ═════════════════════════════════════════════ */}
              {activeTab === "physical" && (
                <>
                  <SectionTitle>Physical Examination Findings</SectionTitle>
                  <p className="text-xs text-gray-400 -mt-3 mb-1">Click findings to toggle them. Check "Essentially Normal" to clear all.</p>
                  <div className="space-y-3">
                    <ExamSystemEditor title="SHEENT" data={pe.sheent} options={SHEENT_OPTIONS} onChange={(d) => setPe("sheent", d)} />
                    <ExamSystemEditor title="Chest, Breast & Lungs" data={pe.chestBreastLungs} options={CHEST_OPTIONS} onChange={(d) => setPe("chestBreastLungs", d)} />
                    <ExamSystemEditor title="Heart" data={pe.heart} options={HEART_OPTIONS} onChange={(d) => setPe("heart", d)} />
                    <ExamSystemEditor title="Abdomen" data={pe.abdomen} options={ABDOMEN_OPTIONS} onChange={(d) => setPe("abdomen", d)} />
                    <ExamSystemEditor title="Genitourinary" data={pe.genitourinary} options={GU_OPTIONS} onChange={(d) => setPe("genitourinary", d)} />
                    <ExamSystemEditor title="Extremities" data={pe.extremities} options={EXTREMITIES_OPTIONS} onChange={(d) => setPe("extremities", d)} />
                    <ExamSystemEditor title="Neurological" data={pe.neurological} options={NEURO_OPTIONS} onChange={(d) => setPe("neurological", d)} />
                  </div>
                </>
              )}

              {/* ══ VITALS & PROGRAMS ════════════════════════════════════════ */}
              {activeTab === "vitals" && (
                <>
                  <div>
                    <SectionTitle><span className="flex items-center gap-1.5"><Heart size={11} /> Vital Signs</span></SectionTitle>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Blood Pressure</label>
                        <UnitInput
                          rawValue={bpRaw}
                          suffix="mmHg"
                          onChange={(v) => set("bloodPressure", v.trim() ? `${v.trim()} mmHg` : "")}
                          placeholder="120/80"
                        />
                        <p className="text-gray-400 text-[10px] mt-1">Enter reading (e.g. 120/80)</p>
                      </div>
                      <div>
                        <label className={labelCls}>Weight</label>
                        <UnitInput
                          rawValue={weightRaw}
                          suffix="kg"
                          onChange={(v) => set("weight", v.trim() ? `${v.trim()} kg` : "")}
                          placeholder="60"
                        />
                        <p className="text-gray-400 text-[10px] mt-1">Enter number only</p>
                      </div>
                      <div>
                        <label className={labelCls}>Height</label>
                        <UnitInput
                          rawValue={heightRaw}
                          suffix="cm"
                          onChange={(v) => set("height", v.trim() ? `${v.trim()} cm` : "")}
                          placeholder="160"
                        />
                        <p className="text-gray-400 text-[10px] mt-1">Enter number only</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className={labelCls}>Last Visit <span className="text-gray-400 font-normal">(YYYY-MM-DD)</span></label>
                      <input
  type="date"
  className={inputCls}
  value={toDateInput(form.lastVisit)}
  max={today}
  onChange={(e) => set("lastVisit", clampToToday(e.target.value))}
/>
                    </div>
                  </div>

                  <div>
                    <SectionTitle>Program & Purok</SectionTitle>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Health Program</label>
                        <div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {PROGRAM_OPTIONS.map((program) => {
      const checked = selectedPrograms.includes(program);

      return (
        <label
          key={program}
          className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border text-sm transition-all ${
            checked
              ? "bg-[#004b96] text-white border-[#004b96]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#004b96]"
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => toggleProgram(program)}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              checked ? "bg-white border-white" : "border-gray-400"
            }`}
          >
            {checked && (
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" />
              </svg>
            )}
          </span>
          {program}
        </label>
      );
    })}
  </div>

  <p className="text-xs text-gray-500 mt-2">
    Saved as: {form.program || "No program selected"}
  </p>
</div>
                      </div>
                      <div>
                        <label className={labelCls}>Purok</label>
                        <select className={inputCls} value={form.purok} onChange={(e) => set("purok", e.target.value)}>
                          {puroks.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    {isAdult && (
  <div className="mt-3">
    <label className={labelCls}># of Children</label>
    <input
      className={`${inputCls} w-32`}
      type="number"
      min={0}
      value={form.children}
      onChange={(e) => set("children", parseInt(e.target.value) || 0)}
    />
  </div>
)}
                    <div className="flex gap-4 mt-4">
                      {[
                        { label: "Family Planning", key: "familyPlanning" as keyof Patient },
                        { label: "Taking Vitamins", key: "vitamins" as keyof Patient },
                      ].map(({ label, key }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                          <div onClick={() => set(key, !form[key])} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${form[key] ? "bg-[#004b96]" : "bg-gray-300"}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                          </div>
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionTitle>Vaccines</SectionTitle>
                    <div className="grid grid-cols-3 gap-3">
                      {(["bcgVaccine", "hepBVaccine", "vitaminK"] as const).map((key) => (
                        <div key={key}>
                          <label className={labelCls}>{key === "bcgVaccine" ? "BCG Vaccine" : key === "hepBVaccine" ? "Hep B Vaccine" : "Vitamin K"}</label>
                          <select className={inputCls} value={form[key]} onChange={(e) => set(key, e.target.value as "YES" | "NO" | "N/A")}>
                            <option value="YES">YES</option><option value="NO">NO</option><option value="N/A">N/A</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "programInformation" && (
  <>
    {selectedPrograms.includes("Family Planning") && (
      <div className="border border-gray-200 rounded-xl p-4">
        <SectionTitle>Family Planning Program Additional Info</SectionTitle>
        <div className="space-y-2">
          <YesNoRow
            label="Take CoC pills"
            value={familyPlanningProgramInfo.takeCocPills}
            onChange={(v) =>
              setFamilyPlanningProgramInfo((prev) => ({ ...prev, takeCocPills: v }))
            }
          />

          <div>
            <label className={labelCls}>CoC pills last date taken:</label>
            <input
              className={inputCls}
              type="date"
              value={familyPlanningProgramInfo.cocPillsLastDateTaken}
              max={today}
              onChange={(e) =>
                setFamilyPlanningProgramInfo((prev) => ({
                  ...prev,
                  cocPillsLastDateTaken: clampToToday(e.target.value),
                }))
              }
            />
          </div>

          <YesNoRow
            label="Take PoP pills"
            value={familyPlanningProgramInfo.takePopPills}
            onChange={(v) =>
              setFamilyPlanningProgramInfo((prev) => ({ ...prev, takePopPills: v }))
            }
          />

          <div>
            <label className={labelCls}>PoP pills last date taken:</label>
            <input
              className={inputCls}
              type="date"
              value={familyPlanningProgramInfo.popPillsLastDateTaken}
              max={today}
              onChange={(e) =>
                setFamilyPlanningProgramInfo((prev) => ({
                  ...prev,
                  popPillsLastDateTaken: clampToToday(e.target.value),
                }))
              }
            />
          </div>

          {[
            ["usedCondoms", "Used Condoms"],
            ["injectables", "Injectables"],
            ["iudPostpartum", "IUD Postpartum"],
            ["iudInterval", "IUD Interval"],
            ["haveImplant", "Have Implant"],
            ["btl", "BTL"],
            ["vasectomy", "Vasectomy"],
            ["lam", "LAM"],
            ["knowCalendarMethod", "Know Calendar Method"],
          ].map(([key, label]) => (
            <YesNoRow
              key={key}
              label={label}
              value={familyPlanningProgramInfo[key as keyof FamilyPlanningProgramInfo] as boolean}
              onChange={(v) =>
                setFamilyPlanningProgramInfo((prev) => ({
                  ...prev,
                  [key]: v,
                }))
              }
            />
          ))}
        </div>
      </div>
    )}

    {selectedPrograms.includes("Cardiovascular Disease") && (
      <div className="border border-gray-200 rounded-xl p-4">
        <SectionTitle>Cardiovascular Disease Program Additional Info</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["takenLosartan50mg", "Losartan 50mg last date taken", "Taken Losartan 50mg"],
            ["takenLosartan100mg", "Losartan 100mg last date taken", "Taken Losartan 100mg"],
            ["takenAmlodipine10mg", "Amlodipine 10mg last date taken", "Taken Amlodipine 10mg"],
            ["takenAmlodipine5mg", "Amlodipine 5mg last date taken", "Taken Amlodipine 5mg"],
            ["takenMetformin500mg", "Metformin 500mg last date taken", "Taken Metformin 500mg"],
            ["takenAtorvastatin20mg", "Atorvastatin 20mg last date taken", "Taken Atorvastatin 20mg"],
            ["takenAtorvastatin40mg", "Atorvastatin 40mg last date taken", "Taken Atorvastatin 40mg"],
            ["takenMetoprolol50mg", "Metoprolol 50mg last date taken", "Taken Metoprolol 50mg"],
            ["takenGliclazide30mg", "Gliclazide 30mg last date taken", "Taken Gliclazide 30mg"],
          ].map(([boolKey, dateLabel, boolLabel]) => {
            const dateKeyMap: Record<string, keyof CardiovascularDiseaseProgramInfo> = {
              takenLosartan50mg: "losartan50mgLastDateTaken",
              takenLosartan100mg: "losartan100mgLastDateTaken",
              takenAmlodipine10mg: "amlodipine10mgLastDateTaken",
              takenAmlodipine5mg: "amlodipine5mgLastDateTaken",
              takenMetformin500mg: "metformin500mgLastDateTaken",
              takenAtorvastatin20mg: "atorvastatin20mgLastDateTaken",
              takenAtorvastatin40mg: "atorvastatin40mgLastDateTaken",
              takenMetoprolol50mg: "metoprolol50mgLastDateTaken",
              takenGliclazide30mg: "gliclazide30mgLastDateTaken",
            };

            const dateKey = dateKeyMap[boolKey];

            return (
              <div key={boolKey} className="border border-gray-200 rounded-lg p-3">
                <YesNoRow
                  label={boolLabel}
                  value={
                    cardiovascularDiseaseProgramInfo[
                      boolKey as keyof CardiovascularDiseaseProgramInfo
                    ] as boolean
                  }
                  onChange={(v) =>
                    setCardiovascularDiseaseProgramInfo((prev) => ({
                      ...prev,
                      [boolKey]: v,
                    }))
                  }
                />

                <div className="mt-2">
                  <label className={labelCls}>{dateLabel}:</label>
                  <input
                    className={inputCls}
                    type="date"
                    value={cardiovascularDiseaseProgramInfo[dateKey] as string}
                    max={today}
                    onChange={(e) =>
                      setCardiovascularDiseaseProgramInfo((prev) => ({
                        ...prev,
                        [dateKey]: clampToToday(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </>
)}

              {/* ══ MATERNAL RECORD ═══════════════════════════════════════════ */}
              {activeTab === "maternal" && (
              <>
                {/* OB-GYNE HISTORY */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <SectionTitle>OB-GYNE History</SectionTitle>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                    {([
                      ["gravida", "G"],
                      ["para", "P"],
                      ["fullTerm", "Full Term"],
                      ["preterm", "Preterm"],
                      ["abortion", "Abortion"],
                      ["living", "Living"],
                    ] as const).map(([key, label]) => (
                      <div key={key} className="bg-[#e8f4fd] rounded-xl p-2 text-center">
                        <p className="text-[10px] text-gray-500 font-medium mb-1">{label}</p>
                        <input
                          type="number"
                          min={0}
                          value={mr[key] ?? 0}
                          onChange={(e) => setMr(key, parseInt(e.target.value) || 0)}
                          className="w-full text-center text-[#004b96] font-bold bg-transparent border-b border-[#004b96]/30 focus:outline-none focus:border-[#004b96] text-lg"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className={labelCls}>Menarche Age</label>
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={mr.menarcheAge ?? 0}
                        onChange={(e) => setMr("menarcheAge", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Menstrual Cycle</label>
                      <select
                        className={inputCls}
                        value={mr.menstrualCycle ?? "Regular"}
                        onChange={(e) => setMr("menstrualCycle", e.target.value as "Regular" | "Irregular")}
                      >
                        <option value="Regular">Regular</option>
                        <option value="Irregular">Irregular</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Menstrual Flow (days)</label>
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={mr.menstrualFlowDays ?? 0}
                        onChange={(e) => setMr("menstrualFlowDays", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Coitarche Age</label>
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={mr.coitarcheAge ?? 0}
                        onChange={(e) => setMr("coitarcheAge", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelCls}>Current FP Method</label>
                      <input
                        className={inputCls}
                        value={mr.currentFpMethod ?? ""}
                        onChange={(e) => setMr("currentFpMethod", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { key: "papSmear", dateKey: "papSmearDate", resultKey: "papSmearResult", label: "PAP Smear" },
                      { key: "via", dateKey: "viaDate", resultKey: "viaResult", label: "VIA" },
                      { key: "historyOfSti", dateKey: "stiDate", resultKey: "stiResult", label: "History of STI" },
                    ] as const).map(({ key, dateKey, resultKey, label }) => (
                      <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                        <Toggle value={!!mr[key]} onChange={(v) => setMr(key, v)} label={label} />
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <label className={labelCls}>Date</label>
                            <input
                              type="date"
                              className={inputCls}
                              value={toDateInput(String(mr[dateKey] || ""))}
                              max={today}
                              onChange={(e) => setMr(dateKey, clampToToday(e.target.value) as never)}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Result</label>
                            <input
                              className={inputCls}
                              value={String(mr[resultKey] || "")}
                              onChange={(e) => setMr(resultKey, e.target.value as never)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRENATAL CARE */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <SectionTitle>Prenatal Care</SectionTitle>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className={labelCls}>Risk Code</label>
                      <input className={inputCls} value={mr.riskCode ?? ""} onChange={(e) => setMr("riskCode", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Age of Gestation</label>
                      <input className={inputCls} value={mr.ageOfGestation ?? ""} onChange={(e) => setMr("ageOfGestation", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Menstrual Period</label>
                      <input className={inputCls} value={mr.lmp ?? ""} onChange={(e) => setMr("lmp", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Expected Date of Delivery</label>
                      <input className={inputCls} value={mr.edd ?? ""} onChange={(e) => setMr("edd", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Plan to Deliver At</label>
                      <input className={inputCls} value={mr.planToDeliverAt ?? ""} onChange={(e) => setMr("planToDeliverAt", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Accompanying Person</label>
                      <input className={inputCls} value={mr.accompanyingPerson ?? ""} onChange={(e) => setMr("accompanyingPerson", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <Toggle value={!!mr.motherBabyBook} onChange={(v) => setMr("motherBabyBook", v)} label="Mother-Baby Book" />
                    <div className="grid grid-cols-2 gap-3">
                      <Toggle value={!!mr.iodizedSalt} onChange={(v) => setMr("iodizedSalt", v)} label="Iodized Salt" />
                      <Toggle value={!!mr.ironSupplement} onChange={(v) => setMr("ironSupplement", v)} label="Iron Supplement" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <Toggle value={!!mr.seenByDentist} onChange={(v) => setMr("seenByDentist", v)} label="Seen by Dentist" />
                      <div className="mt-3">
                        <label className={labelCls}>Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.dentistDate || "")}
                          max={today}
                          onChange={(e) => setMr("dentistDate", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <Toggle value={!!mr.seenByPhysician} onChange={(v) => setMr("seenByPhysician", v)} label="Seen by Physician" />
                      <div className="mt-3">
                        <label className={labelCls}>Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.physicianDate || "")}
                          max={today}
                          onChange={(e) => setMr("physicianDate", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Tetanus Toxoid Status & Date</p>
                    <div className="grid grid-cols-5 gap-2">
                      {(["tt1", "tt2", "tt3", "tt4", "tt5"] as const).map((key, i) => (
                        <div key={key} className="bg-[#e8f4fd] rounded-xl p-2 text-center">
                          <p className="text-[#004b96] font-bold text-xs mb-2">TT{i + 1}</p>
                          <TTSelector value={mr[key] ?? ""} onChange={(v) => setMr(key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      ["Blood Type", "bloodType", "bloodTypeDate"],
                      ["FBS / RBS / A1C", "fbsRbsHba1c", "fbsRbsHba1cDate"],
                      ["HBsAg", "hbsag", "hbsagDate"],
                      ["Hemoglobin", "hemoglobinPrenatal", "hemoglobinPrenatalDate"],
                      ["HIV", "hiv", "hivDate"],
                      ["Syphilis", "syphilis", "syphilisDate"],
                      ["Tuberculosis", "tuberculosis", "tuberculosisDate"],
                      ["Urinalysis", "urinalysisPrenatal", "urinalysisPrenatalDate"],
                      ["Other Tests", "otherTestsPrenatal", "otherTestsPrenatalDate"],
                    ] as const).map(([label, resultKey, dateKey]) => (
                      <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Result Date</label>
                            <input
                              type="date"
                              className={inputCls}
                              value={toDateInput(String(mr[dateKey] || ""))}
                              max={today}
                              onChange={(e) => setMr(dateKey, clampToToday(e.target.value) as never)}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Result</label>
                            <input
                              className={inputCls}
                              value={String(mr[resultKey] || "")}
                              onChange={(e) => setMr(resultKey, e.target.value as never)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* POSTNATAL CARE */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <SectionTitle>Postnatal Care</SectionTitle>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className={labelCls}>Date of Delivery</label>
                      <input
                        type="date"
                        className={inputCls}
                        value={toDateInput(mr.dateOfDelivery || "")}
                        max={today}
                        onChange={(e) => setMr("dateOfDelivery", clampToToday(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Place of Delivery</label>
                      <input className={inputCls} value={mr.postnatalPlaceOfDelivery ?? ""} onChange={(e) => setMr("postnatalPlaceOfDelivery", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Type of Delivery</label>
                      <input className={inputCls} value={mr.typeOfDelivery ?? ""} onChange={(e) => setMr("typeOfDelivery", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Outcome of Pregnancy</label>
                      <input className={inputCls} value={mr.outcomeOfPregnancy ?? ""} onChange={(e) => setMr("outcomeOfPregnancy", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Attended By</label>
                      <input className={inputCls} value={mr.attendedBy ?? ""} onChange={(e) => setMr("attendedBy", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Complications</label>
                      <input className={inputCls} value={mr.complications ?? ""} onChange={(e) => setMr("complications", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Sex of Newborn</label>
                      <input className={inputCls} value={mr.sexOfNewborn ?? ""} onChange={(e) => setMr("sexOfNewborn", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Birthweight</label>
                      <input className={inputCls} value={mr.birthweight ?? ""} onChange={(e) => setMr("birthweight", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
                      <Toggle value={!!mr.hemoglobinDone} onChange={(v) => setMr("hemoglobinDone", v)} label="Hemoglobin" />
                      <div>
                        <label className={labelCls}>Result</label>
                        <input className={inputCls} value={mr.hemoglobinPostnatal ?? ""} onChange={(e) => setMr("hemoglobinPostnatal", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.hemoglobinPostnatalDate || "")}
                          max={today}
                          onChange={(e) => setMr("hemoglobinPostnatalDate", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
                      <Toggle value={!!mr.vitaminA} onChange={(v) => setMr("vitaminA", v)} label="Vitamin A" />
                      <div>
                        <label className={labelCls}>Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.vitaminADate || "")}
                          max={today}
                          onChange={(e) => setMr("vitaminADate", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
                      <Toggle value={!!mr.breastfeeding} onChange={(v) => setMr("breastfeeding", v)} label="Breastfeeding" />
                      <div>
                        <label className={labelCls}>Date Initiated</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.breastfeedingDateInitiated || "")}
                          max={today}
                          onChange={(e) => setMr("breastfeedingDateInitiated", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
                      <Toggle value={!!mr.counseling} onChange={(v) => setMr("counseling", v)} label="Counseling" />
                      <div>
                        <label className={labelCls}>Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={toDateInput(mr.counselingDate || "")}
                          max={today}
                          onChange={(e) => setMr("counselingDate", clampToToday(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <Toggle value={!!mr.dentistPostnatalYes} onChange={(v) => setMr("dentistPostnatalYes", v)} label="Seen by Dentist" />
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {([
                          ["dentistPostnatalVisits1", "1st Trimester"],
                          ["dentistPostnatalVisits2", "2nd Trimester"],
                          ["dentistPostnatalVisits3", "3rd Trimester"],
                        ] as const).map(([key, label]) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input
                              type="number"
                              min={0}
                              className={inputCls}
                              value={mr[key] ?? 0}
                              onChange={(e) => setMr(key, parseInt(e.target.value) || 0)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <Toggle value={!!mr.physicianPostnatalYes} onChange={(v) => setMr("physicianPostnatalYes", v)} label="Seen by Physician" />
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {([
                          ["physicianPostnatalVisits1", "1st Trimester"],
                          ["physicianPostnatalVisits2", "2nd Trimester"],
                          ["physicianPostnatalVisits3", "3rd Trimester"],
                        ] as const).map(([key, label]) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input
                              type="number"
                              min={0}
                              className={inputCls}
                              value={mr[key] ?? 0}
                              onChange={(e) => setMr(key, parseInt(e.target.value) || 0)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      ["Blood Type", "bloodTypePostnatal", "bloodTypePostnatalDate"],
                      ["FBS / RBS / A1C", "fbsRbsHba1cPostnatal", "fbsRbsHba1cPostnatalDate"],
                      ["HBsAg", "hbsagPostnatal", "hbsagPostnatalDate"],
                      ["Hemoglobin", "hemoglobinLabPostnatal", "hemoglobinLabPostnatalDate"],
                      ["HIV", "hivPostnatal", "hivPostnatalDate"],
                      ["Syphilis", "syphilisPostnatal", "syphilisPostnatalDate"],
                      ["Tuberculosis", "tuberculosisPostnatal", "tuberculosisPostnatalDate"],
                      ["Urinalysis", "urinalysisPostnatal", "urinalysisPostnatalDate"],
                      ["Other Tests", "otherTestsPostnatal", "otherTestsPostnatalDate"],
                    ] as const).map(([label, resultKey, dateKey]) => (
                      <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Result Date</label>
                            <input
                              type="date"
                              className={inputCls}
                              value={toDateInput(String(mr[dateKey] || ""))}
                              max={today}
                              onChange={(e) => setMr(dateKey, clampToToday(e.target.value) as never)}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Result</label>
                            <input
                              className={inputCls}
                              value={String(mr[resultKey] || "")}
                              onChange={(e) => setMr(resultKey, e.target.value as never)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 flex items-center justify-end border-t border-gray-100 flex-shrink-0">
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-[#004b96] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#003a75] transition-colors"
          >
            <Save size={15} />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
