import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  realtime: { params: { eventsPerSecond: 10 } },
});

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
    name: "Sarah Chen", title: "Business Strategy Consultant", category_id: "business",
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
    bio: "Startup-focused attorney covering fundraising docs, employment law, IP protection, and SaaS contracts. 200+ clients served.",
    skills: ["Contract Law","IP Protection","Term Sheets","Employment Law","GDPR","NDAs"],
    hourly_rate: 200, is_verified: true, average_rating: 4.9, review_count: 61, total_bookings: 145,
    status: "active", years_experience: 12, languages: ["English","French"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 15 * 60000).toISOString(),
    avg_response_time_minutes: 45,
  },
  {
    name: "Anika Patel", title: "Product & UX Designer", category_id: "design",
    bio: "Senior product designer with a background in user research and design systems. Helped 30+ products ship better experiences.",
    skills: ["Figma","Design Systems","User Research","Prototyping","Accessibility","Branding"],
    hourly_rate: 85, is_verified: false, average_rating: 4.6, review_count: 22, total_bookings: 44,
    status: "active", years_experience: 5, languages: ["English","Gujarati"],
    offers_free_intro: true, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 45 * 60000).toISOString(),
    avg_response_time_minutes: 90,
  },
  {
    name: "David Kim", title: "CFO & Financial Advisor", category_id: "finance",
    bio: "Fractional CFO with expertise in fundraising, financial modeling, cap table management, and M&A advisory for growth-stage companies.",
    skills: ["Financial Modeling","Fundraising","Cap Tables","M&A","Forecasting","Unit Economics"],
    hourly_rate: 175, is_verified: true, average_rating: 4.8, review_count: 35, total_bookings: 78,
    status: "active", years_experience: 14, languages: ["English","Korean"],
    offers_free_intro: false, intro_call_duration: 15,
    last_active_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    avg_response_time_minutes: 120,
  },
];
