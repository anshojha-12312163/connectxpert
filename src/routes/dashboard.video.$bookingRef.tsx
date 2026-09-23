import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Video, Copy, Check, Users, PhoneOff, Maximize2, ExternalLink, Mail, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/video/$bookingRef")({
  head: () => ({ meta: [{ title: "Attend Meeting — ConnectXpert" }] }),
  component: VideoCallPage,
});

function VideoCallPage() {
  const { bookingRef } = Route.useParams();
  const navigate = useNavigate();
  const [booking, setBooking]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [copied,  setCopied]    = useState(false);
  const [joined,  setJoined]    = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("demo_bookings")
        .select("*")
        .eq("booking_reference", bookingRef)
        .single();
      setBooking(data);
      setLoading(false);
    }
    load();
  }, [bookingRef]);

  function copyLink() {
    if (!booking?.video_room_url) return;
    navigator.clipboard.writeText(booking.video_room_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleJoinMeeting() {
    if (!booking?.video_room_url) return;
    const isExternalMeeting = booking.video_room_url.includes("meet.google.com") || booking.video_room_url.includes("zoom.us");
    
    if (isExternalMeeting) {
      window.open(booking.video_room_url, "_blank");
      setJoined(true);
    } else {
      setJoined(true);
    }
  }

  function sendGmailInvite() {
    if (!booking) return;
    const subject = `Meeting Invitation: ${booking.service_name || "Advisory Session"} - ConnectXpert [${booking.booking_reference}]`;
    const body = `Hi ${booking.name},

Here is your confirmed meeting link for our upcoming consultation:

📅 Date: ${booking.preferred_date || "Scheduled Date"}
⏰ Time: ${booking.preferred_time || "10:00 AM"} (${booking.timezone || "IST"})
💼 Service: ${booking.service_name || "Advisory"}

🔗 Join Meeting:
${booking.video_room_url}

Best regards,
Ansh Consultancy / ConnectXpert`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(booking.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="text-white/40">Booking session not found.</p>
        <Link to="/dashboard/bookings" className="text-sm text-emerald-400 hover:text-emerald-300">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  const isGoogleMeet = booking.video_room_url?.includes("meet.google.com");
  const isZoom = booking.video_room_url?.includes("zoom.us");
  const isExternal = isGoogleMeet || isZoom;

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto px-2">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/bookings"
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <Video className="size-5 text-emerald-400" />
              {isGoogleMeet ? "Google Meet Session" : isZoom ? "Zoom Advisory Session" : "Video Meeting Room"}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              Client: {booking.name} · {booking.preferred_date} at {booking.preferred_time} ({booking.timezone || "IST"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            booking.status === "confirmed"
              ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
              : "bg-green-500/15 text-green-400 border-green-500/30"
          }`}>
            {booking.status}
          </span>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            onClick={sendGmailInvite}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/25 transition-colors"
            title="Send Gmail invite to client"
          >
            <Mail className="size-4 text-red-400" />
            Send via Gmail
          </button>

          {!isExternal && (
            <button
              onClick={() => setFullscreen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <Maximize2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Client",  value: booking.name },
          { label: "Email",   value: booking.email },
          { label: "Track",   value: booking.service_name ?? "Advisory Session" },
          { label: "Ref ID",  value: booking.booking_reference },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] p-4" style={{ background: "#131824" }}>
            <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">{label}</p>
            <p className="text-sm text-white/90 truncate font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Meeting Area */}
      <div
        className={`rounded-3xl overflow-hidden border border-white/10 transition-all ${
          fullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
        }`}
        style={{ background: "#0c121e" }}
      >
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-xl bg-black/60 border border-white/20 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4 rotate-[135deg]" />
          </button>
        )}

        {/* EXTERNAL (Google Meet / Zoom) Screen */}
        {isExternal ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
            <div className="relative">
              <div className={`flex size-24 items-center justify-center rounded-full border ${
                isGoogleMeet 
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
              }`}>
                <Video className="size-10" />
              </div>
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                ●
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {isGoogleMeet ? "Google Meet Consultation" : "Zoom Video Conference"}
              </h2>
              <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
                This meeting is configured on <strong className="text-white">{isGoogleMeet ? "Google Meet" : "Zoom"}</strong>. Click below to launch and attend the session with <strong className="text-white">{booking.name}</strong>.
              </p>
            </div>

            {/* Link Preview box */}
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3 text-left">
              <div className="overflow-hidden">
                <p className="text-[11px] text-white/40 font-medium">Meeting URL</p>
                <p className="text-xs font-mono text-emerald-300 truncate">{booking.video_room_url}</p>
              </div>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-xl bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20 transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={booking.video_room_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setJoined(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-950/50 hover:brightness-110 active:scale-98 transition-all"
              >
                <ExternalLink className="size-4" />
                {isGoogleMeet ? "Launch Google Meet Now" : "Launch Zoom Meeting Now"}
              </a>

              <button
                type="button"
                onClick={sendGmailInvite}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3.5 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition-all"
              >
                <Mail className="size-4 text-red-400" />
                Email Client via Gmail
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/40 pt-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" /> End-to-End Encrypted
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-blue-400" /> Syncs with Calendar
              </span>
            </div>
          </div>
        ) : !joined ? (
          /* IN-PLATFORM PRE-JOIN LOBBY */
          <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400">
                <Video className="size-10" />
              </div>
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                ●
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Ready to join video call?</h2>
              <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">
                You're about to enter the secure in-platform room with <strong className="text-white/80">{booking.name}</strong>.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setJoined(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-900/40 hover:brightness-110 active:scale-98 transition-all"
              >
                <Video className="size-4" />
                Enter Live Room
              </button>
              <Link
                to="/dashboard/bookings"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-medium text-white/50 hover:bg-white/5 transition-colors"
              >
                <PhoneOff className="size-4" />
                Back
              </Link>
            </div>
          </div>
        ) : (
          /* IN-PLATFORM EMBEDDED IFRAME */
          <div className={fullscreen ? "h-screen" : "h-[650px]"}>
            <iframe
              src={booking.video_room_url}
              allow="camera; microphone; fullscreen; speaker; display-capture"
              className="h-full w-full border-0"
              title="Live Video Session"
            />
          </div>
        )}
      </div>

      {joined && !fullscreen && !isExternal && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => { setJoined(false); navigate({ to: "/dashboard/bookings" }); }}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-6 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <PhoneOff className="size-4" />
            Leave Call
          </button>
        </div>
      )}
    </div>
  );
}
