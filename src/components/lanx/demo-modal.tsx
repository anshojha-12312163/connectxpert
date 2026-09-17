import { useState, useEffect } from "react";
import { X, Check, Loader2, Calendar, Clock, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

const EMPTY = { name: "", email: "", company: "", phone: "", date: "", time: "", notes: "" };

export function DemoModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [tz, setTz] = useState("");

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  function validate() {
    const e: Partial<typeof EMPTY> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    const { error } = await supabase.from("demo_bookings").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      phone: form.phone.trim() || null,
      preferred_date: form.date,
      preferred_time: form.time,
      timezone: tz,
      notes: form.notes.trim() || null,
      status: "pending",
    });
    if (error) { setStatus("error"); return; }
    await supabase.from("analytics_events").insert({ event_type: "demo_booking", page: "/demo-modal" });
    console.log("✅ Demo booking confirmation would be emailed to:", form.email);
    setStatus("success");
  }

  const f = (key: keyof typeof EMPTY, label: string, type = "text", optional = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}{optional && <span className="ml-1 text-foreground/30">(optional)</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(ev) => setForm({ ...form, [key]: ev.target.value })}
        className={cn(
          "w-full rounded-xl border bg-surface-2/60 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/40",
          errors[key] ? "border-destructive" : "border-border focus:border-primary/60",
        )}
      />
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  // Today's date min value
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a Demo"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-7 py-5 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Book a Free Demo</h2>
          <button onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-7 py-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10">
                <Check className="size-7 text-green-400" />
              </span>
              <h3 className="text-xl font-semibold">You're booked!</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                We've received your request for <strong className="text-foreground">{form.date}</strong> at <strong className="text-foreground">{form.time}</strong>.
                A confirmation will be sent to <strong className="text-foreground">{form.email}</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                {f("name", "Full Name")}
                {f("email", "Email Address", "email")}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {f("company", "Company", "text", true)}
                {f("phone", "Phone", "tel", true)}
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3" /> Preferred Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={cn(
                    "w-full rounded-xl border bg-surface-2/60 px-4 py-2.5 text-sm outline-none transition-colors",
                    errors.date ? "border-destructive" : "border-border focus:border-primary/60",
                  )}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              {/* Time slots */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3" /> Preferred Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, time: t })}
                      className={cn(
                        "rounded-xl border px-2 py-2 text-xs font-medium transition-all",
                        form.time === t
                          ? "border-primary/60 bg-primary/20 text-accent"
                          : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
              </div>

              {/* Timezone */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/40 px-4 py-2.5">
                <Globe className="size-4 text-accent shrink-0" />
                <span className="text-xs text-muted-foreground">Timezone: <span className="text-foreground">{tz}</span></span>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Notes <span className="text-foreground/30">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Tell us about your business and what you'd like to discuss..."
                  className="w-full resize-none rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Calendar className="size-4" />}
                {status === "loading" ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
