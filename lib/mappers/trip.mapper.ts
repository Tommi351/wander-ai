import { Trip, TripPlanningState } from "@/types/global";
import { differenceInDays } from "../utils";

export const toTripPlanningState = (trip: Trip | null): TripPlanningState => {
  if (!trip) {
    return {
      tripData: {
        origin: null,
        destination: null,
        travelers: null,
        duration: null,
        budgetTier: null,
        interests: [],
      },

      travelPreferences: null,

      complete: false,
    };
  }

  return {
    tripData: {
      origin: trip.origin,

      destination: trip.destination,

      travelers: trip.travelers,

      duration:
        trip.startDate && trip.endDate
          ? differenceInDays(trip.endDate, trip.startDate)
          : null,

      budgetTier: trip.budgetTier,

      interests: trip.interests,
    },

    travelPreferences: null,

    complete: trip.status === "COMPLETED",
  };
};
