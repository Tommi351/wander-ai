import type OpenAI from "openai";
import { getOpenAIClient } from "./openai";
import { GeneratorServiceInput } from "@/types/global";
import { GENERATOR_SYSTEM_PROMPT } from "./prompts";
import {
  CanonicalItinerarySchema,
  LLMItineraryGenerationSchema,
  type CanonicalItinerary,
} from "../validations";
import { z } from "zod";

const generatorJsonSchema = z.toJSONSchema(LLMItineraryGenerationSchema);

export const generateService = async ({
  tripId,
  finalSnapShot,
  startDate,
}: GeneratorServiceInput & {
  startDate: string | null;
}): Promise<CanonicalItinerary> => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: GENERATOR_SYSTEM_PROMPT,
    },

    {
      role: "developer",
      content: `Trip Id:

${JSON.stringify(tripId)}

Use this information to determine
which trip you should make a itinerary for
`,
    },
    {
      role: "developer",
      content: `Final Authoritative Planner Snapshot:

${JSON.stringify(finalSnapShot)}

Think of this final snapshot as a culmination of the user's planned trip and their travel preferences 
for the trip.
🛡️ DATE ANCHOR LINE:
The official starting calendar date for this trip is: ${startDate}.
You MUST compute every day's "date" property sequentially starting from this anchor date as Day 1.`,
    },
  ];

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 0.2,
    max_completion_tokens: 4000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "generator_response",
        strict: true,
        schema: generatorJsonSchema,
      },
    },
  });

  const choice = response.choices[0];

  if (!choice?.message?.content) {
    throw new Error("Generator returned no itinerary.");
  }

  // 1. Validate the flat AI container format
  const rawLLMResponse = LLMItineraryGenerationSchema.parse(
    JSON.parse(choice.message.content),
  );

  // 2. THE CHRONOLOGICAL ADAPTER LAYER: Maps flat tokens into your strict relational schema
  const transformedTimeline = rawLLMResponse.timeline.map((day) => {
    const mappedItems = day.items.map((item) => {
      const nestedLocation = {
        lat: null,
        lng: null,
        address: item.address || null,
      };

      switch (item.type) {
        case "flight":
          return {
            id: item.id,
            type: "flight" as const,
            time: item.time,
            title: item.title,
            cost: item.cost,
            bookingUrl: null,
            source: "AI_SUGGESTION" as const,
            airline: null,
            flightNumber: null,
            departureAirport: null,
            arrivalAirport: null,
            departureTime: null,
            arrivalTime: null,
          };

        case "accommodation":
          return {
            id: item.id,
            type: "accommodation" as const,
            time: item.time || "03:00 PM",
            title: item.title,
            cost: item.cost,
            // 🛡️ Aligned perfectly to match your true database HotelItemSchema!
            location: nestedLocation,
            bookingUrl: null,
            source: "AI_SUGGESTION" as const,
            nights: 1,
            checkIn: "03:00 PM",
            checkOut: "11:00 AM",
          };

        case "activity":
          return {
            id: item.id,
            type: "activity" as const,
            time: item.time,
            title: item.title,
            cost: item.cost,
            // 🛡️ Aligned perfectly to match your true database ActivityItemSchema!
            location: nestedLocation,
            bookingUrl: null,
            source: "AI_SUGGESTION" as const,
            duration: item.duration || "2 Hours",
            category: item.category || "Sightseeing",
          };

        default:
          throw new Error(`Unhandled data discriminator encountered.`);
      }
    });

    return {
      dayNumber: day.dayNumber,
      date: day.date,
      items: mappedItems,
    };
  });

  // 3. Construct the complete master payload tracking the entire layout truth
  const finalItineraryPayload: CanonicalItinerary = {
    destination: rawLLMResponse.destination,
    budgetTier: rawLLMResponse.budgetTier,
    totalEstimatedCost: rawLLMResponse.totalEstimatedCost,
    currency: rawLLMResponse.currency,
    notes: rawLLMResponse.notes,
    timeline: transformedTimeline,
  };

  // 4. Force run the final verification gate before database persistence
  return CanonicalItinerarySchema.parse(finalItineraryPayload);
};
