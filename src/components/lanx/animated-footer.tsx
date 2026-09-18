import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface AnimatedFooterLink {
  label: string;
  href: string;
}

export interface AnimatedFooterProps {
  /** The large display words along the bottom edge. Defaults to ["VengeanceUI"]. */
  headingLines?: string[];
  /** Left image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  leftImage?: string;
  /** Right image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
  rightImage?: string;

  /** Footer background color. Defaults to "#0f0f0f". */
  background?: string;
  /** Text color for links, copy and headings. Defaults to "#ffffff". */
  textColor?: string;

  /** Character ramp, ordered dark → light, used to render the ASCII art. */
  asciiChars?: string;
  /** Color of the ASCII glyphs. Defaults to "#803500". */
  charColor?: string;
  /** Fill color of a highlighted (hovered) cell. Defaults to "#ff6a00". */
  hoverColor?: string;
  /** Glyph color inside a highlighted cell. Defaults to "#0f0f0f". */
  hoverCharColor?: string;
  /** Number of columns each image is sampled to. Defaults to 80. */
  columns?: number;
  /** Pixel size of each ASCII cell. Defaults to 20. */
  cellSize?: number;
  /** Font size (px) of the ASCII glyphs. Defaults to 18. */
  fontSize?: number;

  /** Pointer parallax strength in px; set to 0 to disable. Defaults to 20. */
  parallaxStrength?: number;
  /** Cursor influence radius, in cells, for the hover highlight. Defaults to 8. */
  hoverRadius?: number;

  /** Play the reveal when the footer scrolls into view (else it shows immediately). Defaults to true. */
  revealOnScroll?: boolean;
  /**
   * Controlled reveal. When set, the footer ignores its own scroll observer and
   * plays in (`true`) / out (`false`) to match this value — drive it from your
   * own ScrollTrigger, sentinel or state to reveal it from behind other content.
   */
  revealed?: boolean;

  /** Extra class names for the root element. */
  className?: string;
}

const DEFAULT_ASCII_CHARS = "........:::=+xX#0369";

const HIGHLIGHT_LIFETIME = 300; // ms a hovered cell stays lit
const CLUSTER_SIZE = 10; // max cells a hover ripple spreads across
const PARALLAX_EASE = 0.05;

interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
  columns: number;
  cellSize: number;
  baselineOffset: number;
  direction: 1 | -1; // slide-in direction for the reveal curtain
}

/** Generate a default silhouette data URL when no external hand image is supplied */
function createDefaultHandDataUrl(direction: 1 | -1): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 400, 300);

  ctx.save();
  if (direction === -1) {
    ctx.translate(400, 0);
    ctx.scale(-1, 1);
  }

  // Draw hand / reaching gesture silhouette
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  // Palm & wrist
  ctx.moveTo(0, 180);
  ctx.quadraticCurveTo(80, 170, 160, 160);
  // Thumb
  ctx.quadraticCurveTo(180, 120, 220, 110);
  ctx.quadraticCurveTo(240, 115, 230, 135);
  ctx.quadraticCurveTo(190, 155, 180, 170);
  // Index
  ctx.quadraticCurveTo(250, 150, 320, 140);
  ctx.quadraticCurveTo(340, 150, 320, 165);
  ctx.quadraticCurveTo(240, 175, 200, 185);
  // Middle
  ctx.quadraticCurveTo(270, 180, 350, 180);
  ctx.quadraticCurveTo(365, 195, 340, 205);
  ctx.quadraticCurveTo(250, 205, 200, 210);
  // Ring
  ctx.quadraticCurveTo(260, 215, 330, 220);
  ctx.quadraticCurveTo(340, 235, 315, 240);
  ctx.quadraticCurveTo(240, 230, 180, 230);
  // Pinky
  ctx.quadraticCurveTo(230, 245, 290, 255);
  ctx.quadraticCurveTo(295, 270, 270, 272);
  ctx.quadraticCurveTo(200, 260, 150, 250);
  // Wrist edge back to start
  ctx.quadraticCurveTo(60, 260, 0, 270);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  return canvas.toDataURL();
}

