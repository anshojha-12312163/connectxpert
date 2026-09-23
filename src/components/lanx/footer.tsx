import { useState } from "react";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Send, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Globe,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "./bits";
import { supabase } from "@/lib/supabase";
import { AnimatedFooter } from "./animated-footer";

const HIDDEN_PATHS = ["/dashboard", "/login", "/signup"];

const platformLinks = [
  { label: "Find My Expert", href: "/find-my-expert", badge: "AI Match" },
  { label: "Browse Specialists", href: "/experts" },
  { label: "Book Consultation", href: "/book" },
  { label: "Plans & Pricing", href: "/pricing" },
  { label: "Become an Expert", href: "/become-an-expert" },
];

const companyLinks = [
  { label: "About Ansh Consultancy", href: "/about" },
  { label: "Core Services", href: "/services" },
  { label: "Client Portfolio", href: "/portfolio" },
  { label: "Strategic Blog", href: "/blog" },
  { label: "Contact Advisory", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/privacy" },
  { label: "Security & Trust", href: "/about" },
  { label: "Client Support", href: "/contact" },
];

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { label: "Twitter / X", icon: Twitter, href: "https://twitter.com" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
];

export function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isHidden = HIDDEN_PATHS.some((p) => location.pathname.startsWith(p));

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });
      if (error && error.code !== "23505") {
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  if (isHidden) return null;

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/80 pt-20 pb-10 backdrop-blur-2xl overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pb-16 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Contact Info (5 Cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ConnectXpert by <strong className="text-slate-200 font-semibold">Ansh Consultancy</strong> bridges high-growth enterprises with verified fractional leaders, AI architects, and strategic operators worldwide.
            </p>

            {/* Operational Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for Global Advisory & Strategic Consultation</span>
            </div>

            {/* Direct Contact Cards */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="mailto:anshojha420@gmail.com"
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-300 transition-all duration-200 hover:border-primary/40 hover:bg-slate-900 hover:text-white"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email Advisory</p>
                  <p className="font-medium text-slate-200">anshojha420@gmail.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/917307627039?text=Hi%20Ansh%20Consultancy%20Team!%0AName:%20%0ACompany:%20%0AInterest:%20Advisory%20Services%0AMessage:%20I%20would%20like%20to%20connect%20with%20Ansh%20Consultancy."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-300 transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-950/40"
              >
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="size-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider">WhatsApp Connect</p>
                  <p className="font-semibold text-emerald-300">+91 7307627039</p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links (2 Cols) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Platform
            </h3>
            <ul className="flex flex-col gap-2.5">
              {platformLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span>{l.label}</span>
                    {l.badge && (
                      <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-semibold text-accent group-hover:bg-primary/30">
                        {l.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Trust (2 Cols) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
              <Globe className="size-3.5 text-accent" />
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Direct Booking (3 Cols) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-200">
              Executive Briefing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive weekly playbooks on AI strategy, operational scaling, and enterprise growth.
            </p>

            <form onSubmit={handleNewsletter} className="relative mt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 pr-12 text-xs text-white placeholder:text-slate-500 outline-none transition-all focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center justify-center rounded-lg px-3 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Send className="size-3.5" />
                </button>
              </div>

              {status === "success" && (
                <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> Subscribed! Welcome to executive insights.
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-xs text-red-400">Unable to subscribe right now. Please retry.</p>
              )}
            </form>

            <div className="pt-2">
              <Link
                to="/book"
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <span>Book 1-on-1 Consultation</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Middle Bar: Social Networks */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Encrypted Video Sessions • Verified NDA Protection • Instant Google Meet & Zoom Sync</span>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-400 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-white hover:-translate-y-0.5"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} <strong className="text-slate-400 font-medium">ConnectXpert</strong> by <strong className="text-slate-400 font-medium">Ansh Consultancy</strong>. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Brand Marquee */}
      <AnimatedFooter
        headingLines={["ConnectXpert"]}
        background="#030712"
        charColor="#3b82f6"
        hoverColor="#60a5fa"
        hoverCharColor="#030712"
        revealOnScroll={false}
        className="mt-10 opacity-70"
      />
    </footer>
  );
}

