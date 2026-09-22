import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { JoinRow, Marquee } from "./bits";
import { HeroDashboard } from "./hero-dashboard";
import { supabase } from "@/lib/supabase";

const sectors = [
  "B2B SaaS",
  "Fintech & Payments",
  "HealthTech",
  "E-Commerce & DTC",
  "AI & Cloud Platforms",
  "Supply Chain & Logistics",
  "Professional Services",
];

export function Hero() {
  const [expertCount, setExpertCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count, error } = await supabase
          .from("experts")
          .select("*", { count: "exact", head: true });
        if (!error && count && count > 0) {
          setExpertCount(count);
        }
      } catch {}
    }
    fetchCounts();
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] grid-lines opacity-40" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <JoinRow
          count={expertCount ? `${expertCount}+` : undefined}
          label={expertCount ? undefined : "Direct access to vetted specialists across 6 core business domains"}
        />

        <h1 className="mt-7 max-w-3xl text-5xl leading-[1.05] font-semibold text-gradient sm:text-6xl md:text-7xl">
          The all-in-one platform to sell, hire, and scale{" \u2014 "}faster.
        </h1>

        <p className="mt-6 max-w-md text-base text-muted-foreground">
          Everything you need to launch, grow, and manage your business in one place.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/book"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Book Strategy Session
          </Link>
          <Link
            to="/experts"
            className="rounded-xl border border-border bg-surface-2/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Browse Specialists
          </Link>
        </div>
      </div>

      <HeroDashboard />

      <div className="relative mt-16">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40">
          Built for high-growth teams across modern sectors
        </p>
        <Marquee
          items={sectors.map((s) => (
            <span
              key={s}
              className="text-lg font-medium text-foreground/50 sm:text-xl border border-white/[0.06] bg-surface-2/40 px-5 py-2 rounded-full backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
          itemClassName="px-3"
        />
      </div>
    </section>
  );
}
