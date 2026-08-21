"use client";

import { ActivityItem } from "@/lib/validations";

interface ActivityCardProps {
  item: ActivityItem;
}

export function ActivityCard({ item }: ActivityCardProps) {
  // 🔬 Advanced UI Trick: Dynamic Style Mapping Matrix based on database properties!
  const getCategoryStyles = (category: string | null) => {
    const normalize = category?.toLowerCase() || "";
    if (normalize === "food")
      return {
        bg: "bg-rose-50 border-rose-100 text-rose-700",
        dot: "bg-rose-500",
      };
    if (normalize === "adventure")
      return {
        bg: "bg-amber-50 border-amber-100 text-amber-700",
        dot: "bg-amber-500",
      };
    if (normalize === "shopping")
      return {
        bg: "bg-teal-50 border-teal-100 text-teal-700",
        dot: "bg-teal-500",
      };
    if (normalize === "nightlife")
      return {
        bg: "bg-violet-50 border-violet-100 text-violet-700",
        dot: "bg-violet-500",
      };
    return {
      bg: "bg-slate-50 border-slate-100 text-slate-700",
      dot: "bg-slate-500",
    };
  };

  const theme = getCategoryStyles(item.category);

  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
      {/* Top Banner Row */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🎯</span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Activity Event
            </span>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Scheduled: {item.time}
            </p>
          </div>
        </div>

        {/* Dynamic Context Tag */}
        <span
          className={`text-[9px] border font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1.5 ${theme.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
          {item.category || "Sightseeing"}
        </span>
      </div>

      {/* Content Layout Row */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug">
            {item.title}
          </h4>

          <div className="flex items-start space-x-1 pt-0.5">
            <span className="text-xs shrink-0 mt-0.5">📍</span>
            <p className="text-xs text-slate-500 font-medium leading-relaxed wrap-break-words">
              {item.location?.address || "Location matching pending..."}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
              ⏱️ Duration: {item.duration}
            </span>
          </div>
        </div>

        {/* Financial Column Block */}
        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Est. Cost
          </span>
          <span className="text-lg font-black text-slate-800 tracking-tight block mt-0.5">
            {item.cost === 0 ? "FREE" : `$${item.cost}`}
          </span>
          <span className="text-[9px] text-slate-400 block font-medium">
            USD
          </span>
        </div>
      </div>
    </div>
  );
}
