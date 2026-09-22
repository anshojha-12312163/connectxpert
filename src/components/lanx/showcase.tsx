import type { ReactNode } from "react";
import { BadgeCheck, BarChart3, Clock, Eye, Percent, Repeat, TrendingUp, Users } from "lucide-react";
import { Avatar } from "./bits";
import { cn } from "@/lib/utils";

function Card({
  title,
  desc,
  children,
  className,
  badge,
}: {
  title: string;
  desc: string;
  children: ReactNode;
  className?: string;
  badge?: string;
}) {
  return (
    <div className={cn("card-surface relative overflow-hidden rounded-3xl p-8", className)}>
      {badge && (
        <span className="mb-4 inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{desc}</p>
      <div className="relative mt-8">{children}</div>
    </div>
  );
}

function Chip({ label, verified }: { label: string; verified?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2/90 px-3 py-2 text-sm backdrop-blur">
      <Avatar name={label} size={22} className="rounded-lg" />
      <span>{label}</span>
      {verified && <BadgeCheck className="size-4 text-gold" />}
    </div>
  );
}

function Sparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 90" className={cn("w-full", className)} aria-hidden>
      <path
        d="M4 70 C34 20, 54 74, 84 52 C114 30, 134 78, 164 60 C194 42, 220 66, 250 46 C280 26, 300 44, 316 34"
        fill="none"
        stroke="oklch(0.78 0.115 269)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/80 px-2.5 py-1.5 text-xs text-foreground/80">
      {icon}
      {label}
    </span>
  );
}

export function Showcase() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card
          title="Distinguish yourself"
          desc="Elevate your brand with a golden tick and connect with top-tier associates."
          badge="Featured Partner"
        >
          <div className="flex flex-col gap-3">
            <div className="float-slow">
              <Chip label="ConnectXpert" verified />
            </div>
            <div className="ml-10 float-slow" style={{ animationDelay: "0.8s" }}>
              <Chip label="Robinson jr" verified />
            </div>
            <div className="ml-20 float-slow" style={{ animationDelay: "1.6s" }}>
              <Chip label="Crystalio" verified />
            </div>
          </div>
        </Card>

        <Card
          title="Enterprise Insights"
          desc="Automate everything from workflow optimization to real-time sentiment analysis and market monitoring."
        >
          <div className="relative">
            <div className="rounded-2xl border border-border bg-surface/70 p-4">
              <Chip label="Your Brand" verified />
              <Sparkline className="mt-4" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:absolute sm:right-0 sm:bottom-0 sm:mt-0 sm:w-[62%] sm:translate-x-2 sm:translate-y-4">
              {[
                "Web Business",
                "E-commerce Brands",
                "SAAS Startup’s",
                "Tech Innovators",
                "Marketing Agencies",
                "Creative Studios",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2/90 px-3 py-2 text-xs text-foreground/80 backdrop-blur"
                >
                  <span className="truncate">{t}</span>
                  <TrendingUp className="size-3.5 text-accent" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Business Data Solutions"
          desc="Your data-driven guide to making informed business decisions."
          className="lg:col-span-1"
        >
          <div className="relative">
            <div className="rounded-2xl border border-border bg-surface/70 p-4">
              <p className="text-sm font-medium">See Growth</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag icon={<BarChart3 className="size-3.5" />} label="Monthly Visits" />
                <Tag icon={<Clock className="size-3.5" />} label="Last 24hrs" />
              </div>
              <Sparkline className="mt-4" />
              <div className="mt-2">
                <Chip label="ConnectXpert" verified />
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-surface-2/95 p-4 backdrop-blur sm:absolute sm:right-0 sm:bottom-6 sm:mt-0 sm:w-[70%] sm:translate-x-3">
              <p className="text-sm font-medium">See Growth</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {["100% score anytime", "Watch Stats & Growth like master", "Start Growing Now"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex size-4 items-center justify-center rounded-[4px] border border-accent/70 text-accent">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Boost Sales" desc="Convert more leads with targeted strategies and smarter tools.">
          <div className="rounded-2xl border border-border bg-surface/70 p-4">
            <div className="flex flex-wrap gap-2">
              <Tag icon={<BarChart3 className="size-3.5" />} label="Monthly Visits" />
              <Tag icon={<Clock className="size-3.5" />} label="Last 24hrs" />
              <Tag icon={<Repeat className="size-3.5" />} label="Retention" />
              <Tag icon={<Users className="size-3.5" />} label="Top Referrals" />
              <Tag icon={<Percent className="size-3.5" />} label="Conversion" />
              <Tag icon={<Eye className="size-3.5" />} label="Grow Income" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="ConnectXpert" verified />
              <Chip label="Crystal" verified />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
