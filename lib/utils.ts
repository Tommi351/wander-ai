import { TripDTO } from "@/types/global";
import { BudgetTier, Conversation, type Trip } from "./generated/prisma";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CanonicalItinerarySchema, TravelItinerary } from "./validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function differenceInDays(
  endDate: Date | null,
  startDate: Date | null,
): number | null {
  if (!startDate || !endDate) {
    return null;
  }

  const milliseconds = endDate.getTime() - startDate.getTime();

  return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 🛡️ Senior Move: Declare an explicit intersection type showing that the
// incoming database record includes the fetched conversation child relation layer.
type PrismaTripWithConversation = Trip & {
  conversation?: Conversation | null;
};

export const toTripDTO = (trip: PrismaTripWithConversation): TripDTO => {
  const BUDGET_TIER_MAP: Record<BudgetTier, "budget" | "mid-range" | "luxury"> =
    {
      [BudgetTier.BUDGET]: "budget",
      [BudgetTier.MID_RANGE]: "mid-range",
      [BudgetTier.LUXURY]: "luxury",
    };

  let validatedItinerary: TravelItinerary | null = null;

  if (
    trip.itineraryJson &&
    typeof trip.itineraryJson === "object" &&
    Object.keys(trip.itineraryJson).length > 0
  ) {
    try {
      // Safely parse and unpack the JSONB field right against your master Zod validation gate
      validatedItinerary = CanonicalItinerarySchema.parse(
        trip.itineraryJson,
      ) as TravelItinerary;
    } catch (err) {
      console.error(
        `Data integrity variance detected on Trip ID ${trip.id}:`,
        err,
      );
      // Failsafe fallback: keeps a minor layout error from crashing the entire app page fetch
      validatedItinerary = null;
    }
  }

  return {
    id: trip.id,
    title: trip.title,
    origin: trip.origin,
    destination: trip.destination,
    startDate:
      trip.startDate instanceof Date
        ? trip.startDate.toISOString()
        : trip.startDate || null,
    endDate:
      trip.endDate instanceof Date
        ? trip.endDate.toISOString()
        : trip.endDate || null,
    travelers: trip.travelers,
    budget: trip.budget === null ? null : Number(trip.budget),
    budgetTier: trip.budgetTier ? BUDGET_TIER_MAP[trip.budgetTier] : null, // Handles casing maps safely
    interests: trip.interests || [],
    status: trip.status,
    conversationId: trip.conversation?.id || null,
    updatedAt:
      trip.updatedAt instanceof Date
        ? trip.updatedAt.toISOString()
        : trip.updatedAt,
    // Enforce the strictly typed and validated frontend contract assignment
    itineraryJson: validatedItinerary,
  };
};
