import { useEffect, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Loader2, Search, Download, X, Mail,
  ChevronLeft, ChevronRight, Check, Archive, MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/contacts")({
  component: ContactsPage,
});

type ContactStatus = "new" | "replied" | "archived";

const STATUS_TABS = ["all", "new", "replied", "archived"] as const;

const STATUS_STYLE: Record<ContactStatus, string> = {
  new:      "bg-blue-500/15   text-blue-400   border-blue-500/30",
  replied:  "bg-green-500/15  text-green-400  border-green-500/30",
  archived: "bg-white/8       text-white/35   border-white/10",
};

const PER_PAGE = 10;

function exportCSV(rows: any[]) {
  const cols = ["name","email","company","message","contact_status","created_at"];
  const header = cols.join(",");
  const lines  = rows.map((r) =>
    cols.map((c) => `"${(r[c] ?? "").toString().replace(/"/g,'""')}"`).join(","),
  );
  const blob = new Blob([header+"\n"+lines.join("\n")], { type:"text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `contacts-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── Detail panel ───────────────────────────────────────────────
function ContactPanel({ contact, onClose, onUpdate }: {
  contact: any;
  onClose: () => void;
  onUpdate: (id: string, status: ContactStatus) => void;
}) {
  const [busy, setBusy] = useState(false);

  const setStatus = async (status: ContactStatus) => {
    setBusy(true);
    await supabase.from("contacts").update({ contact_status: status }).eq("id", contact.id);
    onUpdate(contact.id, status);
    setBusy(false);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={contact.name} size={36} />
          <div>
            <p className="font-semibold text-white text-sm">{contact.name}</p>
            <p className="text-xs text-white/40">{contact.email}</p>
          </div>
        </div>
        <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white transition-colors">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {contact.company && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">Company</p>
            <p className="text-sm text-white/80">{contact.company}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">Message</p>
          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">Submitted</p>
          <p className="text-sm text-white/60">{new Date(contact.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">Status</p>
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
            STATUS_STYLE[contact.contact_status as ContactStatus] ?? STATUS_STYLE.new)}>
            {contact.contact_status ?? "new"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/[0.06] px-5 py-4 space-y-2">
        <a href={`mailto:${contact.email}?subject=Re: Your message to ConnectXpert`}
          onClick={() => setStatus("replied")}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
          style={{ background: "var(--gradient-primary)" }}>
          <Mail className="size-4" /> Reply via Email
        </a>
        <div className="flex gap-2">
          <button onClick={() => setStatus("replied")} disabled={busy || contact.contact_status === "replied"}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-green-500/30 bg-green-500/10 py-2 text-xs font-semibold text-green-400 hover:bg-green-500/20 disabled:opacity-40 transition-colors">
            <Check className="size-3.5" /> Mark Replied
          </button>
          <button onClick={() => setStatus("archived")} disabled={busy || contact.contact_status === "archived"}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/40 hover:bg-white/10 disabled:opacity-40 transition-colors">
            <Archive className="size-3.5" /> Archive
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function ContactsPage() {
  const [all,      setAll]      = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [tab,      setTab]      = useState<typeof STATUS_TABS[number]>("all");
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState<any|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setAll(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel("contacts-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contacts" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  function handleUpdate(id: string, status: ContactStatus) {
    setAll((prev) => prev.map((c) => c.id === id ? { ...c, contact_status: status } : c));
    setSelected((prev: any) => prev?.id === id ? { ...prev, contact_status: status } : prev);
  }

  const filtered = all.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.message?.toLowerCase().includes(q);
    const cStatus = c.contact_status ?? "new";
    const matchTab = tab === "all" || cStatus === tab;
    return matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? all.length : all.filter((c) => (c.contact_status ?? "new") === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5 h-full">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>
          <p className="mt-1 text-sm text-white/40">{all.length} total messages from the contact form</p>
        </div>
        <button onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold capitalize transition-all",
              tab === t ? "border-blue-500/40 bg-blue-500/15 text-blue-400" : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70",
            )}>
            {t}
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              tab === t ? "bg-blue-500/30 text-blue-300" : "bg-white/10 text-white/30")}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, company, message..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/40 transition-colors" />
        </div>
        {search && (
          <button onClick={() => { setSearch(""); setPage(1); }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/40 hover:text-white transition-colors">
            <X className="size-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table + detail panel */}
      <div className={cn("grid gap-4", selected ? "lg:grid-cols-[1fr_380px]" : "")}>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-white/30" /></div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <MessageSquare className="size-8 text-white/10" />
              <p className="text-sm text-white/30">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/[0.06]" style={{ background: "#0d1117" }}>
                  <tr>
                    {["Name","Email","Company","Message","Date","Status","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/35 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {paginated.map((c) => {
                    const cStatus: ContactStatus = c.contact_status ?? "new";
                    return (
                      <tr key={c.id}
                        onClick={() => setSelected(c)}
                        className={cn("cursor-pointer transition-colors hover:bg-white/[0.03]",
                          selected?.id === c.id && "bg-blue-500/5")}>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={c.name} size={28} />
                            <span className="font-medium text-white/90 text-sm">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/50 text-xs">{c.email}</td>
                        <td className="px-4 py-3.5 text-white/50 text-xs">{c.company ?? "—"}</td>
                        <td className="px-4 py-3.5 text-white/50 text-xs max-w-[200px]">
                          <p className="truncate">{c.message}</p>
                        </td>
                        <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                            STATUS_STYLE[cStatus])}>
                            {cStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <a href={`mailto:${c.email}?subject=Re: Your message to ConnectXpert`}
                              onClick={async () => { await supabase.from("contacts").update({ contact_status:"replied" }).eq("id", c.id); handleUpdate(c.id, "replied"); }}
                              className="rounded-lg bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-[10px] font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors whitespace-nowrap">
                              Reply
                            </a>
                            {cStatus !== "archived" && (
                              <button
                                onClick={async (e) => { e.stopPropagation(); await supabase.from("contacts").update({ contact_status:"archived" }).eq("id", c.id); handleUpdate(c.id, "archived"); }}
                                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/35 hover:bg-white/10 transition-colors">
                                Archive
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <ContactPanel
            contact={selected}
            onClose={() => setSelected(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1,p-1))} disabled={page===1}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({length:totalPages},(_,i)=>i+1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={cn("flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                  page===p ? "bg-blue-500 text-white" : "border border-white/10 text-white/40 hover:text-white")}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
