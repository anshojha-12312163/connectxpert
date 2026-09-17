import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart2, Users, Lightbulb, Code2, TrendingUp, Shield, ArrowRight, Check } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading } from "@/components/lanx/bits";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Ansh Consultancy" },
      { name: "description", content: "Explore our consulting services: Business Strategy, Web & Product Consulting, Growth Marketing, Tech Advisory, Hiring, and more." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: TrendingUp,
    title: "Business Strategy",
    description: "Craft a clear roadmap from where you are to where you want to be. We work with founders and leadership to define goals, prioritise initiatives, and build execution plans that hold.",
    href: "/contact",
  },
  {
    icon: Code2,
    title: "Web & Product Consulting",
    description: "From product discovery to launch, we help you build the right thing at the right time. Scope, architecture, roadmap — we cover the full product lifecycle.",
    href: "/contact",
  },
  {
    icon: BarChart2,
    title: "Growth Marketing",
    description: "Demand gen, conversion optimisation, SEO, paid channels — we design and run growth experiments that compound over time and build sustainable revenue.",
    href: "/contact",
  },
  {
    icon: Lightbulb,
    title: "Market Research & Insights",
    description: "Get the data and context you need to make confident decisions. Industry analysis, competitor intelligence, customer research, and trend reports.",
    href: "/contact",
  },
  {
    icon: Users,
    title: "Talent & Hiring Advisory",
    description: "Access our curated talent network and let us streamline your hiring process end to end — from JD creation to final offer negotiation.",
    href: "/contact",
  },
  {
    icon: Shield,
    title: "Tech Advisory",
    description: "Senior engineering guidance without the full-time CTO cost. Architecture reviews, tech stack decisions, team structure, and engineering culture.",
    href: "/contact",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$1,500",
    period: "/ month",
    description: "Perfect for early-stage businesses looking for direction.",
    features: [
      "2 strategy sessions/month",
      "Monthly growth report",
      "Email support",
      "Access to resource library",
      "1 area of focus",
    ],
    cta: "Get Started",
    href: "/contact",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4,500",
    period: "/ month",
    description: "For growing businesses ready to accelerate across multiple fronts.",
    features: [
      "Weekly strategy sessions",
      "Dedicated consultant",
      "All 6 service areas",
      "Priority Slack access",
      "Hiring support (up to 3 roles)",
      "Custom growth playbook",
      "Monthly analytics review",
    ],
    cta: "Start Pro",
    href: "/contact",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored engagement for complex organisations with specific needs.",
    features: [
      "Dedicated consultant team",
      "Unlimited sessions",
      "On-site workshops",
      "Board-level reporting",
      "Full hiring pipeline",
      "Custom contracts & SLAs",
    ],
    cta: "Contact Us",
    href: "/contact",
    highlighted: false,
  },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">

        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              What We Do
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient leading-tight sm:text-6xl">
              Services built around your growth.
            </h1>
            <p className="mt-6 text-base text-muted-foreground">
              Six areas of deep expertise, one unified goal: helping your business grow faster and smarter.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, description, href }) => (
                <div key={title} className="group flex flex-col rounded-3xl border border-border bg-surface-2/50 p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-8px_oklch(0.51_0.276_268_/_25%)]">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 transition-colors group-hover:border-primary/60 group-hover:bg-primary/20">
                    <Icon className="size-5 text-accent" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <Link
                    to={href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
                  >
                    Learn More <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              badge="Pricing"
              title="Transparent, flexible pricing"
              subtitle="Choose the engagement level that fits your stage. Scale up or down anytime — no long-term lock-in."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                    plan.highlighted
                      ? "border-primary/60 bg-primary/10 shadow-[0_0_48px_-12px_oklch(0.51_0.276_268_/_40%)]"
                      : "border-border bg-surface-2/50"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/60 bg-background px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-gradient">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={plan.href}
                    className={`mt-8 rounded-xl px-6 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                      plan.highlighted
                        ? "text-primary-foreground"
                        : "border border-border bg-surface-2/80 text-foreground hover:bg-surface-2"
                    }`}
                    style={plan.highlighted ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" } : {}}
                  >
                    {plan.cta}
                  </Link>
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
