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
  budgetTier: BudgetTier | null;

  interests: string[];

  status: TripStatus;
  conversationId: string | null;
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

// 🌍 MAP COORDINATE COMPONENT
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

// ✈️ TIMELINE ITEM SUB-TYPES
export interface FlightItem {
  id: string;
  type: "flight";
  time: string; // e.g., "08:30 AM"
  airline: string;
  flightNumber: string;
  cost: number;
  bookingUrl: string;
  departureAirport: string;

  arrivalAirport: string;

  departureTime: string; // e.g., "08:30 AM"

  arrivalTime: string; // e.g., "08:30 AM"
}

export interface HotelItem {
  id: string;
  type: "accommodation";
  checkIn: string;
  checkOut: string;
  name: string;
  pricePerNight: number;
  nights: number;
  location: GeoLocation;
  bookingUrl: string;
}

export interface ActivityItem {
  id: string;
  type: "activity";
  time: string; // e.g., "11:00 AM"
  description: string;
  duration: string;
  category: string;
  cost: number;
  location: GeoLocation;
  bookingUrl: string;
}

// Discriminated Union for easy type guard checking in loops
export type TimelineItem = FlightItem | HotelItem | ActivityItem;

// 🗺️ TOP-LEVEL ITINERARY TREE
export interface ItineraryDay {
  dayNumber: number;
  date: string; // e.g., "2026-06-15"
  items: TimelineItem[];
}

export interface TravelItinerary {
  tripId: string;
  destination: string;
  totalBudget: number;
  currency: string;
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
