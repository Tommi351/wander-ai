// components/planner/forms/DurationPicker.tsx
"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";
import { useState } from "react";

interface DurationPickerProps {
  data: PlannerSubmission;
  onSubmit: (value: PlannerUIEvent) => void;
}

const SUGGESTIONS = [3, 5, 7, 10, 14];

export function DurationPicker({ data, onSubmit }: DurationPickerProps) {
  const [days, setDays] = useState(data.tripData.duration ?? 5);

  return (
    <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Trip Length
          </label>
          <span className="text-lg font-black text-blue-600">{days} Days</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setDays(sug)}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium cursor-pointer transition-colors ${
                days === sug
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {sug}d
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            onSubmit({
              type: "duration",
              value: days,
            })
          }
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          Confirm Length
        </button>
      </div>
    </div>
  );
}

export default DurationPicker;
