import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChatCircle,
  Brain,
  Database,
  TerminalWindow,
  Code,
  FileText,
  SlackLogo,
  NotionLogo,
  Check,
  CircleNotch,
  Clock,
  Minus,
  Globe,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ── FeatCard ──────────────────────────────────────────────────

interface FeatCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function FeatCard({ title, description, children, className = "" }: FeatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-[20px] p-4",
        "bg-white dark:bg-neutral-900",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]",
        "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      <div className="z-10 flex flex-col gap-1.5">
        <h3 className="font-semibold text-foreground text-sm tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed max-w-[90%]">{description}</p>
      </div>
      <div className="relative mt-2 flex-1 w-full rounded-[14px] overflow-hidden border border-border/50 bg-background/50 dark:bg-neutral-950/50">
        {children}
      </div>
    </motion.div>
  );
}

// ── Card1 — Agent Pipeline ────────────────────────────────────

type ActiveStep = "request" | "router" | "agent" | "memory" | "tools" | "response";

const VW = 320;
const VH = 240;

interface NodeConfig {
  id: string;
  x: number;
  y: number;
  icon?: React.ElementType;
  label?: string;
  type: "box" | "circle";
}

const NODES: NodeConfig[] = [
  { id: "A",      x: 50,  y: 120, icon: ChatCircle,   label: "REQUEST", type: "box"    },
  { id: "Router", x: 125, y: 120,                                        type: "circle" },
  { id: "C",      x: 200, y: 120, icon: Brain,         label: "AGENT",   type: "box"    },
  { id: "B",      x: 280, y: 50,  icon: Database,      label: "MEMORY",  type: "box"    },
  { id: "D",      x: 280, y: 190, icon: TerminalWindow, label: "TOOLS",  type: "box"    },
];

interface FlowPath {
  id: string;
  d: string;
  activeSteps: ActiveStep[];
  colorClass: string;
}

const PATHS: FlowPath[] = [
  { id: "a-to-router",     d: "M 78 120 L 113 120",         activeSteps: ["request"],  colorClass: "text-cyan-500 dark:text-cyan-400"    },
  { id: "router-to-agent", d: "M 137 120 L 172 120",        activeSteps: ["agent"],    colorClass: "text-violet-500 dark:text-violet-400" },
  { id: "agent-to-memory", d: "M 200 92 L 200 50 L 252 50", activeSteps: ["memory"],   colorClass: "text-fuchsia-500 dark:text-fuchsia-400" },
  { id: "agent-to-tools",  d: "M 200 148 L 200 190 L 252 190", activeSteps: ["tools"], colorClass: "text-emerald-500 dark:text-emerald-400" },
  { id: "response-1",      d: "M 172 120 L 137 120",        activeSteps: ["response"], colorClass: "text-cyan-500 dark:text-cyan-400"    },
  { id: "response-2",      d: "M 113 120 L 78 120",         activeSteps: ["response"], colorClass: "text-cyan-500 dark:text-cyan-400"    },
];

