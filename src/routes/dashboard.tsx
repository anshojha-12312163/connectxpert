import { useState, useEffect, useRef } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  BarChart2,
  Calendar,
  Users,
  Briefcase,
  Plug,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Zap,
  X,
  UserCheck,
  Star,
  Tag,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo, Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem, FadeUp, TiltLogo } from "@/lib/motion";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ConnectXpert" }] }),
  component: DashboardLayout,
});

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  // Core
  { label: "Dashboard",    href: "/dashboard",                    icon: LayoutDashboard, section: "main" },
  { label: "Analytics",    href: "/dashboard/analytics",          icon: BarChart2,       section: "main" },
  { label: "Bookings",     href: "/dashboard/bookings",           icon: Calendar,        section: "main" },
  { label: "Contacts",     href: "/dashboard/contacts",           icon: MessageSquare,   section: "main" },
  { label: "Clients",      href: "/dashboard/clients",            icon: Briefcase,       section: "main" },
  // Expert Hub
  { label: "Experts",           href: "/dashboard/experts-list",       icon: UserCheck,  section: "hub" },
  { label: "Applications",      href: "/dashboard/expert-applications", icon: BookOpen,   section: "hub" },
  { label: "Reviews",           href: "/dashboard/reviews",            icon: Star,       section: "hub" },
  { label: "Categories",        href: "/dashboard/categories",         icon: Tag,        section: "hub" },
  // System
  { label: "Integrations", href: "/dashboard/integrations",       icon: Plug,           section: "system" },
  { label: "Settings",     href: "/dashboard/settings",           icon: Settings,       section: "system" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  user,
  pathname,
  onClose,
  onLogout,
}: {
  user: User | null;
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
}) {
  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Admin";

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ background: "#0d1117", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <TiltLogo><Logo size="sm" /></TiltLogo>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-white/40 hover:text-white transition-colors lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Main section */}
        <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/20">
          Main
        </p>
        <StaggerContainer staggerMs={45}>
        {NAV_ITEMS.filter(i => i.section === "main").map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <StaggerItem key={label}>
              <Link
                to={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_-4px_rgba(59,130,246,0.3)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/90",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "text-blue-400" : "text-white/35")} />
                {label}
              </Link>
            </StaggerItem>
          );
        })}
        </StaggerContainer>

        {/* Expert Hub section */}
        <p className="mb-1.5 mt-4 px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/20">
          Expert Hub
        </p>
        <StaggerContainer staggerMs={50}>
        {NAV_ITEMS.filter(i => i.section === "hub").map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <StaggerItem key={label}>
              <Link
                to={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_-4px_rgba(59,130,246,0.3)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/90",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "text-blue-400" : "text-white/35")} />
                {label}
              </Link>
            </StaggerItem>
          );
        })}
        </StaggerContainer>

        {/* System section */}
        <p className="mb-1.5 mt-4 px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/20">
          System
        </p>
        <StaggerContainer staggerMs={55}>
        {NAV_ITEMS.filter(i => i.section === "system").map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <StaggerItem key={label}>
              <Link
                to={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_-4px_rgba(59,130,246,0.3)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/90",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active ? "text-blue-400" : "text-white/35")} />
                {label}
              </Link>
            </StaggerItem>
          );
        })}
        </StaggerContainer>
      </nav>

      {/* Upgrade card */}
      <div className="px-3 pb-3">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Zap className="size-4 text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-white/90">Upgrade to Pro</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">
            Unlock advanced analytics, white-label reports, and priority support.
          </p>
          <Link
            to="/pricing"
            className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-500 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-600 shadow-[0_0_16px_-4px_rgba(59,130,246,0.5)]"
          >
            Upgrade
          </Link>
        </div>
      </div>

      {/* User + logout */}
      <div
        className="border-t border-white/[0.06] px-3 py-3"
      >
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={displayName} size={32} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white/90">{displayName}</p>
            <p className="truncate text-[10px] text-white/35">Admin</p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="shrink-0 text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({
  user,
  onMenuClick,
  notifCount,
}: {
  user: User | null;
  onMenuClick: () => void;
  notifCount: number;
}) {
  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Admin";
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] px-4 lg:px-6"
      style={{ background: "#0d1117" }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white transition-colors lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-white/25" />
        <input
          type="search"
          placeholder="Search anything..."
          className="h-9 w-full rounded-full border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white transition-colors">
          <Bell className="size-4" />
          {notifCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>

        {/* User chip */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 transition-colors hover:bg-white/[0.06]"
          >
            <Avatar name={displayName} size={26} className="shrink-0" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white/90 leading-none">{displayName}</p>
              <p className="text-[10px] text-white/35 leading-none mt-0.5">Admin</p>
            </div>
            <ChevronDown className={cn("size-3.5 text-white/30 transition-transform", userMenuOpen && "rotate-180")} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-2xl border border-white/[0.08] py-1 shadow-2xl"
              style={{ background: "#131824" }}
            >
              {[
                { label: "Your Profile", href: "/dashboard/settings" },
                { label: "Billing", href: "/pricing" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]             = useState<User | null>(null);
  const [loading, setLoading]       = useState(true);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    let mounted = true;
    const hasAuthParams =
      typeof window !== "undefined" &&
      (window.location.hash.includes("access_token") ||
       window.location.search.includes("code=") ||
       window.location.hash.includes("error="));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        navigate({ to: "/login" });
      } else if (!hasAuthParams && event === "INITIAL_SESSION" && !session) {
        navigate({ to: "/login" });
      }
    });

    // Check existing session if not currently processing OAuth params
    if (!hasAuthParams) {
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (!mounted) return;
        if (error || !user) {
          navigate({ to: "/login" });
        } else {
          setUser(user);
          setLoading(false);
        }
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0e17" }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* ── Desktop sidebar ───────────────────────────── */}
          <aside className="hidden w-56 shrink-0 lg:flex lg:flex-col">
            <Sidebar
              user={user}
              pathname={location.pathname}
              onLogout={handleLogout}
            />
          </aside>

          {/* ── Mobile sidebar overlay ────────────────────── */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <aside className="relative z-10 w-64 shrink-0">
                <Sidebar
                  user={user}
                  pathname={location.pathname}
                  onClose={() => setMobileOpen(false)}
                  onLogout={handleLogout}
                />
              </aside>
            </div>
          )}

          {/* ── Main area ─────────────────────────────────── */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar
              user={user}
              onMenuClick={() => setMobileOpen(true)}
              notifCount={5}
            />
            <main className="flex-1 overflow-y-auto p-5 lg:p-6">
              <FadeUp>
                <Outlet />
              </FadeUp>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
