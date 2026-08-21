import React from "react";
import { ItineraryDay } from "@/lib/validations";
import { TimelineItemRenderer } from "./TimelineItemRenderer";

interface TimelineDayListProps {
  timeline: ItineraryDay[];
}

export function TimelineDayList({ timeline }: TimelineDayListProps) {
  return (
    <div className="space-y-10">
      {timeline.map((day) => (
        <div
          key={`day-${day.dayNumber}`}
          className="relative border-l border-slate-200 pl-6 pb-2"
        >
          {/* Day Date Marker Dot Anchor */}
          <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-blue-600 bg-white" />

          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900">
              Day {day.dayNumber}
            </h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {day.date}
            </p>
          </div>

          {/* Core Chronological Row Iterator */}
          <div className="space-y-4">
            {day.items.map((item) => (
              // 🔬 Execute type-guard switches to map strict design-time parameters safely
              <TimelineItemRenderer key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
