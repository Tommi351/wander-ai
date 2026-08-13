import {
  StoredUserPreferencesSchema,
  type UserPreferences,
} from "../validations";
import { Prisma } from "../generated/prisma";

export function toUserPreferences(value: Prisma.JsonValue): UserPreferences {
  const result = StoredUserPreferencesSchema.safeParse(value);

  if (!result.success) {
    return {
      pace: null,
      travelStyle: null,
      priority: null,
      dietaryRestrictions: null,
      spendingFlexibility: null,
      planningStyle: null,
      weatherPreference: null,
      avoidCategories: null,
    };
  }

  return {
    pace: result.data.pace ?? null,
    travelStyle: result.data.travelStyle ?? null,
    priority: result.data.priority ?? null,
    dietaryRestrictions: result.data.dietaryRestrictions ?? null,
    spendingFlexibility: result.data.spendingFlexibility ?? null,
    planningStyle: result.data.planningStyle ?? null,
    weatherPreference: result.data.weatherPreference ?? null,
    avoidCategories: result.data.avoidCategories ?? null,
  };
}
