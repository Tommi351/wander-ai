// components/planner/forms/InterestsChips.tsx
"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";
import { useState } from "react";

interface InterestsChipsProps {
  data: PlannerSubmission;
  onSubmit: (value: PlannerUIEvent) => void;
}

const INTEREST_OPTIONS = [
  { id: "food", label: "🍕 Food & Dining", tags: "food" },
  { id: "culture", label: "🏛️ Culture & History", tags: "culture" },
  { id: "nature", label: "🌲 Nature & Outdoors", tags: "nature" },
  { id: "adventure", label: "🪂 Adventure Sports", tags: "adventure" },
  { id: "nightlife", label: "✨ Nightlife & Bars", tags: "nightlife" },
  { id: "shopping", label: "🛍️ Shopping", tags: "shopping" },
  { id: "relaxation", label: "🧘 Relaxation & Spa", tags: "relaxation" },
];

export function InterestsChips({ data, onSubmit }: InterestsChipsProps) {
  const [selected, setSelected] = useState<string[]>(
    data.tripData.interests ?? [],
  );

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onSubmit({
      type: "interests",
      value: selected,
    });
  };

  return (
    <div className="w-full space-y-4 p-1">
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            selected.length > 0
              ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-98 cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          Confirm {selected.length > 0 ? `(${selected.length})` : ""} Choices
        </button>
      </div>
    </div>
  );
}

export default InterestsChips;
