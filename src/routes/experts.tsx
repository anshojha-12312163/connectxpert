import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { SectionHeading } from "@/components/lanx/bits";
import { supabase, SEED_EXPERTS, type ExpertRow, type CategoryRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "Find Experts — ConnectXpert" },
      { name: "description", content: "Browse verified consultants and experts. Filter by category, price, rating and availability." },
    ],
  }),
  component: ExpertsPage,
});

const SORT_OPTIONS = [
  { value: "rating",    label: "Top Rated" },
  { value: "bookings",  label: "Most Booked" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "newest",    label: "Newest" },
];

const PRICE_RANGES = [
  { label: "Under $50/hr",   min: 0,   max: 50  },
  { label: "$50–100/hr",     min: 50,  max: 100 },
  { label: "$100–200/hr",    min: 100, max: 200 },
  { label: "$200+/hr",       min: 200, max: 9999 },
];

const PER_PAGE = 9;

// Skeleton card
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] p-5 animate-pulse" style={{ background: "#131824" }}>
      <div className="mb-4 size-14 rounded-full bg-white/8" />
      <div className="h-4 w-3/4 rounded bg-white/8 mb-2" />
      <div className="h-3 w-1/2 rounded bg-white/5 mb-4" />
      <div className="flex gap-2 mb-4">
        {[1,2,3].map(i => <div key={i} className="h-5 w-16 rounded-full bg-white/5" />)}
      </div>
      <div className="h-9 w-full rounded-xl bg-white/5" />
    </div>
  );
}

