import { useState } from "react";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./bits";
import { supabase } from "@/lib/supabase";

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
            <a
              href="mailto:anshconsultancy@mail.com"
              className="text-sm text-center text-accent hover:text-foreground transition-colors"
            >
              anshconsultancy@mail.com
            </a>
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
          <p>© {new Date().getFullYear()} Ansh Consultancy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
