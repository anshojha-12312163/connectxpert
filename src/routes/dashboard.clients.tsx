import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsPage,
});

const STATUSES = ["active", "paused", "completed"] as const;
type Status = typeof STATUSES[number];

function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newClient, setNewClient] = useState({ project_name: "", status: "active" as Status, notes: "" });

  async function load() {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addClient() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("clients").insert({ ...newClient, user_id: user.id });
    setAdding(false);
    setNewClient({ project_name: "", status: "active", notes: "" });
    load();
  }

  async function updateStatus(id: string, status: Status) {
    await supabase.from("clients").update({ status }).eq("id", id);
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  }

  const statusColor: Record<Status, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/40",
    paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/40",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your active client engagements.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="size-4" /> Add Client
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <h3 className="text-sm font-semibold mb-4">New Client</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-muted-foreground">Project Name</label>
              <input value={newClient.project_name} onChange={(e) => setNewClient({ ...newClient, project_name: e.target.value })}
                className="rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Status</label>
              <select value={newClient.status} onChange={(e) => setNewClient({ ...newClient, status: e.target.value as Status })}
                className="rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 text-sm outline-none focus:border-primary/60">
                {STATUSES.map((s) => <option key={s} value={s} className="bg-background capitalize">{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-xs text-muted-foreground">Notes</label>
              <input value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                className="rounded-xl border border-border bg-surface-2/60 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addClient} className="flex items-center gap-1.5 rounded-xl bg-primary/20 border border-primary/40 px-4 py-2 text-sm text-accent hover:bg-primary/30">
              <Check className="size-4" /> Save
            </button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              <X className="size-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface-2/40 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : clients.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No clients yet. Add your first one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-2/60">
              <tr>
                {["Project", "Status", "Notes", "Added"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-surface-2/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.project_name}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value as Status)}
                      className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize cursor-pointer outline-none bg-transparent", statusColor[c.status as Status])}>
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-background capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.notes ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
