/**
 * micro-interaction system for the ConnectXpert dashboard
 *
 * All animations respect prefers-reduced-motion automatically via
 * Framer Motion's built-in useReducedMotion hook.
 */
import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useAnimation,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

// ─── shared easings & durations ───────────────────────────────
const SPRING_BOUNCY  = { type: "spring", stiffness: 420, damping: 18 } as const;
const SPRING_STIFF   = { type: "spring", stiffness: 500, damping: 28 } as const;
const EASE_SMOOTH    = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_BOUNCE    = [0.34, 1.56, 0.64, 1]    as const;
const EASE_TOGGLE    = [0.34, 1.56, 0.64, 1]    as const;

// ─── 1. FadeUp ─────────────────────────────────────────────────
/**
 * Wraps children in a fade + 14px upward slide.
 * Use `delay` (seconds) for manual stagger when needed.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={rm ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rm ? { duration: 0 } : { duration: 0.38, ease: EASE_SMOOTH, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── 2. StaggerContainer ──────────────────────────────────────
/**
 * Parent that staggers direct FadeUp children.
 * staggerMs controls delay between each child (default 45ms).
 */
const staggerVariants = (staggerMs: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerMs / 1000, delayChildren: 0.05 },
  },
});

const staggerChildVariants: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function StaggerContainer({
  children,
  staggerMs = 45,
  className,
}: {
  children: React.ReactNode;
  staggerMs?: number;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={rm ? undefined : staggerVariants(staggerMs)}
      initial={rm ? false : "hidden"}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/** Use as a direct child of StaggerContainer */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={rm ? undefined : staggerChildVariants}
    >
      {children}
    </motion.div>
  );
}

// ─── 3. AnimatedCard ──────────────────────────────────────────
/**
 * 14px-radius card that lifts 2px + glow on hover.
 * Applies transition to border-color, box-shadow, transform.
 */
export function AnimatedCard({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-white/[0.06] transition-[border-color,box-shadow]",
        "hover:border-blue-500/20",
        className,
      )}
      style={style}
      whileHover={rm ? undefined : {
        y: -2,
        boxShadow: "0 8px 32px -8px rgba(59,130,246,0.18), 0 0 0 1px rgba(59,130,246,0.12)",
        transition: { duration: 0.25, ease: EASE_SMOOTH },
      }}
      whileTap={rm ? undefined : { scale: 0.995 }}
    >
      {children}
    </motion.div>
  );
}

