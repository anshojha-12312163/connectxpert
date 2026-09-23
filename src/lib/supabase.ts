import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Singleton to prevent multiple client instances during HMR / SSR
const globalForSupabase = globalThis as unknown as { supabaseClient?: SupabaseClient };

export const supabase =
  globalForSupabase.supabaseClient ??
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    realtime: { params: { eventsPerSecond: 10 } },
  });

if (typeof window !== "undefined") {
  globalForSupabase.supabaseClient = supabase;
}

/**
 * Returns the exact origin for OAuth & email redirects.
 * Ensures mobile devices, remote laptops, and production domains
 * redirect to the current domain instead of localhost.
 */
export function getAuthRedirectUrl(path: string = "/dashboard"): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = window.location.origin.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${origin}${cleanPath}`;
  }
  return path;
}


// ── Existing types ─────────────────────────────────────────────

export interface ContactRow {
  id?: string; name: string; email: string; company?: string; message: string; created_at?: string;
}
export interface DemoBookingRow {
  id?: string; booking_reference?: string; service_id?: string; service_name?: string;
  name: string; email: string; company?: string; phone?: string;
  preferred_date: string; preferred_time: string; timezone: string; notes?: string;
  status?: "pending"|"confirmed"|"completed"|"cancelled"|"rescheduled";
  expert_id?: string; created_at?: string;
  // Video call fields
  video_room_url?: string;
  video_room_name?: string;
}
export interface NewsletterRow { id?: string; email: string; subscribed_at?: string; }
export interface AnalyticsEventRow {
  id?: string; event_type: string; page?: string; metadata?: Record<string,unknown>; created_at?: string;
}
export interface ClientRow {
  id?: string; user_id: string; project_name: string;
  status: "active"|"paused"|"completed"; notes?: string; created_at?: string;
}
export interface AvailabilityRow {
  id?: string; day_of_week: number; start_time: string; end_time: string; is_active: boolean;
}
export interface ServiceRow {
  id: string; name: string; description: string; duration_minutes: number; icon: string; is_active: boolean;
}

// ── New ConnectXpert types ─────────────────────────────────────

export interface CaseStudyRow {
  id?: string;
  slug: string;
  client: string;
  industry: string;
  tag: string;
  problem: string;
  solution: string;
  outcome: string;
  metrics: string[];
  color: string;
  featured?: boolean;
  created_at?: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;        // lucide icon name e.g. "TrendingUp"
  description: string;
  slug: string;
  expert_count?: number;
}

export interface ExpertRow {
  id: string;
  user_id?: string;
  name: string;
  title: string;
  category_id: string;
  category?: CategoryRow;
  bio: string;
  skills: string[];
  hourly_rate: number;
  photo_url?: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  total_bookings: number;
  status: "active"|"inactive"|"suspended";
  // Online presence
  last_active_at?: string;
  avg_response_time_minutes?: number;
  // Free intro
  offers_free_intro: boolean;
  intro_call_duration: number;
  // Extra profile fields
  years_experience?: number;
  languages?: string[];
  portfolio?: { title: string; url?: string; description?: string }[];
  created_at?: string;
}

export interface ExpertApplicationRow {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  category_id: string;
  bio: string;
  years_experience: number;
  hourly_rate: number;
  portfolio_links?: string[];
  skills: string[];
  offers_free_intro: boolean;
  status: "pending"|"approved"|"rejected"|"more_info";
  submitted_at?: string;
  reviewed_at?: string;
  admin_notes?: string;
}

export interface ReviewRow {
  id?: string;
  expert_id: string;
  client_id?: string;
  client_name: string;
  booking_id?: string;
  rating: number;
  comment: string;
  expert_response?: string;
  is_hidden?: boolean;
  created_at?: string;
}

export interface FavoriteRow {
  id?: string;
  client_id: string;
  expert_id: string;
  created_at?: string;
  expert?: ExpertRow;
}

export interface QuickConnectRequestRow {
  id?: string;
  client_name: string;
  client_email: string;
  category_id: string;
  message: string;
  status: "open"|"claimed"|"expired";
  claimed_by_expert_id?: string;
  created_at?: string;
}

export interface ConversationRow {
  id?: string;
  client_id: string;
  expert_id: string;
  last_message_at?: string;
  created_at?: string;
  expert?: ExpertRow;
  last_message?: string;
  unread_count?: number;
}

export interface MessageRow {
  id?: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  is_read: boolean;
  created_at?: string;
}

// ── Online status helper ───────────────────────────────────────

export type OnlineStatus = "online" | "away" | "offline";

export function getOnlineStatus(lastActiveAt?: string): OnlineStatus {
  if (!lastActiveAt) return "offline";
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  const mins = diff / 60000;
  if (mins < 5)  return "online";
  if (mins < 30) return "away";
  return "offline";
}

export function formatResponseTime(mins?: number): string {
  if (!mins) return "Usually responds within 24 hours";
  if (mins < 60) return `Usually responds within ${Math.round(mins)} min`;
  const hrs = Math.round(mins / 60);
  return `Usually responds within ${hrs} hour${hrs > 1 ? "s" : ""}`;
}

// ── Analytics helper ───────────────────────────────────────────

export async function trackEvent(
  event_type: string, page?: string, metadata?: Record<string,unknown>,
) {
  try { await supabase.from("analytics_events").insert({ event_type, page, metadata }); } catch {}
}

// ── Seed experts (used client-side from Settings) ─────────────

export const SEED_EXPERTS: Omit<ExpertRow, "id">[] = [
  {
    name: "Ananya Deshmukh", title: "Salesforce Certified Technical Architect (CTA)", category_id: "tech",
    photo_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "12+ years deploying enterprise-scale Salesforce implementations. Salesforce CTA with deep mastery of Sales Cloud, Service Cloud, CPQ, Data Cloud, and MuleSoft integrations for Fortune 500 SaaS.",
    skills: ["Salesforce CTA", "Salesforce CPQ", "Data Cloud", "MuleSoft", "Apex / LWC", "CRM Migration"],
    hourly_rate: 210, is_verified: true, average_rating: 4.95, review_count: 58, total_bookings: 165,
    status: "active", years_experience: 12, languages: ["English", "Hindi", "Marathi"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 3 * 60000).toISOString(),
    avg_response_time_minutes: 8,
  },
  {
    name: "Sanjay Krishnan", title: "TCS Enterprise Cloud Transformation Director", category_id: "tech",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "14+ years architecting Fortune 500 digital transformations at TCS and AWS. Led 40+ large-scale legacy core-to-cloud migrations, TCS BaNCS integrations, and zero-trust cloud architectures.",
    skills: ["TCS Enterprise Cloud", "Cloud Migration", "AWS Architecture", "TCS BaNCS", "Kubernetes", "Disaster Recovery"],
    hourly_rate: 195, is_verified: true, average_rating: 4.9, review_count: 48, total_bookings: 130,
    status: "active", years_experience: 14, languages: ["English", "Tamil", "Hindi"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 5 * 60000).toISOString(),
    avg_response_time_minutes: 12,
  },
  {
    name: "Dr. Amitav Roy", title: "Principal AI Scientist & Kaggle Grandmaster", category_id: "tech",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "Top 0.1% Kaggle Grandmaster, Ex-DeepMind & TCS Innovation Labs AI Lead. Specializing in LLM fine-tuning, RAG enterprise pipelines, and high-throughput PyTorch/JAX models.",
    skills: ["Generative AI", "LLMs", "RAG Pipelines", "PyTorch", "MLOps", "Computer Vision"],
    hourly_rate: 220, is_verified: true, average_rating: 5.0, review_count: 52, total_bookings: 140,
    status: "active", years_experience: 11, languages: ["English", "Hindi", "Bengali"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 1 * 60000).toISOString(),
    avg_response_time_minutes: 10,
  },
  {
    name: "Sarah Chen", title: "Business Strategy Consultant", category_id: "business",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "10+ years helping startups and SMEs define strategy, enter new markets, and scale operations. Ex-McKinsey, MBA from INSEAD.",
    skills: ["Business Strategy","Go-to-Market","OKRs","Market Entry","Fundraising"],
    hourly_rate: 150, is_verified: true, average_rating: 4.9, review_count: 47, total_bookings: 112,
    status: "active", years_experience: 10, languages: ["English","Mandarin"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 2 * 60000).toISOString(),
    avg_response_time_minutes: 12,
  },
  {
    name: "Rahul Sharma", title: "Full-Stack & Cloud Architect", category_id: "tech",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "Senior engineer with 8 years building scalable systems on AWS/GCP. Specialises in microservices, React, Node.js and DevOps.",
    skills: ["React","Node.js","AWS","System Design","DevOps","TypeScript"],
    hourly_rate: 120, is_verified: true, average_rating: 4.8, review_count: 38, total_bookings: 89,
    status: "active", years_experience: 8, languages: ["English","Hindi"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 8 * 60000).toISOString(),
    avg_response_time_minutes: 25,
  },
  {
    name: "Priya Nair", title: "Growth Marketing Specialist", category_id: "marketing",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "Performance marketer who has scaled B2B SaaS from 0 to $5M ARR. Expert in SEO, paid acquisition, and email automation.",
    skills: ["SEO","Google Ads","HubSpot","Content Strategy","Email Marketing","Analytics"],
    hourly_rate: 95, is_verified: true, average_rating: 4.7, review_count: 29, total_bookings: 67,
    status: "active", years_experience: 6, languages: ["English"],
    offers_free_intro: false, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    avg_response_time_minutes: 60,
  },
  {
    name: "James Okafor", title: "Corporate & Startup Lawyer", category_id: "legal",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "Startup-focused attorney covering fundraising docs, employment law, IP protection, and SaaS contracts. 200+ clients served.",
    skills: ["Contract Law","IP Protection","Term Sheets","Employment Law","GDPR","NDAs"],
    hourly_rate: 200, is_verified: true, average_rating: 4.9, review_count: 61, total_bookings: 145,
    status: "active", years_experience: 12, languages: ["English","French"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 15 * 60000).toISOString(),
    avg_response_time_minutes: 45,
  },
  {
    name: "David Kim", title: "CFO & Financial Advisor", category_id: "finance",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=600",
    bio: "Fractional CFO with expertise in fundraising, financial modeling, cap table management, and M&A advisory for growth-stage companies.",
    skills: ["Financial Modeling","Fundraising","Cap Tables","M&A","Forecasting","Unit Economics"],
    hourly_rate: 175, is_verified: true, average_rating: 4.8, review_count: 35, total_bookings: 78,
    status: "active", years_experience: 14, languages: ["English","Korean"],
    offers_free_intro: false, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    avg_response_time_minutes: 120,
  },
];

