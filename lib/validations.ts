import { z } from "zod";
import { TripStatus } from "./generated/prisma";

export const CreateTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    destination: z.string().trim().min(1, "Destination is required"),
    origin: z.string().trim().optional().nullable(),
    startDate: z
      .preprocess((val) => (val === "" ? null : val), z.coerce.date())
      .nullable()
      .optional()
      .refine(
        (date) => !date || date >= new Date(new Date().setHours(0, 0, 0, 0)),
        {
          message: "Start date cannot be in the past",
        },
      ),
    endDate: z
      .preprocess((val) => (val === "" ? null : val), z.coerce.date())
      .nullable()
      .optional(),
    // Coerces string inputs from forms (like "1500") into a clean float for Prisma
    budget: z
      .preprocess(
        (val) => (val === "" || val === undefined ? null : val),
        z.coerce.number(),
      )
      .pipe(z.number().positive("Budget must be a positive number"))
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be before the start date",
      path: ["endDate"],
    },
  );

// 1. For HTML / React Form state.
// TypeScript will know startDate/endDate can be strings or empty strings.
export type CreateTripFormInput = z.input<typeof CreateTripSchema>;

// 2. For API payload or AI processing.
// TypeScript guarantees these are real Date objects or undefined.
export type CreateTripData = z.infer<typeof CreateTripSchema>;

export const UpdateTripSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    destination: z.string().min(1, "Destination cannot be empty").optional(),
    origin: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budget: z.number().positive("Budget must be a positive number").optional(),
    status: z.enum(TripStatus).optional(),
    // Assuming the client passes a parsed JSON object for updates
    itineraryJson: z.any().optional(),
  })
  .partial()
  .refine(
    (data) => {
      // Enforce validation if they attempt to update dates
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );

// 1. For HTML / React Form state.
// TypeScript will know startDate/endDate can be strings or empty strings.
export type UpdateTripFormInput = z.input<typeof UpdateTripSchema>;

// 2. For API payload or AI processing.
// TypeScript guarantees these are real Date objects or undefined.
export type UpdateTripData = z.infer<typeof UpdateTripSchema>;

export const CreateMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message is too long (max 2000 characters)"),
});

export type CreateMessageFormInput = z.input<typeof CreateMessageSchema>;

export type CreateMessageData = z.infer<typeof CreateMessageSchema>;

export const UserPreferencesSchema = z.object({
  pace: z.enum(["relaxed", "moderate", "fast-paced"]).nullable(),

  travelStyle: z
    .enum(["backpacking", "balanced", "luxury", "family", "business"])
    .nullable(),

  priority: z
    .array(z.enum(["food", "culture", "nature", "nightlife", "adventure"]))
    .nullable(),

  dietaryRestrictions: z.array(z.string().trim().min(1)).nullable(),

  spendingFlexibility: z.enum(["strict", "moderate", "flexible"]).nullable(),

  planningStyle: z.enum(["detailed", "minimal", "surprise-me"]).nullable(),

  weatherPreference: z
    .enum(["warm", "cold", "mixed", "noPreference"])
    .nullable(),

  avoidCategories: z.array(z.string().trim().min(1)).nullable(),
});

// What the AI must receive
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const StoredUserPreferencesSchema = z.object({
  pace: z.enum(["relaxed", "moderate", "fast-paced"]).nullable().optional(),

  travelStyle: z
    .enum(["backpacking", "balanced", "luxury", "family", "business"])
    .nullable()
    .optional(),

  priority: z
    .array(z.enum(["food", "culture", "nature", "nightlife", "adventure"]))
    .nullable()
    .optional(),

  dietaryRestrictions: z.array(z.string().trim().min(1)).nullable().optional(),

  spendingFlexibility: z
    .enum(["strict", "moderate", "flexible"])
    .nullable()
    .optional(),

  planningStyle: z
    .enum(["detailed", "minimal", "surprise-me"])
    .nullable()
    .optional(),

  weatherPreference: z
    .enum(["warm", "cold", "mixed", "noPreference"])
    .nullable()
    .optional(),

  avoidCategories: z.array(z.string().trim().min(1)).nullable().optional(),
});

// What the user actually selected
export type StoredUserPreferences = z.infer<typeof StoredUserPreferencesSchema>;

export const PLANNER_UI_TYPES = [
  "origin",
  "destination",
  "groupSize",
  "budget",
  "duration",
  "interests",
  "travelPreferences",
  "final",
] as const;

export const PlannerMessageMetadataSchema = z.object({
  ui: z
    .object({
      type: z.enum(PLANNER_UI_TYPES),
    })
    .optional(),
});

export const AITripPlanningResponseSchema = z.object({
  message: z.string().trim(),

  ui: z.object({
    type: z.enum(PLANNER_UI_TYPES),
  }),

  updatedTripData: z.object({
    origin: z.string().trim().min(1).nullable(),

    destination: z.string().trim().min(1).nullable(),

    travelers: z.number().int().positive().nullable(),

    budgetTier: z.enum(["budget", "mid-range", "luxury"]).nullable(),

    duration: z.number().int().positive().nullable(),

    interests: z.array(z.string().trim().min(1)),
  }),

  travelPreferences: UserPreferencesSchema,

  isComplete: z.boolean(),
});