// ─── 4. AnimatedInput ─────────────────────────────────────────
/**
 * Input wrapper: focus → blue border + glow ring + 1px lift.
 * Pass `icon` to get an icon that scales + recolors on focus.
 */
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function AnimatedInput({
  icon,
  wrapperClassName,
  className,
  ...props
}: AnimatedInputProps) {
  const rm = useReducedMotion();
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className={cn("relative flex items-center", wrapperClassName)}
      animate={rm ? undefined : {
        y: focused ? -1 : 0,
        boxShadow: focused
          ? "0 0 0 3px rgba(59,130,246,0.15)"
          : "0 0 0 0px rgba(59,130,246,0)",
      }}
      transition={rm ? undefined : { duration: 0.2, ease: EASE_SMOOTH }}
      style={{ borderRadius: "12px" }}
    >
      {icon && (
        <motion.span
          className="absolute left-3.5 z-10 text-white/30"
          animate={rm ? undefined : {
            color: focused ? "rgba(59,130,246,0.9)" : "rgba(255,255,255,0.3)",
            scale: focused ? 1.1 : 1,
          }}
          transition={rm ? undefined : { duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur ={(e) => { setFocused(false); props.onBlur?.(e);  }}
        className={cn(
          "w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-[border-color] duration-200",
          focused ? "border-blue-500/60" : "border-white/10",
          icon ? "pl-10" : "",
          className,
        )}
      />
    </motion.div>
  );
}

// ─── 5. AnimatedButton ────────────────────────────────────────
/**
 * Button with:
 * - ripple from exact click coordinates
 * - 1px hover lift + colored glow shadow
 * - 96% press scale
 */
interface RipplePoint { id: number; x: number; y: number; }

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
}

const BTN_STYLES: Record<string, string> = {
  primary:   "bg-blue-600 text-white border-blue-700 hover:bg-blue-500",
  secondary: "bg-white/8 text-white/80 border-white/10 hover:bg-white/12",
  danger:    "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25",
  ghost:     "bg-transparent text-white/60 border-white/10 hover:bg-white/5",
};

const BTN_GLOW: Record<string, string> = {
  primary:   "rgba(59,130,246,0.4)",
  secondary: "rgba(255,255,255,0.08)",
  danger:    "rgba(239,68,68,0.3)",
  ghost:     "rgba(255,255,255,0.05)",
};

export function AnimatedButton({
  variant = "primary",
  children,
  className,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const rm     = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [pressed, setPressed] = useState(false);
  const nextId = useRef(0);

  function spawnRipple(e: React.MouseEvent) {
    const el   = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id   = nextId.current++;
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600);
  }

  return (
    <motion.button
      ref={btnRef}
      {...(props as HTMLMotionProps<"button">)}
      className={cn(
        "relative overflow-hidden rounded-xl border px-4 py-2 text-sm font-medium transition-colors select-none outline-none",
        BTN_STYLES[variant],
        className,
      )}
      onClick={(e) => { if (!rm) spawnRipple(e); onClick?.(e); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp  ={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      animate={rm ? undefined : { scale: pressed ? 0.96 : 1 }}
      whileHover={rm ? undefined : {
        y: -1,
        boxShadow: `0 4px 20px -4px ${BTN_GLOW[variant]}`,
        transition: { duration: 0.2 },
      }}
      transition={rm ? undefined : SPRING_BOUNCY}
    >
      {/* Ripples */}
      <AnimatePresence>
        {!rm && ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/15"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 240, height: 240, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ─── 6. AnimatedToggle ────────────────────────────────────────
/**
 * Toggle switch with spring-eased knob slide + blue glow when on.
 */
export function AnimatedToggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}) {
  const rm = useReducedMotion();

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {/* Track */}
        <motion.div
          className={cn(
            "h-6 w-11 rounded-full border transition-colors duration-200",
            checked ? "bg-blue-600 border-blue-700" : "bg-white/10 border-white/15",
          )}
          animate={rm ? undefined : {
            boxShadow: checked
              ? "0 0 10px rgba(59,130,246,0.4)"
              : "0 0 0px rgba(59,130,246,0)",
          }}
          transition={rm ? undefined : { duration: 0.3 }}
          onClick={() => onChange(!checked)}
        />
        {/* Knob */}
        <motion.div
          className={cn(
            "pointer-events-none absolute top-0.5 h-5 w-5 rounded-full shadow-md",
            checked ? "bg-white" : "bg-white/70",
          )}
          animate={rm ? undefined : {
            x: checked ? 21 : 2,
            boxShadow: checked
              ? "0 0 8px rgba(59,130,246,0.5)"
              : "0 1px 4px rgba(0,0,0,0.3)",
          }}
          transition={rm ? undefined : {
            x: { type: "spring", stiffness: 420, damping: 18, duration: 0.3 },
            boxShadow: { duration: 0.25 },
          }}
          style={{ top: 2 }}
        />
      </div>
      {label && <span className="text-sm text-white/70">{label}</span>}
    </label>
  );
}

// ─── 7. SaveFeedback ──────────────────────────────────────────
/**
 * Slides in from the right with a bouncy checkmark badge.
 * Render conditionally — show={true} triggers the animation.
 */
export function SaveFeedback({ show, message = "Saved successfully" }: { show: boolean; message?: string }) {
  const rm = useReducedMotion();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex items-center gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400"
          initial={rm ? { opacity: 0 } : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={rm ? { opacity: 0 } : { opacity: 0, x: 6 }}
          transition={rm ? { duration: 0.15 } : { duration: 0.3, ease: EASE_SMOOTH }}
        >
          {/* Bouncy checkmark badge */}
          <motion.span
            className="flex size-5 items-center justify-center rounded-full bg-green-500/25"
            initial={rm ? false : { scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={rm ? { duration: 0 } : {
              type: "spring",
              stiffness: 420,
              damping: 14,
              delay: 0.05,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 8. PulsingBadge ──────────────────────────────────────────
/**
 * Wraps a number badge with a slow pulsing ring (2.4s loop).
 */
export function PulsingBadge({
  count,
  color = "blue",
  className,
}: {
  count: number;
  color?: "blue" | "green" | "red" | "yellow";
  className?: string;
}) {
  const rm = useReducedMotion();
  const COLORS: Record<string, { ring: string; bg: string; text: string }> = {
    blue:   { ring: "rgba(59,130,246,0.4)",  bg: "bg-blue-500/20",   text: "text-blue-400"   },
    green:  { ring: "rgba(34,197,94,0.4)",   bg: "bg-green-500/20",  text: "text-green-400"  },
    red:    { ring: "rgba(239,68,68,0.4)",   bg: "bg-red-500/20",    text: "text-red-400"    },
    yellow: { ring: "rgba(234,179,8,0.4)",   bg: "bg-yellow-500/20", text: "text-yellow-400" },
  };
  const c = COLORS[color];

  return (
    <span className={cn("relative inline-flex", className)}>
      {/* Pulsing ring */}
      {!rm && count > 0 && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0 0px ${c.ring}`,
              `0 0 0 5px transparent`,
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className={cn("relative flex size-5 items-center justify-center rounded-full text-[10px] font-bold", c.bg, c.text)}>
        {count > 9 ? "9+" : count}
      </span>
    </span>
  );
}

// ─── 9. TiltLogo ──────────────────────────────────────────────
/**
 * Wraps a logo/icon and tilts it slightly on hover.
 */
export function TiltLogo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={rm ? undefined : {
        rotate: 6,
        scale: 1.08,
        transition: { type: "spring", stiffness: 400, damping: 12 },
      }}
      whileTap={rm ? undefined : { scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// ─── 10. TabIndicator ─────────────────────────────────────────
/**
 * Animated underline that glides between tabs.
 * Usage: render inside a relative-positioned tab bar.
 * `activeRect` = getBoundingClientRect() of the active tab element,
 * relative to the container.
 */
export function TabUnderline({
  left,
  width,
}: {
  left: number;
  width: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="absolute bottom-0 h-0.5 rounded-full bg-blue-500"
      animate={{ left, width }}
      transition={rm ? { duration: 0 } : { duration: 0.3, ease: EASE_SMOOTH }}
    />
  );
}

/**
 * Content panel that fades + slides up when the tab changes.
 * Key it by the active tab so AnimatePresence re-mounts on switch.
 */
export function TabPanel({
  children,
  tabKey,
}: {
  children: React.ReactNode;
  tabKey: string;
}) {
  const rm = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={rm ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={rm ? undefined : { opacity: 0, y: -4 }}
        transition={rm ? { duration: 0 } : { duration: 0.22, ease: EASE_SMOOTH }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
