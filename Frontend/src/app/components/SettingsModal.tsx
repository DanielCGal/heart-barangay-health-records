import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Hash, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import * as staffService from "../../api/staff.service";
import { addLogbookEntry } from "../../api/logbook.service";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = "profile" | "email" | "password" | "newStaff";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, updateEmail, updatePassword, sendEmailVerificationCode } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [staffId, setStaffId] = useState("");

  // Email change form
  const [newEmail, setNewEmail]             = useState("");
  const [verifyCode, setVerifyCode]         = useState("");
  const [codeSent, setCodeSent]             = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [codeSentNotice, setCodeSentNotice] = useState(false);
  const [emailLoading, setEmailLoading]     = useState(false);
  const [emailSuccess, setEmailSuccess]     = useState(false);
  const [emailError, setEmailError]         = useState("");

  // Password change form
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [showCurrentPw, setShowCurrentPw]       = useState(false);
  const [showNewPw, setShowNewPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw]       = useState(false);
  const [pwLoading, setPwLoading]               = useState(false);
  const [passwordSuccess, setPasswordSuccess]   = useState(false);
  const [passwordError, setPasswordError]       = useState("");

  const isAdmin = user.role === "Admin";

const [staffFullName, setStaffFullName] = useState("");
const [staffUsername, setStaffUsername] = useState("");
const [staffEmail, setStaffEmail] = useState("");
const [staffPassword, setStaffPassword] = useState("");
const [staffRole, setStaffRole] = useState<"Admin" | "Staff">("Staff");
const [staffLoading, setStaffLoading] = useState(false);
const [staffSuccess, setStaffSuccess] = useState(false);
const [staffError, setStaffError] = useState("");
const [showStaffPw, setShowStaffPw] = useState(false);



  const handleEmailSave = async () => {
    setEmailError("");
    if (!newEmail) return setEmailError("New email cannot be empty.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
      return setEmailError("Please enter a valid email address.");
    if (!codeSent) return setEmailError("Please send the verification code to your new email first.");
    if (!verifyCode) return setEmailError("Please enter the verification code.");

    setEmailLoading(true);
    try {
      await updateEmail(newEmail, verifyCode);
      setNewEmail("");
      setVerifyCode("");
      setCodeSent(false);
      setCodeSentNotice(false);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to update email.");
    } finally {
      setEmailLoading(false);
    }
  };

  function formatAccountDate(value?: string) {
  if (!value) return "N/A";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${mm}/${dd}/${yyyy} - ${hours}:${minutes}${suffix}`;
}

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const handleCreateStaff = async () => {
  setStaffError("");

  if (!staffId.trim()) return setStaffError("Staff ID is required.");
  if (!uuidRegex.test(staffId.trim())) {
    return setStaffError("Staff ID must follow the format 11111111-1111-1111-1111-111111111111.");
  }

  if (!staffFullName.trim()) return setStaffError("Full name is required.");
  if (!staffUsername.trim()) return setStaffError("Username is required.");
  if (!staffEmail.trim()) return setStaffError("Email is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffEmail)) {
    return setStaffError("Please enter a valid email address.");
  }
  if (!staffPassword.trim()) return setStaffError("Password is required.");

  setStaffLoading(true);
  try {
    await staffService.createStaffAccount({
      id: staffId.trim(),
      fullName: staffFullName.trim(),
      username: staffUsername.trim(),
      email: staffEmail.trim(),
      passwordHash: staffPassword,
      role: staffRole,
    });

    await addLogbookEntry({
      staffUsername: user.fullName,
      action: "Add Staff",
      patientName: "N/A",
    });

    setStaffId("");
    setStaffFullName("");
    setStaffUsername("");
    setStaffEmail("");
    setStaffPassword("");
    setStaffRole("Staff");
    setStaffSuccess(true);
    setTimeout(() => setStaffSuccess(false), 3000);
  } catch (err) {
    setStaffError(err instanceof Error ? err.message : "Failed to create staff account.");
  } finally {
    setStaffLoading(false);
  }
};

  const handleSendCode = async () => {
    setEmailError("");
    if (!newEmail) return setEmailError("Please enter a new email address first.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
      return setEmailError("Please enter a valid email address.");

    setSendCodeLoading(true);
    try {
      await sendEmailVerificationCode(newEmail);
      setCodeSent(true);
      setCodeSentNotice(true);
      setTimeout(() => setCodeSentNotice(false), 4000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    if (!currentPassword) return setPasswordError("Please enter your current password.");
    if (!newPassword) return setPasswordError("New password cannot be empty.");
    if (newPassword.length < 6) return setPasswordError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setPasswordError("Passwords do not match.");

    setPwLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setPwLoading(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile",  label: "Profile", icon: <User size={15} /> },
  { key: "email", label: "Change Email", icon: <Mail size={15} /> },
  { key: "password", label: "Change Password", icon: <Lock size={15} /> },
  ...(isAdmin
    ? [{ key: "newStaff" as SettingsTab, label: "New Staff", icon: <ShieldCheck size={15} /> }]
    : []),
];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-[#004b96] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <SettingsGearIcon />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base">Account Settings</h2>
                    <p className="text-white/70 text-xs">Manage your profile and security</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all border-b-2 ${
                      activeTab === tab.key
                        ? "border-[#004b96] text-[#004b96] bg-white"
                        : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="px-6 py-5 min-h-[260px]">
                <AnimatePresence mode="wait">

                  {/* ── Profile ────────────────────────────────────────────── */}
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="flex flex-col items-center py-4 gap-4">
                        <div className="w-20 h-20 rounded-full bg-[#004b96] flex items-center justify-center shadow-lg">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h3 className="text-gray-800 font-semibold text-xl">{user.fullName}</h3>
                          <p className="text-gray-500 text-sm mt-0.5">{user.role}</p>
                        </div>

                        <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                          <InfoRow
                            icon={<User size={14} className="text-[#004b96]" />}
                            label="Full Name"
                            value={user.fullName}
                          />
                          <div className="border-t border-gray-200" />
                          <InfoRow
                            icon={<Mail size={14} className="text-[#004b96]" />}
                            label="Email Address"
                            value={user.email}
                          />
                          <div className="border-t border-gray-200" />
                          <InfoRow
                            icon={<Lock size={14} className="text-[#004b96]" />}
                            label="Role"
                            value={user.role}
                          />
                          <div className="border-t border-gray-200" />
                          <InfoRow
                            icon={<Hash size={14} className="text-[#004b96]" />}
                            label="Staff ID"
                            value={user.id}
                          />
                        </div>

                        <p className="text-xs text-gray-400 text-center">
  Use the tabs above to update your email or password.
</p>
<p className="text-xs text-gray-400 text-center">
  Account Creation: {formatAccountDate(user.createdAt)}, Account Updated: {formatAccountDate(user.updatedAt)}
</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Change Email ────────────────────────────────────────── */}
                  {activeTab === "email" && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4 py-2"
                    >
                      {/* Current email banner */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
                        <Mail size={14} className="text-[#004b96] flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Current Email</p>
                          <p className="text-sm text-[#004b96] font-semibold">{user.email}</p>
                        </div>
                      </div>

                      {/* New Email + Send Code row */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          New Email Address
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <Mail size={14} className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              placeholder="Enter new email"
                              value={newEmail}
                              onChange={(e) => {
                                setNewEmail(e.target.value);
                                setEmailError("");
                                if (codeSent) { setCodeSent(false); setVerifyCode(""); }
                              }}
                              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#004b96] focus:bg-white transition-colors"
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: sendCodeLoading ? 1 : 1.04 }}
                            whileTap={{ scale: sendCodeLoading ? 1 : 0.96 }}
                            onClick={handleSendCode}
                            disabled={sendCodeLoading}
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-[#004b96] hover:bg-[#003a78] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {sendCodeLoading
                              ? <><Loader2 size={12} className="animate-spin" /> Sending…</>
                              : codeSent
                              ? <><Check size={12} /> Resend</>
                              : "Send Code"}
                          </motion.button>
                        </div>
                      </div>

                      {/* Code-sent confirmation notice */}
                      <AnimatePresence>
                        {codeSentNotice && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                          >
                            <ShieldCheck size={13} className="text-green-600 flex-shrink-0" />
                            <p className="text-xs text-green-700">
                              Verification code sent to <span className="font-semibold">{newEmail}</span>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Verification Code field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Enter Verification Code
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <ShieldCheck size={14} className={codeSent ? "text-[#004b96]" : "text-gray-300"} />
                          </div>
                          <input
                            type="text"
                            placeholder={codeSent ? "Enter 6-digit code" : "Send code first to unlock"}
                            value={verifyCode}
                            maxLength={6}
                            disabled={!codeSent}
                            onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, "")); setEmailError(""); }}
                            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm transition-colors focus:outline-none tracking-widest ${
                              codeSent
                                ? "border-gray-200 bg-gray-50 focus:border-[#004b96] focus:bg-white text-gray-800"
                                : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          />
                        </div>
                        {!codeSent && (
                          <p className="text-[10px] text-gray-400 mt-1 ml-1">
                            Enter your new email above and click "Send Code" first.
                          </p>
                        )}
                      </div>

                      <StatusMessage
                        success={emailSuccess}
                        error={emailError}
                        successMsg="Email updated successfully!"
                      />

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEmailSave}
                        disabled={emailLoading}
                        className="w-full bg-[#004b96] hover:bg-[#003a78] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {emailLoading ? <Spinner /> : null}
                        {emailLoading ? "Saving..." : "Save Email"}
                      </motion.button>
                    </motion.div>
                  )}

                  

                  {/* ── Change Password ─────────────────────────────────────── */}
                  {activeTab === "password" && (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3 py-2"
                    >
                      <PasswordField
                        label="Current Password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        show={showCurrentPw}
                        onToggle={() => setShowCurrentPw((v) => !v)}
                      />
                      <PasswordField
                        label="New Password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={setNewPassword}
                        show={showNewPw}
                        onToggle={() => setShowNewPw((v) => !v)}
                      />
                      <PasswordField
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirmPw}
                        onToggle={() => setShowConfirmPw((v) => !v)}
                      />

                      <StatusMessage
                        success={passwordSuccess}
                        error={passwordError}
                        successMsg="Password updated successfully!"
                      />

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePasswordSave}
                        disabled={pwLoading}
                        className="w-full bg-[#004b96] hover:bg-[#003a78] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {pwLoading ? <Spinner /> : null}
                        {pwLoading ? "Saving..." : "Save Password"}
                      </motion.button>
                    </motion.div>
                  )}

                  {activeTab === "newStaff" && isAdmin && (
  <motion.div
    key="newStaff"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.18 }}
    className="space-y-3 py-2"
  >

    <FormField
  label="Staff ID"
  type="text"
  placeholder="11111111-1111-1111-1111-111111111111"
  value={staffId}
  onChange={setStaffId}
  icon={<Hash size={14} className="text-gray-400" />}
/>

    <FormField
      label="Full Name"
      type="text"
      placeholder="Enter full name"
      value={staffFullName}
      onChange={setStaffFullName}
      icon={<User size={14} className="text-gray-400" />}
    />

    <FormField
      label="Username"
      type="text"
      placeholder="Enter username"
      value={staffUsername}
      onChange={setStaffUsername}
      icon={<Hash size={14} className="text-gray-400" />}
    />

    <FormField
      label="Email"
      type="email"
      placeholder="Enter email"
      value={staffEmail}
      onChange={setStaffEmail}
      icon={<Mail size={14} className="text-gray-400" />}
    />

    <PasswordField
      label="Password"
      placeholder="Enter password"
      value={staffPassword}
      onChange={setStaffPassword}
      show={showStaffPw}
      onToggle={() => setShowStaffPw((v) => !v)}
    />

    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
      <select
        value={staffRole}
        onChange={(e) => setStaffRole(e.target.value as "Admin" | "Staff")}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#004b96] focus:bg-white transition-colors"
      >
        <option value="Staff">Staff</option>
        <option value="Admin">Admin</option>
      </select>
    </div>

    <StatusMessage
      success={staffSuccess}
      error={staffError}
      successMsg="New staff account created successfully!"
    />

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreateStaff}
      disabled={staffLoading}
      className="w-full bg-[#004b96] hover:bg-[#003a78] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {staffLoading ? <Spinner /> : null}
      {staffLoading ? "Creating..." : "Create Staff"}
    </motion.button>
  </motion.div>
)}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Small helper sub-components ───────────────────────────────────────────────

function SettingsGearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-white"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#004b96] focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Lock size={14} className="text-gray-400" />
        </div>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#004b96] focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function StatusMessage({
  success,
  error,
  successMsg,
}: {
  success: boolean;
  error: string;
  successMsg: string;
}) {
  return (
    <AnimatePresence>
      {(success || !!error) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {success ? <Check size={13} /> : <AlertCircle size={13} />}
          {success ? successMsg : error}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}