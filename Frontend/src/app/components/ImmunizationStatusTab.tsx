import { useEffect, useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { motion, AnimatePresence } from "motion/react";
import { Patient } from "./mockData";
import * as patientsService from "../../api/patients.service";
import { useAuth } from "../../context/AuthContext";
import { addLogbookEntry } from "../../api/logbook.service";

// ── Data Types ─────────────────────────────────────────────────────────────
interface ImmCell { done: boolean; date: string; }
const mkCell = (): ImmCell => ({ done: false, date: "" });

// ITR 5 — Immunization Status
const ITR5_IMM_VACCINES = ["BCG","HEPATITIS B","PENTAVALENT","PCV","OPV","IPV","MCV1","MCV2","MMR"];
type ITR5ImmCol = "atBirth"|"w6"|"w10"|"w14"|"m9"|"m12";
const ITR5_IMM_COLS: { key: ITR5ImmCol; label: string }[] = [
  { key: "atBirth", label: "At Birth" },
  { key: "w6", label: "6 weeks" },
  { key: "w10", label: "10 weeks" },
  { key: "w14", label: "14 weeks" },
  { key: "m9", label: "9 months" },
  { key: "m12", label: "12 months" },
];

interface ITR5ImmRow {
  atBirth: ImmCell;
  w6: ImmCell;
  w10: ImmCell;
  w14: ImmCell;
  m9: ImmCell;
  m12: ImmCell;
  remarks: string;
}
type ITR5ImmData = Record<string, ITR5ImmRow>;

const mkITR5ImmData = (): ITR5ImmData =>
  Object.fromEntries(
    ITR5_IMM_VACCINES.map((v) => [
      v,
      { atBirth: mkCell(), w6: mkCell(), w10: mkCell(), w14: mkCell(), m9: mkCell(), m12: mkCell(), remarks: "" },
    ])
  );

// ITR 5 — Nutrition Status
const ITR5_NUTR_ITEMS = ["DEWORMING","VITAMIN A"];
type ITR5NutrCol = "m6"|"m12"|"m18"|"m24"|"m30"|"m36"|"m42"|"m48"|"m54"|"m60";
const ITR5_NUTR_COLS: { key: ITR5NutrCol; label: string }[] = [
  { key: "m6", label: "6 months" },
  { key: "m12", label: "12 months" },
  { key: "m18", label: "18 months" },
  { key: "m24", label: "24 months" },
  { key: "m30", label: "30 months" },
  { key: "m36", label: "36 months" },
  { key: "m42", label: "42 months" },
  { key: "m48", label: "48 months" },
  { key: "m54", label: "54 months" },
  { key: "m60", label: "60 months" },
];

type ITR5NutrRow = Record<ITR5NutrCol, ImmCell>;
type ITR5NutrData = Record<string, ITR5NutrRow>;

const mkITR5NutrData = (): ITR5NutrData =>
  Object.fromEntries(
    ITR5_NUTR_ITEMS.map((v) => [
      v,
      Object.fromEntries(ITR5_NUTR_COLS.map(({ key }) => [key, mkCell()])) as ITR5NutrRow,
    ])
  );

// ITR 6 — Immunization Status
const ITR6_VACCINES = ["COVID-19","HEPA B","HPV","INFLUENZA","PNEUMONIA","TETANUS","VARICELLA"];

interface ITR6ImmRow {
  dose1: ImmCell;
  dose2: ImmCell;
  dose3b1: ImmCell;
  dose4b2: ImmCell;
}
type ITR6ImmData = Record<string, ITR6ImmRow>;

const mkITR6ImmData = (): ITR6ImmData =>
  Object.fromEntries(
    ITR6_VACCINES.map((v) => [v, { dose1: mkCell(), dose2: mkCell(), dose3b1: mkCell(), dose4b2: mkCell() }])
  );

const ITR6_DOSE_LABELS: Record<string, [string, string, string | null, string | null]> = {
  "COVID-19": ["1st", "2nd", "B1", "B2"],
  "HEPA B": ["1st", "2nd", "3rd", null],
  "HPV": ["1st", "2nd", "3rd", null],
  "INFLUENZA": ["1st", "2nd", null, null],
  "PNEUMONIA": ["1st", "2nd", null, null],
  "TETANUS": ["1st", "2nd", "3rd", "4th"],
  "VARICELLA": ["1st", "2nd", null, null],
};

// ── Helpers for reading patient data ───────────────────────────────────────
function safeITR5ImmData(patient: Patient): ITR5ImmData {
  return patient.immunizationStatus?.childImmunization ?? mkITR5ImmData();
}

function safeITR5NutrData(patient: Patient): ITR5NutrData {
  return patient.immunizationStatus?.childNutrition ?? mkITR5NutrData();
}

function safeITR6ImmData(patient: Patient): ITR6ImmData {
  return patient.immunizationStatus?.adultImmunization ?? mkITR6ImmData();
}

// ── Cell sub-components ────────────────────────────────────────────────────
function ViewCell({ cell, label }: { cell: ImmCell; label?: string | null }) {
  if (label === null) {
    return <td className="px-2 py-2 text-center"><span className="text-[#334155]/40 text-[10px]">—</span></td>;
  }

  return (
    <td className="px-2 py-2 text-center min-w-[90px]">
      {cell.done ? (
        <div className="flex flex-col items-center gap-0.5">
          <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            DONE
          </span>
          {cell.date && <span className="text-[10px] text-emerald-300">{cell.date}</span>}
        </div>
      ) : null}
    </td>
  );
}



function EditCell({
  cell, label, onChange,
}: {
  cell: ImmCell;
  label?: string | null;
  onChange: (c: ImmCell) => void;
}) {
  if (label === null) {
    return <td className="px-2 py-2 text-center"><span className="text-[#334155]/40 text-[10px]">—</span></td>;
  }

  return (
    <td className="px-2 py-2 min-w-[110px]">
      <div className="flex flex-col items-center gap-1">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={cell.done}
            onChange={(e) => onChange({ ...cell, done: e.target.checked })}
            className="accent-emerald-400 w-3.5 h-3.5"
          />
          <span className="text-[10px] text-white/70 font-semibold">DONE</span>
        </label>

        {cell.done && (
          <input
            type="text"
            value={cell.date}
            onChange={(e) => onChange({ ...cell, date: e.target.value })}
            placeholder="MM/YYYY"
            className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white text-center placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        )}
      </div>
    </td>
  );
}

// ── ITR 5 Tables ───────────────────────────────────────────────────────────
function ITR5Tables({
  editMode,
  immData,
  nutrData,
  setImmData,
  setNutrData,
}: {
  editMode: boolean;
  immData: ITR5ImmData;
  nutrData: ITR5NutrData;
  setImmData: React.Dispatch<React.SetStateAction<ITR5ImmData>>;
  setNutrData: React.Dispatch<React.SetStateAction<ITR5NutrData>>;
}) {
  const updateImm = (vaccine: string, col: ITR5ImmCol | "remarks", value: ImmCell | string) => {
    setImmData((prev) => ({
      ...prev,
      [vaccine]: { ...prev[vaccine], [col]: value },
    }));
  };

  const updateNutr = (item: string, col: ITR5NutrCol, value: ImmCell) => {
    setNutrData((prev) => ({
      ...prev,
      [item]: { ...prev[item], [col]: value },
    }));
  };

  return (
    <>
      <div className="mb-4">
        <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest mb-2 px-1">Immunization Status:</p>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-[11px] border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#0d1f2d]">
                <th className="px-3 py-2 text-left text-white font-bold uppercase tracking-wide w-32">VACCINE</th>
                {ITR5_IMM_COLS.map((col) => (
                  <th key={col.key} className="px-2 py-2 text-center text-white font-semibold">{col.label}</th>
                ))}
                <th className="px-3 py-2 text-left text-white font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {ITR5_IMM_VACCINES.map((vaccine, idx) => (
                <motion.tr
                  key={vaccine}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-[#1a2f45]" : "bg-[#1e3550]"}`}
                >
                  <td className="px-3 py-2 font-semibold" style={{ color: "#f0c060" }}>{vaccine}</td>

                  {ITR5_IMM_COLS.map((col) =>
                    editMode ? (
                      <EditCell
                        key={col.key}
                        cell={immData[vaccine][col.key]}
                        onChange={(c) => updateImm(vaccine, col.key, c)}
                      />
                    ) : (
                      <ViewCell key={col.key} cell={immData[vaccine][col.key]} />
                    )
                  )}

                  <td className="px-3 py-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={immData[vaccine].remarks}
                        onChange={(e) => updateImm(vaccine, "remarks", e.target.value)}
                        placeholder="Notes…"
                        className="w-full bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                      />
                    ) : (
                      <span className="text-white/60 text-[10px]">{immData[vaccine].remarks}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest mb-2 px-1">Nutrition Status:</p>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-[11px] border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#0d1f2d]">
                <th className="px-3 py-2 text-left text-white font-bold w-32"></th>
                {ITR5_NUTR_COLS.map((col) => (
                  <th key={col.key} className="px-2 py-2 text-center text-white font-semibold">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ITR5_NUTR_ITEMS.map((item, idx) => (
                <motion.tr
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + idx * 0.08, duration: 0.25 }}
                  className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-[#1a2f45]" : "bg-[#1e3550]"}`}
                >
                  <td className="px-3 py-2 font-semibold" style={{ color: "#f0c060" }}>{item}</td>

                  {ITR5_NUTR_COLS.map((col) =>
                    editMode ? (
                      <EditCell
                        key={col.key}
                        cell={nutrData[item][col.key]}
                        onChange={(c) => updateNutr(item, col.key, c)}
                      />
                    ) : (
                      <ViewCell key={col.key} cell={nutrData[item][col.key]} />
                    )
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── ITR 6 Table ────────────────────────────────────────────────────────────
function ITR6Table({
  editMode,
  immData,
  setImmData,
}: {
  editMode: boolean;
  immData: ITR6ImmData;
  setImmData: React.Dispatch<React.SetStateAction<ITR6ImmData>>;
}) {
  const update = (vaccine: string, col: keyof ITR6ImmRow, value: ImmCell) => {
    setImmData((prev) => ({
      ...prev,
      [vaccine]: { ...prev[vaccine], [col]: value },
    }));
  };

  const cols: { key: keyof ITR6ImmRow; header: string }[] = [
    { key: "dose1", header: "1st DOSE DATE" },
    { key: "dose2", header: "2nd DOSE DATE" },
    { key: "dose3b1", header: "3rd/B1 DOSE DATE" },
    { key: "dose4b2", header: "4th/B2 DOSE DATE" },
  ];

  return (
    <div>
      <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest mb-2 px-1">Immunization Status:</p>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-[11px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#0d1f2d]">
              <th className="px-3 py-2 text-left text-white font-bold uppercase tracking-wide w-32">VACCINE</th>
              {cols.map((c) => (
                <th key={c.key} className="px-3 py-2 text-left text-white font-semibold">{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITR6_VACCINES.map((vaccine, idx) => {
              const [l1, l2, l3, l4] = ITR6_DOSE_LABELS[vaccine];
              const labels: (string | null)[] = [l1, l2, l3, l4];

              return (
                <motion.tr
                  key={vaccine}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.25 }}
                  className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-[#1a2f45]" : "bg-[#1e3550]"}`}
                >
                  <td className="px-3 py-2 font-semibold" style={{ color: "#f0c060" }}>{vaccine}</td>

                  {cols.map((c, i) =>
                    editMode ? (
                      <EditCell
                        key={c.key}
                        cell={immData[vaccine][c.key]}
                        label={labels[i]}
                        onChange={(v) => update(vaccine, c.key, v)}
                      />
                    ) : (
                      <ViewCell
                        key={c.key}
                        cell={immData[vaccine][c.key]}
                        label={labels[i]}
                      />
                    )
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export function ImmunizationStatusTab({
  patient,
  onSaved,
}: {
  patient: Patient;
  onSaved?: (savedPatient: Patient) => void;
}) {

  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imm5Data, setImm5Data] = useState<ITR5ImmData>(safeITR5ImmData(patient));
  const [nutr5Data, setNutr5Data] = useState<ITR5NutrData>(safeITR5NutrData(patient));
  const [imm6Data, setImm6Data] = useState<ITR6ImmData>(safeITR6ImmData(patient));

  const isPediatric = patient.age <= 5;

  useEffect(() => {
    setImm5Data(safeITR5ImmData(patient));
    setNutr5Data(safeITR5NutrData(patient));
    setImm6Data(safeITR6ImmData(patient));
    setEditMode(false);
  }, [patient]);

  const handleEditButton = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      setSaving(true);

      const payload = isPediatric
        ? {
            childImmunization: imm5Data,
            childNutrition: nutr5Data,
          }
        : {
            adultImmunization: imm6Data,
          };

      const savedPatient = await patientsService.saveImmunizationStatus(
  patient.id,
  payload,
  user.fullName
);

await addLogbookEntry({
  staffUsername: user.fullName,
  action: "Edit Record (Immunization)",
  patientName: `${savedPatient.firstName} ${savedPatient.lastName}`,
  patientId: savedPatient.id,
});

      onSaved?.(savedPatient);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save immunization status", err);
      alert("Failed to save immunization status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a2f45]">
      <div className="bg-[#0d1f2d] px-4 py-3 flex items-center justify-between">
        <p className="text-white font-bold text-xs uppercase tracking-wider">
          {isPediatric
            ? "ITR 5 Years Old and Under — Immunization & Nutrition"
            : "ITR 6 Years Old and Above — Immunization Status"}
        </p>

        <motion.button
          onClick={handleEditButton}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: saving ? 1 : 0.95 }}
          animate={{ backgroundColor: editMode ? "#10b981" : "rgba(255,255,255,0.1)" }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Saving...
            </>
          ) : editMode ? (
            <>
              <Check size={12} />
              Done Editing
            </>
          ) : (
            <>
              <Pencil size={12} />
              Edit
            </>
          )}
        </motion.button>
      </div>

      <div className="bg-[#152232] p-4">
        {isPediatric ? (
          <ITR5Tables
            editMode={editMode}
            immData={imm5Data}
            nutrData={nutr5Data}
            setImmData={setImm5Data}
            setNutrData={setNutr5Data}
          />
        ) : (
          <ITR6Table
            editMode={editMode}
            immData={imm6Data}
            setImmData={setImm6Data}
          />
        )}
      </div>

      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0d1f2d]/80 px-4 py-2 flex items-center gap-2 overflow-hidden"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] text-white/50">
              Check <span className="text-emerald-400 font-semibold">DONE</span> to mark a vaccine as administered, then enter the date.
            </p>
            <button
              onClick={() => setEditMode(false)}
              className="ml-auto"
            >
              <X size={14} className="text-white/40 hover:text-white/70" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}