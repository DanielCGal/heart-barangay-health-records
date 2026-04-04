import { useState, useRef, useEffect } from "react";
import { CheckCircle2, ChevronDown, AlertCircle, Loader2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Patient } from "./mockData";
import * as patientsService from "../../api/patients.service";
import { addLogbookEntry } from "../../api/logbook.service";
import { useAuth } from "../../context/AuthContext";


type RegistrationTab = "ITR_6" | "ITR_5" | "ITMR" | "PCV";

// ── Shared exam types ──────────────────────────────────────────────────────
interface ExamSection { normal: boolean; findings: string[]; other: string; }
interface PhysicalExamForm {
  sheent: ExamSection; chest: ExamSection; heart: ExamSection;
  abdomen: ExamSection; genitourinary: ExamSection;
  extremities: ExamSection; neurological: ExamSection;
}
const blankExam = (): ExamSection => ({ normal: true, findings: [], other: "" });
const blankPhysicalExam = (): PhysicalExamForm => ({
  sheent: blankExam(), chest: blankExam(), heart: blankExam(),
  abdomen: blankExam(), genitourinary: blankExam(),
  extremities: blankExam(), neurological: blankExam(),
});

const SHEENT_OPTIONS      = ["Pallor/Cyanosis","Poor Skin Turgor","Sunken Eyeball","Sunken Fontanelle","Icteric Sclerae","Pale Conjunctivae","Poor Vision","Deafness","Ear Discharges","Nasal Congestion","Lymphadenopathy","Dental Caries","Neck Mass"];
const CHEST_OPTIONS       = ["Asymmetrical Expansion","Chest Retraction","Breast Discharge/Lump","Crackles/Rales/Wheeze"];
const HEART_OPTIONS       = ["Precordial Bulge","Chest Pain","Orthopnea"];
const ABDOMEN_OPTIONS     = ["Bloody Stool","Nausea","Constipation","Anorexia"];
const GU_OPTIONS          = ["Frequency/Urgency","Dysuria/Polyuria","Abnormal Discharge","Bloody Discharge"];
const EXTREMITIES_OPTIONS = ["Nail Clubbing","Back/Joint Pain","Joint Swelling","Lymphedema"];
const NEURO_OPTIONS       = ["Abnormal Gait","Tremor/Seizure","Numbness/Weakness","Anxiety/Depression"];
const FAMILY_CONDITIONS   = ["Asthma/Allergies","Birth Defects","Cancer","Dementia","Diabetes","Hypertension","Lung Disease","Mental Illness"];

const PROGRAM_OPTIONS_ITR6 = [
  "Family Planning",
  "National Immunization",
  "National Tuberculosis",
  "Cardiovascular Disease",
  "Consultation",
  "Geriatric Screening",
  "Vaccination",
];

const PROGRAM_OPTIONS_ITR5 = [
  "National Immunization",
  "National Tuberculosis",
  "Consultation",
  "Geriatric Screening",
  "Vaccination",
];

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

const CIVIL_STATUS_OPTIONS = ["Single", "Married", "Widowed", "Separated"];

const PUROK_OPTIONS = [
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

const MONTHS_REG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TT_YEARS_REG = Array.from({ length: 17 }, (_, i) => String(2026 - i));
function parseTTReg(tt: string): { month: string; year: string } {
  if (!tt) return { month: "", year: "" };
  const parts = tt.trim().split(" ");
  return { month: parts[0] || "", year: parts[1] || "" };
}
function formatTTReg(month: string, year: string): string {
  if (month && year) return `${month} ${year}`;
  return month || year || "";
}

function clampMiddleInitial(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").slice(0, 2);
}

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

function calculateAgeFromBirthday(birthday: string): { years: string; months: string } {
  if (!birthday) return { years: "", months: "" };

  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return { years: "", months: "" };

  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  const days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return { years: "", months: "" };
  }

  return {
    years: String(years),
    months: String(years === 0 ? months : 0),
  };
}

function getTodayLocalDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clampContactNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

function clampToToday(date: string): string {
  if (!date) return "";
  const today = getTodayLocalDate();
  return date > today ? today : date;
}

function UnitSuffixInput({
  value,
  onChange,
  suffix,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  placeholder?: string;
}) {
  const rawValue = value.replace(new RegExp(`\\s*${suffix}\\s*$`, "i"), "").trim();

  return (
    <div className="flex items-center border-b border-gray-400 focus-within:border-[#004b96]">
      <input
        className="flex-1 bg-transparent text-sm focus:outline-none py-0.5 placeholder-gray-400"
        value={rawValue}
        inputMode={suffix.toLowerCase() === "mmhg" ? "numeric" : "decimal"}
        onChange={(e) => {
          let cleaned = e.target.value;

          if (suffix.toLowerCase() === "mmhg") {
            cleaned = cleaned
              .replace(/[^0-9/]/g, "")   // allow only digits and /
              .replace(/\/{2,}/g, "/");  // prevent double //

            const parts = cleaned.split("/");
            if (parts.length > 2) {
              cleaned = `${parts[0]}/${parts[1]}`;
            }
          } else {
            cleaned = cleaned
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
          }

          onChange(cleaned ? `${cleaned} ${suffix}` : "");
        }}
        placeholder={placeholder}
      />
      <span className="text-sm text-gray-500 ml-2 flex-shrink-0">{suffix}</span>
    </div>
  );
}

// ── Co-morbidity state ─────────────────────────────────────────────────────
interface CoMorbState {
  hasAny: boolean;
  // Adult-only conditions
  hypertension: boolean;
  diabetes: boolean;
  stiHiv: boolean;
  heartDisease: boolean;
  kidneyFailure: boolean;
  tb: boolean;
  // All ages
  allergies: boolean; allergiesSpecify: string;
  cancer: boolean; cancerSpecify: string;
  others: boolean; othersSpecify: string;
}
const blankCoMorb = (): CoMorbState => ({
  hasAny: false,
  hypertension: false, diabetes: false, stiHiv: false,
  heartDisease: false, kidneyFailure: false, tb: false,
  allergies: false, allergiesSpecify: "",
  cancer: false, cancerSpecify: "", others: false, othersSpecify: "",
});

// ── ITR 6 form ─────────────────────────────────────────────────────────────
interface ITR6Form {
  lastName: string; firstName: string; mi: string;
  ageYears: string; ageMonths: string;
  sex: string; birthday: string; religion: string;
  barangay: string; city: string; address: string;
  civilStatus: string;
  educationalAttainment: string;
  occupation: string;
  contactNumber: string;
  spouseName: string;
  spouseOccupation: string;
  spouseContact: string;
  coMorb: CoMorbState; maintenanceMed: string; previousIllnesses: string;
  familyHistory: string[]; familyHistoryOther: string;
  eatsHealthy: boolean; adequateActivity: boolean; sufficientRest: boolean;
  normalGrowth: boolean; multiplePartners: boolean;
  smokesTobacco: boolean; tobaccoPacks: string;
  drinksAlcohol: boolean; alcoholBottles: string;
  illegalDrugs: boolean; illegalDrugsSpecify: string;
  physicalExam: PhysicalExamForm;
  agreedToTerms: boolean;
  bloodPressure: string;
  weight: string;
  height: string;
  lastVisit: string;
  programs: string[];
  purok: string;
  children: string;
  familyPlanning: boolean;
  vitamins: boolean;
  bcgVaccine: "YES" | "NO" | "N/A";
  hepBVaccine: "YES" | "NO" | "N/A";
  vitaminK: "YES" | "NO" | "N/A";
  familyPlanningProgramInfo: FamilyPlanningProgramInfo;
cardiovascularDiseaseProgramInfo: CardiovascularDiseaseProgramInfo;
}

interface FamilyPlanningProgramInfo {
  takeCocPills: boolean;
  cocPillsLastDateTaken: string;
  takePopPills: boolean;
  popPillsLastDateTaken: string;
  usedCondoms: boolean;
  injectables: boolean;
  iudPostpartum: boolean;
  iudInterval: boolean;
  haveImplant: boolean;
  btl: boolean;
  vasectomy: boolean;
  lam: boolean;
  knowCalendarMethod: boolean;
}

interface CardiovascularDiseaseProgramInfo {
  takenLosartan50mg: boolean;
  losartan50mgLastDateTaken: string;
  takenLosartan100mg: boolean;
  losartan100mgLastDateTaken: string;
  takenAmlodipine10mg: boolean;
  amlodipine10mgLastDateTaken: string;
  takenAmlodipine5mg: boolean;
  amlodipine5mgLastDateTaken: string;
  takenMetformin500mg: boolean;
  metformin500mgLastDateTaken: string;
  takenAtorvastatin20mg: boolean;
  atorvastatin20mgLastDateTaken: string;
  takenAtorvastatin40mg: boolean;
  atorvastatin40mgLastDateTaken: string;
  takenMetoprolol50mg: boolean;
  metoprolol50mgLastDateTaken: string;
  takenGliclazide30mg: boolean;
  gliclazide30mgLastDateTaken: string;
}

const blankITR6 = (): ITR6Form => ({
  lastName: "", firstName: "", mi: "", ageYears: "", ageMonths: "",
  sex: "", birthday: "", religion: "", barangay: "", city: "", address: "",
  civilStatus: "",
  educationalAttainment: "",
  occupation: "",
  contactNumber: "",
  spouseName: "",
  spouseOccupation: "",
  spouseContact: "",
  coMorb: blankCoMorb(), maintenanceMed: "", previousIllnesses: "",
  familyHistory: [], familyHistoryOther: "",
  eatsHealthy: false, adequateActivity: false, sufficientRest: false,
  normalGrowth: false, multiplePartners: false,
  smokesTobacco: false, tobaccoPacks: "",
  drinksAlcohol: false, alcoholBottles: "",
  illegalDrugs: false, illegalDrugsSpecify: "",
  physicalExam: blankPhysicalExam(),
  agreedToTerms: false,
  bloodPressure: "",
  weight: "",
  height: "",
  lastVisit: "",
  programs: [],
  purok: "",
  children: "0",
  familyPlanning: false,
  vitamins: false,
  bcgVaccine: "N/A",
  hepBVaccine: "N/A",
  familyPlanningProgramInfo: blankFamilyPlanningProgramInfo(),
cardiovascularDiseaseProgramInfo: blankCardiovascularDiseaseProgramInfo(),
  vitaminK: "N/A",
});

// ── ITR 5 form ─────────────────────────────────────────────────────────────
interface ITR5Form {
  lastName: string; firstName: string; mi: string;
  ageYears: string; ageMonths: string;
  sex: string; birthday: string; religion: string;
  barangay: string; city: string; address: string;
  civilStatus: string;
  educationalAttainment: string;
  occupation: string;
  contactNumber: string;
  coMorb: CoMorbState; maintenanceMed: string; previousIllnesses: string;
  typeOfDelivery: string;
  birthWeight: string; birthHeight: string; currentWeight: string; currentHeight: string;
  bcgVaccine: boolean; bcgDate: string;
  hepBVaccine: boolean; hepBDate: string;
  vitaminK: boolean; vitaminKDate: string;
  motherTetanusShots: string;
  newbornScreening: boolean; screeningDate: string; screeningResults: string;
  initiatedBreastfeeding: boolean; breastfeedingDate: string;
  placeOfDelivery: string;
  familyHistory: string[]; familyHistoryOther: string;
  livesWithFamily: boolean; uneventfulBirth: boolean; normalGrowth: boolean;
  normalMoods: boolean; normalInterestFamily: boolean; normalInterestWork: boolean;
  adequateActivity: boolean; sufficientRest: boolean; socialOther: string;
  physicalExam: PhysicalExamForm;
  agreedToTerms: boolean;
  bloodPressure: string;
  weight: string;
  height: string;
  lastVisit: string;
  programs: string[];
  purok: string;
  children: string;
  familyPlanning: boolean;
  vitamins: boolean;
  bcgVaccineStatus: "YES" | "NO" | "N/A";
  hepBVaccineStatus: "YES" | "NO" | "N/A";
  vitaminKStatus: "YES" | "NO" | "N/A";
}
const blankITR5 = (): ITR5Form => ({
  lastName: "",
  firstName: "",
  mi: "",
  ageYears: "",
  ageMonths: "",
  sex: "",
  birthday: "",
  religion: "",
  barangay: "",
  city: "",
  address: "",
  civilStatus: "Single",
  educationalAttainment: "",
  occupation: "",
  contactNumber: "",
  coMorb: blankCoMorb(),
  maintenanceMed: "",
  previousIllnesses: "",
  typeOfDelivery: "",
  birthWeight: "",
  birthHeight: "",
  currentWeight: "",
  currentHeight: "",
  bcgVaccine: false,
  bcgDate: "",
  hepBVaccine: false,
  hepBDate: "",
  vitaminK: false,
  vitaminKDate: "",
  motherTetanusShots: "",
  newbornScreening: false,
  screeningDate: "",
  screeningResults: "",
  initiatedBreastfeeding: false,
  breastfeedingDate: "",
  placeOfDelivery: "",
  familyHistory: [],
  familyHistoryOther: "",
  livesWithFamily: false,
  uneventfulBirth: false,
  normalGrowth: false,
  normalMoods: false,
  normalInterestFamily: false,
  normalInterestWork: false,
  adequateActivity: false,
  sufficientRest: false,
  socialOther: "",
  physicalExam: blankPhysicalExam(),
  agreedToTerms: false,
  bloodPressure: "",
  weight: "",
  height: "",
  lastVisit: "",
  programs: [],
  purok: "",
  children: "",
  familyPlanning: false,
  vitamins: false,
  bcgVaccineStatus: "N/A",
  hepBVaccineStatus: "N/A",
  vitaminKStatus: "N/A",
});

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


