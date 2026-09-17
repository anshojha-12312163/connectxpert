import { useEffect, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, FolderOpen, Mail, TrendingUp,
  ArrowUpRight, ArrowDownRight, Calendar,
  CreditCard, UserPlus, RefreshCw, ArrowRight,
  UsersRound, Zap, Wifi, WifiOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

// ─── helpers ──────────────────────────────────────────────────

function timeAgo(s: string) {
  const m = Math.floor((Date.now() - new Date(s).getTime()) / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Last 12 months, one bar per month with % label
function buildMonthly(rows: { created_at: string }[]) {
  const now = new Date();
  const buckets = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { month: MON[d.getMonth()], value: 0, _year: d.getFullYear(), _mon: d.getMonth() };
  });
  for (const r of rows) {
    if (!r.created_at) continue;
    const d  = new Date(r.created_at);
    const bk = buckets.find((b) => b._year === d.getFullYear() && b._mon === d.getMonth());
    if (bk) bk.value++;
  }
  return buckets.map((b, i) => {
    const prev   = i > 0 ? buckets[i - 1].value : 0;
    const change = prev === 0 ? (b.value > 0 ? 100 : 0) : Math.round(((b.value - prev) / prev) * 100);
    return { month: b.month, value: b.value, pct: `${change > 0 ? "+" : ""}${change}%`, trend: b.value };
  });
}

// Last 30 / 7 days, one bar per day
function buildDaily(rows: { created_at: string }[], days: number) {
  const b: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    b[d.toISOString().slice(0, 10)] = 0;
  }
  for (const r of rows) {
    const k = r.created_at?.slice(0, 10);
    if (k && k in b) b[k]++;
  }
  return Object.entries(b).map(([date, value]) => ({ month: date.slice(5), value, pct: "", trend: value }));
}

// ─── Custom tooltip ────────────────────────────────────────────
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 px-3 py-2 text-xs shadow-xl" style={{ background: "#1a2235" }}>
      <p className="mb-1 font-semibold text-white/60">{label}</p>
      <p className="text-blue-400">Activity: <span className="font-semibold text-white">{payload[0]?.value ?? 0}</span></p>
    </div>
  );
}

// ─── Custom bar label (% above pillar) ────────────────────────
function PctLabel({ x, y, width, value }: any) {
  if (!value || value === "0%" || value === "+0%") return null;
  return (
    <text x={(x ?? 0) + (width ?? 0) / 2} y={(y ?? 0) - 5}
      textAnchor="middle" fontSize={8} fontWeight={700}
      fill={value.startsWith("+") ? "#4ade80" : "#f87171"}>
      {value}
    </text>
  );
}

// ─── StatCard ──────────────────────────────────────────────────
function StatCard({ label, value, change, subtext, icon: Icon, iconBg }: {
  label: string; value: string | number; change: number;
  subtext: string; icon: React.ElementType; iconBg: string;
}) {
  const up = change >= 0;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-white/50">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-xl", iconBg)}>
          <Icon className="size-4" />
        </span>
      </div>
      <div>
        <p className="text-3xl font-semibold text-white tabular-nums">{value}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={cn("flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            up ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400")}>
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-white/30">{subtext}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_PILL: Record<string, string> = {
  pending:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  confirmed: "bg-blue-500/15   text-blue-400   border border-blue-500/20",
  completed: "bg-green-500/15  text-green-400  border border-green-500/20",
  cancelled: "bg-red-500/15    text-red-400    border border-red-500/20",
};

const TRAFFIC_COLORS = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b"];
const TRAFFIC_NAMES  = ["Organic Search","Direct","Referral","Social","Email"];

type ChartMode = "12m" | "30d" | "7d";

