import { Star } from "lucide-react";
import { Avatar, JoinRow, SectionHeading } from "./bits";

const reviews = [
  {
    quote: "Highly intuitive and polished. It's everything we needed and more!",
    rating: "5.0",
    name: "Alex jonas",
    role: "JS Marketing",
  },
  {
    quote: "This is truly Incredible and have saved us countless hours!",
    rating: "5.0",
    name: "John Robert",
    role: "SM Strategy",
  },
  {
    quote: "Pure brilliance! This has streamlined our workflow massively.",
    rating: "4.8",
    name: "Maggie Hue",
    role: "BS Growth Ceo",
  },
  {
    quote: "A top-notch solution! It's been transformative for our entire team.",
    rating: "5.0",
    name: "Tappo kao",
    role: "PO Marketing",
  },
  {
    quote: "Amazing product! It’s made our processes seamless and effective.",
    rating: "5.0",
    name: "jack hanma",
    role: "JK Finance",
  },
  {
    quote: "Incredible design and functionality! This has exceeded our expectations.",
    rating: "5.0",
    name: "John Robert",
    role: "JO Strategy",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Wall of love"
          title="Loved by thinkers"
          subtitle="Here’s what people worldwide are saying about us"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure key={`${r.name}-${i}`} className="card-surface flex flex-col rounded-3xl p-6">
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">{r.quote}</blockquote>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{r.rating}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-gold text-gold" />
                  ))}
                </span>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={r.name} size={34} />
                <span className="text-sm">
                  <span className="block font-medium">{r.name}</span>
                  <span className="block text-muted-foreground">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14">
          <JoinRow count="15,168" />
        </div>
      </div>
    </section>
  );
}
