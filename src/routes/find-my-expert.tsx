import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, BarChart2, Code2, Scale, Palette, DollarSign,
  Calendar, ArrowRight, ChevronLeft, Star, Zap, BadgeCheck,
} from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { Avatar, StatusDot } from "@/components/lanx/bits";
import { SEED_EXPERTS, getOnlineStatus, type ExpertRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find-my-expert")({
  head: () => ({
    meta: [
      { title: "Find My Expert — ConnectXpert" },
      { name: "description", content: "Answer 4 quick questions and we'll match you with the perfect expert instantly." },
    ],
  }),
  component: FindMyExpertPage,
});

// ── Step data ─────────────────────────────────────────────────

const CATEGORIES = [
  { id: "business",  label: "Business Strategy", icon: TrendingUp, color: "from-blue-500/20 to-blue-600/10" },
  { id: "marketing", label: "Marketing",          icon: BarChart2,  color: "from-purple-500/20 to-purple-600/10" },
  { id: "tech",      label: "Technology",         icon: Code2,      color: "from-cyan-500/20 to-cyan-600/10" },
  { id: "legal",     label: "Legal",              icon: Scale,      color: "from-orange-500/20 to-orange-600/10" },
  { id: "design",    label: "Design",             icon: Palette,    color: "from-pink-500/20 to-pink-600/10" },
  { id: "finance",   label: "Finance",            icon: DollarSign, color: "from-green-500/20 to-green-600/10" },
];

const BUDGETS = [
  { id: "under50",   label: "Under $50/hr",   min: 0,   max: 50  },
  { id: "50-100",    label: "$50–100/hr",      min: 50,  max: 100 },
  { id: "100-200",   label: "$100–200/hr",     min: 100, max: 200 },
  { id: "200plus",   label: "$200+/hr",        min: 200, max: 9999},
  { id: "notsure",   label: "Not sure yet",    min: 0,   max: 9999},
];

const URGENCY = [
  { id: "today",     label: "Today",           desc: "I need help right now" },
  { id: "thisweek",  label: "This week",       desc: "In the next few days" },
  { id: "thismonth", label: "This month",      desc: "No rush, planning ahead" },
  { id: "exploring", label: "Just exploring",  desc: "Researching my options" },
];

const TOTAL_STEPS = 4;

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({length: TOTAL_STEPS}).map((_,i) => (
        <div key={i} className={cn(
          "rounded-full transition-all duration-300",
          i + 1 === current ? "w-6 h-2 bg-blue-500" :
          i + 1 < current  ? "size-2 bg-blue-500/60" : "size-2 bg-white/15",
        )} />
      ))}
      <span className="ml-2 text-xs text-white/30 font-medium">Step {current} of {TOTAL_STEPS}</span>
    </div>
  );
}

