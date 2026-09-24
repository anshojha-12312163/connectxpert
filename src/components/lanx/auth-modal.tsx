import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Eye, EyeOff, X, KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { supabase, getAuthRedirectUrl } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

interface AuthModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({
  open,
  isOpen,
  onClose,
  defaultTab = "login",
  onSuccess,
}: AuthModalProps) {
  const isVisible = Boolean(open ?? isOpen);
  const navigate = useNavigate();
  const [tab, setTab]           = useState<"login" | "signup">(defaultTab);
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "google" | "otp-sending" | "error" | "info">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg]   = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTab(defaultTab);
    setName(""); setEmail(""); setPassword(""); setOtpToken(""); setOtpSent(false);
    setStatus("idle"); setErrorMsg(""); setInfoMsg("");
  }, [defaultTab, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isVisible, onClose]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isVisible]);

  // Handle Google OAuth redirect back
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        onClose();
        if (onSuccess) onSuccess();
        navigate({ to: "/dashboard" });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogle() {
    setStatus("google");
    setErrorMsg("");
    const redirectTo = getAuthRedirectUrl("/dashboard");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setStatus("error");
      setErrorMsg("Please provide both email and password.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setStatus("error");
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMsg("Email not confirmed yet. You can sign in using Email OTP or Google.");
        } else {
          setErrorMsg(error.message);
        }
        return;
      }
      onClose();
      if (onSuccess) onSuccess();
      navigate({ to: "/dashboard" });
    } else {
      if (!name.trim()) {
        setStatus("error");
        setErrorMsg("Please enter your name.");
        return;
      }
      if (password.length < 8) {
        setStatus("error");
        setErrorMsg("Password must be at least 8 characters.");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
        return;
      }
      if (data?.session) {
        onClose();
        if (onSuccess) onSuccess();
        navigate({ to: "/dashboard" });
        return;
      }
      setInfoMsg("Account created! Check your email to confirm your account.");
      setStatus("info");
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your email.");
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your name.");
      return;
    }

    setStatus("otp-sending");
    setErrorMsg("");
    setInfoMsg("");

    const redirectTo = getAuthRedirectUrl("/dashboard");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        data: name.trim() ? { full_name: name.trim() } : undefined,
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus("error");
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        setErrorMsg("Email rate limit reached. Please use Google or Password login.");
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    setOtpSent(true);
    setStatus("idle");
    setInfoMsg(`OTP verification code sent to ${email}.`);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpToken.trim()) {
      setStatus("error");
      setErrorMsg("Please enter the verification code.");
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

    onClose();
    navigate({ to: "/dashboard" });
  }

  if (!open) return null;

  const busy = status === "loading" || status === "google" || status === "otp-sending";

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #2a3050", color: "#f5f6fa",
    fontSize: "14px", padding: "6px 0 10px 0", outline: "none",
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "860px",
        display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
        background: "#0d1120", borderRadius: "20px",
        overflow: "hidden", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
        position: "relative",
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
        className="auth-modal-grid"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "16px", right: "16px", zIndex: 10,
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: "rgba(255,255,255,0.6)",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <X size={16} />
        </button>

        {/* ── LEFT: Form ── */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          className="auth-form-side"
        >
          {/* Brand mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px", background: "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "14px",
            }}>CX</div>
            <span style={{ color: "#f5f6fa", fontWeight: 700, fontSize: "15px" }}>ConnectXpert</span>
          </div>

          <h2 style={{ color: "#f5f6fa", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#8890a8", fontSize: "13px", marginTop: "4px", marginBottom: "20px" }}>
            {tab === "login" ? "Sign in to manage your bookings & advisory" : "Get started with your client portal"}
          </p>

          {/* Main Tab: Sign In vs Sign Up */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "3px", marginBottom: "16px" }}>
            {(["login", "signup"] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{
                flex: 1, padding: "7px", border: "none", borderRadius: "8px", cursor: "pointer",
                fontSize: "12.5px", fontWeight: 600, transition: "all .2s",
                background: tab === t ? "#10b981" : "transparent",
                color: tab === t ? "white" : "#8890a8",
              }}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", background: "#10b98120",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
              }}>
                <CheckCircle2 size={24} color="#10b981" />
              </div>
              <p style={{ color: "#f5f6fa", fontWeight: 600, fontSize: "15px", marginBottom: "6px" }}>Check your email</p>
              <p style={{ color: "#8890a8", fontSize: "12.5px" }}>Confirmation sent to <strong style={{ color: "#f5f6fa" }}>{email}</strong></p>
              <button onClick={() => setTab("login")} style={{ marginTop: "16px", color: "#10b981", background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Google 1-Click */}
              <button
                type="button" onClick={handleGoogle} disabled={busy}
                style={{
                  width: "100%", padding: "10px", border: "1px solid #2a3050",
                  borderRadius: "10px", background: "transparent", color: "#f5f6fa",
                  fontSize: "13.5px", fontWeight: 500, cursor: busy ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  marginBottom: "14px", opacity: busy ? 0.6 : 1, transition: "border-color .2s",
                }}
                onMouseEnter={e => !busy && (e.currentTarget.style.borderColor = "#10b981")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a3050")}
              >
                {status === "google" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Sub Mode: Password vs OTP */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("password"); setErrorMsg(""); }}
                  style={{
                    flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid",
                    borderColor: authMode === "password" ? "#10b98160" : "#2a3050",
                    background: authMode === "password" ? "#10b98115" : "transparent",
                    color: authMode === "password" ? "#10b981" : "#8890a8",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                >
                  <KeyRound size={13} /> Password
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("otp"); setErrorMsg(""); }}
                  style={{
                    flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid",
                    borderColor: authMode === "otp" ? "#10b98160" : "#2a3050",
                    background: authMode === "otp" ? "#10b98115" : "transparent",
                    color: authMode === "otp" ? "#10b981" : "#8890a8",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                >
                  <Mail size={13} /> Email OTP
                </button>
              </div>

              {infoMsg && (
                <div style={{
                  color: "#10b981", fontSize: "12px", marginBottom: "12px",
                  background: "#10b98115", padding: "8px 10px", borderRadius: "8px", border: "1px solid #10b98130",
                }}>{infoMsg}</div>
              )}

              {status === "error" && errorMsg && (
                <div style={{
                  color: "#f87171", fontSize: "12px", marginBottom: "12px",
                  background: "#ef444415", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ef444430",
                }}>{errorMsg}</div>
              )}

              {/* ── PASSWORD FLOW ── */}
              {authMode === "password" && (
                <form onSubmit={handlePasswordSubmit} noValidate>
                  {tab === "signup" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>Full Name</label>
                      <input
                        type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Your full name" required style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>Email Address</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com" required style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                    />
                  </div>

                  <div style={{ marginBottom: "14px", position: "relative" }}>
                    <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>Password</label>
                    <input
                      type={showPw ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password (min 8 chars)" required style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{
                      position: "absolute", right: 0, bottom: "8px",
                      background: "none", border: "none", cursor: "pointer", color: "#8890a8",
                    }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <button
                    type="submit" disabled={busy}
                    style={{
                      width: "100%", padding: "11px", border: "none",
                      borderRadius: "10px", background: "#10b981", color: "white",
                      fontSize: "14px", fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
                      opacity: busy ? 0.7 : 1, display: "flex",
                      alignItems: "center", justifyContent: "center", gap: "8px",
                      transition: "background .2s", marginTop: "10px",
                    }}
                    onMouseEnter={e => !busy && (e.currentTarget.style.background = "#059669")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#10b981")}
                  >
                    {status === "loading" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                    {tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              )}

              {/* ── OTP FLOW ── */}
              {authMode === "otp" && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} noValidate>
                      {tab === "signup" && (
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>Full Name</label>
                          <input
                            type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your full name" required style={inputStyle}
                            onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                            onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                          />
                        </div>
                      )}

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>Email Address</label>
                        <input
                          type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@company.com" required style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                          onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                        />
                      </div>

                      <button
                        type="submit" disabled={busy}
                        style={{
                          width: "100%", padding: "11px", border: "none",
                          borderRadius: "10px", background: "#10b981", color: "white",
                          fontSize: "14px", fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
                          opacity: busy ? 0.7 : 1, display: "flex",
                          alignItems: "center", justifyContent: "center", gap: "8px",
                          marginTop: "10px",
                        }}
                      >
                        {status === "otp-sending" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                        Send Verification Code
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} noValidate>
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", color: "#8890a8", fontSize: "11.5px", marginBottom: "4px" }}>
                          Enter 6-Digit Code
                        </label>
                        <input
                          type="text" value={otpToken} onChange={e => setOtpToken(e.target.value)}
                          placeholder="123456" maxLength={12} autoFocus required style={{
                            ...inputStyle, textAlign: "center", letterSpacing: "4px", fontSize: "18px",
                          }}
                          onFocus={e => (e.currentTarget.style.borderBottomColor = "#10b981")}
                          onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                        />
                      </div>

                      <button
                        type="submit" disabled={busy}
                        style={{
                          width: "100%", padding: "11px", border: "none",
                          borderRadius: "10px", background: "#10b981", color: "white",
                          fontSize: "14px", fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
                          opacity: busy ? 0.7 : 1, display: "flex",
                          alignItems: "center", justifyContent: "center", gap: "8px",
                        }}
                      >
                        {status === "loading" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                        Verify & Continue
                      </button>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "12px" }}>
                        <button
                          type="button" onClick={() => { setOtpSent(false); setErrorMsg(""); }}
                          style={{ color: "#8890a8", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Change email
                        </button>
                        <button
                          type="button" onClick={handleSendOtp} disabled={busy}
                          style={{ color: "#10b981", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                        >
                          Resend code
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIGHT: Brand panel ── */}
        <div
          className="auth-brand-side"
          style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(160deg, #101726, #162238)",
            padding: "40px 32px", display: "flex", flexDirection: "column", justifyContent: "center",
          }}
        >
          <div aria-hidden style={{ position: "absolute", top: "-80px", right: "-80px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, #10b98130, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ color: "#f5f6fa", fontSize: "24px", lineHeight: 1.3, fontWeight: 700, letterSpacing: "-0.5px", position: "relative", zIndex: 1, margin: 0 }}>
            Sell, hire, and scale —<br />all in one portal.
          </h2>
          <p style={{ color: "#8890a8", fontSize: "13px", marginTop: "10px", position: "relative", zIndex: 1 }}>
            Access client projects, video consultations, and real-time advisory dashboard.
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#ffffff0d", border: "1px solid #ffffff1a",
            padding: "8px 12px", borderRadius: "100px", marginTop: "24px",
            position: "relative", zIndex: 1, width: "fit-content",
          }}>
            <span style={{ color: "#8890a8", fontSize: "12px" }}>
              Direct access to <strong style={{ color: "#f5f6fa" }}>vetted specialists</strong>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .auth-modal-grid { grid-template-columns: 1fr !important; }
          .auth-brand-side { display: none !important; }
          .auth-form-side { padding: 32px 24px !important; }
        }
        input::placeholder { color: #4a5170; }
      `}</style>
    </div>
  );
}
