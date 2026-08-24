"use client";

import { TravelItinerary } from "@/lib/validations"; // 🚀 Single source of truth!

interface StickyDashboardHeaderProps {
  itineraryJson: TravelItinerary; // Unpacks destination, budgetTier, totalEstimatedCost, notes, and timeline
  tripTitle: string; // Extracted from prisma Trip model
}

export function StickyDashboardHeader({
  itineraryJson,
  tripTitle,
}: StickyDashboardHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
        {itineraryJson.budgetTier} • {itineraryJson.currency}
      </span>

      <h1 className="mt-2 text-3xl font-black">{tripTitle}</h1>

      <p className="mt-2 text-blue-100">
        {itineraryJson.notes || "Your personalized AI-generated itinerary."}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
          <p className="text-xs text-blue-100">Estimated Cost</p>
          <p className="font-bold">
            {itineraryJson.currency} {itineraryJson.totalEstimatedCost}
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
          <p className="text-xs text-blue-100">Days</p>
          <p className="font-bold">{itineraryJson.timeline.length}</p>
        </div>
      </div>
    </div>
  );
}
