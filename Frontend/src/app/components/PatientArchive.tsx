import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Archive, Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ArchiveEntry, Patient } from "./mockData";
import * as archiveService from "../../api/archive.service";
import * as patientsService from "../../api/patients.service";
import { PatientMedicalProfile } from "./PatientMedicalProfile";

const ITEMS_PER_PAGE = 9;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ArchiveFilters {
  lastName: string;
  firstName: string;
  afterDt: string;
  beforeDt: string;
  filterMonth: string;
  filterYear: string;
}

const DEFAULT_FILTERS: ArchiveFilters = {
  lastName: "",
  firstName: "",
  afterDt: "",
  beforeDt: "",
  filterMonth: "",
  filterYear: "",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2010 + 1 }, (_, i) => String(2010 + i)).reverse();

function parseArchiveDate(dateStr: string): Date {
  return new Date(dateStr);
}

function parseDatetimeInput(val: string): Date | null {
  if (!val) return null;
  return new Date(val);
}

function getTodayLocalDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function clampToNow(dateTime: string): string {
  if (!dateTime) return "";
  const now = getTodayLocalDateTime();
  return dateTime > now ? now : dateTime;
}

function formatTimelineTimestamp(ts: string): string {
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

function formatTimelineRange(start: string, end: string): string {
  return `${formatTimelineTimestamp(start)} — ${formatTimelineTimestamp(end)}`;
}

/** Find best-matching patient from loaded list by name */
function resolveArchivedPatient(entry: ArchiveEntry): Patient | null {
  try {
    if (!entry.snapshotJson) return null;
    return JSON.parse(entry.snapshotJson) as Patient;
  } catch (err) {
    console.error("Failed to parse archive snapshot", err);
    return null;
  }
}

export function PatientArchive() {
  const [archive, setArchive]         = useState<ArchiveEntry[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loading, setLoading]         = useState(true);

  const [filters, setFilters] = useState<ArchiveFilters>(DEFAULT_FILTERS);
const [appliedFilters, setAppliedFilters] = useState<ArchiveFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEntry, setSelectedEntry]     = useState<ArchiveEntry | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const maxDateTime = getTodayLocalDateTime();

  // Load archive and patient list from services on mount
  useEffect(() => {
    Promise.all([archiveService.getArchive(), patientsService.getPatients()])
      .then(([arc, patients]) => {
        setArchive(arc);
        setAllPatients(patients);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setFilter = <K extends keyof ArchiveFilters>(key: K, value: ArchiveFilters[K]) => {
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

const pendingChanges =
  JSON.stringify(filters) !== JSON.stringify(appliedFilters);



  const afterDate = parseDatetimeInput(appliedFilters.afterDt);
const beforeDate = parseDatetimeInput(appliedFilters.beforeDt);



  const filtered = archive.filter((entry) => {
  const af = appliedFilters;

  const lnMatch = af.lastName
    ? entry.lastName.toLowerCase().includes(af.lastName.toLowerCase())
    : true;

  const fnMatch = af.firstName
    ? entry.firstName.toLowerCase().includes(af.firstName.toLowerCase())
    : true;

  const startDate = parseArchiveDate(entry.startDatetime);
  const endDate = parseArchiveDate(entry.endDatetime);

  // User-selected range
  const userAfter = afterDate;
  const userBefore = beforeDate;

  // Overlap logic:
  // archive range [startDate, endDate]
  // user range    [userAfter, userBefore]
  // show if they overlap
  const rangeMatch =
    userAfter && userBefore
      ? startDate <= userBefore && endDate >= userAfter
      : userAfter
      ? endDate >= userAfter
      : userBefore
      ? startDate <= userBefore
      : true;

  let monthMatch = true;
if (af.filterMonth) {
  const monthIndex = MONTHS.indexOf(af.filterMonth);
  if (monthIndex !== -1) {
    const yearForMonth = af.filterYear
      ? Number(af.filterYear)
      : startDate.getFullYear();

    const monthStart = new Date(yearForMonth, monthIndex, 1, 0, 0, 0, 0);
    const monthEnd = new Date(yearForMonth, monthIndex + 1, 0, 23, 59, 59, 999);

    monthMatch = startDate <= monthEnd && endDate >= monthStart;
  }
}

let yearMatch = true;
if (af.filterYear) {
  const year = Number(af.filterYear);
  const yearStart = new Date(year, 0, 1, 0, 0, 0, 0);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  yearMatch = startDate <= yearEnd && endDate >= yearStart;
}

  return lnMatch && fnMatch && rangeMatch && monthMatch && yearMatch;
});

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

  const hasFilters = Object.values(filters).some((value) => value !== "");

function resolvePatientFromCurrentList(entry: ArchiveEntry, allPatients: Patient[]): Patient | null {
  return (
    allPatients.find((p) => p.id === entry.patientId) ??
    allPatients.find(
      (p) =>
        p.lastName.toLowerCase() === entry.lastName.toLowerCase() &&
        p.firstName.toLowerCase() === entry.firstName.toLowerCase()
    ) ??
    null
  );
}

const handleRowClick = (entry: ArchiveEntry) => {
  setSelectedEntry(entry);

  const archivedPatient = resolveArchivedPatient(entry);
  if (archivedPatient) {
    setSelectedPatient(archivedPatient);
    return;
  }

  const fallbackPatient = resolvePatientFromCurrentList(entry, allPatients);
  setSelectedPatient(fallbackPatient);
};

  const handleCloseProfile = () => {
    setSelectedEntry(null);
    setSelectedPatient(null);
  };

  const selectedTimeline = selectedEntry
  ? formatTimelineRange(selectedEntry.startDatetime, selectedEntry.endDatetime)
  : undefined;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col h-full bg-[#004b96] rounded-2xl overflow-hidden shadow-lg"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Top Tab Bar */}
        <div className="flex items-center gap-2 px-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="bg-[#003a75] rounded-t-xl px-5 py-2 flex items-center gap-2"
          >
            <Archive size={14} className="text-white/80" />
            <span className="text-white font-bold text-sm">PATIENT ARCHIVE</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#1565c0] mx-2 mb-2 rounded-b-xl rounded-tr-xl p-4 flex flex-col gap-3">

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            {/* Row 1 — Name filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[110px]">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={filters.lastName}
                  onChange={(e) => setFilter("lastName", e.target.value)}
                  className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
                />
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[110px]">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={filters.firstName}
                  onChange={(e) => setFilter("firstName", e.target.value)}
                  className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
                />
              </div>
              
            </div>

            {/* Row 2 — Timeframe + Month/Year dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* After */}
              <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
                <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">BEFORE</span>
                <input
  type="datetime-local"
  value={filters.afterDt}
  max={maxDateTime}
  onChange={(e) => setFilter("afterDt", clampToNow(e.target.value))}
  className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
/>
              </div>
              {/* Before */}
              <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[180px]">
                <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">AFTER</span>
                <input
  type="datetime-local"
  value={filters.beforeDt}
  max={maxDateTime}
  onChange={(e) => setFilter("beforeDt", clampToNow(e.target.value))}
  className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 min-w-0"
/>
              </div>
            </div>

            {/* Row 3 — Month / Year dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
  <div className="relative flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[130px]">
    <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">MONTH</span>
    <select
      value={filters.filterMonth}
      onChange={(e) => setFilter("filterMonth", e.target.value)}
      className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 appearance-none cursor-pointer min-w-0"
    >
      <option value="">All Months</option>
      {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
    </select>
    <ChevronDown size={12} className="text-gray-400 flex-shrink-0 pointer-events-none" />
  </div>

  <div className="relative flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-gray-200 flex-1 min-w-[110px]">
    <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">YEAR</span>
    <select
      value={filters.filterYear}
      onChange={(e) => setFilter("filterYear", e.target.value)}
      className="flex-1 text-xs bg-transparent focus:outline-none text-gray-700 appearance-none cursor-pointer min-w-0"
    >
      <option value="">All Years</option>
      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
    </select>
    <ChevronDown size={12} className="text-gray-400 flex-shrink-0 pointer-events-none" />
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

          {/* Table */}
          <div className="flex-1 overflow-hidden rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#004b96] text-white"
                >
                  <th className="px-4 py-2.5 text-left font-semibold">Patient Name</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Timeline</th>
                </motion.tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={2} className="text-center py-8 text-white/70">
                        <svg className="animate-spin w-5 h-5 mx-auto text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
                      <td colSpan={2} className="text-center py-8 text-white/70">No records found</td>
                    </motion.tr>
                  ) : (
                    paginated.map((entry, idx) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ delay: idx * 0.04, duration: 0.22, ease: "easeOut" }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                        style={{ backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", cursor: "pointer" }}
                        className="border-b border-white/10"
                        onClick={() => handleRowClick(entry)}
                      >
                        <td className="px-4 py-2.5 text-white font-medium">
                          {entry.lastName}, {entry.firstName} {entry.middleInitial}.
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#90caf9] flex-shrink-0" />
                            {formatTimelineTimestamp(entry.startDatetime)}
<span className="text-white/40 mx-0.5">—</span>
<span className="w-1.5 h-1.5 rounded-full bg-[#a5d6a7] flex-shrink-0" />
{formatTimelineTimestamp(entry.endDatetime)}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Patient Medical Profile Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientMedicalProfile
            patient={selectedPatient}
            onClose={handleCloseProfile}
            timeline={selectedTimeline}
          />
        )}
      </AnimatePresence>
    </>
  );
}