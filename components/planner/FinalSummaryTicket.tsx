// components/planner/forms/FinalSummaryTicket.tsx
"use client";

import { PlannerSubmission, PlannerUIEvent } from "@/types/global";

interface FinalSummaryTicketProps {
  data: PlannerSubmission;
  onSubmit: (event: PlannerUIEvent) => void;
}

export function FinalSummaryTicket({
  data,
  onSubmit,
}: FinalSummaryTicketProps) {
  const { tripData, travelPreferences } = data;

  const { origin, destination, travelers, budgetTier, duration, interests } =
    tripData;

  const handleGenerate = () => {
    onSubmit({
      type: "final",
      value: data,
    });
  };

  return (
    <div className="w-full border border-dashed border-slate-200 bg-linear-to-br from-slate-50 to-white rounded-2xl overflow-hidden shadow-sm">
      {/* Header Banner */}{" "}
      <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white">
        {" "}
        <div>
          {" "}
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            WanderAI Passport{" "}
          </span>
          ```
          <h4 className="text-base font-bold tracking-tight">
            Trip Profile Ready
          </h4>
        </div>
        <div className="text-2xl">✈️</div>
      </div>
      {/* Ticket Details Body */}
      <div className="p-5 space-y-5 text-slate-700">
        {/* Origin + Destination */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Departing From
            </label>

            <p className="font-semibold text-slate-800 text-sm truncate">
              {origin || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Destination
            </label>

            <p className="font-semibold text-blue-600 text-sm truncate">
              {destination || "Not specified"}
            </p>
          </div>
        </div>

        {/* Core Trip Details */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Duration
            </label>

            <p className="font-semibold text-slate-800 text-sm">
              {duration ? `${duration} Days` : "—"}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Party Size
            </label>

            <p className="font-semibold text-slate-800 text-sm">
              {travelers ? `${travelers} Guest(s)` : "—"}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Budget Tier
            </label>

            <p className="font-semibold text-slate-800 text-sm capitalize">
              {budgetTier || "—"}
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className="border-b border-slate-100 pb-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Selected Focus Items
          </label>

          <div className="flex flex-wrap gap-1.5">
            {interests && interests.length > 0 ? (
              interests.map((interest, i) => (
                <span
                  key={`${interest}-${i}`}
                  className="text-xs bg-slate-100 border border-slate-200/60 text-slate-600 px-2.5 py-1 rounded-md font-medium capitalize"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No specific activities chosen
              </span>
            )}
          </div>
        </div>

        {/* Travel Preferences */}
        {travelPreferences && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Travel Preferences
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Pace
                </span>

                <span className="text-xs font-semibold text-slate-700 capitalize">
                  {travelPreferences.pace}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Travel Style
                </span>

                <span className="text-xs font-semibold text-slate-700 capitalize">
                  {travelPreferences.travelStyle || "—"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Spending
                </span>

                <span className="text-xs font-semibold text-slate-700 capitalize">
                  {travelPreferences.spendingFlexibility || "—"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Planning
                </span>

                <span className="text-xs font-semibold text-slate-700 capitalize">
                  {travelPreferences.planningStyle || "—"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Weather
                </span>

                <span className="text-xs font-semibold text-slate-700 capitalize">
                  {travelPreferences.weatherPreference || "—"}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">
                  Priorities
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {travelPreferences.priority?.length
                    ? travelPreferences.priority.join(", ")
                    : "None"}
                </span>
              </div>
            </div>

            {/* Dietary Restrictions */}
            {travelPreferences.dietaryRestrictions?.length ? (
              <div className="mt-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Dietary Restrictions
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {travelPreferences.dietaryRestrictions.map((restriction) => (
                    <span
                      key={restriction}
                      className="text-xs bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-md font-medium"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Things to Avoid */}
            {travelPreferences.avoidCategories?.length ? (
              <div className="mt-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Things to Avoid
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {travelPreferences.avoidCategories.map((category) => (
                    <span
                      key={category}
                      className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {/* Interactive Action Footer */}
      <div className="bg-slate-50 border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md shadow-blue-100 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          ✨ Generate Custom Itinerary
        </button>
      </div>
    </div>
  );
}

export default FinalSummaryTicket;
