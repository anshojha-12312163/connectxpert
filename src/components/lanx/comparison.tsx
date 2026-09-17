import { Check, Layers, X } from "lucide-react";
import { Logo, SectionHeading } from "./bits";

const ours = [
  "Effortless global collaboration",
  "Highly scalable & flexible solutions",
  "Advanced dashboard control",
  "Built-in data-driven analytics",
  "Latest automation solutions",
];

const theirs = [
  "Limited global collaboration",
  "Rigid and non-scalable options",
  "Basic dashboard functionalities",
  "Lack of advanced analytics",
  "Outdated and complex interfaces",
];

export function Comparison() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading
          badge="Comparison"
          title="Why Ansh Consultancy Stands Out"
          subtitle="See how we compare against others in performance, growth"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-center">
              <Logo />
            </div>
            <ul className="card-surface mt-6 rounded-3xl px-6 py-2">
              {ours.map((t, i) => (
                <li
                  key={t}
                  className={`flex items-center gap-3 py-4 text-sm text-foreground/90 ${i < ours.length - 1 ? "border-b border-border" : ""}`}
                >
                  <Check className="size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <Layers className="size-5 text-muted-foreground" />
              <span className="font-display text-xl font-semibold text-foreground/80">Others</span>
            </div>
            <ul className="mt-6 rounded-3xl border border-border bg-surface/50 px-6 py-2">
              {theirs.map((t, i) => (
                <li
                  key={t}
                  className={`flex items-center gap-3 py-4 text-sm text-muted-foreground ${i < theirs.length - 1 ? "border-b border-border" : ""}`}
                >
                  <X className="size-4 shrink-0 text-destructive/80" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
