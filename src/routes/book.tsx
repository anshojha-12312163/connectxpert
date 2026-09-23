import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, BarChart2, Users, Code2, Lightbulb, Globe,
  Check, ChevronLeft, CalendarPlus, Clock, Calendar,
  Mail, Loader2, RotateCcw, XCircle, ArrowRight, Video, Copy, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import {
  DEFAULT_SERVICES,
  createBooking,
  updateBookingStatus,
  formatTime,
  type Service,
} from "@/lib/booking";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Consultation — ConnectXpert" },
      { name: "description", content: "Book a free consulting session with ConnectXpert. Choose your service, pick a time, and get started." },
    ],
  }),
  component: BookPage,
});

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, BarChart2, Users, Code2, Lightbulb, Globe,
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEP_LABELS = ["Service", "Date", "Time", "Details", "Review", "Done"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                  done
                    ? "border-blue-500 bg-blue-500 text-white"
                    : active
                    ? "border-blue-500 bg-blue-500/15 text-blue-400"
                    : "border-white/10 bg-transparent text-white/30",
                )}
              >
                {done ? <Check className="size-3.5" /> : num}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-[10px] font-medium transition-colors",
                  active ? "text-blue-400" : done ? "text-white/50" : "text-white/20",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-0.5 mb-4 transition-all duration-300",
                  done ? "bg-blue-500" : "bg-white/8",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Service selection ───────────────────────────────────────────────
