import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Star, BadgeCheck, Clock, Globe, Briefcase,
  Heart, Share2, Copy, MessageCircle, Calendar as CalIcon,
  Check, ChevronLeft, ChevronRight, ArrowLeft,
  ExternalLink, Zap,
} from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { Avatar, StatusDot } from "@/components/lanx/bits";
import { ExpertCard } from "@/components/experts/ExpertCard";
import {
  supabase, SEED_EXPERTS, getOnlineStatus, formatResponseTime,
  type ExpertRow, type ReviewRow,
} from "@/lib/supabase";
import {
  fetchAvailability, fetchSlotsForDate, fetchFullyBookedDates,
  toDateStr, formatTime, type BookingSlot,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/experts/$id")({
  component: ExpertProfilePage,
});

// ── Static seed data ───────────────────────────────────────────

const SEED_REVIEWS: ReviewRow[] = [
  { expert_id: "", client_name: "Sarah K.",  rating: 5, comment: "Absolutely transformative session. Booked 3× more clients after our strategy call. Worth every penny.", created_at: "2026-08-10T10:00:00Z" },
  { expert_id: "", client_name: "James R.",  rating: 5, comment: "Incredibly clear and actionable. The deep-dive paid for itself within the first week.", created_at: "2026-07-20T10:00:00Z" },
  { expert_id: "", client_name: "Maya T.",   rating: 5, comment: "Best investment I made for my coaching business. Knows exactly what to ask and what to fix.", created_at: "2026-06-15T10:00:00Z" },
  { expert_id: "", client_name: "Lucas F.",  rating: 4, comment: "Very knowledgeable and responsive. Cut our CAC by 40% in one session.", created_at: "2026-05-05T10:00:00Z" },
];

const SESSION_PRICING = [
  { label: "30 min Intro Call",  duration: 30,  price: "Free"     },
  { label: "60 min Strategy",    duration: 60,  price: "$149"     },
  { label: "90 min Deep Dive",   duration: 90,  price: "$249"     },
  { label: "Monthly Package",    duration: 0,   price: "$799/mo"  },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const AVATAR_COLORS = ["#7c3aed","#059669","#dc2626","#2563eb","#d97706","#0891b2"];

// ── Sub-components ─────────────────────────────────────────────

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length: 5}).map((_,i) => (
        <Star key={i} className={cn("size-3.5", i < n ? "fill-yellow-400 text-yellow-400" : "text-white/15")} />
      ))}
    </div>
  );
}

function RatingBar({ rating, count, max }: { rating: number; count: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-6 text-right shrink-0">{rating}★</span>
      <div className="h-1.5 flex-1 rounded-full bg-white/8">
        <div
          className="h-1.5 rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: max > 0 ? `${(count / max) * 100}%` : "0%" }}
        />
      </div>
      <span className="text-xs text-white/25 w-4 shrink-0">{count}</span>
    </div>
  );
}

// ── Interactive calendar ───────────────────────────────────────

interface CalendarProps {
  availableDays: Set<number>;      // day-of-week numbers with availability
  fullyBookedDates: Set<string>;   // YYYY-MM-DD strings
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
}

