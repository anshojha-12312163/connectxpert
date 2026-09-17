import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
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
        { title: post ? `${post.title} — Ansh Consultancy` : "Blog Post" },
        { name: "description", content: post ? post.excerpt : "" },
      ],
    };
  },
});

// Extended content map
const content: Record<string, string> = {
  "triple-inbound-leads-90-days": `
Building a predictable inbound pipeline is one of the highest-leverage things a B2B company can do. Unlike paid ads, a well-built inbound engine compounds over time — each piece of content, each optimised page, each strategic partnership feeds the next.

Here's the exact framework we use with clients to triple inbound in 90 days.

**Phase 1: Define Your ICP (Weeks 1–2)**

Most companies think they know their ideal customer. Most are wrong. Start by analysing your top 20% of customers — the ones who close fastest, pay the most, and refer others. Find the patterns: industry, company size, job title, pain point language.

Once you have a sharp ICP, everything else gets easier. Your content resonates, your SEO targets the right terms, and your sales team stops wasting time on bad-fit prospects.

**Phase 2: Content Architecture (Weeks 2–6)**

Build a content engine around three layers:
- **Top of funnel:** Problem-aware content (blog posts, LinkedIn, short-form video)
- **Middle of funnel:** Solution-aware content (case studies, comparison guides, webinars)
- **Bottom of funnel:** Decision-stage content (ROI calculators, free audits, demo offers)

Each piece links to the next. The goal is to move someone from awareness to intent without needing a sales call for every conversion.

**Phase 3: Conversion Optimisation (Weeks 4–8)**

Traffic without conversion is just vanity. We run structured CRO audits on every landing page: headline clarity, social proof placement, CTA copy, form friction. Small changes here compound dramatically.

**Phase 4: Distribution (Ongoing)**

The best content in the world doesn't work if nobody sees it. Build a distribution flywheel: organic SEO, email to existing list, LinkedIn syndication, community posting, strategic partnerships.

The companies that triple their inbound don't just create more content — they create smarter content, distribute it relentlessly, and convert it efficiently.
  `,
};

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw notFound();

  const body = content[slug] ?? post.excerpt;
  const related = posts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <article className="mx-auto max-w-3xl px-5 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" /> Back to Blog
          </Link>

          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
            {post.category}
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-gradient leading-snug sm:text-5xl">{post.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Avatar name={post.author} size={28} />{post.author}</div>
            <span className="flex items-center gap-1.5"><Calendar className="size-3.5" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{post.readTime}</span>
          </div>

          <div className="mt-8 prose prose-invert prose-sm max-w-none">
            {body.trim().split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h2 key={i} className="mt-8 text-xl font-semibold text-foreground">{para.replace(/\*\*/g, "")}</h2>;
              }
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="mt-3 space-y-1.5 list-none">
                    {para.split("\n").map((line, j) => (
                      <li key={j} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />;
            })}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-3xl border border-border bg-surface-2/50 p-8 text-center">
            <p className="text-lg font-semibold mb-2">Want help implementing this?</p>
            <p className="text-sm text-muted-foreground mb-6">Book a free consultation and we'll walk through how this applies to your business specifically.</p>
            <Link
              to="/contact"
              className="inline-flex rounded-xl px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Book a Free Call
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 text-lg font-semibold">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group rounded-2xl border border-border bg-surface-2/40 p-5 transition-all hover:border-primary/40"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{p.category}</span>
                    <h3 className="mt-1 text-sm font-semibold group-hover:text-accent transition-colors leading-snug">{p.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
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
