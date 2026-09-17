import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Loader2, TrendingUp, Calendar, Mail, Users, MousePointerClick } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

// ── helpers ──────────────────────────────────────────────────────────────────

function buildDailyBuckets(rows: { created_at: string }[], days = 30) {
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const row of rows) {
    const day = row.created_at?.slice(0, 10);
    if (day && day in buckets) buckets[day]++;
  }
  return Object.entries(buckets).map(([date, count]) => ({
    date: date.slice(5), // MM-DD for display
    count,
  }));
}

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ── custom tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color,
}: { label: string; value: number | string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2/50 p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={`flex size-9 items-center justify-center rounded-xl ${color}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── activity feed ─────────────────────────────────────────────────────────────

function ActivityItem({ icon: Icon, color, title, sub }: { icon: React.ElementType; color: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-3.5" />
      </span>
      <div>
        <p className="text-sm leading-snug">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  // chart series
  const [pageViews, setPageViews] = useState<{ date: string; count: number }[]>([]);
  const [ctaClicks, setCtaClicks] = useState<{ date: string; count: number }[]>([]);
  const [bookingTrend, setBookingTrend] = useState<{ date: string; count: number }[]>([]);
  const [contactTrend, setContactTrend] = useState<{ date: string; count: number }[]>([]);

  // KPIs
  const [bookingsWeek, setBookingsWeek] = useState(0);
  const [bookingsMonth, setBookingsMonth] = useState(0);
  const [contactsTotal, setContactsTotal] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [conversionRate, setConversionRate] = useState("0%");

  // top CTAs
  const [topCtAs, setTopCtAs] = useState<{ name: string; count: number }[]>([]);

  // activity feed
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const week = startOfWeek();
      const month = startOfMonth();

      const [
        eventsRes,
        bookingsAllRes,
        bookingsWeekRes,
        bookingsMonthRes,
        contactsRes,
        subsRes,
        recentBookings,
        recentContacts,
        recentSubs,
      ] = await Promise.all([
        supabase.from("analytics_events").select("event_type, page, created_at").order("created_at"),
        supabase.from("demo_bookings").select("created_at"),
        supabase.from("demo_bookings").select("id", { count: "exact", head: true }).gte("created_at", week),
        supabase.from("demo_bookings").select("id", { count: "exact", head: true }).gte("created_at", month),
        supabase.from("contacts").select("id, name, email, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
        supabase.from("newsletter_subscribers").select("id, email, subscribed_at", { count: "exact" }).order("subscribed_at", { ascending: false }).limit(5),
        supabase.from("demo_bookings").select("name, email, preferred_date, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contacts").select("name, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("newsletter_subscribers").select("email, subscribed_at").order("subscribed_at", { ascending: false }).limit(5),
      ]);

      const allEvents: any[] = eventsRes.data ?? [];

      // page views
      const pvRows = allEvents.filter((e) => e.event_type === "page_view");
      setPageViews(buildDailyBuckets(pvRows));
      setVisitors(pvRows.length);

      // cta clicks
      const ctaRows = allEvents.filter((e) => e.event_type === "cta_click");
      setCtaClicks(buildDailyBuckets(ctaRows));

      // booking trend
      setBookingTrend(buildDailyBuckets(bookingsAllRes.data ?? []));

      // contact trend
      setContactTrend(buildDailyBuckets(contactsRes.data ?? []));

      // KPIs
      setBookingsWeek(bookingsWeekRes.count ?? 0);
      setBookingsMonth(bookingsMonthRes.count ?? 0);
      setContactsTotal(contactsRes.count ?? 0);
      setSubscribers(subsRes.count ?? 0);

      const totalBookings = bookingsAllRes.data?.length ?? 0;
      const rate = pvRows.length > 0 ? ((totalBookings / pvRows.length) * 100).toFixed(1) + "%" : "N/A";
      setConversionRate(rate);

      // top CTAs from metadata
      const ctaMap: Record<string, number> = {};
      for (const e of ctaRows) {
        const label = (e.metadata as any)?.cta ?? e.page ?? "Unknown";
        ctaMap[label] = (ctaMap[label] ?? 0) + 1;
      }
      setTopCtAs(
        Object.entries(ctaMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count })),
      );

      // activity feed — merge recent items sorted by date
      const feed: any[] = [
        ...(recentBookings.data ?? []).map((b: any) => ({ type: "booking", label: `${b.name} booked a demo`, sub: new Date(b.created_at).toLocaleString() })),
        ...(recentContacts.data ?? []).map((c: any) => ({ type: "contact", label: `${c.name} sent a message`, sub: new Date(c.created_at).toLocaleString() })),
        ...(recentSubs.data ?? []).map((s: any) => ({ type: "newsletter", label: `${s.email} subscribed`, sub: new Date(s.subscribed_at).toLocaleString() })),
      ].sort((a, b) => new Date(b.sub).getTime() - new Date(a.sub).getTime()).slice(0, 10);
      setActivity(feed);

      setLoading(false);
    }

    load();
  }, []);

  const BLUE = "oklch(0.51 0.276 268)";
  const LIGHT_BLUE = "oklch(0.78 0.115 269)";
  const GREEN = "#4ade80";
  const PURPLE = "#a78bfa";

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // merged chart data
  const mergedDaily = pageViews.map((pv, i) => ({
    date: pv.date,
    "Page Views": pv.count,
    "CTA Clicks": ctaClicks[i]?.count ?? 0,
    "Bookings": bookingTrend[i]?.count ?? 0,
    "Contacts": contactTrend[i]?.count ?? 0,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live data from your Supabase database — last 30 days.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Page Views" value={visitors} sub="All time" icon={TrendingUp} color="bg-primary/10 text-accent" />
        <StatCard label="Bookings (week)" value={bookingsWeek} sub="This week" icon={Calendar} color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Bookings (month)" value={bookingsMonth} sub="This month" icon={Calendar} color="bg-indigo-500/10 text-indigo-400" />
        <StatCard label="Contact Forms" value={contactsTotal} sub="All time" icon={Mail} color="bg-green-500/10 text-green-400" />
        <StatCard label="Subscribers" value={subscribers} sub="Newsletter" icon={Users} color="bg-purple-500/10 text-purple-400" />
      </div>

      {/* Conversion rate banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/8 px-6 py-4">
        <MousePointerClick className="size-5 text-accent shrink-0" />
        <div>
          <p className="text-sm font-semibold">Visitor → Booking Conversion Rate</p>
          <p className="text-xs text-muted-foreground">Unique page view events that converted to a demo booking</p>
        </div>
        <span className="ml-auto text-2xl font-semibold text-gradient">{conversionRate}</span>
      </div>

      {/* Main line chart */}
      <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
        <h2 className="text-base font-semibold mb-5">Daily Activity — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={mergedDaily} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.73 0.021 268)" }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "oklch(0.73 0.021 268)" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Line type="monotone" dataKey="Page Views" stroke={BLUE} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="CTA Clicks" stroke={LIGHT_BLUE} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Bookings" stroke={GREEN} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Contacts" stroke={PURPLE} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart + top CTAs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
          <h2 className="text-base font-semibold mb-5">Bookings &amp; Contacts — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mergedDaily} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.73 0.021 268)" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.73 0.021 268)" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Bookings" fill={BLUE} radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Contacts" fill={PURPLE} radius={[3, 3, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
          <h2 className="text-base font-semibold mb-5">Top Clicked CTAs</h2>
          {topCtAs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No CTA click events tracked yet.</p>
          ) : (
            <div className="space-y-3">
              {topCtAs.map(({ name, count }, i) => {
                const max = topCtAs[0].count;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-4 text-xs text-muted-foreground text-right shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm truncate">{name}</span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-2">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${(count / max) * 100}%`, background: "var(--gradient-primary)" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Activity feed */}
      <div className="rounded-2xl border border-border bg-surface-2/40 p-6">
        <h2 className="text-base font-semibold mb-5">Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet. Data appears here as users interact with the site.</p>
        ) : (
          <div className="space-y-4">
            {activity.map((item, i) => (
              <ActivityItem
                key={i}
                icon={item.type === "booking" ? Calendar : item.type === "contact" ? Mail : Users}
                color={item.type === "booking" ? "bg-blue-500/10 text-blue-400" : item.type === "contact" ? "bg-green-500/10 text-green-400" : "bg-purple-500/10 text-purple-400"}
                title={item.label}
                sub={item.sub}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
