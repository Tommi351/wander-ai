// 👤 USER & PROFILE ENTITIES
export interface UserPreferences {
  budgetTier: "budget" | "mid-range" | "luxury";

  pace: "relaxed" | "moderate" | "fast-paced";

  travelStyle?: "backpacking" | "balanced" | "luxury" | "family" | "business";

  // interests: string[];
  // priority?: "food" | "culture" | "nature" | "nightlife" | "adventure";

  // dietaryRestrictions?: string[];

  // spendingFlexibility?: "strict" | "moderate" | "flexible";
  // planningStyle?: "detailed" | "minimal" | "surprise-me";

  // weatherPreference?: "warm" | "cold" | "mixed" | "noPreference";

  // avoidCategories?: string[];
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  email: string;
  preferences: UserPreferences;
}

// TRIP ENTITIES
interface Trip {
  id: string;
  title: string;
  destination: string;
  origin: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  status: TripStatus;
  updatedAt: Date;
}

export interface TripDTO {
  id: string;
  title: string;
  destination: string;
  origin: string | null;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  status: TripStatus;
  updatedAt: string;

  itineraryJson?: any; // raw for now (Phase 2–3)
}

export interface TripCard {
  trip: TripDTO;
}

export interface TripListProps {
  trips: TripDTO[];
}

// 💬 CHAT ENTITIES
export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: Date;
}

// // 🌍 MAP COORDINATE COMPONENT
// export interface GeoLocation {
//   lat: number;
//   lng: number;
//   address: string;
// }

// // ✈️ TIMELINE ITEM SUB-TYPES
// export interface FlightItem {
//   id: string;
//   type: "flight";
//   time: string; // e.g., "08:30 AM"
//   airline: string;
//   flightNumber: string;
//   cost: number;
//   bookingUrl: string;
// }

// export interface HotelItem {
//   id: string;
//   type: "accommodation";
//   time: string; // e.g., "03:00 PM Check-In"
//   name: string;
//   pricePerNight: number;
//   nights: number;
//   location: GeoLocation;
//   bookingUrl: string;
// }

// export interface ActivityItem {
//   id: string;
//   type: "activity";
//   time: string; // e.g., "11:00 AM"
//   name: string;
//   cost: number;
//   location: GeoLocation;
//   bookingUrl: string;
// }

// // Discriminated Union for easy type guard checking in loops
// export type TimelineItem = FlightItem | HotelItem | ActivityItem;

// // 🗺️ TOP-LEVEL ITINERARY TREE
// export interface ItineraryDay {
//   dayNumber: number;
//   date: string; // e.g., "2026-06-15"
//   items: TimelineItem[];
// }

// export interface TravelItinerary {
//   tripId: string;
//   destination: string;
//   totalBudget: number;
//   currency: string;
//   timeline: ItineraryDay[];
// }
