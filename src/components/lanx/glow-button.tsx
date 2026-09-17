import { useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RipplePoint {
  id: number;
  x: number;
  y: number;
}

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Extra brightness during press. 0–1, default 0.15 */
  brightnessBoost?: number;
}

/**
 * Premium animated CTA button:
 *  - Press-in scale (95%) with spring bounce back
 *  - Radial glow pulse on press (300ms fade)
 *  - Gradient brightens on press
 *  - Ripple expands from tap point
 */
export function GlowButton({
  children,
  href,
  onClick,
  className,
  brightnessBoost = 0.15,
}: GlowButtonProps) {
  const btnRef   = useRef<HTMLElement>(null);
  const glowCtrl = useAnimation();
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [pressed, setPressed] = useState(false);
  const nextId = useRef(0);

  function spawnRipple(e: React.MouseEvent | React.TouchEvent) {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }

  async function handlePressStart(e: React.MouseEvent | React.TouchEvent) {
    setPressed(true);
    spawnRipple(e);
    // Pulse the outer glow
    await glowCtrl.start({
      opacity: [0, 0.7, 0],
      scale:   [0.85, 1.6, 1.6],
      transition: { duration: 0.32, ease: "easeOut" },
    });
    glowCtrl.set({ opacity: 0, scale: 0.85 });
  }

  function handlePressEnd() {
    setPressed(false);
  }

  const Tag = href ? motion.a : motion.button;

  return (
    <span className="relative inline-flex">
      {/* Radial glow behind button */}
      <motion.span
        aria-hidden
        animate={glowCtrl}
        initial={{ opacity: 0, scale: 0.85 }}
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(59,130,246,0.35) 40%, transparent 75%)",
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />

      <Tag
        ref={btnRef as any}
        href={href}
        onClick={onClick}
        onMouseDown={handlePressStart}
        onTouchStart={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchEnd={handlePressEnd}
        className={cn(
          "relative z-10 inline-flex select-none items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white outline-none",
          "transition-[filter] duration-200",
          className,
        )}
        style={{
          background: pressed
            ? "linear-gradient(135deg, #7c84ff 0%, #4f9fff 100%)"
            : "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
          boxShadow: pressed
            ? "0 0 0 1px rgba(99,102,241,0.5), 0 4px 24px rgba(99,102,241,0.5)"
            : "0 0 0 1px rgba(99,102,241,0.3), 0 2px 12px rgba(99,102,241,0.35)",
          filter: pressed ? `brightness(${1 + brightnessBoost})` : "brightness(1)",
        }}
        // Scale spring
        animate={{ scale: pressed ? 0.955 : 1 }}
        transition={{
          scale: pressed
            ? { duration: 0.12, ease: "easeIn" }
            : { type: "spring", stiffness: 420, damping: 18 },
        }}
      >
        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-white/20"
              style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
              initial={{ width: 0, height: 0, opacity: 0.55 }}
              animate={{ width: 220, height: 220, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Label */}
        <span className="relative z-10">{children}</span>
      </Tag>
    </span>
  );
}
