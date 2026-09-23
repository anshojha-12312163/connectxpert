import { Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, JoinRow, SectionHeading } from "./bits";

const reviews = [
  {
    quote: "ConnectXpert gave us direct access to fractional CTOs who helped architect our multi-tenant SaaS. Truly exceptional turnaround time!",
    rating: "5.0",
    name: "Alex Jonas",
    role: "VP Engineering, CloudPeak",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Vance",
    quote: "This platform saved us countless months of expensive recruiting. The specialist matching algorithm is frighteningly accurate.",
    rating: "5.0",
    role: "Founder, ScaleMatrix",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "Pure brilliance! From calendar booking to instant Google Meet invites, our consulting sessions run effortlessly.",
    rating: "4.9",
    name: "Elena Rostova",
    role: "COO, Apex Retail Global",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "A top-notch advisory network! The caliber of strategic consultants here is miles ahead of traditional platforms.",
    rating: "5.0",
    name: "David Chen",
    role: "Chief Executive, Omnisync",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "Incredible UX and transparent pricing. We unlocked high-leverage growth strategies in our very first consultation session.",
    rating: "5.0",
    name: "Priya Sharma",
    role: "Head of Growth, FinVantage",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "High-impact advisory at scale. The video conference rooms and follow-up notes streamlined our entire advisory cycle.",
    rating: "5.0",
    name: "Rachel Stern",
    role: "Director of Product, Horizon AI",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          badge="Wall of Love"
          title="Loved by Industry Leaders"
          subtitle="Here’s what founders, CTOs, and growth executives worldwide say about ConnectXpert."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={`${r.name}-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-surface flex flex-col justify-between rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <blockquote className="text-[14.5px] leading-relaxed text-slate-200/90 italic font-light">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-400">{r.rating}</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                </div>
              </div>
              <figcaption className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="relative">
                  <Avatar name={r.name} src={r.avatar} size={40} className="border border-primary/30" />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-white shadow">
                    <CheckCircle2 className="size-2.5 fill-emerald-500 text-slate-950" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{r.name}</p>
                  <p className="text-xs text-slate-400 truncate">{r.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-14">
          <JoinRow count="15,168" />
        </div>
      </div>
    </section>
  );
}