// ── ITMR form ──────────────────────────────────────────────────────────────
interface ITMRForm {
  patientName: string;

  // OB-GYNE HISTORY
  gravida: string;
  para: string;
  fullTerm: string;
  preterm: string;
  abortion: string;
  living: string;

  menarcheAge: string;
  menstrualCycle: "Regular" | "Irregular";
  menstrualFlowDays: string;
  coitarcheAge: string;
  currentFpMethod: string;

  papSmear: boolean;
  papSmearDate: string;
  papSmearResult: string;

  via: boolean;
  viaDate: string;
  viaResult: string;

  historyOfSti: boolean;
  stiDate: string;
  stiResult: string;

  // PRENATAL CARE
  riskCode: string;
  motherBabyBook: boolean;
  lmp: string;
  edd: string;
  planToDeliverAt: string;
  ageOfGestation: string;
  accompanyingPerson: string;

  seenByDentist: boolean;
  dentistDate: string;

  seenByPhysician: boolean;
  physicianDate: string;

  tt1: string;
  tt2: string;
  tt3: string;
  tt4: string;
  tt5: string;

  iodizedSalt: boolean;
  ironSupplement: boolean;

  // prenatal labs
  bloodType: string;
  bloodTypeDate: string;
  fbsRbsHba1c: string;
  fbsRbsHba1cDate: string;
  hbsag: string;
  hbsagDate: string;
  hemoglobinPrenatal: string;
  hemoglobinPrenatalDate: string;
  hiv: string;
  hivDate: string;
  syphilis: string;
  syphilisDate: string;
  tuberculosis: string;
  tuberculosisDate: string;
  urinalysisPrenatal: string;
  urinalysisPrenatalDate: string;
  otherTestsPrenatal: string;
  otherTestsPrenatalDate: string;

  // POSTNATAL CARE
  dateOfDelivery: string;
  postnatalPlaceOfDelivery: string;
  typeOfDelivery: "" | "Normal" | "Caesarian Section";
  outcomeOfPregnancy: string;
  attendedBy: string;
  complications: string;
  sexOfNewborn: "" | "Female" | "Male";
  birthweight: string;

  hemoglobinDone: boolean;
  hemoglobinPostnatal: string;
  hemoglobinPostnatalDate: string;

  breastfeeding: boolean;
  breastfeedingDateInitiated: string;

  vitaminA: boolean;
  vitaminADate: string;

  counseling: boolean;
  counselingDate: string;

  dentistPostnatalYes: boolean;
  dentistPostnatalVisits1: string;
  dentistPostnatalVisits2: string;
  dentistPostnatalVisits3: string;

  physicianPostnatalYes: boolean;
  physicianPostnatalVisits1: string;
  physicianPostnatalVisits2: string;
  physicianPostnatalVisits3: string;

  bloodTypePostnatal: string;
  bloodTypePostnatalDate: string;
  fbsRbsHba1cPostnatal: string;
  fbsRbsHba1cPostnatalDate: string;
  hbsagPostnatal: string;
  hbsagPostnatalDate: string;
  hemoglobinLabPostnatal: string;
  hemoglobinLabPostnatalDate: string;
  hivPostnatal: string;
  hivPostnatalDate: string;
  syphilisPostnatal: string;
  syphilisPostnatalDate: string;
  tuberculosisPostnatal: string;
  tuberculosisPostnatalDate: string;
  urinalysisPostnatal: string;
  urinalysisPostnatalDate: string;
  otherTestsPostnatal: string;
  otherTestsPostnatalDate: string;

  agreedToTerms: boolean;
}
const blankITMR = (): ITMRForm => ({
  patientName: "",

  gravida: "",
  para: "",
  fullTerm: "",
  preterm: "",
  abortion: "",
  living: "",

  menarcheAge: "",
  menstrualCycle: "Regular",
  menstrualFlowDays: "",
  coitarcheAge: "",
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

  seenByPhysician: false,
  physicianDate: "",

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

  breastfeeding: false,
  breastfeedingDateInitiated: "",

  vitaminA: false,
  vitaminADate: "",

  counseling: false,
  counselingDate: "",

  dentistPostnatalYes: false,
  dentistPostnatalVisits1: "",
  dentistPostnatalVisits2: "",
  dentistPostnatalVisits3: "",

  physicianPostnatalYes: false,
  physicianPostnatalVisits1: "",
  physicianPostnatalVisits2: "",
  physicianPostnatalVisits3: "",

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

  agreedToTerms: false,
});

// ── Shared styled atoms ────────────────────────────────────────────────────
const IC = "w-full border-b border-gray-400 bg-transparent text-sm focus:outline-none focus:border-[#004b96] py-0.5 placeholder-gray-400";
const LC = "text-[10px] font-semibold text-gray-500 uppercase tracking-wide";

function SectionBox({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut", delay }}
      className="border border-black/15 rounded-xl p-4 mb-4"
    >
      <p className="font-bold text-[#004b96] text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#004b96]/20">
        {title}
      </p>
      {children}
    </motion.div>
  );
}

function YesNoRow({
  label, value, onChange,
}: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-700">{label}</span>
      <div className="flex gap-3">
        {[true, false].map((opt) => (
          <label key={String(opt)} className="flex items-center gap-1 cursor-pointer select-none">
            <div
              onClick={() => onChange(opt)}
              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                value === opt ? "border-[#004b96] bg-[#004b96]" : "border-gray-400"
              }`}
            >
              {value === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-[10px] font-semibold text-gray-500">{opt ? "YES" : "NO"}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function LabResultCard({
  label,
  value,
  dateValue,
  onValueChange,
  onDateChange,
  today,
}: {
  label: string;
  value: string;
  dateValue: string;
  onValueChange: (value: string) => void;
  onDateChange: (value: string) => void;
  today: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <p className="text-xs font-semibold text-gray-700 mb-3">{label}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={LC}>Result Date:</label>
          <input
            className={IC}
            type="date"
            value={dateValue}
            max={today}
            onChange={(e) => onDateChange(clampToToday(e.target.value))}
          />
        </div>

        <div>
          <label className={LC}>Result:</label>
          <input
            className={IC}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function ExamSystemField({
  title, data, options, onChange,
}: { title: string; data: ExamSection; options: string[]; onChange: (d: ExamSection) => void }) {
  const toggleFinding = (opt: string) => {
    const has = data.findings.includes(opt);
    const next = has ? data.findings.filter((f) => f !== opt) : [...data.findings, opt];
    onChange({ ...data, normal: next.length === 0, findings: next });
  };
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{title}</span>
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-semibold text-green-700">
          <input
            type="checkbox"
            checked={data.normal && data.findings.length === 0}
            onChange={(e) => onChange({ ...data, normal: e.target.checked, findings: e.target.checked ? [] : data.findings })}
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
              className={`px-2 py-0.5 rounded-full text-[10px] border transition-all ${
                active ? "bg-[#004b96] text-white border-[#004b96]" : "bg-gray-50 text-gray-500 border-gray-300 hover:border-[#004b96]/50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!data.normal && (
        <div className="mt-2">
          <label className={LC}>Others, specify:</label>
          <input className={IC} value={data.other} onChange={(e) => onChange({ ...data, other: e.target.value })} placeholder="Describe…" />
        </div>
      )}
    </div>
  );
}

