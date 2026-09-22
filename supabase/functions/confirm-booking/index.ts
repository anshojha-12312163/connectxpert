import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking_id } = await req.json();

    if (!booking_id) {
      return new Response(JSON.stringify({ error: "Missing booking_id" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase client with Service Role Key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Fetch booking
    const { data: booking, error: fetchError } = await supabaseClient
      .from("demo_bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (fetchError || !booking) {
      throw new Error(`Booking not found: ${fetchError?.message}`);
    }

    if (!booking.booking_reference) {
      throw new Error("Booking is missing a booking_reference.");
    }

    // 2. Generate Meeting Link
    let video_room_url = "";
    let video_room_name = "";
    const slug = booking.booking_reference.toLowerCase();

    const dailyApiKey = Deno.env.get("DAILY_API_KEY");
    if (dailyApiKey) {
      try {
        const roomName = `cx-${slug}-${Date.now()}`.substring(0, 40); // Max length constraints
        const res = await fetch("https://api.daily.co/v1/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${dailyApiKey}`,
          },
          body: JSON.stringify({
            name: roomName,
            properties: {
              max_participants: 2,
              enable_chat: true,
              enable_screenshare: true,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          video_room_url = data.url;
          video_room_name = data.name;
        } else {
          throw new Error("Daily.co API error");
        }
      } catch (err) {
        console.warn("Failed to create Daily room, falling back to Jitsi:", err);
      }
    }

    if (!video_room_url) {
      // Fallback to Jitsi
      video_room_name = `cx-session-${slug}`;
      video_room_url = `https://meet.jit.si/${video_room_name}`;
    }

    // 3. Update Booking
    const { error: updateError } = await supabaseClient
      .from("demo_bookings")
      .update({
        video_room_url,
        video_room_name,
        status: "confirmed",
      })
      .eq("id", booking_id);

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    // 4. Send Emails via Resend (Best-effort)
    let client_email_sent = false;
    let admin_email_sent = false;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (resendApiKey) {
      const sendEmail = async (to: string, subject: string, html: string) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ConnectXpert <onboarding@resend.dev>", // default testing domain
            to,
            subject,
            html,
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error(`Failed to send email to ${to}: ${text}`);
          return false;
        }
        return true;
      };

      try {
        // Send to Client
        const clientSubject = `Booking Confirmed: ${booking.service_name || "Consultation"} with ConnectXpert`;
        const clientHtml = `
          <h2>Your booking is confirmed!</h2>
          <p>Hi ${booking.name},</p>
          <p>We're looking forward to speaking with you on <strong>${booking.preferred_date}</strong> at <strong>${booking.preferred_time}</strong> (${booking.timezone}).</p>
          <p>You can join the meeting using this link: <a href="${video_room_url}">${video_room_url}</a></p>
          <p>Thanks,<br/>The ConnectXpert Team</p>
        `;
        client_email_sent = await sendEmail(booking.email, clientSubject, clientHtml);

        // Send to Admin
        if (adminEmail) {
          const adminSubject = `New Booking: ${booking.name} (${booking.preferred_date})`;
          const adminHtml = `
            <h2>New Booking Confirmed</h2>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Date/Time:</strong> ${booking.preferred_date} at ${booking.preferred_time} (${booking.timezone})</p>
            <p><strong>Service:</strong> ${booking.service_name || "Demo"}</p>
            <p><strong>Room Link:</strong> <a href="${video_room_url}">${video_room_url}</a></p>
            <p><strong>Notes:</strong> ${booking.notes || "None"}</p>
          `;
          admin_email_sent = await sendEmail(adminEmail, adminSubject, adminHtml);
        }
      } catch (err) {
        console.error("Error sending emails:", err);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Skipping emails.");
    }

    // 5. Google Calendar API Sync (Admin Calendar Sync if configured)
    let google_calendar_event_created = false;
    let google_calendar_event_id: string | null = null;

    const gcalClientId = Deno.env.get("GOOGLE_CALENDAR_CLIENT_ID");
    const gcalClientSecret = Deno.env.get("GOOGLE_CALENDAR_CLIENT_SECRET");
    const gcalRefreshToken = Deno.env.get("GOOGLE_CALENDAR_REFRESH_TOKEN");

    if (gcalClientId && gcalClientSecret && gcalRefreshToken) {
      try {
        // Exchange refresh token for fresh access token
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: gcalClientId,
            client_secret: gcalClientSecret,
            refresh_token: gcalRefreshToken,
            grant_type: "refresh_token",
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          // Compute start & end ISO strings
          const startIso = `${booking.preferred_date}T${booking.preferred_time}:00`;
          const [hourStr, minStr] = booking.preferred_time.split(":");
          const endD = new Date(`${booking.preferred_date}T${booking.preferred_time}:00`);
          endD.setMinutes(endD.getMinutes() + (booking.duration_minutes || 45));
          const endIso = endD.toISOString().slice(0, 19);

          const eventBody = {
            summary: `${booking.service_name || "Consultation"} — ${booking.name}`,
            description: `ConnectXpert Advisory Session\n\nClient: ${booking.name} (${booking.email})\nBooking Ref: ${booking.booking_reference}\nNotes: ${booking.notes || "None"}\n\n🎥 Join Video Call: ${video_room_url}`,
            location: video_room_url,
            start: { dateTime: `${startIso}Z`, timeZone: booking.timezone || "UTC" },
            end: { dateTime: `${endIso}Z`, timeZone: booking.timezone || "UTC" },
            attendees: [
              { email: booking.email, displayName: booking.name },
            ],
          };

          const eventRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventBody),
          });

          if (eventRes.ok) {
            const eventData = await eventRes.json();
            google_calendar_event_created = true;
            google_calendar_event_id = eventData.id;
            console.log("✅ Google Calendar event created successfully:", eventData.id);
          } else {
            const errText = await eventRes.text();
            console.warn("Failed to create Google Calendar event:", errText);
          }
        }
      } catch (calErr) {
        console.warn("Google Calendar sync error:", calErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        video_room_url,
        video_room_name,
        client_email_sent,
        admin_email_sent,
        google_calendar_event_created,
        google_calendar_event_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
