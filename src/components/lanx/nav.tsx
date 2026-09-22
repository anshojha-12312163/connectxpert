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
    const isAuthed = () => typeof window !== "undefined" && !!localStorage.getItem("cx_demo_user");
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session || isAuthed()));
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) =>
      setAuthed(!!session || isAuthed()),
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

          <div className="flex items-center gap-3">
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
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-foreground/75 transition-colors hover:text-foreground md:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] md:inline-flex"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  Book a Demo
                </Link>
              </>
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
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-xl border border-border bg-surface-2/70 py-2.5 text-center text-sm font-medium text-foreground"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Book a Demo
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

