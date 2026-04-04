import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { LogbookEntry } from "./mockData";
import * as logbookService from "../../api/logbook.service";
import * as patientsService from "../../api/patients.service";
import * as staffService from "../../api/staff.service";

const ITEMS_PER_PAGE = 9;
const ACTIONS = [
  "Add Record",
  "Add Record (Maternal)",
  "Edit Record",
  "Edit Record (Immunization)",
  "Add Staff",
];

/* ── Date helpers ─────────────────────────────────────────── */
function tsToLocal(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localToTs(local: string): string {
  if (!local) return "";
  return `${local}:00`;
}

function formatDisplayTimestamp(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());

  let hours = d.getHours();
  const minutes = pad(d.getMinutes());
  const suffix = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${year}-${month}-${day} At ${pad(hours)}:${minutes} ${suffix}`;
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

function extractDateOnly(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function splitPatientName(name: string) {
  const clean = name.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ").filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.length > 1 ? parts[parts.length - 1] : "",
  };
}

/* ── Filter type ──────────────────────────────────────────── */
interface LogbookFilters {
  username: string;
  action: string;
  patientFirstName: string;
  patientLastName: string;
  timestampDate: string;
}

const DEFAULT_FILTERS: LogbookFilters = {
  username: "",
  action: "",
  patientFirstName: "",
  patientLastName: "",
  timestampDate: "",
};



/* ── Inline edit row ─────────────────────────────────────── */
interface EditRowProps {
  draft: LogbookEntry;
  onChange: (field: keyof LogbookEntry, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  patientNames: string[];
  staffList: string[];
}

function EditRow({
  draft,
  onChange,
  onSave,
  onCancel,
  patientNames,
  staffList,
}: EditRowProps) {
  const selectCls =
    "w-full text-xs bg-white border border-[#90caf9] rounded px-2 py-1.5 text-gray-800 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/60 appearance-none";

  const today = getTodayLocalDate();

  return (
    <motion.tr
      key="edit-row"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: "rgba(0,75,150,0.55)" }}
      className="border-b border-white/20"
    >
      <td className="px-3 py-2">
        <select
          value={draft.username}
          onChange={(e) => onChange("username", e.target.value)}
          className={selectCls}
        >
          {staffList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      <td className="px-3 py-2">
        <select
          value={draft.action}
          onChange={(e) => onChange("action", e.target.value)}
          className={selectCls}
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </td>

      <td className="px-3 py-2">
        <select
          value={draft.patientName}
          onChange={(e) => onChange("patientName", e.target.value)}
          className={selectCls}
        >
          {patientNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </td>

      <td className="px-3 py-2">
        <input
          type="datetime-local"
          value={tsToLocal(draft.timestamp)}
          max={`${today}T23:59`}
          onChange={(e) =>
            onChange(
              "timestamp",
              localToTs(
                clampToToday(e.target.value.slice(0, 10)) + e.target.value.slice(10)
              )
            )
          }
          className={selectCls}
        />
      </td>

      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={onSave}
            className="flex items-center justify-center w-6 h-6 rounded bg-green-500 hover:bg-green-400 text-white transition-colors"
            title="Save"
          >
            <Check size={12} />
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-6 h-6 rounded bg-red-400 hover:bg-red-300 text-white transition-colors"
            title="Cancel"
          >
            <X size={12} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── Main component ───────────────────────────────────────── */
export function LogbookActivity() {
  const [logbook, setLogbook] = useState<LogbookEntry[]>([]);
  const [patientNames, setPatientNames] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  const [filters, setFilters] = useState<LogbookFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<LogbookFilters>(DEFAULT_FILTERS);

  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<LogbookEntry | null>(null);

  const today = getTodayLocalDate();

  useEffect(() => {
  Promise.allSettled([
    logbookService.getLogbook(),
    patientsService.getPatients(),
    staffService.getStaff(),
  ])
    .then(([lbRes, patientsRes, staffRes]) => {
      if (lbRes.status === "fulfilled") {
        setLogbook(lbRes.value);
      }

      if (patientsRes.status === "fulfilled") {
        setPatientNames(
          patientsRes.value.map((p) =>
            [p.firstName, p.middleInitial, p.lastName].filter(Boolean).join(" ")
          )
        );
      }

      if (staffRes.status === "fulfilled") {
        setStaffList(staffRes.value);
      } else {
        setStaffList([]);
      }
    })
    .finally(() => setLoading(false));
}, []);

  const setFilter = <K extends keyof LogbookFilters>(
    key: K,
    value: LogbookFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const filtered = logbook.filter((entry) => {
    const af = appliedFilters;

    if (
      af.username &&
      !entry.username.toLowerCase().includes(af.username.toLowerCase())
    ) {
      return false;
    }

    if (af.action && entry.action !== af.action) {
      return false;
    }

    const parsedName = splitPatientName(entry.patientName);

    if (
      af.patientFirstName &&
      !parsedName.firstName
        .toLowerCase()
        .includes(af.patientFirstName.toLowerCase())
    ) {
      return false;
    }

    if (
      af.patientLastName &&
      !parsedName.lastName
        .toLowerCase()
        .includes(af.patientLastName.toLowerCase())
    ) {
      return false;
    }

    if (af.timestampDate && extractDateOnly(entry.timestamp) !== af.timestampDate) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  
  const pendingChanges =
    JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  const startEdit = (entry: LogbookEntry) => {
    setEditingId(entry.id);
    setDraft({ ...entry });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = async () => {
    if (!draft) return;

    try {
      const updated = await logbookService.updateLogbookEntry(draft.id, draft);
      setLogbook((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditingId(null);
      setDraft(null);
    } catch (error) {
      console.error("Failed to update logbook entry:", error);
      alert("Failed to update logbook entry.");
    }
  };

  const changeDraft = (field: keyof LogbookEntry, value: string) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-full bg-[#004b96] rounded-2xl overflow-hidden shadow-lg"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex items-center gap-2 px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-[#003a75] rounded-t-xl px-5 py-2"
        >
          <span className="text-white font-bold text-sm">LOGBOOK ACTIVITY</span>
        </motion.div>
      </div>

      <div className="flex-1 bg-[#1565c0] mx-2 mb-2 rounded-b-xl rounded-tr-xl p-4 flex flex-col gap-3">

        <motion.div
  initial={{ opacity: 0, x: -16 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.15, duration: 0.3 }}
  className="flex flex-col gap-2"
>
  <div className="flex items-center gap-2 flex-wrap">
    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
      <Search size={13} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Username"
        value={filters.username}
        onChange={(e) => setFilter("username", e.target.value)}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
      />
    </div>

    <div className="relative flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
      <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">
        ACTION
      </span>
      <select
        value={filters.action}
        onChange={(e) => setFilter("action", e.target.value)}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 appearance-none cursor-pointer min-w-0"
      >
        <option value="">All Actions</option>
        {ACTIONS.map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="text-gray-400 flex-shrink-0 pointer-events-none" />
    </div>
  </div>

  <div className="flex items-center gap-2 flex-wrap">
    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
      <Search size={13} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Patient First Name"
        value={filters.patientFirstName}
        onChange={(e) => setFilter("patientFirstName", e.target.value)}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
      />
    </div>

    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
      <Search size={13} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Patient Last Name"
        value={filters.patientLastName}
        onChange={(e) => setFilter("patientLastName", e.target.value)}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
      />
    </div>

    <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
      <Calendar size={13} className="text-gray-400 flex-shrink-0" />
      <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">
        DATE
      </span>
      <input
        type="date"
        value={filters.timestampDate}
        max={today}
        onChange={(e) => setFilter("timestampDate", clampToToday(e.target.value))}
        className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
      />
    </div>
  </div>

  <div className="flex items-center justify-between pt-1">
    <p className="text-xs text-white/80">
      {filtered.length} record{filtered.length !== 1 ? "s" : ""} match
      {filtered.length === 1 ? "es" : ""} current filters
    </p>

    <div className="flex gap-2">
      <button
        onClick={handleClearFilters}
        className="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-1.5 rounded-full transition-colors"
      >
        Clear
      </button>
      <button
        onClick={handleApplyFilters}
        disabled={!pendingChanges}
        className="bg-white text-[#004b96] hover:bg-white/90 text-xs px-4 py-1.5 rounded-full transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Apply Filters
      </button>
    </div>
  </div>
</motion.div>

        <div className="flex-1 overflow-hidden rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#004b96] text-white"
              >
                <th className="px-4 py-2.5 text-left font-semibold">Username</th>
                <th className="px-4 py-2.5 text-left font-semibold">Action</th>
                <th className="px-4 py-2.5 text-left font-semibold">Patient Name</th>
                <th className="px-4 py-2.5 text-left font-semibold">Timestamp</th>
                <th className="px-4 py-2.5 text-left font-semibold w-12"></th>
              </motion.tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="text-center py-8 text-white/70">
                      <svg
                        className="animate-spin w-5 h-5 mx-auto text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    </td>
                  </motion.tr>
                ) : paginated.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="text-center py-8 text-white/70">
                      No records found
                    </td>
                  </motion.tr>
                ) : (
                  paginated.map((entry, idx) =>
                    editingId === entry.id && draft ? (
                      <EditRow
                        key={`edit-${entry.id}`}
                        draft={draft}
                        onChange={changeDraft}
                        onSave={saveEdit}
                        onCancel={cancelEdit}
                        patientNames={patientNames}
                        staffList={staffList}
                      />
                    ) : (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{
                          delay: idx * 0.04,
                          duration: 0.22,
                          ease: "easeOut",
                        }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        style={{
                          backgroundColor:
                            idx % 2 === 0
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.1)",
                        }}
                        className="border-b border-white/10"
                      >
                        <td className="px-4 py-2.5 text-white">{entry.username}</td>
                        <td className="px-4 py-2.5 text-white">{entry.action}</td>
                        <td className="px-4 py-2.5 text-white">{entry.patientName}</td>
                        <td className="px-4 py-2.5 text-white">
                          {formatDisplayTimestamp(entry.timestamp)}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => startEdit(entry)}
                            className="text-[#90caf9] hover:text-white transition-colors"
                            title="Edit row"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    )
                  )
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-end gap-2 pt-1"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 bg-[rgba(0,122,255,0.5)] text-white px-3 py-1.5 rounded-md text-sm disabled:opacity-40 hover:bg-[rgba(0,122,255,0.7)] transition-colors"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-white text-[#004b96]"
                  : "bg-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.3)]"
              }`}
            >
              {page}
            </motion.button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 bg-[rgba(0,122,255,0.5)] text-white px-3 py-1.5 rounded-md text-sm disabled:opacity-40 hover:bg-[rgba(0,122,255,0.7)] transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}