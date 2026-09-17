import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/lanx/nav";
import { Hero } from "@/components/lanx/hero";
import { Features } from "@/components/lanx/features";
import { WhyChooseUs } from "@/components/lanx/why-choose-us";
import { Showcase } from "@/components/lanx/showcase";
import { Benefits } from "@/components/lanx/benefits";
import { TestimonialsCarousel } from "@/components/lanx/testimonials-carousel";
import { Pricing } from "@/components/lanx/pricing";
import { Founders } from "@/components/lanx/founders";
import { Integrations } from "@/components/lanx/integrations";
import { Comparison } from "@/components/lanx/comparison";
import { Efficiency } from "@/components/lanx/efficiency";
import { Faq } from "@/components/lanx/faq";
import { Cta } from "@/components/lanx/cta";
import { TrustBadges } from "@/components/lanx/trust-badges";
import { Footer } from "@/components/lanx/footer";

const title = "Ansh Consultancy — Expert Business Consulting to Sell, Hire & Scale";
const description =
  "Ansh Consultancy helps businesses launch, grow, and scale with expert consulting, hiring support, market insights, and proven growth strategies.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // No auto-redirect here — the home page is always public.
  // OAuth callbacks land on the origin URL; Supabase's detectSessionInUrl
  // handles token exchange automatically. The login page's onAuthStateChange
  // listener then fires SIGNED_IN and redirects to /dashboard.
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Features />
        <WhyChooseUs />
        <Showcase />
        <Benefits />
        <TestimonialsCarousel />
        <Pricing />
        <Founders />
        <Integrations />
        <Comparison />
        <Efficiency />
        <Faq />
        <Cta />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
}
