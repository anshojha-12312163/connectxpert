import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import { supabase, type CategoryRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/categories")({
  component: CategoriesPage,
});

const DEFAULT_CATEGORIES: CategoryRow[] = [
  { id: "business",  name: "Business Strategy", icon: "TrendingUp",  description: "GTM, OKRs, growth strategy, and operations",       slug: "business-strategy" },
  { id: "marketing", name: "Marketing",          icon: "BarChart2",   description: "SEO, paid ads, content, and demand generation",    slug: "marketing"         },
  { id: "tech",      name: "Technology",         icon: "Code2",       description: "Engineering, architecture, and tech advisory",     slug: "technology"        },
  { id: "legal",     name: "Legal",              icon: "Scale",       description: "Contracts, IP, compliance, and startup law",       slug: "legal"             },
  { id: "design",    name: "Design",             icon: "Palette",     description: "UX, product design, branding, and prototyping",    slug: "design"            },
  { id: "finance",   name: "Finance",            icon: "DollarSign",  description: "Fundraising, CFO advisory, financial modeling",    slug: "finance"           },
];

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState<string | null>(null);
  const [editForm,   setEditForm]   = useState<Partial<CategoryRow>>({});
  const [adding,     setAdding]     = useState(false);
  const [newCat,     setNewCat]     = useState({ id: "", name: "", description: "", icon: "Globe", slug: "" });

  useEffect(() => {
    supabase.from("categories").select("*").order("name")
      .then(({ data }) => {
        setCategories(data && data.length > 0 ? data as CategoryRow[] : DEFAULT_CATEGORIES);
        setLoading(false);
      });
  }, []);

  async function saveEdit(id: string) {
    await supabase.from("categories").update(editForm).eq("id", id);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...editForm } : c));
    setEditing(null);
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category? Experts in it will lose their category assignment.")) return;
    await supabase.from("categories").delete().eq("id", id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  async function addCategory() {
    if (!newCat.name || !newCat.id) return;
    const cat = { ...newCat, slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, "-") };
    const { error } = await supabase.from("categories").insert(cat);
    if (!error) { setCategories(prev => [...prev, cat as CategoryRow]); setAdding(false); setNewCat({ id:"", name:"", description:"", icon:"Globe", slug:"" }); }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="mt-1 text-sm text-white/40">Manage expert categories shown on the directory.</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus className="size-4" /> Add Category
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">New Category</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { k: "id",          label: "ID (unique, no spaces)",  ph: "e.g. hr-recruiting" },
              { k: "name",        label: "Name",                    ph: "e.g. HR & Recruiting" },
              { k: "description", label: "Description",             ph: "Short description..." },
              { k: "icon",        label: "Icon (Lucide name)",       ph: "e.g. Users" },
            ].map(({ k, label, ph }) => (
              <div key={k}>
                <label className="block text-xs text-white/35 mb-1">{label}</label>
                <input value={(newCat as any)[k]} onChange={e => setNewCat(p => ({ ...p, [k]: e.target.value }))}
                  placeholder={ph}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/40 transition-colors" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addCategory}
              className="flex items-center gap-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 px-4 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/25 transition-colors">
              <Check className="size-3.5" /> Save
            </button>
            <button onClick={() => setAdding(false)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs text-white/40 hover:text-white transition-colors">
              <X className="size-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-white/30" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(c => (
            <div key={c.id} className="rounded-2xl border border-white/[0.06] p-5" style={{ background: "#131824" }}>
              {editing === c.id ? (
                <div className="space-y-2">
                  {["name", "description"].map(k => (
                    <input key={k} value={(editForm as any)[k] ?? ""} onChange={e => setEditForm(p => ({ ...p, [k]: e.target.value }))}
                      placeholder={k} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 transition-colors" />
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(c.id)}
                      className="flex items-center gap-1 rounded-lg bg-green-500/10 border border-green-500/25 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20 transition-colors">
                      <Check className="size-3" /> Save
                    </button>
                    <button onClick={() => setEditing(null)}
                      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 hover:text-white transition-colors">
                      <X className="size-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 text-xs font-bold">
                        {c.icon?.slice(0,2) ?? "?"}
                      </span>
                      <p className="text-sm font-semibold text-white">{c.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(c.id); setEditForm({ name: c.name, description: c.description }); }}
                        className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-white hover:bg-white/5 transition-colors">
                        <Pencil className="size-3" />
                      </button>
                      <button onClick={() => deleteCategory(c.id)}
                        className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/25 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{c.description}</p>
                  <p className="mt-2 text-[10px] text-white/20 font-mono">/{c.slug}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
