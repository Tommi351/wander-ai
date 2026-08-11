import { type UserPreferences, UserPreferencesSchema } from "../validations";
import { Prisma } from "../generated/prisma";

export function toUserPreferences(value: Prisma.JsonValue): UserPreferences {
  const result = UserPreferencesSchema.safeParse(value);

  if (!result.success) {
    return {
      pace: "moderate",
      travelStyle: "balanced",
      priority: ["culture"],
      dietaryRestrictions: [],
      spendingFlexibility: "moderate",
      planningStyle: "detailed",
      weatherPreference: "noPreference",
      avoidCategories: [],
    };
  }

  return result.data as UserPreferences;
}
