import { SectionBadge } from "./bits";
import { GlowButton } from "./glow-button";

export function Cta() {
  return (
    <section id="contact" className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 soft-glow opacity-80" aria-hidden />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center">
        <SectionBadge>What you still waiting for</SectionBadge>
        <h2 className="mt-6 text-4xl font-semibold text-gradient sm:text-5xl">Grow Now with Ansh Consultancy</h2>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          Unlock the power of data to drive smarter decisions and faster growth with our platform.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GlowButton href="#pricing">
            Get Started Now
          </GlowButton>
          <a
            href="mailto:anshconsultancy@mail.com"
            className="rounded-xl border border-border bg-surface-2/70 px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            Book a Demo
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl px-5">
        <div
          className="overflow-hidden rounded-3xl border border-primary/30"
          style={{ boxShadow: "var(--shadow-glow)", perspective: "1200px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop"
            alt="Ansh Consultancy team collaborating in a modern office"
            width={1600}
            height={912}
            loading="lazy"
            className="w-full h-auto object-cover opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
          aria-hidden
        />
      </div>
    </section>
  );
}
