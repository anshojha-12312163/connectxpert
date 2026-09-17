import { LineChart, ListChecks, RefreshCw, Shield, Users } from "lucide-react";
import { SectionHeading } from "./bits";

const cards = [
  {
    icon: RefreshCw,
    title: "Effortless Integration",
    desc: "Your data is synced in real-time across devices, ensuring you stay connected and informed—online or offline.",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    desc: "Enterprise-grade encryption protects your information, while flexible tools adapt to your business needs.",
  },
  {
    icon: LineChart,
    title: "Actionable Insights",
    desc: "Leverage AI-powered analytics to identify trends, predict outcomes, and optimize your workflow effortlessly.",
  },
];

const footTags = [
  { icon: LineChart, label: "Smart Analytics" },
  { icon: Users, label: "Real-Time Collaboration" },
  { icon: ListChecks, label: "Task Prioritization" },
];

export function Efficiency() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 soft-glow opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="AI-driven efficiency"
          title="Never Miss an Opportunity"
          subtitle="Capture leads, analyze trends, and centralize critical insights"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-surface rounded-3xl p-7">
              <span
                className="inline-flex size-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15"
                style={{ boxShadow: "0 0 24px -8px oklch(0.51 0.276 268 / 70%)" }}
              >
                <Icon className="size-5 text-accent" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {footTags.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-sm text-foreground/85">
                <Icon className="size-4 text-accent" />
                {label}
              </span>
              {i < footTags.length - 1 && <span className="hidden h-5 w-px bg-border sm:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