/** Build the ASCII cell grid for one image by sampling its brightness. */
function buildHandCells(
  image: HTMLImageElement,
  columns: number,
  asciiChars: string,
): { rows: number; cells: Map<string, Cell> } {
  const rows = Math.max(
    1,
    Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)),
  );

  const sampler = document.createElement("canvas");
  sampler.width = columns;
  sampler.height = rows;
  const sampleCtx = sampler.getContext("2d");
  const cells = new Map<string, Cell>();
  if (!sampleCtx) return { rows, cells };

  sampleCtx.drawImage(image, 0, 0, columns, rows);
  const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  const backgroundCharIndex = asciiChars.lastIndexOf(".");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        asciiChars.length - 1,
        Math.floor((1 - brightness) * asciiChars.length),
      );
      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: asciiChars[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

/** Light up a wandering cluster of cells starting from `startCell`. */
function highlightCluster(cells: Map<string, Cell>, startCell: Cell) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    litCells.push(next);
    current = next;
  }
}

/** Nearest scrollable ancestor — used as the reveal's IntersectionObserver root. */
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return el;
    el = el.parentElement;
  }
  return null;
}

export function AnimatedFooter({
  headingLines = ["ConnectXpert"],
  leftImage,
  rightImage,
  background,
  textColor,
  charColor,
  hoverColor,
  hoverCharColor,
  asciiChars = DEFAULT_ASCII_CHARS,
  columns = 80,
  cellSize = 20,
  fontSize = 18,
  parallaxStrength = 20,
  hoverRadius = 8,
  revealOnScroll = true,
  revealed,
  className,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  // Reveal animations, published by the main effect so the controlled-`revealed`
  // effect below can play them without rebuilding the ASCII scene.
  const animateInRef = useRef<() => void>(() => {});
  const animateOutRef = useRef<() => void>(() => {});

  // Default to dark theme colors for ConnectXpert
  const isDark = true;

  const cc = charColor ?? (isDark ? "#3b82f6" : "#e6b093");
  const hc = hoverColor ?? "#60a5fa";
  const hcc = hoverCharColor ?? (isDark ? "#0f0f0f" : "#ffffff");

  // Live-tunable values read inside the animation loop
  const liveRef = useRef({ charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius });
  useEffect(() => {
    liveRef.current = { charColor: cc, hoverColor: hc, hoverCharColor: hcc, parallaxStrength, hoverRadius };
  }, [cc, hc, hcc, parallaxStrength, hoverRadius]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        leftImage,
        rightImage,
        columns,
        cellSize,
        fontSize,
        asciiChars,
        revealOnScroll,
        headingLines,
      }),
    [leftImage, rightImage, columns, cellSize, fontSize, asciiChars, revealOnScroll, headingLines],
  );

  useEffect(() => {
    const root = rootRef.current;
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;

    const hands: Hand[] = [];
    const wrappers = [leftWrap, rightWrap];

    // ── ASCII hands ──────────────────────────────────────────────────────
    const setupHand = (
      image: HTMLImageElement,
      canvas: HTMLCanvasElement,
      direction: 1 | -1,
    ) => {
      const { rows, cells } = buildHandCells(image, columns, asciiChars);
      if (cells.size === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = columns * cellSize * dpr;
      canvas.height = rows * cellSize * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const metrics = ctx.measureText("X");
      const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset = cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

      hands.push({
        canvas,
        ctx,
        cells,
        cellList: [...cells.values()],
        rows,
        columns,
        cellSize,
        baselineOffset,
        direction,
      });
    };

    const loadHand = (src: string | undefined, canvas: HTMLCanvasElement, direction: 1 | -1) => {
      const effectiveSrc = src || createDefaultHandDataUrl(direction);
      if (!effectiveSrc) return;

      const image = new Image();
      image.crossOrigin = "anonymous";
      let initialized = false;
      const init = () => {
        if (initialized) return;
        initialized = true;
        setupHand(image, canvas, direction);
      };
      image.onload = init;
      image.onerror = () => {
        // Fallback to built-in procedural silhouette if external image fails
        const fallbackSrc = createDefaultHandDataUrl(direction);
        if (fallbackSrc && effectiveSrc !== fallbackSrc) {
          image.src = fallbackSrc;
        }
      };
      image.src = effectiveSrc;
      if (image.complete && image.naturalWidth) init();
    };

    loadHand(leftImage, leftCanvasRef.current!, 1);
    loadHand(rightImage, rightCanvasRef.current!, -1);

    const renderHand = (hand: Hand, now: number) => {
      const { ctx, cellList, cellSize: cs, baselineOffset, columns: cols, rows } = hand;
      const { charColor: currentCc, hoverColor: currentHc, hoverCharColor: currentHcc } = liveRef.current;
      ctx.clearRect(0, 0, cols * cs, rows * cs);

      for (const cell of cellList) {
        const x = cell.col * cs;
        const y = cell.row * cs;
        const isHighlighted = cell.highlightEndTime > now;

        if (isHighlighted) {
          ctx.fillStyle = currentHc;
          ctx.fillRect(x, y, cs, cs);
        }
        ctx.fillStyle = isHighlighted ? currentHcc : currentCc;
        ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
      }
    };

    // ── Pointer: hover highlight + parallax target ───────────────────────
    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const curtain = { offset: revealOnScroll ? 125 : 0 };

    const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
      const rect = hand.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

      let closest: Cell | null = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }
      if (closest && closestDist <= liveRef.current.hoverRadius) {
        highlightCluster(hand.cells, closest);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      const strength = liveRef.current.parallaxStrength;
      const rect = root.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
      pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
      for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Unified render loop: ASCII + parallax + reveal curtain ───────────
    let rafId = 0;
    const frame = () => {
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);

      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      const strength = liveRef.current.parallaxStrength;
      const scale = 1 + (strength * 2) / 200;

      wrappers.forEach((wrapper, i) => {
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        const x = drift.x * dir || 0;
        const y = -drift.y || 0;
        wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    // ── Reveal (chars + curtain) ─────────────────────────
    const chars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-af-char]"));

    const animateIn = () => {
      gsap.to(curtain, { offset: 0, duration: 1, ease: "power3.out", overwrite: true });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.04, from: "center" },
        overwrite: true,
      });
    };

    const animateOut = () => {
      gsap.to(curtain, { offset: 125, duration: 0.4, ease: "power2.in", overwrite: true });
      gsap.to(chars, {
        yPercent: 125,
        duration: 0.4,
        ease: "power2.in",
        stagger: { each: 0.01, from: "center" },
        overwrite: true,
      });
    };

    animateInRef.current = animateIn;
    animateOutRef.current = animateOut;

    const maskAll = () => {
      gsap.set(chars, { yPercent: 125 });
    };
    const showAll = () => {
      gsap.set(chars, { yPercent: 0 });
    };

    let observer: IntersectionObserver | null = null;

    if (revealed !== undefined) {
      curtain.offset = revealed ? 0 : 125;
      if (revealed) showAll();
      else maskAll();
    } else if (revealOnScroll) {
      let isRevealed = false;
      maskAll();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !isRevealed) {
              isRevealed = true;
              animateIn();
            }
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(root);
    } else {
      showAll();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer?.disconnect();
      gsap.killTweensOf([curtain, ...chars]);
    };
  }, [sig]);

  useEffect(() => {
    if (revealed === undefined) return;
    if (revealed) animateInRef.current();
    else animateOutRef.current();
  }, [revealed]);

  const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
  const offEdge = startsHidden ? 125 : 0;

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative min-h-[320px] w-full overflow-hidden",
        !background && "bg-transparent text-white",
        className
      )}
      style={{ backgroundColor: background, color: textColor, containerType: "inline-size" }}
    >
      {/* ASCII hands */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
        <div
          ref={leftWrapRef}
          className="relative w-2/5 min-w-[200px] will-change-transform"
          style={{ transform: `translateX(-${offEdge}%)` }}
        >
          <canvas ref={leftCanvasRef} className="block h-auto w-full" />
        </div>
        <div
          ref={rightWrapRef}
          className="relative w-2/5 min-w-[200px] will-change-transform"
          style={{ transform: `translateX(${offEdge}%)` }}
        >
          <canvas ref={rightCanvasRef} className="block h-auto w-full" />
        </div>
      </div>

      {/* Display headings */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-4 p-8">
        {headingLines.map((word, wi) => (
          <h2
            key={`${word}-${wi}`}
            aria-label={word}
            className="overflow-hidden font-medium leading-none tracking-tight pb-[0.15em] -mb-[0.15em] font-display"
            style={{ fontSize: "clamp(2rem, 13cqw, 9rem)" }}
          >
            {Array.from(word).map((ch, ci) => (
              <span
                key={ci}
                data-af-char
                aria-hidden="true"
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h2>
        ))}
      </div>
    </div>
  );
}

export default AnimatedFooter;
