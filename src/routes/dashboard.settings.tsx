import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Shield,
  Bell,
  Key,
  CreditCard,
  Check,
  Loader2,
  RefreshCw,
  Download,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  CheckCircle,
  TrendingUp,
  Users,
  History,
  AlertTriangle,
  Trash2,
  Plus,
  MoreVertical,
  Sliders,
  Terminal,
  Database,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ChevronDown,
  Copy,
} from "lucide-react";
import { supabase, SEED_EXPERTS } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings & Workspace — ConnectXpert" }] }),
  component: SettingsPage,
});

// ── Seed Data Definitions (For Restricted Developer Mode) ────────────────────
const SEED_BOOKINGS = [
  { booking_reference: "AC-SF01", service_id: "tech-60", service_name: "Salesforce Multi-Cloud Architecture", name: "Ananya Deshmukh", email: "ananya.cta@salesforce-consulting.com", company: "Salesforce Ecosystem Group", preferred_date: "2026-09-24", preferred_time: "11:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-09-22T09:00:00Z" },
  { booking_reference: "AC-TCS02", service_id: "tech-60", service_name: "TCS Enterprise Cloud Migration", name: "Sanjay Krishnan", email: "sanjay.k@tcs-consultancy.com", company: "TCS Enterprise Financial Systems", preferred_date: "2026-09-25", preferred_time: "15:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-09-22T10:00:00Z" },
  { booking_reference: "AC-M01A", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Alice Kumar", email: "alice@test.com", preferred_date: "2025-10-15", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2025-10-15T09:00:00Z" },
  { booking_reference: "AC-M02A", service_id: "hiring-45", service_name: "Hiring Advisory", name: "Carol Mehta", email: "carol@test.com", preferred_date: "2025-11-10", preferred_time: "11:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2025-11-10T09:00:00Z" },
  { booking_reference: "AC-M02B", service_id: "tech-60", service_name: "Tech Advisory", name: "David Rao", email: "david@test.com", preferred_date: "2025-11-18", preferred_time: "15:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2025-11-18T09:00:00Z" },
  { booking_reference: "AC-M03A", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Frank Gupta", email: "frank@test.com", preferred_date: "2025-12-05", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2025-12-05T09:00:00Z" },
  { booking_reference: "AC-M04A", service_id: "growth-60", service_name: "Growth Marketing Session", name: "Grace Patel", email: "grace@test.com", preferred_date: "2026-01-12", preferred_time: "14:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-01-12T09:00:00Z" },
  { booking_reference: "AC-M04B", service_id: "hiring-45", service_name: "Hiring Advisory", name: "Henry Nair", email: "henry@test.com", preferred_date: "2026-01-20", preferred_time: "11:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-01-20T09:00:00Z" },
  { booking_reference: "AC-M05A", service_id: "product-30", service_name: "Product Consulting", name: "Jay Verma", email: "jay@test.com", preferred_date: "2026-02-08", preferred_time: "09:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-02-08T09:00:00Z" },
  { booking_reference: "AC-M05B", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Kim Reddy", email: "kim@test.com", preferred_date: "2026-02-14", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-02-14T09:00:00Z" },
  { booking_reference: "AC-M05C", service_id: "growth-60", service_name: "Growth Marketing Session", name: "Leo Iyer", email: "leo@test.com", preferred_date: "2026-02-22", preferred_time: "14:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-02-22T09:00:00Z" },
  { booking_reference: "AC-M06A", service_id: "tech-60", service_name: "Tech Advisory", name: "Neo Bhat", email: "neo@test.com", preferred_date: "2026-03-07", preferred_time: "15:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-03-07T09:00:00Z" },
  { booking_reference: "AC-M07A", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Pia Menon", email: "pia@test.com", preferred_date: "2026-04-03", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-04-03T09:00:00Z" },
  { booking_reference: "AC-M07B", service_id: "growth-60", service_name: "Growth Marketing Session", name: "Raj Chopra", email: "raj@test.com", preferred_date: "2026-04-11", preferred_time: "14:00", timezone: "Asia/Kolkata", status: "completed", created_at: "2026-04-11T09:00:00Z" },
  { booking_reference: "AC-M08A", service_id: "product-30", service_name: "Product Consulting", name: "Uma Bajaj", email: "uma@test.com", preferred_date: "2026-05-06", preferred_time: "09:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-05-06T09:00:00Z" },
  { booking_reference: "AC-M08B", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Vir Malhotra", email: "vir@test.com", preferred_date: "2026-05-14", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-05-14T09:00:00Z" },
  { booking_reference: "AC-M09A", service_id: "growth-60", service_name: "Growth Marketing Session", name: "Wren Kapoor", email: "wren@test.com", preferred_date: "2026-06-09", preferred_time: "14:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-06-09T09:00:00Z" },
  { booking_reference: "AC-M09B", service_id: "hiring-45", service_name: "Hiring Advisory", name: "Xena Shah", email: "xena@test.com", preferred_date: "2026-06-17", preferred_time: "11:00", timezone: "Asia/Kolkata", status: "confirmed", created_at: "2026-06-17T09:00:00Z" },
  { booking_reference: "AC-M10A", service_id: "product-30", service_name: "Product Consulting", name: "Zara Sinha", email: "zara@test.com", preferred_date: "2026-07-04", preferred_time: "09:00", timezone: "Asia/Kolkata", status: "pending", created_at: "2026-07-04T09:00:00Z" },
  { booking_reference: "AC-M10B", service_id: "strategy-30", service_name: "Business Strategy Call", name: "Aryan Mishra", email: "aryan@test.com", preferred_date: "2026-07-12", preferred_time: "10:00", timezone: "Asia/Kolkata", status: "pending", created_at: "2026-07-12T09:00:00Z" },
  { booking_reference: "AC-M11A", service_id: "growth-60", service_name: "Growth Marketing Session", name: "Bhanu Pandey", email: "bhanu@test.com", preferred_date: "2026-08-05", preferred_time: "14:00", timezone: "Asia/Kolkata", status: "pending", created_at: "2026-08-05T09:00:00Z" },
  { booking_reference: "AC-M11B", service_id: "hiring-45", service_name: "Hiring Advisory", name: "Charu Dixit", email: "charu@test.com", preferred_date: "2026-08-13", preferred_time: "11:00", timezone: "Asia/Kolkata", status: "pending", created_at: "2026-08-13T09:00:00Z" },
];

