import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Star, Eye, EyeOff } from "lucide-react";
import { supabase, type ReviewRow } from "@/lib/supabase";
import { Avatar } from "@/components/lanx/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("reviews").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setReviews(data as ReviewRow[] ?? []); setLoading(false); });
  }, []);

  async function toggleHide(id: string, current: boolean) {
    await supabase.from("reviews").update({ is_hidden: !current }).eq("id", id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_hidden: !current } : r));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reviews</h1>
        <p className="mt-1 text-sm text-white/40">Moderate all client reviews across the platform.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "#131824" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-white/30" /></div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Star className="size-8 text-white/10" />
            <p className="text-sm text-white/30">No reviews yet</p>
            <p className="text-xs text-white/20">Reviews appear after a booking is marked Completed</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {reviews.map(r => (
              <div key={r.id} className={cn("flex items-start gap-4 p-5 transition-colors", r.is_hidden && "opacity-40")}>
                <Avatar name={r.client_name} size={36} className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-medium text-white/85">{r.client_name}</p>
                      <p className="text-xs text-white/30">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({length: 5}).map((_,i) => (
                        <Star key={i} className={cn("size-3.5", i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-white/15")} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{r.comment}</p>
                  {r.expert_response && (
                    <div className="mt-2 rounded-xl border border-blue-500/15 bg-blue-500/5 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-0.5">Expert Response</p>
                      <p className="text-xs text-white/50">{r.expert_response}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => toggleHide(r.id!, !!r.is_hidden)}
                  className={cn("shrink-0 flex size-8 items-center justify-center rounded-lg border transition-colors",
                    r.is_hidden
                      ? "border-green-500/25 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "border-white/10 bg-white/5 text-white/35 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/25")}>
                  {r.is_hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
