import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position within the component's boundaries
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to 3D rotation and scale
  // It starts tilted back (rotateX: 45) and scales up slightly as we scroll down
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [35, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative z-20 mx-auto w-full max-w-6xl px-5 mt-16 mb-24"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="relative mx-auto w-full rounded-2xl border border-primary/20 bg-surface/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4"
      >
        {/* Glowing backdrop behind the image */}
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-[80px]" />
        
        {/* The Dashboard Mockup Image */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl">
          {/* Mac window controls mock */}
          <div className="absolute top-0 left-0 right-0 z-10 flex h-8 items-center gap-1.5 bg-white/5 px-4 backdrop-blur-md">
            <div className="size-2.5 rounded-full bg-red-500/80" />
            <div className="size-2.5 rounded-full bg-yellow-500/80" />
            <div className="size-2.5 rounded-full bg-green-500/80" />
          </div>
          <img
            src="/dashboard-mockup.png"
            alt="Dashboard Interface"
            className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
      </motion.div>
    </div>
  );
}