function ExpertsPage() {
  const [experts,    setExperts]    = useState<ExpertRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [favorites,  setFavorites]  = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [search,     setSearch]    = useState("");
  const [catFilter,  setCatFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [minRating,  setMinRating] = useState(0);
  const [availOnly,  setAvailOnly] = useState(false);
  const [sortBy,     setSortBy]    = useState("rating");
  const [page,       setPage]      = useState(1);
  const [qcExpertId, setQcExpertId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [expRes, catRes] = await Promise.all([
        supabase.from("experts").select("*").eq("status", "active"),
        supabase.from("categories").select("*"),
      ]);

      // Fall back to seed data if DB empty
      const expertData = (expRes.data && expRes.data.length > 0)
        ? expRes.data as ExpertRow[]
        : SEED_EXPERTS.map((e, i) => ({ ...e, id: `seed-${i}` } as ExpertRow));

      const DEFAULT_CATEGORIES: CategoryRow[] = [
        { id: "business", name: "Business Strategy", icon: "TrendingUp", description: "Market entry, scale, and strategic planning", slug: "business" },
        { id: "tech", name: "Technology & Cloud", icon: "Code", description: "Architecture, engineering, and DevOps", slug: "tech" },
        { id: "marketing", name: "Growth Marketing", icon: "Zap", description: "SEO, paid performance, and conversion", slug: "marketing" },
        { id: "legal", name: "Corporate Legal", icon: "Shield", description: "Contracts, fundraising, IP, and compliance", slug: "legal" },
        { id: "design", name: "Product & UI/UX", icon: "Palette", description: "Design systems, user research, and branding", slug: "design" },
        { id: "finance", name: "Finance & CFO", icon: "DollarSign", description: "Modeling, fundraising, and cap tables", slug: "finance" },
      ];

      setExperts(expertData);
      setCategories((catRes.data && catRes.data.length > 0) ? (catRes.data as CategoryRow[]) : DEFAULT_CATEGORIES);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...experts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (catFilter !== "all") list = list.filter(e => e.category_id === catFilter);
    if (priceRange !== null && PRICE_RANGES[priceRange]) {
      const r = PRICE_RANGES[priceRange];
      if (r) {
        list = list.filter(e => e.hourly_rate >= r.min && e.hourly_rate <= r.max);
      }
    }
    if (minRating > 0) list = list.filter(e => e.average_rating >= minRating);
    if (availOnly) {
      list = list.filter(e => {
        if (!e.last_active_at) return false;
        const diff = (Date.now() - new Date(e.last_active_at).getTime()) / 60000;
        return diff < 30;
      });
    }
    // Sort
    switch (sortBy) {
      case "rating":     list.sort((a,b) => b.average_rating - a.average_rating); break;
      case "bookings":   list.sort((a,b) => b.total_bookings - a.total_bookings); break;
      case "price_asc":  list.sort((a,b) => a.hourly_rate - b.hourly_rate); break;
      case "price_desc": list.sort((a,b) => b.hourly_rate - a.hourly_rate); break;
      case "newest":     list.sort((a,b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()); break;
    }
    return list;
  }, [experts, search, catFilter, priceRange, minRating, availOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  function toggleFav(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const activeFilters = [
    catFilter !== "all" && categories.find(c => c.id === catFilter)?.name,
    priceRange !== null && PRICE_RANGES[priceRange]?.label,
    minRating > 0 && `${minRating}+ stars`,
    availOnly && "Available now",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <Nav />
      <main className="pt-24 pb-20">

        {/* Header */}
        <section className="relative overflow-hidden py-14">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
              Expert Directory
            </span>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
              Find your perfect expert
            </h1>
            <p className="mt-3 text-base text-white/45">
              {experts.length}+ verified consultants across 6 categories.
            </p>

            {/* Search bar */}
            <div className="relative mt-8 mx-auto max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, skill, or expertise..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/40 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Not sure? */}
            <p className="mt-4 text-sm text-white/30">
              Not sure who to pick?{" "}
              <Link to="/find-my-expert" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Take our matching quiz →
              </Link>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5">
          <div className="flex gap-8">

            {/* Sidebar filters — desktop */}
            <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-6">
              {/* Category */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/35">Category</p>
                <div className="space-y-1">
                  <button onClick={() => { setCatFilter("all"); setPage(1); }}
                    className={cn("w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      catFilter === "all" ? "bg-blue-500/15 text-blue-400 font-semibold" : "text-white/55 hover:bg-white/5 hover:text-white")}>
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => { setCatFilter(c.id); setPage(1); }}
                      className={cn("w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        catFilter === c.id ? "bg-blue-500/15 text-blue-400 font-semibold" : "text-white/55 hover:bg-white/5 hover:text-white")}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/35">Price Range</p>
                <div className="space-y-1">
                  <button onClick={() => { setPriceRange(null); setPage(1); }}
                    className={cn("w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      priceRange === null ? "bg-blue-500/15 text-blue-400 font-semibold" : "text-white/55 hover:bg-white/5 hover:text-white")}>
                    Any Price
                  </button>
                  {PRICE_RANGES.map((r,i) => (
                    <button key={i} onClick={() => { setPriceRange(i); setPage(1); }}
                      className={cn("w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        priceRange === i ? "bg-blue-500/15 text-blue-400 font-semibold" : "text-white/55 hover:bg-white/5 hover:text-white")}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/35">Min Rating</p>
                <div className="flex gap-1.5 flex-wrap">
                  {[0,4,4.5,4.8].map(r => (
                    <button key={r} onClick={() => { setMinRating(r); setPage(1); }}
                      className={cn("rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                        minRating === r ? "border-blue-500/40 bg-blue-500/15 text-blue-400" : "border-white/8 text-white/40 hover:text-white")}>
                      {r === 0 ? "Any" : `${r}+★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { setAvailOnly(v => !v); setPage(1); }}
                  className={cn("relative h-5 w-9 rounded-full transition-colors cursor-pointer",
                    availOnly ? "bg-blue-500" : "bg-white/15")}
                >
                  <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-transform",
                    availOnly ? "translate-x-4" : "translate-x-0.5")} />
                </div>
                <span className="text-sm text-white/60">Available this week</span>
              </label>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-white/40">
                    <span className="font-semibold text-white">{filtered.length}</span> experts found
                  </p>
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setFiltersOpen(v => !v)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:text-white transition-colors lg:hidden"
                  >
                    <SlidersHorizontal className="size-3.5" /> Filters
                    {activeFilters.length > 0 && (
                      <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] text-white">{activeFilters.length}</span>
                    )}
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1); }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 outline-none focus:border-blue-500/40 transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#131824]">{o.label}</option>)}
                </select>
              </div>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {activeFilters.map(f => (
                    <span key={f} className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      {f}
                      <button onClick={() => {
                        if (f === "Available now") setAvailOnly(false);
                        else if (f.includes("star")) setMinRating(0);
                        else if (f.includes("/hr") || f.includes("$")) setPriceRange(null);
                        else setCatFilter("all");
                        setPage(1);
                      }}>
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  <button onClick={() => { setCatFilter("all"); setPriceRange(null); setMinRating(0); setAvailOnly(false); setPage(1); }}
                    className="text-xs text-white/30 hover:text-white transition-colors">
                    Clear all
                  </button>
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({length: 6}).map((_,i) => <SkeletonCard key={i} />)}
                </div>
              ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="text-5xl">🔍</div>
                  <p className="text-lg font-semibold text-white">No experts found</p>
                  <p className="text-sm text-white/40">Try adjusting your filters or search terms</p>
                  <button onClick={() => { setSearch(""); setCatFilter("all"); setPriceRange(null); setMinRating(0); setAvailOnly(false); }}
                    className="mt-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:text-white transition-colors">
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map(e => (
                    <ExpertCard
                      key={e.id}
                      expert={e}
                      isFavorited={favorites.has(e.id)}
                      onToggleFavorite={toggleFav}
                      onQuickConnect={(id) => setQcExpertId(id)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                    className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                    <ChevronLeft className="size-4" />
                  </button>
                  {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn("flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                        page===p ? "bg-blue-500 text-white" : "border border-white/10 text-white/40 hover:text-white")}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                    className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
