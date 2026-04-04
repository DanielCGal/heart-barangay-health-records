import { useRef, useState } from "react";
import { X, User, MapPin, Phone, Activity, Heart, Clock, Pill, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Patient, PhysicalExamFindings, ProgramInformation } from "./mockData";
import { ImmunizationStatusTab } from "./ImmunizationStatusTab";
import { getPatientAgeGroup, formatPatientAgeWithLabel } from "../../api/patients.service";

interface PatientMedicalProfileProps {
  patient: Patient;
  onClose: () => void;
  timeline?: string;
}

const FAMILY_HISTORY_ALL = [
  "Asthma/Allergies", "Birth Defects", "Cancer", "Dementia",
  "Diabetes", "Hypertension", "Lung Disease", "Mental Illness",
];

const SHEENT_OPTIONS = ["Pallor/Cyanosis", "Poor Skin Turgor", "Sunken Eyeball", "Sunken Fontanelle", "Icteric Sclerae", "Pale Conjunctivae", "Poor Vision", "Deafness", "Ear Discharges", "Nasal Congestion", "Lymphadenopathy", "Dental Caries", "Neck Mass"];
const CHEST_OPTIONS = ["Asymmetrical Expansion", "Chest Retraction", "Breast Discharge/Lump", "Crackles/Rales/Wheeze"];
const HEART_OPTIONS = ["Precordial Bulge", "Chest Pain", "Orthopnea"];
const ABDOMEN_OPTIONS = ["Bloody Stool", "Nausea", "Constipation", "Anorexia"];
const GU_OPTIONS = ["Frequency/Urgency", "Dysuria/Polyuria", "Abnormal Discharge", "Bloody Discharge"];
const EXTREMITIES_OPTIONS = ["Nail Clubbing", "Back/Joint Pain", "Joint Swelling", "Lymphedema"];
const NEURO_OPTIONS = ["Abnormal Gait", "Tremor/Seizure", "Numbness/Weakness", "Anxiety/Depression"];


const PROGRAM_OPTIONS = [
  "Prenatal Care",
  "Family Planning",
  "National Immunization",
  "National Tuberculosis",
  "Cardiovascular Disease",
];

type TabKey =
  | "identifying"
  | "medical"
  | "physical"
  | "maternal"
  | "immunization"
  | "programInformation";

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


function YesNo({ value }: { value: boolean }) {
  return value
    ? <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-xs"><CheckCircle2 size={13} /> YES</span>
    : <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-xs"><XCircle size={13} /> NO</span>;
}

function TriBadge({ value }: { value: string }) {
  if (value === "YES") return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">YES</span>;
  if (value === "NO") return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">NO</span>;
  return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">N/A</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[#004b96] font-bold text-xs uppercase tracking-wider mb-2 pb-1.5 border-b-2 border-[#004b96]/20">
      {children}
    </h4>
  );
}