function FindMyExpertPage() {
  const [step,     setStep]     = useState(1);
  const [category, setCategory] = useState("");
  const [budget,   setBudget]   = useState("");
  const [urgency,  setUrgency]  = useState("");
  const [desc,     setDesc]     = useState("");
  const [results,  setResults]  = useState<ExpertRow[]>([]);

  function computeMatches() {
    const budgetObj = BUDGETS.find(b => b.id === budget);
    let pool = [...SEED_EXPERTS].map((e,i) => ({ ...e, id: `seed-${i}` } as ExpertRow));

    // Score each expert
    const scored = pool.map(e => {
      let score = 0;
      if (e.category_id === category) score += 40;
      if (budgetObj && e.hourly_rate >= budgetObj.min && e.hourly_rate <= budgetObj.max) score += 25;
      if (urgency === "today" || urgency === "thisweek") {
        const status = getOnlineStatus(e.last_active_at);
        if (status === "online") score += 20;
        if (status === "away")   score += 10;
      }
      score += e.average_rating * 3;
      return { expert: e, score };
    });

    scored.sort((a,b) => b.score - a.score);
    setResults(scored.slice(0,3).map(s => s.expert));
    setStep(5);
  }

  function matchReason(e: ExpertRow): string {
    const status = getOnlineStatus(e.last_active_at);
    const parts: string[] = [];
    if (e.category_id === category) {
      const cat = CATEGORIES.find(c => c.id === category);
      if (cat) parts.push(`Specialises in ${cat.label}`);
    }
    if (status === "online") parts.push("available right now");
    else if (status === "away") parts.push("available soon");
    if (e.is_verified) parts.push("verified expert");
    return parts.length > 0 ? parts.join(", ") + "." : `Highly rated with ${e.review_count} reviews.`;
  }

  const canContinue = [
    step === 1 ? !!category : true,
    step === 2 ? !!budget   : true,
    step === 3 ? !!urgency  : true,
    true,
  ][step - 1];

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <Nav />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-5">

          {step < 5 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-4">
                  Smart Matching
                </span>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">Find your perfect expert</h1>
                <p className="mt-2 text-sm text-white/40">4 quick questions. Instant results.</p>
              </div>

              <StepDots current={step} />
            </>
          )}

          {/* Step 1 — Category */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">What do you need help with?</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map(c => {
                  const Icon = c.icon;
                  return (
                    <button key={c.id} onClick={() => setCategory(c.id)}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-200",
                        "hover:border-blue-500/40 hover:shadow-[0_0_20px_-8px_rgba(59,130,246,0.4)]",
                        category === c.id
                          ? "border-blue-500/50 bg-gradient-to-br from-blue-500/15 to-blue-600/5 text-white"
                          : "border-white/[0.06] text-white/50",
                      )}
                      style={{ background: category === c.id ? undefined : "#131824" }}
                    >
                      <span className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br", c.color)}>
                        <Icon className="size-6 text-white" strokeWidth={1.5} />
                      </span>
                      <span className="text-sm font-medium text-center leading-tight">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">What&apos;s your budget?</h2>
              <div className="space-y-3">
                {BUDGETS.map(b => (
                  <button key={b.id} onClick={() => setBudget(b.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-2xl border px-6 py-4 text-left transition-all",
                      budget === b.id
                        ? "border-blue-500/50 bg-blue-500/10 text-white"
                        : "border-white/[0.06] text-white/60 hover:border-white/15 hover:text-white",
                    )}
                    style={{ background: budget === b.id ? undefined : "#131824" }}
                  >
                    <span className="text-base font-medium">{b.label}</span>
                    {budget === b.id && <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Urgency */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">How soon do you need to start?</h2>
              <div className="space-y-3">
                {URGENCY.map(u => (
                  <button key={u.id} onClick={() => setUrgency(u.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-2xl border px-6 py-4 text-left transition-all",
                      urgency === u.id
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/[0.06] hover:border-white/15",
                    )}
                    style={{ background: urgency === u.id ? undefined : "#131824" }}
                  >
                    <div>
                      <p className={cn("text-base font-semibold", urgency === u.id ? "text-white" : "text-white/70")}>{u.label}</p>
                      <p className="text-xs text-white/35 mt-0.5">{u.desc}</p>
                    </div>
                    {urgency === u.id && <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Description */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Briefly describe what you need</h2>
              <p className="text-sm text-white/40 mb-6">Optional but helps us find a better match.</p>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={5}
                placeholder="e.g. I'm a SaaS founder looking for help with go-to-market strategy for our B2B product targeting SMEs in India..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-colors leading-relaxed"
              />
            </div>
          )}

          {/* Results */}
          {step === 5 && (
            <div>
              <div className="text-center mb-8">
                <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-green-400 mb-4">
                  Your Matches
                </span>
                <h2 className="text-2xl font-semibold text-white">We found your top experts</h2>
                <p className="mt-2 text-sm text-white/40">Based on your preferences and real-time availability.</p>
              </div>

              <div className="space-y-4">
                {results.map((e, i) => {
                  const status = getOnlineStatus(e.last_active_at);
                  return (
                    <div key={e.id} className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
                      {i === 0 && (
                        <div className="flex items-center gap-1.5 mb-3 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                          <Star className="size-3 fill-yellow-400" /> Best Match
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <Avatar name={e.name} src={e.photo_url} size={52} />
                          <StatusDot status={status} className="absolute -bottom-0.5 -right-0.5 size-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-white">{e.name}</p>
                                {e.is_verified && <BadgeCheck className="size-4 text-blue-400" />}
                              </div>
                              <p className="text-xs text-white/45">{e.title}</p>
                            </div>
                            <span className="text-lg font-bold text-white shrink-0">${e.hourly_rate}/hr</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-white/80">{e.average_rating.toFixed(1)}</span>
                            <span className="text-xs text-white/30">({e.review_count})</span>
                          </div>
                          {/* Why matched */}
                          <div className="mt-3 rounded-xl border border-blue-500/15 bg-blue-500/5 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-0.5">Why we matched you</p>
                            <p className="text-xs text-white/55">{matchReason(e)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link to="/experts/$id" params={{ id: e.id }}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-center text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                          View Profile
                        </Link>
                        <Link to="/book"
                          className="flex-1 rounded-xl py-2.5 text-center text-xs font-semibold text-white transition-transform hover:scale-[1.01]"
                          style={{ background: "var(--gradient-primary)" }}>
                          Book Session
                        </Link>
                        <button className="flex items-center gap-1 rounded-xl border border-blue-500/25 bg-blue-500/8 px-3 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/15 transition-colors">
                          <Zap className="size-3.5" /> Quick
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/35 mb-2">Not seeing the right fit?</p>
                <Link to="/experts" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Browse all experts →
                </Link>
              </div>

              <button onClick={() => { setStep(1); setCategory(""); setBudget(""); setUrgency(""); setDesc(""); }}
                className="mt-6 flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mx-auto">
                Start over
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(s => s-1)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white transition-colors">
                  <ChevronLeft className="size-4" /> Back
                </button>
              ) : <div />}

              <button
                onClick={() => {
                  if (step === 4) computeMatches();
                  else setStep(s => s+1);
                }}
                disabled={!canContinue}
                className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 transition-all hover:scale-[1.02] disabled:hover:scale-100"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                {step === 4 ? "Find My Experts" : "Continue"} <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
