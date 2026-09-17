import { createFileRoute } from "@tanstack/react-router";
import { Plug, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/integrations")({
  component: IntegrationsPage,
});

const integrations = [
  { name: "Google Calendar",  desc: "Sync bookings to Google Calendar automatically.",       connected: true,  color: "text-blue-400",   bg: "bg-blue-500/15"   },
  { name: "Slack",            desc: "Get instant notifications for new bookings + contacts.", connected: true,  color: "text-purple-400", bg: "bg-purple-500/15" },
  { name: "Stripe",           desc: "Accept payments for consulting packages.",               connected: false, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { name: "Mailchimp",        desc: "Sync newsletter subscribers to your email list.",        connected: false, color: "text-green-400",  bg: "bg-green-500/15"  },
  { name: "HubSpot",          desc: "Push contacts and leads directly to your CRM.",          connected: false, color: "text-orange-400", bg: "bg-orange-500/15" },
  { name: "Zoom",             desc: "Auto-generate Zoom links for confirmed bookings.",       connected: true,  color: "text-cyan-400",   bg: "bg-cyan-500/15"   },
];

function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Integrations</h1>
        <p className="mt-1 text-sm text-white/40">
          Connect Ansh Consultancy with the tools your team already uses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map(({ name, desc, connected, color, bg }) => (
          <div
            key={name}
            className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] p-5 transition-all hover:border-white/10"
            style={{ background: "#131824" }}
          >
            <div className="flex items-start justify-between">
              <span className={cn("flex size-10 items-center justify-center rounded-xl", bg)}>
                <Plug className={cn("size-5", color)} />
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  connected
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-white/[0.06] text-white/30 border border-white/[0.06]",
                )}
              >
                {connected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white/90">{name}</p>
              <p className="mt-1 text-xs text-white/40 leading-relaxed">{desc}</p>
            </div>
            <button
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all",
                connected
                  ? "border-white/[0.08] text-white/40 hover:border-red-500/30 hover:text-red-400"
                  : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
              )}
            >
              {connected ? (
                <><Check className="size-3.5" /> Disconnect</>
              ) : (
                <><ExternalLink className="size-3.5" /> Connect</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
