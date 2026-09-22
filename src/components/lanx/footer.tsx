import { useState } from "react";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./bits";
import { supabase } from "@/lib/supabase";
import { AnimatedFooter } from "./animated-footer";

const HIDDEN_PATHS = ["/dashboard", "/login", "/signup"];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

const socials = [
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "Twitter / X", icon: Twitter, href: "https://twitter.com" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
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
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    if (error && error.code !== "23505") {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  if (isHidden) return null;

  return (
    <footer className="relative border-t border-border pt-14 pb-8">
      <div className="mx-auto max-w-6xl px-5">

        {/* Top row */}
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:justify-between">
          {/* Brand + newsletter */}
          <div className="flex flex-col gap-5 max-w-sm">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Helping businesses launch, grow, and scale with expert consulting and proven strategies.
            </p>
            {/* Newsletter */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                Get weekly growth tips — free
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)" }}
                  aria-label="Subscribe"
                >
                  <Send className="size-4" />
                </button>
              </form>
              {status === "success" && (
                <p className="mt-2 text-xs text-green-400">You're in! Welcome aboard.</p>
              )}
              {status === "error" && (
                <p className="mt-2 text-xs text-destructive">Something went wrong. Try again.</p>
              )}
            </div>
          </div>

          {/* Nav links grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-4">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <Link
              to="/contact"
              className="rounded-xl px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Book a Demo
            </Link>
            <div className="flex flex-col gap-1 mt-1">
              <a
                href="mailto:anshojha420@gmail.com"
                className="text-sm text-center text-accent hover:text-foreground transition-colors"
              >
                anshojha420@gmail.com
              </a>
              <a
                href="https://wa.me/917307627039?text=Hi%20Ansh%20Consultancy%20Team!%0AName:%20%0ACompany:%20%0AInterest:%20Advisory%20Services%0AMessage:%20I%20would%20like%20to%20connect%20with%20Ansh%20Consultancy."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-center text-green-400 hover:text-green-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp: 7307627039
              </a>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-t border-border pt-4 text-sm text-foreground/85 transition-colors hover:text-foreground"
            >
              {label}
              <Icon className="size-4 text-muted-foreground" />
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ConnectXpert. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Animated ASCII footer */}
      <AnimatedFooter
        headingLines={["ConnectXpert"]}
        background="#0a0d1a"
        charColor="#3b82f6"
        hoverColor="#60a5fa"
        hoverCharColor="#0a0d1a"
        revealOnScroll={false}
        className="mt-8"
      />
    </footer>
  );
}