const SEED_CONTACTS = [
  { name: "Rahul Deshmukh", email: "r.deshmukh@salesforce-client.com", company: "Salesforce Ventures Partner", message: "Inquiring about multi-cloud Salesforce CPQ & Data Cloud advisory.", created_at: "2026-09-20T08:00:00Z" },
  { name: "Suresh Menon", email: "suresh.menon@tcs-banking.com", company: "TCS Enterprise Solutions", message: "Looking for cloud migration and TCS BaNCS modernization specialists.", created_at: "2026-09-21T08:00:00Z" },
  { name: "Alice Kumar", email: "alice2@test.com", company: "StartupX", message: "Interested in strategy consulting.", created_at: "2025-10-10T08:00:00Z" },
  { name: "Bob Singh", email: "bob2@test.com", company: "GrowthCo", message: "Need help with marketing.", created_at: "2025-11-05T08:00:00Z" },
  { name: "Carol Mehta", email: "carol2@test.com", company: "TechVenture", message: "Looking for tech advisory.", created_at: "2025-12-08T08:00:00Z" },
  { name: "David Rao", email: "david2@test.com", company: "ScaleUp", message: "Want to discuss hiring strategy.", created_at: "2026-01-15T08:00:00Z" },
  { name: "Eva Sharma", email: "eva2@test.com", company: "Innovate", message: "Interested in product consulting.", created_at: "2026-02-10T08:00:00Z" },
  { name: "Frank Gupta", email: "frank2@test.com", company: "BuildCo", message: "Inquiry about enterprise package.", created_at: "2026-03-12T08:00:00Z" },
  { name: "Grace Patel", email: "grace2@test.com", company: "NextGen", message: "Would love a market insights briefing.", created_at: "2026-04-08T08:00:00Z" },
  { name: "Henry Nair", email: "henry2@test.com", company: "Founders Inc", message: "Looking for a 60-min growth session.", created_at: "2026-05-09T08:00:00Z" },
  { name: "Iris Joshi", email: "iris2@test.com", company: "DeepTech", message: "Need architecture review ASAP.", created_at: "2026-06-11T08:00:00Z" },
  { name: "Jay Verma", email: "jay2@test.com", company: "QuickScale", message: "Referral from Sarah. Want to connect.", created_at: "2026-07-07T08:00:00Z" },
  { name: "Kim Reddy", email: "kim2@test.com", company: "Launchpad", message: "Exploring consulting options for Q4.", created_at: "2026-08-06T08:00:00Z" },
];

