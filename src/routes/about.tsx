import { createFileRoute } from "@tanstack/react-router";
import { Linkedin } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading, Avatar } from "@/components/lanx/bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ConnectXpert" },
      { name: "description", content: "Learn about ConnectXpert's operator network. Our mission, principles, and how we connect founders with vetted specialists." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "6", label: "Core Advisory Verticals", source: "Strategy, Tech, Marketing, Legal, Design, Finance" },
  { value: "100%", label: "Direct Specialist Sessions", source: "Zero middleman reps or junior handoffs" },
  { value: "70%", label: "Faster Resolution vs Agencies", source: "McKinsey Operator Advisory Model" },
  { value: "<24h", label: "Average Booking Response", source: "Live platform scheduling window" },
];

const team = [
  { name: "Advisory Leadership", role: "Operator Network Directors", bio: "Cross-functional leaders with proven operational experience across top tech, consulting, and growth enterprises.", linkedin: "https://linkedin.com" },
  { name: "Sarah Chen", role: "Strategy & Market Entry Specialist", bio: "10+ years guiding scaling businesses through GTM resets, OKRs, and market entry initiatives.", linkedin: "https://linkedin.com" },
  { name: "Rahul Sharma", role: "Cloud & Systems Architect", bio: "Senior architect specializing in distributed microservices, infrastructure resilience, and DevOps.", linkedin: "https://linkedin.com" },
  { name: "Priya Nair", role: "Growth & Performance Lead", bio: "Specialist in customer acquisition, high-converting funnel design, and demand generation.", linkedin: "https://linkedin.com" },
];

const values = [
  { title: "Radical Transparency", description: "Clear hourly pricing, straightforward advice, and measurable objectives. No hidden fees or inflated scope." },
  { title: "Operator-Led Guidance", description: "Every advisor on ConnectXpert has real operational experience in their discipline, not theoretical slide decks." },
  { title: "Client First & Zero Lock-In", description: "Book when you need guidance, pause when you don't. Your operational freedom is paramount." },
  { title: "Data-Backed Rigor", description: "All strategic recommendations are rooted in real telemetry, unit economics, and proven frameworks." },
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
              Our Mission
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient leading-tight sm:text-6xl">
              High-impact advisory for ambitious teams.
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              ConnectXpert was established to eliminate the friction, bloat, and retainers of traditional consulting.
              We connect founders and team leaders directly with vetted domain experts for actionable, one-on-one working sessions.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-border py-12">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
              {stats.map(({ value, label, source }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center px-3">
                  <span className="text-4xl font-semibold text-gradient sm:text-5xl">{value}</span>
                  <span className="text-sm font-medium text-foreground/90">{label}</span>
                  <span className="text-[11px] text-muted-foreground/60">{source}</span>
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
