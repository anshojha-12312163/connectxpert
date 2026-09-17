import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, Heart, Clock, BadgeCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, StatusDot } from "@/components/lanx/bits";
import {
  getOnlineStatus, formatResponseTime, type ExpertRow,
} from "@/lib/supabase";

interface Props {
  expert: ExpertRow;
  isFavorited?: boolean;
  onToggleFavorite?: (expertId: string) => void;
  onQuickConnect?: (expertId: string) => void;
  compact?: boolean;
}

export function ExpertCard({
  expert, isFavorited = false, onToggleFavorite, onQuickConnect, compact = false,
}: Props) {
  const [faved, setFaved] = useState(isFavorited);
  const status = getOnlineStatus(expert.last_active_at);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    setFaved((v) => !v);
    onToggleFavorite?.(expert.id);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-white/[0.06] transition-all duration-300",
        "hover:border-blue-500/30 hover:shadow-[0_0_32px_-8px_rgba(59,130,246,0.25)]",
        compact ? "p-4" : "p-5",
      )}
      style={{ background: "#131824" }}
    >
      {/* Favorite */}
      <button
        onClick={handleFav}
        aria-label={faved ? "Remove from favorites" : "Save expert"}
        className={cn(
          "absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full border transition-all",
          faved
            ? "border-red-400/40 bg-red-500/15 text-red-400"
            : "border-white/10 bg-white/5 text-white/30 opacity-0 group-hover:opacity-100 hover:text-red-400",
        )}
      >
        <Heart className={cn("size-4", faved && "fill-red-400")} />
      </button>

      {/* Photo + status */}
      <div className="relative mb-4 self-start">
        <Avatar name={expert.name} src={expert.photo_url} size={compact ? 48 : 56} />
        <StatusDot
          status={status}
          className={cn("absolute -bottom-0.5 -right-0.5", compact ? "size-2.5" : "size-3")}
        />
      </div>

      {/* Name + verified */}
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className={cn("font-semibold text-white leading-snug", compact ? "text-sm" : "text-base")}>
              {expert.name}
            </p>
            {expert.is_verified && (
              <BadgeCheck className="size-4 text-blue-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-white/45 mt-0.5 truncate">{expert.title}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mt-2 mb-2">
        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-semibold text-white/80">{expert.average_rating.toFixed(1)}</span>
        <span className="text-xs text-white/30">({expert.review_count})</span>
        {expert.total_bookings > 0 && (
          <span className="ml-1 text-xs text-white/25">&bull; {expert.total_bookings} sessions</span>
        )}
      </div>

      {/* Skills */}
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {expert.skills.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/55">
              {s}
            </span>
          ))}
          {expert.skills.length > 3 && (
            <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/35">
              +{expert.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Response time */}
      {status !== "offline" && (
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="size-3 text-white/25 shrink-0" />
          <span className="text-[10px] text-white/35">{formatResponseTime(expert.avg_response_time_minutes)}</span>
        </div>
      )}

      {/* Price + free intro */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
        <div>
          <span className="text-base font-bold text-white">${expert.hourly_rate}</span>
          <span className="text-xs text-white/35">/hr</span>
          {expert.offers_free_intro && (
            <span className="ml-2 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[9px] font-semibold text-green-400">
              Free intro
            </span>
          )}
        </div>
        <span className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
          status === "online" ? "bg-green-500/12 text-green-400" :
          status === "away"   ? "bg-yellow-500/12 text-yellow-400" :
                                "bg-white/6 text-white/30",
        )}>
          <span className={cn(
            "size-1.5 rounded-full",
            status === "online" ? "bg-green-400" : status === "away" ? "bg-yellow-400" : "bg-white/25",
          )} />
          {status === "online" ? "Online" : status === "away" ? "Away" : "Offline"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <Link
          to="/experts/$id"
          params={{ id: expert.id }}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-center text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          View Profile
        </Link>
        {onQuickConnect && (
          <button
            onClick={() => onQuickConnect(expert.id)}
            className="flex items-center gap-1 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Zap className="size-3.5" /> Quick
          </button>
        )}
        <Link
          to="/book"
          className="flex-1 rounded-xl py-2 text-center text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "var(--gradient-primary)" }}
        >
          Book
        </Link>
      </div>
    </div>
  );
}
