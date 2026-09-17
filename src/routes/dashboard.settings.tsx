import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Check, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

// ── Seed data inserted from the browser (no SQL editor needed) ─
const SEED_BOOKINGS = [
  { booking_reference:"AC-M01A", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Alice Kumar",    email:"alice@test.com",   preferred_date:"2025-10-15", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2025-10-15T09:00:00Z" },
  { booking_reference:"AC-M02A", service_id:"hiring-45",   service_name:"Hiring Advisory",          name:"Carol Mehta",    email:"carol@test.com",   preferred_date:"2025-11-10", preferred_time:"11:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2025-11-10T09:00:00Z" },
  { booking_reference:"AC-M02B", service_id:"tech-60",     service_name:"Tech Advisory",            name:"David Rao",      email:"david@test.com",   preferred_date:"2025-11-18", preferred_time:"15:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2025-11-18T09:00:00Z" },
  { booking_reference:"AC-M03A", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Frank Gupta",    email:"frank@test.com",   preferred_date:"2025-12-05", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2025-12-05T09:00:00Z" },
  { booking_reference:"AC-M04A", service_id:"growth-60",   service_name:"Growth Marketing Session", name:"Grace Patel",    email:"grace@test.com",   preferred_date:"2026-01-12", preferred_time:"14:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-01-12T09:00:00Z" },
  { booking_reference:"AC-M04B", service_id:"hiring-45",   service_name:"Hiring Advisory",          name:"Henry Nair",     email:"henry@test.com",   preferred_date:"2026-01-20", preferred_time:"11:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-01-20T09:00:00Z" },
  { booking_reference:"AC-M05A", service_id:"product-30",  service_name:"Product Consulting",       name:"Jay Verma",      email:"jay@test.com",     preferred_date:"2026-02-08", preferred_time:"09:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-02-08T09:00:00Z" },
  { booking_reference:"AC-M05B", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Kim Reddy",      email:"kim@test.com",     preferred_date:"2026-02-14", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-02-14T09:00:00Z" },
  { booking_reference:"AC-M05C", service_id:"growth-60",   service_name:"Growth Marketing Session", name:"Leo Iyer",       email:"leo@test.com",     preferred_date:"2026-02-22", preferred_time:"14:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-02-22T09:00:00Z" },
  { booking_reference:"AC-M06A", service_id:"tech-60",     service_name:"Tech Advisory",            name:"Neo Bhat",       email:"neo@test.com",     preferred_date:"2026-03-07", preferred_time:"15:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-03-07T09:00:00Z" },
  { booking_reference:"AC-M07A", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Pia Menon",      email:"pia@test.com",     preferred_date:"2026-04-03", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-04-03T09:00:00Z" },
  { booking_reference:"AC-M07B", service_id:"growth-60",   service_name:"Growth Marketing Session", name:"Raj Chopra",     email:"raj@test.com",     preferred_date:"2026-04-11", preferred_time:"14:00", timezone:"Asia/Kolkata", status:"completed", created_at:"2026-04-11T09:00:00Z" },
  { booking_reference:"AC-M08A", service_id:"product-30",  service_name:"Product Consulting",       name:"Uma Bajaj",      email:"uma@test.com",     preferred_date:"2026-05-06", preferred_time:"09:00", timezone:"Asia/Kolkata", status:"confirmed", created_at:"2026-05-06T09:00:00Z" },
  { booking_reference:"AC-M08B", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Vir Malhotra",   email:"vir@test.com",     preferred_date:"2026-05-14", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"confirmed", created_at:"2026-05-14T09:00:00Z" },
  { booking_reference:"AC-M09A", service_id:"growth-60",   service_name:"Growth Marketing Session", name:"Wren Kapoor",    email:"wren@test.com",    preferred_date:"2026-06-09", preferred_time:"14:00", timezone:"Asia/Kolkata", status:"confirmed", created_at:"2026-06-09T09:00:00Z" },
  { booking_reference:"AC-M09B", service_id:"hiring-45",   service_name:"Hiring Advisory",          name:"Xena Shah",      email:"xena@test.com",    preferred_date:"2026-06-17", preferred_time:"11:00", timezone:"Asia/Kolkata", status:"confirmed", created_at:"2026-06-17T09:00:00Z" },
  { booking_reference:"AC-M10A", service_id:"product-30",  service_name:"Product Consulting",       name:"Zara Sinha",     email:"zara@test.com",    preferred_date:"2026-07-04", preferred_time:"09:00", timezone:"Asia/Kolkata", status:"pending",   created_at:"2026-07-04T09:00:00Z" },
  { booking_reference:"AC-M10B", service_id:"strategy-30", service_name:"Business Strategy Call",   name:"Aryan Mishra",   email:"aryan@test.com",   preferred_date:"2026-07-12", preferred_time:"10:00", timezone:"Asia/Kolkata", status:"pending",   created_at:"2026-07-12T09:00:00Z" },
  { booking_reference:"AC-M11A", service_id:"growth-60",   service_name:"Growth Marketing Session", name:"Bhanu Pandey",   email:"bhanu@test.com",   preferred_date:"2026-08-05", preferred_time:"14:00", timezone:"Asia/Kolkata", status:"pending",   created_at:"2026-08-05T09:00:00Z" },
  { booking_reference:"AC-M11B", service_id:"hiring-45",   service_name:"Hiring Advisory",          name:"Charu Dixit",    email:"charu@test.com",   preferred_date:"2026-08-13", preferred_time:"11:00", timezone:"Asia/Kolkata", status:"pending",   created_at:"2026-08-13T09:00:00Z" },
];

const SEED_CONTACTS = [
  { name:"Alice Kumar",  email:"alice2@test.com",  company:"StartupX",     message:"Interested in strategy consulting.",      created_at:"2025-10-10T08:00:00Z" },
  { name:"Bob Singh",    email:"bob2@test.com",    company:"GrowthCo",     message:"Need help with marketing.",               created_at:"2025-11-05T08:00:00Z" },
  { name:"Carol Mehta",  email:"carol2@test.com",  company:"TechVenture",  message:"Looking for tech advisory.",              created_at:"2025-12-08T08:00:00Z" },
  { name:"David Rao",    email:"david2@test.com",  company:"ScaleUp",      message:"Want to discuss hiring strategy.",        created_at:"2026-01-15T08:00:00Z" },
  { name:"Eva Sharma",   email:"eva2@test.com",    company:"Innovate",     message:"Interested in product consulting.",       created_at:"2026-02-10T08:00:00Z" },
  { name:"Frank Gupta",  email:"frank2@test.com",  company:"BuildCo",      message:"Inquiry about enterprise package.",       created_at:"2026-03-12T08:00:00Z" },
  { name:"Grace Patel",  email:"grace2@test.com",  company:"NextGen",      message:"Would love a market insights briefing.",  created_at:"2026-04-08T08:00:00Z" },
  { name:"Henry Nair",   email:"henry2@test.com",  company:"Founders Inc", message:"Looking for a 60-min growth session.",    created_at:"2026-05-09T08:00:00Z" },
  { name:"Iris Joshi",   email:"iris2@test.com",   company:"DeepTech",     message:"Need architecture review ASAP.",          created_at:"2026-06-11T08:00:00Z" },
  { name:"Jay Verma",    email:"jay2@test.com",    company:"QuickScale",   message:"Referral from Sarah. Want to connect.",   created_at:"2026-07-07T08:00:00Z" },
  { name:"Kim Reddy",    email:"kim2@test.com",    company:"Launchpad",    message:"Exploring consulting options for Q4.",    created_at:"2026-08-06T08:00:00Z" },
];

const SEED_ANALYTICS = [
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2025-10-05T10:00:00Z" },
  { event_type:"page_view", page:"/services", metadata:{ source:"Direct"         }, created_at:"2025-11-08T10:00:00Z" },
  { event_type:"page_view", page:"/pricing",  metadata:{ source:"Social"         }, created_at:"2025-12-10T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2026-01-14T10:00:00Z" },
  { event_type:"page_view", page:"/blog",     metadata:{ source:"Referral"       }, created_at:"2026-01-20T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2026-02-07T10:00:00Z" },
  { event_type:"page_view", page:"/contact",  metadata:{ source:"Email"          }, created_at:"2026-02-18T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Direct"         }, created_at:"2026-03-09T10:00:00Z" },
  { event_type:"cta_click", page:"/",         metadata:{ cta:"Book a Demo"       }, created_at:"2026-03-15T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2026-04-06T10:00:00Z" },
  { event_type:"page_view", page:"/services", metadata:{ source:"Social"         }, created_at:"2026-04-14T10:00:00Z" },
  { event_type:"cta_click", page:"/pricing",  metadata:{ cta:"Start Growing Free"}, created_at:"2026-05-03T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2026-05-11T10:00:00Z" },
  { event_type:"page_view", page:"/portfolio",metadata:{ source:"Referral"       }, created_at:"2026-06-05T10:00:00Z" },
  { event_type:"cta_click", page:"/",         metadata:{ cta:"Book a Demo"       }, created_at:"2026-06-19T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Direct"         }, created_at:"2026-07-03T10:00:00Z" },
  { event_type:"page_view", page:"/pricing",  metadata:{ source:"Organic Search" }, created_at:"2026-07-16T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Social"         }, created_at:"2026-08-02T10:00:00Z" },
  { event_type:"contact_form_submit", page:"/contact", metadata:{}, created_at:"2026-08-09T10:00:00Z" },
  { event_type:"page_view", page:"/",         metadata:{ source:"Organic Search" }, created_at:"2026-08-13T10:00:00Z" },
];