const SEED_ANALYTICS = [
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2025-10-05T10:00:00Z" },
  { event_type: "page_view", page: "/services", metadata: { source: "Direct" }, created_at: "2025-11-08T10:00:00Z" },
  { event_type: "page_view", page: "/pricing", metadata: { source: "Social" }, created_at: "2025-12-10T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2026-01-14T10:00:00Z" },
  { event_type: "page_view", page: "/blog", metadata: { source: "Referral" }, created_at: "2026-01-20T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2026-02-07T10:00:00Z" },
  { event_type: "page_view", page: "/contact", metadata: { source: "Email" }, created_at: "2026-02-18T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Direct" }, created_at: "2026-03-09T10:00:00Z" },
  { event_type: "cta_click", page: "/", metadata: { cta: "Book a Demo" }, created_at: "2026-03-15T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2026-04-06T10:00:00Z" },
  { event_type: "page_view", page: "/services", metadata: { source: "Social" }, created_at: "2026-04-14T10:00:00Z" },
  { event_type: "cta_click", page: "/pricing", metadata: { cta: "Start Growing Free" }, created_at: "2026-05-03T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2026-05-11T10:00:00Z" },
  { event_type: "page_view", page: "/portfolio", metadata: { source: "Referral" }, created_at: "2026-06-05T10:00:00Z" },
  { event_type: "cta_click", page: "/", metadata: { cta: "Book a Demo" }, created_at: "2026-06-19T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Direct" }, created_at: "2026-07-03T10:00:00Z" },
  { event_type: "page_view", page: "/pricing", metadata: { source: "Organic Search" }, created_at: "2026-07-16T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Social" }, created_at: "2026-08-02T10:00:00Z" },
  { event_type: "contact_form_submit", page: "/contact", metadata: {}, created_at: "2026-08-09T10:00:00Z" },
  { event_type: "page_view", page: "/", metadata: { source: "Organic Search" }, created_at: "2026-08-13T10:00:00Z" },
];

type SettingsTab = "profile" | "team" | "security" | "notifications" | "audit" | "api" | "billing" | "devtools";

// Mock Team Members
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Operations Lead" | "Support Manager" | "Analyst";
  status: "active" | "invited" | "suspended";
  avatarBg: string;
  lastActive: string;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "1", name: "Ansh Ojha", email: "anshojha420@gmail.com", role: "Super Admin", status: "active", avatarBg: "from-blue-600 to-indigo-600", lastActive: "Active now" },
  { id: "2", name: "Sarah Jenkins", email: "sarah.j@connectxpert.com", role: "Operations Lead", status: "active", avatarBg: "from-emerald-500 to-teal-600", lastActive: "2 hours ago" },
  { id: "3", name: "Marcus Vance", email: "marcus.v@connectxpert.com", role: "Support Manager", status: "active", avatarBg: "from-purple-500 to-pink-600", lastActive: "Yesterday" },
  { id: "4", name: "Priya Rao", email: "priya.rao@connectxpert.com", role: "Analyst", status: "invited", avatarBg: "from-amber-500 to-orange-600", lastActive: "Pending invite" },
];

