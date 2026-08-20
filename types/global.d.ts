import { TripStatus } from "@/lib/generated/prisma";
import { BudgetTier } from "@/lib/generated/prisma";
import type { AITripPlanningResponse } from "@/lib/validations";
import type { PLANNER_UI_TYPES } from "`@/lib/validations`";

// 👤 USER & PROFILE ENTITIES
import { UserPreferences } from "@/lib/validations"; // 🔥 Import the Zod-inferred one instead!

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

  origin: string | null;
  destination: string;

  startDate: Date | null;
  endDate: Date | null;

  travelers: number | null;

  budget: number | null;
  budgetTier: BudgetTier | null;

  interests: string[];

  status: TripStatus;

  conversation?: {
    id: string;
  } | null;

  updatedAt: Date;

  itineraryJson: TravelItinerary | null;
}

export interface TripDTO {
  id: string;
  title: string;

  origin: string | null;
  destination: string;

  startDate: string | null;
  endDate: string | null;

  travelers: number | null;

  budget: number | null;
  budgetTier: "budget" | "mid-range" | "luxury" | null;

  interests: string[];

  status: TripStatus;
  conversationId: string | null;
  updatedAt: string;

  itineraryJson: TravelItinerary | null;
}

export interface TripCard {
  trip: TripDTO;
}

export interface TripListProps {
  trips: TripDTO[];
}

// 💬 CHAT ENTITIES
export interface PlannerMessageMetadata {
  ui?: {
    type: PlannerUIType;
  };
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT" | "SYSTEM" | "DEVELOPER";
  content: string;
  createdAt: Date;
  metadata?: PlannerMessageMetadata | null;
}

export interface MessageBubbleProps {
  message: ConversationMessage;
  onUISubmit: (value: PlannerUIEvent) => void;
  tripState: PlannerSubmission;
}

export interface MessageListProps {
  messages: ConversationMessage[];
  tripState: PlannerSubmission;
  onUISubmit: (event: PlannerUIEvent) => void;
}

// 🌍 Shared Maps geographic contract used by hotels and activities
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

// 🌐 The Dual-Track Data Origin Flag
export type VerificationSource =
  | "AI_SUGGESTION"
  | "API_HYDRATED"
  | "CACHE_MATCH"; // this Cache_Match could be good for caching and stuff

// ✈️ Rich Frontend Model: Flight Item
export interface FlightItem {
  id: string; // Internal tracking key (e.g., "flight_suggested_0")
  type: "flight";
  time: string; // e.g., "08:30 AM" for chronological rendering
  title: string; // UI Header text
  cost: number;
  bookingUrl: string | null; // Nullable because the AI track cannot invent real links!
  source: VerificationSource;

  // Real-world primitives populated initially as placeholders, filled by tool calls/Phase 7
  airline: string | null;
  flightNumber: string | null;
  departureAirport: string | null;
  arrivalAirport: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
}

// 🏨 Rich Frontend Model: Accommodation Item
export interface HotelItem {
  id: string; // Internal tracking key for hotels
  type: "accommodation";
  time: string; // Default anchor time (e.g., "03:00 PM" check-in)
  title: string; // UI Header text (Hotel Name)
  cost: number;
  location: GeoLocation; // Nested geographic object instead of flat keys!
  bookingUrl: string | null; // Nullable because the AI track cannot invent real links!
  source: VerificationSource;

  // Real-world primitives populated initially as placeholders, filled by tool calls/Phase 7
  pricePerNight: number | null;
  nights: number;
  checkIn: string | null;
  checkOut: string | null;
}

// 🍽️ Rich Frontend Model: Activity Item
export interface ActivityItem {
  id: string;
  type: "activity";
  time: string; // e.g., "11:00 AM"
  title: string; // UI Header text (Activity description)
  cost: number;
  location: GeoLocation; // Nested geographic object!
  bookingUrl: string | null; // Nullable because the AI track cannot invent real links!
  source: VerificationSource;

  duration: string; // e.g., "2 Hours" derived field
  category: string; // e.g., "Sightseeing"
}

// 👑 The Discriminated Union: The ultimate loop-traversal contract
export type TimelineItem = FlightItem | HotelItem | ActivityItem;

// 📅 The Clean Day Tree Node
export interface ItineraryDay {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  items: TimelineItem[]; // Handled by switch(item.type) on the UI
}

// 🏆 Top-Level Travel Itinerary DTO (Matches what unpacks from your Prisma Json column)
export interface TravelItinerary {
  destination: string;
  budgetTier: "budget" | "mid-range" | "luxury";
  totalEstimatedCost: number;
  currency: string;
  notes: string;

  // The actual sequential rendering timeline
  timeline: ItineraryDay[];
}

// AI Types
export interface TripPlanningState {
  tripData: {
    origin: string | null;
    destination: string | null;
    travelers: number | null;
    duration: number | null;

    budgetTier: "budget" | "mid-range" | "luxury" | null;

    interests: string[];
  };

  travelPreferences: UserPreferences | null;

  complete: boolean;
}

// Planner AI Inputs
export interface PlannerServiceInput {
  conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[];

  currentTripState: TripPlanningState;

  userPreferences: UserPreferences | null;
}

export type PlannerActionResult =
  | {
      success: true;
      message: string;
      ui?: {
        type: PlannerUIType;
      };
      updatedTripData?: Partial<AITripPlanningResponse["updatedTripData"]>;
      travelPreferences: AITripPlanningResponse["travelPreferences"];
      isComplete: boolean;
      savedUserMessage: ConversationMessage;
      assistantMessage: ConversationMessage & {
        ui?: {
          type: PlannerUIType;
        };
      };
    }
  | {
      success: false;
      savedUserMessage: ConversationMessage | null;
      assistantMessage: null;
      error: string;
    };

export type PlannerUIEvent =
  | {
      type: "origin";
      value: string;
    }
  | {
      type: "destination";
      value: string;
    }
  | {
      type: "groupSize";
      value: number;
    }
  | {
      type: "budget";
      value: "budget" | "mid-range" | "luxury";
    }
  | {
      type: "duration";
      value: number;
    }
  | {
      type: "interests";
      value: string[];
    }
  | {
      type: "travelPreferences";
      value: AITripPlanningResponse["travelPreferences"];
    }
  | {
      type: "final";
      value: PlannerSubmission;
    };

export type PlannerUIType = (typeof PLANNER_UI_TYPES)[number];

export type PlannerUIRendererProps = {
  type: PlannerUIType;
  data: PlannerSubmission;
  onSubmit: (event: PlannerUIEvent) => void;
};

export type ExtractedPreferences = NonNullable<
  PlannerSubmission["travelPreferences"]
>;

export type PlannerSubmission = {
  tripData: Partial<AITripPlanningResponse["updatedTripData"]>;
  travelPreferences: AITripPlanningResponse["travelPreferences"] | null;
};

// Generator AI Inputs
export type GeneratorServiceInput = {
  tripId: string;
  finalSnapShot: PlannerSubmission;
};
