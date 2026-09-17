import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./bits";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const links = [
  { label: "Home",           href: "/" },
  { label: "Experts",        href: "/experts" },
  { label: "Find My Expert", href: "/find-my-expert" },
  { label: "Services",       href: "/services" },
  { label: "Pricing",        href: "/pricing" },
  { label: "Blog",           href: "/blog" },
  { label: "Contact",        href: "/contact" },
];

// Pages where the public nav + WhatsApp button should NOT render
const HIDE_ON = ["/dashboard", "/login", "/signup"];

export function Nav() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed]     = useState(false);
  const location = useLocation();

  const isHidden = HIDE_ON.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) =>
      setAuthed(!!session),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (isHidden) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="Ansh Consultancy home">
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="text-sm text-foreground/75 transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {authed ? (
              <Link
                to="/dashboard"
                className="hidden items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] md:inline-flex"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] md:inline-flex"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Book a Demo
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface-2/60 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-foreground/85 hover:bg-surface-2 [&.active]:text-foreground [&.active]:bg-surface-2"
                >
                  {l.label}
                </Link>
              ))}
              {authed ? (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-primary-foreground block"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Book a Demo
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/91XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500"
        style={{ background: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
