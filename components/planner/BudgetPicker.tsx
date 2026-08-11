// components/planner/forms/BudgetPicker.tsx
"use client";

import { PlannerUIEvent, PlannerSubmission } from "@/types/global";

interface BudgetPickerProps {
  data: PlannerSubmission;
  onSubmit: (value: PlannerUIEvent) => void;
}

const BUDGET_TIERS = [
  {
    value: "budget",
    label: "🎒 Budget-friendly",
    desc: "Hostels, Public Transit, Budget Hotels",
  },
  {
    value: "mid-range",
    label: "⚖️ Mid-Range",
    desc: "Boutique hotels, Standard dining, Activities",
  },
  {
    value: "luxury",
    label: "🥂 Luxury tier",
    desc: "Luxury Hotels, Private Tours, Premium Experiences",
  },
] as const;

function BudgetPicker({ data, onSubmit }: BudgetPickerProps) {
  const selectedBudget = data.tripData.budgetTier;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1">
      {BUDGET_TIERS.map((tier) => (
        <button
          key={tier.value}
          type="button"
          onClick={() =>
            onSubmit({
              type: "budget",
              value: tier.value,
            })
          }
          className={`p-3 text-left border rounded-xl transition-all group cursor-pointer ${
            selectedBudget === tier.value
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/20"
          }`}
        >
          <div className="font-bold text-slate-800 group-hover:text-blue-600 text-sm">
            {tier.label}
          </div>

          <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {tier.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

export default BudgetPicker;
