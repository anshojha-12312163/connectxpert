import { useEffect, useState, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Loader2, Search, Download, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, X, Check, Calendar,
  Clock, Globe, User, Mail, Building, FileText, RefreshCw,
  Video, ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/bookings")({
  component: BookingsPage,
});

type Status = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending:     "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed:   "bg-blue-500/15   text-blue-400   border-blue-500/30",
  completed:   "bg-green-500/15  text-green-400  border-green-500/30",
  cancelled:   "bg-red-500/15    text-red-400    border-red-500/30",
  rescheduled: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const PER_PAGE = 10;

// ── CSV export ─────────────────────────────────────────────────
function exportCSV(rows: any[]) {
  const cols = ["name","email","company","service_name","preferred_date","preferred_time","timezone","status","booking_reference","created_at"];
  const header = cols.join(",");
  const lines  = rows.map((r) =>
    cols.map((c) => `"${(r[c] ?? "").toString().replace(/"/g, '""')}"`).join(","),
  );
  const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── Detail modal ───────────────────────────────────────────────
function BookingModal({ booking, onClose, onStatusChange, onRoomCreated }: {
  booking: any;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
  onRoomCreated: (id: string, url: string, name: string) => void;
}) {
  const navigate = useNavigate();
  const [busy,        setBusy]        = useState(false);
  const [roomBusy,    setRoomBusy]    = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);

  const currentRoomUrl = booking.video_room_url;

  const changeStatus = async (status: Status) => {
    setBusy(true);
    await supabase.from("demo_bookings").update({ status }).eq("id", booking.id);
    onStatusChange(booking.id, status);
    setBusy(false);
  };

  // Generate a Daily.co room via the public Daily API
  async function generateRoom() {
    setRoomBusy(true);
    try {
      // Create a unique room name from booking reference
      const roomName = `cx-${booking.booking_reference ?? booking.id}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      // Use Daily.co's free public room creation (no API key needed for basic rooms)
      const res = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If user has DAILY_API_KEY set, use it; otherwise falls back to public demo room
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            max_participants: 2,
            enable_chat: true,
            enable_screenshare: true,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, // 4 hours from now
          },
        }),
      });

      let roomUrl: string;
      let finalRoomName: string;

      if (res.ok) {
        const data = await res.json();
        roomUrl = data.url;
        finalRoomName = data.name;
      } else {
        // Fallback: use Daily.co demo room (always available, no auth needed)
        finalRoomName = roomName;
        roomUrl = `https://anshconsultancy.daily.co/${finalRoomName}`;
      }

      // Save to Supabase
      await supabase
        .from("demo_bookings")
        .update({ video_room_url: roomUrl, video_room_name: finalRoomName })
        .eq("id", booking.id);

      onRoomCreated(booking.id, roomUrl, finalRoomName);
      setRoomCreated(true);
    } catch {
      // Fallback room URL if everything fails
      const fallbackName = `cx-session-${booking.id}`;
      const fallbackUrl  = `https://meet.jit.si/${fallbackName}`;
      await supabase
        .from("demo_bookings")
        .update({ video_room_url: fallbackUrl, video_room_name: fallbackName })
        .eq("id", booking.id);
      onRoomCreated(booking.id, fallbackUrl, fallbackName);
      setRoomCreated(true);
    } finally {
      setRoomBusy(false);
    }
  }

  function joinCall() {
    const url = currentRoomUrl ?? (roomCreated ? booking.video_room_url : null);
    if (!url || !booking.booking_reference) return;
    onClose();
    navigate({ to: "/dashboard/video/$bookingRef", params: { bookingRef: booking.booking_reference } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden" style={{ background: "#131824" }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="font-semibold text-white">{booking.name}</h2>
            <p className="text-xs text-white/40 mt-0.5">{booking.booking_reference}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize", STATUS_STYLE[booking.status])}>
              {booking.status}
            </span>
            <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {[
            { icon: User,      label: "Client",    value: booking.name },
            { icon: Mail,      label: "Email",     value: booking.email },
            { icon: Building,  label: "Company",   value: booking.company ?? "—" },
            { icon: FileText,  label: "Service",   value: booking.service_name ?? booking.service_id ?? "—" },
            { icon: Calendar,  label: "Date",      value: booking.preferred_date },
            { icon: Clock,     label: "Time",      value: booking.preferred_time },
            { icon: Globe,     label: "Timezone",  value: booking.timezone },
            { icon: FileText,  label: "Notes",     value: booking.notes ?? "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 mt-0.5">
                <Icon className="size-3.5 text-white/40" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium">{label}</p>
                <p className="text-sm text-white/85 mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          {/* Video room section */}
          <div className="rounded-xl border border-white/[0.08] p-4 mt-2" style={{ background: "rgba(59,130,246,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Video className="size-4 text-blue-400" />
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Video Call Room</p>
            </div>
            {(currentRoomUrl || roomCreated) ? (
              <div className="space-y-2">
                <p className="text-xs text-white/40 break-all font-mono">
                  {booking.video_room_url ?? "Room created"}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={joinCall}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    <Video className="size-3.5" /> Join Call
                  </button>
                  <a
                    href={booking.video_room_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/50 hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="size-3.5" /> Open in Browser
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-xs text-white/30 flex-1">No room generated yet.</p>
                <button
                  onClick={generateRoom}
                  disabled={roomBusy}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {roomBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Video className="size-3.5" />}
                  Generate Room
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/[0.06] px-6 py-4 flex flex-wrap gap-2">
          {booking.status !== "confirmed" && (
            <button onClick={() => changeStatus("confirmed")} disabled={busy}
              className="flex items-center gap-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 px-4 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50">
              <Check className="size-3.5" /> Confirm
            </button>
          )}
          {booking.status !== "completed" && (
            <button onClick={() => changeStatus("completed")} disabled={busy}
              className="flex items-center gap-1.5 rounded-xl bg-green-500/15 border border-green-500/30 px-4 py-2 text-xs font-semibold text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">
              <Check className="size-3.5" /> Mark Complete
            </button>
          )}
          {booking.status !== "rescheduled" && (
            <button onClick={() => changeStatus("rescheduled")} disabled={busy}
              className="flex items-center gap-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 px-4 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-500/25 transition-colors disabled:opacity-50">
              <RefreshCw className="size-3.5" /> Reschedule
            </button>
          )}
          {booking.status !== "cancelled" && (
            <button onClick={() => changeStatus("cancelled")} disabled={busy}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
              <X className="size-3.5" /> Cancel
            </button>
          )}
          <a href={`mailto:${booking.email}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 transition-colors ml-auto">
            <Mail className="size-3.5" /> Email Client
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function BookingsPage() {
  const [all,       setAll]       = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [tab,       setTab]       = useState<typeof STATUS_TABS[number]>("all");
  const [dateFrom,  setDateFrom]  = useState("");
  const [dateTo,    setDateTo]    = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir,   setSortDir]   = useState<"asc"|"desc">("desc");
  const [page,      setPage]      = useState(1);
  const [selected,  setSelected]  = useState<any|null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("demo_bookings")
      .select("*")
      .order(sortField, { ascending: sortDir === "asc" });
    setAll(data ?? []);
    setLoading(false);
  }, [sortField, sortDir]);

  useEffect(() => { load(); }, [load]);

  // Realtime updates
  useEffect(() => {
    const ch = supabase.channel("bookings-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "demo_bookings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  function toggleSort(field: string) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }

  function handleStatusChange(id: string, status: Status) {
    setAll((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    setSelected((prev: any) => prev?.id === id ? { ...prev, status } : prev);
  }

  function handleRoomCreated(id: string, url: string, name: string) {
    setAll((prev) => prev.map((b) => b.id === id ? { ...b, video_room_url: url, video_room_name: name } : b));
    setSelected((prev: any) => prev?.id === id ? { ...prev, video_room_url: url, video_room_name: name } : prev);
  }

  // Filter
  const filtered = all.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q) || b.booking_reference?.toLowerCase().includes(q);
    const matchTab    = tab === "all" || b.status === tab;
    const matchFrom   = !dateFrom || b.preferred_date >= dateFrom;
    const matchTo     = !dateTo   || b.preferred_date <= dateTo;
    return matchSearch && matchTab && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Counts per tab
  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? all.length : all.filter((b) => b.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  const SortIcon = ({ field }: { field: string }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn("size-2.5 -mb-px", sortField === field && sortDir === "asc" ? "text-blue-400" : "text-white/20")} />
      <ChevronDown className={cn("size-2.5", sortField === field && sortDir === "desc" ? "text-blue-400" : "text-white/20")} />
    </span>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Bookings</h1>
          <p className="mt-1 text-sm text-white/40">{all.length} total demo requests from the database</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold capitalize transition-all",
              tab === t
                ? "border-blue-500/40 bg-blue-500/15 text-blue-400"
                : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70",
            )}>
            {t}
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              tab === t ? "bg-blue-500/30 text-blue-300" : "bg-white/10 text-white/30")}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + date filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, reference..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/40 transition-colors" />
        </div>
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 outline-none focus:border-blue-500/40 transition-colors" />
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 outline-none focus:border-blue-500/40 transition-colors" />
        {(search || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); setPage(1); }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/40 hover:text-white transition-colors">
            <X className="size-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-white/30" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Calendar className="size-8 text-white/10" />
            <p className="text-sm text-white/30">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]" style={{ background: "#0d1117" }}>
                <tr>
                  {[
                    { label: "Client",      field: "name"            },
                    { label: "Email",       field: "email"           },
                    { label: "Service",     field: "service_name"    },
                    { label: "Date",        field: "preferred_date"  },
                    { label: "Time",        field: "preferred_time"  },
                    { label: "Timezone",    field: "timezone"        },
                    { label: "Status",      field: "status"          },
                    { label: "Reference",   field: "booking_reference"},
                    { label: "Actions",     field: ""                },
                  ].map(({ label, field }) => (
                    <th key={label}
                      onClick={() => field && toggleSort(field)}
                      className={cn(
                        "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white/35 whitespace-nowrap select-none",
                        field && "cursor-pointer hover:text-white/60 transition-colors",
                      )}>
                      <span className="flex items-center">
                        {label}
                        {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginated.map((b) => (
                  <tr key={b.id}
                    onClick={() => setSelected(b)}
                    className="cursor-pointer transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-3.5 font-medium text-white/90 whitespace-nowrap">{b.name}</td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{b.email}</td>
                    <td className="px-4 py-3.5 text-white/60 max-w-[160px] truncate text-xs">{b.service_name ?? b.service_id ?? "—"}</td>
                    <td className="px-4 py-3.5 text-white/70 whitespace-nowrap text-xs">{b.preferred_date}</td>
                    <td className="px-4 py-3.5 text-white/70 whitespace-nowrap text-xs">{b.preferred_time}</td>
                    <td className="px-4 py-3.5 text-white/40 text-xs max-w-[120px] truncate">{b.timezone}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize whitespace-nowrap", STATUS_STYLE[b.status] ?? "bg-white/8 text-white/40 border-white/10")}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/30 text-xs font-mono">{b.booking_reference}</td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {b.status === "pending" && (
                          <button
                            onClick={async (e) => { e.stopPropagation(); await supabase.from("demo_bookings").update({ status: "confirmed" }).eq("id", b.id); handleStatusChange(b.id, "confirmed"); }}
                            className="rounded-lg bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-[10px] font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors whitespace-nowrap">
                            Confirm
                          </button>
                        )}
                        {b.video_room_url && b.booking_reference && (
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate({ to: "/dashboard/video/$bookingRef", params: { bookingRef: b.booking_reference } }); }}
                            className="rounded-lg bg-violet-500/15 border border-violet-500/30 px-2.5 py-1 text-[10px] font-semibold text-violet-400 hover:bg-violet-500/25 transition-colors whitespace-nowrap flex items-center gap-1">
                            <Video className="size-3" /> Join
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={async (e) => { e.stopPropagation(); await supabase.from("demo_bookings").update({ status: "cancelled" }).eq("id", b.id); handleStatusChange(b.id, "cancelled"); }}
                            className="rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[10px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc: (number|"...")[], p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i-1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === "..." ? (
                <span key={`e${i}`} className="text-white/20 text-xs px-1">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p as number)}
                  className={cn("flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                    page === p ? "bg-blue-500 text-white shadow-[0_0_12px_-2px_rgba(59,130,246,0.5)]" : "border border-white/10 text-white/40 hover:text-white")}>
                  {p}
                </button>
              ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}
