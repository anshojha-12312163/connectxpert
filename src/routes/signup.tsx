import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Mail,
  User,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
  Rocket,
  Check,
  Zap,
  Globe
} from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { supabase } from "@/lib/supabase";
import anshPhoto from "@/assets/ansh-ojha.jpg";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — ConnectXpert & Ansh Consultancy" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "google" | "otp-sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg]   = useState("");

  // 3D Motion interactive tilt values
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mousePosNormX = (e.clientX - rect.left) / width - 0.5;
    const mousePosNormY = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mousePosNormX);
    mouseY.set(mousePosNormY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate({ to: "/dashboard" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        navigate({ to: "/dashboard" });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleGoogleSignIn() {
    setStatus("google");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  }

  async function handlePasswordSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your email.");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setInfoMsg("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) {
      setStatus("error");
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        setErrorMsg("Email rate limit reached. Please use 'Continue with Google' to sign up instantly.");
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    if (data?.session) {
      navigate({ to: "/dashboard" });
      return;
    }

    setStatus("success");
    setInfoMsg(`Account created! We've sent a confirmation link to ${email}. Check your inbox.`);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your name first.");
      return;
    }
    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your email to receive an OTP code.");
      return;
    }

    setStatus("otp-sending");
    setErrorMsg("");
    setInfoMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setStatus("error");
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        setErrorMsg("Email rate limit reached. Please sign up with password or Google.");
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    setOtpSent(true);
    setStatus("idle");
    setInfoMsg(`OTP code sent to ${email}. Check your email inbox or spam folder.`);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const cleanToken = otpToken.trim();
    const cleanEmail = email.trim();

    if (!cleanToken) {
      setStatus("error");
      setErrorMsg("Please enter the 6-digit verification code from your email.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    let verifyRes = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: "email",
    });

    if (verifyRes.error) {
      const fallbackMagic = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "magiclink",
      });
      if (!fallbackMagic.error) {
        verifyRes = fallbackMagic;
      } else {
        const fallbackSignup = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: "signup",
        });
        if (!fallbackSignup.error) {
          verifyRes = fallbackSignup;
        }
      }
    }

    if (verifyRes.error) {
      setStatus("error");
      setErrorMsg(verifyRes.error.message);
      return;
    }

    navigate({ to: "/dashboard" });
  }

  const busy = status === "loading" || status === "google" || status === "otp-sending";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#060912] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 3D Background Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 right-1/4 size-[700px] rounded-full bg-emerald-600/15 blur-[160px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-1/3 -left-48 size-[600px] rounded-full bg-blue-600/15 blur-[160px] animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute -bottom-48 right-1/3 size-[650px] rounded-full bg-purple-600/10 blur-[170px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Glassmorphic 3D Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1120]/80 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl grid lg:grid-cols-[1.1fr_1fr]"
      >
        
        {/* ── LEFT: Registration Form Section ── */}
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12 relative z-20">
          <div>
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="group flex items-center gap-2.5 text-decoration-none">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 font-bold text-white shadow-lg shadow-emerald-950/40 text-sm tracking-wide group-hover:scale-105 transition-transform">
                  CX
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    ConnectXpert
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium tracking-wider -mt-0.5">
                    by Ansh Consultancy
                  </span>
                </div>
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="size-3.5" /> Back to Website
              </Link>
            </div>

            {status === "success" ? (
              <div className="text-center py-10">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-sm text-slate-300 mb-8 max-w-sm mx-auto leading-relaxed">
                  We've sent a verification link to <strong className="text-emerald-400">{email}</strong>. Click it to activate your ConnectXpert account.
                </p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <Link
                    to="/login"
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/40 hover:scale-[1.01] transition-transform"
                  >
                    Go to Sign In
                  </Link>
                  <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Return to Home Page
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Header Text */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 mb-3">
                    <Sparkles className="size-3" /> Fast Onboarding
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Create an account
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-400">
                    Sign up to access your client portal, schedule specialist audits, and track engagements.
                  </p>
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={busy}
                  className="relative group w-full flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-emerald-500/50 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-emerald-950/20 disabled:opacity-60"
                >
                  {status === "google" ? <Loader2 className="size-4 animate-spin text-emerald-400" /> : <GoogleIcon />}
                  <span>Continue with Google</span>
                  <span className="absolute right-4 text-[11px] font-normal text-emerald-400/80 group-hover:text-emerald-300 transition-colors">Instant</span>
                </button>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="absolute bg-[#0b1120] px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Or register with email
                  </span>
                </div>

                {/* Auth Mode Switcher */}
                <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-black/40 p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("password"); setErrorMsg(""); }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                      authMode === "password"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <KeyRound className="size-3.5" /> Password
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMode("otp"); setErrorMsg(""); }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                      authMode === "otp"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mail className="size-3.5" /> Email OTP
                  </button>
                </div>

                {/* Error Banner */}
                {status === "error" && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"
                  >
                    <span className="text-sm">⚠️</span>
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {/* Info / OTP sent Banner */}
                {infoMsg && (
                  <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                    {infoMsg}
                  </div>
                )}

                {/* Mode A: Password Registration */}
                {authMode === "password" && (
                  <form onSubmit={handlePasswordSignUp} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          required
                          className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Password (min 8 chars)
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                        >
                          {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={busy}
                      className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                      <span>Create Account & Continue</span>
                    </button>
                  </form>
                )}

                {/* Mode B: OTP Registration */}
                {authMode === "otp" && (
                  <div>
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              required
                              className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              required
                              className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={busy}
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {status === "otp-sending" && <Loader2 className="size-4 animate-spin" />}
                          <span>Send Verification Code</span>
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Enter Verification Code
                          </label>
                          <input
                            type="text"
                            value={otpToken}
                            onChange={(e) => setOtpToken(e.target.value)}
                            placeholder="e.g. 123456"
                            maxLength={12}
                            autoFocus
                            required
                            className="w-full text-center tracking-[8px] font-mono text-xl rounded-2xl border border-white/10 bg-black/40 py-3.5 text-emerald-400 placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={busy}
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                          <span>Verify & Create Account</span>
                        </button>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => { setOtpSent(false); setErrorMsg(""); }}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            Change Email
                          </button>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={busy}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                          >
                            Resend Code
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Sign In Link */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 font-bold text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
            >
              Sign In <ArrowLeft className="rotate-180 size-3" />
            </Link>
          </div>
        </div>

        {/* ── RIGHT: 3D Motion Brand & Interactive Live Hub ── */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-[#0c152a] via-[#091124] to-[#040814] border-l border-white/10 select-none [perspective:1200px]"
        >
          {/* Ambient Lighting Orbs */}
          <div className="pointer-events-none absolute -top-20 -right-20 size-[350px] rounded-full bg-emerald-500/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-[300px] rounded-full bg-blue-500/20 blur-[120px]" />

          {/* Brand Top Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Verified Operator Ecosystem</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              Direct Access
            </span>
          </div>

          {/* Main 3D Floating Interactive Showcase */}
          <motion.div
            style={{
              rotateX: rotateXSpring,
              rotateY: rotateYSpring,
              transformStyle: "preserve-3d",
            }}
            className="relative z-10 my-auto py-6"
          >
            {/* 3D Glass Layer 1: Main Platform Card */}
            <div
              style={{ transform: "translateZ(30px)" }}
              className="relative rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl shadow-black/80 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={anshPhoto}
                      alt="Ansh Ojha"
                      className="size-11 rounded-full object-cover object-top border-2 border-emerald-400 shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Ansh Consultancy
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400">Strategic Enterprise Advisory</p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Rocket className="size-3" /> Quick Launch
                </span>
              </div>

              {/* Feature highlights checklist */}
              <div className="space-y-2.5 my-3">
                {[
                  "Direct 1-on-1 Strategy sessions with verified principals",
                  "Real-time client telemetry & milestone delivery boards",
                  "Multi-discipline network: Tech, GTM, Cloud, Finance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="size-3" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Globe className="size-3.5 text-blue-400" /> Global Advisory Coverage
                </span>
                <span className="font-semibold text-emerald-400">Zero Agency Retainers</span>
              </div>
            </div>

            {/* 3D Floating Element 2: Top Floating Metric Pill */}
            <motion.div
              style={{ transform: "translateZ(65px)" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-3 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-950/90 to-slate-900/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Speed to Value</p>
                <p className="text-xs font-extrabold text-white">Day 1 Execution</p>
              </div>
            </motion.div>

            {/* 3D Floating Element 3: Bottom Floating Specialist Pill */}
            <motion.div
              style={{ transform: "translateZ(55px)" }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-3 rounded-2xl border border-blue-400/40 bg-gradient-to-r from-slate-900/95 to-blue-950/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Zap className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Vetted Network</p>
                <p className="text-xs font-extrabold text-white">Top 2% Specialists</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Brand Statement */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              High-impact advisory for <span className="text-gradient">modern scale.</span>
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-sm">
              Replace agency overhead with verified operators who solve bottlenecks and execute immediately.
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
