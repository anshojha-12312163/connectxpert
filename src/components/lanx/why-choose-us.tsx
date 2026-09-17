import { Award, TrendingUp, HeadphonesIcon, Puzzle } from "lucide-react";
import { SectionHeading } from "./bits";

const points = [
  {
    icon: Award,
    title: "10+ Years of Experience",
    description:
      "Proven track record across industries — from early-stage startups to established enterprises. We know what works.",
  },
  {
    icon: TrendingUp,
    title: "Results-Driven Approach",
    description:
      "Every engagement is tied to measurable outcomes. No vague deliverables — just clear metrics and accountable timelines.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description:
      "A real consultant available when you need them, not a ticket queue. We're your strategic partner, not a vendor.",
  },
  {
    icon: Puzzle,
    title: "Custom Solutions",
    description:
      "We build strategies around your business, not templates. Every recommendation is tailored to your goals and constraints.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-20">
      <div className="pointer-events-none absolute inset-0 soft-glow" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Why Us"
          title="Built for businesses that want to grow"
          subtitle="We combine deep expertise, honest communication, and a bias for action — so you get results, not reports."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-surface-2/50 p-7 transition-all duration-300 hover:border-primary/40 hover:bg-surface-2/80"
            >
              <span
                className="flex size-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 transition-colors group-hover:border-primary/60 group-hover:bg-primary/20"
              >
                <Icon className="size-5 text-accent" strokeWidth={1.5} />
              </span>
              <h3 className="text-base font-semibold leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
