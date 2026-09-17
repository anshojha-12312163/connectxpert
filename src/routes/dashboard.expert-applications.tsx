import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Check, X, Info, ChevronRight, BookOpen } from "lucide-react";
import { supabase, type ExpertApplicationRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/expert-applications")({
  component: ExpertApplicationsPage,
});

const STATUS_TABS = ["all", "pending", "approved", "rejected", "more_info"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  approved:  "bg-green-500/15  text-green-400  border-green-500/25",
  rejected:  "bg-red-500/15    text-red-400    border-red-500/25",
  more_info: "bg-blue-500/15   text-blue-400   border-blue-500/25",
};

function ExpertApplicationsPage() {
  const [apps,     setApps]     = useState<ExpertApplicationRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<typeof STATUS_TABS[number]>("all");
  const [selected, setSelected] = useState<ExpertApplicationRow | null>(null);
  const [busy,     setBusy]     = useState(false);

  useEffect(() => {
    supabase.from("expert_applications").select("*").order("submitted_at", { ascending: false })
      .then(({ data }) => { setApps(data as ExpertApplicationRow[] ?? []); setLoading(false); });
  }, []);

  async function updateStatus(id: string, status: ExpertApplicationRow["status"]) {
    setBusy(true);
    await supabase.from("expert_applications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);

    // If approved, create expert record
    if (status === "approved") {
      const app = apps.find(a => a.id === id);
      if (app) {
        await supabase.from("experts").insert({
          name: app.name, title: app.title, category_id: app.category_id,
          bio: app.bio, skills: app.skills, hourly_rate: app.hourly_rate,
          years_experience: app.years_experience, is_verified: false,
          offers_free_intro: app.offers_free_intro, intro_call_duration: 15,
          average_rating: 0, review_count: 0, total_bookings: 0, status: "active",
        });
        console.log(`📧 Welcome email → ${app.email}`);
      }
    }
    if (status === "rejected") {
      const app = apps.find(a => a.id === id);
      if (app) console.log(`📧 Rejection email → ${app.email}`);
    }
    setBusy(false);
  }

  const filtered = apps.filter(a => tab === "all" || a.status === tab);
  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? apps.length : apps.filter(a => a.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Expert Applications</h1>
        <p className="mt-1 text-sm text-white/40">Review, approve, or reject applications from prospective experts.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold capitalize transition-all",
              tab === t ? "border-blue-500/40 bg-blue-500/15 text-blue-400" : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70")}>
            {t.replace("_", " ")}
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              tab === t ? "bg-blue-500/30 text-blue-300" : "bg-white/10 text-white/30")}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      <div className={cn("grid gap-4", selected ? "lg:grid-cols-[1fr_380px]" : "")}>
        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-white/30" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <BookOpen className="size-8 text-white/10" />
              <p className="text-sm text-white/30">No {tab === "all" ? "" : tab} applications yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/[0.06]" style={{ background: "#0d1117" }}>
                  <tr>
                    {["Name","Email","Category","Rate","Status","Submitted","Actions"].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(a => (
                    <tr key={a.id} onClick={() => setSelected(a)}
                      className={cn("cursor-pointer transition-colors hover:bg-white/[0.02]", selected?.id === a.id && "bg-blue-500/5")}>
                      <td className="px-4 py-3.5 font-medium text-white/90">{a.name}</td>
                      <td className="px-4 py-3.5 text-xs text-white/50">{a.email}</td>
                      <td className="px-4 py-3.5 text-xs text-white/50 capitalize">{a.category_id}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-white">${a.hourly_rate}/hr</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize", STATUS_STYLE[a.status])}>
                          {a.status.replace("_"," ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-white/40">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3.5">
                        <ChevronRight className="size-4 text-white/25" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="rounded-2xl border border-white/[0.06] p-5 space-y-4" style={{ background: "#131824" }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">{selected.name}</h2>
                <p className="text-xs text-white/40 mt-0.5">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: "Title",       value: selected.title },
                { label: "Category",    value: selected.category_id },
                { label: "Experience",  value: `${selected.years_experience} years` },
                { label: "Rate",        value: `$${selected.hourly_rate}/hr` },
                { label: "Free Intro",  value: selected.offers_free_intro ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-xs text-white/30 uppercase tracking-wider">{label}</span>
                  <span className="text-white/75 text-right capitalize">{value}</span>
                </div>
              ))}
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Bio</p>
                <p className="text-xs text-white/60 leading-relaxed">{selected.bio}</p>
              </div>
              {selected.skills?.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map(s => (
                      <span key={s} className="rounded-full border border-blue-500/20 bg-blue-500/8 px-2.5 py-1 text-[10px] text-blue-300">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selected.status === "pending" && (
              <div className="flex gap-2 pt-2 border-t border-white/[0.05]">
                <button onClick={() => updateStatus(selected.id!, "approved")} disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/10 border border-green-500/25 py-2.5 text-xs font-semibold text-green-400 hover:bg-green-500/20 disabled:opacity-50 transition-colors">
                  {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Approve
                </button>
                <button onClick={() => updateStatus(selected.id!, "more_info")} disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-colors">
                  <Info className="size-3.5" /> More Info
                </button>
                <button onClick={() => updateStatus(selected.id!, "rejected")} disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/25 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors">
                  <X className="size-3.5" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
