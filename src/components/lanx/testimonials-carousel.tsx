import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading, Avatar } from "./bits";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Mitchell",
    company: "NovaTech Inc.",
    role: "CEO",
    quote:
      "Ansh Consultancy helped us triple our inbound leads in under 90 days. The strategy was precise, actionable, and actually worked. I recommend them to every founder I know.",
    rating: 5,
  },
  {
    name: "James Okafor",
    company: "Skyline Ventures",
    role: "Founder",
    quote:
      "We hired three senior engineers through their talent pipeline in two weeks. The quality was exceptional and the process was completely hands-off for us. Incredible service.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    company: "Dune Analytics",
    role: "COO",
    quote:
      "Their market insights reports gave us the confidence to enter two new verticals. The data was fresh, relevant, and immediately actionable. Worth every penny.",
    rating: 5,
  },
  {
    name: "Lucas Fernandez",
    company: "Opal Digital",
    role: "Head of Growth",
    quote:
      "From strategy to execution, Ansh Consultancy was with us every step. They don't just give advice — they roll up their sleeves and build alongside you.",
    rating: 5,
  },
  {
    name: "Amara Chen",
    company: "Kairo Labs",
    role: "CTO",
    quote:
      "The tech advisory engagement transformed how we approach architecture decisions. We shipped 40% faster the quarter after working with them.",
    rating: 5,
  },
  {
    name: "Ryan Patel",
    company: "Northwind Group",
    role: "Managing Director",
    quote:
      "Professional, thorough, and genuinely invested in our success. Ansh Consultancy feels like an extension of our leadership team, not an outside vendor.",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const count = testimonials.length;
  const visible = 3;

  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  const getVisible = () => {
    const items = [];
    for (let i = 0; i < visible; i++) {
      items.push(testimonials[(idx + i) % count]);
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
                    {t.role}, {t.company}
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
