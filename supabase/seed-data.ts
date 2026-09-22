import { createClient } from "@supabase/supabase-js";
import { SEED_EXPERTS } from "../src/lib/supabase.ts"; 

// Realistic Testimonials
const TESTIMONIALS = [
  {
    client_name: "Eleanor Vance",
    rating: 5,
    comment: "An incredible experience. The strategy session completely reframed how we approach our Q3 OKRs. Worth every penny.",
  },
  {
    client_name: "Marcus Thorne",
    rating: 5,
    comment: "Exceptional technical depth. Helped us untangle a messy microservices migration in just one hour.",
  },
  {
    client_name: "Sophia Rossi",
    rating: 4,
    comment: "Very actionable growth marketing advice. We implemented the SEO recommendations and saw a 20% bump in organic traffic within weeks.",
  },
  {
    client_name: "David Chen",
    rating: 5,
    comment: "Crystal clear legal guidance on our term sheet. Saved us from a potentially disastrous IP clause.",
  },
  {
    client_name: "Amina Al-Fayed",
    rating: 5,
    comment: "Transformed our chaotic design system into something our engineering team actually loves using. Highly recommended.",
  },
  {
    client_name: "Jordan Lee",
    rating: 5,
    comment: "The financial model we built together secured our seed round. Absolute lifesaver.",
  },
  {
    client_name: "Rachel Kim",
    rating: 4,
    comment: "Great insights into B2B SaaS pricing models. Validated our assumptions and gave us confidence to raise prices.",
  },
  {
    client_name: "Tom Barker",
    rating: 5,
    comment: "Phenomenal hiring advice. We revamped our interview process and just landed our first VP of Engineering.",
  }
];

async function runSeed() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Seeding database...");

  // 1. Seed Experts
  console.log("Seeding experts...");
  const expertsToInsert = SEED_EXPERTS.map(e => ({
    ...e,
    user_id: "00000000-0000-0000-0000-000000000000", // Dummy UUID for user
  }));
  
  const { data: experts, error: expertsError } = await supabase
    .from("experts")
    .insert(expertsToInsert)
    .select("id, category_id");

  if (expertsError) {
    console.error("Error seeding experts:", expertsError.message);
  } else {
    console.log(`Seeded ${experts?.length} experts.`);

    // 2. Seed Testimonials (Reviews)
    if (experts && experts.length > 0) {
      console.log("Seeding testimonials...");
      const reviewsToInsert = TESTIMONIALS.map((t, index) => {
        // Distribute reviews evenly among experts
        const expert = experts[index % experts.length];
        return {
          expert_id: expert.id,
          client_name: t.client_name,
          rating: t.rating,
          comment: t.comment,
          is_hidden: false,
        };
      });

      const { error: reviewsError } = await supabase
        .from("reviews")
        .insert(reviewsToInsert);

      if (reviewsError) console.error("Error seeding reviews:", reviewsError.message);
      else console.log(`Seeded ${reviewsToInsert.length} reviews.`);
    }
  }

  // 3. Seed Analytics & Bookings (12 months of realistic data)
  console.log("Seeding analytics and bookings...");
  
  const now = new Date();
  const eventsToInsert = [];
  const bookingsToInsert = [];
  const contactsToInsert = [];
  const subsToInsert = [];

  // Generate an upward trend over 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(now.getTime() - (365 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString();
    
    // Growth curve: base + linear + random variation
    const baseTraffic = 10;
    const growth = i * 0.15; 
    const trafficForDay = Math.floor(baseTraffic + growth + (Math.random() * 10));

    // Page views
    for (let j = 0; j < trafficForDay; j++) {
      eventsToInsert.push({
        event_type: "page_view",
        page: "/",
        created_at: dateStr,
        metadata: { source: ["Organic Search", "Direct", "Referral", "Social", "Email"][Math.floor(Math.random() * 5)] }
      });
    }

    // CTA clicks (10% of traffic)
    for (let j = 0; j < Math.floor(trafficForDay * 0.1); j++) {
      eventsToInsert.push({
        event_type: "cta_click",
        page: "/",
        created_at: dateStr,
      });
    }

    // Bookings (2% of traffic)
    if (Math.random() < (trafficForDay * 0.02)) {
      bookingsToInsert.push({
        booking_reference: `SEED-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: `Demo User ${i}`,
        email: `demo${i}@example.com`,
        preferred_date: date.toISOString().split("T")[0],
        preferred_time: "10:00 AM",
        status: ["completed", "confirmed", "completed", "completed"][Math.floor(Math.random() * 4)], // mostly completed
        created_at: dateStr,
      });
    }

    // Contacts (1% of traffic)
    if (Math.random() < (trafficForDay * 0.01)) {
      contactsToInsert.push({
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        message: "Interested in learning more.",
        created_at: dateStr,
      });
    }

    // Subscribers (3% of traffic)
    if (Math.random() < (trafficForDay * 0.03)) {
      subsToInsert.push({
        email: `sub${i}_${Math.random().toString(36).substring(7)}@example.com`,
        subscribed_at: dateStr,
      });
    }
  }

  // Batch insert events
  console.log(`Inserting ${eventsToInsert.length} events...`);
  for (let i = 0; i < eventsToInsert.length; i += 1000) {
    await supabase.from("analytics_events").insert(eventsToInsert.slice(i, i + 1000));
  }
  
  if (bookingsToInsert.length > 0) {
    console.log(`Inserting ${bookingsToInsert.length} bookings...`);
    await supabase.from("demo_bookings").insert(bookingsToInsert);
  }
  
  if (contactsToInsert.length > 0) {
    console.log(`Inserting ${contactsToInsert.length} contacts...`);
    await supabase.from("contacts").insert(contactsToInsert);
  }
  
  if (subsToInsert.length > 0) {
    console.log(`Inserting ${subsToInsert.length} subscribers...`);
    await supabase.from("newsletter_subscribers").insert(subsToInsert);
  }

  console.log("Seeding complete!");
}

runSeed().catch(console.error);
