import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, BookOpen, Archive, UserPlus, ChevronDown, Settings, LogOut } from "lucide-react";
import { PatientInformation } from "./PatientInformation";
import { LogbookActivity } from "./LogbookActivity";
import { PatientRegistration } from "./PatientRegistration";
import { PatientArchive } from "./PatientArchive";
import { SettingsModal } from "./SettingsModal";
import { useAuth } from "../../context/AuthContext";
import { HealthCenterLogo } from "./HealthCenterLogo";

type ActiveTab = "patient-info" | "logbook" | "registration" | "archive";

const weeklyPrograms = [
  { day: "MONDAY:", program: "PRENATAL CARE" },
  { day: "TUESDAY:", program: "FAMILY PLANNING/POSTPARTUM" },
  { day: "WEDNESDAY:", program: "NATIONAL IMMUNIZATION PROGRAM" },
  { day: "THURSDAY:", program: "NATIONAL TUBERCULOSIS PROGRAM" },
  { day: "FRIDAY:", program: "CARDIOVASCULAR DISEASE PROGRAM" },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("patient-info");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [now, setNow] = useState(new Date());
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
  if (!isAdmin && activeTab === "logbook") {
    setActiveTab("patient-info");
  }
}, [isAdmin, activeTab]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const allNavItems: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { key: "patient-info", label: "Patient Information", icon: <LayoutDashboard size={16} /> },
  { key: "logbook", label: "Logbook Activity", icon: <BookOpen size={16} /> },
  { key: "archive", label: "Patient Archive", icon: <Archive size={16} /> },
  { key: "registration", label: "Patient Registration", icon: <UserPlus size={16} /> },
];

const navItems = isAdmin
  ? allNavItems
  : allNavItems.filter((item) => item.key !== "logbook");

  const dateBadge = (
    <div className="bg-[#004b96] rounded-[30px] px-6 py-2 text-center">
      <p className="text-white font-semibold text-lg leading-tight">
        {now.getFullYear()} – {now.getFullYear() + 1}
      </p>
      <p className="text-white font-semibold text-sm">
        {now.toLocaleDateString("en-US", { month: "long" }).toUpperCase()} {now.getFullYear()}
      </p>
      <p className="text-white/80 text-xs font-medium tracking-wide">
        {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
    </div>
  );

  const handleLogout = async () => {
  try {
    setShowUserMenu(false);
    await logout();
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error);
    navigate("/", { replace: true });
  }
};

  return (
    <div
      className="relative min-h-screen w-full flex flex-col overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #001f5b 0%, #003ea0 35%, #0062cc 65%, #0080e6 100%)",
          }}
        />

        {/* Animated floating orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,120,255,0.35) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,160,255,0.3) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute -bottom-24 left-1/4 w-[360px] h-[360px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,200,230,0.25) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 9 }}
          className="absolute bottom-10 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(80,130,255,0.25) 0%, transparent 70%)" }}
        />

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Diagonal light band */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
          }}
        />

        {/* Bottom darkening */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, rgba(0,10,40,0.4), transparent)" }}
        />
      </div>

      {/* Top Navbar */}
      <motion.div
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-30 flex items-center justify-between px-6 py-2 bg-white/80 backdrop-blur-sm shadow-sm"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="font-bold text-[#004b96] text-xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          MEDICAL HEALTH RECORDS ARCHIVING & RECORD TRACKER SYSTEM
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex items-center gap-4 text-gray-700"
        >
          {/* Staff Name Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setShowUserMenu((v) => !v)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">{user.fullName}</span>
              <motion.div
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-gray-500" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 bg-[#004b96] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.fullName}</p>
                      <p className="text-white/70 text-xs">{user.role}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: <Settings size={15} className="text-gray-400" />, label: "Settings" },
                    ].map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => { setShowUserMenu(false); setShowSettings(true); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.icon}
                        {item.label}
                      </motion.button>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <LogOut size={15} className="text-red-500" />
                      Log Out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden" style={{ minHeight: "calc(100vh - 48px)" }}>

        {/* Left Sidebar */}
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-52 bg-[#004b96] flex flex-col shadow-xl flex-shrink-0"
        >
          {/* HEART Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-col items-center py-5 px-3 border-b border-white/20"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.4 }}
              className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mb-2 bg-white/10 flex items-center justify-center"
            >
              <HealthCenterLogo size={90} />
            </motion.div>
            <h2 className="text-white font-extrabold text-xl leading-tight text-center">HEART</h2>
            <p className="text-white/90 text-xs text-center leading-tight">Gov. Paciano Bangoy</p>
            <p className="text-white/80 text-xs text-center">Barangay Health Center</p>
          </motion.div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-2 p-3 flex-1">
            {navItems.map((item, i) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.35, ease: "easeOut" }}
                whileHover={{ scale: activeTab === item.key ? 1 : 1.03, x: activeTab === item.key ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                  activeTab === item.key
                    ? "bg-white text-[#004b96] shadow-md"
                    : "text-white/90 hover:bg-white/10 border border-white/20"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden p-4 gap-4">
          <div className="flex-1 flex flex-col overflow-hidden relative">

            {/* Date Badge */}
            {activeTab === "patient-info" ? (
              <motion.div
                key="badge-absolute"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.5 }}
                className="absolute top-0 right-0 z-10"
              >
                {dateBadge}
              </motion.div>
            ) : (
              <motion.div
                key="badge-inline"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="flex justify-end flex-shrink-0 mb-2"
              >
                {dateBadge}
              </motion.div>
            )}

            {/* Tab Content with AnimatePresence */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="h-full"
                >
                  {activeTab === "patient-info" && <PatientInformation />}
{activeTab === "logbook" && isAdmin && <LogbookActivity />}
{activeTab === "archive" && <PatientArchive />}
{activeTab === "registration" && <PatientRegistration />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Weekly Program Panel */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="w-60 flex-shrink-0"
          >
            <div className="bg-[#004b96] rounded-[30px] p-4 shadow-lg h-full flex flex-col">
              <h2 className="text-white font-extrabold text-lg mb-3">
                Weekly Program:
              </h2>
              <div className="flex flex-col gap-3 flex-1">
                {weeklyPrograms.map((item, i) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.35, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, x: -3 }}
                    className="bg-white/90 rounded-[15px] px-4 py-3 flex-1 flex flex-col justify-center cursor-default"
                  >
                    <p className="font-bold text-[#191010] text-base leading-tight">
                      {item.day}
                    </p>
                    <p className="text-[#191010] text-xs font-normal mt-0.5">
                      {item.program}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}