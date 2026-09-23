import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  Calendar,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { supabase } from "@/lib/supabase";
import anshPhoto from "@/assets/ansh-ojha.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Connect with Ansh Ojha — Ansh Consultancy & ConnectXpert" },
      { name: "description", content: "Get in direct touch with Ansh Ojha and the ConnectXpert advisory team. Schedule 1-on-1 sessions, book strategy audits, or send inquiries." },
    ],
  }),
  component: ContactPage,
});

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "Strategic Advisory",
  message: "",
};

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
      message: `[Service: ${form.service}] [Phone: ${form.phone || "N/A"}]\n\n${form.message.trim()}`,
    });
    if (error) {
      setStatus("error");
      return;
    }
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
    if (error && error.code !== "23505") {
      setNlStatus("error");
      return;
    }
    setNlStatus("success");
    setNewsletter("");
  }

  const field = (
    key: keyof FormState,
    label: string,
    type = "text",
    placeholder = `Your ${label.toLowerCase()}...`,
    isArea = false
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={key} className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>
      {isArea ? (
        <textarea
          id={key}
          rows={4}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className={`w-full resize-none rounded-xl border bg-[#0f172a]/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 ${
            errors[key] ? "border-rose-500 focus:border-rose-400" : "border-slate-700/80 focus:border-emerald-500"
          }`}
        />
      ) : (
        <input
          id={key}
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-[#0f172a]/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 ${
            errors[key] ? "border-rose-500 focus:border-rose-400" : "border-slate-700/80 focus:border-emerald-500"
          }`}
        />
      )}
      {errors[key] && <p className="text-xs text-rose-400">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Nav />
      <main className="pt-24 pb-20">

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-600/15 blur-[150px]" />
          <div className="pointer-events-none absolute top-10 right-10 size-[400px] rounded-full bg-blue-600/10 blur-[130px]" />

          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 shadow-sm shadow-emerald-950">
                <Sparkles className="size-3.5" /> Direct Advisory & Inquiries
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Let's build something <span className="text-gradient">remarkable.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
                Connect directly with <strong className="text-emerald-400 font-semibold">Ansh Ojha</strong> and the Ansh Consultancy team for high-velocity strategy, enterprise architecture, and scaling guidance.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5">

          {/* MAIN FOUNDER SPOTLIGHT & DIRECT CONTACT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-14 relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#0c1322] via-[#0e172a] to-[#071324] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl"
          >
            {/* Top Bar with Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3.5 bg-emerald-500" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-300">
                  Founder Available for Strategy & Client Consultation
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Verified Managing Principal</span>
              </div>
            </div>

            {/* Founder Profile Layout */}
            <div className="grid gap-8 lg:grid-cols-[auto_1fr] items-center">
              
              {/* Permanent XL Spotlight Photo */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px]">
                  <div className="relative group overflow-hidden rounded-3xl border-2 border-emerald-500/40 shadow-2xl shadow-black/80">
                    <img
                      src={anshPhoto}
                      alt="Ansh Ojha - Founder & Managing Principal"
                      className="h-80 sm:h-96 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/85 border border-emerald-500/50 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                        <ShieldCheck className="size-3.5 text-emerald-400" /> Verified Principal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Details & Fast Connect Actions */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ansh Ojha</h2>
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-0.5 text-xs font-semibold text-blue-400">
                      Founder & Managing Principal
                    </span>
                  </div>

                  <p className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                    <Briefcase className="size-4" /> Ansh Consultancy & ConnectXpert Advisory
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
                    Operator-led strategic consulting helping founders and enterprise executives scale products, architect cloud solutions, and accelerate revenue operations. Connect directly via WhatsApp, direct email, or book a 1-on-1 session.
                  </p>

                  {/* Key Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-400">Response Window</p>
                      <p className="text-sm font-bold text-white mt-0.5">&lt; 4 Hours</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-400">Consultation Focus</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">Strategy & Cloud</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm font-bold text-white mt-0.5">New Delhi (Global)</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/917307627039?text=Hi%20Ansh!%20I%20would%20like%20to%20connect%20for%20a%20strategy%20consultation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:scale-[1.02] shadow-lg shadow-emerald-950/50"
                  >
                    <MessageCircle className="size-4" /> Message on WhatsApp
                  </a>

                  <a
                    href="mailto:anshojha420@gmail.com?subject=Strategic%20Advisory%20Inquiry%20-%20Ansh%20Consultancy"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#141d33] px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-[#1c2744] hover:border-slate-500 transition-colors"
                  >
                    <Mail className="size-4 text-emerald-400" /> anshojha420@gmail.com
                  </a>

                  <a
                    href="tel:+917307627039"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#141d33] px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-[#1c2744] hover:border-slate-500 transition-colors"
                  >
                    <Phone className="size-4 text-blue-400" /> +91 73076 27039
                  </a>

                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors ml-auto"
                  >
                    <Calendar className="size-4" /> Book 1-on-1 Session <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>

          {/* TWO COLUMN SECTION: CONTACT FORM & INFORMATION */}
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Inquiries Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-slate-800 bg-[#0d1424]/90 p-7 sm:p-9 shadow-xl backdrop-blur-xl"
            >
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/40">
                    <Check className="size-8 text-emerald-400" />
                  </span>
                  <h2 className="text-2xl font-bold text-white">Inquiry Received!</h2>
                  <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                    Thank you for reaching out. Ansh Ojha and our advisory team will review your message and reply within 4 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send an Advisory Inquiry</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out the details below to request advisory, technical audits, or dedicated project sprints.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("name", "Full Name", "text", "e.g. Rahul Sharma")}
                    {field("email", "Email Address", "email", "rahul@company.com")}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("phone", "Phone / WhatsApp (Optional)", "tel", "+91 98765 43210")}
                    {field("company", "Company / Venture Name", "text", "e.g. Acme Labs Inc.")}
                  </div>

                  {/* Service selector */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Area of Advisory
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl border border-slate-700/80 bg-[#0f172a]/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-emerald-500"
                    >
                      <option value="Strategic Advisory">Strategic Executive Advisory & Leadership</option>
                      <option value="Cloud Architecture">Cloud Architecture & Infrastructure Audit</option>
                      <option value="Product Scaling">Product Roadmap & Scaling Sprint</option>
                      <option value="GTM & Growth">GTM, Sales Ops & Revenue Architecture</option>
                      <option value="Specialist Hiring">Fractional Specialist & Expert Network</option>
                      <option value="General Inquiry">General Consultation & Other</option>
                    </select>
                  </div>

                  {field("message", "Project Overview & Requirements", "text", "Tell us what challenge or milestone you are targeting...", true)}

                  {status === "error" && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                      Something went wrong submitting your inquiry. Please try again or reach us via WhatsApp directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-emerald-950/40"
                  >
                    {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {status === "loading" ? "Submitting Inquiry..." : "Submit Inquiry to Ansh Consultancy"}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Sidebar Details & Information */}
            <div className="flex flex-col gap-6">

              {/* Direct Info Card */}
              <div className="rounded-3xl border border-slate-800 bg-[#0d1424]/90 p-7 shadow-xl backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-400" /> Direct Contact Information
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      icon: Mail,
                      title: "Direct Founder Email",
                      label: "anshojha420@gmail.com",
                      href: "mailto:anshojha420@gmail.com",
                    },
                    {
                      icon: Mail,
                      title: "Consultancy Desk",
                      label: "anshconsultancy@mail.com",
                      href: "mailto:anshconsultancy@mail.com",
                    },
                    {
                      icon: Phone,
                      title: "Phone & WhatsApp",
                      label: "+91 73076 27039",
                      href: "tel:+917307627039",
                    },
                    {
                      icon: MapPin,
                      title: "Headquarters & Advisory Hub",
                      label: "New Delhi, India (Global Remote-First)",
                      href: "#",
                    },
                  ].map(({ icon: Icon, title, label, href }) => (
                    <div key={label} className="flex items-start gap-3.5 p-2 rounded-2xl hover:bg-white/[0.02] transition-colors">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{title}</p>
                        <a href={href} className="text-sm font-semibold text-slate-200 hover:text-emerald-400 transition-colors">
                          {label}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
                  <Clock className="size-4 text-emerald-400 shrink-0" />
                  <span>
                    Average SLA: inquiries answered within <strong className="text-white">4 business hours</strong>.
                  </span>
                </div>
              </div>

              {/* Weekly Growth Tips / Newsletter Card */}
              <div className="rounded-3xl border border-slate-800 bg-[#0d1424]/90 p-7 shadow-xl backdrop-blur-xl">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  <Sparkles className="size-3" /> Exclusive Intelligence
                </span>
                <h3 className="text-lg font-bold text-white">Ansh Consultancy Briefing</h3>
                <p className="mt-1.5 mb-4 text-xs text-slate-300 leading-relaxed">
                  Weekly operator blueprints, cloud architecture teardowns, and growth playbooks sent every Monday.
                </p>

                {nlStatus === "success" ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="size-4" /> You're subscribed to the weekly executive briefing!
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex flex-col gap-2.5">
                    <input
                      type="email"
                      value={newsletter}
                      onChange={(e) => setNewsletter(e.target.value)}
                      placeholder="your.email@company.com"
                      required
                      className="w-full rounded-xl border border-slate-700/80 bg-[#0f172a]/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={nlStatus === "loading"}
                      className="rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-white hover:scale-[1.01] disabled:opacity-60"
                    >
                      {nlStatus === "loading" ? "Subscribing..." : "Subscribe to Weekly Insights"}
                    </button>
                    {nlStatus === "error" && (
                      <p className="text-xs text-rose-400">Subscription failed. Please verify your email.</p>
                    )}
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
