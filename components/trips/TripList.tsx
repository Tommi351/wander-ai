"use client";

import { TripListProps } from "@/types/global";
import TripCard from "./TripCard";

const TripList = ({ trips }: TripListProps) => {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <h2 className="text-xl font-semibold">No trips yet ✈️</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first trip to start planning your adventure
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripList;
