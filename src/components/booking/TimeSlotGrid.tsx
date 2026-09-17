import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchSlotsForDate, type BookingSlot } from "@/lib/booking";

interface Props {
  date: string;               // "YYYY-MM-DD"
  durationMinutes: number;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  timezone: string;
  onChangeTimezone: (tz: string) => void;
}

const COMMON_TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

export function TimeSlotGrid({
  date,
  durationMinutes,
  selectedTime,
  onSelectTime,
  timezone,
  onChangeTimezone,
}: Props) {
  const [slots, setSlots]       = useState<BookingSlot[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showTzPicker, setShowTzPicker] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSlotsForDate(date, durationMinutes).then((s) => {
      if (!cancelled) { setSlots(s); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [date, durationMinutes]);

  // Format display date: "Tuesday, Sep 16"
  const [y, mo, d] = date.split("-").map(Number);
  const dateObj = new Date(y, mo - 1, d);
  const displayDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  const available = slots.filter((s) => !s.booked);

  return (
    <div className="flex flex-col gap-5">
      {/* Timezone row */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTzPicker((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 hover:border-white/20 hover:text-white transition-colors"
        >
          <Globe className="size-4 text-blue-400 shrink-0" />
          <span className="truncate max-w-[200px]">{timezone}</span>
          <ChevronDown className={cn("size-3.5 ml-1 text-white/40 transition-transform", showTzPicker && "rotate-180")} />
        </button>

        {showTzPicker && (
          <div className="absolute left-0 top-full mt-1 z-20 w-64 rounded-2xl border border-white/10 bg-[#131824] shadow-2xl overflow-hidden">
            <div className="max-h-56 overflow-y-auto p-1">
              {COMMON_TIMEZONES.map((tz) => (
                <button
                  key={tz}
                  type="button"
                  onClick={() => { onChangeTimezone(tz); setShowTzPicker(false); }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    tz === timezone
                      ? "bg-blue-500/20 text-blue-300"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {tz === timezone && <span className="size-1.5 rounded-full bg-blue-400 shrink-0" />}
                  {tz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date heading */}
      <h3 className="text-base font-semibold text-white">{displayDate}</h3>

      {/* Slots */}
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/3 py-10 text-center">
          <p className="text-sm text-white/50">No availability on this day.</p>
          <p className="mt-1 text-xs text-white/30">Select another date.</p>
        </div>
      ) : available.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/3 py-10 text-center">
          <p className="text-sm text-white/50">Fully booked for this day.</p>
          <p className="mt-1 text-xs text-white/30">Please select another date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={slot.booked}
              onClick={() => !slot.booked && onSelectTime(slot.time)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-xs font-medium transition-all",
                slot.booked
                  ? "cursor-not-allowed border-white/5 text-white/20"
                  : selectedTime === slot.time
                  ? "border-blue-500 bg-blue-500 text-white shadow-[0_0_16px_-4px_rgba(59,130,246,0.8)]"
                  : "border-white/10 text-white/80 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white",
              )}
            >
              <span className={cn(slot.booked && "line-through")}>{slot.label}</span>
              {slot.booked && (
                <span className="mt-0.5 text-[9px] text-white/25 leading-none">Booked</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Slot count */}
      {!loading && slots.length > 0 && (
        <p className="text-xs text-white/35">
          {available.length} of {slots.length} slots available &bull; {durationMinutes} min each
        </p>
      )}
    </div>
  );
}
