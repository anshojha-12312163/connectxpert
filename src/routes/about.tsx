import { createFileRoute } from "@tanstack/react-router";
import { Linkedin } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading, Avatar } from "@/components/lanx/bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Ansh Consultancy" },
      { name: "description", content: "Meet the team behind Ansh Consultancy. Our story, mission, values, and the people driving results for our clients." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "10+", label: "Years in Business" },
  { value: "350+", label: "Clients Served" },
  { value: "600+", label: "Projects Completed" },
  { value: "98%", label: "Satisfaction Rate" },
];

const team = [
  { name: "Ansh Sharma", role: "Founder & Lead Consultant", bio: "10+ years helping businesses scale from idea to market leader. Ex-McKinsey, ex-Google Growth.", linkedin: "https://linkedin.com" },
  { name: "Priya Kapoor", role: "Head of Strategy", bio: "Specialises in go-to-market strategy and product-market fit for B2B SaaS companies.", linkedin: "https://linkedin.com" },
  { name: "Rahul Mehta", role: "Tech Advisory Lead", bio: "Former CTO with deep experience in cloud architecture, team building, and engineering culture.", linkedin: "https://linkedin.com" },
  { name: "Sara Williams", role: "Growth Marketing Lead", bio: "Data-driven marketer who has run campaigns generating millions in pipeline for mid-market companies.", linkedin: "https://linkedin.com" },
];

const values = [
  { title: "Radical Honesty", description: "We tell you what you need to hear, not what you want to hear. Our value is in clarity, not comfort." },
  { title: "Bias for Action", description: "Strategy without execution is just thinking. We bias towards doing, shipping, and iterating." },
  { title: "Client First", description: "Your success is our only metric. Every recommendation we make is measured against your actual goals." },
  { title: "Continuous Learning", description: "Markets change. We stay ahead by investing heavily in research, tools, and skills development." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">

        {/* Hero */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Our Story
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient leading-tight sm:text-6xl">
              Built by founders, for founders.
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              Ansh Consultancy was founded on a simple belief: businesses deserve expert advice
              that's honest, practical, and tied to real results. We've been in the trenches
              ourselves — as operators, engineers, and growth leaders — and we bring that
              experience directly to you.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-border py-12">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-4xl font-semibold text-gradient sm:text-5xl">{value}</span>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
                  Mission
                </span>
                <h2 className="mt-5 text-4xl font-semibold text-gradient sm:text-5xl">
                  Our mission is your growth.
                </h2>
                <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                  We exist to make world-class business consulting accessible to companies of
                  every size. Too many great ideas fail not because they lack potential, but
                  because they lack the right guidance at the right time.
                </p>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  We bridge that gap — bringing the kind of strategic thinking, execution
                  support, and talent access that used to be reserved for Fortune 500 companies,
                  and making it available to the builders, founders, and operators who need it most.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map(({ title, description }) => (
                  <div key={title} className="rounded-2xl border border-border bg-surface-2/50 p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              badge="The Team"
              title="The people behind the work"
              subtitle="Experienced operators and strategists who've built, scaled, and exited businesses across multiple industries."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map(({ name, role, bio, linkedin }) => (
                <div key={name} className="group flex flex-col rounded-3xl border border-border bg-surface-2/50 p-6 transition-all hover:border-primary/30">
                  <Avatar name={name} size={64} className="mb-4" />
                  <h3 className="text-base font-semibold">{name}</h3>
                  <p className="text-xs text-accent mb-3">{role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{bio}</p>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} on LinkedIn`}
                    className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Linkedin className="size-3.5" /> LinkedIn
                  </a>
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
