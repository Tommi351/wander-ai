"use client";

import { TimelineItem } from "@/lib/validations";
import { isFlightItem, isHotelItem, isActivityItem } from "@/lib/utils";

interface TimelineItemRendererProps {
  item: TimelineItem;
}

export function TimelineItemRenderer({ item }: TimelineItemRendererProps) {
  if (isFlightItem(item)) {
    return (
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-800">
        ✈️ Flight Placeholder Row: {item.title} ({item.time}) - Cost: $
        {item.cost}
      </div>
    );
  }

  if (isHotelItem(item)) {
    return (
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
        🏨 Hotel Placeholder Row: {item.title} - Address:{" "}
        {item.location?.address}
      </div>
    );
  }

  if (isActivityItem(item)) {
    return (
      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-800">
        🍽️ Activity Placeholder Row: {item.title} - Category: {item.category} (
        {item.duration})
      </div>
    );
  }

  return null;
}
