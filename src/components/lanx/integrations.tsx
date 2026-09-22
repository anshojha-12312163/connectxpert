import { Cloud, Database, Bot, Calendar } from "lucide-react";
import { Logo, SectionHeading } from "./bits";

const nodes = [
  { icon: Cloud, desc: "Salesforce CRM: Bidirectional sync of client bookings, deal stages, and advisory notes." },
  { icon: Database, desc: "TCS Enterprise Hub: Secure data pipelines, BaNCS banking bridges, and enterprise telemetry." },
  { icon: Bot, desc: "AI Assistant & RAG: Fine-tuned LLM copilots to summarize transcripts and draft action items." },
  { icon: Calendar, desc: "Google & Zoom: Auto-generated HD video rooms with instant multi-timezone calendar booking." },
];

export function Integrations() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 soft-glow opacity-80" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-5">
        <SectionHeading
          badge="Integrations"
          title="Seamless Integrations"
          subtitle="Connect with your favorite tools to streamline workflows"
        />

        <div className="relative mt-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-border" aria-hidden />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 -z-10 rounded-full bg-primary/30 pulse-ring" aria-hidden />
            <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/50 bg-background">
              <Logo size="sm" className="[&>span:last-child]:hidden" />
            </span>
          </div>

          <div className="grid gap-14 sm:grid-cols-2">
            {nodes.map(({ icon: Icon, desc }, i) => (
              <div
                key={desc}
                className={`flex flex-col items-center gap-4 text-center ${i > 1 ? "sm:pt-20" : "sm:pb-20"}`}
              >
                <span
                  className="flex size-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/12"
                  style={{ boxShadow: "0 0 26px -10px oklch(0.51 0.276 268 / 80%)" }}
                >
                  <Icon className="size-5 text-accent" />
                </span>
                <p className="max-w-[15rem] text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