// Mock Audit Logs
interface AuditLogEntry {
  id: string;
  action: string;
  category: "Security" | "Profile" | "Integrations" | "Team" | "Billing";
  user: string;
  ip: string;
  timestamp: string;
  status: "Success" | "Warning" | "Failed";
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "log-1", action: "Google OAuth sign-in successful", category: "Security", user: "Ansh Ojha (Super Admin)", ip: "192.168.0.197", timestamp: "Just now", status: "Success" },
  { id: "log-2", action: "Updated Profile & Timezone configuration", category: "Profile", user: "Ansh Ojha (Super Admin)", ip: "192.168.0.197", timestamp: "12 mins ago", status: "Success" },
  { id: "log-3", action: "Supabase connection verified", category: "Integrations", user: "System Telemetry", ip: "Internal", timestamp: "35 mins ago", status: "Success" },
  { id: "log-4", action: "Team member invitation sent to priya.rao@connectxpert.com", category: "Team", user: "Ansh Ojha", ip: "192.168.0.197", timestamp: "2 hours ago", status: "Success" },
  { id: "log-5", action: "Attempted password modification with invalid credentials", category: "Security", user: "Unknown session", ip: "49.37.142.12", timestamp: "Yesterday, 18:42", status: "Warning" },
  { id: "log-6", action: "Exported Full Workspace Telemetry JSON", category: "Integrations", user: "Ansh Ojha", ip: "192.168.0.197", timestamp: "2 days ago", status: "Success" },
];

