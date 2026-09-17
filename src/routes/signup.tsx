import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/lanx/bits";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — Ansh Consultancy" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "google-loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGoogleSignIn() {
    setStatus("google-loading");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setStatus("error"); setErrorMsg("Password must be at least 8 characters."); return; }
    setStatus("loading");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); return; }
    setStatus("success");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 hero-glow" aria-hidden />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="rounded-3xl border border-border bg-surface-2/50 p-8">
          {status === "success" ? (
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground">We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click it to activate your account.</p>
              <Link to="/login" className="mt-6 inline-block text-sm text-accent hover:text-foreground transition-colors">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gradient mb-1">Create account</h1>
              <p className="text-sm text-muted-foreground mb-8">Get access to your client portal.</p>

              {/* Google sign-up */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={status === "loading" || status === "google-loading"}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-60"
              >
                {status === "google-loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {[
                  { label: "Full Name", val: name, set: setName, type: "text" },
                  { label: "Email", val: email, set: setEmail, type: "email" },
                ].map(({ label, val, set, type }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
                    <input type={type} value={val} onChange={(e) => set(e.target.value)} required
                      className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors" />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 pr-11 text-sm outline-none focus:border-primary/60 transition-colors" />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
                <button type="submit" disabled={status === "loading" || status === "google-loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                  {status === "loading" && <Loader2 className="size-4 animate-spin" />}
                  Create Account
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:text-foreground transition-colors font-medium">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
