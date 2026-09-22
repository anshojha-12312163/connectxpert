import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="flex items-center justify-center rounded-lg"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow)",
          width: size === "sm" ? 24 : 30,
          height: size === "sm" ? 24 : 30,
        }}
      >
        {/* Circular arrows — ConnectXpert brand mark */}
        <svg viewBox="0 0 24 24" width={size === "sm" ? 14 : 17} height={size === "sm" ? 14 : 17} fill="none" aria-hidden>
          <path d="M12 4V2l-3 3 3 3V6a6 6 0 016 6h2a8 8 0 00-8-8z" fill="white"/>
          <path d="M12 20v2l3-3-3-3v2a6 6 0 01-6-6H4a8 8 0 008 8z" fill="white"/>
        </svg>
      </span>
      <div className="flex flex-col leading-none">
        <span className={cn("font-display font-semibold tracking-tight", size === "sm" ? "text-base" : "text-lg")}>
          ConnectXpert
        </span>
        {size !== "sm" && (
          <span className="text-[10px] text-white/35 font-normal tracking-wide">by Ansh Consultancy</span>
        )}
      </div>
    </div>
  );
}

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
      {children}
    </span>
  );
}

export function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <SectionBadge>{badge}</SectionBadge>
      <h2 className="text-4xl font-semibold text-gradient sm:text-5xl">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}

const avatarPalette = [
  "linear-gradient(135deg, oklch(0.6 0.2 268), oklch(0.75 0.14 300))",
  "linear-gradient(135deg, oklch(0.65 0.18 30), oklch(0.8 0.14 70))",
  "linear-gradient(135deg, oklch(0.6 0.16 200), oklch(0.78 0.12 170))",
  "linear-gradient(135deg, oklch(0.58 0.2 340), oklch(0.78 0.13 20))",
];

export function Avatar({
  name,
  size = 36,
  className,
  src,
}: {
  name: string;
  size?: number | undefined;
  className?: string | undefined;
  src?: string | undefined;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("inline-flex shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const idx = name.charCodeAt(0) % avatarPalette.length;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-foreground/95",
        className,
      )}
      style={{
        background: avatarPalette[idx],
        width: size,
        height: size,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function JoinRow({ count, label }: { count?: string | number; label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex -space-x-2">
        {["Sarah Chen", "Rahul Sharma", "James Okafor", "Priya Nair"].map((n) => (
          <Avatar key={n} name={n} size={28} className="ring-2 ring-background" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {label ? (
          <span>{label}</span>
        ) : count ? (
          <>Direct access to <span className="font-semibold text-foreground">{count}</span> verified specialists</>
        ) : (
          <>Connecting with <span className="font-semibold text-foreground">vetted specialists</span> across 6 core domains</>
        )}
      </p>
    </div>
  );
}

export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
}: {
  items: ReactNode[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className={cn(
          "flex w-max items-center",
          reverse ? "marquee-track-reverse" : "marquee-track",
        )}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {items.map((item, i) => (
              <div key={`${dup}-${i}`} className={cn("px-6", itemClassName)}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-border bg-surface-2/70 px-5 py-2.5 text-sm text-foreground/85">
      {children}
    </span>
  );
}

/** Online status dot */
export type OnlineStatus = "online" | "away" | "offline";

export function StatusDot({ status, className }: { status: OnlineStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full border-2 border-background",
        status === "online" ? "bg-green-400" : status === "away" ? "bg-yellow-400" : "bg-white/25",
        className,
      )}
    />
  );
}
