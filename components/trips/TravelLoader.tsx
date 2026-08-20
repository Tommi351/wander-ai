"use client";

import { useState, useEffect } from "react";
import { Globe, Hotel, Utensils, Route, Compass } from "lucide-react";

const STEPS = [
  { text: "Analyzing flight paths...", icon: Globe },
  { text: "Scouting boutique hotels...", icon: Hotel },
  { text: "Mapping hidden food gems...", icon: Utensils },
  { text: "Optimizing travel routes...", icon: Route },
  { text: "Finalizing your perfect trip...", icon: Compass },
];

const TRIVIA = [
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
  "Jet lag feels worse when traveling east because your internal clock has to advance.",
  "All map projections distort the world; the Mercator projection makes Greenland look massive.",
  "The shortest commercial flight in the world lasts just 47 seconds in Scotland.",
];

interface TravelLoaderProps {
  onCancel?: () => void;
}

export default function TravelLoader({ onCancel }: TravelLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
        setFade(true);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = STEPS[currentStep].icon;
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;
  const triviaIndex = currentStep % TRIVIA.length;

  return (
    <div className="flex items-center justify-center min-h-100 p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        {/* Animated Icon Area */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Ocean Blue Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin" />

          {/* Floating Ocean Blue Icon */}
          <div className="animate-bounce text-sky-600 transition-all duration-300">
            <ActiveIcon className="w-8 h-8" />
          </div>
        </div>

        {/* Progress Title and Status */}
        <h3 className="text-xl font-bold text-slate-800 mb-1">
          Crafting Your Itinerary
        </h3>

        {/* Ocean Blue Status Text */}
        <p
          className={`text-sm font-semibold text-sky-700 h-5 transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
        >
          {STEPS[currentStep].text}
        </p>

        {/* Ocean Blue Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 my-6 overflow-hidden">
          <div
            className="bg-sky-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Trivia Box */}
        <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 min-h-24 flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
            Travel Trivia
          </span>
          <p
            className={`text-xs text-slate-600 leading-relaxed transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
          >
            {TRIVIA[triviaIndex]}
          </p>
        </div>

        {/* Cancel Action */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 text-xs font-semibold text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
          >
            Cancel Search
          </button>
        )}
      </div>
    </div>
  );
}
