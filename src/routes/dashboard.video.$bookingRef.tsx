import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Video, Copy, Check, Users, Mic, MicOff, VideoOff, PhoneOff, Maximize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/video/$bookingRef")({
  head: () => ({ meta: [{ title: "Video Call — ConnectXpert" }] }),
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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="text-white/40">Booking not found</p>
        <Link to="/dashboard/bookings" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  if (!booking.video_room_url) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <Video className="size-8 text-white/30" />
        </div>
        <p className="text-white/60 text-lg font-medium">No video room created yet</p>
        <p className="text-sm text-white/30">Generate a room from the Bookings page first.</p>
        <Link
          to="/dashboard/bookings"
          className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
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
              <Video className="size-5 text-blue-400" />
              Video Call
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              {booking.name} · {booking.preferred_date} at {booking.preferred_time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            booking.status === "confirmed"
              ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
              : "bg-green-500/15 text-green-400 border-green-500/30"
          }`}>
            {booking.status}
          </span>

          {/* Copy link */}
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setFullscreen(v => !v)}
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Client",  value: booking.name },
          { label: "Email",   value: booking.email },
          { label: "Service", value: booking.service_name ?? "Session" },
          { label: "Ref",     value: booking.booking_reference },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] p-4" style={{ background: "#131824" }}>
            <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium mb-1">{label}</p>
            <p className="text-sm text-white/80 truncate font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Video iframe */}
      <div
        className={`rounded-2xl overflow-hidden border border-white/10 transition-all ${
          fullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
        }`}
        style={{ background: "#0a0d1a" }}
      >
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-xl bg-black/60 border border-white/20 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4 rotate-[135deg]" />
          </button>
        )}

        {!joined ? (
          /* Pre-join lobby */
          <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                <Video className="size-10 text-blue-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white">
                ●
              </span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">Ready to join?</h2>
              <p className="mt-2 text-sm text-white/40 max-w-sm">
                You're about to join the video call with <strong className="text-white/70">{booking.name}</strong>. Make sure your camera and microphone are ready.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/30">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-green-500" />
                Room active
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                Powered by Daily.co
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setJoined(true)}
                className="flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 24px -4px rgba(99,102,241,0.5)" }}
              >
                <Video className="size-4" />
                Join Call
              </button>
              <Link
                to="/dashboard/bookings"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white/50 hover:bg-white/5 transition-colors"
              >
                <PhoneOff className="size-4" />
                Back
              </Link>
            </div>
          </div>
        ) : (
          /* Active call — Daily.co iframe */
          <div className={fullscreen ? "h-screen" : "h-[600px]"}>
            <iframe
              src={booking.video_room_url}
              allow="camera; microphone; fullscreen; speaker; display-capture"
              className="h-full w-full border-0"
              title="Video Call"
            />
          </div>
        )}
      </div>

      {/* Bottom controls when joined */}
      {joined && !fullscreen && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => { setJoined(false); navigate({ to: "/dashboard/bookings" }); }}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-6 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <PhoneOff className="size-4" />
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
