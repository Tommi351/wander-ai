"use client";

import { TravelItinerary } from "@/lib/validations"; // 🚀 Single source of truth!

interface StickyDashboardHeaderProps {
  itinerary: TravelItinerary; // Unpacks destination, budgetTier, totalEstimatedCost, notes, and timeline
  tripTitle: string; // Extracted from prisma Trip model
}

export function StickyDashboardHeader({
  itinerary,
  tripTitle,
}: StickyDashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md pb-4 pt-2 mb-6 border-b border-slate-100">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {itinerary.budgetTier} Tier • {itinerary.currency}
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          {tripTitle}
        </h1>

        {itinerary.notes && (
          <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
            {itinerary.notes}
          </p>
        )}
      </div>

      {/* Financial Quick-Stats Widget Frame */}
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-4 rounded-xl mt-4">
        {/* Left Segment: Sequential Trip Scale Tracker */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Duration
          </span>
          <span className="text-sm font-black text-slate-800 mt-0.5">
            {itinerary.timeline.length} Days{" "}
            {/* 🚀 Fixed: Explicit parameter context appended! */}
          </span>
        </div>

        {/* Right Segment: Aggregate Monetary Summary Panel */}
        <div className="text-right flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Cost
          </span>
          <p className="mt-0.5">
            {/* 🚀 Fixed: Standardized price symbols and layout typography anchored safely! */}
            <span className="text-base font-black text-emerald-600">
              ${itinerary.totalEstimatedCost}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              {itinerary.currency}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
