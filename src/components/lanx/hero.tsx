import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { JoinRow, Marquee } from "./bits";

const brands = ["Eooks", "Opal", "Dune", "Oasis", "Asterisk", "Nova", "Kairo"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] grid-lines opacity-40" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <JoinRow count="15,725" />

        <h1 className="mt-7 max-w-3xl text-5xl leading-[1.05] font-semibold text-gradient sm:text-6xl md:text-7xl">
          The all-in-one platform to sell, hire, and scale{" \u2014 "}faster.
        </h1>

        <p className="mt-6 max-w-md text-base text-muted-foreground">
          Everything you need to launch, grow, and manage your business in one place.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#pricing"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Start Growing Free
          </a>
          <Link
            to="/login"
            className="rounded-xl border border-border bg-surface-2/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      <div className="relative mt-16">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40">
          Trusted by teams at
        </p>
        <Marquee
          items={brands.map((b) => (
            <span key={b} className="text-2xl font-semibold text-foreground/55 sm:text-3xl">
              {b}
            </span>
          ))}
          itemClassName="px-10"
        />
      </div>
      
      {/* Smooth gradient transition into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