function ExamSystem({ title, data, options }: { title: string; data: PhysicalExamFindings; options: string[] }) {
  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">{title}</p>
        <span className="text-xs text-gray-400">No data.</span>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">{title}</p>
      {data.essentiallyNormal && data.findings.length === 0 ? (
        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
          <CheckCircle2 size={13} /> Essentially Normal
        </span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {data.essentiallyNormal && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Essentially Normal</span>
          )}
          {options.map((opt) => {
            const active = data.findings.includes(opt);
            return active ? (
              <span key={opt} className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">{opt}</span>
            ) : null;
          })}
          {data.othersSpecify && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              Other: {data.othersSpecify}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function showValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function getProgramInformation(patient: Patient, programName: string): ProgramInformation | undefined {
  return patient.programsInformation?.find((info) => info.programName === programName);
}

function hasProgramInformationTab(patient: Patient): boolean {
  return !!patient.programsInformation?.some(
    (info) =>
      info.programName === "Family Planning" ||
      info.programName === "Cardiovascular Disease"
  );
}

function renderProgramValue(value: unknown, isDate = false) {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "boolean") {
    return <YesNo value={value} />;
  }

  return <span className="font-medium text-gray-800 text-xs">{String(value)}</span>;
}


export function PatientMedicalProfile({ patient, onClose, timeline }: PatientMedicalProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("identifying");
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!tabsRef.current) return;

    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  const ageGroup = getPatientAgeGroup(patient);
  const isAdult = ageGroup === "adult";

  const maternalRecord = patient.maternalRecord;
  const familyPlanningProgramInfo = getProgramInformation(patient, "Family Planning");
  const cardiovascularProgramInfo = getProgramInformation(patient, "Cardiovascular Disease");
  const hasProgramInfoTab = hasProgramInformationTab(patient);

  const hasMaternalTab =
    isAdult &&
    !!maternalRecord &&
    (
      (maternalRecord.gravida ?? 0) > 0 ||
      (maternalRecord.para ?? 0) > 0 ||
      !!maternalRecord.lmp ||
      !!maternalRecord.edd ||
      !!maternalRecord.ageOfGestation ||
      !!maternalRecord.dateOfDelivery
    );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "identifying", label: "Identifying Data" },
    { key: "medical", label: "Medical History" },
    { key: "physical", label: "Physical Exam" },
    { key: "immunization", label: "Immunization Status" },
    ...(hasProgramInfoTab
      ? [{ key: "programInformation" as TabKey, label: "Program Information" }]
      : []),
    ...(hasMaternalTab
      ? [{ key: "maternal" as TabKey, label: "Maternal Record" }]
      : []),
  ];

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col"
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
            <div className="bg-white/20 rounded-full p-2">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">
                {patient.firstName} {patient.lastName}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white/80 text-sm">Patient Medical Profile</p>
                {timeline && (
                  <>
                    <span className="text-white/40 text-sm">|</span>
                    <p className="text-white/70 text-xs">{timeline}</p>
                  </>
                )}
              </div>
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

        {/* Vital Signs Bar */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <div className={`grid gap-3 ${timeline ? "grid-cols-2" : "grid-cols-3"}`}>
            {[
              { icon: <Activity size={20} className="text-[#004b96] flex-shrink-0" />, label: "Blood Pressure", value: patient.bloodPressure },
              { icon: <Heart size={20} className="text-[#004b96] flex-shrink-0" />, label: "Weight", value: patient.weight },
              ...(!timeline ? [{ icon: <Clock size={20} className="text-[#004b96] flex-shrink-0" />, label: "Last Visit", value: patient.lastVisit }] : []),
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.07, duration: 0.3 }}
                className="bg-[#e8f4fd] rounded-xl p-3 flex items-center gap-3"
              >
                {card.icon}
                <div>
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className="font-semibold text-[#004b96] text-sm">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex-shrink-0">
  <div
    ref={tabsRef}
    onWheel={handleTabsWheel}
    className="overflow-x-auto overflow-y-hidden scrollbar-thin"
  >
    <div className="flex gap-1 border-b border-gray-200 min-w-max pr-2">
      {tabs.map((tab, i) => (
        <motion.button
          key={tab.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05 }}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap flex-shrink-0 ${
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
</div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* ── TAB 1: Identifying Data ── */}
              {activeTab === "identifying" && (
                <>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <SectionTitle>Identifying Data</SectionTitle>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Last Name:</span>
                        <span className="font-medium">{patient.lastName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">First Name:</span>
                        <span className="font-medium">{patient.firstName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">M.I.:</span>
                        <span className="font-medium">{patient.middleInitial}</span>
                      </div>
                      <div className="flex gap-2">
  <span className="text-gray-500 min-w-[100px]">Age:</span>
  <span className="font-medium">{formatPatientAgeWithLabel(patient)}</span>
</div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Sex:</span>
                        <span className="font-medium">{patient.sex}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Birthday:</span>
                        <span className="font-medium">{patient.birthday}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Religion:</span>
                        <span className="font-medium">{patient.religion}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Civil Status:</span>
                        <span className="font-medium">{patient.civilStatus}</span>
                      </div>
                      <div className="flex gap-2 col-span-2 items-start">
                        <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 min-w-[90px]">Address:</span>
                        <span className="font-medium">{patient.address}, {patient.barangay}, {patient.city}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500 min-w-[90px]">Contact:</span>
                        <span className="font-medium">{patient.contactNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Education:</span>
                        <span className="font-medium">{patient.educationalAttainment}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Occupation:</span>
                        <span className="font-medium">{patient.occupation}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Purok:</span>
                        <span className="font-medium">{patient.purok}</span>
                      </div>

                      <div className="flex gap-2">
  <span className="text-gray-500 min-w-[100px]">Spouse Name:</span>
  <span className="font-medium">{patient.spouseName || "N/A"}</span>
</div>

<div className="flex gap-2">
  <span className="text-gray-500 min-w-[100px]">Spouse Occupation:</span>
  <span className="font-medium">{patient.spouseOccupation || "N/A"}</span>
</div>

<div className="flex gap-2">
  <span className="text-gray-500 min-w-[100px]">Spouse Contact:</span>
  <span className="font-medium">{patient.spouseContact || "N/A"}</span>
</div>

                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Program:</span>
                        <div className="flex gap-1 flex-wrap">
  {parsePrograms(patient.program).length > 0 ? (
    parsePrograms(patient.program).map((program) => (
      <span
        key={program}
        className="px-2 py-0.5 rounded-full bg-blue-100 text-[#004b96] text-xs font-semibold"
      >
        {program}
      </span>
    ))
  ) : (
    <span className="font-medium text-gray-400">No program</span>
  )}
</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Children:</span>
                        <span className="font-medium">{patient.children}</span>
                      </div>
                    </div>
                  </div>

                </>
              )}

              {/* ── TAB 2: Medical History ── */}
              {activeTab === "medical" && (
                <>
                  {/* Past Medical History */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <SectionTitle>Past Medical History</SectionTitle>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium text-xs mb-1">CO-MORBIDITIES:</p>
                        <p className="text-gray-800 ml-2">{patient.coMorbidities}</p>
                        <p className="text-gray-500 text-xs ml-4 mt-0.5">Allergies: <span className="text-gray-700 font-medium">{patient.allergies}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <Pill size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 font-medium text-xs mb-1">MAINTENANCE MEDICATION, DOSE & FREQUENCY:</p>
                          <p className="text-gray-800 ml-2">{patient.maintenanceMedication}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-xs mb-1">PREVIOUS ILLNESSES / SURGERIES:</p>
                        <p className="text-gray-800 ml-2">{patient.previousIllnesses}</p>
                      </div>
                    </div>
                  </div>

{ageGroup === "child" && (
  <div className="border border-gray-200 rounded-xl p-4">
    <SectionTitle>Newborn Care</SectionTitle>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Type of Delivery:</span>
        <p className="font-medium text-gray-800">{patient.typeOfDelivery || "—"}</p>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Mother Tetanus Toxoid Status:</span>
        <p className="font-medium text-gray-800">
          {patient.motherTetanusShots ? `${patient.motherTetanusShots} shot(s)` : "—"}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Birth Weight:</span>
        <p className="font-medium text-gray-800">{patient.birthWeight || "—"}</p>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Birth Height:</span>
        <p className="font-medium text-gray-800">{patient.birthHeight || "—"}</p>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Current Weight:</span>
        <p className="font-medium text-gray-800">{patient.weight || "—"}</p>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs">Current Height:</span>
        <p className="font-medium text-gray-800">{patient.height || "—"}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">BCG Vaccine</span>
          <TriBadge value={patient.bcgVaccine || "N/A"} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Date: <span className="text-gray-700 font-medium">{patient.bcgDate || "—"}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Hep B Vaccine</span>
          <TriBadge value={patient.hepBVaccine || "N/A"} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Date: <span className="text-gray-700 font-medium">{patient.hepBDate || "—"}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Vitamin K</span>
          <TriBadge value={patient.vitaminK || "N/A"} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Date: <span className="text-gray-700 font-medium">{patient.vitaminKDate || "—"}</span>
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">Newborn Screening</span>
          <YesNo value={!!patient.newbornScreening} />
        </div>
        {patient.newbornScreening && (
          <>
            <p className="text-xs text-gray-500">
              Date: <span className="text-gray-700 font-medium">{patient.screeningDate || "—"}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Result: <span className="text-gray-700 font-medium">{patient.screeningResults || "—"}</span>
            </p>
          </>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">Initiated Breastfeeding</span>
          <YesNo value={!!patient.initiatedBreastfeeding} />
        </div>
        {patient.initiatedBreastfeeding && (
          <p className="text-xs text-gray-500">
            Date: <span className="text-gray-700 font-medium">{patient.breastfeedingDate || "—"}</span>
          </p>
        )}
      </div>
    </div>

    <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-gray-500 text-xs font-semibold">Place of Delivery:</span>{" "}
      <span className="text-gray-700 text-sm font-medium">{patient.placeOfDelivery || "—"}</span>
    </div>
  </div>
)}
                  {/* Family History */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <SectionTitle>Family History</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {FAMILY_HISTORY_ALL.map((cond) => {
                        const has = patient.familyHistoryConditions.includes(cond);
                        return (
                          <div
                            key={cond}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 border text-xs font-medium ${
                              has
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-gray-50 border-gray-200 text-gray-400"
                            }`}
                          >
                            {has
                              ? <CheckCircle2 size={13} className="text-red-500 flex-shrink-0" />
                              : <MinusCircle size={13} className="text-gray-300 flex-shrink-0" />
                            }
                            {cond}
                          </div>
                        );
                      })}
                    </div>
                    {patient.familyHistoryOther && (
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Others:</span> {patient.familyHistoryOther}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                      <span className="font-semibold">Mother:</span>
                      <TriBadge value={patient.familyHistoryMother} />
                    </div>
                  </div>

                  {/* Personal / Social History */}
                  {patient.personalSocialHistory && ageGroup === "adult" && (
  <div className="border border-gray-200 rounded-xl p-4">
    <SectionTitle>Personal / Social History</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      {[
        { label: "Eats Healthy Diet", value: patient.personalSocialHistory.eatsHealthyDiet },
        { label: "Adequate Physical Activity", value: patient.personalSocialHistory.adequatePhysicalActivity },
        { label: "Sufficient Rest / Sleep", value: patient.personalSocialHistory.sufficientRestSleep },
        { label: "Normal Growth and Development", value: patient.personalSocialHistory.normalGrowthDevelopment },
        { label: "Engage with Multiple Sex Partners", value: patient.personalSocialHistory.multiplePartners },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-gray-600 text-xs">{row.label}</span>
          <YesNo value={!!row.value} />
        </div>
      ))}

      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-600 text-xs">
          Smokes Tobacco
          {patient.personalSocialHistory.smokesTobacco && patient.personalSocialHistory.tobaccoPacksPerYear > 0
            ? ` (${patient.personalSocialHistory.tobaccoPacksPerYear} pack/yr)`
            : ""}
        </span>
        <YesNo value={!!patient.personalSocialHistory.smokesTobacco} />
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-600 text-xs">
          Drinks Alcohol
          {patient.personalSocialHistory.drinksAlcohol && patient.personalSocialHistory.alcoholBottlesPerYear > 0
            ? ` (${patient.personalSocialHistory.alcoholBottlesPerYear} bottles/yr)`
            : ""}
        </span>
        <YesNo value={!!patient.personalSocialHistory.drinksAlcohol} />
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-600 text-xs">
          Takes Illegal Drugs
          {patient.personalSocialHistory.takesIllegalDrugs && patient.personalSocialHistory.illegalDrugsSpecify
            ? ` (${patient.personalSocialHistory.illegalDrugsSpecify})`
            : ""}
        </span>
        <YesNo value={!!patient.personalSocialHistory.takesIllegalDrugs} />
      </div>
    </div>
  </div>
)}

{patient.personalSocialHistory && ageGroup === "child" && (
  <div className="border border-gray-200 rounded-xl p-4">
    <SectionTitle>Personal / Social History</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      {[
        { label: "Lives with Immediate Family", value: patient.personalSocialHistory.livesWithImmediateFamily },
        { label: "Uneventful Birth and Infancy", value: patient.personalSocialHistory.uneventfulBirthAndInfancy },
        { label: "Normal Growth and Development", value: patient.personalSocialHistory.normalGrowthDevelopment },
        { label: "Normal Moods and Attitudes", value: patient.personalSocialHistory.normalMoodsAndAttitudes },
        { label: "Normal Interest in Family and Friends", value: patient.personalSocialHistory.normalInterestInFamilyAndFriends },
        { label: "Normal Interest in Work and Play", value: patient.personalSocialHistory.normalInterestInWorkAndPlay },
        { label: "Adequate Physical Activity", value: patient.personalSocialHistory.adequatePhysicalActivity },
        { label: "Sufficient Rest / Sleep", value: patient.personalSocialHistory.sufficientRestSleep },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-gray-600 text-xs">{row.label}</span>
          <YesNo value={!!row.value} />
        </div>
      ))}
    </div>

    {patient.personalSocialHistory.socialOther && (
      <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-gray-500 text-xs font-semibold">Others:</span>{" "}
        <span className="text-gray-700 text-xs">{patient.personalSocialHistory.socialOther}</span>
      </div>
    )}
  </div>
)}

                  {/* Health Programs */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <SectionTitle>Health Programs & Vaccines</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${patient.familyPlanning ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-xs text-gray-600">Family Planning: <span className="font-medium text-gray-800">{patient.familyPlanning ? "Enrolled" : "Not Enrolled"}</span></span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${patient.vitamins ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-xs text-gray-600">Vitamins: <span className="font-medium text-gray-800">{patient.vitamins ? "Taking" : "Not Taking"}</span></span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500">BCG:</span>
                        <TriBadge value={patient.bcgVaccine} />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500">Hep B:</span>
                        <TriBadge value={patient.hepBVaccine} />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500">Vitamin K:</span>
                        <TriBadge value={patient.vitaminK} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── TAB 3: Physical Exam ── */}
              {activeTab === "physical" && patient.physicalExam && (
                <>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <SectionTitle>Physical Examination Findings</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ExamSystem title="SHEENT" data={patient.physicalExam.sheent} options={SHEENT_OPTIONS} />
                      <ExamSystem title="Chest, Breast & Lungs" data={patient.physicalExam.chestBreastLungs} options={CHEST_OPTIONS} />
                      <ExamSystem title="Heart" data={patient.physicalExam.heart} options={HEART_OPTIONS} />
                      <ExamSystem title="Abdomen" data={patient.physicalExam.abdomen} options={ABDOMEN_OPTIONS} />
                      <ExamSystem title="Genitourinary" data={patient.physicalExam.genitourinary} options={GU_OPTIONS} />
                      <ExamSystem title="Extremities" data={patient.physicalExam.extremities} options={EXTREMITIES_OPTIONS} />
                      <ExamSystem title="Neurological" data={patient.physicalExam.neurological} options={NEURO_OPTIONS} />
                    </div>
                  </div>
                </>
              )}

              {!patient.physicalExam && activeTab === "physical" && (
                <div className="text-center py-10 text-gray-400 text-sm">No physical exam data recorded.</div>
              )}

              {/* ── TAB: Immunization Status ── */}
              {activeTab === "immunization" && (
                <ImmunizationStatusTab
  patient={patient}
  onSaved={(savedPatient) => {
    // easiest quick fix:
    Object.assign(patient, savedPatient);
  }}
/>
              )}

              {activeTab === "programInformation" && (
  <>
    {familyPlanningProgramInfo && (
      <div className="border border-gray-200 rounded-xl p-4">
        <SectionTitle>Family Planning Program Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            { label: "Take CoC pills", value: familyPlanningProgramInfo.details.takeCocPills },
            { label: "CoC pills last date taken", value: familyPlanningProgramInfo.details.cocPillsLastDateTaken },
            { label: "Take PoP pills", value: familyPlanningProgramInfo.details.takePopPills },
            { label: "PoP pills last date taken", value: familyPlanningProgramInfo.details.popPillsLastDateTaken },
            { label: "Used Condoms", value: familyPlanningProgramInfo.details.usedCondoms },
            { label: "Injectables", value: familyPlanningProgramInfo.details.injectables },
            { label: "IUD Postpartum", value: familyPlanningProgramInfo.details.iudPostpartum },
            { label: "IUD Interval", value: familyPlanningProgramInfo.details.iudInterval },
            { label: "Have Implant", value: familyPlanningProgramInfo.details.haveImplant },
            { label: "BTL", value: familyPlanningProgramInfo.details.btl },
            { label: "Vasectomy", value: familyPlanningProgramInfo.details.vasectomy },
            { label: "LAM", value: familyPlanningProgramInfo.details.lam },
            { label: "Know Calendar Method", value: familyPlanningProgramInfo.details.knowCalendarMethod },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-gray-600 text-xs">{row.label}</span>
              {renderProgramValue(row.value)}
            </div>
          ))}
        </div>
      </div>
    )}

    {cardiovascularProgramInfo && (
      <div className="border border-gray-200 rounded-xl p-4">
        <SectionTitle>Cardiovascular Disease Program Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            { label: "Taken Losartan 50mg", value: cardiovascularProgramInfo.details.takenLosartan50mg },
            { label: "Losartan 50mg last date taken", value: cardiovascularProgramInfo.details.losartan50mgLastDateTaken },

            { label: "Taken Losartan 100mg", value: cardiovascularProgramInfo.details.takenLosartan100mg },
            { label: "Losartan 100mg last date taken", value: cardiovascularProgramInfo.details.losartan100mgLastDateTaken },

            { label: "Taken Amlodipine 10mg", value: cardiovascularProgramInfo.details.takenAmlodipine10mg },
            { label: "Amlodipine 10mg last date taken", value: cardiovascularProgramInfo.details.amlodipine10mgLastDateTaken },

            { label: "Taken Amlodipine 5mg", value: cardiovascularProgramInfo.details.takenAmlodipine5mg },
            { label: "Amlodipine 5mg last date taken", value: cardiovascularProgramInfo.details.amlodipine5mgLastDateTaken },

            { label: "Taken Metformin 500mg", value: cardiovascularProgramInfo.details.takenMetformin500mg },
            { label: "Metformin 500mg last date taken", value: cardiovascularProgramInfo.details.metformin500mgLastDateTaken },

            { label: "Taken Atorvastatin 20mg", value: cardiovascularProgramInfo.details.takenAtorvastatin20mg },
            { label: "Atorvastatin 20mg last date taken", value: cardiovascularProgramInfo.details.atorvastatin20mgLastDateTaken },

            { label: "Taken Atorvastatin 40mg", value: cardiovascularProgramInfo.details.takenAtorvastatin40mg },
            { label: "Atorvastatin 40mg last date taken", value: cardiovascularProgramInfo.details.atorvastatin40mgLastDateTaken },

            { label: "Taken Metoprolol 50mg", value: cardiovascularProgramInfo.details.takenMetoprolol50mg },
            { label: "Metoprolol 50mg last date taken", value: cardiovascularProgramInfo.details.metoprolol50mgLastDateTaken },

            { label: "Taken Gliclazide 30mg", value: cardiovascularProgramInfo.details.takenGliclazide30mg },
            { label: "Gliclazide 30mg last date taken", value: cardiovascularProgramInfo.details.gliclazide30mgLastDateTaken },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-gray-600 text-xs">{row.label}</span>
              {renderProgramValue(row.value)}
            </div>
          ))}
        </div>
      </div>
    )}

    {!familyPlanningProgramInfo && !cardiovascularProgramInfo && (
      <div className="text-center py-10 text-gray-400 text-sm">
        No program information recorded.
      </div>
    )}
  </>
)}

              {/* ── TAB 4: Maternal Record ── */}
              {activeTab === "maternal" && maternalRecord && (
  <>
    {/* OB-GYNE HISTORY */}
    <div className="border border-gray-200 rounded-xl p-4">
      <SectionTitle>OB-GYNE History</SectionTitle>

      {/* OB Score */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 text-center">
        {[
          { label: "G", value: maternalRecord.gravida },
          { label: "P", value: maternalRecord.para },
          { label: "Full Term", value: maternalRecord.fullTerm },
          { label: "Preterm", value: maternalRecord.preterm },
          { label: "Abortion", value: maternalRecord.abortion },
          { label: "Living", value: maternalRecord.living },
        ].map((item) => (
          <div key={item.label} className="bg-[#e8f4fd] rounded-lg py-2 px-3">
            <p className="text-[10px] text-gray-500 font-medium">{item.label}</p>
            <p className="text-[#004b96] font-bold text-lg leading-tight">
              {showValue(item.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-3">
        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[110px]">Menarche Age:</span>
          <span className="font-medium text-xs">
            {maternalRecord.menarcheAge ? `${maternalRecord.menarcheAge} years old` : "—"}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[110px]">Menstrual Cycle:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.menstrualCycle)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[110px]">Menstrual Flow:</span>
          <span className="font-medium text-xs">
            {maternalRecord.menstrualFlowDays ? `${maternalRecord.menstrualFlowDays} days` : "—"}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[110px]">Coitarche Age:</span>
          <span className="font-medium text-xs">
            {maternalRecord.coitarcheAge ? `${maternalRecord.coitarcheAge} years old` : "—"}
          </span>
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <span className="text-gray-500 text-xs min-w-[110px]">Current FP Method:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.currentFpMethod)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "PAP Smear",
            done: maternalRecord.papSmear,
            date: maternalRecord.papSmearDate,
            result: maternalRecord.papSmearResult,
          },
          {
            label: "VIA",
            done: maternalRecord.via,
            date: maternalRecord.viaDate,
            result: maternalRecord.viaResult,
          },
          {
            label: "History of STI",
            done: maternalRecord.historyOfSti,
            date: maternalRecord.stiDate,
            result: maternalRecord.stiResult,
          },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              <YesNo value={!!item.done} />
            </div>

            <p className="text-xs text-gray-500">
              Date: <span className="text-gray-700 font-medium">{showValue(item.date)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Result: <span className="text-gray-700 font-medium">{showValue(item.result)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* PRENATAL CARE */}
    <div className="border border-gray-200 rounded-xl p-4">
      <SectionTitle>Prenatal Care</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Risk Code:</span>
          <span className="font-medium text-xs text-orange-600">{showValue(maternalRecord.riskCode)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Mother-Baby Book:</span>
          <YesNo value={!!maternalRecord.motherBabyBook} />
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Last Menstrual Period:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.lmp)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Expected Date of Delivery:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.edd)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Plan to Deliver At:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.planToDeliverAt)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Age of Gestation:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.ageOfGestation)}</span>
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Accompanying Person:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.accompanyingPerson)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Seen by Dentist</span>
            <YesNo value={!!maternalRecord.seenByDentist} />
          </div>
          <p className="text-xs text-gray-500">
            Date: <span className="font-medium text-gray-700">{showValue(maternalRecord.dentistDate)}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Seen by Physician</span>
            <YesNo value={!!maternalRecord.seenByPhysician} />
          </div>
          <p className="text-xs text-gray-500">
            Date: <span className="font-medium text-gray-700">{showValue(maternalRecord.physicianDate)}</span>
          </p>
        </div>
      </div>

      <div className="border border-gray-100 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Tetanus Toxoid Status & Date</p>
        <div className="grid grid-cols-5 gap-2">
          {(["tt1", "tt2", "tt3", "tt4", "tt5"] as const).map((key, i) => (
            <div key={key} className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs font-bold text-[#004b96]">TT{i + 1}</p>
              <p className="text-xs text-gray-600 mt-0.5">{showValue(maternalRecord[key])}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Iodized Salt:</span>
            <YesNo value={!!maternalRecord.iodizedSalt} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Iron Supplement:</span>
            <YesNo value={!!maternalRecord.ironSupplement} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Blood Type", maternalRecord.bloodType, maternalRecord.bloodTypeDate],
          ["FBS / RBS / A1C", maternalRecord.fbsRbsHba1c, maternalRecord.fbsRbsHba1cDate],
          ["HBsAg", maternalRecord.hbsag, maternalRecord.hbsagDate],
          ["Hemoglobin", maternalRecord.hemoglobinPrenatal, maternalRecord.hemoglobinPrenatalDate],
          ["HIV", maternalRecord.hiv, maternalRecord.hivDate],
          ["Syphilis", maternalRecord.syphilis, maternalRecord.syphilisDate],
          ["Tuberculosis", maternalRecord.tuberculosis, maternalRecord.tuberculosisDate],
          ["Urinalysis", maternalRecord.urinalysisPrenatal, maternalRecord.urinalysisPrenatalDate],
          ["Other Tests", maternalRecord.otherTestsPrenatal, maternalRecord.otherTestsPrenatalDate],
        ].map(([label, result, date]) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
            <p className="text-xs text-gray-500">
              Result: <span className="font-medium text-gray-700">{showValue(result)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Date: <span className="font-medium text-gray-700">{showValue(date)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* POSTNATAL CARE */}
    <div className="border border-gray-200 rounded-xl p-4">
      <SectionTitle>Postnatal Care</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Date of Delivery:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.dateOfDelivery)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Place of Delivery:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.postnatalPlaceOfDelivery)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Type of Delivery:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.typeOfDelivery)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Outcome of Pregnancy:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.outcomeOfPregnancy)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Attended By:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.attendedBy)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Complications:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.complications)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Sex of Newborn:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.sexOfNewborn)}</span>
        </div>

        <div className="flex gap-2">
          <span className="text-gray-500 text-xs min-w-[140px]">Birthweight:</span>
          <span className="font-medium text-xs">{showValue(maternalRecord.birthweight)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Hemoglobin</span>
            <YesNo value={!!maternalRecord.hemoglobinDone} />
          </div>
          <p className="text-xs text-gray-500">
            Result: <span className="font-medium text-gray-700">{showValue(maternalRecord.hemoglobinPostnatal)}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Date: <span className="font-medium text-gray-700">{showValue(maternalRecord.hemoglobinPostnatalDate)}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Vitamin A</span>
            <YesNo value={!!maternalRecord.vitaminA} />
          </div>
          <p className="text-xs text-gray-500">
            Date: <span className="font-medium text-gray-700">{showValue(maternalRecord.vitaminADate)}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Breastfeeding</span>
            <YesNo value={!!maternalRecord.breastfeeding} />
          </div>
          <p className="text-xs text-gray-500">
            Date Initiated: <span className="font-medium text-gray-700">{showValue(maternalRecord.breastfeedingDateInitiated)}</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Counseling</span>
            <YesNo value={!!maternalRecord.counseling} />
          </div>
          <p className="text-xs text-gray-500">
            Date: <span className="font-medium text-gray-700">{showValue(maternalRecord.counselingDate)}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Seen by Dentist</span>
            <YesNo value={!!maternalRecord.dentistPostnatalYes} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-gray-500">1st Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.dentistPostnatalVisits1)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">2nd Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.dentistPostnatalVisits2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">3rd Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.dentistPostnatalVisits3)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Seen by Physician</span>
            <YesNo value={!!maternalRecord.physicianPostnatalYes} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-gray-500">1st Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.physicianPostnatalVisits1)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">2nd Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.physicianPostnatalVisits2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">3rd Trimester</p>
              <p className="text-sm font-bold text-[#004b96]">{showValue(maternalRecord.physicianPostnatalVisits3)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Blood Type", maternalRecord.bloodTypePostnatal, maternalRecord.bloodTypePostnatalDate],
          ["FBS / RBS / A1C", maternalRecord.fbsRbsHba1cPostnatal, maternalRecord.fbsRbsHba1cPostnatalDate],
          ["HBsAg", maternalRecord.hbsagPostnatal, maternalRecord.hbsagPostnatalDate],
          ["Hemoglobin", maternalRecord.hemoglobinLabPostnatal, maternalRecord.hemoglobinLabPostnatalDate],
          ["HIV", maternalRecord.hivPostnatal, maternalRecord.hivPostnatalDate],
          ["Syphilis", maternalRecord.syphilisPostnatal, maternalRecord.syphilisPostnatalDate],
          ["Tuberculosis", maternalRecord.tuberculosisPostnatal, maternalRecord.tuberculosisPostnatalDate],
          ["Urinalysis", maternalRecord.urinalysisPostnatal, maternalRecord.urinalysisPostnatalDate],
          ["Other Tests", maternalRecord.otherTestsPostnatal, maternalRecord.otherTestsPostnatalDate],
        ].map(([label, result, date]) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
            <p className="text-xs text-gray-500">
              Result: <span className="font-medium text-gray-700">{showValue(result)}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Date: <span className="font-medium text-gray-700">{showValue(date)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}