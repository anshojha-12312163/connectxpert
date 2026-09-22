import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ConnectXpert" },
      { name: "description", content: "Get in touch with ConnectXpert. Book a consultation, send an inquiry, or join our specialist network." },
    ],
  }),
  component: ContactPage,
});

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", company: "", message: "" };

function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletter, setNewsletter] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    const { error } = await supabase.from("contacts").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      message: form.message.trim(),
    });
    if (error) { setStatus("error"); return; }
    // track analytics event
    await supabase.from("analytics_events").insert({ event_type: "contact_form_submit", page: "/contact" });
    setStatus("success");
    setForm(EMPTY);
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletter) return;
    setNlStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: newsletter });
    if (error && error.code !== "23505") { setNlStatus("error"); return; }
    setNlStatus("success");
    setNewsletter("");
  }

  const field = (key: keyof FormState, label: string, type = "text", isArea = false) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={key} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      {isArea ? (
        <textarea
          id={key}
          rows={5}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={`w-full resize-none rounded-xl border bg-surface-2/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 ${errors[key] ? "border-destructive" : "border-border focus:border-primary/60"}`}
        />
      ) : (
        <input
          id={key}
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={`Your ${label.toLowerCase()}...`}
          className={`w-full rounded-xl border bg-surface-2/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 ${errors[key] ? "border-destructive" : "border-border focus:border-primary/60"}`}
        />
      )}
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">

        {/* Header */}
        <section className="relative overflow-hidden py-16">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Contact Us
            </span>
            <h1 className="mt-6 text-5xl font-semibold text-gradient sm:text-6xl">Let's talk.</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Free 30-minute consultation, no strings attached. Tell us what you're working on.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

            {/* Form */}
            <div className="rounded-3xl border border-border bg-surface-2/40 p-8">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <span className="flex size-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/40">
                    <Check className="size-7 text-green-400" />
                  </span>
                  <h2 className="text-xl font-semibold">Message sent!</h2>
                  <p className="text-sm text-muted-foreground max-w-xs">We'll be in touch within 24 hours. Looking forward to learning about your business.</p>
                  <button onClick={() => setStatus("idle")} className="mt-2 text-sm text-accent hover:text-foreground transition-colors">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="text-xl font-semibold mb-2">Send us a message</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("name", "Full Name")}
                    {field("email", "Email Address", "email")}
                  </div>
                  {field("company", "Company (Optional)")}
                  {field("message", "Message", "text", true)}
                  {status === "error" && (
                    <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                  >
                    {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Info + newsletter */}
            <div className="flex flex-col gap-6">
              {/* Contact info */}
              <div className="rounded-3xl border border-border bg-surface-2/40 p-7">
                <h3 className="text-base font-semibold mb-5">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "anshconsultancy@mail.com", href: "mailto:anshconsultancy@mail.com" },
                    { icon: Phone, label: "+91 98765 43210", href: "tel:+919876543210" },
                    { icon: MapPin, label: "New Delhi, India (Remote-First)", href: "#" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
                      {label}
                    </a>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    We typically respond within <span className="text-foreground font-medium">4 business hours.</span>
                  </p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="rounded-3xl border border-border bg-surface-2/40 p-7">
                <h3 className="text-base font-semibold">Get weekly growth tips</h3>
                <p className="mt-1.5 mb-4 text-sm text-muted-foreground">Practical frameworks and insights — free, every week.</p>
                {nlStatus === "success" ? (
                  <p className="text-sm text-green-400 flex items-center gap-2"><Check className="size-4" /> You're subscribed!</p>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={newsletter}
                      onChange={(e) => setNewsletter(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
                    />
                    <button
                      type="submit"
                      disabled={nlStatus === "loading"}
                      className="rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {nlStatus === "loading" ? "Subscribing..." : "Subscribe — It's Free"}
                    </button>
                    {nlStatus === "error" && <p className="text-xs text-destructive">Something went wrong. Try again.</p>}
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