function CoMorbSection({ data, onChange, isAdult = false }: { data: CoMorbState; onChange: (d: CoMorbState) => void; isAdult?: boolean }) {
  return (
    <div>
      <YesNoRow label="CO-MORBIDITIES" value={data.hasAny} onChange={(v) => onChange({ ...data, hasAny: v })} />
      {data.hasAny && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-[#004b96]/20 pl-3">
          {isAdult && (
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Select applicable conditions:</p>
              <div className="flex flex-wrap gap-1.5">
                {([
                  ["hypertension", "Hypertension"],
                  ["diabetes", "Diabetes"],
                  ["stiHiv", "STI/HIV"],
                  ["heartDisease", "Heart Disease"],
                  ["kidneyFailure", "Kidney Failure"],
                  ["tb", "TB"],
                ] as const).map(([key, label]) => {
                  const checked = data[key] as boolean;
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        checked ? "bg-[#004b96] text-white border-[#004b96]" : "bg-white text-gray-600 border-gray-200 hover:border-[#004b96]/50"
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange({ ...data, [key]: e.target.checked })} />
                      <span className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${checked ? "bg-white border-white" : "border-current"}`}>
                        {checked && <svg viewBox="0 0 10 10" className="w-2 h-2 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.5 5l2.5 2.5 4.5-4.5" /></svg>}
                      </span>
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <YesNoRow label="Allergies" value={data.allergies} onChange={(v) => onChange({ ...data, allergies: v })} />
            {data.allergies && (
              <div className="mt-1 ml-4"><label className={LC}>Specify:</label>
                <input className={IC} value={data.allergiesSpecify} onChange={(e) => onChange({ ...data, allergiesSpecify: e.target.value })} placeholder="e.g. Penicillin" />
              </div>
            )}
          </div>
          <div>
            <YesNoRow label="Cancer" value={data.cancer} onChange={(v) => onChange({ ...data, cancer: v })} />
            {data.cancer && (
              <div className="mt-1 ml-4"><label className={LC}>Specify:</label>
                <input className={IC} value={data.cancerSpecify} onChange={(e) => onChange({ ...data, cancerSpecify: e.target.value })} placeholder="Type of cancer…" />
              </div>
            )}
          </div>
          <div>
            <YesNoRow label="Others" value={data.others} onChange={(v) => onChange({ ...data, others: v })} />
            {data.others && (
              <div className="mt-1 ml-4"><label className={LC}>Specify:</label>
                <input className={IC} value={data.othersSpecify} onChange={(e) => onChange({ ...data, othersSpecify: e.target.value })} placeholder="Other conditions…" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FamilyHistorySection({
  selected, other,
  onToggle, onOtherChange,
}: { selected: string[]; other: string; onToggle: (c: string) => void; onOtherChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      {FAMILY_CONDITIONS.map((cond) => {
        const checked = selected.includes(cond);
        return (
          <label key={cond} className="flex items-center gap-2 cursor-pointer py-1 border-b border-gray-100 last:border-0">
            <div
              onClick={() => onToggle(cond)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                checked ? "bg-[#004b96] border-[#004b96]" : "border-gray-400"
              }`}
            >
              {checked && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span className="text-xs text-gray-700 flex-1">{cond}</span>
            <div className="flex gap-3">
              <span className={`text-[10px] font-bold ${checked ? "text-[#004b96]" : "text-gray-300"}`}>YES</span>
              <span className={`text-[10px] font-bold ${!checked ? "text-gray-500" : "text-gray-300"}`}>NO</span>
            </div>
          </label>
        );
      })}
      <div className="pt-1">
        <label className={LC}>Other, Specify:</label>
        <input className={IC} value={other} onChange={(e) => onOtherChange(e.target.value)} placeholder="e.g. Heart disease history" />
      </div>
    </div>
  );
}

type ConsentLanguage = "ENGLISH" | "BISAYA";

interface ConsentModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

const PRIVACY_NOTICE_TEXT = {
  ENGLISH: {
    heading: "BARANGAY GOV. PACIANO BANGOY",
    subheading: "HEART: Health Electronic Archiving & Records Tracker",
    body: `The Barangay Governor Paciano Bangoy (Health Center) values the privacy and security of your personal data which shall be used to facilitate your Health Center Queuing Ticket. Rest assured that all personal and sensitive information that you may provide is kept secure and confidential in compliance with Republic Act No. 10173 otherwise known as the Data Privacy Act of 2012.`,
    acknowledgement:
      "By proceeding, I acknowledge that I have read and understood this Privacy Notice and consent to the collection, use, storage, and processing of my personal data in accordance with applicable laws and health center policies.",
    button: "I Agree",
    languageLabel: "Language",
  },
  BISAYA: {
    heading: "BARANGAY GOV. PACIANO BANGOY",
    subheading: "HEART: Health Electronic Archiving & Records Tracker",
    body: `Ang Barangay Governor Paciano Bangoy (Health Center) naghatag ug dakong bili sa pagpanalipod ug kaluwasan sa imong personal nga datos nga gamiton aron mapadali ang imong Health Center Queuing Ticket. Gipasalig namo nga ang tanang personal ug sensitibong impormasyon nga imong ihatag pagabantayan ug tipigan nga luwas ug kompidensiyal subay sa Republic Act No. 10173 o ang Data Privacy Act of 2012.`,
    acknowledgement:
      "Pinaagi sa pagpadayon, akong giila nga nabasa ug nasabtan nako kining Privacy Notice ug mitugot ko sa pagkolekta, paggamit, pagtipig, ug pagproseso sa akong personal nga datos subay sa balaod ug mga polisiya sa health center.",
    button: "Mouyon Ko",
    languageLabel: "Pinulongan",
  },
};

const PATIENT_CONSENT_TEXT = {
  ENGLISH: {
    title: "PATIENT CONSENT FORM",
    intro:
      "I have read and understood the Individual Treatment Record (ITR) after being informed of its contents. During the informative conversation, I was comprehensively advised about the need for and importance of the Primary Care Package benefits package (PCB), Konsulta Program, eKonsulta System, Integrated Clinic Information System (iClinicSys), and the Department of Health (DOH) National Health Data Reporting, PhilHealth Information Exchange (PHIE Lite), and PhilHealth Konsulta Program.",
    paragraph2:
      "I permit the DOH/UHC to encode the information concerning my health and the protected data regarding my health status and consultations conducted by the same on the information systems mentioned above, and to process and share the same to the DOH National Health Data Reporting, PhilHealth Information Exchange (PHIE Lite), and PhilHealth Konsulta Program for lawful health service delivery, monitoring, reporting, and benefit administration.",
    paragraph3:
      "I am made aware of the applicable fees to be paid through the City Treasurer’s Office for the applicable services listed in Annex A of City Ordinance No. 02917-17, otherwise known as the 2017 Revenue Code of the City of Davao.",
    paragraph4:
      "I wish to be informed about the medical results concerning me or my direct descendants. I can cancel my consent at the CHO/DOH/UHC anytime without giving reasons or any disadvantage to my medical treatment, subject to applicable legal and public health record retention requirements.",
  },
  BISAYA: {
    title: "PORMA SA PAGTUGOT SA PASYENTE",
    intro:
      "Ako nakabasa ug nakasabot sa Individual Treatment Record (ITR) human ko gipahibalo sa sulod niini. Sa panahon sa among panaghisgot, ako giyaanan ug gipahibalo pag-ayo mahitungod sa panginahanglan ug kahinungdanon sa Primary Care Package benefits package (PCB), Konsulta Program, eKonsulta System, Integrated Clinic Information System (iClinicSys), Department of Health (DOH) National Health Data Reporting, PhilHealth Information Exchange (PHIE Lite), ug PhilHealth Konsulta Program.",
    paragraph2:
      "Ako nagtugot sa DOH/UHC nga ma-encode ang impormasyon mahitungod sa akong kahimsog ug sa protektadong datos kabahin sa akong health status ug mga konsultasyon sa mga information systems nga gihisgutan sa taas, ug nga maproseso ug mapaambit ang maong datos ngadto sa DOH National Health Data Reporting, PhilHealth Information Exchange (PHIE Lite), ug PhilHealth Konsulta Program alang sa lehitimong paghatag og serbisyo sa panglawas, monitoring, reporting, ug pagdumala sa benepisyo.",
    paragraph3:
      "Ako gipahibalo sa mga bayronon nga may kalabutan sa mga serbisyo nga kinahanglan bayran pinaagi sa City Treasurer’s Office sumala sa Annex A sa City Ordinance No. 02917-17, nga nailhan isip 2017 Revenue Code of the City of Davao.",
    paragraph4:
      "Gusto ko mapahibalo bahin sa mga medikal nga resulta nga may kalabotan kanako o sa akong direktang mga kaliwat. Mahimo nakong kanselahon ang akong pagtugot sa CHO/DOH/UHC bisan kanus-a nga walay paghatag ug rason ug walay kadaut sa akong medikal nga pagpatambal, ubos sa mga balaod ug public health record retention requirements nga angay sundon.",
  },
};

function ConsentModal({ open, onClose }: ConsentModalProps) {
  const [language, setLanguage] = useState<ConsentLanguage>("ENGLISH");

  useEffect(() => {
    if (!open) setLanguage("ENGLISH");
  }, [open]);

  const privacy = PRIVACY_NOTICE_TEXT[language];
  const consent = PATIENT_CONSENT_TEXT[language];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[28px] border-4 border-[#1f3b73] bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto px-6 py-8 md:px-10">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#67c587] text-[#67c587]">
                  <Check size={26} />
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-600">
                    {privacy.languageLabel}:
                  </span>
                  <div className="inline-flex rounded-full border border-gray-300 p-1">
                    {(["ENGLISH", "BISAYA"] as ConsentLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                          language === lang
                            ? "bg-[#004b96] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#1f3b73]">{privacy.heading}</h2>
                <p className="text-sm font-semibold text-[#1f3b73]">{privacy.subheading}</p>
              </div>

              <div className="space-y-6 text-justify text-[15px] leading-7 text-[#24446c]">
                <div className="rounded-2xl border border-[#dbe5f1] p-5">
                  <p>{privacy.body}</p>
                  <p className="mt-4">{privacy.acknowledgement}</p>
                </div>

                <div className="rounded-2xl border border-[#dbe5f1] p-5">
                  <h3 className="mb-4 text-center text-lg font-bold text-[#1f3b73]">
                    {consent.title}
                  </h3>
                  <p>{consent.intro}</p>
                  <p className="mt-4">{consent.paragraph2}</p>
                  <p className="mt-4">{consent.paragraph3}</p>
                  <p className="mt-4">{consent.paragraph4}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-[#1677ff] px-10 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#0e63d6]"
                >
                  {privacy.button}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





function SaveBar({
  agreed,
  onAgree,
  onSave,
  onOpenConsent,
  saved,
  saving,
  error,
  disabled = false,
  disabledMessage = null,
}: {
  agreed: boolean;
  onAgree: () => void;
  onSave: () => void;
  onOpenConsent: () => void;
  saved: boolean;
  saving: boolean;
  error: string | null;
  disabled?: boolean;
  disabledMessage?: string | null;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {disabled && disabledMessage && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">{disabledMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <label className="flex items-start gap-2 text-xs cursor-pointer select-none flex-1 leading-5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={onAgree}
            className="mt-1 accent-[#004b96] flex-shrink-0"
          />

          <span className="text-xs text-gray-700">
            By checking this box, I confirm that I have read, understood, and voluntarily agreed to the{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenConsent();
              }}
              className="text-[#004b96] underline font-medium"
            >
              Privacy Notice and Patient Consent Form
            </button>
            . I give my consent to the collection, recording, use, storage, and processing of my personal and health-related data for patient registration, consultation, treatment, health program delivery, and other lawful public health purposes in accordance with applicable laws, regulations, and health center policies.
          </span>
        </label>

        <button
          onClick={onSave}
          disabled={!agreed || saving || disabled}
          className={`px-8 py-2 rounded-full font-bold text-sm text-white transition-all flex items-center gap-2 shrink-0 ${
            saved
              ? "bg-green-600"
              : agreed && !saving && !disabled
              ? "bg-[#004b96] hover:bg-[#003a75] shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saved ? "SAVED!" : saving ? "SAVING…" : "SAVE"}
        </button>
      </div>
    </div>
  );
}

// ── Patient name dropdown for ITMR ─────────────────────────────────────────
function PatientNameDropdown({ value, onChange, patients }: {
  value: string;
  onChange: (v: string) => void;
  patients: Patient[];
}) {
  const femalePatients = patients.filter((p) => p.sex === "Female");
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = femalePatients.filter((p) => {
    const full = `${p.firstName} ${p.lastName}`.toLowerCase();
    return full.includes(query.toLowerCase()) || query === "";
  });

  const select = (p: Patient) => {
    const full = `${p.firstName} ${p.lastName}`;
    setQuery(full);
    onChange(full);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <label className={LC}>NAME (Female Patients):</label>
      <div className="flex items-center border-b border-gray-400 focus-within:border-[#004b96]">
        <input
          className="flex-1 bg-transparent text-sm focus:outline-none py-0.5 placeholder-gray-400"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search patient name…"
        />
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#e8f4fd] transition-colors flex items-center justify-between gap-2"
            >
              <span className="font-medium text-gray-800">{p.firstName} {p.lastName}</span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{p.program}</span>
            </button>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && query && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 px-3 py-2 text-xs text-gray-400">
          No female patients found
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function PatientRegistration() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<RegistrationTab>("ITR_6");
  const [itr6, setItr6] = useState<ITR6Form>(blankITR6);
  const [itr5, setItr5] = useState<ITR5Form>(blankITR5);
  const [itmr, setItmr] = useState<ITMRForm>(blankITMR);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const today = getTodayLocalDate();
  const [consentModalOpen, setConsentModalOpen] = useState(false);

  const PRENATAL_LABS = [
  { label: "Blood Type", valueKey: "bloodType", dateKey: "bloodTypeDate" },
  { label: "FBS / RBS / A1C", valueKey: "fbsRbsHba1c", dateKey: "fbsRbsHba1cDate" },
  { label: "HBsAg", valueKey: "hbsag", dateKey: "hbsagDate" },
  { label: "Hemoglobin", valueKey: "hemoglobinPrenatal", dateKey: "hemoglobinPrenatalDate" },
  { label: "HIV", valueKey: "hiv", dateKey: "hivDate" },
  { label: "Syphilis", valueKey: "syphilis", dateKey: "syphilisDate" },
  { label: "Tuberculosis", valueKey: "tuberculosis", dateKey: "tuberculosisDate" },
  { label: "Urinalysis", valueKey: "urinalysisPrenatal", dateKey: "urinalysisPrenatalDate" },
  { label: "Other Tests", valueKey: "otherTestsPrenatal", dateKey: "otherTestsPrenatalDate" },
] as const satisfies ReadonlyArray<{
  label: string;
  valueKey: keyof ITMRForm;
  dateKey: keyof ITMRForm;
}>;

const POSTNATAL_LABS = [
  { label: "Blood Type", valueKey: "bloodTypePostnatal", dateKey: "bloodTypePostnatalDate" },
  { label: "FBS / RBS / A1C", valueKey: "fbsRbsHba1cPostnatal", dateKey: "fbsRbsHba1cPostnatalDate" },
  { label: "HBsAg", valueKey: "hbsagPostnatal", dateKey: "hbsagPostnatalDate" },
  { label: "Hemoglobin", valueKey: "hemoglobinLabPostnatal", dateKey: "hemoglobinLabPostnatalDate" },
  { label: "HIV", valueKey: "hivPostnatal", dateKey: "hivPostnatalDate" },
  { label: "Syphilis", valueKey: "syphilisPostnatal", dateKey: "syphilisPostnatalDate" },
  { label: "Tuberculosis", valueKey: "tuberculosisPostnatal", dateKey: "tuberculosisPostnatalDate" },
  { label: "Urinalysis", valueKey: "urinalysisPostnatal", dateKey: "urinalysisPostnatalDate" },
  { label: "Other Tests", valueKey: "otherTestsPostnatal", dateKey: "otherTestsPostnatalDate" },
] as const satisfies ReadonlyArray<{
  label: string;
  valueKey: keyof ITMRForm;
  dateKey: keyof ITMRForm;
}>;

  const itr6AgeYearsNum = parseInt(itr6.ageYears) || 0;
const itr5AgeYearsNum = parseInt(itr5.ageYears) || 0;

const itr6AgeInvalid = itr6.ageYears !== "" && itr6AgeYearsNum < 6;
const itr5AgeInvalid = itr5.ageYears !== "" && itr5AgeYearsNum > 5;

const itr6AgeMessage =
  itr6AgeInvalid
    ? "This form is for registration for 6 years old and above only."
    : null;

const itr5AgeMessage =
  itr5AgeInvalid
    ? "This form is for registration for 5 years old and below only."
    : null;

  // Load patients for the ITMR name dropdown
  useEffect(() => {
    patientsService.getPatients().then(setAllPatients).catch(console.error);
  }, []);

  const tabs: { key: RegistrationTab; label: string }[] = [
    { key: "ITR_6", label: "ITR FOR 6 YEARS OLD AND ABOVE" },
    { key: "ITR_5", label: "ITR FOR 5 YEARS OLD AND BELOW" },
    { key: "ITMR", label: "ADD NEW MATERNAL REGISTRATION" },
    { key: "PCV", label: "PCV" },
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────
  function buildCoMorbString(coMorb: CoMorbState, isAdult: boolean): string {
    if (!coMorb.hasAny) return "None";
    const list: string[] = [];
    if (isAdult) {
      if (coMorb.hypertension)  list.push("Hypertension");
      if (coMorb.diabetes)      list.push("Diabetes");
      if (coMorb.stiHiv)        list.push("STI/HIV");
      if (coMorb.heartDisease)  list.push("Heart Disease");
      if (coMorb.kidneyFailure) list.push("Kidney Failure");
      if (coMorb.tb)            list.push("TB");
    }
    if (coMorb.others && coMorb.othersSpecify) list.push(coMorb.othersSpecify);
    return list.length > 0 ? list.join(", ") : "None";
  }

  function buildPhysicalExam(pe: PhysicalExamForm): Patient["physicalExam"] {
    const map = (s: ExamSection) => ({
      essentiallyNormal: s.normal && s.findings.length === 0,
      findings: s.findings,
      othersSpecify: s.other,
    });
    return {
      sheent:           map(pe.sheent),
      chestBreastLungs: map(pe.chest),
      heart:            map(pe.heart),
      abdomen:          map(pe.abdomen),
      genitourinary:    map(pe.genitourinary),
      extremities:      map(pe.extremities),
      neurological:     map(pe.neurological),
    };
  }
  
  function mapITR6ToPatient(f: ITR6Form): Omit<Patient, "id"> {
    return {
      lastName:              f.lastName.trim(),
      firstName:             f.firstName.trim(),
      middleInitial:         f.mi.trim(),
      age:                   parseInt(f.ageYears) || 0,
      ageMonths:             0,
      sex:                   (f.sex as "Male" | "Female") || "Male",
      birthday:              f.birthday,
      religion:              f.religion,
      barangay:              f.barangay,
      city:                  f.city,
      address:               f.address,
      purok: f.purok,
      civilStatus:           f.civilStatus,
      contactNumber:         f.contactNumber,
      educationalAttainment: f.educationalAttainment,
      occupation:            f.occupation,
      spouseName:            f.spouseName.trim() || "N/A",
spouseOccupation:      f.spouseOccupation.trim() || "N/A",
spouseContact:         f.spouseContact.trim() || "N/A",
      program: joinPrograms(f.programs),
      familyPlanning: f.familyPlanning,
      vitamins: f.vitamins,
      children: parseInt(f.children) || 0,
      coMorbidities:         buildCoMorbString(f.coMorb, true),
      cancer:                f.coMorb.cancer ? (f.coMorb.cancerSpecify.trim() || "Cancer") : "None",
      allergies:             f.coMorb.allergies ? (f.coMorb.allergiesSpecify.trim() || "Yes") : "None",
      maintenanceMedication: f.maintenanceMed,
      previousIllnesses:     f.previousIllnesses,
      lastVisit: f.lastVisit || new Date().toISOString().split("T")[0],
      bloodPressure: f.bloodPressure,
      weight: f.weight,
height: f.height,
      bcgVaccine: f.bcgVaccine,
hepBVaccine: f.hepBVaccine,
vitaminK: f.vitaminK,
      familyHistoryConditions: f.familyHistory,
      familyHistoryOther:    f.familyHistoryOther,
      familyHistoryMother:   "N/A",
      personalSocialHistory: {
        eatsHealthyDiet:          f.eatsHealthy,
        adequatePhysicalActivity:  f.adequateActivity,
        sufficientRestSleep:       f.sufficientRest,
        normalGrowthDevelopment:   f.normalGrowth,
        multiplePartners:          f.multiplePartners,
        smokesTobacco:             f.smokesTobacco,
        tobaccoPacksPerYear:       parseFloat(f.tobaccoPacks) || 0,
        drinksAlcohol:             f.drinksAlcohol,
        alcoholBottlesPerYear:     parseFloat(f.alcoholBottles) || 0,
        takesIllegalDrugs:         f.illegalDrugs,
        illegalDrugsSpecify:       f.illegalDrugsSpecify,
      },
      physicalExam: buildPhysicalExam(f.physicalExam),
    };
  }

  // ── Mapper: ITR 5 → Patient ────────────────────────────────────────────────
  function mapITR5ToPatient(f: ITR5Form): Omit<Patient, "id"> {
  return {
    lastName:              f.lastName.trim(),
    firstName:             f.firstName.trim(),
    middleInitial:         f.mi.trim(),
    age:                   parseInt(f.ageYears) || 0,
    ageMonths:             parseInt(f.ageMonths) || 0,
    sex:                   (f.sex as "Male" | "Female") || "Male",
    birthday:              f.birthday,
    religion:              f.religion,
    barangay:              f.barangay,
    city:                  f.city,
    address:               f.address,
    purok: f.purok,
    civilStatus:           "Single",
    contactNumber:         f.contactNumber,
    educationalAttainment: f.educationalAttainment,
    occupation:            f.occupation,
    program: joinPrograms(f.programs),
    familyPlanning: false,
    vitamins: f.vitamins,
    children: 0,
    coMorbidities:         buildCoMorbString(f.coMorb, false),
    cancer:                f.coMorb.cancer ? (f.coMorb.cancerSpecify.trim() || "Cancer") : "None",
    allergies:             f.coMorb.allergies ? (f.coMorb.allergiesSpecify.trim() || "Yes") : "None",
    maintenanceMedication: f.maintenanceMed,
    previousIllnesses:     f.previousIllnesses,
    lastVisit: f.lastVisit || new Date().toISOString().split("T")[0],
    bloodPressure: f.bloodPressure,
    weight: f.weight || f.currentWeight || "",
height: f.height || f.currentHeight || "",
    typeOfDelivery:         f.typeOfDelivery,
    birthWeight:            f.birthWeight,
    birthHeight:            f.birthHeight,
    bcgVaccine: f.bcgVaccineStatus,
    bcgDate:                f.bcgDate,
    hepBVaccine: f.hepBVaccineStatus,
    hepBDate:               f.hepBDate,
    vitaminK: f.vitaminKStatus,
    vitaminKDate:           f.vitaminKDate,
    motherTetanusShots:     f.motherTetanusShots,
    newbornScreening:       f.newbornScreening,
    screeningDate:          f.screeningDate,
    screeningResults:       f.screeningResults,
    initiatedBreastfeeding: f.initiatedBreastfeeding,
    breastfeedingDate:      f.breastfeedingDate,
    placeOfDelivery:        f.placeOfDelivery,

    familyHistoryConditions: f.familyHistory,
    familyHistoryOther:    f.familyHistoryOther,
    familyHistoryMother:   "N/A",

    personalSocialHistory: {
      eatsHealthyDiet: false,
      adequatePhysicalActivity: f.adequateActivity,
      sufficientRestSleep: f.sufficientRest,
      normalGrowthDevelopment: f.normalGrowth,
      multiplePartners: false,
      smokesTobacco: false,
      tobaccoPacksPerYear: 0,
      drinksAlcohol: false,
      alcoholBottlesPerYear: 0,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
      livesWithImmediateFamily: f.livesWithFamily,
      uneventfulBirthAndInfancy: f.uneventfulBirth,
      normalMoodsAndAttitudes: f.normalMoods,
      normalInterestInFamilyAndFriends: f.normalInterestFamily,
      normalInterestInWorkAndPlay: f.normalInterestWork,
      socialOther: f.socialOther,
    },

    physicalExam: buildPhysicalExam(f.physicalExam),
  };
}

  // ── Mapper: ITMR → MaternalRecord ─────────────────────────────────────────
  function buildMaternalRecord(f: ITMRForm): NonNullable<Patient["maternalRecord"]> {
  return {
    gravida: parseInt(f.gravida) || 0,
    para: parseInt(f.para) || 0,
    fullTerm: parseInt(f.fullTerm) || 0,
    preterm: parseInt(f.preterm) || 0,
    abortion: parseInt(f.abortion) || 0,
    living: parseInt(f.living) || 0,

    menarcheAge: parseInt(f.menarcheAge) || 0,
    menstrualCycle: f.menstrualCycle,
    menstrualFlowDays: parseInt(f.menstrualFlowDays) || 0,
    coitarcheAge: parseInt(f.coitarcheAge) || 0,
    currentFpMethod: f.currentFpMethod,

    papSmear: f.papSmear,
    papSmearDate: f.papSmearDate,
    papSmearResult: f.papSmearResult,

    via: f.via,
    viaDate: f.viaDate,
    viaResult: f.viaResult,

    historyOfSti: f.historyOfSti,
    stiDate: f.stiDate,
    stiResult: f.stiResult,

    riskCode: f.riskCode,
    motherBabyBook: f.motherBabyBook,
    lmp: f.lmp,
    edd: f.edd,
    planToDeliverAt: f.planToDeliverAt,
    ageOfGestation: f.ageOfGestation,
    accompanyingPerson: f.accompanyingPerson,

    seenByDentist: f.seenByDentist,
    dentistDate: f.dentistDate,

    seenByPhysician: f.seenByPhysician,
    physicianDate: f.physicianDate,

    tt1: f.tt1,
    tt2: f.tt2,
    tt3: f.tt3,
    tt4: f.tt4,
    tt5: f.tt5,

    iodizedSalt: f.iodizedSalt,
    ironSupplement: f.ironSupplement,

    bloodType: f.bloodType,
    bloodTypeDate: f.bloodTypeDate,
    fbsRbsHba1c: f.fbsRbsHba1c,
    fbsRbsHba1cDate: f.fbsRbsHba1cDate,
    hbsag: f.hbsag,
    hbsagDate: f.hbsagDate,
    hemoglobinPrenatal: f.hemoglobinPrenatal,
    hemoglobinPrenatalDate: f.hemoglobinPrenatalDate,
    hiv: f.hiv,
    hivDate: f.hivDate,
    syphilis: f.syphilis,
    syphilisDate: f.syphilisDate,
    tuberculosis: f.tuberculosis,
    tuberculosisDate: f.tuberculosisDate,
    urinalysisPrenatal: f.urinalysisPrenatal,
    urinalysisPrenatalDate: f.urinalysisPrenatalDate,
    otherTestsPrenatal: f.otherTestsPrenatal,
    otherTestsPrenatalDate: f.otherTestsPrenatalDate,

    dateOfDelivery: f.dateOfDelivery,
    postnatalPlaceOfDelivery: f.postnatalPlaceOfDelivery,
    typeOfDelivery: f.typeOfDelivery,
    outcomeOfPregnancy: f.outcomeOfPregnancy,
    attendedBy: f.attendedBy,
    complications: f.complications,
    sexOfNewborn: f.sexOfNewborn,
    birthweight: f.birthweight,

    hemoglobinDone: f.hemoglobinDone,
    hemoglobinPostnatal: f.hemoglobinPostnatal,
    hemoglobinPostnatalDate: f.hemoglobinPostnatalDate,

    breastfeeding: f.breastfeeding,
    breastfeedingDateInitiated: f.breastfeedingDateInitiated,

    vitaminA: f.vitaminA,
    vitaminADate: f.vitaminADate,

    counseling: f.counseling,
    counselingDate: f.counselingDate,

    dentistPostnatalYes: f.dentistPostnatalYes,
    dentistPostnatalVisits1: parseInt(f.dentistPostnatalVisits1) || 0,
    dentistPostnatalVisits2: parseInt(f.dentistPostnatalVisits2) || 0,
    dentistPostnatalVisits3: parseInt(f.dentistPostnatalVisits3) || 0,

    physicianPostnatalYes: f.physicianPostnatalYes,
    physicianPostnatalVisits1: parseInt(f.physicianPostnatalVisits1) || 0,
    physicianPostnatalVisits2: parseInt(f.physicianPostnatalVisits2) || 0,
    physicianPostnatalVisits3: parseInt(f.physicianPostnatalVisits3) || 0,

    bloodTypePostnatal: f.bloodTypePostnatal,
    bloodTypePostnatalDate: f.bloodTypePostnatalDate,
    fbsRbsHba1cPostnatal: f.fbsRbsHba1cPostnatal,
    fbsRbsHba1cPostnatalDate: f.fbsRbsHba1cPostnatalDate,
    hbsagPostnatal: f.hbsagPostnatal,
    hbsagPostnatalDate: f.hbsagPostnatalDate,
    hemoglobinLabPostnatal: f.hemoglobinLabPostnatal,
    hemoglobinLabPostnatalDate: f.hemoglobinLabPostnatalDate,
    hivPostnatal: f.hivPostnatal,
    hivPostnatalDate: f.hivPostnatalDate,
    syphilisPostnatal: f.syphilisPostnatal,
    syphilisPostnatalDate: f.syphilisPostnatalDate,
    tuberculosisPostnatal: f.tuberculosisPostnatal,
    tuberculosisPostnatalDate: f.tuberculosisPostnatalDate,
    urinalysisPostnatal: f.urinalysisPostnatal,
    urinalysisPostnatalDate: f.urinalysisPostnatalDate,
    otherTestsPostnatal: f.otherTestsPostnatal,
    otherTestsPostnatalDate: f.otherTestsPostnatalDate,
  } as any;
}

  const setItr6Birthday = (birthday: string) => {
  const safeBirthday = clampToToday(birthday);
  const { years } = calculateAgeFromBirthday(safeBirthday);

  setItr6((prev) => ({
    ...prev,
    birthday: safeBirthday,
    ageYears: years,
    ageMonths: "",
  }));
  setSaved(false);
};

const setItr5Birthday = (birthday: string) => {
  const safeBirthday = clampToToday(birthday);
  const { years, months } = calculateAgeFromBirthday(safeBirthday);

  setItr5((prev) => ({
    ...prev,
    birthday: safeBirthday,
    ageYears: years,
    ageMonths: years === "0" ? months : "",
  }));
  setSaved(false);
};

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = async () => {

    if (activeTab === "ITR_6" && itr6AgeInvalid) {
  setSaveError("This form is for registration for 6 years old and above only.");
  return;
}

if (activeTab === "ITR_5" && itr5AgeInvalid) {
  setSaveError("This form is for registration for 5 years old and below only.");
  return;
}

    setSaving(true);
    setSaveError(null);

    try {
      if (activeTab === "ITR_6") {
  const payload = mapITR6ToPatient(itr6);
  const created = await patientsService.createPatient(payload);

  if (itr6.programs.includes("Family Planning")) {
    await patientsService.saveProgramInformation(
      created.id,
      {
        programName: "Family Planning",
        details: itr6.familyPlanningProgramInfo,
      },
      user.fullName
    );
  }

  if (itr6.programs.includes("Cardiovascular Disease")) {
    await patientsService.saveProgramInformation(
      created.id,
      {
        programName: "Cardiovascular Disease",
        details: itr6.cardiovascularDiseaseProgramInfo,
      },
      user.fullName
    );
  }

  await addLogbookEntry({
    staffUsername: user.fullName,
    action: "Add Record",
    patientName: `${created.firstName} ${created.lastName}`,
    patientId: created.id,
  });

  setItr6(blankITR6());
} else if (activeTab === "ITR_5") {
        // ── ITR 5: Create new pediatric patient ──────────────────────────────
        const payload = mapITR5ToPatient(itr5);
        const created = await patientsService.createPatient(payload);
        await addLogbookEntry({
          staffUsername: user.fullName,
          action:        "Add Record",
          patientName:   `${created.firstName} ${created.lastName}`,
          patientId:     created.id,
        });
        setItr5(blankITR5());

      } else if (activeTab === "ITMR") {
        // ── ITMR: Attach maternal record to existing female patient ───────────
        const nameLower = itmr.patientName.toLowerCase().trim();
        const target = allPatients.find((p) => {
          const full = `${p.firstName} ${p.lastName}`.toLowerCase();
          return full === nameLower;
        });

        if (!target) {
          throw new Error(
            `Patient "${itmr.patientName}" not found in the system. ` +
            `Please select a valid female patient from the dropdown.`
          );
        }

        const maternalRecord = buildMaternalRecord(itmr);

        await patientsService.saveMaternalRecord(
  target.id,
  maternalRecord,
  user.fullName
);

        await addLogbookEntry({
          staffUsername: user.fullName,
          action: "Add Record (Maternal)",
          patientName: `${target.firstName} ${target.lastName}`,
          patientId: target.id,
        });

        // Refresh the patient list so the dropdown stays current
        const fresh = await patientsService.getPatients();
        setAllPatients(fresh);
        setItmr(blankITMR());

      } else {
        // PCV tab — not yet fully implemented, mark saved visually
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to save the record. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  

  const s6 = <K extends keyof ITR6Form>(k: K, v: ITR6Form[K]) => { setItr6((p) => ({ ...p, [k]: v })); setSaved(false); };
  const s5 = <K extends keyof ITR5Form>(k: K, v: ITR5Form[K]) => { setItr5((p) => ({ ...p, [k]: v })); setSaved(false); };
  const sm = <K extends keyof ITMRForm>(k: K, v: ITMRForm[K]) => { setItmr((p) => ({ ...p, [k]: v })); setSaved(false); };

  const pe6 = <K extends keyof PhysicalExamForm>(k: K, v: PhysicalExamForm[K]) =>
    setItr6((p) => ({ ...p, physicalExam: { ...p.physicalExam, [k]: v } }));
  const pe5 = <K extends keyof PhysicalExamForm>(k: K, v: PhysicalExamForm[K]) =>
    setItr5((p) => ({ ...p, physicalExam: { ...p.physicalExam, [k]: v } }));

  const toggleFH6 = (c: string) =>
    s6("familyHistory", itr6.familyHistory.includes(c) ? itr6.familyHistory.filter((x) => x !== c) : [...itr6.familyHistory, c]);
  const toggleFH5 = (c: string) =>
    s5("familyHistory", itr5.familyHistory.includes(c) ? itr5.familyHistory.filter((x) => x !== c) : [...itr5.familyHistory, c]);

  const showFamilyPlanningProgramCard = itr6.programs.includes("Family Planning");
const showCardiovascularDiseaseProgramCard = itr6.programs.includes("Cardiovascular Disease");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4 pt-4 gap-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
            onClick={() => { setActiveTab(tab.key); setSaveError(null); setSaved(false); }}
            className={`text-[10px] font-bold pb-3 border-b-2 transition-colors whitespace-nowrap px-2 ${
              activeTab === tab.key
                ? "border-[#004b96] text-[#004b96]"
                : "border-transparent text-gray-400 hover:text-[#004b96]"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Form area */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >

        {/* ══ ITR 6 — 6 Years Old and Above ══════════════════════════════════ */}
        {activeTab === "ITR_6" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-5"
            >
              <h2 className="font-bold text-[#013155] text-xl">PATIENT REGISTRATION</h2>
              <p className="text-[#013155] text-xs mt-1">INDIVIDUAL TREATMENT RECORD FOR 6 YEARS OLD AND ABOVE</p>
            </motion.div>

            {/* Identifying Data */}
            <SectionBox title="Identifying Data" delay={0.05}>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div><label className={LC}>Last Name:</label><input className={IC} value={itr6.lastName} onChange={(e) => s6("lastName", e.target.value)} placeholder="del Rosario" /></div>
                <div><label className={LC}>First Name:</label><input className={IC} value={itr6.firstName} onChange={(e) => s6("firstName", e.target.value)} placeholder="Juan" /></div>
                <div><label className={LC}>M.I.:</label><input className={IC} value={itr6.mi} onChange={(e) => s6("mi", clampMiddleInitial(e.target.value))}
  placeholder="A"
  maxLength={2} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
  <div>
    <label className={LC}>Age — Years:</label>
    <input
      className={IC}
      type="number"
      min={0}
      value={itr6.ageYears}
      onChange={(e) => s6("ageYears", e.target.value)}
      placeholder="25"
    />
  </div>

  <div>
    <label className={LC}>Sex:</label>
    <div className="flex gap-4 mt-1">
      {["Male", "Female"].map((s) => (
        <label key={s} className="flex items-center gap-1 cursor-pointer text-xs">
          <div
            onClick={() => s6("sex", s)}
            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              itr6.sex === s ? "border-[#004b96] bg-[#004b96]" : "border-gray-400"
            }`}
          >
            {itr6.sex === s && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          {s}
        </label>
      ))}
    </div>
  </div>

  <div>
    <label className={LC}>Birthday:</label>
    <input
      className={IC}
      type="date"
      value={itr6.birthday}
      max={today}
      onChange={(e) => setItr6Birthday(e.target.value)}
    />
  </div>
</div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
  <label className={LC}>Religion:</label>
  <select
    className={IC}
    value={itr6.religion}
    onChange={(e) => s6("religion", e.target.value)}
  >
    <option value="">Select Religion</option>
    {RELIGION_OPTIONS.map((religion) => (
      <option key={religion} value={religion}>
        {religion}
      </option>
    ))}
  </select>
</div>
                <div><label className={LC}>Barangay:</label><input className={IC} value={itr6.barangay} onChange={(e) => s6("barangay", e.target.value)} placeholder="Gov. Paciano Bangoy" /></div>
                <div><label className={LC}>City:</label><input className={IC} value={itr6.city} onChange={(e) => s6("city", e.target.value)} placeholder="Davao City" /></div>
              </div>
              <div><label className={LC}>Address:</label><input className={IC} value={itr6.address} onChange={(e) => s6("address", e.target.value)} placeholder="Blk 5 Lot 3 Phase 1" /></div>

              <div className="grid grid-cols-5 gap-4 mt-3">

                
  <div>
    <label className={LC}>Civil Status:</label>
    <select
      className={IC}
      value={itr6.civilStatus}
      onChange={(e) => s6("civilStatus", e.target.value)}
    >
      <option value="">Select Civil Status</option>
      {CIVIL_STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className={LC}>Education:</label>
    <input
      className={IC}
      value={itr6.educationalAttainment}
      onChange={(e) => s6("educationalAttainment", e.target.value)}
      placeholder="e.g. High School"
    />
  </div>

  <div>
    <label className={LC}>Occupation:</label>
    <input
      className={IC}
      value={itr6.occupation}
      onChange={(e) => s6("occupation", e.target.value)}
      placeholder="e.g. Vendor"
    />
  </div>

  <div>
  <label className={LC}>Contact Number:</label>
  <input
    className={IC}
    value={itr6.contactNumber}
    onChange={(e) => s6("contactNumber", clampContactNumber(e.target.value))}
    placeholder="09XXXXXXXXX"
    inputMode="numeric"
    maxLength={11}
  />
</div>

  <div>
    <label className={LC}>Purok:</label>
    <select
      className={IC}
      value={itr6.purok}
      onChange={(e) => s6("purok", e.target.value)}
    >
      <option value="">Select Purok</option>
      {PUROK_OPTIONS.map((purok) => (
        <option key={purok} value={purok}>
          {purok}
        </option>
      ))}
    </select>
  </div>


</div>

<div className="grid grid-cols-3 gap-4 mt-4">
  <div>
    <label className={LC}>Spouse Name:</label>
    <input
      className={IC}
      value={itr6.spouseName}
      onChange={(e) => s6("spouseName", e.target.value)}
      placeholder="Full name"
    />
  </div>

  <div>
    <label className={LC}>Spouse Occupation:</label>
    <input
      className={IC}
      value={itr6.spouseOccupation}
      onChange={(e) => s6("spouseOccupation", e.target.value)}
      placeholder="e.g. Driver"
    />
  </div>

  <div>
    <label className={LC}>Spouse Contact (11 digits):</label>
    <input
      className={IC}
      value={itr6.spouseContact}
      onChange={(e) => s6("spouseContact", clampContactNumber(e.target.value))}
      placeholder="e.g. 09181234567"
      inputMode="numeric"
      maxLength={11}
    />
  </div>
</div>

            </SectionBox>



            <SectionBox title="Vitals & Programs" delay={0.08}>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
    <div>
      <label className={LC}>Blood Pressure:</label>
      <UnitSuffixInput
        value={itr6.bloodPressure}
        onChange={(v) => s6("bloodPressure", v ? `${v.replace(/\s*mmHg$/i, "").trim()} mmHg` : "")}
        suffix="mmHg"
        placeholder="120/80"
      />
    </div>

    <div>
      <label className={LC}>Weight:</label>
      <UnitSuffixInput
        value={itr6.weight}
        onChange={(v) => s6("weight", v)}
        suffix="kg"
        placeholder="60"
      />
    </div>

    <div>
      <label className={LC}>Height:</label>
      <UnitSuffixInput
        value={itr6.height}
        onChange={(v) => s6("height", v)}
        suffix="cm"
        placeholder="160"
      />
    </div>

    <div>
      <label className={LC}>Last Visit:</label>
      <input
        className={IC}
        type="date"
        value={itr6.lastVisit}
        max={today}
        onChange={(e) => s6("lastVisit", clampToToday(e.target.value))}
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mb-4">

    <div>
      <label className={LC}># of Children:</label>
      <input
        className={IC}
        type="number"
        min={0}
        value={itr6.children}
        onChange={(e) => s6("children", e.target.value)}
      />
    </div>
  </div>

  <div className="mb-4">
    <label className={LC}>Health Programs:</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {PROGRAM_OPTIONS_ITR6.map((program) => {
        const checked = itr6.programs.includes(program);
        return (
          <label
            key={program}
            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-xs font-semibold ${
              checked
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() =>
                s6(
                  "programs",
                  checked
                    ? itr6.programs.filter((p) => p !== program)
                    : [...itr6.programs, program]
                )
              }
            />
            {program}
          </label>
        );
      })}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mb-4">
    <YesNoRow label="Family Planning" value={itr6.familyPlanning} onChange={(v) => s6("familyPlanning", v)} />
    <YesNoRow label="Taking Vitamins" value={itr6.vitamins} onChange={(v) => s6("vitamins", v)} />
  </div>

  <div className="grid grid-cols-3 gap-4">
  <div>
    <label className={LC}>BCG Vaccine:</label>
    <select
      className={IC}
      value={itr6.bcgVaccine}
      onChange={(e) => s6("bcgVaccine", e.target.value as "YES" | "NO" | "N/A")}
    >
      <option value="YES">YES</option>
      <option value="NO">NO</option>
      <option value="N/A">N/A</option>
    </select>
  </div>

  <div>
    <label className={LC}>Hep B Vaccine:</label>
    <select
      className={IC}
      value={itr6.hepBVaccine}
      onChange={(e) => s6("hepBVaccine", e.target.value as "YES" | "NO" | "N/A")}
    >
      <option value="YES">YES</option>
      <option value="NO">NO</option>
      <option value="N/A">N/A</option>
    </select>
  </div>

  <div>
    <label className={LC}>Vitamin K:</label>
    <select
      className={IC}
      value={itr6.vitaminK}
      onChange={(e) => s6("vitaminK", e.target.value as "YES" | "NO" | "N/A")}
    >
      <option value="YES">YES</option>
      <option value="NO">NO</option>
      <option value="N/A">N/A</option>
    </select>
  </div>
</div>
</SectionBox>

{showFamilyPlanningProgramCard && (
  <SectionBox title="Family Planning Program Additional Info" delay={0.09}>
    <div className="space-y-2">
      <YesNoRow
        label="Take CoC pills"
        value={itr6.familyPlanningProgramInfo.takeCocPills}
        onChange={(v) =>
          s6("familyPlanningProgramInfo", {
            ...itr6.familyPlanningProgramInfo,
            takeCocPills: v,
          })
        }
      />
      <div>
        <label className={LC}>CoC pills last date taken:</label>
        <input
          className={IC}
          type="date"
          value={itr6.familyPlanningProgramInfo.cocPillsLastDateTaken}
          max={today}
          onChange={(e) =>
            s6("familyPlanningProgramInfo", {
              ...itr6.familyPlanningProgramInfo,
              cocPillsLastDateTaken: clampToToday(e.target.value),
            })
          }
        />
      </div>

      <YesNoRow
        label="Take PoP pills"
        value={itr6.familyPlanningProgramInfo.takePopPills}
        onChange={(v) =>
          s6("familyPlanningProgramInfo", {
            ...itr6.familyPlanningProgramInfo,
            takePopPills: v,
          })
        }
      />
      <div>
        <label className={LC}>PoP pills last date taken:</label>
        <input
          className={IC}
          type="date"
          value={itr6.familyPlanningProgramInfo.popPillsLastDateTaken}
          max={today}
          onChange={(e) =>
            s6("familyPlanningProgramInfo", {
              ...itr6.familyPlanningProgramInfo,
              popPillsLastDateTaken: clampToToday(e.target.value),
            })
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
          value={itr6.familyPlanningProgramInfo[key as keyof FamilyPlanningProgramInfo] as boolean}
          onChange={(v) =>
            s6("familyPlanningProgramInfo", {
              ...itr6.familyPlanningProgramInfo,
              [key]: v,
            })
          }
        />
      ))}
    </div>
  </SectionBox>
)}

{showCardiovascularDiseaseProgramCard && (
  <SectionBox title="Cardiovascular Disease Program Additional Info" delay={0.095}>
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
              value={itr6.cardiovascularDiseaseProgramInfo[boolKey as keyof CardiovascularDiseaseProgramInfo] as boolean}
              onChange={(v) =>
                s6("cardiovascularDiseaseProgramInfo", {
                  ...itr6.cardiovascularDiseaseProgramInfo,
                  [boolKey]: v,
                })
              }
            />
            <div className="mt-2">
              <label className={LC}>{dateLabel}:</label>
              <input
                className={IC}
                type="date"
                value={itr6.cardiovascularDiseaseProgramInfo[dateKey] as string}
                max={today}
                onChange={(e) =>
                  s6("cardiovascularDiseaseProgramInfo", {
                    ...itr6.cardiovascularDiseaseProgramInfo,
                    [dateKey]: clampToToday(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  </SectionBox>
)}



            {/* Past Medical History */}
            <SectionBox title="Past Medical History" delay={0.1}>
              <CoMorbSection data={itr6.coMorb} onChange={(d) => s6("coMorb", d)} isAdult={true} />
              <div className="mt-3">
                <label className={LC}>Maintenance Medication, Dose &amp; Frequency:</label>
                <textarea className={`${IC} resize-none`} rows={2} value={itr6.maintenanceMed} onChange={(e) => s6("maintenanceMed", e.target.value)} placeholder="e.g. Metformin 500mg twice daily" />
              </div>
              <div className="mt-2">
                <label className={LC}>Previous Illness / Surgeries:</label>
                <textarea className={`${IC} resize-none`} rows={2} value={itr6.previousIllnesses} onChange={(e) => s6("previousIllnesses", e.target.value)} placeholder="e.g. Chickenpox (2005)" />
              </div>
            </SectionBox>

            {/* Family History */}
            <SectionBox title="Family History" delay={0.15}>
              <FamilyHistorySection
                selected={itr6.familyHistory}
                other={itr6.familyHistoryOther}
                onToggle={toggleFH6}
                onOtherChange={(v) => s6("familyHistoryOther", v)}
              />
            </SectionBox>

            {/* Personal / Social History */}
            <SectionBox title="Personal / Social History" delay={0.2}>
              <div className="space-y-0.5">
                <YesNoRow label="Eats Healthy Diet" value={itr6.eatsHealthy} onChange={(v) => s6("eatsHealthy", v)} />
                <YesNoRow label="Adequate Physical Activity" value={itr6.adequateActivity} onChange={(v) => s6("adequateActivity", v)} />
                <YesNoRow label="Sufficient Rest / Sleep" value={itr6.sufficientRest} onChange={(v) => s6("sufficientRest", v)} />
                <YesNoRow label="Normal Growth and Development" value={itr6.normalGrowth} onChange={(v) => s6("normalGrowth", v)} />
                <YesNoRow label="Engage with Multiple Sex Partners" value={itr6.multiplePartners} onChange={(v) => s6("multiplePartners", v)} />
                <YesNoRow label="Smokes Tobacco" value={itr6.smokesTobacco} onChange={(v) => s6("smokesTobacco", v)} />
                {itr6.smokesTobacco && (
                  <div className="ml-4 pb-1"><label className={LC}>Pack per Year:</label>
                    <input className={`${IC} w-32`} type="number" min={0} value={itr6.tobaccoPacks} onChange={(e) => s6("tobaccoPacks", e.target.value)} />
                  </div>
                )}
                <YesNoRow label="Drinks Alcohol" value={itr6.drinksAlcohol} onChange={(v) => s6("drinksAlcohol", v)} />
                {itr6.drinksAlcohol && (
                  <div className="ml-4 pb-1"><label className={LC}>Bottle per Year:</label>
                    <input className={`${IC} w-32`} type="number" min={0} value={itr6.alcoholBottles} onChange={(e) => s6("alcoholBottles", e.target.value)} />
                  </div>
                )}
                <YesNoRow label="Takes Illegal Drugs" value={itr6.illegalDrugs} onChange={(v) => s6("illegalDrugs", v)} />
                {itr6.illegalDrugs && (
                  <div className="ml-4 pb-1"><label className={LC}>Specify:</label>
                    <input className={IC} value={itr6.illegalDrugsSpecify} onChange={(e) => s6("illegalDrugsSpecify", e.target.value)} placeholder="e.g. Methamphetamine" />
                  </div>
                )}
              </div>
            </SectionBox>

            {/* Physical Exam */}
            <SectionBox title="Physical Examination" delay={0.25}>
              <ExamSystemField title="SHEENT" data={itr6.physicalExam.sheent} options={SHEENT_OPTIONS} onChange={(d) => pe6("sheent", d)} />
              <ExamSystemField title="Chest, Breast & Lungs" data={itr6.physicalExam.chest} options={CHEST_OPTIONS} onChange={(d) => pe6("chest", d)} />
              <ExamSystemField title="Heart" data={itr6.physicalExam.heart} options={HEART_OPTIONS} onChange={(d) => pe6("heart", d)} />
              <ExamSystemField title="Abdomen" data={itr6.physicalExam.abdomen} options={ABDOMEN_OPTIONS} onChange={(d) => pe6("abdomen", d)} />
              <ExamSystemField title="Genitourinary" data={itr6.physicalExam.genitourinary} options={GU_OPTIONS} onChange={(d) => pe6("genitourinary", d)} />
              <ExamSystemField title="Extremities" data={itr6.physicalExam.extremities} options={EXTREMITIES_OPTIONS} onChange={(d) => pe6("extremities", d)} />
              <ExamSystemField title="Neurological" data={itr6.physicalExam.neurological} options={NEURO_OPTIONS} onChange={(d) => pe6("neurological", d)} />
            </SectionBox>

            <SaveBar
  agreed={itr6.agreedToTerms}
  onAgree={() => s6("agreedToTerms", !itr6.agreedToTerms)}
  onSave={handleSave}
  onOpenConsent={() => setConsentModalOpen(true)}
  saved={saved}
  saving={saving}
  error={saveError}
  disabled={itr6AgeInvalid}
  disabledMessage={itr6AgeMessage}
/>
          </>
        )}

        {/* ══ ITR 5 — 5 Years Old and Below ══════════════════════════════════ */}
        {activeTab === "ITR_5" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-5"
            >
              <h2 className="font-bold text-[#013155] text-xl">PATIENT REGISTRATION</h2>
              <p className="text-[#013155] text-xs mt-1">INDIVIDUAL TREATMENT RECORD FOR 5 YEARS OLD AND BELOW</p>
            </motion.div>

            {/* Identifying Data */}
            <SectionBox title="Identifying Data" delay={0.05}>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div><label className={LC}>Last Name:</label><input className={IC} value={itr5.lastName} onChange={(e) => s5("lastName", e.target.value)} placeholder="del Rosario" /></div>
                <div><label className={LC}>First Name:</label><input className={IC} value={itr5.firstName} onChange={(e) => s5("firstName", e.target.value)} placeholder="Juan" /></div>
                <div><label className={LC}>M.I.:</label><input className={IC} value={itr5.mi} onChange={(e) => s5("mi", clampMiddleInitial(e.target.value))}
  placeholder="A"
  maxLength={2} /></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-3">
  <div>
    <label className={LC}>Age — Years:</label>
    <input
      className={IC}
      type="number"
      min={0}
      value={itr5.ageYears}
      onChange={(e) => s5("ageYears", e.target.value)}
      placeholder="3"
    />
  </div>

  <div>
    <label className={LC}>Age — Months:</label>
    <input
      className={IC}
      type="number"
      min={0}
      max={11}
      value={itr5.ageMonths}
      onChange={(e) => s5("ageMonths", e.target.value)}
      placeholder="6"
    />
  </div>

  <div>
    <label className={LC}>Sex:</label>
    <div className="flex gap-4 mt-1">
      {["Male", "Female"].map((s) => (
        <label key={s} className="flex items-center gap-1 cursor-pointer text-xs">
          <div
            onClick={() => s5("sex", s)}
            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              itr5.sex === s ? "border-[#004b96] bg-[#004b96]" : "border-gray-400"
            }`}
          >
            {itr5.sex === s && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          {s}
        </label>
      ))}
    </div>
  </div>

  <div>
    <label className={LC}>Birthday:</label>
    <input
      className={IC}
      type="date"
      value={itr5.birthday}
      max={today}
      onChange={(e) => setItr5Birthday(e.target.value)}
    />
  </div>
</div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
  <label className={LC}>Religion:</label>
  <select
    className={IC}
    value={itr5.religion}
    onChange={(e) => s5("religion", e.target.value)}
  >
    <option value="">Select Religion</option>
    {RELIGION_OPTIONS.map((religion) => (
      <option key={religion} value={religion}>
        {religion}
      </option>
    ))}
  </select>
</div>
                <div><label className={LC}>Barangay:</label><input className={IC} value={itr5.barangay} onChange={(e) => s5("barangay", e.target.value)} placeholder="Gov. Paciano Bangoy" /></div>
                <div><label className={LC}>City:</label><input className={IC} value={itr5.city} onChange={(e) => s5("city", e.target.value)} placeholder="Davao City" /></div>
              </div>
              <div><label className={LC}>Address:</label><input className={IC} value={itr5.address} onChange={(e) => s5("address", e.target.value)} placeholder="Blk 5 Lot 3 Phase 1" /></div>

              <div className="grid grid-cols-5 gap-4 mt-3">
  <div>
    <label className={LC}>Civil Status:</label>
    <input
      className={`${IC} text-gray-500`}
      value="Single"
      disabled
      readOnly
    />
  </div>

  <div>
    <label className={LC}>Education:</label>
    <input
      className={IC}
      value={itr5.educationalAttainment}
      onChange={(e) => s5("educationalAttainment", e.target.value)}
      placeholder="e.g. Daycare"
    />
  </div>

  <div>
    <label className={LC}>Occupation:</label>
    <input
      className={IC}
      value={itr5.occupation}
      onChange={(e) => s5("occupation", e.target.value)}
      placeholder="e.g. N/A"
    />
  </div>
  
  <div>
  <label className={LC}>Contact Number:</label>
  <input
    className={IC}
    value={itr5.contactNumber}
    onChange={(e) => s5("contactNumber", clampContactNumber(e.target.value))}
    placeholder="09XXXXXXXXX"
    inputMode="numeric"
    maxLength={11}
  />
</div>

  <div>
    <label className={LC}>Purok:</label>
    <select
      className={IC}
      value={itr5.purok}
      onChange={(e) => s5("purok", e.target.value)}
    >
      <option value="">Select Purok</option>
      {PUROK_OPTIONS.map((purok) => (
        <option key={purok} value={purok}>
          {purok}
        </option>
      ))}
    </select>
  </div>
</div>

            </SectionBox>

            <SectionBox title="Vitals & Programs" delay={0.08}>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
    <div>
      <label className={LC}>Blood Pressure:</label>
      <UnitSuffixInput
        value={itr5.bloodPressure}
onChange={(v) => s5("bloodPressure", v ? `${v.replace(/\s*mmHg$/i, "").trim()} mmHg` : "")}
        suffix="mmHg"
        placeholder="120/80"
      />
    </div>

    <div>
      <label className={LC}>Weight:</label>
      <UnitSuffixInput
        value={itr5.weight}
        onChange={(v) => s5("weight", v)}
        suffix="kg"
        placeholder="60"
      />
    </div>

    <div>
      <label className={LC}>Height:</label>
      <UnitSuffixInput
        value={itr5.height}
        onChange={(v) => s5("height", v)}
        suffix="cm"
        placeholder="160"
      />
    </div>

    <div>
      <label className={LC}>Last Visit:</label>
      <input
        className={IC}
        type="date"
        value={itr5.lastVisit}
        max={today}
        onChange={(e) => s5("lastVisit", clampToToday(e.target.value))}
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mb-4">

    <div>
  <label className={LC}># of Children:</label>
  <input
    className={`${IC} text-gray-500`}
    type="number"
    value="0"
    disabled
    readOnly
  />
</div>
  </div>

  <div className="mb-4">
    <label className={LC}>Health Programs:</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {PROGRAM_OPTIONS_ITR5.map((program) => {
        const checked = itr5.programs.includes(program);
        return (
          <label
            key={program}
            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-xs font-semibold ${
              checked
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() =>
                s5(
                  "programs",
                  checked
                    ? itr5.programs.filter((p) => p !== program)
                    : [...itr5.programs, program]
                )
              }
            />
            {program}
          </label>
        );
      })}
    </div>
  </div>

  <div className="grid grid-cols-1 gap-4 mb-4">
  <YesNoRow label="Taking Vitamins" value={itr5.vitamins} onChange={(v) => s5("vitamins", v)} />
</div>

</SectionBox>

            {/* Past Medical History */}
            <SectionBox title="Past Medical History" delay={0.1}>
              <CoMorbSection data={itr5.coMorb} onChange={(d) => s5("coMorb", d)} />
              <div className="mt-3">
                <label className={LC}>Maintenance Medication, Dose &amp; Frequency:</label>
                <textarea className={`${IC} resize-none`} rows={2} value={itr5.maintenanceMed} onChange={(e) => s5("maintenanceMed", e.target.value)} placeholder="e.g. Salbutamol 2mg as needed" />
              </div>
              <div className="mt-2">
                <label className={LC}>Previous Illness / Surgeries:</label>
                <textarea className={`${IC} resize-none`} rows={2} value={itr5.previousIllnesses} onChange={(e) => s5("previousIllnesses", e.target.value)} placeholder="e.g. Pneumonia (2023)" />
              </div>
            </SectionBox>

            {/* Newborn Care */}
            <SectionBox title="Newborn Care" delay={0.15}>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <label className={LC}>Type of Delivery:</label>
                  <select className="w-full border-b border-gray-400 bg-transparent text-sm focus:outline-none focus:border-[#004b96] py-0.5" value={itr5.typeOfDelivery} onChange={(e) => s5("typeOfDelivery", e.target.value)}>
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Caesarean Section">Caesarean Section</option>
                  </select>
                </div>
                <div>
  <label className={LC}>Birth Weight:</label>
  <UnitSuffixInput
    value={itr5.birthWeight}
    onChange={(v) => s5("birthWeight", v)}
    suffix="kg"
    placeholder="e.g. 3.2"
  />
</div>

<div>
  <label className={LC}>Birth Height:</label>
  <UnitSuffixInput
    value={itr5.birthHeight}
    onChange={(v) => s5("birthHeight", v)}
    suffix="cm"
    placeholder="e.g. 50"
  />
</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
  <label className={LC}>Current Weight:</label>
  <UnitSuffixInput
    value={itr5.currentWeight}
    onChange={(v) => s5("currentWeight", v)}
    suffix="kg"
    placeholder="e.g. 15"
  />
</div>

<div>
  <label className={LC}>Current Height:</label>
  <UnitSuffixInput
    value={itr5.currentHeight}
    onChange={(v) => s5("currentHeight", v)}
    suffix="cm"
    placeholder="e.g. 95"
  />
</div>
              </div>
              {/* Vaccines YES/NO + date */}
              {(["bcgVaccine","hepBVaccine","vitaminK"] as const).map((key) => {
                const labelMap = { bcgVaccine: "BCG Vaccine", hepBVaccine: "Hep B Vaccine", vitaminK: "Vitamin K" };
                const dateKey = { bcgVaccine: "bcgDate" as const, hepBVaccine: "hepBDate" as const, vitaminK: "vitaminKDate" as const }[key];
                const val = itr5[key] as boolean;
                return (
                  <div key={key} className="mb-2">
                    <YesNoRow label={labelMap[key]} value={val} onChange={(v) => s5(key, v)} />
                    {val && (
                      <div className="ml-4 mt-1"><label className={LC}>Date:</label>
                        <input
  className={IC}
  type="date"
  value={itr5[dateKey]}
  max={today}
  onChange={(e) => s5(dateKey, clampToToday(e.target.value))}
/>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="mb-2">
                <label className={LC}>Mother Tetanus Toxoid Status (# of Shots):</label>
                <select className="w-full border-b border-gray-400 bg-transparent text-sm focus:outline-none focus:border-[#004b96] py-0.5 mt-0.5" value={itr5.motherTetanusShots} onChange={(e) => s5("motherTetanusShots", e.target.value)}>
                  <option value="">Select</option>
                  {["1","2","3","4"].map((n) => <option key={n} value={n}>{n} Shot{n !== "1" ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <YesNoRow label="Newborn Screening" value={itr5.newbornScreening} onChange={(v) => s5("newbornScreening", v)} />
                {itr5.newbornScreening && (
                  <div className="ml-4 mt-1 grid grid-cols-2 gap-3">
                    <div><label className={LC}>Date:</label><input
  className={IC}
  type="date"
  value={itr5.screeningDate}
  max={today}
  onChange={(e) => s5("screeningDate", clampToToday(e.target.value))}
/></div>
                    <div><label className={LC}>Results:</label><input className={IC} value={itr5.screeningResults} onChange={(e) => s5("screeningResults", e.target.value)} placeholder="e.g. Normal" /></div>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <YesNoRow label="Initiated Breastfeeding" value={itr5.initiatedBreastfeeding} onChange={(v) => s5("initiatedBreastfeeding", v)} />
                {itr5.initiatedBreastfeeding && (
                  <div className="ml-4 mt-1"><label className={LC}>Date:</label>
                    <input
  className={IC}
  type="date"
  value={itr5.breastfeedingDate}
  max={today}
  onChange={(e) => s5("breastfeedingDate", clampToToday(e.target.value))}
/>
                  </div>
                )}
              </div>
              <div>
                <label className={LC}>Place of Delivery:</label>
                <select className="w-full border-b border-gray-400 bg-transparent text-sm focus:outline-none focus:border-[#004b96] py-0.5 mt-0.5" value={itr5.placeOfDelivery} onChange={(e) => s5("placeOfDelivery", e.target.value)}>
                  <option value="">Select</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Birthing Facility">Birthing Facility</option>
                  <option value="Home">Home</option>
                </select>
              </div>
            </SectionBox>

            {/* Family History */}
            <SectionBox title="Family History" delay={0.2}>
              <FamilyHistorySection
                selected={itr5.familyHistory}
                other={itr5.familyHistoryOther}
                onToggle={toggleFH5}
                onOtherChange={(v) => s5("familyHistoryOther", v)}
              />
            </SectionBox>

            {/* Personal / Social History (child) */}
            <SectionBox title="Personal / Social History" delay={0.25}>
              <div className="space-y-0.5">
                <YesNoRow label="Lives with Immediate Family" value={itr5.livesWithFamily} onChange={(v) => s5("livesWithFamily", v)} />
                <YesNoRow label="Uneventful Birth and Infancy" value={itr5.uneventfulBirth} onChange={(v) => s5("uneventfulBirth", v)} />
                <YesNoRow label="Normal Growth and Development" value={itr5.normalGrowth} onChange={(v) => s5("normalGrowth", v)} />
                <YesNoRow label="Normal Moods and Attitudes" value={itr5.normalMoods} onChange={(v) => s5("normalMoods", v)} />
                <YesNoRow label="Normal Interest in Family and Friends" value={itr5.normalInterestFamily} onChange={(v) => s5("normalInterestFamily", v)} />
                <YesNoRow label="Normal Interest in Work and Play" value={itr5.normalInterestWork} onChange={(v) => s5("normalInterestWork", v)} />
                <YesNoRow label="Adequate Physical Activity" value={itr5.adequateActivity} onChange={(v) => s5("adequateActivity", v)} />
                <YesNoRow label="Sufficient Rest / Sleep" value={itr5.sufficientRest} onChange={(v) => s5("sufficientRest", v)} />
              </div>
              <div className="mt-2">
                <label className={LC}>Others, Specify:</label>
                <input className={IC} value={itr5.socialOther} onChange={(e) => s5("socialOther", e.target.value)} placeholder="Additional notes…" />
              </div>
            </SectionBox>

            {/* Physical Exam */}
            <SectionBox title="Physical Examination" delay={0.3}>
              <ExamSystemField title="SHEENT" data={itr5.physicalExam.sheent} options={SHEENT_OPTIONS} onChange={(d) => pe5("sheent", d)} />
              <ExamSystemField title="Chest, Breast & Lungs" data={itr5.physicalExam.chest} options={CHEST_OPTIONS} onChange={(d) => pe5("chest", d)} />
              <ExamSystemField title="Heart" data={itr5.physicalExam.heart} options={HEART_OPTIONS} onChange={(d) => pe5("heart", d)} />
              <ExamSystemField title="Abdomen" data={itr5.physicalExam.abdomen} options={ABDOMEN_OPTIONS} onChange={(d) => pe5("abdomen", d)} />
              <ExamSystemField title="Genitourinary" data={itr5.physicalExam.genitourinary} options={GU_OPTIONS} onChange={(d) => pe5("genitourinary", d)} />
              <ExamSystemField title="Extremities" data={itr5.physicalExam.extremities} options={EXTREMITIES_OPTIONS} onChange={(d) => pe5("extremities", d)} />
              <ExamSystemField title="Neurological" data={itr5.physicalExam.neurological} options={NEURO_OPTIONS} onChange={(d) => pe5("neurological", d)} />
            </SectionBox>

            <SaveBar
  agreed={itr5.agreedToTerms}
  onAgree={() => s5("agreedToTerms", !itr5.agreedToTerms)}
  onSave={handleSave}
  onOpenConsent={() => setConsentModalOpen(true)}
  saved={saved}
  saving={saving}
  error={saveError}
  disabled={itr5AgeInvalid}
  disabledMessage={itr5AgeMessage}
/>
          </>
        )}

        {/* ══ ITMR — Maternal Registration ═══════════════════════════════════ */}
        {activeTab === "ITMR" && (
  <>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center mb-5"
    >
      <h2 className="font-bold text-[#013155] text-xl">MATERNAL REGISTRATION</h2>
      <p className="text-[#013155] text-xs mt-1">INDIVIDUAL TREATMENT MATERNAL RECORD</p>
    </motion.div>

    {/* Patient */}
    <SectionBox title="Patient" delay={0.05}>
      <PatientNameDropdown
        value={itmr.patientName}
        onChange={(v) => sm("patientName", v)}
        patients={allPatients}
      />
    </SectionBox>

    {/* OB-GYNE HISTORY */}
    <SectionBox title="OB-GYNE HISTORY" delay={0.1}>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
        {([
          ["gravida", "G"],
          ["para", "P"],
          ["fullTerm", "Full Term"],
          ["preterm", "Preterm"],
          ["abortion", "Abortion"],
          ["living", "Living"],
        ] as const).map(([key, label]) => (
          <div key={key} className="bg-[#e8f4fd] rounded-xl p-2 text-center">
            <p className="text-[10px] text-gray-500 font-semibold mb-1">{label}</p>
            <input
              type="number"
              min={0}
              value={itmr[key]}
              onChange={(e) => sm(key, e.target.value)}
              className="w-full text-center text-[#004b96] font-bold bg-transparent border-b border-[#004b96]/30 focus:outline-none focus:border-[#004b96] text-lg"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={LC}>Menarche Age:</label>
          <input className={IC} type="number" min={0} value={itmr.menarcheAge} onChange={(e) => sm("menarcheAge", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Menstrual Cycle:</label>
          <select className={IC} value={itmr.menstrualCycle} onChange={(e) => sm("menstrualCycle", e.target.value as "Regular" | "Irregular")}>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>

        <div>
          <label className={LC}>Menstrual Flow (Days):</label>
          <input className={IC} type="number" min={0} value={itmr.menstrualFlowDays} onChange={(e) => sm("menstrualFlowDays", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Coitarche Age:</label>
          <input className={IC} type="number" min={0} value={itmr.coitarcheAge} onChange={(e) => sm("coitarcheAge", e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <label className={LC}>Current FP Method:</label>
          <input className={IC} value={itmr.currentFpMethod} onChange={(e) => sm("currentFpMethod", e.target.value)} />
        </div>
      </div>

      {([
        { key: "papSmear" as const, dateKey: "papSmearDate" as const, resultKey: "papSmearResult" as const, label: "PAP Smear" },
        { key: "via" as const, dateKey: "viaDate" as const, resultKey: "viaResult" as const, label: "VIA" },
        { key: "historyOfSti" as const, dateKey: "stiDate" as const, resultKey: "stiResult" as const, label: "History of STI" },
      ]).map(({ key, dateKey, resultKey, label }) => (
        <div key={key} className="border border-gray-200 rounded-lg p-3 mb-3">
          <YesNoRow label={label} value={itmr[key]} onChange={(v) => sm(key, v)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div>
              <label className={LC}>Date:</label>
              <input className={IC} type="date" value={itmr[dateKey]} max={today} onChange={(e) => sm(dateKey, clampToToday(e.target.value))} />
            </div>
            <div>
              <label className={LC}>Result:</label>
              <input className={IC} value={itmr[resultKey]} onChange={(e) => sm(resultKey, e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </SectionBox>

    {/* PRENATAL CARE */}
    <SectionBox title="PRENATAL CARE" delay={0.15}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={LC}>Risk Code:</label>
          <input className={IC} value={itmr.riskCode} onChange={(e) => sm("riskCode", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Age of Gestation:</label>
          <input className={IC} value={itmr.ageOfGestation} onChange={(e) => sm("ageOfGestation", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Last Menstrual Period:</label>
          <input className={IC} value={itmr.lmp} onChange={(e) => sm("lmp", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Expected Date of Delivery:</label>
          <input className={IC} value={itmr.edd} onChange={(e) => sm("edd", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Plan to Deliver At:</label>
          <input className={IC} value={itmr.planToDeliverAt} onChange={(e) => sm("planToDeliverAt", e.target.value)} />
        </div>

        <div>
          <label className={LC}>Accompanying Person:</label>
          <input className={IC} value={itmr.accompanyingPerson} onChange={(e) => sm("accompanyingPerson", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <YesNoRow label="Mother-Baby Book" value={itmr.motherBabyBook} onChange={(v) => sm("motherBabyBook", v)} />
        <YesNoRow label="Iodized Salt" value={itmr.iodizedSalt} onChange={(v) => sm("iodizedSalt", v)} />
        <YesNoRow label="Seen by Dentist" value={itmr.seenByDentist} onChange={(v) => sm("seenByDentist", v)} />
        <YesNoRow label="Iron Supplement" value={itmr.ironSupplement} onChange={(v) => sm("ironSupplement", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={LC}>Dentist Date:</label>
          <input className={IC} type="date" value={itmr.dentistDate} max={today} onChange={(e) => sm("dentistDate", clampToToday(e.target.value))} />
        </div>

        <div>
          <label className={LC}>Physician Date:</label>
          <input className={IC} type="date" value={itmr.physicianDate} max={today} onChange={(e) => sm("physicianDate", clampToToday(e.target.value))} />
        </div>
      </div>

      <div className="mb-4">
        <YesNoRow label="Seen by Physician" value={itmr.seenByPhysician} onChange={(v) => sm("seenByPhysician", v)} />
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {(["tt1","tt2","tt3","tt4","tt5"] as const).map((key, i) => {
          const { month, year } = parseTTReg(itmr[key]);
          return (
            <div key={key} className="bg-[#e8f4fd] rounded-xl p-2 text-center">
              <p className="text-[#004b96] font-bold text-xs mb-1">TT{i + 1}</p>
              <select className="w-full text-[10px] border rounded mb-1" value={month} onChange={(e) => sm(key, formatTTReg(e.target.value, year))}>
                <option value="">Month</option>
                {MONTHS_REG.map((m) => <option key={m} value={m}>{m.slice(0, 3)}</option>)}
              </select>
              <select className="w-full text-[10px] border rounded" value={year} onChange={(e) => sm(key, formatTTReg(month, e.target.value))}>
                <option value="">Year</option>
                {TT_YEARS_REG.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {PRENATAL_LABS.map(({ label, valueKey, dateKey }) => (
    <LabResultCard
      key={String(valueKey)}
      label={label}
      value={String(itmr[valueKey] ?? "")}
      dateValue={String(itmr[dateKey] ?? "")}
      onValueChange={(value) => sm(valueKey, value as ITMRForm[typeof valueKey])}
      onDateChange={(value) => sm(dateKey, value as ITMRForm[typeof dateKey])}
      today={today}
    />
  ))}
</div>


    </SectionBox>

    {/* POSTNATAL CARE */}
    <SectionBox title="POSTNATAL CARE" delay={0.2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><label className={LC}>Date of Delivery:</label><input className={IC} type="date" value={itmr.dateOfDelivery} onChange={(e) => sm("dateOfDelivery", clampToToday(e.target.value))} /></div>
        <div><label className={LC}>Place of Delivery:</label><input className={IC} value={itmr.postnatalPlaceOfDelivery} onChange={(e) => sm("postnatalPlaceOfDelivery", e.target.value)} /></div>

        <div>
          <label className={LC}>Type of Delivery:</label>
          <select className={IC} value={itmr.typeOfDelivery} onChange={(e) => sm("typeOfDelivery", e.target.value as ITMRForm["typeOfDelivery"])}>
            <option value="">Select</option>
            <option value="Normal">Normal</option>
            <option value="Caesarian Section">Caesarian Section</option>
          </select>
        </div>

        <div><label className={LC}>Outcome of Pregnancy:</label><input className={IC} value={itmr.outcomeOfPregnancy} onChange={(e) => sm("outcomeOfPregnancy", e.target.value)} /></div>
        <div><label className={LC}>Attended By:</label><input className={IC} value={itmr.attendedBy} onChange={(e) => sm("attendedBy", e.target.value)} /></div>
        <div><label className={LC}>Complications:</label><input className={IC} value={itmr.complications} onChange={(e) => sm("complications", e.target.value)} /></div>

        <div>
          <label className={LC}>Sex of Newborn:</label>
          <select className={IC} value={itmr.sexOfNewborn} onChange={(e) => sm("sexOfNewborn", e.target.value as ITMRForm["sexOfNewborn"])}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        <div><label className={LC}>Birthweight:</label><input className={IC} value={itmr.birthweight} onChange={(e) => sm("birthweight", e.target.value)} placeholder="e.g. 3.2 kg" /></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <YesNoRow label="Hemoglobin Done" value={itmr.hemoglobinDone} onChange={(v) => sm("hemoglobinDone", v)} />
        <YesNoRow label="Vitamin A" value={itmr.vitaminA} onChange={(v) => sm("vitaminA", v)} />
        <YesNoRow label="Breastfeeding" value={itmr.breastfeeding} onChange={(v) => sm("breastfeeding", v)} />
        <YesNoRow label="Counseling" value={itmr.counseling} onChange={(v) => sm("counseling", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><label className={LC}>Hemoglobin Value:</label><input className={IC} value={itmr.hemoglobinPostnatal} onChange={(e) => sm("hemoglobinPostnatal", e.target.value)} /></div>
        <div><label className={LC}>Hemoglobin Date:</label><input className={IC} type="date" value={itmr.hemoglobinPostnatalDate} onChange={(e) => sm("hemoglobinPostnatalDate", clampToToday(e.target.value))} /></div>
        <div><label className={LC}>Vitamin A Date:</label><input className={IC} type="date" value={itmr.vitaminADate} onChange={(e) => sm("vitaminADate", clampToToday(e.target.value))} /></div>
        <div><label className={LC}>Breastfeeding Date Initiated:</label><input className={IC} type="date" value={itmr.breastfeedingDateInitiated} onChange={(e) => sm("breastfeedingDateInitiated", clampToToday(e.target.value))} /></div>
        <div><label className={LC}>Counseling Date:</label><input className={IC} type="date" value={itmr.counselingDate} onChange={(e) => sm("counselingDate", clampToToday(e.target.value))} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
  <div className="border rounded-lg p-3">
    <YesNoRow
      label="Seen by Dentist"
      value={itmr.dentistPostnatalYes}
      onChange={(v) => sm("dentistPostnatalYes", v)}
    />
    <div className="grid grid-cols-3 gap-3 mt-3">
      <div>
        <label className={LC}>1st Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.dentistPostnatalVisits1}
          onChange={(e) =>
            sm("dentistPostnatalVisits1", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div>
        <label className={LC}>2nd Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.dentistPostnatalVisits2}
          onChange={(e) =>
            sm("dentistPostnatalVisits2", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div>
        <label className={LC}>3rd Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.dentistPostnatalVisits3}
          onChange={(e) =>
            sm("dentistPostnatalVisits3", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>
    </div>
  </div>

  <div className="border rounded-lg p-3">
    <YesNoRow
      label="Seen by Physician"
      value={itmr.physicianPostnatalYes}
      onChange={(v) => sm("physicianPostnatalYes", v)}
    />
    <div className="grid grid-cols-3 gap-3 mt-3">
      <div>
        <label className={LC}>1st Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.physicianPostnatalVisits1}
          onChange={(e) =>
            sm("physicianPostnatalVisits1", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div>
        <label className={LC}>2nd Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.physicianPostnatalVisits2}
          onChange={(e) =>
            sm("physicianPostnatalVisits2", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      <div>
        <label className={LC}>3rd Trimester</label>
        <input
          className={IC}
          type="number"
          min={0}
          inputMode="numeric"
          value={itmr.physicianPostnatalVisits3}
          onChange={(e) =>
            sm("physicianPostnatalVisits3", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {POSTNATAL_LABS.map(({ label, valueKey, dateKey }) => (
    <LabResultCard
      key={String(valueKey)}
      label={label}
      value={String(itmr[valueKey] ?? "")}
      dateValue={String(itmr[dateKey] ?? "")}
      onValueChange={(value) => sm(valueKey, value as ITMRForm[typeof valueKey])}
      onDateChange={(value) => sm(dateKey, value as ITMRForm[typeof dateKey])}
      today={today}
    />
  ))}
</div>


    </SectionBox>

    <SaveBar
  agreed={itmr.agreedToTerms}
  onAgree={() => sm("agreedToTerms", !itmr.agreedToTerms)}
  onSave={handleSave}
  onOpenConsent={() => setConsentModalOpen(true)}
  saved={saved}
  saving={saving}
  error={saveError}
/>
  </>
)}

        {/* ══ PCV ═══════════════════════════════════════════════════════════ */}
        {activeTab === "PCV" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full py-24 text-gray-400"
          >
            <p className="font-semibold text-base">PCV Record</p>
            <p className="text-sm mt-1">Coming soon</p>
          </motion.div>
        )}

          </motion.div>
        </AnimatePresence>
      </div>

      <ConsentModal
  open={consentModalOpen}
  onClose={() => setConsentModalOpen(false)}
/>

    </motion.div>
  );
}