function StepService({
  onSelect,
}: {
  onSelect: (s: Service) => void;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="mb-1 text-2xl font-semibold text-white">Choose a service</h2>
      <p className="mb-8 text-sm text-white/50">What would you like to talk about?</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_SERVICES.map((s) => {
          const Icon = ICON_MAP[s.icon] ?? Globe;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/3 p-6 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/8 hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.4)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                <Icon className="size-5 text-blue-400" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-semibold text-white leading-snug">{s.name}</p>
                <p className="mt-1 text-xs text-white/50 leading-relaxed">{s.description}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/5">
                <Clock className="size-3.5 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">{s.duration_minutes} min</span>
                <ArrowRight className="size-3.5 ml-auto text-white/20 transition-colors group-hover:text-blue-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 + 3 — Date + Time (combined, side-by-side) ────────────────────────
function StepDateTime({
  service,
  selectedDate,
  selectedTime,
  timezone,
  onSelectDate,
  onSelectTime,
  onChangeTimezone,
  onNext,
}: {
  service: Service;
  selectedDate: string | null;
  selectedTime: string | null;
  timezone: string;
  onSelectDate: (d: string) => void;
  onSelectTime: (t: string) => void;
  onChangeTimezone: (tz: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="mb-1 text-2xl font-semibold text-white">Pick a date &amp; time</h2>
      <p className="mb-6 text-sm text-white/50">
        Showing availability for <span className="text-blue-400">{service.name}</span> ({service.duration_minutes} min)
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Calendar */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
          <BookingCalendar
            durationMinutes={service.duration_minutes}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        </div>

        {/* Time slots */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
          {!selectedDate ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <Calendar className="size-10 text-white/15 mb-3" />
              <p className="text-sm text-white/40">Select a date to see available time slots</p>
            </div>
          ) : (
            <TimeSlotGrid
              date={selectedDate}
              durationMinutes={service.duration_minutes}
              selectedTime={selectedTime}
              onSelectTime={onSelectTime}
              timezone={timezone}
              onChangeTimezone={onChangeTimezone}
            />
          )}
        </div>
      </div>

      {/* Next button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!selectedDate || !selectedTime}
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 — Details form ────────────────────────────────────────────────────
interface Details {
  name: string;
  email: string;
  company: string;
  phone: string;
  meeting_platform?: "google_meet" | "zoom" | "connectxpert";
  notes: string;
}

function StepDetails({
  details,
  onChange,
  onNext,
}: {
  details: Details;
  onChange: (d: Details) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Details>>({});

  function validate() {
    const e: Partial<Details> = {};
    if (!details.name.trim()) e.name = "Required";
    if (!details.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  const fields: { key: keyof Details; label: string; type?: string; optional?: boolean; area?: boolean }[] = [
    { key: "name",    label: "Full Name",    type: "text" },
    { key: "email",   label: "Email Address", type: "email" },
    { key: "company", label: "Company",       type: "text", optional: true },
    { key: "phone",   label: "Phone",         type: "tel",  optional: true },
    { key: "notes",   label: "Notes / Agenda", optional: true, area: true },
  ];

  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="mb-1 text-2xl font-semibold text-white">Your details</h2>
      <p className="mb-8 text-sm text-white/50">We'll use this to confirm your booking and send a calendar invite.</p>

      <div className="space-y-4">
        {fields.map(({ key, label, type = "text", optional, area }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-white/40">
              {label}
              {optional && <span className="ml-1 normal-case tracking-normal text-white/20">(optional)</span>}
            </label>
            {area ? (
              <textarea
                rows={3}
                value={details[key]}
                onChange={(e) => onChange({ ...details, [key]: e.target.value })}
                placeholder={`Your ${label.toLowerCase()}...`}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-500/50 transition-colors"
              />
            ) : (
              <input
                type={type}
                value={details[key]}
                onChange={(e) => onChange({ ...details, [key]: e.target.value })}
                placeholder={`Your ${label.toLowerCase()}...`}
                className={cn(
                  "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-blue-500/50 transition-colors",
                  errors[key] ? "border-red-500/60" : "border-white/10",
                )}
              />
            )}
            {errors[key] && <p className="text-xs text-red-400">{errors[key]}</p>}
          </div>
        ))}

        {/* Meeting Platform Selector */}
        <div className="flex flex-col gap-2 pt-2">
          <label className="text-xs font-medium uppercase tracking-wider text-white/40">
            Preferred Meeting Platform
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "google_meet", label: "Google Meet", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
              { id: "zoom",        label: "Zoom Video",  color: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10" },
              { id: "connectxpert",label: "In-Browser",  color: "text-blue-400",    border: "border-blue-500/30",    bg: "bg-blue-500/10" },
            ].map((p) => {
              const selected = (details.meeting_platform || "google_meet") === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange({ ...details, meeting_platform: p.id as any })}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-semibold transition-all",
                    selected
                      ? `${p.border} ${p.bg} ${p.color} ring-1 ring-white/20`
                      : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-600"
        >
          Review Booking <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}


// ─── Step 5 — Review ──────────────────────────────────────────────────────────
function StepReview({
  service,
  date,
  time,
  timezone,
  details,
  onConfirm,
  status,
}: {
  service: Service;
  date: string;
  time: string;
  timezone: string;
  details: Details;
  onConfirm: () => void;
  status: "idle" | "loading" | "error";
}) {
  const dateObj = new Date(...(date.split("-").map(Number) as [number, number, number]).map((n, i) => i === 1 ? n - 1 : n) as [number, number, number]);
  const displayDate = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const rows = [
    { label: "Service",  value: `${service.name} (${service.duration_minutes} min)` },
    { label: "Date",     value: displayDate },
    { label: "Time",     value: formatTime(time) },
    { label: "Timezone", value: timezone },
    { label: "Name",     value: details.name },
    { label: "Email",    value: details.email },
    ...(details.company ? [{ label: "Company", value: details.company }] : []),
    ...(details.phone   ? [{ label: "Phone",   value: details.phone   }] : []),
    ...(details.notes   ? [{ label: "Notes",   value: details.notes   }] : []),
  ];

  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="mb-1 text-2xl font-semibold text-white">Confirm your booking</h2>
      <p className="mb-8 text-sm text-white/50">Please review the details before confirming.</p>

      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className={cn(
              "flex items-start justify-between gap-4 px-6 py-3.5",
              i < rows.length - 1 && "border-b border-white/5",
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-white/30 shrink-0 pt-0.5 w-20">{label}</span>
            <span className="text-sm text-white text-right">{value}</span>
          </div>
        ))}
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Something went wrong. This time slot may have just been booked. Please go back and select another.
        </p>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={status === "loading"}
          onClick={onConfirm}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-600 disabled:opacity-60"
        >
          {status === "loading" ? (
            <><Loader2 className="size-4 animate-spin" /> Confirming...</>
          ) : (
            <><Check className="size-4" /> Confirm Booking</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 6 — Success ─────────────────────────────────────────────────────────
function StepSuccess({
  service,
  date,
  time,
  timezone,
  name,
  bookingRef,
  meetingUrl,
}: {
  service: Service;
  date: string;
  time: string;
  timezone: string;
  name: string;
  bookingRef: string;
  meetingUrl?: string;
}) {
  const [cancelStatus, setCancelStatus] = useState<"idle" | "done">("idle");
  const [copied, setCopied]             = useState(false);

  const dateObj = new Date(...(date.split("-").map(Number) as [number, number, number]).map((n, i) => i === 1 ? n - 1 : n) as [number, number, number]);
  const displayDate = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const liveMeetingUrl = meetingUrl || `https://meet.jit.si/cx-session-${bookingRef.toLowerCase()}`;

  // Standard Google Calendar TEMPLATE URL
  const [h, m] = time.split(":").map(Number);
  const startDateTime = new Date(dateObj);
  startDateTime.setHours(h, m, 0, 0);

  const endDateTime = new Date(dateObj);
  endDateTime.setHours(h, m + service.duration_minutes, 0, 0);

  const formatGcDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const gcDates = `${formatGcDate(startDateTime)}/${formatGcDate(endDateTime)}`;
  const eventTitle = `${service.name} — ConnectXpert`;
  const eventDetails = `Your consultation with ConnectXpert is confirmed.\n\nBooking Reference: ${bookingRef}\nService: ${service.name} (${service.duration_minutes} min)\nClient: ${name}\nTimezone: ${timezone}\n\nJoin Video Call: ${liveMeetingUrl}\n\nNeed to reschedule? Visit ${typeof window !== "undefined" ? window.location.origin : "https://connectxpert.com"}/book`;

  const gcUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${gcDates}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(liveMeetingUrl)}`;

  function handleCopyMeetingUrl() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(liveMeetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleCancel() {
    await updateBookingStatus(bookingRef, "cancelled");
    setCancelStatus("done");
  }

  if (cancelStatus === "done") {
    return (
      <div className="animate-fade-in flex flex-col items-center py-10 text-center gap-4 max-w-md mx-auto">
        <span className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <XCircle className="size-8 text-white/40" />
        </span>
        <h2 className="text-xl font-semibold text-white">Booking Cancelled</h2>
        <p className="text-sm text-white/50">Your booking (ref: <strong className="text-white">{bookingRef}</strong>) has been cancelled.</p>
        <Link
          to="/book"
          className="mt-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
        >
          Book a New Session
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col items-center py-6 text-center gap-5 max-w-lg mx-auto">
      {/* Success icon */}
      <div className="relative">
        <span className="flex size-20 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 shadow-[0_0_40px_-8px_rgba(59,130,246,0.5)]">
          <Check className="size-9 text-blue-400" />
        </span>
        <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-green-500">
          <Check className="size-3.5 text-white" />
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white">You're all set, {name.split(" ")[0]}!</h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Your <strong className="text-white">{service.name}</strong> is confirmed for{" "}
          <strong className="text-white">{displayDate}</strong> at{" "}
          <strong className="text-white">{formatTime(time)}</strong> ({timezone}).
        </p>
      </div>

      {/* Booking reference */}
      <div className="rounded-2xl border border-white/8 bg-white/3 px-8 py-4 w-full">
        <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Booking Reference</p>
        <p className="text-xl font-mono font-semibold text-blue-400 tracking-widest">{bookingRef}</p>
        <p className="mt-1 text-xs text-white/30">Keep this for your records</p>
      </div>

      {/* Video Call Room Link */}
      <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 w-full text-left space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
          <Video className="size-4" /> Live Video Meeting Room
        </div>
        <p className="text-xs text-white/60">
          Your secure encrypted meeting room has been generated. Use this link at call time:
        </p>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
          <input
            type="text"
            readOnly
            value={liveMeetingUrl}
            className="flex-1 bg-transparent text-xs font-mono text-white/80 outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopyMeetingUrl}
            className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors shrink-0"
          >
            {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <a
            href={liveMeetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-600 transition-colors shrink-0"
          >
            <ExternalLink className="size-3.5" /> Join Room
          </a>
        </div>
      </div>

      {/* Confirmation note */}
      <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-5 py-4 w-full text-left">
        <Mail className="size-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-white/60">
          A confirmation with call details has been sent to your email. Click below to add this event to your personal Google Calendar.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <a
          href={gcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 px-5 py-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/25 transition-all shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
        >
          <CalendarPlus className="size-4 text-blue-400" /> Add to Google Calendar
        </a>

        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(`Consultation Confirmed: ${service.name} [${bookingRef}]`)}&body=${encodeURIComponent(eventDetails)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/25 transition-all"
        >
          <Mail className="size-4 text-red-400" /> Send to My Gmail
        </a>

        <a
          href={`/book/ics?ref=${bookingRef}&date=${date}&time=${time}&service=${encodeURIComponent(service.name)}`}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors"
        >
          <CalendarPlus className="size-4" /> Download .ics
        </a>
      </div>

      {/* Reschedule / Cancel */}
      <div className="flex items-center gap-4 mt-2">
        <Link
          to="/book"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <RotateCcw className="size-3.5" /> Reschedule
        </Link>
        <span className="text-white/15">·</span>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400 transition-colors"
        >
          <XCircle className="size-3.5" /> Cancel Booking
        </button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
function BookPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [service, setService] = useState<Service | null>(null);
  // Step 2+3
  const [date, setDate]     = useState<string | null>(null);
  const [time, setTime]     = useState<string | null>(null);
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  // Step 4
  const [details, setDetails] = useState<Details>({
    name: "", email: "", company: "", phone: "", notes: "", meeting_platform: "google_meet",
  });
  // Step 6
  const [bookingRef, setBookingRef]   = useState("");
  const [meetingUrl, setMeetingUrl]   = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "error">("idle");

  const topRef = useRef<HTMLDivElement>(null);

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    scrollToTop();
  }, [step]);

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
    setSubmitStatus("idle");
  }

  async function handleConfirm() {
    if (!service || !date || !time) return;
    setSubmitStatus("loading");
    try {
      const result = await createBooking({
        service_id:       service.id,
        service_name:     service.name,
        name:             details.name.trim(),
        email:            details.email.trim(),
        company:          details.company.trim() || undefined,
        phone:            details.phone.trim()   || undefined,
        preferred_date:   date,
        preferred_time:   time,
        timezone,
        meeting_platform: details.meeting_platform || "google_meet",
        notes:            details.notes.trim()   || undefined,
      });
      setBookingRef(result.booking_reference);
      setMeetingUrl(result.video_room_url);
      setSubmitStatus("idle");
      setStep(6);
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <Nav />
      <main className="pt-24 pb-20">
        <div ref={topRef} className="mx-auto max-w-4xl px-5">

          {/* Page header */}
          {step < 6 && (
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                Book a Consultation
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Schedule your free session
              </h1>
              <p className="mt-2 text-sm text-white/40">
                30-minute strategy call, no commitment required.
              </p>
            </div>
          )}

          {/* Step indicator */}
          {step < 6 && <StepIndicator step={step} />}

          {/* Back button */}
          {step > 1 && step < 6 && (
            <button
              type="button"
              onClick={goBack}
              className="mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
          )}

          {/* Steps */}
          {step === 1 && (
            <StepService
              onSelect={(s) => { setService(s); setDate(null); setTime(null); setStep(2); }}
            />
          )}

          {step === 2 && service && (
            <StepDateTime
              service={service}
              selectedDate={date}
              selectedTime={time}
              timezone={timezone}
              onSelectDate={(d) => { setDate(d); setTime(null); }}
              onSelectTime={setTime}
              onChangeTimezone={setTimezone}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <StepDetails
              details={details}
              onChange={setDetails}
              onNext={() => setStep(5)}
            />
          )}

          {step === 5 && service && date && time && (
            <StepReview
              service={service}
              date={date}
              time={time}
              timezone={timezone}
              details={details}
              onConfirm={handleConfirm}
              status={submitStatus}
            />
          )}

          {step === 6 && service && date && time && (
            <StepSuccess
              service={service}
              date={date}
              time={time}
              timezone={timezone}
              name={details.name}
              bookingRef={bookingRef}
              meetingUrl={meetingUrl}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
