import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const navigate = useNavigate();
  const [tab, setTab]           = useState<"login" | "signup">(defaultTab);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "google" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(""); setEmail(""); setPassword("");
    setStatus("idle"); setErrorMsg("");
  }, [tab]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Handle Google OAuth redirect back
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        onClose();
        navigate({ to: "/dashboard" });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogle() {
    setStatus("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setStatus("error"); setErrorMsg(error.message); return; }
      onClose();
      navigate({ to: "/dashboard" });
    } else {
      if (password.length < 8) { setStatus("error"); setErrorMsg("Password must be at least 8 characters."); return; }
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) { setStatus("error"); setErrorMsg(error.message); return; }
      setStatus("success");
    }
  }

  if (!open) return null;

  const busy = status === "loading" || status === "google";

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #2a3050", color: "#f5f6fa",
    fontSize: "15px", padding: "6px 30px 10px 0", outline: "none",
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={tab === "login" ? "Sign in" : "Create account"}
    >
      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "900px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
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
            justifyContent: "center", color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <X size={16} />
        </button>

        {/* ── LEFT: Form ── */}
        <div style={{ padding: "52px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          className="auth-form-side"
        >
          {/* Brand mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px", background: "#4361ee",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "15px",
            }}>CX</div>
            <span style={{ color: "#f5f6fa", fontWeight: 700, fontSize: "16px" }}>ConnectXpert</span>
          </div>

          <h2 style={{ color: "#f5f6fa", fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#8890a8", fontSize: "14px", marginTop: "6px", marginBottom: "28px" }}>
            {tab === "login" ? "Log in to manage your dashboard" : "Get started in seconds"}
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
            {(["login", "signup"] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, transition: "all .2s",
                background: tab === t ? "#4361ee" : "transparent",
                color: tab === t ? "white" : "#8890a8",
              }}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%", background: "#22c55e20",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ color: "#f5f6fa", fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}>Check your email</p>
              <p style={{ color: "#8890a8", fontSize: "13px" }}>Confirmation sent to <strong style={{ color: "#f5f6fa" }}>{email}</strong></p>
              <button onClick={() => setTab("login")} style={{ marginTop: "20px", color: "#4361ee", background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Google */}
              <button
                type="button" onClick={handleGoogle} disabled={busy}
                style={{
                  width: "100%", padding: "11px", border: "1px solid #2a3050",
                  borderRadius: "10px", background: "transparent", color: "#f5f6fa",
                  fontSize: "14px", fontWeight: 500, cursor: busy ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  marginBottom: "18px", opacity: busy ? 0.6 : 1, transition: "border-color .2s",
                }}
                onMouseEnter={e => !busy && (e.currentTarget.style.borderColor = "#4361ee")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a3050")}
              >
                {status === "google" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <div style={{ flex: 1, height: "1px", background: "#2a3050" }} />
                <span style={{ color: "#4a5170", fontSize: "12px" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#2a3050" }} />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {tab === "signup" && (
                  <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", color: "#8890a8", fontSize: "12.5px", marginBottom: "8px" }}>Full Name</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name" required style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = "#4361ee")}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                    />
                  </div>
                )}

                <div style={{ marginBottom: "22px" }}>
                  <label style={{ display: "block", color: "#8890a8", fontSize: "12.5px", marginBottom: "8px" }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com" required style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = "#4361ee")}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                  />
                </div>

                <div style={{ marginBottom: "8px", position: "relative" }}>
                  <label style={{ display: "block", color: "#8890a8", fontSize: "12.5px", marginBottom: "8px" }}>Password</label>
                  <input
                    type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = "#4361ee")}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{
                    position: "absolute", right: 0, bottom: "12px",
                    background: "none", border: "none", cursor: "pointer", color: "#8890a8",
                    display: "flex", alignItems: "center",
                  }}>
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {tab === "login" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "22px", marginTop: "4px" }}>
                    <a href="#" style={{ color: "#4361ee", fontSize: "13px", textDecoration: "none" }}>Forgot password?</a>
                  </div>
                )}

                {status === "error" && (
                  <p style={{
                    color: "#f87171", fontSize: "13px", marginBottom: "14px",
                    background: "#ef444415", padding: "8px 12px",
                    borderRadius: "8px", border: "1px solid #ef444430",
                  }}>{errorMsg}</p>
                )}

                <button
                  type="submit" disabled={busy}
                  style={{
                    width: "100%", padding: "13px", border: "none",
                    borderRadius: "10px", background: "#4361ee", color: "white",
                    fontSize: "15px", fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
                    opacity: busy ? 0.7 : 1, display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "background .2s", marginTop: tab === "signup" ? "16px" : 0,
                  }}
                  onMouseEnter={e => !busy && (e.currentTarget.style.background = "#3652d4")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#4361ee")}
                >
                  {status === "loading" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  {tab === "login" ? "Log in" : "Create Account"}
                </button>
              </form>

              <div style={{ marginTop: "24px", fontSize: "13px", color: "#8890a8", display: "flex", alignItems: "center", gap: "8px" }}>
                {tab === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setTab(tab === "login" ? "signup" : "login")}
                  style={{
                    color: "#f5f6fa", background: "#4361ee22", border: "1px solid #4361ee",
                    padding: "5px 12px", borderRadius: "8px", cursor: "pointer",
                    fontSize: "12px", fontWeight: 600,
                  }}
                >
                  {tab === "login" ? "Sign up" : "Sign in"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Brand panel ── */}
        <div
          className="auth-brand-side"
          style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(160deg, #141a35, #1c2650)",
            padding: "52px 44px", display: "flex", flexDirection: "column", justifyContent: "center",
          }}
        >
          {/* Orbs */}
          <div aria-hidden style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, #4361ee44, transparent 70%)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, #4361ee2a, transparent 70%)", pointerEvents: "none" }} />

          <h2 style={{ color: "#f5f6fa", fontSize: "32px", lineHeight: 1.25, fontWeight: 700, letterSpacing: "-0.5px", position: "relative", zIndex: 1, margin: 0 }}>
            Sell, hire, and scale —<br />all from one login.
          </h2>
          <p style={{ color: "#8890a8", fontSize: "14px", marginTop: "12px", maxWidth: "300px", position: "relative", zIndex: 1 }}>
            Access your ConnectXpert dashboard to manage clients, experts, and projects in one place.
          </p>

          {/* Illustration */}
          <div style={{ marginTop: "36px", position: "relative", zIndex: 1 }}>
            <svg viewBox="0 0 320 200" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="40" width="180" height="120" rx="12" fill="#ffffff0f" stroke="#4361ee55"/>
              <rect x="46" y="58" width="90" height="10" rx="5" fill="#4361ee88"/>
              <rect x="46" y="78" width="140" height="8" rx="4" fill="#ffffff22"/>
              <rect x="46" y="94" width="120" height="8" rx="4" fill="#ffffff17"/>
              <rect x="46" y="110" width="100" height="8" rx="4" fill="#ffffff17"/>
              <circle cx="230" cy="70" r="34" fill="#4361ee33" stroke="#4361ee88"/>
              <circle cx="230" cy="60" r="10" fill="#4361ee"/>
              <path d="M212 88c0-12 8-20 18-20s18 8 18 20" fill="#4361ee" opacity="0.7"/>
              <rect x="60" y="150" width="60" height="10" rx="5" fill="#4361ee55"/>
            </svg>
          </div>

          {/* Stat pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#ffffff0d", border: "1px solid #ffffff1a",
            padding: "8px 14px", borderRadius: "100px", marginTop: "24px",
            position: "relative", zIndex: 1, width: "fit-content",
          }}>
            <div style={{ display: "flex" }}>
              {[["A","#ef4c6a"],["J","#22c1c3"],["M","#f6a94a"],["J","#4361ee"]].map(([l, c], i) => (
                <div key={i} style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: "2px solid #141a35", marginLeft: i === 0 ? 0 : "-8px",
                  background: c, fontSize: "9px", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                }}>{l}</div>
              ))}
            </div>
            <span style={{ color: "#8890a8", fontSize: "12.5px" }}>
              Join <strong style={{ color: "#f5f6fa" }}>15,725+</strong> growing businesses
            </span>
          </div>
        </div>
      </div>

      {/* Responsive + spinner styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .auth-modal-grid { grid-template-columns: 1fr !important; }
          .auth-brand-side { display: none !important; }
          .auth-form-side { padding: 40px 28px !important; }
        }
        input::placeholder { color: #4a5170; }
      `}</style>
    </div>
  );
}
