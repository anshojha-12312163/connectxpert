import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Eye, EyeOff, ArrowLeft, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/lanx/bits";

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
  head: () => ({ meta: [{ title: "Create Account — ConnectXpert" }] }),
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

    // If session returned immediately (auto-confirm enabled)
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
    if (!otpToken.trim()) {
      setStatus("error");
      setErrorMsg("Please enter the 6-digit verification code from your email.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otpToken.trim(),
      type: "email",
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    navigate({ to: "/dashboard" });
  }

  const busy = status === "loading" || status === "google" || status === "otp-sending";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0d1a] px-4 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 hero-glow" aria-hidden />
      
      <div className="relative w-full max-w-md">
        {/* Top bar: Back link & Logo */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" /> Back to Website
          </Link>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0d1120]/90 p-8 shadow-2xl backdrop-blur-xl">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Check your email</h2>
              <p className="text-sm text-white/60 mb-6">
                We've sent a verification link to <strong className="text-white">{email}</strong>. Click it to activate your account.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/login" className="inline-block text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Go to Sign In
                </Link>
                <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1">Create an account</h1>
              <p className="text-sm text-white/50 mb-6">Sign up to access your client portal & expert bookings.</p>

              {/* 1-Click Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={busy}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-60"
              >
                {status === "google" ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40">or register with email</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Mode Tabs: Password vs OTP Code */}
              <div className="mb-6 grid grid-cols-2 rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => { setAuthMode("password"); setErrorMsg(""); }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                    authMode === "password"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <KeyRound className="size-3.5" /> Password
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("otp"); setErrorMsg(""); }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                    authMode === "otp"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Mail className="size-3.5" /> Email OTP
                </button>
              </div>

              {/* Info / Success banner */}
              {infoMsg && (
                <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  {infoMsg}
                </div>
              )}

              {/* Error banner */}
              {status === "error" && errorMsg && (
                <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
                  {errorMsg}
                </div>
              )}

              {/* ── MODE A: PASSWORD REGISTRATION ── */}
              {authMode === "password" && (
                <form onSubmit={handlePasswordSignUp} className="space-y-4" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50">Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50">Password (min 8 characters)</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                    Create Account
                  </button>
                </form>
              )}

              {/* ── MODE B: EMAIL OTP REGISTRATION ── */}
              {authMode === "otp" && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          required
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          required
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={busy}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                      >
                        {status === "otp-sending" && <Loader2 className="size-4 animate-spin" />}
                        Send Verification Code
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-white/50">
                          Enter 6-Digit Code
                        </label>
                        <input
                          type="text"
                          value={otpToken}
                          onChange={(e) => setOtpToken(e.target.value)}
                          placeholder="123456"
                          maxLength={12}
                          autoFocus
                          required
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-widest font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={busy}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                      >
                        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                        Verify & Create Account
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setErrorMsg(""); }}
                          className="text-white/40 hover:text-white transition-colors"
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

              <p className="mt-6 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
