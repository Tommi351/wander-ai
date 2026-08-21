"use client";

import { FlightItem } from "@/lib/validations";

interface FlightCardProps {
  item: FlightItem;
}

export function FlightCard({ item }: FlightCardProps) {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Meta Row Line */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">✈️</span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Transit Segment
            </span>
            <p className="text-xs font-semibold text-sky-400 mt-0.5">
              {item.time}
            </p>
          </div>
        </div>

        {/* Track A Law Indicator Tag */}
        <span className="text-[9px] bg-slate-800 border border-slate-700 font-extrabold px-2 py-0.5 rounded-md text-slate-400 uppercase tracking-wide">
          Provisional Concept
        </span>
      </div>

      {/* Primary Detail Row */}
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-black text-white tracking-tight leading-snug">
            {item.title}
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal font-medium">
            Live route schedules, tracking identifiers, and booking links will
            hydrate here in Phase 7.
          </p>
        </div>

        {/* Financial Column Block */}
        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
            Est. Cost
          </span>
          <span className="text-lg font-black text-emerald-400 tracking-tight block mt-0.5">
            ${item.cost}
          </span>
          <span className="text-[9px] text-slate-500 block font-medium">
            USD
          </span>
        </div>
      </div>
    </div>
  );
}
