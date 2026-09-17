import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchAvailability,
  fetchFullyBookedDates,
  toDateStr,
} from "@/lib/booking";

interface Props {
  durationMinutes: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function BookingCalendar({ durationMinutes, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth() + 1); // 1-indexed
  const [availDays, setAvailDays]   = useState<Set<number>>(new Set());
  const [fullyBooked, setFullyBooked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load availability config + booked dates for this month
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchAvailability(),
      fetchFullyBookedDates(year, month, durationMinutes),
    ]).then(([avail, full]) => {
      if (cancelled) return;
      setAvailDays(new Set(avail.map((a) => a.day_of_week)));
      setFullyBooked(full);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [year, month, durationMinutes]);

  function prevMonth() {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  }

  // Build the calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function getState(day: number): "past" | "unavailable" | "full" | "available" | "selected" | "today" {
    const d = new Date(year, month - 1, day);
    const dateStr = toDateStr(d);
    if (dateStr === selectedDate) return "selected";
    if (d < today) return "past";
    const dow = d.getDay();
    if (!availDays.has(dow)) return "unavailable";
    if (fullyBooked.has(dateStr)) return "full";
    if (d.getTime() === today.getTime()) return "today";
    return "available";
  }

  return (
    <div className="w-full select-none">
      {/* Month header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-white/20 hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <h3 className="text-sm font-semibold text-white">
          {MONTHS[month - 1]} {year}
        </h3>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-white/20 hover:text-white transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      {loading ? (
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const state = getState(day);
            const dateStr = toDateStr(new Date(year, month - 1, day));
            const isClickable = state === "available" || state === "today";

            return (
              <button
                key={i}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelectDate(dateStr)}
                aria-label={`${MONTHS[month - 1]} ${day}, ${year}${state === "full" ? " — fully booked" : ""}`}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all",
                  state === "selected" &&
                    "bg-blue-500 text-white shadow-[0_0_16px_-2px_rgba(59,130,246,0.7)]",
                  state === "today" &&
                    "ring-2 ring-blue-500/60 text-white hover:bg-blue-500/20",
                  state === "available" &&
                    "text-white hover:bg-white/10",
                  state === "full" &&
                    "text-white/25 cursor-not-allowed",
                  (state === "past" || state === "unavailable") &&
                    "text-white/20 cursor-not-allowed",
                )}
              >
                {day}
                {/* Available dot */}
                {state === "available" && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-blue-400" />
                )}
                {/* Full label */}
                {state === "full" && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-white/25 leading-none">
                    Full
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