function SettingsPage() {
  // Set default tab to "profile"
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form States
  const [fullName, setFullName] = useState("Ansh Ojha");
  const [email, setEmail] = useState("anshojha420@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [jobTitle, setJobTitle] = useState("Product Lead & Founder");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST +5:30)");
  const [bio, setBio] = useState("Managing ConnectXpert advisory operations, client bookings, and expert onboarding.");
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  // Live Database Stats
  const [counts, setCounts] = useState({ bookings: 0, contacts: 0, analytics: 0, experts: 0 });
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [lastSynced, setLastSynced] = useState("Just now");

  // Security Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");

  // Notification Toggles
  const [notifs, setNotifs] = useState({
    bookingAlerts: true,
    leadEmails: true,
    weeklyReport: true,
    securityAlerts: true,
    soundChime: false,
  });

  // Team & Audit State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [auditFilter, setAuditFilter] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Support Manager");

  // Developer Seed State (Hidden under Developer Tools)
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [seedProgress, setSeedProgress] = useState("");
  const [dangerConfirm, setDangerConfirm] = useState("");
  const [isWiping, setIsWiping] = useState(false);

  // Fetch initial profile & table counts
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const metadata = data.user.user_metadata as Record<string, any> | undefined;
        if (metadata && typeof metadata["full_name"] === "string") {
          setFullName(metadata["full_name"]);
        }
      } else if (typeof window !== "undefined") {
        const demo = localStorage.getItem("cx_demo_user");
        if (demo) {
          try {
            const parsed = JSON.parse(demo);
            setEmail(parsed.email || "anshojha420@gmail.com");
            setFullName(parsed.user_metadata?.full_name || "Ansh Ojha");
          } catch {}
        }
      }
    });

    fetchCounts();
  }, []);

  async function fetchCounts() {
    setLoadingCounts(true);
    try {
      const [bkRes, ctRes, anRes, exRes] = await Promise.all([
        supabase.from("demo_bookings").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("analytics_events").select("*", { count: "exact", head: true }),
        supabase.from("experts").select("*", { count: "exact", head: true }),
      ]);
      setCounts({
        bookings: bkRes.count || 0,
        contacts: ctRes.count || 0,
        analytics: anRes.count || 0,
        experts: exRes.count || 6,
      });
      setLastSynced("Just now");
    } catch {
      // Fallback
    } finally {
      setLoadingCounts(false);
    }
  }

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("loading");
    setSaveMessage("");

    if (typeof window !== "undefined" && localStorage.getItem("cx_demo_user")) {
      try {
        const demo = JSON.parse(localStorage.getItem("cx_demo_user") || "{}");
        demo.user_metadata = { ...demo.user_metadata, full_name: fullName, job_title: jobTitle, phone, bio };
        localStorage.setItem("cx_demo_user", JSON.stringify(demo));
        setSaveStatus("success");
        setSaveMessage("Profile updated successfully!");

        // Add to audit log
        setAuditLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            action: `Admin profile updated for ${fullName}`,
            category: "Profile",
            user: fullName,
            ip: "192.168.0.197",
            timestamp: "Just now",
            status: "Success",
          },
          ...prev,
        ]);

        setTimeout(() => setSaveStatus("idle"), 3500);
        return;
      } catch {}
    }

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, job_title: jobTitle, phone, bio },
    });

    if (error) {
      setSaveStatus("error");
      setSaveMessage(error.message);
    } else {
      setSaveStatus("success");
      setSaveMessage("Profile updated successfully!");
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: `Profile details modified`,
          category: "Profile",
          user: fullName,
          ip: "192.168.0.197",
          timestamp: "Just now",
          status: "Success",
        },
        ...prev,
      ]);
    }
    setTimeout(() => setSaveStatus("idle"), 3500);
  };

  // Export JSON Backup
  const handleExportJSON = async () => {
    try {
      const [bk, ct, an, ex] = await Promise.all([
        supabase.from("demo_bookings").select("*"),
        supabase.from("contacts").select("*"),
        supabase.from("analytics_events").select("*"),
        supabase.from("experts").select("*"),
      ]);
      const backup = {
        exportedAt: new Date().toISOString(),
        system: "ConnectXpert Suite",
        data: {
          bookings: bk.data || [],
          contacts: ct.data || [],
          analytics: an.data || [],
          experts: ex.data || [],
        },
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `connectxpert-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();

      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: `Workspace backup exported (.json)`,
          category: "Integrations",
          user: fullName,
          ip: "192.168.0.197",
          timestamp: "Just now",
          status: "Success",
        },
        ...prev,
      ]);
    } catch (err: any) {
      alert("Failed to export backup: " + err.message);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPwStatus("error");
      setPwMsg("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus("error");
      setPwMsg("Passwords do not match.");
      return;
    }
    setPwStatus("loading");
    setPwMsg("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwStatus("error");
      setPwMsg(error.message);
    } else {
      setPwStatus("success");
      setPwMsg("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");

      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action: `Account credentials / password rotated`,
          category: "Security",
          user: fullName,
          ip: "192.168.0.197",
          timestamp: "Just now",
          status: "Success",
        },
        ...prev,
      ]);
    }
    setTimeout(() => setPwStatus("idle"), 4000);
  };

  // Developer Seed Methods
  const handleDevSeedMaster = async () => {
    setSeedStatus("loading");
    setSeedProgress("Injecting sandbox records for local evaluation...");
    try {
      for (const row of SEED_BOOKINGS) await supabase.from("demo_bookings").insert(row as any);
      for (const row of SEED_CONTACTS) await supabase.from("contacts").insert(row as any);
      await supabase.from("analytics_events").insert(SEED_ANALYTICS as any);
      for (const exp of SEED_EXPERTS) await supabase.from("experts").insert(exp as any);

      await fetchCounts();
      setSeedStatus("success");
      setSeedProgress("Sandbox seed complete.");
      setTimeout(() => setSeedStatus("idle"), 4000);
    } catch (err: any) {
      setSeedStatus("error");
      setSeedProgress(`Error: ${err.message}`);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: inviteEmail.split("@")[0] || "Team Member",
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      avatarBg: "from-blue-500 to-indigo-600",
      lastActive: "Invited just now",
    };
    setTeamMembers([...teamMembers, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: `Team invitation dispatched to ${inviteEmail} as ${inviteRole}`,
        category: "Team",
        user: fullName,
        ip: "192.168.0.197",
        timestamp: "Just now",
        status: "Success",
      },
      ...prev,
    ]);
  };

  const filteredLogs = useMemo(() => {
    if (auditFilter === "all") return auditLogs;
    return auditLogs.filter((l) => l.category.toLowerCase() === auditFilter.toLowerCase());
  }, [auditLogs, auditFilter]);

  const navTabs = [
    { id: "profile" as SettingsTab, label: "Profile & Identity", icon: User },
    { id: "team" as SettingsTab, label: "Team & Access", icon: Users },
    { id: "security" as SettingsTab, label: "Security & Auth", icon: Shield },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "audit" as SettingsTab, label: "Audit Logs", icon: History },
    { id: "api" as SettingsTab, label: "API & Integrations", icon: Key },
    { id: "billing" as SettingsTab, label: "Plan & Billing", icon: CreditCard },
    { id: "devtools" as SettingsTab, label: "Developer Sandbox", icon: Terminal },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Settings & Workspace</h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Production Active
            </span>
          </div>
          <p className="mt-1 text-sm text-white/45">
            Manage your administrator credentials, team roles, platform security, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCounts}
            disabled={loadingCounts}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className={cn("size-3.5", loadingCounts && "animate-spin text-blue-400")} />
            Sync Metrics
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 px-3.5 py-2 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-600/30"
          >
            <Download className="size-3.5" />
            Export Backup
          </button>
        </div>
      </div>

      {/* ── Top Live Real Telemetry Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Total Bookings", val: counts.bookings, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Client Inquiries", val: counts.contacts, icon: Mail, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Analytics Events", val: counts.analytics, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Vetted Experts", val: counts.experts, icon: User, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.06] p-4 flex items-center justify-between"
            style={{ background: "#131824" }}
          >
            <div>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-1">
                {loadingCounts ? <span className="text-white/20 text-sm">Loading...</span> : stat.val}
              </p>
              <p className="text-[10px] text-white/30 mt-1 flex items-center gap-1">
                <Clock className="size-2.5" /> Updated {lastSynced}
              </p>
            </div>
            <span className={cn("flex size-10 items-center justify-center rounded-xl shrink-0", stat.bg)}>
              <stat.icon className={cn("size-5", stat.color)} />
            </span>
          </div>
        ))}
      </div>

      {/* ── Clean Pill-Shaped Navigation Bar ── */}
      <div className="flex overflow-x-auto gap-2 rounded-2xl bg-[#0e131f] p-1.5 border border-white/[0.06] no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200",
                active
                  ? "bg-blue-600 text-white shadow-[0_0_16px_-4px_rgba(59,130,246,0.6)]"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/90"
              )}
            >
              <Icon className={cn("size-4", active ? "text-white" : "text-white/40")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: PROFILE & IDENTITY (Default) ── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar & Summary Card */}
          <div className="rounded-2xl border border-white/[0.06] p-6 flex flex-col items-center text-center space-y-4" style={{ background: "#131824" }}>
            <div className="relative">
              <div className="size-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-[#0a0e17] shadow-xl">
                {fullName.slice(0, 2).toUpperCase() || "AO"}
              </div>
              <span className="absolute bottom-1 right-1 size-5 rounded-full bg-emerald-500 border-2 border-[#131824]" title="Active Super Admin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{fullName}</h2>
              <p className="text-xs text-white/40 mt-0.5">{jobTitle}</p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                Super Admin
              </div>
            </div>

            <div className="w-full pt-4 border-t border-white/[0.06] space-y-2.5 text-left">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Account Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Verified Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Security Level</span>
                <span className="text-white/80">Tier 1 Root Access</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Primary Region</span>
                <span className="text-white/80">Asia/Kolkata (IST)</span>
              </div>
            </div>
          </div>

          {/* Profile Form Fields */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] p-7" style={{ background: "#131824" }}>
            <h2 className="text-base font-semibold text-white mb-6">Personal & Organization Details</h2>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white/50 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Job Title / Role</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Primary Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Bio / About</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saveStatus === "loading"}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 disabled:opacity-60"
                >
                  {saveStatus === "loading" && <Loader2 className="size-4 animate-spin" />}
                  {saveStatus === "success" && <Check className="size-4" />}
                  {saveStatus === "success" ? "Saved!" : "Save Changes"}
                </button>

                {saveMessage && (
                  <p className={cn("text-xs font-medium", saveStatus === "success" ? "text-emerald-400" : "text-red-400")}>
                    {saveMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 2: TEAM & ACCESS (New) ── */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] p-7" style={{ background: "#131824" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Team Members & Access Roles</h2>
                <p className="text-xs text-white/40 mt-0.5">Manage administrator privileges and invite team members</p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-500 shadow-[0_0_14px_rgba(37,99,235,0.4)]"
              >
                <Plus className="size-3.5" /> Invite Team Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Last Active</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="text-white/80 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn("size-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-white text-xs font-bold shrink-0", member.avatarBg)}>
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{member.name}</p>
                            <p className="text-[11px] text-white/40">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          member.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}>
                          <span className={cn("size-1.5 rounded-full", member.status === "active" ? "bg-emerald-400" : "bg-amber-400")} />
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-white/40">{member.lastActive}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SECURITY & AUTH ── */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Update Card */}
            <div className="rounded-2xl border border-white/[0.06] p-7" style={{ background: "#131824" }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                  <Lock className="size-4" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">Update Password</h2>
                  <p className="text-xs text-white/40">Ensure your account uses a strong passphrase</p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-blue-500/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pwStatus === "loading"}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
                >
                  {pwStatus === "loading" && <Loader2 className="size-3.5 animate-spin" />}
                  {pwStatus === "success" && <Check className="size-3.5" />}
                  Update Password
                </button>

                {pwMsg && (
                  <p className={cn("text-xs", pwStatus === "success" ? "text-emerald-400" : "text-red-400")}>
                    {pwMsg}
                  </p>
                )}
              </form>
            </div>

            {/* Connected Providers & 2FA */}
            <div className="rounded-2xl border border-white/[0.06] p-7 space-y-6" style={{ background: "#131824" }}>
              <div>
                <h2 className="text-base font-semibold text-white">OAuth Connections</h2>
                <p className="text-xs text-white/40 mt-0.5">Manage external single sign-on identity providers</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-white p-1.5">
                      <svg className="size-full" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Google Identity</p>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="size-3" /> Connected & Active
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    Active SSO
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-white/40">Require authenticator verification for sensitive operations</p>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                  Optional
                </span>
              </div>
            </div>
          </div>

          {/* ── Danger Zone ── */}
          <div className="rounded-2xl border border-red-500/30 p-7 space-y-5" style={{ background: "rgba(239, 68, 68, 0.04)" }}>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                <ShieldAlert className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-red-400">Danger Zone</h3>
                <p className="text-xs text-white/40">Destructive actions require explicit verification</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-red-500/15">
              <div>
                <p className="text-xs font-semibold text-white">Wipe Workspace Cache & Session Tokens</p>
                <p className="text-[11px] text-white/40 mt-0.5">Logs out all active admin sessions and refreshes authorization tokens</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to invalidate all active session tokens? You will be prompted to re-authenticate.")) {
                    localStorage.removeItem("cx_demo_user");
                    supabase.auth.signOut();
                    window.location.href = "/login";
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 shrink-0"
              >
                <Trash2 className="size-3.5" /> Invalidate Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div className="rounded-2xl border border-white/[0.06] p-7 space-y-6" style={{ background: "#131824" }}>
          <div>
            <h2 className="text-base font-semibold text-white">Notification Preferences</h2>
            <p className="text-xs text-white/40 mt-0.5">Control how and when you receive critical platform alerts</p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {[
              { id: "bookingAlerts" as const, title: "New Booking Alerts", desc: "Instant email when a client schedules or books a session" },
              { id: "leadEmails" as const, title: "Inbound Lead Inquiries", desc: "Notification whenever a contact or inquiry form is submitted" },
              { id: "weeklyReport" as const, title: "Weekly Analytics Digest", desc: "Summary of page views, conversion rate, and revenue on Monday mornings" },
              { id: "securityAlerts" as const, title: "Security & Login Alerts", desc: "Notify if a login attempt occurs from an unrecognized device or IP" },
              { id: "soundChime" as const, title: "In-App Audio Chimes", desc: "Play a pleasant sound effect when real-time updates arrive" },
            ].map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifs({ ...notifs, [item.id]: !notifs[item.id] })}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                    notifs[item.id] ? "bg-blue-600" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      notifs[item.id] ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: AUDIT LOGS (New) ── */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-white/[0.06] p-7 space-y-6" style={{ background: "#131824" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Security & Activity Audit Log</h2>
              <p className="text-xs text-white/40 mt-0.5">Immutable record of administrator actions and system modifications</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] text-xs">
              {["all", "security", "profile", "team", "integrations"].map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 capitalize font-medium transition-colors",
                    auditFilter === f ? "bg-blue-600 text-white" : "text-white/40 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Event Description</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Initiated By</th>
                  <th className="pb-3 font-semibold">IP Address</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="text-white/80 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-medium text-white max-w-xs truncate">{log.action}</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-white/60">{log.user}</td>
                    <td className="py-3.5 text-white/40 font-mono text-[11px]">{log.ip}</td>
                    <td className="py-3.5">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-semibold",
                        log.status === "Success" ? "text-emerald-400" : log.status === "Warning" ? "text-amber-400" : "text-red-400"
                      )}>
                        {log.status === "Success" ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-white/40">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 6: API & SUPABASE ── */}
      {activeTab === "api" && (
        <div className="rounded-2xl border border-white/[0.06] p-7 space-y-6" style={{ background: "#131824" }}>
          <div>
            <h2 className="text-base font-semibold text-white">API & Database Connection</h2>
            <p className="text-xs text-white/40 mt-0.5">Active Supabase connection parameters and endpoints</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Supabase Project URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ndcpfedipeczqdrdffhd.supabase.co"
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white/80 font-mono outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText("https://ndcpfedipeczqdrdffhd.supabase.co")}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-white/60 hover:text-white transition-colors"
                  title="Copy URL"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Supabase Anon Key (Public Client)</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kY3BmZWRpcGVjenFkcmRmZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjIwODksImV4cCI6MjEwNDk5ODA4OX0.jXSJGdbCYMnwAddYEup47mjzSFb8m1cPOoVaUKWLL0w"
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white/80 font-mono outline-none"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kY3BmZWRpcGVjenFkcmRmZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjIwODksImV4cCI6MjEwNDk5ODA4OX0.jXSJGdbCYMnwAddYEup47mjzSFb8m1cPOoVaUKWLL0w"
                    )
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-white/60 hover:text-white transition-colors"
                  title="Copy Anon Key"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 7: BILLING & PLAN ── */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-blue-500/30 p-7 lg:col-span-2 space-y-5" style={{ background: "#131824" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Current Subscription</p>
                <h2 className="text-2xl font-bold text-white mt-1">Enterprise Pro Tier</h2>
              </div>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                Active
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Monthly Consultation Quota</span>
                  <span>42 / 100 hrs used</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Vetted Expert Slots</span>
                  <span>6 / Unlimited</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] p-7 space-y-4" style={{ background: "#131824" }}>
            <h3 className="text-sm font-bold text-white">Payment Method</h3>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center gap-3">
              <CreditCard className="size-6 text-white/60" />
              <div>
                <p className="text-xs font-semibold text-white">Mastercard ending in 4242</p>
                <p className="text-[10px] text-white/40">Expires 12/28</p>
              </div>
            </div>
            <button className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors">
              Manage Invoices
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 8: DEVELOPER SANDBOX (Secured & Isolated) ── */}
      {activeTab === "devtools" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 p-7 space-y-4" style={{ background: "rgba(245, 158, 11, 0.04)" }}>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Terminal className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-amber-400">Developer Sandbox & Test Data</h2>
                <p className="text-xs text-white/50">Restricted environment for staging and mock data injection.</p>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed max-w-2xl">
              These utilities are intended strictly for local development and demonstration staging. Use with caution to avoid injecting dummy records into production accounts.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDevSeedMaster}
                disabled={seedStatus === "loading"}
                className="flex items-center gap-2 rounded-xl bg-amber-600/20 border border-amber-500/40 px-5 py-2.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-600/30 disabled:opacity-60"
              >
                {seedStatus === "loading" && <Loader2 className="size-3.5 animate-spin" />}
                <Database className="size-3.5" /> Seed Mock Records
              </button>
            </div>

            {seedProgress && (
              <p className={cn("text-xs mt-2", seedStatus === "success" ? "text-emerald-400" : "text-amber-400")}>
                {seedProgress}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Invite Team Member Modal ── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "#131824" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@connectxpert.com"
                  required
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-[#1a2030] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Operations Lead">Operations Lead</option>
                  <option value="Support Manager">Support Manager</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
