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
