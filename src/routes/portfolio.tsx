import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading } from "@/components/lanx/bits";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Ansh Consultancy" },
      { name: "description", content: "Real case studies and results from our consulting engagements. See how we've helped businesses grow." },
    ],
  }),
  component: PortfolioPage,
});

export const caseStudies = [
  {
    slug: "novatech-lead-gen",
    client: "NovaTech Inc.",
    industry: "B2B SaaS",
    problem: "Stagnant inbound pipeline, <5% MQL-to-close rate, no clear ICP definition.",
    solution: "Full go-to-market reset: ICP workshop, messaging overhaul, SEO + LinkedIn content engine, sales cadence redesign.",
    outcome: "+312% inbound leads in 90 days",
    metrics: ["+312%", "Inbound Leads"],
    tag: "Growth Marketing",
    color: "from-blue-900/40 to-primary/10",
  },
  {
    slug: "skyline-hiring",
    client: "Skyline Ventures",
    industry: "VC-backed Startup",
    problem: "3 critical engineering roles unfilled for 6+ months, poor candidate quality, slow process.",
    solution: "Talent network activation, JD rewrite, structured interview framework, offer optimisation.",
    outcome: "3 senior hires in 2 weeks",
    metrics: ["3 hires", "In 2 weeks"],
    tag: "Hiring Advisory",
    color: "from-purple-900/40 to-primary/10",
  },
  {
    slug: "dune-analytics-strategy",
    client: "Dune Analytics",
    industry: "Data & Analytics",
    problem: "Unclear product roadmap, feature bloat, 60%+ churn in first 90 days of user lifecycle.",
    solution: "Jobs-to-be-done research, roadmap prioritisation, onboarding flow redesign, success metric definition.",
    outcome: "-47% churn, +28% activation rate",
    metrics: ["-47%", "Churn Rate"],
    tag: "Product Strategy",
    color: "from-teal-900/40 to-primary/10",
  },
  {
    slug: "opal-digital-growth",
    client: "Opal Digital",
    industry: "Digital Agency",
    problem: "Revenue plateau at $800K ARR, no systematic upsell motion, low client LTV.",
    solution: "Upsell playbook, service packaging redesign, QBR framework, client health scoring system.",
    outcome: "+$400K ARR in 6 months",
    metrics: ["+$400K", "ARR Added"],
    tag: "Business Strategy",
    color: "from-orange-900/40 to-primary/10",
  },
  {
    slug: "kairo-labs-tech",
    client: "Kairo Labs",
    industry: "Deep Tech",
    problem: "Monolithic architecture blocking shipping velocity, 6-week release cycles.",
    solution: "Architecture review, migration to microservices, CI/CD pipeline setup, team restructuring.",
    outcome: "40% faster shipping, weekly releases",
    metrics: ["40%", "Faster Shipping"],
    tag: "Tech Advisory",
    color: "from-pink-900/40 to-primary/10",
  },
  {
    slug: "northwind-market-entry",
    client: "Northwind Group",
    industry: "Professional Services",
    problem: "Entering two new market verticals with no validated demand or competitive intelligence.",
    solution: "Market sizing, competitor deep-dives, customer interviews, pilot GTM playbooks for both verticals.",
    outcome: "Both verticals launched, $1.2M pipeline built",
    metrics: ["$1.2M", "Pipeline Built"],
    tag: "Market Research",
    color: "from-indigo-900/40 to-primary/10",
  },
];

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Case Studies
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient leading-tight sm:text-6xl">
              Real work, real results.
            </h1>
            <p className="mt-6 text-base text-muted-foreground">
              Every engagement is different. Here's how we've helped businesses across industries achieve measurable outcomes.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.slug}
                  to="/portfolio/$slug"
                  params={{ slug: cs.slug }}
                  className="group flex flex-col rounded-3xl border border-border bg-surface-2/50 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-8px_oklch(0.51_0.276_268_/_25%)]"
                >
                  {/* Metric banner */}
                  <div className={`bg-gradient-to-br ${cs.color} flex items-center justify-between px-8 py-6`}>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{cs.metrics[0]}</p>
                      <p className="text-sm text-foreground/70">{cs.metrics[1]}</p>
                    </div>
                    <TrendingUp className="size-10 text-foreground/20" />
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-7">
                    <span className="inline-flex self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent mb-3">
                      {cs.tag}
                    </span>
                    <h3 className="text-base font-semibold">{cs.client}</h3>
                    <p className="mt-1 text-xs text-muted-foreground mb-3">{cs.industry}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{cs.problem}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xs font-semibold text-accent">{cs.outcome}</p>
                      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <SectionHeading
              badge="Work With Us"
              title="Ready to be our next success story?"
              subtitle="Let's talk about your business and figure out the best path forward together."
            />
            <Link
              to="/contact"
              className="mt-8 inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Book a Free Consultation
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
