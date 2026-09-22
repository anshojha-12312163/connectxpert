import { ShieldCheck, Award, BadgeCheck, Globe, Lock, Zap } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Encrypted 1-on-1 Video Sessions" },
  { icon: BadgeCheck, label: "Independently Vetted Specialists" },
  { icon: Lock, label: "Confidentiality & NDA Protection" },
  { icon: Zap, label: "Zero Retainers or Long-Term Lock-In" },
  { icon: Globe, label: "Global Timezone Coordination" },
];

export function TrustBadges() {
  return (
    <section className="relative border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
          ConnectXpert Platform Guarantees &amp; Standards
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-full border border-border bg-surface-2/50 px-5 py-2.5 text-sm text-foreground/75 transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Icon className="size-4 text-accent shrink-0" strokeWidth={1.5} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
