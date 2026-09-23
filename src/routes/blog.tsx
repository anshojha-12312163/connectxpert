import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Calendar, Clock, ArrowRight, Sparkles, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Intelligence — ConnectXpert & Ansh Consultancy" },
      { name: "description", content: "Business growth frameworks, operator playbooks, and cloud scaling strategies from ConnectXpert & Ansh Consultancy specialists." },
    ],
  }),
  component: BlogPage,
});

const categories = ["All", "Strategy", "Growth", "Hiring", "Tech", "Market Insights"];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  image?: string;
}

export const posts: BlogPost[] = [
  {
    slug: "triple-inbound-leads-90-days",
    title: "How to Triple Your Inbound Leads in 90 Days (Without Paid Ads)",
    excerpt: "The systematic approach we use to help B2B businesses build a sustainable inbound engine — ICP definition, content architecture, and conversion optimisation.",
    category: "Growth",
    date: "Sep 12, 2026",
    readTime: "7 min read",
    author: "Ansh Ojha",
    featured: true,
  },
  {
    slug: "hiring-first-10-engineers",
    title: "The Playbook for Hiring Your First 10 Engineers (and Not Regretting It)",
    excerpt: "Common hiring mistakes early-stage founders make, how to structure your technical interview process, and the offer strategies that close top engineers.",
    category: "Hiring",
    date: "Sep 04, 2026",
    readTime: "8 min read",
    author: "Mayank Pandey",
    featured: false,
  },
  {
    slug: "b2b-saas-churn-reduction",
    title: "The 5 Root Causes of B2B SaaS Churn (And How to Fix Each One)",
    excerpt: "Churn is almost never a pricing problem. After working with 50+ SaaS companies, these are the real drivers and the levers that actually move the needle.",
    category: "Strategy",
    author: "Dhiraj Gupta",
    date: "August 28, 2026",
    readTime: "10 min read",
    featured: false,
  },
  {
    slug: "market-entry-research-framework",
    title: "How to Validate a New Market in 30 Days (Our Research Framework)",
    excerpt: "Entering a new vertical without proper validation is expensive. Here's the lightweight research process we use to test new markets before committing resources.",
    category: "Market Insights",
    author: "Ansh Ojha",
    date: "August 20, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "engineering-culture-velocity",
    title: "Why Engineering Culture is Your Biggest Competitive Advantage",
    excerpt: "Companies with strong engineering culture ship 3x faster and retain engineers 2x longer. Here's what it looks like and how to build it intentionally.",
    category: "Tech",
    author: "Mayank Pandey",
    date: "August 15, 2026",
    readTime: "9 min read",
    featured: false,
  },
  {
    slug: "go-to-market-reset",
    title: "When to Blow Up Your GTM Strategy and Start Over",
    excerpt: "Sometimes incremental fixes aren't enough. The signs that your go-to-market needs a full reset — and the process for rebuilding it on a stronger foundation.",
    category: "Strategy",
    author: "Dhiraj Gupta",
    date: "August 08, 2026",
    readTime: "11 min read",
    featured: false,
  },
];

function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const featured = posts.find((p) => p.featured);
  const filtered = posts
    .filter((p) => !p.featured || category !== "All" || search)
    .filter((p) => category === "All" || p.category === category)
    .filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
      <Nav />
      <main className="pt-24 pb-16 flex-1">

        {/* Hero Section */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-emerald-600/15 blur-[150px]" />
          <div className="pointer-events-none absolute top-20 right-10 size-[350px] rounded-full bg-blue-600/10 blur-[130px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 shadow-sm shadow-emerald-950">
                <BookOpen className="size-3.5" /> Intelligence & Playbooks
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                Operator insights for <span className="text-gradient">modern scale.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
                Practical frameworks, cloud architecture breakdowns, and go-to-market strategies from verified leaders at Ansh Consultancy & ConnectXpert.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Featured Post Card (Hero Highlight) */}
          {featured && !search && category === "All" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 sm:mb-14"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="group relative block overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1424] via-[#091122] to-[#050a16] p-6 sm:p-10 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400 hover:shadow-emerald-950/40"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="lg:max-w-2xl">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                        <Sparkles className="size-3" /> Featured · {featured.category}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    
                    <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {featured.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Avatar name={featured.author} size={28} />
                        <span className="font-semibold text-slate-200">{featured.author}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-emerald-400" /> {featured.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-blue-400" /> {featured.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-start lg:justify-center">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 px-5 py-3 text-xs sm:text-sm font-bold text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-lg">
                      Read Article <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Search & Category Filter Section - Fully Responsive & Scrollable on Mobile */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search playbooks & topics..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCategory(c); setPage(1); }}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    c === category
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950"
                      : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-sm font-semibold text-slate-300">No articles matched your search.</p>
                <button
                  type="button"
                  onClick={() => { setSearch(""); setCategory("All"); setPage(1); }}
                  className="mt-3 text-xs text-emerald-400 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              paginated.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group flex flex-col justify-between h-full rounded-3xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0f172a] hover:shadow-xl hover:shadow-emerald-950/20"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="size-3 text-blue-400" /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="mt-2.5 text-xs text-slate-300/80 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Avatar name={post.author} size={22} />
                        <span className="font-medium text-slate-300 truncate max-w-[120px]">{post.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="size-3 text-emerald-400" /> {post.date}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl border text-xs font-bold transition-all",
                    p === page
                      ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
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
