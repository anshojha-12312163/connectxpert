import { BarChart2, Lightbulb, Users } from "lucide-react";
import { SectionHeading } from "./bits";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: BarChart2,
    title: "Boost Sales",
    description:
      "Turn more visitors into paying customers with built-in conversion tools and analytics.",
  },
  {
    icon: Users,
    title: "Hire the Best People",
    description:
      "Access a curated talent pool and streamline your hiring process end to end.",
  },
  {
    icon: Lightbulb,
    title: "Market Insights",
    description:
      "Get real-time data and exclusive insights to make faster, smarter business decisions.",
  },
];

export function Features() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        badge="Features"
        title="Everything you need to grow"
        subtitle="Powerful tools built to help you sell more, hire smarter, and make better decisions."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className={cn(
              "group relative rounded-3xl border border-border bg-surface-2/60 p-8",
              "transition-all duration-300",
              "hover:border-primary/40 hover:bg-surface-2/90",
              "hover:shadow-[0_0_32px_-8px_oklch(0.51_0.276_268_/_35%)]",
            )}
          >
            <span
              className="flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 transition-colors group-hover:border-primary/60 group-hover:bg-primary/20"
              style={{ boxShadow: "0 0 20px -8px oklch(0.51 0.276 268 / 60%)" }}
            >
              <Icon className="size-5 text-accent" strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
