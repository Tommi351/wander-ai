// components/planner/forms/GroupSizeInput.tsx
"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";
import { useState } from "react";

interface GroupSizeInputProps {
  data: PlannerSubmission;
  onSubmit: (value: PlannerUIEvent) => void;
}

export function GroupSizeInput({ data, onSubmit }: GroupSizeInputProps) {
  const [count, setCount] = useState(data.tripData.travelers ?? 1);

  const handleConfirm = () => {
    onSubmit({
      type: "groupSize",
      value: count,
    });
  };

  return (
    <div className="w-full flex items-center justify-between p-1 bg-slate-50 rounded-xl border border-slate-100">
      {/* Left Column: Label Text Pod */}
      {/* STEP 2: Text Description Wrap - Think about: Vertical stacking for your
      labels, text sizes, and gray visual hierarchy weights. */}
      <div className="pl-2 flex flex-col">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Total Guests
        </span>
        <span className="text-xs text-slate-400">Including yourself</span>
      </div>
      {/* Right Column: Numeric Stepper Pod */}
      {/* STEP 3: The Stepper Interaction Pod - Think about: Arranging the minus}
      button, number indicator, plus button, and confirmation button
      horizontally. - Useful tip: Flexbox with items centered vertically and a
      neat gap works perfectly here. */}
      <div className="flex items-center gap-3 pr-2">
        {/* STEP 4: Minus (－) Button - Think about: Creating a square click
        target (e.g., matching height/width), borders, hover transitions, and
        the "disabled" modifier so users can't click down below 1 traveler. */}
        <button
          type="button"
          disabled={count <= 1}
          onClick={() => setCount((c) => c - 1)}
          className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer select-none transition-all duration-200"
        >
          －
        </button>
        {/* STEP 5: Current Number Indicator - Think about: Size, font weight,
        text centering, and color. */}
        <span className="text-lg font-bold text-slate-600 w-6 text-center">
          {count}
        </span>
        {/* STEP 6: Plus (＋) Button - Think about: Matching the size and layout
        style of the minus button exactly to maintain symmetry. */}
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer select-none transition-all duration-200"
        >
          ＋
        </button>
        {/* STEP 7: Action Confirmation Button - Think about: Your dark or
        distinct brand accent color fill, layout margins, font weight, and hover
        transitions. */}
        <button
          type="button"
          onClick={handleConfirm}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg ml-2 transition-colors cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default GroupSizeInput;
