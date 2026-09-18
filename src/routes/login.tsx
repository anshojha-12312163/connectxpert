import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — ConnectXpert" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "loading" | "google" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const authInProgress = useRef(false);
  // Track whether the user has actively started an auth action in this session.
  // Without this flag, onAuthStateChange fires SIGNED_IN for any existing
  // cached session the moment the listener is attached, causing an immediate
  // redirect even before the user clicks anything.
  useEffect(() => {
    // If the user already has an active session, send them straight to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate({ to: "/dashboard" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate({ to: "/dashboard" });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

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
    authInProgress.current = true;
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { authInProgress.current = false; setStatus("error"); setErrorMsg(error.message); return; }
    navigate({ to: "/dashboard" });
  }

  const busy = status === "loading" || status === "google";

  return (
    <div style={{
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "#0a0d1a",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "960px",
        minHeight: "600px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#0d1120",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
      }}
        className="login-wrap"
      >
        {/* ── LEFT: Form ── */}
        <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          className="login-form-side"
        >
          {/* Brand mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "#4361ee", display: "flex", alignItems: "center",
              justifyContent: "center", color: "white", fontWeight: 700, fontSize: "15px",
            }}>CX</div>
            <span style={{ color: "#f5f6fa", fontWeight: 700, fontSize: "16px" }}>ConnectXpert</span>
          </div>

          <h1 style={{ color: "#f5f6fa", fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#8890a8", fontSize: "14.5px", marginTop: "8px", marginBottom: "36px" }}>
            Log in to manage your dashboard
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            style={{
              width: "100%", padding: "12px", border: "1px solid #2a3050",
              borderRadius: "10px", background: "transparent", color: "#f5f6fa",
              fontSize: "14px", fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              marginBottom: "20px", transition: "border-color .2s, background .2s",
              opacity: busy ? 0.6 : 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#4361ee")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a3050")}
          >
            {status === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "#2a3050" }} />
            <span style={{ color: "#4a5170", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#2a3050" }} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: "26px", position: "relative" }}>
              <label style={{ display: "block", color: "#8890a8", fontSize: "12.5px", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" required
                style={{
                  width: "100%", background: "transparent", border: "none",
                  borderBottom: "1px solid #2a3050", color: "#f5f6fa",
                  fontSize: "15px", padding: "6px 30px 10px 0", outline: "none",
                }}
                onFocus={e => (e.currentTarget.style.borderBottomColor = "#4361ee")}
                onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "10px", position: "relative" }}>
              <label style={{ display: "block", color: "#8890a8", fontSize: "12.5px", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type={showPw ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                style={{
                  width: "100%", background: "transparent", border: "none",
                  borderBottom: "1px solid #2a3050", color: "#f5f6fa",
                  fontSize: "15px", padding: "6px 30px 10px 0", outline: "none",
                }}
                onFocus={e => (e.currentTarget.style.borderBottomColor = "#4361ee")}
                onBlur={e => (e.currentTarget.style.borderBottomColor = "#2a3050")}
              />
              <button
                type="button" onClick={() => setShowPw(v => !v)}
                style={{
                  position: "absolute", right: 0, bottom: "12px",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#8890a8", display: "flex", alignItems: "center",
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px", marginBottom: "28px" }}>
              <a href="#" style={{ color: "#4361ee", fontSize: "13px", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {status === "error" && (
              <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "14px", background: "#ef444415", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ef444430" }}>
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={busy}
              style={{
                width: "100%", padding: "14px", border: "none",
                borderRadius: "10px", background: "#4361ee", color: "white",
                fontSize: "15px", fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background .2s",
              }}
              onMouseEnter={e => !busy && (e.currentTarget.style.background = "#3652d4")}
              onMouseLeave={e => (e.currentTarget.style.background = "#4361ee")}
            >
              {status === "loading" && <Loader2 className="size-4 animate-spin" />}
              Log in
            </button>
          </form>

          {/* Sign up link */}
          <div style={{ marginTop: "32px", fontSize: "13.5px", color: "#8890a8", display: "flex", alignItems: "center", gap: "10px" }}>
            Don't have an account?
            <Link
              to="/signup"
              style={{
                color: "#f5f6fa", background: "#4361ee22", border: "1px solid #4361ee",
                padding: "6px 14px", borderRadius: "8px", textDecoration: "none",
                fontSize: "13px", fontWeight: 600,
              }}
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Brand panel ── */}
        <div
          className="login-brand-side"
          style={{
            position: "relative",
            background: "linear-gradient(160deg, #141a35, #1c2650)",
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Orb top-right */}
          <div aria-hidden style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "280px", height: "280px", borderRadius: "50%",
            background: "radial-gradient(circle, #4361ee44, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Orb bottom-left */}
          <div aria-hidden style={{
            position: "absolute", bottom: "-100px", left: "-60px",
            width: "240px", height: "240px", borderRadius: "50%",
            background: "radial-gradient(circle, #4361ee2a, transparent 70%)",
            pointerEvents: "none",
          }} />

          <h2 style={{
            color: "#f5f6fa", fontSize: "34px", lineHeight: 1.25,
            fontWeight: 700, letterSpacing: "-0.5px", position: "relative", zIndex: 1,
          }}>
            Sell, hire, and scale —<br />all from one login.
          </h2>
          <p style={{
            color: "#8890a8", fontSize: "14.5px", marginTop: "12px",
            maxWidth: "320px", position: "relative", zIndex: 1,
          }}>
            Access your ConnectXpert dashboard to manage clients, experts, and projects in one place.
          </p>

          {/* Illustration */}
          <div style={{ marginTop: "40px", position: "relative", zIndex: 1 }}>
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
            padding: "8px 14px", borderRadius: "100px", marginTop: "28px",
            position: "relative", zIndex: 1, width: "fit-content",
          }}>
            {/* Avatars */}
            <div style={{ display: "flex" }}>
              {[
                { letter: "A", color: "#ef4c6a" },
                { letter: "J", color: "#22c1c3" },
                { letter: "M", color: "#f6a94a" },
                { letter: "J", color: "#4361ee" },
              ].map((a, i) => (
                <div key={i} style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: "2px solid #141a35", marginLeft: i === 0 ? 0 : "-8px",
                  background: a.color, fontSize: "9px", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}>{a.letter}</div>
              ))}
            </div>
            <span style={{ color: "#8890a8", fontSize: "12.5px" }}>
              Join <strong style={{ color: "#f5f6fa" }}>15,725+</strong> growing businesses
            </span>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 800px) {
          .login-wrap { grid-template-columns: 1fr !important; }
          .login-brand-side { order: -1; padding: 40px 32px 32px !important; }
          .login-brand-side h2 { font-size: 26px !important; }
          .login-form-side { padding: 40px 32px !important; }
        }
        input::placeholder { color: #4a5170; }
      `}</style>
    </div>
  );
}
