import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { HealthCenterLogo } from "./HealthCenterLogo";
import * as authService from "../../api/auth.service";

// Mask an email like "m.santos@healthcenter.gov.ph" → "m.****@healthcenter.gov.ph"
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}****@${domain}`;
}

type ForgotStep = "request" | "verify" | "success";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Login state ─────────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [credentials, setCredentials]   = useState({ id: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  // ── Forgot Password state ───────────────────────────────────────────────────
  const [forgotOpen, setForgotOpen]         = useState(false);
  const [forgotStep, setForgotStep]         = useState<ForgotStep>("request");
  const [forgotEmail, setForgotEmail]       = useState("");
  const [maskedEmail, setMaskedEmail]       = useState("");
  const [codeInput, setCodeInput]           = useState("");
  const [forgotLoading, setForgotLoading]   = useState(false);
  const [forgotError, setForgotError]       = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(credentials.id, credentials.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const openForgot = () => {
    setForgotOpen(true);
    setForgotStep("request");
    setForgotEmail("");
    setCodeInput("");
    setForgotError("");
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setForgotError("");
  };

  // Step 1 — Send code (calls real auth service)
  const handleSendCode = async () => {
    setForgotError("");
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your staff email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotError("Please enter a valid email address.");
      return;
    }
    setForgotLoading(true);
    try {
      await authService.sendForgotPasswordCode(forgotEmail.trim());
      setMaskedEmail(maskEmail(forgotEmail.trim()));
      setForgotStep("verify");
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Failed to send code. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2 — Verify code (calls real auth service)
  const handleVerifyCode = async () => {
    setForgotError("");
    if (!codeInput.trim()) {
      setForgotError("Please enter the verification code.");
      return;
    }
    setForgotLoading(true);
    try {
      const loggedInUser = await authService.verifyForgotPasswordCode(
        forgotEmail.trim(),
        codeInput.trim()
      );
      // verifyForgotPasswordCode issues a new session — sync context user
      // by updating localStorage (AuthContext reads from there on mount)
      setForgotStep("success");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Incorrect code. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const weeklyPrograms = [
    { day: "MONDAY:",    program: "PRENATAL CARE" },
    { day: "TUESDAY:",   program: "FAMILY PLANNING/POSTPARTUM" },
    { day: "WEDNESDAY:", program: "NATIONAL IMMUNIZATION PROGRAM" },
    { day: "THURSDAY:",  program: "NATIONAL TUBERCULOSIS PROGRAM" },
    { day: "FRIDAY:",    program: "CARDIOVASCULAR DISEASE PROGRAM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #001f5b 0%, #003ea0 35%, #0062cc 65%, #0080e6 100%)",
          }}
        />
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, rgba(0,10,40,0.4), transparent)" }}
        />
      </div>

      <div className="relative z-10 flex gap-8 items-center justify-center w-full max-w-5xl px-6">
        {/* Weekly Program Card */}
        <motion.div
          initial={{ x: -70, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="bg-[#004b96]/80 backdrop-blur-sm rounded-[30px] p-6 w-64 shadow-lg flex-shrink-0 hidden md:block border border-white/10"
        >
          <h2
            className="text-white font-extrabold text-xl mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Weekly Program:
          </h2>
          <div className="flex flex-col gap-3">
            {weeklyPrograms.map((item, i) => (
              <motion.div
                key={item.day}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.09, duration: 0.35, ease: "easeOut" }}
                className="bg-white/90 rounded-[15px] px-4 py-3"
              >
                <p
                  className="font-bold text-[#191010] text-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.day}
                </p>
                <p
                  className="text-[#191010] text-xs font-normal"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {item.program}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ x: 70, opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.1 }}
          className="bg-white/95 rounded-[20px] shadow-2xl border-4 border-[#134476] w-full max-w-md overflow-hidden"
        >
          {/* ── Main Login Panel ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {!forgotOpen && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-8 flex flex-col items-center"
              >
                {/* Logo */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.3 }}
                  className="mb-2"
                >
                  <HealthCenterLogo size={144} />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                  className="text-5xl font-bold text-black text-center"
                  style={{ fontFamily: "'Inika', serif" }}
                >
                  WELCOME!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.35 }}
                  className="text-center mt-1 mb-1"
                >
                  <p
                    className="font-bold text-[#013155] text-base"
                    style={{ fontFamily: "'Inika', serif" }}
                  >
                    Barangay Health Services Portal
                  </p>
                  <p
                    className="text-[#928c8c] text-sm italic"
                    style={{ fontFamily: "'Inika', serif" }}
                  >
                    Malusog na mamamayan, maunlad na pamayanan.
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.35 }}
                  className="text-[#928c8c] text-sm mb-5"
                >
                  Enter your credentials to access the system
                </motion.p>

                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  className="w-full space-y-4"
                >
                  {/* ── Staff Email or ID ── */}
                  <div>
                    <label
                      className="block font-bold text-black text-base mb-1"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      Staff Email or ID
                    </label>
                    <input
                      type="text"
                      placeholder="staff@email.com or Staff ID"
                      value={credentials.id}
                      onChange={(e) =>
                        setCredentials({ ...credentials, id: e.target.value })
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full border border-black/50 rounded-full px-4 py-2 text-base bg-[#fffbfb] focus:outline-none focus:border-[#004b96] transition-colors"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    />
                  </div>

                  {/* ── Password ── */}
                  <div>
                    <label
                      className="block font-bold text-black text-base mb-1"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your secure password"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({ ...credentials, password: e.target.value })
                        }
                        onKeyDown={handleKeyDown}
                        className="w-full border border-black/50 rounded-full px-4 py-2 text-base bg-[#fffbfb] focus:outline-none focus:border-[#004b96] pr-12 transition-colors"
                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 hover:text-black/80 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      style={{ fontFamily: "'Inika', serif" }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 border border-[#013155] rounded-sm bg-[#fff9f9] accent-[#013155]"
                      />
                      <span className="text-[#013155]">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={openForgot}
                      className="text-[#013155] font-medium hover:underline"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      Forget password?
                    </button>
                  </div>

                  <motion.button
                    onClick={handleLogin}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.03, boxShadow: "0 8px 25px rgba(22,39,89,0.35)" }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-full bg-[#162759] text-white font-bold text-lg py-3 rounded-[10px] shadow-md hover:bg-[#0f1d42] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* ── Forgot Password Panel ──────────────────────────────────── */}
            {forgotOpen && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-8 flex flex-col min-h-[480px]"
              >
                {/* Back button (hidden on success) */}
                {forgotStep !== "success" && (
                  <button
                    type="button"
                    onClick={closeForgot}
                    className="flex items-center gap-1.5 text-[#004b96] text-sm font-semibold hover:opacity-70 transition-opacity mb-6 self-start"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                )}

                <AnimatePresence mode="wait">

                  {/* ── Step 1: Request ─────────────────────────────────── */}
                  {forgotStep === "request" && (
                    <motion.div
                      key="request"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center flex-1"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-[#004b96]/20 flex items-center justify-center mb-4">
                        <Mail size={28} className="text-[#004b96]" />
                      </div>

                      <h2
                        className="text-xl font-bold text-[#013155] text-center mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Forgot Password?
                      </h2>
                      <p
                        className="text-sm text-[#928c8c] text-center mb-6"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Enter your registered staff email address and we'll send you a verification code.
                      </p>

                      <div className="w-full space-y-4">
                        <div>
                          <label
                            className="block font-bold text-black text-sm mb-1"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                          >
                            Staff Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                              <Mail size={16} className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              placeholder="staff@healthcenter.gov.ph"
                              value={forgotEmail}
                              onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }}
                              onKeyDown={(e) => { if (e.key === "Enter") handleSendCode(); }}
                              className="w-full border border-black/30 rounded-full pl-10 pr-4 py-2.5 text-sm bg-[#fffbfb] focus:outline-none focus:border-[#004b96] transition-colors"
                              style={{ fontFamily: "'Quicksand', sans-serif" }}
                            />
                          </div>
                        </div>

                        {forgotError && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                          >
                            <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-600">{forgotError}</p>
                          </motion.div>
                        )}

                        <motion.button
                          onClick={handleSendCode}
                          disabled={forgotLoading}
                          whileHover={{ scale: forgotLoading ? 1 : 1.02 }}
                          whileTap={{ scale: forgotLoading ? 1 : 0.97 }}
                          className="w-full bg-[#162759] text-white font-bold text-base py-3 rounded-[10px] shadow-md hover:bg-[#0f1d42] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                          {forgotLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Sending Code...</>
                          ) : (
                            "Send Verification Code"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 2: Verify ──────────────────────────────────── */}
                  {forgotStep === "verify" && (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center flex-1"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-[#004b96]/20 flex items-center justify-center mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#004b96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>

                      <h2
                        className="text-xl font-bold text-[#013155] text-center mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Check Your Email
                      </h2>

                      {/* Sent-to notice */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-4 w-full">
                        <Mail size={14} className="text-[#004b96] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">A 6-digit verification code was sent to:</p>
                          <p className="text-sm text-[#004b96] font-semibold mt-0.5">{maskedEmail}</p>
                        </div>
                      </div>

                      <p
                        className="text-sm text-[#928c8c] text-center mb-5"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Enter the code below to access your account.
                        <br />
                        
                      </p>

                      <div className="w-full space-y-4">
                        <div>
                          <label
                            className="block font-bold text-black text-sm mb-1"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                          >
                            Verification Code
                          </label>
                          <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={codeInput}
                            maxLength={6}
                            onChange={(e) => { setCodeInput(e.target.value.replace(/\D/g, "")); setForgotError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleVerifyCode(); }}
                            className="w-full border border-black/30 rounded-full px-4 py-2.5 text-base text-center tracking-[0.4em] bg-[#fffbfb] focus:outline-none focus:border-[#004b96] transition-colors"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                          />
                        </div>

                        {forgotError && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                          >
                            <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-600">{forgotError}</p>
                          </motion.div>
                        )}

                        <motion.button
                          onClick={handleVerifyCode}
                          disabled={forgotLoading}
                          whileHover={{ scale: forgotLoading ? 1 : 1.02 }}
                          whileTap={{ scale: forgotLoading ? 1 : 0.97 }}
                          className="w-full bg-[#162759] text-white font-bold text-base py-3 rounded-[10px] shadow-md hover:bg-[#0f1d42] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                          {forgotLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                          ) : (
                            "Verify Code"
                          )}
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => { setForgotStep("request"); setCodeInput(""); setForgotError(""); }}
                          className="w-full text-sm text-[#004b96] hover:underline font-medium text-center"
                          style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                          Didn't receive a code? Try again
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 3: Success ─────────────────────────────────── */}
                  {forgotStep === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      className="flex flex-col items-center justify-center flex-1 py-8"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-5"
                      >
                        <CheckCircle2 size={40} className="text-green-500" />
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-[#013155] text-center mb-2"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Identity Verified!
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-[#928c8c] text-center"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Code accepted. Redirecting you to the dashboard…
                      </motion.p>

                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 1.4, ease: "linear" }}
                        className="mt-6 h-1 w-48 bg-green-400 rounded-full origin-left"
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}