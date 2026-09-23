import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle2, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading, Avatar } from "./bits";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface ClientTestimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  highlight?: string;
}

// 4-5 High-caliber client testimonials with photos and feedback
const defaultTestimonials: ClientTestimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "VP of Growth",
    company: "NexaFlow Tech",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    quote: "ConnectXpert helped us triple our inbound lead velocity in under 90 days. The specialist matching was instant, precise, and delivered measurable revenue impact.",
    rating: 5,
    highlight: "+310% Pipeline Growth",
  },
  {
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    company: "CloudScale Systems",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    quote: "Booking fractional tech leadership and AI system architects through ConnectXpert saved our engineering team 6+ months of costly trial-and-error hiring.",
    rating: 5,
    highlight: "Saved 6 Months R&D",
  },
  {
    name: "Elena Rostova",
    role: "Head of Global Operations",
    company: "Apex Retail Group",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    quote: "The consultation workflow is seamless. We booked a 1-on-1 strategy audit with Ansh Consultancy and resolved our multi-region supply bottlenecks in two sessions.",
    rating: 5,
    highlight: "Operational Efficiency",
  },
  {
    name: "David Chen",
    role: "Founder & CEO",
    company: "Omnisync AI",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    quote: "The caliber of advisors and verified consultants on ConnectXpert is unmatched. Meeting links, calendar coordination, and follow-ups were 100% automated.",
    rating: 5,
    highlight: "5-Star Advisory",
  },
  {
    name: "Priya Sharma",
    role: "Director of Product",
    company: "FinVantage Solutions",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    quote: "Hands down the most reliable consulting platform. Direct access to top-tier technical and growth talent with transparent hourly pricing and zero friction.",
    rating: 5,
    highlight: "Transparent & Fast",
  },
];

export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [reviews, setReviews] = useState<ClientTestimonial[]>(defaultTestimonials);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data } = await supabase
          .from("reviews")
          .select("client_name, comment, rating")
          .eq("is_hidden", false)
          .limit(10)
          .order("created_at", { ascending: false });

        if (data && data.length >= 3) {
          const mapped = data.map((d, i) => ({
            name: d.client_name || "Verified Client",
            role: "Enterprise Client",
            company: "Strategic Partner",
            avatar: defaultTestimonials[i % defaultTestimonials.length].avatar,
            quote: d.comment,
            rating: d.rating || 5,
            highlight: "Verified Review",
          }));
          setReviews(mapped);
        }
      } catch {
        // keep default testimonials
      }
    }
    fetchReviews();
  }, []);

  const count = reviews.length;
  const visibleCount = 3;

  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  const getVisibleItems = () => {
    const items: ClientTestimonial[] = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(reviews[(idx + i) % count]);
    }
    return items;
  };

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Client Testimonials"
          title="What our clients say"
          subtitle="Real outcomes from high-growth startups and enterprise leaders who accelerate with ConnectXpert."
        />

        {/* Testimonials Grid with Framer Motion */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {getVisibleItems().map((t, i) => (
              <motion.figure
                key={`${t.name}-${(idx + i) % count}`}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-7 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-primary/40 hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Highlight Badge */}
                {t.highlight && (
                  <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                    {t.highlight}
                  </div>
                )}

                <div>
                  {/* Star Rating & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="size-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <Quote className="size-6 text-white/10" />
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-sm leading-relaxed text-slate-200/90 italic font-light">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Client Profile */}
                <figcaption className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3.5">
                  <div className="relative">
                    <Avatar name={t.name} src={t.avatar} size={46} className="border-2 border-primary/30 ring-2 ring-primary/10" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-white shadow-md">
                      <CheckCircle2 className="size-3 fill-emerald-500 text-slate-950" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{t.role}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-primary/90 font-medium truncate">
                      <Building2 className="size-3 shrink-0" />
                      <span>{t.company}</span>
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Controls & Pagination */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-white/80 transition-all hover:bg-primary/20 hover:text-white hover:border-primary/40 active:scale-95 shadow-md"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-slate-900/60 border border-white/5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === idx ? "w-6 bg-gradient-to-r from-primary to-accent" : "w-2 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-white/80 transition-all hover:bg-primary/20 hover:text-white hover:border-primary/40 active:scale-95 shadow-md"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