function BookingCalendar({ availableDays, fullyBookedDates, selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  function prev() { if (month === 1) { setYear(y => y-1); setMonth(12); } else setMonth(m => m-1); }
  function next() { if (month === 12) { setYear(y => y+1); setMonth(1); } else setMonth(m => m+1); }

  const firstDow    = new Date(year, month-1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number|null)[] = [...Array(firstDow).fill(null), ...Array.from({length: daysInMonth}, (_,i) => i+1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function getState(day: number): "past"|"unavailable"|"full"|"today"|"available"|"selected" {
    const d = new Date(year, month-1, day);
    const ds = toDateStr(d);
    if (ds === selectedDate) return "selected";
    if (d < today)           return "past";
    if (!availableDays.has(d.getDay())) return "unavailable";
    if (fullyBookedDates.has(ds)) return "full";
    if (d.getTime() === today.getTime()) return "today";
    return "available";
  }

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">{MONTH_NAMES[month-1]} {year}</span>
        <div className="flex gap-1.5">
          <button onClick={prev} aria-label="Previous month"
            className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white transition-colors">
            <ChevronLeft className="size-3.5" />
          </button>
          <button onClick={next} aria-label="Next month"
            className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white transition-colors">
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white/25">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const state = getState(day);
          const clickable = state === "available" || state === "today";
          return (
            <button
              key={i}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelectDate(toDateStr(new Date(year, month-1, day)))}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition-all select-none",
                state === "selected"    && "bg-blue-500 text-white shadow-[0_0_14px_-2px_rgba(59,130,246,0.7)]",
                state === "today"       && "ring-2 ring-blue-500/50 text-white hover:bg-blue-500/15",
                state === "available"   && "text-white/80 hover:bg-blue-500/15 hover:text-blue-300",
                state === "full"        && "text-white/20 cursor-not-allowed",
                (state === "past" || state === "unavailable") && "text-white/15 cursor-not-allowed",
              )}
            >
              {day}
              {state === "available" && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-blue-400" />
              )}
              {state === "full" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] text-white/20 leading-none">Full</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Time slots grid ────────────────────────────────────────────

interface TimeSlotsProps {
  date: string;
  slots: BookingSlot[];
  loading: boolean;
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
}

function TimeSlots({ date, slots, loading, selectedTime, onSelectTime }: TimeSlotsProps) {
  const [y, mo, d] = date.split("-").map(Number);
  const displayDate = new Date(y, mo-1, d).toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" });

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">
        Available Times — <span className="text-blue-400">{displayDate}</span>
      </h3>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({length: 6}).map((_,i) => (
            <div key={i} className="h-9 w-24 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <p className="text-sm text-white/35">No availability on this day.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slots.map(s => (
            <button
              key={s.time}
              type="button"
              disabled={s.booked}
              onClick={() => !s.booked && onSelectTime(s.time)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                s.booked
                  ? "cursor-not-allowed border-white/5 text-white/20 line-through"
                  : selectedTime === s.time
                  ? "border-blue-500 bg-blue-500 text-white shadow-[0_0_14px_-4px_rgba(59,130,246,0.7)]"
                  : "border-white/10 text-white/70 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white",
              )}
            >
              {s.label}
              {s.booked && <span className="ml-1.5 text-[10px] text-white/20">Booked</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────

function ExpertProfilePage() {
  const { id } = Route.useParams();

  const [expert,   setExpert]   = useState<ExpertRow | null>(null);
  const [reviews,  setReviews]  = useState<ReviewRow[]>([]);
  const [similar,  setSimilar]  = useState<ExpertRow[]>([]);
  const [loading,  setLoading]  = useState(true);

  // Booking state
  const [availDays,     setAvailDays]     = useState<Set<number>>(new Set([1,2,3,4,5]));
  const [fullyBooked,   setFullyBooked]   = useState<Set<string>>(new Set());
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);
  const [slots,         setSlots]         = useState<BookingSlot[]>([]);
  const [slotsLoading,  setSlotsLoading]  = useState(false);
  const [selectedTime,  setSelectedTime]  = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState(1); // index into SESSION_PRICING

  // UI state
  const [faved,     setFaved]     = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Load expert
  useEffect(() => {
    async function load() {
      let exp: ExpertRow | null = null;
      const { data } = await supabase.from("experts").select("*").eq("id", id).single();
      if (data) {
        exp = data as ExpertRow;
      } else {
        const idx = parseInt(id.replace("seed-",""), 10);
        if (!isNaN(idx) && SEED_EXPERTS[idx]) {
          exp = { ...SEED_EXPERTS[idx], id } as ExpertRow;
        }
      }
      if (!exp) { setLoading(false); return; }
      setExpert(exp);

      // Reviews
      const { data: rv } = await supabase.from("reviews").select("*").eq("expert_id", id).eq("is_hidden", false);
      setReviews(rv && rv.length > 0 ? (rv as ReviewRow[]) : SEED_REVIEWS.map(r => ({ ...r, expert_id: id })));

      // Similar
      const { data: sim } = await supabase.from("experts").select("*")
        .eq("category_id", exp.category_id).neq("id", id).eq("status","active").limit(3);
      if (sim && sim.length > 0) setSimilar(sim as ExpertRow[]);
      else setSimilar(SEED_EXPERTS.filter(e => e.category_id === exp!.category_id).slice(0,3).map((e,i) => ({ ...e, id: `seed-sim-${i}` } as ExpertRow)));

      // Availability
      const avail = await fetchAvailability();
      setAvailDays(new Set(avail.map(a => a.day_of_week)));

      const now = new Date();
      const fb = await fetchFullyBookedDates(now.getFullYear(), now.getMonth()+1, SESSION_PRICING[selectedSession].duration || 60);
      setFullyBooked(fb);

      setLoading(false);
    }
    load();
  }, [id]);

  // Load time slots when date selected
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSelectedTime(null);
    const dur = SESSION_PRICING[selectedSession].duration || 60;
    fetchSlotsForDate(selectedDate, dur).then(s => {
      setSlots(s);
      setSlotsLoading(false);
    });
  }, [selectedDate, selectedSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-white">Expert not found</p>
        <Link to="/experts" className="text-blue-400 hover:text-blue-300">Browse all experts →</Link>
      </div>
    );
  }

  const status   = getOnlineStatus(expert.last_active_at);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/experts/${id}` : `/experts/${id}`;
  const avgRating = reviews.length > 0
    ? reviews.reduce((s,r) => s + r.rating, 0) / reviews.length
    : expert.average_rating;
  const ratingCounts = [5,4,3,2,1].map(r => ({ r, count: reviews.filter(rv => rv.rating === r).length }));
  const maxCount = Math.max(...ratingCounts.map(x => x.count), 1);

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedSlot = SESSION_PRICING[selectedSession];
  const canBook = !!selectedDate && !!selectedTime;

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <Nav />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-5">

          {/* Back */}
          <Link to="/experts" className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="size-4" /> Back to Experts
          </Link>

          {/* ── Two-column layout (matches mockup) ── */}
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

            {/* ── LEFT SIDEBAR ── */}
            <div className="flex flex-col gap-5">

              {/* Profile card */}
              <div className="rounded-2xl border border-white/[0.06] p-6 text-center" style={{ background: "#131824" }}>
                {/* Avatar + status */}
                <div className="relative inline-block mb-4">
                  <Avatar name={expert.name} src={expert.photo_url} size={88} />
                  <StatusDot status={status} className="absolute -bottom-1 -right-1 size-4 border-[3px] border-[#131824]" />
                </div>

                <h2 className="text-xl font-bold text-white">{expert.name}</h2>

                {expert.is_verified && (
                  <span className="inline-flex items-center gap-1 mt-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                    <BadgeCheck className="size-3" /> Verified Expert
                  </span>
                )}

                <p className="mt-1.5 text-sm text-white/45">{expert.title}</p>

                {/* Stars + rating */}
                <div className="mt-3 flex flex-col items-center gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({length:5}).map((_,i) => (
                      <Star key={i} className={cn("size-4", i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-white/15")} />
                    ))}
                  </div>
                  <p className="text-xs text-white/35">{avgRating.toFixed(1)} · {reviews.length} reviews</p>
                </div>

                {/* Quick stats */}
                <div className="mt-4 flex justify-center gap-4 py-3 border-y border-white/[0.05]">
                  {expert.years_experience && (
                    <div className="text-center">
                      <p className="text-base font-bold text-white">{expert.years_experience}+</p>
                      <p className="text-[10px] text-white/30">Yrs exp</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-base font-bold text-white">{expert.total_bookings}</p>
                    <p className="text-[10px] text-white/30">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-white">{reviews.length}</p>
                    <p className="text-[10px] text-white/30">Reviews</p>
                  </div>
                </div>

                {/* Skill badges */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {expert.skills.slice(0,5).map(s => (
                    <span key={s} className="rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-[10px] font-medium text-blue-300">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Response time */}
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/35">
                  <Clock className="size-3" />
                  {formatResponseTime(expert.avg_response_time_minutes)}
                </p>

                {/* Languages */}
                {expert.languages && expert.languages.length > 0 && (
                  <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-white/30">
                    <Globe className="size-3" /> {expert.languages.join(", ")}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setFaved(v => !v)}
                    className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all",
                      faved ? "border-red-400/40 bg-red-500/15 text-red-400" : "border-white/10 bg-white/5 text-white/35 hover:text-red-400")}
                  >
                    <Heart className={cn("size-4", faved && "fill-red-400")} />
                  </button>

                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <MessageCircle className="size-4" /> Message
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShareOpen(v => !v)}
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/35 hover:text-white transition-colors"
                    >
                      <Share2 className="size-4" />
                    </button>
                    {shareOpen && (
                      <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-white/10 p-1.5 shadow-2xl" style={{ background: "#131824" }}>
                        <button onClick={handleCopyLink}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                          {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                          {copied ? "Copied!" : "Copy link"}
                        </button>
                        <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${expert.name}: ${shareUrl}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                          <ExternalLink className="size-4" /> WhatsApp
                        </a>
                        <a href={`mailto:?subject=Expert on ConnectXpert&body=${shareUrl}`}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                          <ExternalLink className="size-4" /> Email
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing card */}
              <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
                <h3 className="text-sm font-bold text-white mb-4">Session Pricing</h3>
                <div className="space-y-0">
                  {SESSION_PRICING.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSession(i)}
                      className={cn(
                        "flex w-full items-center justify-between border-b border-white/[0.05] py-3 text-sm transition-all last:border-0",
                        selectedSession === i ? "text-blue-400" : "text-white/60 hover:text-white",
                      )}
                    >
                      <span className={cn("font-medium", selectedSession === i && "font-semibold")}>
                        {p.label}
                      </span>
                      <span className={cn("font-bold", p.price === "Free" ? "text-green-400" : selectedSession === i ? "text-blue-400" : "text-white/80")}>
                        {p.price}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Book CTA */}
                <Link
                  to="/book"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <CalIcon className="size-4" /> Book a Session
                </Link>

                {expert.offers_free_intro && (
                  <Link
                    to="/book"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/8 py-3 text-sm font-semibold text-green-400 hover:bg-green-500/15 transition-colors"
                  >
                    <Zap className="size-4" /> Free 15-min Intro Call
                  </Link>
                )}
              </div>
            </div>

            {/* ── RIGHT MAIN CONTENT ── */}
            <div className="flex flex-col gap-5">

              {/* About */}
              <div className="rounded-2xl border border-white/[0.06] p-6" style={{ background: "#131824" }}>
                <h3 className="text-base font-bold text-white mb-3">About {expert.name.split(" ")[0]}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{expert.bio}</p>
                {expert.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {expert.skills.map(s => (
                      <span key={s} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Calendar + time slots */}
              <div className="rounded-2xl border border-white/[0.06] p-6" style={{ background: "#131824" }}>
                <h3 className="text-base font-bold text-white mb-5">Pick a Date &amp; Time</h3>

                {/* Session type tabs */}
                <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-white/[0.05]">
                  {SESSION_PRICING.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSelectedSession(i); setSelectedTime(null); }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                        selectedSession === i
                          ? "border-blue-500/40 bg-blue-500/15 text-blue-400"
                          : "border-white/8 text-white/40 hover:border-white/15 hover:text-white",
                      )}
                    >
                      {p.label} — <span className={p.price === "Free" ? "text-green-400" : ""}>{p.price}</span>
                    </button>
                  ))}
                </div>

                {/* Calendar */}
                <BookingCalendar
                  availableDays={availDays}
                  fullyBookedDates={fullyBooked}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />

                {/* Time slots — shown after date selected */}
                {selectedDate && (
                  <div className="mt-6 pt-5 border-t border-white/[0.05]">
                    <TimeSlots
                      date={selectedDate}
                      slots={slots}
                      loading={slotsLoading}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                    />
                  </div>
                )}

                {/* Confirm bar */}
                {canBook && (
                  <div className="mt-5 pt-5 border-t border-white/[0.05]">
                    <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 mb-3">
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Selected</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedSlot.label} · {formatTime(selectedTime!)}
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(...(selectedDate.split("-").map(Number) as [number, number, number]).map((n,i) => i===1 ? n-1 : n) as [number,number,number]).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" })}
                        </p>
                      </div>
                      <span className={cn("text-lg font-bold", selectedSlot.price === "Free" ? "text-green-400" : "text-white")}>
                        {selectedSlot.price}
                      </span>
                    </div>
                    <Link
                      to="/book"
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
                      style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                    >
                      <CalIcon className="size-4" /> Confirm Booking
                    </Link>
                  </div>
                )}
              </div>

              {/* Testimonials / Reviews */}
              <div className="rounded-2xl border border-white/[0.06] p-6" style={{ background: "#131824" }}>
                <div className="flex items-start justify-between mb-5">
                  <h3 className="text-base font-bold text-white">What Clients Say</h3>
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-white/30">({reviews.length})</span>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="space-y-1.5 mb-6 pb-5 border-b border-white/[0.05]">
                  {ratingCounts.map(({ r, count }) => (
                    <RatingBar key={r} rating={r} count={count} max={maxCount} />
                  ))}
                </div>

                {/* Review cards */}
                {reviews.length === 0 ? (
                  <p className="text-sm text-white/30 text-center py-6">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((r, i) => (
                      <div key={r.id ?? i} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            {/* Coloured avatar */}
                            <div
                              className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                            >
                              {r.client_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white/85">{r.client_name}</p>
                              <p className="text-[11px] text-white/30">
                                {r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month:"long", year:"numeric" }) : ""}
                              </p>
                            </div>
                          </div>
                          <StarRow n={r.rating} />
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">{r.comment}</p>
                        {r.expert_response && (
                          <div className="mt-3 rounded-xl border border-blue-500/15 bg-blue-500/5 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Expert Response</p>
                            <p className="text-xs text-white/50 leading-relaxed">{r.expert_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Portfolio */}
              {expert.portfolio && expert.portfolio.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] p-6" style={{ background: "#131824" }}>
                  <h3 className="text-base font-bold text-white mb-4">Portfolio</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {expert.portfolio.map((p, i) => (
                      <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                        <p className="text-sm font-semibold text-white/85">{p.title}</p>
                        {p.description && <p className="mt-1 text-xs text-white/45 leading-relaxed">{p.description}</p>}
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            View work <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar experts */}
          {similar.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-white mb-5">You might also like</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map(e => (
                  <ExpertCard key={e.id} expert={e} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