function SettingsPage() {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [seedStatus, setSeedStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [seedMsg,    setSeedMsg]    = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        setName(data.user.user_metadata?.full_name ?? "");
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("loading");
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setSaveStatus(error ? "error" : "success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleSeed = async () => {
    setSeedStatus("loading");
    setSeedMsg("Inserting data...");
    try {
      // Bookings — insert one by one ignoring duplicates
      let bkOk = 0;
      for (const row of SEED_BOOKINGS) {
        const { error } = await supabase.from("demo_bookings").insert(row);
        if (!error) bkOk++;
      }

      // Contacts
      let ctOk = 0;
      for (const row of SEED_CONTACTS) {
        const { error } = await supabase.from("contacts").insert(row);
        if (!error) ctOk++;
      }

      // Analytics
      const { error: evErr } = await supabase.from("analytics_events").insert(SEED_ANALYTICS);

      setSeedMsg(`✅ Inserted ${bkOk} bookings, ${ctOk} contacts, ${evErr ? 0 : SEED_ANALYTICS.length} analytics events. Go to Dashboard to see the chart!`);
      setSeedStatus("success");
    } catch (err: any) {
      setSeedMsg(`Error: ${err.message}`);
      setSeedStatus("error");
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account and database.</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-white/[0.06] p-7" style={{ background: "#131824" }}>
        <h2 className="text-base font-semibold text-white mb-5">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {[
            { label: "Full Name",      value: name,  set: setName,      type: "text",  disabled: false },
            { label: "Email Address",  value: email, set: ()=>{},       type: "email", disabled: true  },
          ].map(({ label, value, set, type, disabled }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-white/35">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => (set as any)(e.target.value)}
                disabled={disabled}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saveStatus === "loading"}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          >
            {saveStatus === "loading" && <Loader2 className="size-4 animate-spin" />}
            {saveStatus === "success" && <Check className="size-4" />}
            {saveStatus === "success" ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Seed data */}
      <div className="rounded-2xl border border-white/[0.06] p-7" style={{ background: "#131824" }}>
        <div className="flex items-start gap-3 mb-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15 shrink-0">
            <Database className="size-4 text-blue-400" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">Seed Test Data</h2>
            <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
              Inserts 20 bookings + 11 contacts + 20 analytics events spread across the last 12 months so the dashboard chart shows real pillars with values.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSeed}
          disabled={seedStatus === "loading" || seedStatus === "success"}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
        >
          {seedStatus === "loading" && <Loader2 className="size-4 animate-spin" />}
          {seedStatus === "success" && <Check className="size-4" />}
          {seedStatus === "idle"    && <Database className="size-4" />}
          {seedStatus === "loading" ? "Inserting..." : seedStatus === "success" ? "Done!" : "Seed Dashboard Data"}
        </button>

        {seedMsg && (
          <p className={`mt-3 text-sm leading-relaxed ${seedStatus === "success" ? "text-green-400" : "text-red-400"}`}>
            {seedMsg}
          </p>
        )}
      </div>
    </div>
  );
}
