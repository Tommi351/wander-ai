import { Trip, TripDTO } from "@/types/global";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const toTripDTO = (trip: Trip): TripDTO => {
  return {
    id: trip.id,

    title: trip.title,

    origin: trip.origin,

    destination: trip.destination,

    conversationId: trip.conversation?.id ?? null,

    startDate: trip.startDate ? trip.startDate.toString() : null,

    endDate: trip.endDate ? trip.endDate.toISOString() : null,

    travelers: trip.travelers,

    budget: trip.budget,

    budgetTier: trip.budgetTier,

    interests: trip.interests,

    status: trip.status,

    updatedAt: trip.updatedAt.toISOString(),
  };
};
