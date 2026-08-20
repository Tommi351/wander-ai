import { TripPlanningState } from "@/types/global";
import { differenceInDays } from "../utils";
import { BudgetTier, type Trip } from "../generated/prisma";

export const toTripPlanningState = (trip: Trip | null): TripPlanningState => {
  const PLANNER_BUDGET_TIER_MAP: Record<
    BudgetTier,
    "budget" | "mid-range" | "luxury"
  > = {
    [BudgetTier.BUDGET]: "budget",
    [BudgetTier.MID_RANGE]: "mid-range",
    [BudgetTier.LUXURY]: "luxury",
  };

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

      budgetTier: trip.budgetTier
        ? PLANNER_BUDGET_TIER_MAP[trip.budgetTier]
        : null,

      interests: trip.interests,
    },

    travelPreferences: null,

    complete: trip.status === "COMPLETED",
  };
};
