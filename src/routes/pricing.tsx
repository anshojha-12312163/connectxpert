import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, ChevronDown } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";
import { GlowButton } from "@/components/lanx/glow-button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Ansh Consultancy" },
      { name: "description", content: "Transparent pricing for every stage. Starter, Pro, and Enterprise consulting packages with no long-term lock-in." },
    ],
  }),
  component: PricingPage,
});

const features = [
  { label: "Strategy sessions / month", starter: "2", pro: "Weekly", enterprise: "Unlimited" },
  { label: "Dedicated consultant", starter: false, pro: true, enterprise: true },
  { label: "Service areas covered", starter: "1", pro: "All 6", enterprise: "All 6 + custom" },
  { label: "Hiring support", starter: false, pro: "Up to 3 roles", enterprise: "Unlimited" },
  { label: "Priority Slack access", starter: false, pro: true, enterprise: true },
  { label: "Monthly analytics review", starter: false, pro: true, enterprise: true },
  { label: "Custom growth playbook", starter: false, pro: true, enterprise: true },
  { label: "Board-level reporting", starter: false, pro: false, enterprise: true },
  { label: "On-site workshops", starter: false, pro: false, enterprise: true },
  { label: "Custom SLAs & contracts", starter: false, pro: false, enterprise: true },
];

const faqs = [
  {
    q: "How does the onboarding process work?",
    a: "After you sign up, we schedule a 90-minute strategy kickoff call within 48 hours. We'll audit your current state, align on goals, and build a 90-day roadmap together. From there, work begins immediately.",
  },
  {
    q: "Can I change my plan after starting?",
    a: "Yes — upgrade or downgrade anytime with 30 days notice. There are no penalties for changing plans, and unused time is always credited.",
  },
  {
    q: "What is your pricing in detail?",
    a: "Starter is $1,500/month, Pro is $4,500/month, and Enterprise is custom-quoted based on scope. All prices are in USD and billed monthly. Annual billing is available at a 15% discount.",
  },
  {
    q: "How long do engagements typically run?",
    a: "Most clients see meaningful results within 60–90 days and choose to continue. There's no minimum commitment — month-to-month by default. The average client stays for 14 months.",
  },
  {
    q: "What is your refund policy?",
    a: "If you're not satisfied after the first 30 days, we offer a full refund — no questions asked. We're confident in our work, and we want you to be too.",
  },
  {
    q: "Do you offer a free consultation?",
    a: "Yes. We offer a free 30-minute strategy call before any commitment. Use it to ask hard questions, get a feel for how we think, and decide if we're the right fit.",
  },
  {
    q: "What kind of support is included?",
    a: "Starter gets email support with 48h response. Pro and Enterprise get priority Slack access with same-day response during business hours, plus a dedicated consultant who knows your business deeply.",
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">

        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Pricing
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient sm:text-6xl">
              Straightforward pricing.
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              No lock-in, no surprises. Scale up or down as your needs change.
            </p>
            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-1.5">
              <button
                onClick={() => setYearly(false)}
                className={cn("rounded-lg px-5 py-2 text-sm font-medium transition-all", !yearly ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn("rounded-lg px-5 py-2 text-sm font-medium transition-all", yearly ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Yearly <span className="ml-1 text-xs text-accent">−15%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-8">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { name: "Starter", monthly: 1500, highlight: false, desc: "For early-stage businesses getting started.", cta: "Get Started", features: ["2 sessions/month", "Email support", "1 service area", "Resource library access", "Monthly report"] },
                { name: "Pro", monthly: 4500, highlight: true, desc: "For growing businesses accelerating across multiple fronts.", cta: "Start Pro", features: ["Weekly sessions", "Dedicated consultant", "All 6 service areas", "Priority Slack", "Hiring support (3 roles)", "Custom growth playbook", "Monthly analytics review"] },
                { name: "Enterprise", monthly: null, highlight: false, desc: "Tailored for complex organisations with specific needs.", cta: "Contact Us", features: ["Unlimited sessions", "Dedicated team", "On-site workshops", "Board-level reporting", "Unlimited hiring", "Custom SLAs"] },
              ].map((plan) => (
                <div key={plan.name} className={cn(
                  "relative flex flex-col rounded-3xl border p-8",
                  plan.highlight
                    ? "border-primary/60 bg-primary/10 shadow-[0_0_48px_-12px_oklch(0.51_0.276_268_/_40%)]"
                    : "border-border bg-surface-2/50",
                )}>
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/60 bg-background px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                      Most Popular
                    </span>
                  )}
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <div className="mt-3 flex items-baseline gap-1">
                    {plan.monthly ? (
                      <>
                        <span className="text-4xl font-semibold text-gradient">
                          ${yearly ? Math.round(plan.monthly * 0.85).toLocaleString() : plan.monthly.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-semibold text-gradient">Custom</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.highlight ? (
                    <div className="mt-8 flex justify-center">
                      <GlowButton href="/contact">{plan.cta}</GlowButton>
                    </div>
                  ) : (
                    <Link
                      to="/contact"
                      className="mt-8 block rounded-xl border border-border bg-surface-2/80 px-6 py-3 text-center text-sm font-semibold text-foreground transition-all hover:bg-surface-2 hover:scale-[1.02]"
                    >
                      {plan.cta}
                    </Link>
                  )}

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-5">
            <SectionHeading badge="Compare" title="See exactly what you get" subtitle="A full breakdown of every feature across all plans." />
            <div className="mt-10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 text-left font-medium text-muted-foreground">Feature</th>
                    {["Starter", "Pro", "Enterprise"].map((p) => (
                      <th key={p} className="pb-4 text-center font-semibold">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((row, i) => (
                    <tr key={row.label} className={cn("border-b border-border/50", i % 2 === 0 ? "bg-surface-2/20" : "")}>
                      <td className="py-3.5 pr-4 text-muted-foreground">{row.label}</td>
                      {[row.starter, row.pro, row.enterprise].map((val, j) => (
                        <td key={j} className="py-3.5 text-center">
                          {typeof val === "boolean" ? (
                            val
                              ? <Check className="size-4 text-accent mx-auto" />
                              : <X className="size-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            <span className="text-foreground/85">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5">
            <SectionHeading badge="FAQ" title="Common questions" subtitle="Everything you need to know before getting started." />
            <div className="mt-10 space-y-3">
              {faqs.map(({ q, a }, i) => (
                <div key={q} className="rounded-2xl border border-border bg-surface-2/40 overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {q}
                    <ChevronDown className={cn("size-4 shrink-0 transition-transform text-muted-foreground", openFaq === i && "rotate-180")} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