// ─── Main ──────────────────────────────────────────────────────
function DashboardIndex() {
  const [loading,   setLoading]   = useState(true);
  const [rtActive,  setRtActive]  = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>("12m");
  const [loadStage, setLoadStage] = useState(0);

  const [bookings,    setBookings]    = useState(0);
  const [contacts,    setContacts]    = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [events,      setEvents]      = useState(0);
  const [convRate,    setConvRate]    = useState("—");

  // Store raw rows for re-bucketing on filter change
  const [allRows, setAllRows] = useState<{ created_at: string }[]>([]);

  const [traffic,   setTraffic]   = useState(TRAFFIC_NAMES.map((name, i) => ({ name, value: 20, color: TRAFFIC_COLORS[i] })));
  const [recentBk,  setRecentBk]  = useState<any[]>([]);
  const [recentCt,  setRecentCt]  = useState<any[]>([]);
  const [notifs,    setNotifs]    = useState<any[]>([]);

  // Loading stages ensure widgets appear in a fixed, predictable order:
  // 1 = stats loaded, 2 = chart data loaded, 3 = recent rows loaded
  const load = useCallback(async () => {
    setLoadStage(0);

    // ── Stage 1: KPI counts (fastest, DB aggregates) ──────────
    const [bkRes, ctRes, subRes, evRes] = await Promise.all([
      supabase.from("demo_bookings").select("created_at, name, status").order("created_at", { ascending: true }),
      supabase.from("contacts").select("created_at, name").order("created_at", { ascending: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("analytics_events").select("event_type, created_at, metadata"),
    ]);

    const allBk  = bkRes.data  ?? [];
    const allCt  = ctRes.data  ?? [];
    const allEv  = evRes.data  ?? [];
    const subCnt = subRes.count ?? 0;
    const pvCnt  = allEv.filter((e) => e.event_type === "page_view").length;

    setBookings(allBk.length);
    setContacts(allCt.length);
    setSubscribers(subCnt);
    setEvents(allEv.length);
    setConvRate(pvCnt > 0 ? `${((allBk.length / pvCnt) * 100).toFixed(1)}%` : allBk.length > 0 ? "100%" : "0%");
    setLoadStage(1); // KPI cards visible

    // ── Stage 2: Chart data (merge + bucket rows) ─────────────
    await new Promise((r) => setTimeout(r, 60)); // yield to paint KPI cards first
    const merged = [...allBk, ...allCt].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    setAllRows(merged);

    const srcMap: Record<string, number> = {};
    TRAFFIC_NAMES.forEach((n) => (srcMap[n] = 0));
    for (const e of allEv) {
      const s = (e.metadata as any)?.source;
      if (s && s in srcMap) srcMap[s]++;
    }
    const srcTotal = Object.values(srcMap).reduce((a, b) => a + b, 0);
    if (srcTotal > 0) setTraffic(TRAFFIC_NAMES.map((n, i) => ({ name: n, value: srcMap[n], color: TRAFFIC_COLORS[i] })));
    setLoadStage(2); // Charts visible

    // ── Stage 3: Recent rows (tables at bottom) ───────────────
    await new Promise((r) => setTimeout(r, 60)); // yield to paint charts first
    const [rbRes, rcRes] = await Promise.all([
      supabase.from("demo_bookings").select("id, name, company, preferred_date, preferred_time, status, created_at").order("created_at", { ascending: false }).limit(6),
      supabase.from("contacts").select("id, name, email, message, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    setRecentBk(rbRes.data ?? []);
    setRecentCt(rcRes.data ?? []);

    const feed: any[] = [
      ...(rbRes.data ?? []).slice(0, 2).map((b: any) => ({
        icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/15",
        title: "New booking", time: timeAgo(b.created_at),
        desc: `${b.name} — ${b.preferred_date} at ${b.preferred_time}`,
      })),
      ...(rcRes.data ?? []).slice(0, 2).map((c: any) => ({
        icon: Mail, color: "text-green-400", bg: "bg-green-500/15",
        title: "Contact form submitted", time: timeAgo(c.created_at),
        desc: `${c.name} sent a message`,
      })),
      { icon: UserPlus, color: "text-purple-400", bg: "bg-purple-500/15", title: "Newsletter subscribers", time: "live", desc: `${subCnt} total subscribers` },
      { icon: CreditCard, color: "text-yellow-400", bg: "bg-yellow-500/15", title: "Analytics events", time: "live", desc: `${allEv.length} events tracked` },
      { icon: RefreshCw, color: "text-white/40", bg: "bg-white/8", title: "Database connected", time: "now", desc: "All tables live on Supabase" },
    ];
    setNotifs(feed);
    setLoadStage(3); // Everything visible
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel("db-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "demo_bookings" }, (p) => {
        const nb = p.new as any;
        setBookings((n) => n + 1);
        setAllRows((prev) => [...prev, nb]);
        setRecentBk((prev) => [nb, ...prev].slice(0, 6));
        setNotifs((prev) => [{ icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/15", title: "🔔 New booking!", desc: `${nb.name} — ${nb.preferred_date}`, time: "just now" }, ...prev].slice(0, 8));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contacts" }, (p) => {
        const nc = p.new as any;
        setContacts((n) => n + 1);
        setAllRows((prev) => [...prev, nc]);
        setRecentCt((prev) => [nc, ...prev].slice(0, 5));
        setNotifs((prev) => [{ icon: Mail, color: "text-green-400", bg: "bg-green-500/15", title: "🔔 New message!", desc: `${nc.name} sent a message`, time: "just now" }, ...prev].slice(0, 8));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "newsletter_subscribers" }, () => setSubscribers((n) => n + 1))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "demo_bookings" }, (p) => {
        const u = p.new as any;
        setRecentBk((prev) => prev.map((b) => b.id === u.id ? { ...b, status: u.status } : b));
      })
      .subscribe((s) => setRtActive(s === "SUBSCRIBED"));
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Compute chart data based on selected mode
  const chartData = chartMode === "12m"
    ? buildMonthly(allRows)
    : buildDaily(allRows, chartMode === "7d" ? 7 : 30);

  const trafficTotal = traffic.reduce((a, t) => a + t.value, 0);
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const fmtD  = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const greet = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  if (loading && loadStage === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-white/40">Connecting to database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">

      {/* Greeting — always shown once stage > 0 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-white">{greet}, Admin 👋</h1>
            <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold",
              rtActive ? "bg-green-500/15 text-green-400" : "bg-white/8 text-white/30")}>
              {rtActive ? <><Wifi className="size-3" /> Live</> : <><WifiOff className="size-3" /> Connecting…</>}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/40">Here's what's happening with your business today.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-white/50" style={{ background: "#131824" }}>
          <Calendar className="size-4 text-blue-400" />
          {fmtD(start)} – {fmtD(now)}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Demo Bookings"    value={bookings.toLocaleString()}    change={8.2}  subtext="all time"          icon={FolderOpen} iconBg="bg-blue-500/15 text-blue-400"    />
        <StatCard label="Contact Messages" value={contacts.toLocaleString()}    change={5.1}  subtext="all time"          icon={Mail}       iconBg="bg-green-500/15 text-green-400"  />
        <StatCard label="Newsletter Subs"  value={subscribers.toLocaleString()} change={12.3} subtext="total subscribers" icon={Users}      iconBg="bg-purple-500/15 text-purple-400" />
        <StatCard label="Conversion Rate"  value={convRate}                     change={1.4}  subtext="visitors→bookings" icon={TrendingUp} iconBg="bg-yellow-500/15 text-yellow-400" />
      </div>

      {/* Charts row — visible after stage 2 */}
      {loadStage >= 2 ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">User Activity</h2>
              <p className="text-xs text-white/35 mt-0.5">Bookings + contacts — live from Supabase</p>
            </div>
            {/* Filter buttons */}
            <div className="flex overflow-hidden rounded-lg border border-white/[0.08] text-xs font-medium">
              {(["12m", "30d", "7d"] as ChartMode[]).map((f) => (
                <button key={f} onClick={() => setChartMode(f)}
                  className={cn("px-3 py-1.5 transition-colors",
                    chartMode === f ? "bg-blue-500/20 text-blue-400" : "text-white/35 hover:text-white/60")}>
                  {f === "12m" ? "12 Months" : f === "30d" ? "30 Days" : "7 Days"}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <defs>
                <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="barG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6b7280" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#374151" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              {/* Background ghost bars for context */}
              <Bar dataKey="value" maxBarSize={chartMode === "7d" ? 48 : chartMode === "30d" ? 12 : 28}
                radius={[4, 4, 0, 0]} fill="url(#barG2)" />

              {/* Foreground blue bars */}
              <Bar dataKey="value" maxBarSize={chartMode === "7d" ? 40 : chartMode === "30d" ? 8 : 22}
                radius={[4, 4, 0, 0]} fill="url(#barG)">
                {/* % label above each bar — only for monthly view */}
                {chartMode === "12m" && (
                  chartData.map((entry, index) => (
                    <PctLabel
                      key={index}
                      value={entry.pct}
                      x={0} y={0} width={0}
                    />
                  ))
                )}
              </Bar>

              {/* Trend line */}
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#fbbf24" }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-5 pl-2">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <span className="size-2.5 rounded-sm" style={{ background: "url(#barG) #3b82f6" }} />
              Activity
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <span className="size-2 rounded-full bg-yellow-400" />
              Trend
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
          <h2 className="text-sm font-semibold text-white mb-1">Traffic Sources</h2>
          <p className="text-xs text-white/35 mb-4">From analytics events</p>
          <div className="relative mx-auto w-fit">
            <PieChart width={160} height={160}>
              <Pie data={traffic} cx={80} cy={80} innerRadius={50} outerRadius={72}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {traffic.map((_, i) => <Cell key={i} fill={traffic[i].color} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold text-white tabular-nums">
                {(trafficTotal || events).toLocaleString()}
              </span>
              <span className="text-[10px] text-white/40">events</span>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {traffic.map((t) => {
              const pct = trafficTotal > 0 ? Math.round((t.value / trafficTotal) * 100) : Math.round(100 / traffic.length);
              return (
                <div key={t.name} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: t.color }} />
                  <span className="flex-1 truncate text-xs text-white/55">{t.name}</span>
                  <span className="tabular-nums text-xs font-semibold text-white/80">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-white/[0.06] p-5 h-72 flex items-center justify-center" style={{ background: "#131824" }}>
            <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
          <div className="rounded-2xl border border-white/[0.06] p-5 h-72 flex items-center justify-center" style={{ background: "#131824" }}>
            <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        </div>
      )}

      {/* Bottom row — visible after stage 3 */}
      {loadStage >= 3 ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_280px]">

        {/* Recent Bookings */}
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
            <Link to="/dashboard/bookings" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {recentBk.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <Calendar className="size-8 text-white/10" />
              <p className="text-xs text-white/30">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBk.map((b, i) => (
                <div key={b.id ?? i} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.03]">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                    <Calendar className="size-3.5 text-blue-400" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/90">{b.name}</p>
                    <p className="text-xs text-white/35">{b.preferred_date}{b.preferred_time ? ` · ${b.preferred_time}` : ""} · {timeAgo(b.created_at)}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize", STATUS_PILL[b.status] ?? "bg-white/8 text-white/40")}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Messages */}
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Contact Messages</h2>
            <Link to="/dashboard/contacts" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {recentCt.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <Mail className="size-8 text-white/10" />
              <p className="text-xs text-white/30">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCt.map((c, i) => (
                <div key={c.id ?? i} className="rounded-xl p-3 transition-colors hover:bg-white/[0.03]">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Avatar name={c.name} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white/90">{c.name}</p>
                      <p className="text-[10px] text-white/30">{timeAgo(c.created_at)}</p>
                    </div>
                  </div>
                  <p className="pl-9 text-xs text-white/45 line-clamp-2 leading-relaxed">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
              rtActive ? "bg-green-500/15 text-green-400" : "bg-white/8 text-white/30")}>
              {rtActive ? "● Live" : "○ Offline"}
            </span>
          </div>
          <div className="space-y-3">
            {notifs.slice(0, 6).map((n, i) => {
              const Icon = n.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", n.bg)}>
                    <Icon className={cn("size-3.5", n.color)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-snug text-white/85">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-white/40">{n.desc}</p>
                    <p className="mt-1 text-[10px] text-white/25">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl p-4" style={{
            background: "linear-gradient(135deg,rgba(59,130,246,0.12) 0%,rgba(139,92,246,0.08) 100%)",
            border: "1px solid rgba(59,130,246,0.15)",
          }}>
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-blue-500/15">
              <UsersRound className="size-4 text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-white/90">Build faster together</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">Invite your team to collaborate.</p>
            <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-500/15">
              <Zap className="size-3" /> Invite Team
            </button>
          </div>
        </div>
      </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_280px]">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl border border-white/[0.06] p-5 h-48 flex items-center justify-center" style={{ background: "#131824" }}>
              <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
