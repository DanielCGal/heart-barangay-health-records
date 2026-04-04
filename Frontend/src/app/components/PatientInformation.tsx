import { useState, useEffect } from "react";
import { Filter, Pencil, ChevronLeft, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  Patient,
  TriOption,
  FamilyPlanningProgramInfo,
  CardiovascularDiseaseProgramInfo,
} from "./mockData";
import * as patientsService from "../../api/patients.service";
import { PatientMedicalProfile } from "./PatientMedicalProfile";
import { PatientEditModal } from "./PatientEditModal";
import { useAuth } from "../../context/AuthContext";
import { addLogbookEntry } from "../../api/logbook.service";


const ITEMS_PER_PAGE = 9;

interface PatientEditModalSavePayload {
  patient: Patient;
  familyPlanningProgramInfo?: FamilyPlanningProgramInfo;
  cardiovascularDiseaseProgramInfo?: CardiovascularDiseaseProgramInfo;
}

const programs = [
  "All Program",
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
  "All Purok",
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
const TRI_OPTIONS: { label: string; value: "" | TriOption }[] = [
  { label: "All", value: "" },
  { label: "YES", value: "YES" },
  { label: "NO", value: "NO" },
  { label: "DON'T APPLY", value: "N/A" },
];

const MOTHER_FILTER_OPTIONS: { label: string; value: "" | TriOption }[] = [
  { label: "DON'T APPLY", value: "" },
  { label: "YES", value: "YES" },
  { label: "NO", value: "NO" },
];

const VACCINE_FILTER_OPTIONS: { label: string; value: "" | TriOption }[] = [
  { label: "DON'T APPLY", value: "" },
  { label: "YES", value: "YES" },
  { label: "NO", value: "NO" },
];

const FAMILY_HISTORY_LIST = [
  "Asthma/Allergies",
  "Birth Defects",
  "Cancer",
  "Dementia",
  "Diabetes",
  "Hypertension",
  "Lung Disease",
  "Mental Illness",
];

const religions = [
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

interface AdvancedFilters {
  middleInitial: string;
  ageYearsMin: string;
  ageYearsMax: string;
  ageMonthsMin: string;
  ageMonthsMax: string;
  sex: "" | "Male" | "Female";
  birthday: string;
  religion: string;
  barangay: string;
  city: string;
  weightMin: string;
  weightMax: string;
  heightMin: string;
  heightMax: string;
  bcgVaccine: "" | TriOption;
  hepBVaccine: "" | TriOption;
  vitaminK: "" | TriOption;
  vitamins: boolean;
  familyHistoryConditions: string[];
  familyHistoryOther: string;
  familyHistoryMother: "" | TriOption;

  // Prenatal
  prenatalAge10To14: boolean;
  prenatalAge15To19: boolean;
  prenatalAge20To49: boolean;

  // Family Planning
  fpTakeCocPills: "" | TriOption;
  fpTakePopPills: "" | TriOption;
  fpUsedCondoms: "" | TriOption;
  fpInjectables: "" | TriOption;
  fpIudPostpartum: "" | TriOption;
  fpIudInterval: "" | TriOption;
  fpHaveImplant: "" | TriOption;
  fpBtl: "" | TriOption;
  fpVasectomy: "" | TriOption;
  fpLam: "" | TriOption;
  fpKnowCalendarMethod: "" | TriOption;

  // National Immunization
  nationalImmunizationMonthsMin: string;
  nationalImmunizationMonthsMax: string;

  // Cardiovascular Disease
  cvdAge20To59: boolean;
  cvdAge60Above: boolean;
  cvdTakenLosartan50mg: "" | TriOption;
  cvdTakenLosartan100mg: "" | TriOption;
  cvdTakenAmlodipine10mg: "" | TriOption;
  cvdTakenAmlodipine5mg: "" | TriOption;
  cvdTakenMetformin500mg: "" | TriOption;
  cvdTakenAtorvastatin20mg: "" | TriOption;
  cvdTakenAtorvastatin40mg: "" | TriOption;
  cvdTakenMetoprolol50mg: "" | TriOption;
  cvdTakenGliclazide30mg: "" | TriOption;
}

const DEFAULT_FILTERS: AdvancedFilters = {
  middleInitial: "",
  ageYearsMin: "",
  ageYearsMax: "",
  ageMonthsMin: "",
  ageMonthsMax: "",
  sex: "",
  birthday: "",
  religion: "",
  barangay: "",
  city: "",
  weightMin: "",
  weightMax: "",
  heightMin: "",
  heightMax: "",
  bcgVaccine: "",
  hepBVaccine: "",
  vitaminK: "",
  vitamins: false,
  familyHistoryConditions: [],
  familyHistoryOther: "",
  familyHistoryMother: "",

  prenatalAge10To14: false,
  prenatalAge15To19: false,
  prenatalAge20To49: false,

  fpTakeCocPills: "",
  fpTakePopPills: "",
  fpUsedCondoms: "",
  fpInjectables: "",
  fpIudPostpartum: "",
  fpIudInterval: "",
  fpHaveImplant: "",
  fpBtl: "",
  fpVasectomy: "",
  fpLam: "",
  fpKnowCalendarMethod: "",

  nationalImmunizationMonthsMin: "",
  nationalImmunizationMonthsMax: "",

  cvdAge20To59: false,
  cvdAge60Above: false,
  cvdTakenLosartan50mg: "",
  cvdTakenLosartan100mg: "",
  cvdTakenAmlodipine10mg: "",
  cvdTakenAmlodipine5mg: "",
  cvdTakenMetformin500mg: "",
  cvdTakenAtorvastatin20mg: "",
  cvdTakenAtorvastatin40mg: "",
  cvdTakenMetoprolol50mg: "",
  cvdTakenGliclazide30mg: "",
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

function isFiltersActive(f: AdvancedFilters): boolean {
  return Object.entries(f).some(([, v]) => (Array.isArray(v) ? v.length > 0 : v !== "" && v !== false));
}

function MotherSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "" | TriOption;
  onChange: (v: "" | TriOption) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1 flex-wrap">
        {MOTHER_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
              value === opt.value
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#004b96] hover:text-[#004b96]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function VaccineSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "" | TriOption;
  onChange: (v: "" | TriOption) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1 flex-wrap">
        {VACCINE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
              value === opt.value
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#004b96] hover:text-[#004b96]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgramYesNoSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "" | TriOption;
  onChange: (v: "" | TriOption) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1 flex-wrap">
        {VACCINE_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
              value === opt.value
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#004b96] hover:text-[#004b96]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgeRangeToggle({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
        active
          ? "bg-[#004b96] text-white border-[#004b96]"
          : "bg-white text-gray-700 border-gray-300 hover:border-[#004b96] hover:text-[#004b96]"
      }`}
    >
      {label}
    </button>
  );
}



function parseKg(s: string) { return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0; }
function parseCm(s: string) { return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0; }

const inputCls = "border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#004b96] focus:ring-1 focus:ring-[#004b96]/20 w-full";
const labelCls = "text-xs font-semibold text-gray-600 mb-1 block";
const sectionTitleCls = "text-[#004b96] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1.5 border-b-2 border-[#004b96]/20 flex items-center gap-1.5";

function TriSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: "" | TriOption) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1 flex-wrap">
        {TRI_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
              value === opt.value
                ? "bg-[#004b96] text-white border-[#004b96]"
                : "bg-white text-gray-600 border-gray-300 hover:border-[#004b96] hover:text-[#004b96]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PatientInformation() {

  const { user } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);
  const [searchLast, setSearchLast]   = useState("");
  const [searchFirst, setSearchFirst] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All Program");
  const [selectedPurok, setSelectedPurok] = useState("All Purok");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advFilters, setAdvFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);
  const [appliedAdvFilters, setAppliedAdvFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);

  // Load patients from service on mount
  useEffect(() => {
    patientsService
      .getPatients()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

const handleSavePatient = async (payload: PatientEditModalSavePayload) => {
  try {
    const { patient, familyPlanningProgramInfo, cardiovascularDiseaseProgramInfo } = payload;

    const original = patients.find((p) => p.id === patient.id);
    const oldPrograms = parsePrograms(original?.program);
    const newPrograms = parsePrograms(patient.program);

    const saved = await patientsService.updatePatient(
  patient.id,
  patient,
  user.fullName,
  true
);

    // save/update currently selected program info
    if (newPrograms.includes("Family Planning") && familyPlanningProgramInfo) {
      await patientsService.saveProgramInformation(
  saved.id,
  {
    programName: "Family Planning",
    details: familyPlanningProgramInfo,
  },
  user.fullName,
  false
);
    }

    if (newPrograms.includes("Cardiovascular Disease") && cardiovascularDiseaseProgramInfo) {
  await patientsService.saveProgramInformation(
    saved.id,
    {
      programName: "Cardiovascular Disease",
      details: cardiovascularDiseaseProgramInfo,
    },
    user.fullName,
    false
  );
}

    // delete unchecked program info
    if (oldPrograms.includes("Family Planning") && !newPrograms.includes("Family Planning")) {
      await patientsService.deleteProgramInformation(
  saved.id,
  "Family Planning",
  user.fullName,
  false
);
    }

    if (oldPrograms.includes("Cardiovascular Disease") && !newPrograms.includes("Cardiovascular Disease")) {
      await patientsService.deleteProgramInformation(
  saved.id,
  "Cardiovascular Disease",
  user.fullName,
  false
);
    }

    await addLogbookEntry({
      staffUsername: user.fullName,
      action: "Edit Record",
      patientName: `${saved.firstName} ${saved.lastName}`,
      patientId: saved.id,
    });

    const refreshed = await patientsService.getPatientById(saved.id);

    setPatients((prev) =>
      prev.map((p) => (p.id === refreshed.id ? refreshed : p))
    );

    if (selectedPatient?.id === refreshed.id) {
      setSelectedPatient(refreshed);
    }

    setEditingPatient(null);
  } catch (error) {
    console.error("Failed to update patient:", error);
  }
};
  const setAdv = <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
    setAdvFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCondition = (cond: string) => {
    setAdvFilters((prev) => ({
      ...prev,
      familyHistoryConditions: prev.familyHistoryConditions.includes(cond)
        ? prev.familyHistoryConditions.filter((c) => c !== cond)
        : [...prev.familyHistoryConditions, cond],
    }));
  };

  const handleApply = () => {
    setAppliedAdvFilters({ ...advFilters });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setAdvFilters(DEFAULT_FILTERS);
    setAppliedAdvFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const getProgramInformation = (patient: Patient, programName: string) =>
  patient.programsInformation?.find((info) => info.programName === programName);

const isTruthyProgramYes = (value: unknown) => value === true || value === "true" || value === "YES";

const matchesTriBool = (filterValue: "" | TriOption, actualValue: unknown) => {
  if (filterValue === "") return true;
  if (filterValue === "YES") return isTruthyProgramYes(actualValue);
  if (filterValue === "NO") return !isTruthyProgramYes(actualValue);
  return true;
};


  const filtered = patients.filter((p) => {
  const af = appliedAdvFilters;

  // Basic filters
  if (!p.lastName.toLowerCase().includes(searchLast.toLowerCase())) return false;
  if (!p.firstName.toLowerCase().includes(searchFirst.toLowerCase())) return false;
  if (
  selectedProgram !== "All Program" &&
  !parsePrograms(p.program).includes(selectedProgram)
) return false;
  if (selectedPurok !== "All Purok" && p.purok !== selectedPurok) return false;

  // Advanced text / select filters
  if (af.middleInitial && !p.middleInitial.toLowerCase().includes(af.middleInitial.toLowerCase())) return false;
  if (af.sex && p.sex !== af.sex) return false;

  // Birthday exact match
  if (af.birthday && p.birthday !== af.birthday) return false;

  // Religion exact match from dropdown
  if (af.religion && p.religion !== af.religion) return false;

  if (af.barangay && !p.barangay.toLowerCase().includes(af.barangay.toLowerCase())) return false;
  if (af.city && !p.city.toLowerCase().includes(af.city.toLowerCase())) return false;
  if (af.vitamins && !p.vitamins) return false;

  // Age filters
  const patientYears = Number(p.age ?? 0);
  const patientMonths = Number(p.ageMonths ?? 0);

  if (af.ageYearsMin !== "" && patientYears < Number(af.ageYearsMin)) return false;
  if (af.ageYearsMax !== "" && patientYears > Number(af.ageYearsMax)) return false;

  if (af.ageMonthsMin !== "" && patientMonths < Number(af.ageMonthsMin)) return false;
  if (af.ageMonthsMax !== "" && patientMonths > Number(af.ageMonthsMax)) return false;

  // Weight / Height filters
  const w = parseKg(p.weight || "");
  const h = parseCm(p.height || "");

  if (af.weightMin !== "" && w < Number(af.weightMin)) return false;
  if (af.weightMax !== "" && w > Number(af.weightMax)) return false;
  if (af.heightMin !== "" && h < Number(af.heightMin)) return false;
  if (af.heightMax !== "" && h > Number(af.heightMax)) return false;

  // Vaccines
  if (af.bcgVaccine === "YES" && p.bcgVaccine !== "YES") return false;
if (af.bcgVaccine === "NO" && p.bcgVaccine !== "NO") return false;

if (af.hepBVaccine === "YES" && p.hepBVaccine !== "YES") return false;
if (af.hepBVaccine === "NO" && p.hepBVaccine !== "NO") return false;

if (af.vitaminK === "YES" && p.vitaminK !== "YES") return false;
if (af.vitaminK === "NO" && p.vitaminK !== "NO") return false;

  // Family history conditions: patient must contain all selected
  if (af.familyHistoryConditions.length > 0) {
    const patientConditions = p.familyHistoryConditions || [];
    if (!af.familyHistoryConditions.every((c) => patientConditions.includes(c))) return false;
  }

  if (
    af.familyHistoryOther &&
    !(p.familyHistoryOther || "").toLowerCase().includes(af.familyHistoryOther.toLowerCase())
  ) return false;

  const isMother = p.sex === "Female" && !!p.maternalRecord;

if (af.familyHistoryMother === "YES" && !isMother) return false;
if (af.familyHistoryMother === "NO" && isMother) return false;

  const familyPlanningInfo = getProgramInformation(p, "Family Planning");
  const cardiovascularInfo = getProgramInformation(p, "Cardiovascular Disease");
  const patientAgeYears = Number(p.age ?? 0);
  const patientAgeMonthsOnly = Number(p.ageMonths ?? 0);

  // Prenatal age ranges
  const prenatalAgeSelected = [
    af.prenatalAge10To14,
    af.prenatalAge15To19,
    af.prenatalAge20To49,
  ].some(Boolean);

  if (prenatalAgeSelected) {
    const inPrenatalRange =
      (af.prenatalAge10To14 && patientAgeYears >= 10 && patientAgeYears <= 14) ||
      (af.prenatalAge15To19 && patientAgeYears >= 15 && patientAgeYears <= 19) ||
      (af.prenatalAge20To49 && patientAgeYears >= 20 && patientAgeYears <= 49);

    if (!hasProgram(p.program, "Prenatal Care") || !inPrenatalRange) return false;
  }

  // Family Planning program filters
  const familyPlanningFilterUsed = [
    af.fpTakeCocPills,
    af.fpTakePopPills,
    af.fpUsedCondoms,
    af.fpInjectables,
    af.fpIudPostpartum,
    af.fpIudInterval,
    af.fpHaveImplant,
    af.fpBtl,
    af.fpVasectomy,
    af.fpLam,
    af.fpKnowCalendarMethod,
  ].some((v) => v !== "");

  if (familyPlanningFilterUsed) {
    if (!hasProgram(p.program, "Family Planning") || !familyPlanningInfo?.details) return false;

    const d = familyPlanningInfo.details as Record<string, unknown>;

    if (!matchesTriBool(af.fpTakeCocPills, d.takeCocPills)) return false;
    if (!matchesTriBool(af.fpTakePopPills, d.takePopPills)) return false;
    if (!matchesTriBool(af.fpUsedCondoms, d.usedCondoms)) return false;
    if (!matchesTriBool(af.fpInjectables, d.injectables)) return false;
    if (!matchesTriBool(af.fpIudPostpartum, d.iudPostpartum)) return false;
    if (!matchesTriBool(af.fpIudInterval, d.iudInterval)) return false;
    if (!matchesTriBool(af.fpHaveImplant, d.haveImplant)) return false;
    if (!matchesTriBool(af.fpBtl, d.btl)) return false;
    if (!matchesTriBool(af.fpVasectomy, d.vasectomy)) return false;
    if (!matchesTriBool(af.fpLam, d.lam)) return false;
    if (!matchesTriBool(af.fpKnowCalendarMethod, d.knowCalendarMethod)) return false;
  }

  // National Immunization months filter
  if (af.nationalImmunizationMonthsMin !== "" || af.nationalImmunizationMonthsMax !== "") {
    if (!hasProgram(p.program, "National Immunization")) return false;
    if (patientAgeYears > 4) return false;

    const totalMonths = patientAgeYears * 12 + patientAgeMonthsOnly;
    if (af.nationalImmunizationMonthsMin !== "" && totalMonths < Number(af.nationalImmunizationMonthsMin)) return false;
    if (af.nationalImmunizationMonthsMax !== "" && totalMonths > Number(af.nationalImmunizationMonthsMax)) return false;
  }

  // Cardiovascular Disease age ranges + medicine filters
  const cvdAgeSelected = af.cvdAge20To59 || af.cvdAge60Above;
  const cvdMedicineFilterUsed = [
    af.cvdTakenLosartan50mg,
    af.cvdTakenLosartan100mg,
    af.cvdTakenAmlodipine10mg,
    af.cvdTakenAmlodipine5mg,
    af.cvdTakenMetformin500mg,
    af.cvdTakenAtorvastatin20mg,
    af.cvdTakenAtorvastatin40mg,
    af.cvdTakenMetoprolol50mg,
    af.cvdTakenGliclazide30mg,
  ].some((v) => v !== "");

  if (cvdAgeSelected || cvdMedicineFilterUsed) {
    if (!hasProgram(p.program, "Cardiovascular Disease") || !cardiovascularInfo?.details) return false;

    if (cvdAgeSelected) {
      const inCvdRange =
        (af.cvdAge20To59 && patientAgeYears >= 20 && patientAgeYears <= 59) ||
        (af.cvdAge60Above && patientAgeYears >= 60);

      if (!inCvdRange) return false;
    }

    const d = cardiovascularInfo.details as Record<string, unknown>;

    if (!matchesTriBool(af.cvdTakenLosartan50mg, d.takenLosartan50mg)) return false;
    if (!matchesTriBool(af.cvdTakenLosartan100mg, d.takenLosartan100mg)) return false;
    if (!matchesTriBool(af.cvdTakenAmlodipine10mg, d.takenAmlodipine10mg)) return false;
    if (!matchesTriBool(af.cvdTakenAmlodipine5mg, d.takenAmlodipine5mg)) return false;
    if (!matchesTriBool(af.cvdTakenMetformin500mg, d.takenMetformin500mg)) return false;
    if (!matchesTriBool(af.cvdTakenAtorvastatin20mg, d.takenAtorvastatin20mg)) return false;
    if (!matchesTriBool(af.cvdTakenAtorvastatin40mg, d.takenAtorvastatin40mg)) return false;
    if (!matchesTriBool(af.cvdTakenMetoprolol50mg, d.takenMetoprolol50mg)) return false;
    if (!matchesTriBool(af.cvdTakenGliclazide30mg, d.takenGliclazide30mg)) return false;
  }


  return true;
});

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const filterActive = isFiltersActive(appliedAdvFilters);
  const pendingChanges = JSON.stringify(advFilters) !== JSON.stringify(appliedAdvFilters);

  return (
    <div className="flex flex-col gap-3 h-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div>
  <h1 className="text-[#4db8ff] font-extrabold text-4xl leading-tight drop-shadow-[0_0_6px_rgba(77,184,255,0.35)]">
    DASHBOARD
  </h1>
  <p className="text-[#8fd3ff] font-bold text-base">
    PATIENT INFORMATION:
  </p>
</div>

      {/* Row 1: Name Search Fields */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-bold text-sm text-black whitespace-nowrap">Last Name</label>
          <input
            type="text"
            placeholder="ex. Cruz"
            value={searchLast}
            onChange={(e) => { setSearchLast(e.target.value); setCurrentPage(1); }}
            className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm bg-white w-32 focus:outline-none focus:border-[#004b96]"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold text-sm text-black whitespace-nowrap">First Name</label>
          <input
            type="text"
            placeholder="ex. John"
            value={searchFirst}
            onChange={(e) => { setSearchFirst(e.target.value); setCurrentPage(1); }}
            className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm bg-white w-32 focus:outline-none focus:border-[#004b96]"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold text-sm text-black whitespace-nowrap">Middle Initial</label>
          <input
            type="text"
            placeholder="ex. B"
            maxLength={3}
            value={advFilters.middleInitial}
            onChange={(e) => { setAdv("middleInitial", e.target.value); setCurrentPage(1); }}
            className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm bg-white w-20 focus:outline-none focus:border-[#004b96]"
          />
        </div>
      </div>

      {/* Row 2: Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedProgram}
          onChange={(e) => { setSelectedProgram(e.target.value); setCurrentPage(1); }}
          className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#004b96] min-w-[160px]"
        >
          {programs.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={selectedPurok}
          onChange={(e) => { setSelectedPurok(e.target.value); setCurrentPage(1); }}
          className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#004b96] min-w-[140px]"
        >
          {puroks.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showAdvancedFilter && (
          <motion.div
            initial={{ opacity: 0, y: -12, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="bg-white border border-[#004b96]/30 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#004b96]">
              <div className="flex items-center gap-2 text-white">
                <SlidersHorizontal size={15} />
                <span className="font-bold text-sm">Advanced Filters</span>
                {filterActive && (
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvancedFilter(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Section 1: Personal Information */}
              <div>
                <p className={sectionTitleCls}>Personal Information</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Sex</label>
                    <div className="flex flex-col gap-1 mt-1">
                      {(["", "Male", "Female"] as const).map((s) => (
                        <label key={s} className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-700">
                          <input
                            type="radio"
                            name="adv-sex"
                            checked={advFilters.sex === s}
                            onChange={() => setAdv("sex", s)}
                            className="accent-[#004b96]"
                          />
                          {s === "" ? "All" : s}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
  <label className={labelCls}>Birthday</label>
  <input
    className={inputCls}
    type="date"
    value={advFilters.birthday}
    onChange={(e) => setAdv("birthday", e.target.value)}
  />
</div>
                </div>
              </div>

              {/* Section 2: Demographics */}
              <div>
                <p className={sectionTitleCls}>Demographics</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div>
                    <label className={labelCls}>Age – Years</label>
                    <div className="flex items-center gap-1">
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Min"
                        min={0}
                        value={advFilters.ageYearsMin}
                        onChange={(e) => setAdv("ageYearsMin", e.target.value)}
                      />
                      <span className="text-gray-400 text-xs">–</span>
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Max"
                        min={0}
                        value={advFilters.ageYearsMax}
                        onChange={(e) => setAdv("ageYearsMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Age – Months</label>
                    <div className="flex items-center gap-1">
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Min"
                        min={0}
                        max={11}
                        value={advFilters.ageMonthsMin}
                        onChange={(e) => setAdv("ageMonthsMin", e.target.value)}
                      />
                      <span className="text-gray-400 text-xs">–</span>
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Max"
                        min={0}
                        max={11}
                        value={advFilters.ageMonthsMax}
                        onChange={(e) => setAdv("ageMonthsMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
  <label className={labelCls}>Religion</label>
  <select
    className={inputCls}
    value={advFilters.religion}
    onChange={(e) => setAdv("religion", e.target.value)}
  >
    <option value="">All Religions</option>
    {religions.map((religion) => (
      <option key={religion} value={religion}>
        {religion}
      </option>
    ))}
  </select>
</div>
                  <div>
                    <label className={labelCls}>Barangay</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Gov. Paciano"
                      value={advFilters.barangay}
                      onChange={(e) => setAdv("barangay", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Davao City"
                      value={advFilters.city}
                      onChange={(e) => setAdv("city", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Measurements */}
              <div>
                <p className={sectionTitleCls}>Physical Measurements</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Weight (kg) – Min to Max</label>
                    <div className="flex items-center gap-2">
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Min kg"
                        min={0}
                        value={advFilters.weightMin}
                        onChange={(e) => setAdv("weightMin", e.target.value)}
                      />
                      <span className="text-gray-400 text-xs font-semibold">–</span>
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Max kg"
                        min={0}
                        value={advFilters.weightMax}
                        onChange={(e) => setAdv("weightMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Height (cm) – Min to Max</label>
                    <div className="flex items-center gap-2">
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Min cm"
                        min={0}
                        value={advFilters.heightMin}
                        onChange={(e) => setAdv("heightMin", e.target.value)}
                      />
                      <span className="text-gray-400 text-xs font-semibold">–</span>
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Max cm"
                        min={0}
                        value={advFilters.heightMax}
                        onChange={(e) => setAdv("heightMax", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Vaccines */}
              <div>
                <p className={sectionTitleCls}>Vaccines</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <VaccineSelect
  label="Take BCG Vaccine"
  value={advFilters.bcgVaccine}
  onChange={(v) => setAdv("bcgVaccine", v)}
/>
<VaccineSelect
  label="Take HEP B Vaccine"
  value={advFilters.hepBVaccine}
  onChange={(v) => setAdv("hepBVaccine", v)}
/>
<VaccineSelect
  label="Vitamin K"
  value={advFilters.vitaminK}
  onChange={(v) => setAdv("vitaminK", v)}
/>
                </div>
                {/* Vitamins toggle */}
                <div className="mt-3">
                  <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                    advFilters.vitamins
                      ? "bg-[#004b96] text-white border-[#004b96]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#004b96]/50 hover:text-[#004b96]"
                  }`}>
                    <input
                      type="checkbox"
                      checked={advFilters.vitamins}
                      onChange={(e) => setAdv("vitamins", e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${advFilters.vitamins ? "bg-white border-white" : "border-gray-400"}`}>
                      {advFilters.vitamins && (
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                        </svg>
                      )}
                    </span>
                    With Vitamins only
                  </label>
                </div>
              </div>

              <div>
  <p className={sectionTitleCls}>Prenatal Section</p>
  <div className="flex flex-wrap gap-2">
    <AgeRangeToggle
      label="10-14 age range"
      active={advFilters.prenatalAge10To14}
      onToggle={() => setAdv("prenatalAge10To14", !advFilters.prenatalAge10To14)}
    />
    <AgeRangeToggle
      label="15-19 age range"
      active={advFilters.prenatalAge15To19}
      onToggle={() => setAdv("prenatalAge15To19", !advFilters.prenatalAge15To19)}
    />
    <AgeRangeToggle
      label="20-49 age range"
      active={advFilters.prenatalAge20To49}
      onToggle={() => setAdv("prenatalAge20To49", !advFilters.prenatalAge20To49)}
    />
  </div>
</div>

<div>
  <p className={sectionTitleCls}>Family Planning Section</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <ProgramYesNoSelect label="Take CoC pills" value={advFilters.fpTakeCocPills} onChange={(v) => setAdv("fpTakeCocPills", v)} />
    <ProgramYesNoSelect label="Take PoP pills" value={advFilters.fpTakePopPills} onChange={(v) => setAdv("fpTakePopPills", v)} />
    <ProgramYesNoSelect label="Used Condoms" value={advFilters.fpUsedCondoms} onChange={(v) => setAdv("fpUsedCondoms", v)} />
    <ProgramYesNoSelect label="Injectables" value={advFilters.fpInjectables} onChange={(v) => setAdv("fpInjectables", v)} />
    <ProgramYesNoSelect label="IUD Postpartum" value={advFilters.fpIudPostpartum} onChange={(v) => setAdv("fpIudPostpartum", v)} />
    <ProgramYesNoSelect label="IUD Interval" value={advFilters.fpIudInterval} onChange={(v) => setAdv("fpIudInterval", v)} />
    <ProgramYesNoSelect label="Implant" value={advFilters.fpHaveImplant} onChange={(v) => setAdv("fpHaveImplant", v)} />
    <ProgramYesNoSelect label="BTL" value={advFilters.fpBtl} onChange={(v) => setAdv("fpBtl", v)} />
    <ProgramYesNoSelect label="Vasectomy" value={advFilters.fpVasectomy} onChange={(v) => setAdv("fpVasectomy", v)} />
    <ProgramYesNoSelect label="LAM" value={advFilters.fpLam} onChange={(v) => setAdv("fpLam", v)} />
    <ProgramYesNoSelect label="Calendar Method" value={advFilters.fpKnowCalendarMethod} onChange={(v) => setAdv("fpKnowCalendarMethod", v)} />
  </div>
</div>

<div>
  <p className={sectionTitleCls}>National Immunization Program Section</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>0-59 Months age range</label>
      <div className="flex items-center gap-2">
        <input
          className={inputCls}
          type="number"
          placeholder="Min"
          min={0}
          max={59}
          value={advFilters.nationalImmunizationMonthsMin}
          onChange={(e) => setAdv("nationalImmunizationMonthsMin", e.target.value)}
        />
        <span className="text-gray-400 text-xs font-semibold">–</span>
        <input
          className={inputCls}
          type="number"
          placeholder="Max"
          min={0}
          max={59}
          value={advFilters.nationalImmunizationMonthsMax}
          onChange={(e) => setAdv("nationalImmunizationMonthsMax", e.target.value)}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        Only applicable for 4 years old and below patients
      </p>
    </div>
  </div>
</div>

<div>
  <p className={sectionTitleCls}>Cardiovascular Disease Program Section</p>

  <div className="flex flex-wrap gap-2 mb-4">
    <AgeRangeToggle
      label="20-59 age range"
      active={advFilters.cvdAge20To59}
      onToggle={() => setAdv("cvdAge20To59", !advFilters.cvdAge20To59)}
    />
    <AgeRangeToggle
      label="60 age range"
      active={advFilters.cvdAge60Above}
      onToggle={() => setAdv("cvdAge60Above", !advFilters.cvdAge60Above)}
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <ProgramYesNoSelect label="Taken Losartan 50mg" value={advFilters.cvdTakenLosartan50mg} onChange={(v) => setAdv("cvdTakenLosartan50mg", v)} />
    <ProgramYesNoSelect label="Taken Losartan 100mg" value={advFilters.cvdTakenLosartan100mg} onChange={(v) => setAdv("cvdTakenLosartan100mg", v)} />
    <ProgramYesNoSelect label="Taken Amlodipine 10mg" value={advFilters.cvdTakenAmlodipine10mg} onChange={(v) => setAdv("cvdTakenAmlodipine10mg", v)} />
    <ProgramYesNoSelect label="Taken Amlodipine 5mg" value={advFilters.cvdTakenAmlodipine5mg} onChange={(v) => setAdv("cvdTakenAmlodipine5mg", v)} />
    <ProgramYesNoSelect label="Taken Metformin 500mg" value={advFilters.cvdTakenMetformin500mg} onChange={(v) => setAdv("cvdTakenMetformin500mg", v)} />
    <ProgramYesNoSelect label="Taken Atorvastatin 20mg" value={advFilters.cvdTakenAtorvastatin20mg} onChange={(v) => setAdv("cvdTakenAtorvastatin20mg", v)} />
    <ProgramYesNoSelect label="Taken Atorvastatin 40mg" value={advFilters.cvdTakenAtorvastatin40mg} onChange={(v) => setAdv("cvdTakenAtorvastatin40mg", v)} />
    <ProgramYesNoSelect label="Taken Metoprolol 50mg" value={advFilters.cvdTakenMetoprolol50mg} onChange={(v) => setAdv("cvdTakenMetoprolol50mg", v)} />
    <ProgramYesNoSelect label="Taken Gliclazide 30mg" value={advFilters.cvdTakenGliclazide30mg} onChange={(v) => setAdv("cvdTakenGliclazide30mg", v)} />
  </div>
</div>


              {/* Section 5: Family History */}
              <div>
                <p className={sectionTitleCls}>Family History</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {FAMILY_HISTORY_LIST.map((cond) => {
                    const isChecked = advFilters.familyHistoryConditions.includes(cond);
                    return (
                      <label
                        key={cond}
                        className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border text-xs font-medium transition-all ${
                          isChecked
                            ? "bg-[#004b96] text-white border-[#004b96]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#004b96]/50 hover:text-[#004b96]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCondition(cond)}
                          className="sr-only"
                        />
                        <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${isChecked ? "bg-white border-white" : "border-gray-400"}`}>
                          {isChecked && (
                            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#004b96]" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                            </svg>
                          )}
                        </span>
                        {cond}
                      </label>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Other, Specify</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Heart disease"
                      value={advFilters.familyHistoryOther}
                      onChange={(e) => setAdv("familyHistoryOther", e.target.value)}
                    />
                  </div>
                  <MotherSelect
  label="Mother"
  value={advFilters.familyHistoryMother}
  onChange={(v) => setAdv("familyHistoryMother", v)}
/>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {filtered.length} patient{filtered.length !== 1 ? "s" : ""} match{filtered.length === 1 ? "es" : ""} current filters
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  disabled={!pendingChanges}
                  className="px-5 py-1.5 text-sm bg-[#004b96] text-white rounded-lg hover:bg-[#003a75] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 py-3 bg-[#ddeef8] border-b border-gray-200">
          <p className="font-bold text-[#004b96] text-sm tracking-wide">PATIENT INFORMATION:</p>
          <button
            onClick={() => setShowAdvancedFilter((v) => !v)}
            className={`flex items-center gap-1.5 font-semibold text-sm transition-colors px-3 py-1 rounded-md ${
              filterActive
                ? "bg-[#004b96] text-white"
                : "text-[#004b96] hover:bg-[#004b96]/10"
            }`}
          >
            <Filter size={14} />
            FILTER
            {filterActive && (
              <span className="bg-white text-[#004b96] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                ✓
              </span>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#004b96] text-white">
                <th className="px-4 py-2.5 text-left font-semibold">Patient Name</th>
                <th className="px-4 py-2.5 text-left font-semibold">Age</th>
                <th className="px-4 py-2.5 text-left font-semibold"># of<br/>Children</th>
                <th className="px-4 py-2.5 text-left font-semibold">Family<br/>Planning</th>
                <th className="px-4 py-2.5 text-left font-semibold">Purok</th>
                <th className="px-4 py-2.5 text-left font-semibold">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    <svg className="animate-spin w-5 h-5 mx-auto text-[#004b96]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No patients found</td>
                </tr>
              ) : (
                paginated.map((patient, idx) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.25, ease: "easeOut" }}
                    whileHover={{ backgroundColor: "#ddeef8" }}
                    onClick={async () => {
  try {
    const full = await patientsService.getPatientById(patient.id);
    setSelectedPatient(full);
  } catch (e) {
    console.error(e);
    setSelectedPatient(patient); // fallback
  }
}}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#f0f7fc]"}`}
                  >
                    <td className="px-4 py-2.5 font-medium text-[#004b96] hover:underline">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
  {patientsService.formatPatientAge(patient)}
</td>
                    
                    <td className="px-4 py-2.5 text-gray-700">
  {patientsService.getPatientAgeGroup(patient) === "child" ? "N/A" : patient.children}
</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <div className={`w-4 h-4 rounded border-2 ${patient.familyPlanning ? "bg-blue-200 border-blue-400" : "border-gray-300"}`} />
                        {patient.familyPlanning && (
                          <span className="text-xs text-gray-500">{patient.sex === "Female" ? "♀" : "♂"}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{patient.purok}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingPatient(patient); }}
                        className="text-[#004b96] hover:text-[#003a75] hover:bg-[#e8f4fd] rounded p-1 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 bg-[rgba(0,122,255,0.5)] text-white px-3 py-1.5 rounded-md text-sm disabled:opacity-40 hover:bg-[rgba(0,122,255,0.7)] transition-colors"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-[#004b96] text-white"
                  : "bg-[rgba(0,122,255,0.3)] text-white hover:bg-[rgba(0,122,255,0.5)]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-1 bg-[rgba(0,122,255,0.5)] text-white px-3 py-1.5 rounded-md text-sm disabled:opacity-40 hover:bg-[rgba(0,122,255,0.7)] transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Medical Profile Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientMedicalProfile
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPatient && (
          <PatientEditModal
  patient={editingPatient}
  onClose={() => setEditingPatient(null)}
  onSave={handleSavePatient}
/>
        )}
      </AnimatePresence>
    </div>
  );
}