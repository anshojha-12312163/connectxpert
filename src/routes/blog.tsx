import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Insights — ConnectXpert" },
      { name: "description", content: "Business growth insights, operator strategies, and market analysis from ConnectXpert specialists." },
    ],
  }),
  component: BlogPage,
});

const categories = ["All", "Strategy", "Growth", "Hiring", "Tech", "Market Insights"];

export const posts = [
  {
    slug: "triple-inbound-leads-90-days",
    title: "How to Triple Your Inbound Leads in 90 Days (Without Paid Ads)",
    excerpt: "The systematic approach we use to help B2B businesses build a sustainable inbound engine — ICP definition, content architecture, and conversion optimisation.",
    category: "Growth",
    date: "Sep 12, 2026",
    readTime: "7 min read",
    author: "Growth Practice Lead",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "hiring-first-10-engineers",
    title: "The Playbook for Hiring Your First 10 Engineers (and Not Regretting It)",
    excerpt: "Common hiring mistakes early-stage founders make, how to structure your technical interview process, and the offer strategies that close top engineers.",
    category: "Hiring",
    featured: false,
  },
  {
    slug: "b2b-saas-churn-reduction",
    title: "The 5 Root Causes of B2B SaaS Churn (And How to Fix Each One)",
    excerpt: "Churn is almost never a pricing problem. After working with 50+ SaaS companies, these are the real drivers and the levers that actually move the needle.",
    category: "Strategy",
    author: "Priya Kapoor",
    date: "August 28, 2026",
    readTime: "10 min read",
    featured: false,
  },
  {
    slug: "market-entry-research-framework",
    title: "How to Validate a New Market in 30 Days (Our Research Framework)",
    excerpt: "Entering a new vertical without proper validation is expensive. Here's the lightweight research process we use to test new markets before committing resources.",
    category: "Market Insights",
    author: "Ansh Sharma",
    date: "August 20, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "engineering-culture-velocity",
    title: "Why Engineering Culture is Your Biggest Competitive Advantage",
    excerpt: "Companies with strong engineering culture ship 3x faster and retain engineers 2x longer. Here's what it looks like and how to build it intentionally.",
    category: "Tech",
    author: "Rahul Mehta",
    date: "August 15, 2026",
    readTime: "9 min read",
    featured: false,
  },
  {
    slug: "go-to-market-reset",
    title: "When to Blow Up Your GTM Strategy and Start Over",
    excerpt: "Sometimes incremental fixes aren't enough. The signs that your go-to-market needs a full reset — and the process for rebuilding it on a stronger foundation.",
    category: "Strategy",
    author: "Sara Williams",
    date: "August 8, 2026",
    readTime: "11 min read",
    featured: false,
  },
];

function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const featured = posts.find((p) => p.featured);
  const filtered = posts
    .filter((p) => !p.featured || category !== "All" || search)
    .filter((p) => category === "All" || p.category === category)
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">

        {/* Header */}
        <section className="relative overflow-hidden py-16">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Insights
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient sm:text-6xl">
              The ConnectXpert Blog
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Practical frameworks, case studies, and market analysis to help you grow.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 pb-20">

          {/* Featured post */}
          {featured && !search && category === "All" && (
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="group mb-10 flex flex-col overflow-hidden rounded-3xl border border-border bg-surface-2/50 transition-all hover:border-primary/40 lg:flex-row"
            >
              <div className="flex flex-col justify-between p-8 lg:w-3/5">
                <div>
                  <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    Featured · {featured.category}
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold leading-snug group-hover:text-accent transition-colors lg:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={featured.author} size={32} />
                    <span className="text-sm">{featured.author}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{featured.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{featured.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-background lg:w-2/5 min-h-40">
                <ArrowRight className="size-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
              </div>
            </Link>
          )}

          {/* Search + filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-xl border border-border bg-surface-2/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors sm:w-72"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setPage(1); }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                    c === category
                      ? "border-primary/60 bg-primary/10 text-accent"
                      : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Posts list */}
          <div className="space-y-5">
            {paginated.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">No articles found. Try a different search.</div>
            ) : (
              paginated.map((post) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface-2/40 p-6 transition-all hover:border-primary/40 sm:flex-row sm:items-start"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{post.category}</span>
                    <h3 className="mt-1 text-base font-semibold leading-snug group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-xs text-muted-foreground sm:min-w-[140px]">
                    <div className="flex items-center gap-1.5"><Avatar name={post.author} size={20} />{post.author}</div>
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl border text-sm transition-all",
                    p === page
                      ? "border-primary/60 bg-primary/10 text-accent font-semibold"
                      : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
