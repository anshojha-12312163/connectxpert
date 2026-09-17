import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCheck, Plus, Star, BadgeCheck, ExternalLink, Search, Loader2 } from "lucide-react";
import { supabase, SEED_EXPERTS, type ExpertRow } from "@/lib/supabase";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/experts-list")({
  component: ExpertsListPage,
});

const STATUS_STYLE: Record<string, string> = {
  active:    "bg-green-500/15 text-green-400 border-green-500/25",
  inactive:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  suspended: "bg-red-500/15 text-red-400 border-red-500/25",
};

function ExpertsListPage() {
  const [experts,  setExperts]  = useState<ExpertRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    supabase.from("experts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = data && data.length > 0
          ? data as ExpertRow[]
          : SEED_EXPERTS.map((e, i) => ({ ...e, id: `seed-${i}` } as ExpertRow));
        setExperts(list);
        setLoading(false);
      });
  }, []);

  const filtered = experts.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleStatus(id: string, current: string) {
    const next = current === "active" ? "suspended" : "active";
    await supabase.from("experts").update({ status: next }).eq("id", id);
    setExperts(prev => prev.map(e => e.id === id ? { ...e, status: next as any } : e));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Experts</h1>
          <p className="mt-1 text-sm text-white/40">{experts.length} experts on the platform</p>
        </div>
        <Link to="/become-an-expert"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="size-4" /> Add Expert
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or title..."
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/40 transition-colors" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-white/30" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <UserCheck className="size-8 text-white/10" />
            <p className="text-sm text-white/30">No experts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]" style={{ background: "#0d1117" }}>
                <tr>
                  {["Expert", "Category", "Rate", "Rating", "Sessions", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={e.name} src={e.photo_url} size={36} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-white/90">{e.name}</p>
                            {e.is_verified && <BadgeCheck className="size-3.5 text-blue-400" />}
                          </div>
                          <p className="text-xs text-white/35">{e.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/50 capitalize">{e.category_id}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-white">${e.hourly_rate}/hr</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-white/80">{e.average_rating.toFixed(1)}</span>
                        <span className="text-xs text-white/30">({e.review_count})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white/60">{e.total_bookings}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize", STATUS_STYLE[e.status] ?? "bg-white/8 text-white/40 border-white/10")}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link to="/experts/$id" params={{ id: e.id }}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <button onClick={() => toggleStatus(e.id, e.status)}
                          className={cn("rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-colors",
                            e.status === "active"
                              ? "border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : "border-green-500/25 bg-green-500/10 text-green-400 hover:bg-green-500/20")}>
                          {e.status === "active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
