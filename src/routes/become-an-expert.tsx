import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Loader2, Plus, X } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/become-an-expert")({
  head: () => ({
    meta: [
      { title: "Become an Expert — ConnectXpert" },
      { name: "description", content: "Apply to join ConnectXpert as a verified expert consultant." },
    ],
  }),
  component: BecomeAnExpertPage,
});

const CATEGORIES = [
  { id: "business",  label: "Business Strategy" },
  { id: "marketing", label: "Marketing" },
  { id: "tech",      label: "Technology" },
  { id: "legal",     label: "Legal" },
  { id: "design",    label: "Design" },
  { id: "finance",   label: "Finance" },
];

const EMPTY = {
  name: "", email: "", phone: "", title: "", category_id: "",
  bio: "", years_experience: "", hourly_rate: "",
  portfolio_links: [""], skills_input: "", offers_free_intro: false,
};

function BecomeAnExpertPage() {
  const [form,    setForm]    = useState({ ...EMPTY });
  const [skills,  setSkills]  = useState<string[]>([]);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [status,  setStatus]  = useState<"idle"|"loading"|"success"|"error">("idle");

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function addSkill() {
    const s = form.skills_input.trim();
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s]);
    set("skills_input", "");
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!form.name.trim())        e.name = "Required";
    if (!form.email.trim())       e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.title.trim())       e.title = "Required";
    if (!form.category_id)        e.category_id = "Required";
    if (!form.bio.trim())         e.bio = "Required";
    if (!form.years_experience)   e.years_experience = "Required";
    if (!form.hourly_rate)        e.hourly_rate = "Required";
    if (skills.length === 0)      e.skills = "Add at least one skill";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      title: form.title.trim(),
      category_id: form.category_id,
      bio: form.bio.trim(),
      years_experience: parseInt(form.years_experience, 10),
      hourly_rate: parseFloat(form.hourly_rate),
      portfolio_links: form.portfolio_links.filter(l => l.trim()),
      skills,
      offers_free_intro: form.offers_free_intro,
      status: "pending",
    };
    const { error } = await supabase.from("expert_applications").insert(payload);
    if (error) { setStatus("error"); return; }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0a0e17]">
        <Nav />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="mx-auto max-w-md px-5 text-center">
            <span className="flex size-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 mx-auto mb-6 shadow-[0_0_40px_-8px_rgba(74,222,128,0.4)]">
              <Check className="size-9 text-green-400" />
            </span>
            <h1 className="text-2xl font-semibold text-white mb-3">Application Submitted!</h1>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Thanks for applying to ConnectXpert. We&apos;ll review your application within{" "}
              <strong className="text-white">2–3 business days</strong> and reach out to{" "}
              <strong className="text-white">{form.email}</strong> with our decision.
            </p>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">What happens next?</p>
              {["We review your application and verify your credentials", "You&apos;ll receive an email with our decision", "Once approved, your profile goes live and clients can book you"].map((s, i) => (
                <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold mt-0.5">{i+1}</span>
                  <p className="text-sm text-white/55">{s}</p>
                </div>
              ))}
            </div>
            <Link to="/" className="inline-flex rounded-xl px-6 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fieldClass = (key: string) =>
    `w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-colors ${errors[key] ? "border-red-500/40" : "border-white/10"}`;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-medium uppercase tracking-wider text-white/35 mb-1.5">{children}</label>
  );

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <Nav />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-5">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-4">
              Apply Now
            </span>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Become a ConnectXpert</h1>
            <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
              Join our network of verified experts. Set your own rates, build your client base, and work on your terms.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Personal Info */}
            <div className="rounded-2xl border border-white/[0.06] p-6 space-y-4" style={{ background: "#131824" }}>
              <h2 className="text-sm font-semibold text-white mb-1">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Full Name *</Label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" className={fieldClass("name")} />{errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}</div>
                <div><Label>Email Address *</Label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" className={fieldClass("email")} />{errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}</div>
                <div><Label>Phone <span className="text-white/20 normal-case tracking-normal">(optional)</span></Label><input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" className={fieldClass("phone")} /></div>
                <div><Label>Title / Specialisation *</Label><input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Growth Marketing Expert" className={fieldClass("title")} />{errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}</div>
              </div>
            </div>

            {/* Expertise */}
            <div className="rounded-2xl border border-white/[0.06] p-6 space-y-4" style={{ background: "#131824" }}>
              <h2 className="text-sm font-semibold text-white mb-1">Expertise</h2>

              <div>
                <Label>Category *</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map(c => (
                    <button key={c.id} type="button" onClick={() => set("category_id", c.id)}
                      className={cn("rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                        form.category_id === c.id ? "border-blue-500/40 bg-blue-500/15 text-blue-400" : "border-white/8 text-white/45 hover:border-white/15 hover:text-white")}>
                      {c.label}
                    </button>
                  ))}
                </div>
                {errors.category_id && <p className="mt-1 text-xs text-red-400">{errors.category_id}</p>}
              </div>

              <div><Label>Bio *</Label><textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={4} placeholder="Tell clients about your background, experience, and what makes you unique..." className={`${fieldClass("bio")} resize-none`} />{errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio}</p>}</div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Years of Experience *</Label><input type="number" min="0" max="50" value={form.years_experience} onChange={e => set("years_experience", e.target.value)} placeholder="5" className={fieldClass("years_experience")} />{errors.years_experience && <p className="mt-1 text-xs text-red-400">{errors.years_experience}</p>}</div>
                <div><Label>Hourly Rate (USD) *</Label><input type="number" min="10" value={form.hourly_rate} onChange={e => set("hourly_rate", e.target.value)} placeholder="100" className={fieldClass("hourly_rate")} />{errors.hourly_rate && <p className="mt-1 text-xs text-red-400">{errors.hourly_rate}</p>}</div>
              </div>

              {/* Skills */}
              <div>
                <Label>Skills *</Label>
                <div className="flex gap-2">
                  <input value={form.skills_input} onChange={e => set("skills_input", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    placeholder="Type a skill and press Enter..." className={`${fieldClass("skills")} flex-1`} />
                  <button type="button" onClick={addSkill}
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                    <Plus className="size-4" />
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                        {s}
                        <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))}><X className="size-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.skills && <p className="mt-1 text-xs text-red-400">{errors.skills}</p>}
              </div>
            </div>

            {/* Portfolio + Options */}
            <div className="rounded-2xl border border-white/[0.06] p-6 space-y-4" style={{ background: "#131824" }}>
              <h2 className="text-sm font-semibold text-white mb-1">Portfolio & Options</h2>

              <div>
                <Label>Portfolio Links <span className="text-white/20 normal-case tracking-normal">(optional)</span></Label>
                {form.portfolio_links.map((link, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={link} onChange={e => {
                      const updated = [...form.portfolio_links];
                      updated[i] = e.target.value;
                      set("portfolio_links", updated);
                    }} placeholder="https://your-work.com" className={`${fieldClass("portfolio")} flex-1`} />
                    {i > 0 && (
                      <button type="button" onClick={() => set("portfolio_links", form.portfolio_links.filter((_,j) => j !== i))}
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white transition-colors">
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => set("portfolio_links", [...form.portfolio_links, ""])}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1">
                  <Plus className="size-3.5" /> Add another link
                </button>
              </div>

              {/* Free intro toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set("offers_free_intro", !form.offers_free_intro)}
                  className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${form.offers_free_intro ? "bg-blue-500" : "bg-white/15"}`}>
                  <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${form.offers_free_intro ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Offer a free 15-min intro call</p>
                  <p className="text-xs text-white/35">Increases your booking rate by ~3x</p>
                </div>
              </label>
            </div>

            {status === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}

            <button type="submit" disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold text-white disabled:opacity-60 transition-transform hover:scale-[1.01]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {status === "loading" && <Loader2 className="size-4 animate-spin" />}
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}


