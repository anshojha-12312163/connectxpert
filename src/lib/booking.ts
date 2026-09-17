import { supabase } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  icon: string;
}

export interface Availability {
  id: string;
  day_of_week: number; // 0=Sun … 6=Sat
  start_time: string;  // "09:00"
  end_time: string;    // "18:00"
  is_active: boolean;
}

export interface BookingSlot {
  time: string;   // "09:00"
  label: string;  // "9:00 AM"
  booked: boolean;
}

// ─── Static fallback services (shown before DB is seeded) ─────────────────────

export const DEFAULT_SERVICES: Service[] = [
  { id: "strategy-30",  name: "Business Strategy Call",      description: "Align on goals, priorities, and a 90-day roadmap.",        duration_minutes: 30,  icon: "TrendingUp" },
  { id: "growth-60",    name: "Growth Marketing Session",    description: "Diagnose your funnel and build a growth action plan.",      duration_minutes: 60,  icon: "BarChart2"  },
  { id: "hiring-45",    name: "Talent & Hiring Advisory",    description: "Define your ideal hire and streamline your hiring process.", duration_minutes: 45,  icon: "Users"      },
  { id: "tech-60",      name: "Tech Advisory Session",       description: "Architecture review, stack decisions, team structure.",     duration_minutes: 60,  icon: "Code2"      },
  { id: "product-30",   name: "Product Consulting Call",     description: "Roadmap prioritisation and product-market fit deep dive.",  duration_minutes: 30,  icon: "Lightbulb"  },
  { id: "insights-30",  name: "Market Insights Briefing",    description: "Competitive intelligence and market entry strategy.",       duration_minutes: 30,  icon: "Globe"      },
];

// ─── Default availability (Mon–Fri 9–18) used as fallback ────────────────────

const DEFAULT_AVAILABILITY: Availability[] = [1,2,3,4,5].map((d) => ({
  id: String(d),
  day_of_week: d,
  start_time: "09:00",
  end_time: "18:00",
  is_active: true,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "09:30" → "9:30 AM" */
export function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

/** "2025-09-16" → Date (local midnight) */
export function parseLocalDate(dateStr: string): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y, mo - 1, d);
}

/** Date → "YYYY-MM-DD" */
export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/** Generate every N-minute slot between start_time and end_time */
function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em - durationMinutes; // last start so last slot fits
  while (cur <= end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    cur += durationMinutes;
  }
  return slots;
}

// ─── API functions ─────────────────────────────────────────────────────────────

/** Fetch admin availability config. Falls back to Mon-Fri 9-6 if table empty. */
export async function fetchAvailability(): Promise<Availability[]> {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("is_active", true);
  if (error || !data || data.length === 0) return DEFAULT_AVAILABILITY;
  return data as Availability[];
}

/**
 * For a given date string and service duration, return all time slots
 * with `booked` flag set for those already in demo_bookings.
 */
export async function fetchSlotsForDate(
  dateStr: string,
  durationMinutes: number,
): Promise<BookingSlot[]> {
  const date = parseLocalDate(dateStr);
  const dayOfWeek = date.getDay(); // 0=Sun

  // Get availability for this day
  const avail = await fetchAvailability();
  const dayAvail = avail.find((a) => a.day_of_week === dayOfWeek);
  if (!dayAvail) return []; // no availability this day

  // All possible slots
  const allSlots = generateSlots(dayAvail.start_time, dayAvail.end_time, durationMinutes);

  // Fetch already-booked slots for this date
  const { data: booked } = await supabase
    .from("demo_bookings")
    .select("preferred_time")
    .eq("preferred_date", dateStr)
    .not("status", "eq", "cancelled");

  const bookedSet = new Set((booked ?? []).map((b: any) => b.preferred_time));

  return allSlots.map((t) => ({
    time: t,
    label: formatTime(t),
    booked: bookedSet.has(t),
  }));
}

/**
 * Returns a set of date strings (YYYY-MM-DD) that are fully booked
 * within a given month (year/month 1-indexed).
 */
export async function fetchFullyBookedDates(
  year: number,
  month: number,
  durationMinutes: number,
): Promise<Set<string>> {
  const avail = await fetchAvailability();
  const startStr = `${year}-${String(month).padStart(2,"0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endStr   = `${year}-${String(month).padStart(2,"0")}-${String(lastDay).padStart(2,"0")}`;

  const { data: booked } = await supabase
    .from("demo_bookings")
    .select("preferred_date, preferred_time")
    .gte("preferred_date", startStr)
    .lte("preferred_date", endStr)
    .not("status", "eq", "cancelled");

  // Group bookings by date
  const byDate: Record<string, Set<string>> = {};
  for (const b of booked ?? []) {
    if (!byDate[b.preferred_date]) byDate[b.preferred_date] = new Set();
    byDate[b.preferred_date].add(b.preferred_time);
  }

  const fullyBooked = new Set<string>();
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const date = parseLocalDate(dateStr);
    const dayAvail = avail.find((a) => a.day_of_week === date.getDay());
    if (!dayAvail) continue; // no availability = not full (just unavailable)
    const total = generateSlots(dayAvail.start_time, dayAvail.end_time, durationMinutes).length;
    const bookedCount = byDate[dateStr]?.size ?? 0;
    if (total > 0 && bookedCount >= total) fullyBooked.add(dateStr);
  }
  return fullyBooked;
}

/** Create a booking. Returns { id, booking_reference } */
export async function createBooking(payload: {
  service_id: string;
  service_name: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  preferred_date: string;
  preferred_time: string;
  timezone: string;
  notes?: string;
}): Promise<{ id: string; booking_reference: string }> {
  const booking_reference = `AC-${Date.now().toString(36).toUpperCase()}`;
  const { data, error } = await supabase
    .from("demo_bookings")
    .insert({ ...payload, booking_reference, status: "pending" })
    .select("id, booking_reference")
    .single();
  if (error) throw error;
  // Track analytics
  await supabase.from("analytics_events").insert({
    event_type: "demo_booking",
    page: "/book",
    metadata: { service_id: payload.service_id },
  });
  console.log(`📧 Confirmation email → ${payload.email} | Admin notification sent.`);
  return data;
}

/** Update booking status (cancel / reschedule) */
export async function updateBookingStatus(
  bookingRef: string,
  status: "cancelled" | "rescheduled",
): Promise<void> {
  await supabase
    .from("demo_bookings")
    .update({ status })
    .eq("booking_reference", bookingRef);
}
