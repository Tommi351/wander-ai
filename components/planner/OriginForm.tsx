// components/planner/OriginForm.tsx
"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";
import { useState } from "react";

interface OriginFormProps {
  data: PlannerSubmission;
  onSubmit: (event: PlannerUIEvent) => void;
}

const POPULAR_HUBS = [
  "New York (JFK)",
  "London (LHR)",
  "Los Angeles (LAX)",
  "Chicago (ORD)",
];

export function OriginForm({ data, onSubmit }: OriginFormProps) {
  const [city, setCity] = useState(data.tripData.origin ?? "");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!city.trim()) return;

    onSubmit({
      type: "origin",
      value: city.trim(),
    });
  };

  return (
    <div className="w-full space-y-3 p-1">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city or airport code..."
          className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!city.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          Next
        </button>
      </form>

      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Popular Starting Hubs
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_HUBS.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() =>
                onSubmit({
                  type: "origin",
                  value: hub,
                })
              }
              className="text-xs bg-slate-100 border border-slate-200/60 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              🛫 {hub}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OriginForm;
