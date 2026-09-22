import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading, Avatar } from "./bits";
import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";

// Fallback testimonials while loading or if none exist
const defaultTestimonials = [
  {
    name: "Sarah Mitchell",
    quote: "ConnectXpert helped us triple our inbound lead velocity in under 90 days. The specialist matching was instant, precise, and highly impactful.",
    rating: 5,
  }
];

export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [reviews, setReviews] = useState<any[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from("reviews")
        .select("client_name, comment, rating")
        .eq("is_hidden", false)
        .limit(10)
        .order("created_at", { ascending: false });
      
      if (data && data.length > 0) {
        setReviews(data.map(d => ({
          name: d.client_name,
          quote: d.comment,
          rating: d.rating
        })));
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const count = reviews.length;
  const visible = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  const getVisible = () => {
    const items = [];
    const numVisible = Math.min(visible, count);
    for (let i = 0; i < numVisible; i++) {
      items.push(reviews[(idx + i) % count]);
    }
    return items;
  };

  return (
    <section id="testimonials" className="relative py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Testimonials"
          title="What our clients say"
          subtitle="Real outcomes from real businesses. Here's what working with us looks like in practice."
        />

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {getVisible().map((t, i) => (
            <figure
              key={`${t.name}-${idx}-${i}`}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface-2/60 p-7 transition-all duration-300 hover:border-primary/30"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size={40} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Verified Client
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-2/60 text-foreground/80 transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === idx ? "w-5 bg-primary" : "bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-2/60 text-foreground/80 transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
