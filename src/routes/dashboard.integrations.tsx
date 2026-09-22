import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plug, Check, ExternalLink, Cloud, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/integrations")({
  component: IntegrationsPage,
});

interface IntegrationItem {
  id: string;
  name: string;
  desc: string;
  connected: boolean;
  color: string;
  bg: string;
  category: "CRM & Sales" | "Enterprise" | "Productivity" | "Video & Ops";
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  { id: "salesforce", name: "Salesforce CRM",  desc: "Sync leads, clients, deals, and advisory session notes directly into Salesforce Sales & Data Cloud.", connected: true,  color: "text-sky-400",    bg: "bg-sky-500/15",    category: "CRM & Sales" },
  { id: "tcs",        name: "TCS Enterprise Hub", desc: "Integrate enterprise telemetry, SSO identity federation, and TCS BaNCS event streaming pipelines.", connected: true, color: "text-blue-400",   bg: "bg-blue-500/15",   category: "Enterprise" },
  { id: "gcal",       name: "Google Calendar",  desc: "Sync confirmed bookings and advisor calendars to Google Calendar automatically.", connected: true,  color: "text-blue-400",   bg: "bg-blue-500/15",   category: "Productivity" },
  { id: "slack",      name: "Slack",            desc: "Get instant notifications in your channels for new bookings, applications, and client contacts.", connected: true,  color: "text-purple-400", bg: "bg-purple-500/15", category: "Productivity" },
  { id: "stripe",     name: "Stripe",           desc: "Accept global credit card payments and automated escrow payouts for advisory packages.", connected: true, color: "text-yellow-400", bg: "bg-yellow-500/15", category: "CRM & Sales" },
  { id: "hubspot",    name: "HubSpot",          desc: "Push marketing leads and newsletter signups directly to your HubSpot pipelines.", connected: false, color: "text-orange-400", bg: "bg-orange-500/15", category: "CRM & Sales" },
  { id: "zoom",       name: "Zoom & WebRTC",    desc: "Auto-generate HD encrypted video meeting rooms for confirmed advisory sessions.", connected: true,  color: "text-cyan-400",   bg: "bg-cyan-500/15",   category: "Video & Ops" },
  { id: "mailchimp",  name: "Mailchimp",        desc: "Sync newsletter subscribers and automated lifecycle sequences to your mailing lists.", connected: false, color: "text-green-400",  bg: "bg-green-500/15",  category: "CRM & Sales" },
];

function IntegrationsPage() {
  const [items, setItems] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);

  function toggleConnection(id: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.connected;
          if (nextState) {
            toast.success(`${item.name} connected successfully`);
          } else {
            toast.info(`${item.name} disconnected`);
          }
          return { ...item, connected: nextState };
        }
        return item;
      })
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Integrations &amp; Enterprise Connectors</h1>
          <p className="mt-1 text-sm text-white/40">
            Connect ConnectXpert with your CRM (Salesforce, HubSpot), Enterprise systems (TCS), and daily workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            <span className="size-2 rounded-full bg-green-400 animate-pulse" />
            {items.filter((i) => i.connected).length} Connected
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, name, desc, connected, color, bg, category }) => (
          <div
            key={id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.06] p-5 transition-all hover:border-white/10"
            style={{ background: "#131824" }}
          >
            <div>
              <div className="flex items-start justify-between">
                <span className={cn("flex size-10 items-center justify-center rounded-xl", bg)}>
                  {id === "salesforce" ? (
                    <Cloud className={cn("size-5", color)} />
                  ) : id === "tcs" ? (
                    <Database className={cn("size-5", color)} />
                  ) : (
                    <Plug className={cn("size-5", color)} />
                  )}
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
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white/90">{name}</p>
                  <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/40">
                    {category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            </div>

            <button
              onClick={() => toggleConnection(id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer",
                connected
                  ? "border-white/[0.08] text-white/40 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5"
                  : "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
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

