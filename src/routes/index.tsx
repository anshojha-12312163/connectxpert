import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

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
  const navigate = useNavigate();

  // Handle OAuth callback: when Google redirects back to origin with a
  // hash fragment (#access_token=…), Supabase's detectSessionInUrl exchanges
  // it for a session. This listener catches the SIGNED_IN event and redirects.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const hasAuthParams =
        typeof window !== "undefined" &&
        (window.location.hash.includes("access_token") ||
         window.location.search.includes("code="));
      if (event === "SIGNED_IN" && session && hasAuthParams) {
        navigate({ to: "/dashboard" });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

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
