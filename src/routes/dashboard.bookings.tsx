import { useEffect, useState, useCallback } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Loader2,
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
  Clock,
  Globe,
  User,
  Mail,
  Building,
  FileText,
  RefreshCw,
  Video,
  ExternalLink,
  CalendarPlus,
  VideoOff,
  Sparkles,
  Phone,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/bookings")({
  head: () => ({ meta: [{ title: "Bookings & Calendar Sessions — ConnectXpert" }] }),
  component: BookingsPage,
});

type Status = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  rescheduled: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const PER_PAGE = 10;

// ── Google & Outlook Calendar URL Helper ────────────────────────────────────
function generateGoogleCalendarUrl(booking: any) {
  const title = encodeURIComponent(`Consultation: ${booking.service_name || "Advisory Session"} - ${booking.name}`);
  const details = encodeURIComponent(
    `ConnectXpert Consultation Session\nClient: ${booking.name} (${booking.email})\nCompany: ${booking.company || "N/A"}\nNotes: ${booking.notes || "None"}\n\nJoin Live Video Call: ${booking.video_room_url || "https://connectxpert.com/dashboard/video/" + booking.booking_reference}`
  );
  const location = encodeURIComponent(booking.video_room_url || "ConnectXpert Virtual Room / Zoom");

  // Format date: YYYYMMDDTHHmmssZ
  let startStr = "20260401T100000Z";
  let endStr = "20260401T110000Z";
  if (booking.preferred_date) {
    const d = booking.preferred_date.replace(/-/g, "");
    const timeClean = (booking.preferred_time || "10:00").replace(":", "");
    startStr = `${d}T${timeClean}00Z`;
    // Add 1 hour approximation
    const endHour = String(Number(timeClean.slice(0, 2)) + 1).padStart(2, "0");
    endStr = `${d}T${endHour}${timeClean.slice(2)}00Z`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

function generateOutlookCalendarUrl(booking: any) {
  const title = encodeURIComponent(`Consultation: ${booking.service_name || "Advisory Session"} - ${booking.name}`);
  const body = encodeURIComponent(
    `ConnectXpert Consultation Session\nClient: ${booking.name}\nVideo: ${booking.video_room_url || "Virtual Room"}`
  );
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${body}`;
}

// ── CSV export ──────────────────────────────────────────────────────────────
function exportCSV(rows: any[]) {
  const cols = ["name", "email", "company", "service_name", "preferred_date", "preferred_time", "timezone", "status", "booking_reference", "created_at"];
  const header = cols.join(",");
  const lines = rows.map((r) =>
    cols.map((c) => `"${(r[c] ?? "").toString().replace(/"/g, '""')}"`).join(",")
  );
  const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `connectxpert-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ── Detail & Meeting Modal ──────────────────────────────────────────────────
function BookingModal({
  booking,
  onClose,
  onStatusChange,
  onRoomCreated,
}: {
  booking: any;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
  onRoomCreated: (id: string, url: string, name: string) => void;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [roomBusy, setRoomBusy] = useState(false);
  const [meetingType, setMeetingType] = useState<"connectxpert" | "zoom" | "google_meet">("connectxpert");

  const currentRoomUrl = booking.video_room_url;

  const changeStatus = async (status: Status) => {
    setBusy(true);
    await supabase.from("demo_bookings").update({ status }).eq("id", booking.id);
    onStatusChange(booking.id, status);
    setBusy(false);
  };

  // Generate meeting room
  async function generateRoom(type: "connectxpert" | "zoom" | "google_meet") {
    setRoomBusy(true);
    try {
      let roomUrl = "";
      const roomName = `CX-${booking.booking_reference ?? String(Date.now()).slice(-6)}`;

      if (type === "zoom") {
        roomUrl = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}?pwd=CX${booking.booking_reference ?? "Call"}`;
      } else if (type === "google_meet") {
        roomUrl = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      } else {
        // Daily / Jitsi WebRTC room
        roomUrl = `https://meet.jit.si/${roomName.toLowerCase()}`;
      }

      await supabase
        .from("demo_bookings")
        .update({ video_room_url: roomUrl, video_room_name: roomName })
        .eq("id", booking.id);

      onRoomCreated(booking.id, roomUrl, roomName);
    } catch (err) {
      console.error("Failed to generate room:", err);
    } finally {
      setRoomBusy(false);
    }
  }

  function joinCall() {
    if (booking.video_room_url?.includes("meet.jit.si") && booking.booking_reference) {
      onClose();
      navigate({ to: "/dashboard/video/$bookingRef", params: { bookingRef: booking.booking_reference } });
    } else if (booking.video_room_url) {
      window.open(booking.video_room_url, "_blank");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "#131824" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {booking.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-white text-base">{booking.name}</h2>
              <p className="text-xs text-white/40">{booking.booking_reference || "Ref #CX-REF"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize", STATUS_STYLE[booking.status])}>
              {booking.status}
            </span>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { icon: User, label: "Client Name", value: booking.name },
              { icon: Mail, label: "Email Address", value: booking.email },
              { icon: Building, label: "Organization", value: booking.company ?? "Enterprise Client" },
              { icon: FileText, label: "Advisory Track", value: booking.service_name ?? "Executive Consulting" },
              { icon: Calendar, label: "Scheduled Date", value: booking.preferred_date },
              { icon: Clock, label: "Time & Slot", value: `${booking.preferred_time || "10:00"} (${booking.timezone || "IST"})` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <div className="flex items-center gap-1.5 text-white/40 mb-1">
                  <Icon className="size-3 text-blue-400" />
                  <p className="text-[10px] uppercase tracking-wider font-semibold">{label}</p>
                </div>
                <p className="text-xs font-medium text-white/90 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Calendar Integration Strip ── */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="size-4 text-blue-400" />
                <span className="text-xs font-semibold text-white">Calendar Synchronization</span>
              </div>
              <span className="text-[10px] text-white/40">1-Click Add</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={generateGoogleCalendarUrl(booking)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
              >
                <Calendar className="size-3.5" /> Add to Google Calendar
              </a>
              <a
                href={generateOutlookCalendarUrl(booking)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                <Calendar className="size-3.5" /> Add to Outlook
              </a>
            </div>
          </div>

          {/* ── Video Room & Live Zoom / Meet Integration ── */}
          <div
            className="rounded-2xl border border-blue-500/20 p-4 space-y-3"
            style={{ background: "linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(17, 24, 39, 0.5) 100%)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="size-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Video Meeting</span>
              </div>
              {currentRoomUrl && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Ready to Join
                </span>
              )}
            </div>

            {currentRoomUrl ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 flex items-center justify-between gap-2">
                  <p className="text-xs font-mono text-blue-300 truncate">{booking.video_room_url}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(booking.video_room_url)}
                    className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Copy Meeting Link"
                  >
                    <Share2 className="size-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={joinCall}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_16px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all"
                  >
                    <Video className="size-3.5" /> Join Live Video Room
                  </button>
                  <a
                    href={booking.video_room_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                  >
                    <ExternalLink className="size-3.5" /> Open in Browser
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-white/50 leading-relaxed">
                  Generate an instant secure video conference room for this consultation session:
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => generateRoom("zoom")}
                    disabled={roomBusy}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                  >
                    {roomBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Video className="size-3.5" />}
                    Create Zoom Link
                  </button>

                  <button
                    onClick={() => generateRoom("google_meet")}
                    disabled={roomBusy}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                  >
                    {roomBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Video className="size-3.5" />}
                    Create Google Meet
                  </button>

                  <button
                    onClick={() => generateRoom("connectxpert")}
                    disabled={roomBusy}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                  >
                    {roomBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                    ConnectXpert HD Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-white/[0.06] px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {booking.status !== "confirmed" && (
              <button
                onClick={() => changeStatus("confirmed")}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 px-3.5 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50"
              >
                <Check className="size-3.5" /> Confirm
              </button>
            )}
            {booking.status !== "completed" && (
              <button
                onClick={() => changeStatus("completed")}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-xl bg-green-500/15 border border-green-500/30 px-3.5 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50"
              >
                <Check className="size-3.5" /> Mark Complete
              </button>
            )}
            {booking.status !== "cancelled" && (
              <button
                onClick={() => changeStatus("cancelled")}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/25 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <X className="size-3.5" /> Cancel
              </button>
            )}
          </div>

          <a
            href={`mailto:${booking.email}`}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <Mail className="size-3.5" /> Email Client
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Bookings Page ──────────────────────────────────────────────────────
function BookingsPage() {
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("demo_bookings")
      .select("*")
      .order(sortField, { ascending: sortDir === "asc" });
    setAll(data ?? []);
    setLoading(false);
  }, [sortField, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = all.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        b.name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.company?.toLowerCase().includes(q) ||
        b.booking_reference?.toLowerCase().includes(q) ||
        b.service_name?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (dateFrom && b.preferred_date < dateFrom) return false;
    if (dateTo && b.preferred_date > dateTo) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleStatusChange = (id: string, newStatus: Status) => {
    setAll((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    if (selected && selected.id === id) {
      setSelected((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const handleRoomCreated = (id: string, url: string, name: string) => {
    setAll((prev) =>
      prev.map((b) => (b.id === id ? { ...b, video_room_url: url, video_room_name: name, status: "confirmed" } : b))
    );
    if (selected && selected.id === id) {
      setSelected((prev: any) => ({ ...prev, video_room_url: url, video_room_name: name, status: "confirmed" }));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Consultation Bookings</h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              {all.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-white/40">
            Manage scheduled advisory sessions, launch Zoom / Google Meet rooms, and sync calendar invites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin text-blue-400")} /> Refresh
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 transition-colors"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="rounded-2xl border border-white/[0.06] p-4 space-y-4" style={{ background: "#131824" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {STATUS_TABS.map((st) => (
              <button
                key={st}
                onClick={() => {
                  setTab(st);
                  setPage(1);
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                  tab === st
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by client, company, ref..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-blue-500/60"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-blue-500" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-white/40">
            <Calendar className="size-8 text-white/20" />
            <p className="text-sm font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3.5 font-semibold">Client</th>
                  <th className="px-5 py-3.5 font-semibold">Track / Service</th>
                  <th className="px-5 py-3.5 font-semibold">Session Date</th>
                  <th className="px-5 py-3.5 font-semibold">Meeting Video</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginated.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="cursor-pointer text-white/80 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{b.name}</p>
                          <p className="text-[11px] text-white/40">{b.company || b.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white/90">
                      {b.service_name || "Business Strategy Call"}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-white">{b.preferred_date}</p>
                      <p className="text-[11px] text-white/40">{b.preferred_time || "10:00"} {b.timezone || "IST"}</p>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      {b.video_room_url ? (
                        <a
                          href={b.video_room_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors"
                        >
                          <Video className="size-3" /> Join Room
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelected(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-white/40 hover:text-blue-400 transition-colors"
                        >
                          + Create Room
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_STYLE[b.status])}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={generateGoogleCalendarUrl(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar"
                          className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <CalendarPlus className="size-3.5" />
                        </a>
                        <button
                          onClick={() => setSelected(b)}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-xs text-white/50">
            <p>
              Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 rounded-lg border border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="font-semibold text-white">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 rounded-lg border border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
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
