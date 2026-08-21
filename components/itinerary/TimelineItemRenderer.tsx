"use client";

import { TimelineItem } from "@/lib/validations";
import { isFlightItem, isHotelItem, isActivityItem } from "@/lib/utils";
import { FlightCard } from "./FlightCard";
import { HotelCard } from "./HotelCard";
import { ActivityCard } from "./ActivityCard";

interface TimelineItemRendererProps {
  item: TimelineItem;
}

export function TimelineItemRenderer({ item }: TimelineItemRendererProps) {
  if (isFlightItem(item)) {
    return (
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <FlightCard item={item} />
      </div>
    );
  }

  if (isHotelItem(item)) {
    return (
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
        <HotelCard item={item} />
      </div>
    );
  }

  if (isActivityItem(item)) {
    return (
      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-amber-800">
        <ActivityCard item={item} />
      </div>
    );
  }

  return null;
}
