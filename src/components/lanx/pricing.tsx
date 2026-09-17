import { useState } from "react";
import { Check, HandCoins } from "lucide-react";
import { SectionHeading } from "./bits";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthly: 12,
    yearly: 8,
    features: [
      "Unlimited AI usage here",
      "Premium support",
      "Customer care on point",
      "Collaboration tools",
      "Regular updates",
    ],
  },
  {
    name: "Pro",
    monthly: 17,
    yearly: 12,
    popular: true,
    features: [
      "Integrations with 3rd-party",
      "Advanced analytics",
      "Team performance tracking",
      "Top grade security",
      "Priority customer support",
      "Detailed usage reports",
    ],
  },
  {
    name: "Enterprise",
    custom: true,
    features: [
      "Dedicated account manager",
      "Custom reports & dashboards",
      "Most performance usage",
      "Tailored onboarding and training",
      "Customizable API access",
      "Dedicated success manager",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 soft-glow opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Pricing & plans"
          title="Flexible Pricing Plans"
          subtitle="Choose a plan that fits your business needs and unlock the full potential of our platform"
        />

        <div className="mt-9 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface-2/70 p-1.5">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-5 py-2 text-sm transition-colors",
                !yearly ? "bg-primary/20 font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-full px-5 py-2 text-sm transition-colors",
                yearly ? "bg-primary/20 font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              Yearly
            </button>
            <span className="rounded-full bg-primary/25 px-3 py-1.5 text-xs font-semibold text-accent">
              30% off
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "card-surface flex flex-col rounded-3xl p-7",
                plan.popular && "border-primary/50",
              )}
              style={plan.popular ? { boxShadow: "var(--shadow-glow)" } : undefined}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-base font-medium">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-end gap-2">
                {plan.custom ? (
                  <span className="text-5xl font-semibold">Custom</span>
                ) : (
                  <>
                    <span className="text-5xl font-semibold">
                      ${yearly ? plan.yearly : plan.monthly}
                    </span>
                    <span className="pb-2 text-sm text-muted-foreground">/ month</span>
                  </>
                )}
              </div>

              <a
                href="#contact"
                className={cn(
                  "mt-7 rounded-xl px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02]",
                  plan.popular
                    ? "text-primary-foreground"
                    : "border border-primary/40 bg-primary/15 text-foreground",
                )}
                style={plan.popular ? { background: "var(--gradient-primary)" } : undefined}
              >
                Get Started Now
              </a>

              <p className="mt-7 text-sm text-muted-foreground">Includes:</p>
              <ul className="mt-4 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-5 py-3 text-sm text-muted-foreground">
            <HandCoins className="size-4 text-accent" />
            Ansh Consultancy contributes 5% of subscription to the green life
          </span>
        </div>
      </div>
    </section>
  );
}
