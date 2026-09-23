import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Share2, Sparkles, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { Avatar } from "@/components/lanx/bits";
import { posts } from "./blog";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: post ? `${post.title} — ConnectXpert & Ansh Consultancy` : "Article — ConnectXpert" },
        { name: "description", content: post ? post.excerpt : "" },
      ],
    };
  },
});

const content: Record<string, string> = {
  "triple-inbound-leads-90-days": `
Building a predictable inbound pipeline is one of the highest-leverage initiatives an enterprise or fast-growing B2B company can execute. Unlike ephemeral paid ads that stop the moment ad spend pauses, a well-engineered inbound machine compounds quarter over quarter.

Here is the exact operator framework we execute at Ansh Consultancy & ConnectXpert to reliably triple qualified inbound pipeline in 90 days.

**Phase 1: Deep ICP Calibration & Intent Mapping (Weeks 1–2)**

Most business leaders think they have a precise Ideal Customer Profile. In practice, 80% are overly broad. Begin by auditing your historical top 20% highest LTV accounts — the clients who closed within 14 days, expanded seat count, and had near-zero onboarding friction.

Identify underlying operational patterns:
- Tech stack maturity and current tooling bottlenecks
- Executive job titles with true purchasing and signature authority
- Exact triggers: funding round, compliance deadline, cloud migration milestone, or leadership turnover

**Phase 2: High-Intent Content Architecture (Weeks 2–6)**

Structure your inbound funnel across three strategic layers:
- **Top of Funnel (Problem-Aware):** High-level architectural teardowns, technical benchmark reports, and executive summaries.
- **Middle of Funnel (Solution-Aware):** Migration blueprints, unit economics calculators, and technical comparisons.
- **Bottom of Funnel (Decision-Stage):** 1-on-1 strategy audit offers, ROI models, and milestone roadmaps.

**Phase 3: Conversion Optimization & Zero-Friction Handshakes (Weeks 4–8)**

Traffic without direct conversion mechanisms is vanity telemetry. Audit conversion surfaces:
- Ensure single-click booking calendar availability
- Eliminate multi-page qualification questionnaires in favor of progressive discovery
- Establish guaranteed under-4-hour response SLAs on enterprise requests

**Phase 4: Multi-Channel Syndication & Operator Amplification (Ongoing)**

Distribute actionable insights where decision-makers actively research: executive newsletters, technical publications, and direct specialist networks.
  `,
  "hiring-first-10-engineers": `
Your first 10 engineering hires define the technical velocity, system resilience, and engineering culture of your company for the next 5 years. A single misaligned hire at this stage creates architectural drag that costs quarters to fix.

Here is the playbook for identifying, testing, and closing foundational engineers.

**1. Hire for Systems Thinking Over Syntax Memorization**

Early-stage environments require engineers who understand trade-offs: speed to market vs. technical debt, monolithic simplicity vs. distributed complexity. Avoid generic leetcode questions; instead, review real pull requests or design a mini service architecture live.

**2. The 3 Pillars of an Unbeatable Offer**

Top operators are rarely looking at job boards. Winning them requires:
- **High Autonomy:** Direct ownership of core subsystems without bureaucratic committee approvals.
- **Transparent Equity & Upside:** Clear valuation models and upside projections.
- **Direct Mission Alignment:** Opportunity to work directly alongside experienced principals.

**3. Build Async Collaboration Muscle Early**

Document technical design docs (RFCs) before writing code. This creates a repeatable standard as your team expands from 10 to 50 engineers.
  `,
  "b2b-saas-churn-reduction": `
Customer churn is almost never purely a pricing issue. After analyzing retention mechanics across dozens of enterprise software platforms, the root causes consistently trace back to onboarding friction, value realization latency, and disjointed customer success.

**1. Time-to-Value (TTV) Compression**

If a customer does not experience their core "aha!" milestone within the first 72 hours of contract execution, the probability of renewal drops by over 60%. Build automated telemetry triggers that alert your team when key features remain untouched during Week 1.

**2. Shift from Reactive Support to Proactive Health Scoring**

Monitor user activity degradation weeks before contract expiration. Flag accounts experiencing leadership turnover or sharp decreases in daily active seats.

**3. Executive Alignment Reviews**

Conduct quarterly strategic reviews focused on client ROI metrics rather than product feature walk-throughs.
  `,
  "market-entry-research-framework": `
Entering a new geographic or vertical market without rigorous validation drains capital quickly. Our 30-day lightweight validation sprint allows teams to de-risk expansion before committing sales and product resources.

**Week 1: Competitor Telemetry & Regulatory Mapping**

Map local incumbent pricing models, contract terms, and compliance mandates. Identify underserved segments being neglected by legacy providers.

**Week 2: 20 Cold Executive Discovery Interviews**

Speak directly with potential buyers. Probe their existing vendor frustrations without pitching your solution.

**Week 3: Low-Fidelity Smoke Test**

Launch targeted landing pages and measure direct sign-up and inquiry conversion velocity.

**Week 4: Unit Economics & Go/No-Go Decision**

Synthesize customer acquisition cost (CAC) benchmarks against projected annual contract value (ACV).
  `,
  "engineering-culture-velocity": `
Engineering velocity is not about typing faster or working 80-hour weeks. High-velocity teams ship faster because they eliminate cognitive load, reduce review latency, and automate verification pipelines.

**1. Continuous Deployment as a Cultural Standard**

Teams that deploy multiple times per day have smaller, safer diffs and dramatically lower rollback rates.

**2. Blameless Post-Mortems**

When outages occur, focus exclusively on systemic improvements and guardrails rather than individual blame.

**3. Clear RFC & Technical Documentation Standards**

Empower engineers to propose and debate architecture openly before committing to implementation sprints.
  `,
  "go-to-market-reset": `
When customer acquisition costs surge and pipeline momentum stalls, continuing incremental marketing tweaks is a trap. A structured GTM reset realigns your product value proposition with high-margin buyers.

**1. Recognize the Warning Signs**

- Win rates falling below 20% on qualified opportunities
- Sales cycles extending beyond 90 days without increased contract value
- Heavy discounting required to close deals

**2. Rebuilding the Narrative**

Shift your positioning from a nice-to-have feature suite to a mission-critical business outcome driver.

**3. Align Sales, Product, and Marketing OKRs**

Ensure all teams are incentivized by verified revenue delivery rather than disconnected vanity metrics.
  `,
};

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw notFound();

  const body = content[slug] ?? post.excerpt;
  const related = posts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
      <Nav />
      <main className="pt-24 pb-16 flex-1">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">
          
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-8"
          >
            <ArrowLeft className="size-4" /> Back to All Articles
          </Link>

          {/* Category Pill */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="size-3" /> {post.category}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug">
            {post.title}
          </h1>

          {/* Author & Timestamp Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-y border-white/10 py-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2.5">
              <Avatar name={post.author} size={30} />
              <span className="font-semibold text-white">{post.author}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-emerald-400" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-blue-400" /> {post.readTime}
            </span>
          </div>

          {/* Article Content */}
          <div className="mt-8 space-y-5 text-slate-200 text-sm sm:text-base leading-relaxed">
            {body.trim().split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 sm:mt-10 text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 border-l-2 border-emerald-500 pl-3"
                  >
                    {para.replace(/\*\*/g, "")}
                  </h2>
                );
              }
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="my-4 space-y-2 list-none pl-1">
                    {para.split("\n").map((line, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                        </span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>"),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={i}
                  className="text-xs sm:text-sm md:text-base text-slate-300/90 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>"),
                  }}
                />
              );
            })}
          </div>

          {/* Advisory Call-to-Action Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1424] via-[#091122] to-[#040814] p-6 sm:p-10 text-center shadow-2xl shadow-emerald-950/30 backdrop-blur-xl"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="size-3.5" /> Execution Support
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Ready to execute this playbook in your business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Book a 1-on-1 strategy consultation with Ansh Ojha and the ConnectXpert team to audit your current architecture and build a tailored 90-day roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Schedule Strategy Call
              </Link>
              <Link
                to="/book"
                className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
              >
                Explore Specialists
              </Link>
            </div>
          </motion.div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-14 pt-10 border-t border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Related Articles</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1220]/70 p-5 transition-all hover:border-emerald-500/40 hover:bg-[#0e1628]"
                  >
                    <div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {p.category}
                      </span>
                      <h4 className="mt-2 text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {p.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{p.excerpt}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                      <span>{p.author}</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        Read <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>
      <Footer />
    </div>
  );
}
