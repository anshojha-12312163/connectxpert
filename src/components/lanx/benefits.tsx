import { Cog, DollarSign, Headphones, LineChart, Lock, Repeat } from "lucide-react";
import { Marquee, Pill, SectionHeading } from "./bits";

const benefits = [
  {
    icon: DollarSign,
    title: "Instant Savings",
    desc: "Get immediate savings on every purchase, powered by AI to optimize your transactions.",
  },
  {
    icon: LineChart,
    title: "Real-Time Insights",
    desc: "Make smarter decisions with live data and actionable insights, delivered in real-time to stay ahead of the curve",
  },
  {
    icon: Repeat,
    title: "Flexible Plans",
    desc: "Choose plans that adapt to your business needs, offering unparalleled scalability and cost-effectiveness",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    desc: "Prioritize safety with cutting-edge encryption and robust security features for every interaction",
  },
  {
    icon: Cog,
    title: "Adaptive Systems",
    desc: "Leverage AI-driven systems that evolve with your business, ensuring efficiency and innovation at every step",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Access expert assistance 24/7 to ensure you’re never alone on your growth journey",
  },
];

const rowOne = [
  "Instant Savings",
  "Flexible Payments",
  "Intelligent Spending",
  "Customizable Plans",
  "Smart Insights",
  "Real-Time Automation",
];
const rowTwo = [
  "Real-Time Reports",
  "Custom AI Plans",
  "Dedicated Support",
  "Growth With AI",
  "Predictive Modeling",
  "Live Dashboards",
];

export function Benefits() {
  return (
    <section id="benefits" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 soft-glow opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Benefits"
          title="Why Choose Us?"
          subtitle="Innovative tools and powerful insights designed to elevate your business"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
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

        <div className="mt-14 space-y-4">
          <Marquee items={rowOne.map((t) => <Pill key={t}>{t}</Pill>)} itemClassName="px-2" />
          <Marquee items={rowTwo.map((t) => <Pill key={t}>{t}</Pill>)} reverse itemClassName="px-2" />
        </div>
      </div>
    </section>
  );
}