export type AITripPlanningResponse = z.infer<
  typeof AITripPlanningResponseSchema
>;

// 🌍 Shared Location Blueprint (Fully nullable until Phase 7)
export const GeoLocationSchema = z
  .object({
    lat: z.number().nullable().default(null),
    lng: z.number().nullable().default(null),
    address: z.string().nullable().default(null),
  })
  .nullable()
  .default(null);

// 🌐 The Dual-Track Flagging Metric
export const VerificationSourceSchema = z.enum([
  "AI_SUGGESTION",
  "API_HYDRATED",
  "CACHE_MATCH",
]);

// ✈️ Track-Safe Flight Blueprint
export const FlightItemSchema = z.object({
  id: z.string(), // E.g., "flight_suggested_1" or "flight_amadeus_xyz"
  type: z.literal("flight"),
  time: z.string(),
  title: z.string(), // E.g., "Flight to Lisbon"
  cost: z.number().nonnegative(),
  bookingUrl: z.string().nullable(), // Nullable because AI can't invent real links!
  source: VerificationSourceSchema.default("AI_SUGGESTION"),

  // Optional/Nullable primitives until Phase 7 Background Hydration kicks in and Skyscanner API is used
  flightNumber: z.string().nullable().default(null),
  airline: z.string().nullable().default(null),
  departureAirport: z.string().nullable().default(null),
  arrivalAirport: z.string().nullable().default(null),
  departureTime: z.string().nullable().default(null),
  arrivalTime: z.string().nullable().default(null),
});

// 🏨 Track-Safe Accommodation Blueprint
export const HotelItemSchema = z.object({
  id: z.string(),
  type: z.literal("accommodation"),
  time: z.string().default("03:00 PM"), // Check-in time anchor
  title: z.string(), // Hotel Name
  cost: z.number().nonnegative(), // Price mapping
  location: GeoLocationSchema,
  bookingUrl: z.string().nullable(), // Nullable or optional until Phase 7
  source: VerificationSourceSchema.default("AI_SUGGESTION"),

  //Optional/Nullable Primitives until Phase 7 kicks in and Booking.com API is used
  pricePerNight: z.number().nonnegative().optional(),
  nights: z.number().int().positive().default(1),
  checkIn: z.string().default("03:00 PM"),
  checkOut: z.string().default("11:00 AM"),
});

// 🍽️ Track-Safe Activity Blueprint
export const ActivityItemSchema = z.object({
  id: z.string(),
  type: z.literal("activity"),
  time: z.string(),
  title: z.string(), // Description name
  cost: z.number().nonnegative(),
  location: GeoLocationSchema,
  bookingUrl: z.string().nullable(), // Nullable/Optional until Phase 7 and Viator API is used
  source: VerificationSourceSchema.default("AI_SUGGESTION"),

  duration: z.string().default("2 Hours"),
  category: z.string().default("Sightseeing"),
});

// 👑 Option 3 Style Discriminated Union for Timeline Loop Rendering
export const TimelineItemSchema = z.discriminatedUnion("type", [
  FlightItemSchema,
  HotelItemSchema,
  ActivityItemSchema,
]);

// 📅 Clean Scannable Day Schema (Matches Option 2 Flattening)
export const ItineraryDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string(), // YYYY-MM-DD
  items: z.array(TimelineItemSchema),
});

// 🏆 THE CANONICAL MASTER ITINERARY CONTRACT (Saves to database column)
export const CanonicalItinerarySchema = z.object({
  destination: z.string(),
  budgetTier: z.enum(["budget", "mid-range", "luxury"]),
  totalEstimatedCost: z.number().nonnegative(),
  currency: z.string().default("USD"),
  notes: z.string().default(""),

  // The core loop array
  timeline: z.array(ItineraryDaySchema),
});

export const LLMItineraryGenerationSchema = z.object({
  destination: z.string(),
  budgetTier: z.enum(["budget", "mid-range", "luxury"]),
  totalEstimatedCost: z.number().nonnegative(),
  currency: z.string().default("USD"),
  notes: z.string().default(""),
  timeline: z.array(
    z.object({
      dayNumber: z.number().int().positive(),
      date: z.string(),
      items: z.array(
        z.object({
          id: z.string(), // e.g., "flight_0" or "activity_1"
          type: z.enum(["flight", "accommodation", "activity"]),
          time: z.string(), // e.g., "08:30 AM"
          title: z.string(), // e.g., "Flight from NYC to Lisbon" or "Waterfront Hotel Concept"
          cost: z.number().nonnegative(),

          // 🛡️ Track A Law: The AI provides the raw text suggestion here
          address: z.string().nullable().default(null),

          // Activity specific fields directly on the object (No nested options!)
          duration: z.string().nullable().default("2 Hours"),
          category: z.string().nullable().default("Sightseeing"),
        }),
      ),
    }),
  ),
});

export type CanonicalItinerary = z.infer<typeof CanonicalItinerarySchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;