const NODE_COLORS: Record<string, { bg: string; border: string; buttonBg: string; buttonBorder: string }> = {
  A:      { bg: "bg-cyan-500/10 dark:bg-cyan-500/5",    border: "border-cyan-500/60",    buttonBg: "bg-cyan-500",    buttonBorder: "border-cyan-600"    },
  Router: { bg: "bg-amber-500/10 dark:bg-amber-500/5",  border: "border-amber-500/60",   buttonBg: "bg-amber-500",   buttonBorder: "border-amber-600"   },
  C:      { bg: "bg-violet-500/10 dark:bg-violet-500/5",border: "border-violet-500/60",  buttonBg: "bg-violet-500",  buttonBorder: "border-violet-600"  },
  B:      { bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/5",border:"border-fuchsia-500/60",buttonBg: "bg-fuchsia-500", buttonBorder: "border-fuchsia-600" },
  D:      { bg: "bg-emerald-500/10 dark:bg-emerald-500/5",border:"border-emerald-500/60",buttonBg: "bg-emerald-500", buttonBorder: "border-emerald-600" },
};

export function Card1() {
  const [step, setStep] = useState<ActiveStep>("request");

  useEffect(() => {
    const steps: ActiveStep[] = ["request", "router", "agent", "memory", "tools", "response"];
    let idx = 0;
    const id = setInterval(() => { idx = (idx + 1) % steps.length; setStep(steps[idx]); }, 2000);
    return () => clearInterval(id);
  }, []);

  function isNodeActive(nodeId: string) {
    switch (step) {
      case "request":  return nodeId === "A";
      case "router":   return nodeId === "Router";
      case "agent":    return nodeId === "C";
      case "memory":   return nodeId === "C" || nodeId === "B";
      case "tools":    return nodeId === "C" || nodeId === "D";
      case "response": return nodeId === "C" || nodeId === "Router" || nodeId === "A";
      default:         return false;
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-neutral-50 dark:bg-neutral-950/80 rounded-xl flex items-center justify-center p-2">
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <pattern id="clean-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="currentColor" className="text-zinc-200 dark:text-zinc-800/60" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#clean-grid)" />
      </svg>

      {/* Connector + nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* Static base paths */}
        {["M 78 120 L 113 120","M 137 120 L 172 120","M 200 92 L 200 50 L 252 50","M 200 148 L 200 190 L 252 190"].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800/80" strokeWidth="1" />
        ))}

        {/* Animated flow overlays */}
        {PATHS.map((p) => {
          if (!p.activeSteps.includes(step)) return null;
          return (
            <g key={p.id}>
              <motion.path d={p.d} fill="none" stroke="currentColor" className={p.colorClass}
                strokeWidth="3.5" strokeOpacity="0.2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }} />
              <motion.path d={p.d} fill="none" stroke="currentColor" className={p.colorClass}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }} />
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isBox = node.type === "box";
          const w = isBox ? 56 : 24;
          const h = isBox ? 56 : 24;
          const active = isNodeActive(node.id);
          const c = NODE_COLORS[node.id];

          return (
            <foreignObject key={node.id} x={node.x - w / 2} y={node.y - h / 2} width={w} height={h} className="overflow-visible">
              <div className="w-full h-full flex items-center justify-center">
                {isBox && node.icon ? (
                  <div className={cn(
                    "w-full h-full rounded-[14px] border flex flex-col items-center justify-center text-white",
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_1px_2px_0_rgba(0,0,0,0.08)]",
                    c.buttonBg, c.buttonBorder,
                  )}>
                    <div className="mb-0.5 flex items-center justify-center">
                      <node.icon className="w-5 h-5" weight="fill" />
                    </div>
                    <span className="text-[8.5px] font-mono font-bold tracking-wider select-none">{node.label}</span>
                  </div>
                ) : (
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-300",
                    active ? "bg-amber-500/20 border-amber-500/70" : "bg-background/80 border-zinc-300 dark:border-zinc-800",
                  )}>
                    <motion.div
                      className={cn("w-2.5 h-2.5 rounded-full border border-dashed", active ? "border-amber-500" : "border-zinc-400 dark:border-zinc-600")}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

// ── Card2 — Token / Cost Monitor ─────────────────────────────

export function Card2() {
  const bars  = [45, 75, 35, 85, 60, 95, 50];
  const days  = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((p) => (p === 0 ? 1 : 0)), 3000);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: "Tokens/min", value: "12.4k", trend: "+8%" },
    { label: "Cost/run",   value: "$0.042", trend: "-3%" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3.5 justify-between">
      <div className="flex gap-4 pt-[0.625rem] pr-[0.625rem] pb-0.5 pl-0.5">
        {stats.map((s, i) => {
          const isActive = i === activeIdx || hoveredIdx === i;
          return (
            <div key={i} className="flex-1 h-[76px] relative select-none">
              <div className="absolute inset-0 rounded-xl border border-border/40 dark:border-border/20 bg-muted/5 text-border/30 dark:text-border/20"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)" }} />
              <motion.div
                className="absolute inset-0 w-full h-full rounded-xl bg-muted/20 dark:bg-neutral-950/80 border border-border/50 p-3 flex items-center justify-between gap-3 cursor-pointer backdrop-blur-[2px]"
                animate={{ x: isActive ? "0.5rem" : "0rem", y: isActive ? "-0.5rem" : "0rem" }}
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] text-muted-foreground/80 font-mono uppercase tracking-widest leading-none">{s.label}</span>
                  <span className="text-base font-bold font-mono text-foreground leading-none mt-1.5 tracking-tight">{s.value}</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={cn("text-[8px] font-mono font-bold", s.trend.startsWith("+") ? "text-emerald-500" : "text-rose-400")}>{s.trend}</span>
                    <span className="text-[8px] text-muted-foreground/50 font-mono">prev</span>
                  </div>
                </div>
                <div className="w-12 h-6 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 48 24">
                    <motion.path
                      d={i === 0 ? "M 0 18 L 16 11 L 32 14 L 48 4" : "M 0 4 L 16 12 L 32 8 L 48 18"}
                      fill="none" stroke="currentColor" className="text-muted-foreground/30 dark:text-muted-foreground/20"
                      strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                    />
                    {(i === 0 ? [{x:0,y:18},{x:16,y:11},{x:32,y:14},{x:48,y:4}] : [{x:0,y:4},{x:16,y:12},{x:32,y:8},{x:48,y:18}])
                      .map((pt, idx) => (
                        <motion.circle key={idx} cx={pt.x} cy={pt.y} r="1.5"
                          className="fill-background stroke-muted-foreground/40 dark:stroke-muted-foreground/30" strokeWidth="1"
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.08, duration: 0.25 }} />
                      ))}
                  </svg>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-end gap-2.5 px-0.5 min-h-[90px]">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 h-full rounded-xl dark:bg-neutral-950/80 border border-border/80 dark:border-border/30 relative overflow-hidden bg-muted/5 text-border/40 dark:text-border/20"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)" }}>
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-primary border-t border-x border-primary/80 rounded-t-[10px]"
              initial={{ height: "0%" }}
              animate={{ height: [`${h}%`, `${Math.min(95,h+15)}%`, `${Math.max(10,h-20)}%`, `${Math.min(90,h+8)}%`, `${h}%`] }}
              transition={{ repeat: Infinity, duration: 3 + (i % 3) * 0.8, ease: "easeInOut", delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 px-0.5">
        {days.map((d, i) => (
          <p key={i} className="flex-1 text-center text-[8px] text-muted-foreground font-mono font-medium">{d}</p>
        ))}
      </div>
    </div>
  );
}

// ── Card3 — Activity Feed ─────────────────────────────────────

const STATUS_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string; gradient: string; border: string }> = {
  done:    { icon: Check,       color: "text-lime-500",          bg: "bg-lime-500/15",  gradient: "bg-gradient-to-b from-lime-400 to-lime-600",    border: "border-lime-600"    },
  running: { icon: CircleNotch, color: "text-blue-400",          bg: "bg-blue-400/15",  gradient: "bg-gradient-to-b from-blue-400 to-blue-600",    border: "border-blue-600"    },
  waiting: { icon: Clock,       color: "text-amber-400",         bg: "bg-amber-400/15", gradient: "bg-gradient-to-b from-amber-400 to-amber-600",  border: "border-amber-600"   },
  idle:    { icon: Minus,       color: "text-muted-foreground/60",bg: "bg-muted/40",    gradient: "bg-gradient-to-b from-zinc-400 to-zinc-600",    border: "border-zinc-600"    },
};

const LOGS = [
  { agent: "Planner",    action: "Decomposed task into 4 sub-goals",       status: "done",    t: "0.2s" },
  { agent: "Researcher", action: "Queried web for latest embeddings",       status: "done",    t: "1.4s" },
  { agent: "Coder",      action: "Generating vector DB schema…",            status: "running", t: "3.1s" },
  { agent: "Reviewer",   action: "Awaiting output from Coder",              status: "waiting", t: "—"    },
  { agent: "Writer",     action: "Idle — queued",                           status: "idle",    t: "—"    },
];

const Y_MAP: Record<string, number> = { "-2": -68, "-1": -38, "0": 0, "1": 38, "2": 68 };

export function Card3() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((p) => (p + 1) % LOGS.length), 2400);
    return () => clearInterval(id);
  }, []);

  function getSlot(i: number) {
    const N = LOGS.length;
    let rel = i - activeIdx;
    if (rel >  Math.floor(N / 2)) rel -= N;
    if (rel < -Math.floor(N / 2)) rel += N;
    return rel;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {LOGS.map((l, i) => {
        const slot    = getSlot(i);
        const si      = STATUS_ICONS[l.status];
        const abs     = Math.abs(slot);
        const isActive  = slot === 0;
        const isVisible = abs <= 2;
        const yOffset = Y_MAP[String(slot)] ?? (slot < 0 ? -120 : 120);

        return (
          <motion.div
            key={l.agent}
            className="absolute left-0 right-0 mx-auto px-1.5"
            style={{ zIndex: isActive ? 30 : abs === 1 ? 20 : 10 }}
            animate={{
              y:       isVisible ? yOffset  : slot < 0 ? -150 : 150,
              scale:   isActive  ? 1        : abs === 1 ? 0.93 : 0.87,
              opacity: isVisible ? (isActive ? 1 : abs === 1 ? 0.65 : 0.38) : 0,
            }}
            transition={{
              y:       { type: "spring", stiffness: 500, damping: 35 },
              scale:   { type: "spring", stiffness: 500, damping: 35 },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <div className={cn("w-full rounded-2xl border flex items-center gap-2.5", isActive ? "px-3 py-2.5 bg-background border-border" : "px-2.5 py-1.5 bg-muted/30 border-border/50")}>
              <div className={cn("shrink-0 rounded-[8px] flex items-center justify-center font-bold text-white transition-all duration-300 border", si.gradient, si.border, isActive ? "w-8 h-8" : "w-5 h-5")}>
                <si.icon weight="bold" className={cn(isActive ? "w-4 h-4" : "w-2.5 h-2.5", l.status === "running" ? "animate-spin" : "")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn("font-mono font-semibold text-foreground leading-none", isActive ? "text-[10px]" : "text-[9px]")}>{l.agent}</span>
                  <span className={cn("font-mono uppercase tracking-wide rounded px-1 py-0.5", si.bg, si.color, isActive ? "text-[7px]" : "text-[6px]")}>{l.status}</span>
                </div>
                {isActive && <p className="text-[9px] text-muted-foreground truncate mt-0.5 leading-tight">{l.action}</p>}
              </div>
              {isActive && <span className="text-[9px] font-mono text-muted-foreground shrink-0">{l.t}</span>}
            </div>
          </motion.div>
        );
      })}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
        {LOGS.map((_, i) => (
          <motion.div key={i} className="rounded-full bg-foreground/25"
            animate={{ width: i === activeIdx ? 14 : 4, opacity: i === activeIdx ? 0.7 : 0.2 }}
            style={{ height: 3 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        ))}
      </div>
    </div>
  );
}

// ── Card4 — Knowledge Base Namespaces ─────────────────────────

const NS_ICONS: Record<string, React.ElementType> = {
  codebase: Code, docs: FileText, slack: SlackLogo, notion: NotionLogo,
};
const NS_COLORS: Record<string, { bar: string; dot: string; badge: string; buttonBg: string; buttonBorder: string }> = {
  codebase: { bar: "from-violet-500 to-violet-400",  dot: "bg-violet-500",  badge: "bg-violet-500/15 text-violet-400",  buttonBg: "bg-violet-500",  buttonBorder: "border-violet-600"  },
  docs:     { bar: "from-sky-500 to-sky-400",        dot: "bg-sky-500",     badge: "bg-sky-500/15 text-sky-400",        buttonBg: "bg-sky-500",     buttonBorder: "border-sky-600"     },
  slack:    { bar: "from-emerald-500 to-emerald-400",dot: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400",buttonBg: "bg-emerald-500", buttonBorder: "border-emerald-600" },
  notion:   { bar: "from-amber-500 to-amber-400",    dot: "bg-amber-500",   badge: "bg-amber-500/15 text-amber-400",    buttonBg: "bg-amber-500",   buttonBorder: "border-amber-600"   },
};

const RETRIEVAL_QUERIES = [
  { ns: "codebase", q: "vector embeddings auth module",    t: "0.2s" },
  { ns: "docs",     q: "API rate limiting config",         t: "1.1s" },
  { ns: "codebase", q: "Redis cache invalidation patterns",t: "2.4s" },
  { ns: "slack",    q: "deployment discussion #eng",       t: "4.0s" },
  { ns: "notion",   q: "Q3 roadmap — agent features",      t: "5.8s" },
  { ns: "docs",     q: "OpenAI function calling schema",   t: "7.2s" },
];

export function Card4() {
  const namespaces = [
    { name: "codebase", hits: 342, fill: 88 },
    { name: "docs",     hits: 218, fill: 56 },
    { name: "slack",    hits: 97,  fill: 25 },
    { name: "notion",   hits: 54,  fill: 14 },
  ];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((p) => (p + 1) % RETRIEVAL_QUERIES.length), 2000);
    return () => clearInterval(id);
  }, []);

  const activeNs     = RETRIEVAL_QUERIES[tick].ns;
  const recentQueries = [0,1,2,3].map((offset) => RETRIEVAL_QUERIES[(tick - offset + RETRIEVAL_QUERIES.length) % RETRIEVAL_QUERIES.length]);

  return (
    <div className="w-full h-full flex gap-5 py-2 px-3">
      {/* Namespace bars */}
      <div className="flex-1 flex flex-col gap-0 min-w-0 pr-2">
        <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Namespaces</p>
        <div className="flex flex-col gap-3 flex-1">
          {namespaces.map((ns, i) => {
            const c = NS_COLORS[ns.name];
            const isActive = ns.name === activeNs;
            const Icon = (NS_ICONS[ns.name] || Database) as React.ComponentType<{ size?: number; weight?: string; className?: string }>;
            return (
              <div key={ns.name} className="flex items-center gap-3 group relative">
                <div className={cn(
                  "relative flex shrink-0 items-center justify-center w-[36px] h-[36px] rounded-[12px] border transition-all duration-500",
                  isActive
                    ? cn("text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_1px_2px_0_rgba(0,0,0,0.08)] scale-105", c.buttonBg, c.buttonBorder)
                    : "dark:bg-neutral-950/80 bg-white border-transparent text-[#A1A1A1]",
                )}>
                  <Icon size={16} weight={isActive ? "fill" : "regular"} className="relative z-10" />
                </div>
                <span className={cn("text-[10px] font-mono w-16 shrink-0 transition-colors duration-400", isActive ? "text-foreground font-semibold" : "text-muted-foreground")}>
                  {ns.name}
                </span>
                <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden relative">
                  <motion.div
                    className={cn("absolute left-0 top-0 bottom-0 rounded-full overflow-hidden bg-gradient-to-r", c.bar)}
                    initial={{ width: "0%" }}
                    animate={{ width: `${ns.fill}%`, opacity: isActive ? 1 : 0.25 }}
                    transition={{ width: { duration: 1.2, delay: i * 0.1, type: "spring", bounce: 0.2 }, opacity: { duration: 0.4 } }}
                  >
                    {isActive && (
                      <motion.div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        initial={{ x: "-100%" }} animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                    )}
                  </motion.div>
                </div>
                <div className={cn("flex items-center gap-1.5 w-10 justify-end transition-all duration-500", isActive ? "opacity-100 scale-105" : "opacity-60")}>
                  <span className={cn("text-[9px] font-mono font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{ns.hits}</span>
                  {isActive && (
                    <motion.div className={cn("w-1 h-1 rounded-full", c.dot)}
                      animate={{ opacity: [1,0.2,1], scale: [1,1.5,1] }}
                      transition={{ repeat: Infinity, duration: 1 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 pt-3 mt-auto">
          <div className="relative flex items-center justify-center w-2 h-2">
            <motion.div className="absolute inset-0 rounded-full bg-emerald-400/40"
              animate={{ scale: [1,2.5,1], opacity: [0.5,0,0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[8px] font-mono text-muted-foreground font-medium tracking-wide">Live retrieval active</span>
        </div>
      </div>

      <div className="w-px bg-border/30 self-stretch shrink-0" />

      {/* Retrieval log */}
      <div className="w-[172px] shrink-0 flex flex-col gap-0">
        <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground mb-2.5">Retrieval Log</p>
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          {recentQueries.map((q, qi) => {
            const c = NS_COLORS[q.ns];
            return (
              <motion.div key={`${q.ns}-${q.q}-${qi}`}
                className="rounded-xl border border-border/40 bg-muted/20 dark:bg-neutral-950/80 px-2.5 py-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: qi === 0 ? 1 : qi === 1 ? 0.8 : qi === 2 ? 0.5 : 0.25, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35, delay: qi * 0.05 }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className={cn("text-[6.5px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded-md", c.badge)}>{q.ns}</span>
                  <span className="text-[7px] font-mono text-muted-foreground/50 ml-auto tabular-nums">{q.t}</span>
                </div>
                <p className="text-[8px] text-foreground/75 leading-tight font-mono truncate">{q.q}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Card5 — Tool Inspector ────────────────────────────────────

export function Card5() {
  const tools = [
    { name: "web_search",   calls: 14, icon: Globe,          latency: "280ms", color: "bg-gradient-to-b from-sky-400 to-sky-600",     borderColor: "border-sky-600"     },
    { name: "code_exec",    calls: 8,  icon: TerminalWindow, latency: "1.2s",  color: "bg-gradient-to-b from-emerald-400 to-emerald-600", borderColor: "border-emerald-600" },
    { name: "file_read",    calls: 22, icon: FileText,       latency: "12ms",  color: "bg-gradient-to-b from-amber-400 to-amber-600",  borderColor: "border-amber-600"   },
    { name: "vector_query", calls: 31, icon: Brain,          latency: "95ms",  color: "bg-gradient-to-b from-violet-400 to-violet-600",borderColor: "border-violet-600"  },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2 w-full">
        {tools.map((t, i) => (
          <motion.div key={i}
            className="relative rounded-[16px] border border-border/50 bg-background dark:bg-neutral-950/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2.5 group hover:border-border"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-start justify-between">
              <div className={cn("w-[28px] h-[28px] rounded-[8px] flex items-center justify-center text-white border group-hover:scale-105 transition-transform duration-300", t.color, t.borderColor,
                "shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.6),0_1px_2px_0_rgba(0,0,0,0.08)]")}>
                <t.icon weight="fill" className="w-3.5 h-3.5 relative z-10" />
              </div>
              <div className="flex flex-col items-end gap-0.5 mt-0.5">
                <span className="text-[12px] font-mono font-bold text-foreground leading-none">{t.calls}</span>
                <span className="text-[7px] font-mono text-muted-foreground/80 uppercase tracking-widest leading-none">Calls</span>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-foreground tracking-tight">{t.name}</span>
                <span className="text-[8px] font-mono text-muted-foreground tabular-nums">{t.latency}</span>
              </div>
              <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden shadow-inner relative">
                <motion.div className={cn("absolute left-0 top-0 bottom-0 rounded-full", t.color)}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(t.calls / 31) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main Grid ─────────────────────────────────────────────────

const CARDS = [
  { title: "Agent Pipeline",  description: "Visualise how tasks flow across your multi-agent graph in real time.", visual: <Card1 />, colSpan: "lg:col-span-1", height: "h-[260px]" },
  { title: "Token Monitor",   description: "Track LLM token usage and cost-per-run across every model call.",     visual: <Card2 />, colSpan: "lg:col-span-1", height: "h-[260px]" },
  { title: "Activity Feed",   description: "Real-time logs of agent actions, tool calls, and memory retrievals.", visual: <Card3 />, colSpan: "lg:col-span-1", height: "h-[260px]" },
  { title: "Knowledge Base",  description: "Semantic search across documents, codebases, and conversations.",     visual: <Card4 />, colSpan: "lg:col-span-2", height: "h-[260px]" },
  { title: "Tool Inspector",  description: "Monitor tool usage, latency, and success rates across all agents.",   visual: <Card5 />, colSpan: "lg:col-span-1", height: "h-[260px]" },
];

export interface AgentBentoGridProps {
  className?: string;
}

export function AgentBentoGrid({ className }: AgentBentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-5xl mx-auto", className)}>
      {CARDS.map((card, idx) => (
        <FeatCard key={idx} title={card.title} description={card.description}
          className={cn(card.colSpan, card.height)}>
          {card.visual}
        </FeatCard>
      ))}
    </div>
  );
}

export default AgentBentoGrid;
