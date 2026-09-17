import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./bits";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What makes this template unique?",
    a: "This template is designed to streamline your SaaS or startup’s online presence with modern, user-centric design and seamless functionality, ensuring you stand out from competitors.",
  },
  {
    q: "Can I customize the template to match my brand?",
    a: "Absolutely! The template is fully customizable, allowing you to change colors, fonts, images, and content to perfectly align with your brand identity.",
  },
  {
    q: "Is this template optimized for SEO and speed?",
    a: "Yes, this template is built for exceptional performance, fast loading times, and SEO-friendly design to boost your online visibility.",
  },
  {
    q: "Is the template mobile-friendly?",
    a: "Yes, the template is fully responsive, ensuring a seamless user experience across desktop, tablet, and mobile devices.",
  },
  {
    q: "Can I use this template for commercial projects?",
    a: "Yes. You’re free to use this template for both personal and commercial projects — no attribution required.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="blog" className="relative py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading
          badge="FAQ's section"
          title="Some Common FAQ's"
          subtitle="Get answers to your questions and learn about our platform"
        />

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "overflow-hidden rounded-2xl border border-border bg-surface/70",
                  isOpen && "bg-surface-2/70",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
