"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";
import { useState } from "react";

interface DestinationFormProps {
  data: PlannerSubmission;
  onSubmit: (event: PlannerUIEvent) => void;
}

const TRENDING_PLACES = [
  "Tokyo, Japan",
  "Paris, France",
  "Rome, Italy",
  "Bali, Indonesia",
];

export function DestinationForm({ data, onSubmit }: DestinationFormProps) {
  const [destination, setDestination] = useState(
    data.tripData.destination ?? "",
  );

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ type: "destination", value: destination.trim() });
  };

  return (
    /* PLACE 1: Outer layout container (needs a vertical column flow and subtle spacing gap) */
    <div className="flex flex-col gap-2">
      {/* Search Input Input Row Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        {/* PLACE 2: The Destination Input field (Think: light background, smooth focus borders, clean rounding) */}
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where is your dream destination?"
          className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
        />

        {/* PLACE 3: The Submit Action Button (Think: dark or distinct accent fill color, disabled state checks matching height) */}
        <button
          type="submit"
          disabled={!destination.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          Explore
        </button>
      </form>

      {/* Recommended Suggestion Layer */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Trending Destinations
        </label>

        {/* PLACE 4: The Trending Suggestions Grid Layout (Turn this container into a 2-column grid layout with spacing) */}
        <div className="grid grid-cols-2 gap-2">
          {TRENDING_PLACES.map((place) => (
            <button
              key={place}
              type="button"
              onClick={() =>
                onSubmit({
                  type: "destination",
                  value: place,
                })
              }
              className="p-3 text-left border border-slate-200 bg-white rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all font-medium text-sm text-slate-700 cursor-pointer"
            >
              📍 {place}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinationForm;
