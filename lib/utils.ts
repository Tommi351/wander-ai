import { TripDTO } from "@/types/global";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toTripDTO = (trip: any): TripDTO => {
  return {
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    origin: trip.origin,
    startDate: trip.startDate ? trip.startDate.toISOString() : null,
    endDate: trip.endDate ? trip.endDate.toISOString() : null,
    budget: trip.budget,
    status: trip.status,
    updatedAt: trip.updatedAt.toISOString(),
  };
};
