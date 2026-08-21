// components/maps/ItineraryMapView.tsx
import React from "react";
import { ItineraryDay } from "@/lib/validations";

interface ItineraryMapViewProps {
  timeline: ItineraryDay[];
}

export function ItineraryMapView({ timeline }: ItineraryMapViewProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center text-slate-400">
      <div className="text-3xl mb-2">🗺️</div>
      <h4 className="font-bold text-slate-700 text-sm">
        Geo-Anchored Map Canvas Frame
      </h4>
      <p className="text-xs max-w-xs mt-1">
        Phase 6 Core Target Space: This lane will receive your timeline items
        array to render interactive interactive map markers.
      </p>
    </div>
  );
}
