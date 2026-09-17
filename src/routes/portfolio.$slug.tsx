import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { caseStudies } from "./portfolio";

export const Route = createFileRoute("/portfolio/$slug")({
  component: CaseStudyPage,
  head: ({ params }) => {
    const cs = caseStudies.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: cs ? `${cs.client} — Ansh Consultancy` : "Case Study" },
        { name: "description", content: cs ? cs.outcome : "" },
      ],
    };
  },
});

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) throw notFound();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <article className="mx-auto max-w-3xl px-5 py-16">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" /> Back to Portfolio
          </Link>

          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {cs.tag}
          </span>

          <h1 className="mt-4 text-4xl font-semibold text-gradient sm:text-5xl">{cs.client}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{cs.industry}</p>

          {/* Outcome callout */}
          <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/10 p-6">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">Outcome</p>
            <p className="text-2xl font-semibold">{cs.outcome}</p>
          </div>

          {/* Sections */}
          <div className="mt-10 space-y-8">
            {[
              { label: "The Problem", content: cs.problem },
              { label: "Our Solution", content: cs.solution },
            ].map(({ label, content }) => (
              <div key={label}>
                <h2 className="text-lg font-semibold mb-3">{label}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </div>
            ))}

            <div>
              <h2 className="text-lg font-semibold mb-3">Key Results</h2>
              <ul className="space-y-2">
                {[cs.outcome, `${cs.metrics[0]} ${cs.metrics[1]}`, "Full client satisfaction, ongoing partnership"].map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-foreground/85">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-surface-2/50 p-8 text-center">
            <p className="text-lg font-semibold mb-2">Want similar results?</p>
            <p className="text-sm text-muted-foreground mb-6">Book a free 30-minute strategy call and let's see how we can help.</p>
            <Link
              to="/contact"
              className="inline-flex rounded-xl px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Book a Free Consultation
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
