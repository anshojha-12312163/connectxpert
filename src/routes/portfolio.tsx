import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading } from "@/components/lanx/bits";
import { supabase, type CaseStudyRow } from "@/lib/supabase";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Case Studies & Outcomes — ConnectXpert" },
      { name: "description", content: "Original consulting case studies and measurable outcomes across GTM, tech architecture, product strategy, and operational scaling." },
    ],
  }),
  component: PortfolioPage,
});

export const DEFAULT_CASE_STUDIES: CaseStudyRow[] = [
  {
    slug: "salesforce-crm-cpq-transformation",
    client: "Salesforce Multi-Cloud Scale",
    industry: "Enterprise SaaS & CRM Automation",
    tag: "Salesforce CRM & CPQ",
    problem: "Global SaaS enterprise suffered from disconnected customer data across 12 countries, manual quote-to-cash approvals taking 14 days, and 40% sales rep productivity loss.",
    solution: "ConnectXpert deployed an end-to-end Salesforce multi-cloud architecture: unified Sales Cloud with CPQ, automated billing workflows, MuleSoft bidirectional ERP sync, and real-time executive forecasting dashboards.",
    outcome: "+340% pipeline velocity, quote generation reduced from 14 days to 18 minutes, and +28% annual deal win rate.",
    metrics: ["+340%", "Pipeline Velocity", "18 min", "Quote Cycle"],
    color: "from-sky-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "tcs-enterprise-cloud-modernization",
    client: "TCS Enterprise Financial Systems",
    industry: "Banking & Global Financial Services",
    tag: "TCS Cloud & Core Systems",
    problem: "Tier-1 financial institution struggled with legacy mainframe batch latency exceeding 12 hours, high infrastructure maintenance overhead, and delayed regulatory audit reports.",
    solution: "Architected a hybrid microservices framework on AWS & Azure guided by TCS BaNCS enterprise cloud standards, implementing real-time event streaming via Apache Kafka and automated compliance pipelines.",
    outcome: "99.999% high-availability uptime, settlement latency slashed by 88%, and deployment cycles compressed from 6 months to bi-weekly releases.",
    metrics: ["-88%", "Settlement Latency", "99.999%", "System Uptime"],
    color: "from-blue-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "aurascale-gtm",
    client: "AuraScale",
    industry: "B2B Cloud Workflow Software",
    tag: "Growth Marketing & GTM",
    problem: "Post-Seed SaaS startup struggled with long 9-month sales cycles, unfocused ICP targeting, and demo conversion rates below 4%.",
    solution: "ConnectXpert restructured the outbound motion: defined high-intent mid-market ICPs, rebuilt the demo narrative around immediate ROI, and deployed personalized multi-touch cadence playbooks.",
    outcome: "+280% pipeline velocity, demo-to-close rate improved from 3.8% to 14.2% in 90 days.",
    metrics: ["+280%", "Pipeline Velocity", "14.2%", "Demo-to-Close"],
    color: "from-indigo-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "vanguard-clinical-architecture",
    client: "Vanguard Clinical",
    industry: "HealthTech & Telehealth",
    tag: "Tech & Architecture Advisory",
    problem: "Telehealth platform faced scaling bottlenecks, 45-second latency during peak video visits, and pending HIPAA audit readiness challenges.",
    solution: "Conducted an end-to-end cloud architecture review, transitioned video routing to WebRTC edge clusters, implemented audit trails, and established automated compliance gates.",
    outcome: "Latency reduced to under 180ms, 99.98% platform uptime during peak hours, passed third-party SOC2 Type II audit.",
    metrics: ["<180ms", "Peak Latency", "99.98%", "System Uptime"],
    color: "from-teal-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "finbridge-onboarding-ux",
    client: "FinBridge Pay",
    industry: "FinTech & Cross-Border Payments",
    tag: "Product & UX Strategy",
    problem: "High drop-off rate (54%) during KYC merchant onboarding and confusing tiered compliance documentation causing merchant churn.",
    solution: "Streamlined 7-step merchant onboarding into a 3-step progressive KYC flow with instant OCR document verification and real-time status callbacks.",
    outcome: "Merchant drop-off decreased by 62%, average onboarding completion time dropped from 48 hours to 9 minutes.",
    metrics: ["-62%", "Drop-off Rate", "9 min", "Avg Onboarding"],
    color: "from-emerald-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "logiroute-dispatch-ops",
    client: "LogiRoute Systems",
    industry: "Supply Chain & Logistics",
    tag: "Business Strategy & Ops",
    problem: "Freight brokerage operated on disconnected spreadsheets and manual phone dispatching, limiting broker capacity to 12 loads/day per operator.",
    solution: "Built an integrated carrier dispatch workflow with automated rate intelligence, SMS driver updates, and real-time margin tracking dashboards.",
    outcome: "Broker daily load capacity increased by 3.5x, gross margin improved by 420 bps in the first quarter.",
    metrics: ["3.5x", "Broker Capacity", "+420 bps", "Gross Margin"],
    color: "from-purple-900/40 to-primary/10",
    featured: true,
  },
  {
    slug: "pulse-collective-talent",
    client: "Pulse Collective",
    industry: "Omnichannel Consumer Retail",
    tag: "Talent & Hiring Advisory",
    problem: "Rapidly expanding consumer brand struggled to hire specialized Head of Performance Marketing and VP Supply Chain, with searches open for 7+ months.",
    solution: "Engaged ConnectXpert hiring advisors to calibrate role specs, map top talent from high-growth competitors, run structured scorecards, and negotiate compensation packages.",
    outcome: "Both executive hires closed within 24 days with 100% first-year retention and accelerated holiday season delivery.",
    metrics: ["24 days", "Time-to-Hire", "100%", "Retention Rate"],
    color: "from-orange-900/40 to-primary/10",
    featured: true,
  },
];

// Export alias for backwards compatibility
export const caseStudies = DEFAULT_CASE_STUDIES;

function PortfolioPage() {
  const [studies, setStudies] = useState<CaseStudyRow[]>(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    async function loadCaseStudies() {
      try {
        const { data, error } = await supabase
          .from("case_studies")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          setStudies(data);
        }
      } catch {}
    }
    loadCaseStudies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Verified Case Studies
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient leading-tight sm:text-6xl">
              Real problem. Proven approach. Measurable impact.
            </h1>
            <p className="mt-6 text-base text-muted-foreground">
              Every advisory engagement is grounded in clear outcomes. Review how ConnectXpert specialists have tackled critical bottlenecks for ambitious businesses.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studies.map((cs) => (
                <Link
                  key={cs.slug}
                  to="/portfolio/$slug"
                  params={{ slug: cs.slug }}
                  className="group flex flex-col rounded-3xl border border-border bg-surface-2/50 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-8px_oklch(0.51_0.276_268_/_25%)]"
                >
                  {/* Metric banner */}
                  <div className={`bg-gradient-to-br ${cs.color} flex items-center justify-between px-8 py-6`}>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{cs.metrics?.[0]}</p>
                      <p className="text-sm text-foreground/70">{cs.metrics?.[1]}</p>
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
