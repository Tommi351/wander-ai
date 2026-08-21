// components/planner/forms/TravelPreferencesDashboard.tsx
"use client";

import { useState } from "react";
import {
  PlannerUIEvent,
  ExtractedPreferences,
  PlannerSubmission,
} from "@/types/global";

interface TravelPreferencesDashboardProps {
  data: PlannerSubmission;
  onSubmit: (value: PlannerUIEvent) => void;
}

type Priority = NonNullable<ExtractedPreferences["priority"]>[number];

const PRIORITY_OPTIONS = [
  { id: "food", label: "🍕 Food" },
  { id: "culture", label: "🏛️ Culture" },
  { id: "nature", label: "🌲 Nature" },
  { id: "nightlife", label: "✨ Nightlife" },
  { id: "adventure", label: "🪂 Adventure" },
] as const satisfies ReadonlyArray<{ id: Priority; label: string }>;

const AVOID_OPTIONS = [
  "Crowded tourist attractions",
  "Nightlife",
  "Adventure sports",
  "Shopping",
  "Long travel days",
  "Museums",
  "Beaches",
] as const;

const PACE_OPTIONS = [
  ["relaxed", "☕ Relaxed"],
  ["moderate", "🚶 Moderate"],
  ["fast-paced", "🏃 Fast-paced"],
] as const;

const TRAVEL_STYLE_OPTIONS = [
  ["backpacking", "🎒 Backpacking"],
  ["balanced", "⚖️ Balanced"],
  ["luxury", "🥂 Luxury"],
  ["family", "👨‍👩‍👧 Family"],
  ["business", "💼 Business"],
] as const;

const SPENDING_OPTIONS = [
  ["strict", "💵 Strict"],
  ["moderate", "💳 Moderate"],
  ["flexible", "💎 Flexible"],
] as const;

const PLANNING_OPTIONS = [
  ["detailed", "📋 Detailed"],
  ["minimal", "🧘 Minimal"],
  ["surprise-me", "🎲 Surprise Me"],
] as const;

const WEATHER_OPTIONS = [
  ["warm", "☀️ Warm"],
  ["cold", "❄️ Cold"],
  ["mixed", "🌦️ Mixed"],
  ["noPreference", "🌍 No Preference"],
] as const;

export function TravelPreferencesDashboard({
  data,
  onSubmit,
}: TravelPreferencesDashboardProps) {
  const existingPreferences = data.travelPreferences;

  const [pace, setPace] = useState<ExtractedPreferences["pace"]>(
    existingPreferences?.pace ?? "moderate",
  );

  const [travelStyle, setTravelStyle] = useState<
    NonNullable<ExtractedPreferences["travelStyle"]>
  >(existingPreferences?.travelStyle ?? "balanced");

  const [priority, setPriority] = useState<
    NonNullable<ExtractedPreferences["priority"]>
  >(existingPreferences?.priority ?? []);

  const [dietaryRestrictions, setDietaryRestrictions] = useState<
    NonNullable<ExtractedPreferences["dietaryRestrictions"]>
  >(existingPreferences?.dietaryRestrictions ?? []);

  const [dietaryInput, setDietaryInput] = useState("");

  const [spendingFlexibility, setSpendingFlexibility] = useState<
    NonNullable<ExtractedPreferences["spendingFlexibility"]>
  >(existingPreferences?.spendingFlexibility ?? "moderate");

  const [planningStyle, setPlanningStyle] = useState<
    NonNullable<ExtractedPreferences["planningStyle"]>
  >(existingPreferences?.planningStyle ?? "detailed");

  const [weatherPreference, setWeatherPreference] = useState<
    NonNullable<ExtractedPreferences["weatherPreference"]>
  >(existingPreferences?.weatherPreference ?? "noPreference");

  const [avoidCategories, setAvoidCategories] = useState<
    NonNullable<ExtractedPreferences["avoidCategories"]>
  >(existingPreferences?.avoidCategories ?? []);

  const togglePriority = (value: Priority) => {
    setPriority((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleAvoidCategory = (value: string) => {
    setAvoidCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const addDietaryRestriction = () => {
    const value = dietaryInput.trim();

    if (!value) return;

    if (!dietaryRestrictions.includes(value)) {
      setDietaryRestrictions((prev) => [...prev, value]);
    }

    setDietaryInput("");
  };

  const removeDietaryRestriction = (value: string) => {
    setDietaryRestrictions((prev) => prev.filter((item) => item !== value));
  };

  const handleSave = () => {
    const preferences = {
      pace,
      travelStyle,
      priority: priority.length > 0 ? priority : null,

      dietaryRestrictions:
        dietaryRestrictions.length > 0 ? dietaryRestrictions : null,

      spendingFlexibility,
      planningStyle,
      weatherPreference,

      avoidCategories: avoidCategories.length > 0 ? avoidCategories : null,
    };

    onSubmit({
      type: "travelPreferences",
      value: preferences,
    });
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Travel Profile
            </p>

            <h3 className="text-base font-bold text-slate-900">
              Customize Your Trip
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Tell WanderAI how you like to travel.
            </p>
          </div>

          <div className="text-2xl">✈️</div>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-5 space-y-6">
        {/* Pace + Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pace */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trip Pace
            </label>

            <select
              value={pace ?? ""}
              onChange={(e) =>
                setPace(e.target.value as ExtractedPreferences["pace"])
              }
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {PACE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Travel Style
            </label>

            <select
              value={travelStyle}
              onChange={(e) =>
                setTravelStyle(
                  e.target.value as NonNullable<
                    ExtractedPreferences["travelStyle"]
                  >,
                )
              }
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {TRAVEL_STYLE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trip Priorities
            </label>

            <p className="text-xs text-slate-400">
              What do you want to experience most?
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((option) => {
              const selected = priority.includes(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => togglePriority(option.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spending + Planning */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Spending */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Spending Flexibility
            </label>

            <select
              value={spendingFlexibility}
              onChange={(e) =>
                setSpendingFlexibility(
                  e.target.value as NonNullable<
                    ExtractedPreferences["spendingFlexibility"]
                  >,
                )
              }
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {SPENDING_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Planning Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Planning Style
            </label>

            <select
              value={planningStyle}
              onChange={(e) =>
                setPlanningStyle(
                  e.target.value as NonNullable<
                    ExtractedPreferences["planningStyle"]
                  >,
                )
              }
              className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {PLANNING_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Weather Preference
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WEATHER_OPTIONS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={weatherPreference === value}
                onClick={() =>
                  setWeatherPreference(
                    value as NonNullable<
                      ExtractedPreferences["weatherPreference"]
                    >,
                  )
                }
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  weatherPreference === value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dietary Restrictions
            </label>

            <p className="text-xs text-slate-400">
              Optional — e.g. vegetarian, halal, gluten-free.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDietaryRestriction();
                }
              }}
              placeholder="Add a restriction..."
              className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={addDietaryRestriction}
              className="px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Add
            </button>
          </div>

          {dietaryRestrictions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dietaryRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => removeDietaryRestriction(restriction)}
                  className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  {restriction} ×
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avoid Categories */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Things to Avoid
            </label>

            <p className="text-xs text-slate-400">
              {`Help WanderAI avoid experiences you don't want.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVOID_OPTIONS.map((option) => {
              const selected = avoidCategories.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleAvoidCategory(option)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {selected ? "✓ " : ""}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          Apply Preferences →
        </button>
      </div>
    </div>
  );
}

export default TravelPreferencesDashboard;
