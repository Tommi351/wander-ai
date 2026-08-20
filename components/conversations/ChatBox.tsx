"use client";

import { useState, useTransition } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import {
  ConversationMessage,
  GeneratorSubmission,
  PlannerSubmission,
  PlannerUIEvent,
} from "@/types/global";
import { plannerAction } from "@/lib/actions/planner.action";
import {
  syncUIPreference,
  syncTravelPreferencesAction,
} from "@/lib/actions/sync.action";
import {
  AITripPlanningResponse,
  CanonicalItinerary,
  type UserPreferences,
} from "@/lib/validations";
import { startItineraryWithFullSnapshotAction } from "@/lib/actions/generate.action";
import { useRouter } from "next/navigation";
import TravelLoader from "../trips/TravelLoader";

const ChatBox = ({
  initialMessages,
  conversationId,
  tripId,
  onGenerationComplete,
}: {
  initialMessages: ConversationMessage[];
  conversationId: string;
  tripId: string;
  // 🛡️ Phase 4C Progression Hook: Added to handle viewport switching gracefully!
  onGenerationComplete?: (itinerary: CanonicalItinerary) => void;
}) => {
  const router = useRouter();

  const [messages, setMessages] = useState(initialMessages);

  const [tripState, setTripState] = useState<PlannerSubmission>({
    tripData: {},
    travelPreferences: null,
  });

  const [isPlanning, startPlanning] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const sendToPlanner = async (content: string) => {
    if (!content.trim() || isPlanning) return;

    setError(null);

    // 1. Create optimistic message
    const tempId = crypto.randomUUID();

    const tempMessage: ConversationMessage = {
      id: tempId,
      conversationId: conversationId,
      role: "USER",
      content,
      createdAt: new Date(),
      metadata: null,
    };

    // 2. Add optimistic message immediately
    setMessages((prev) => [...prev, tempMessage]);

    startPlanning(async () => {
      try {
        // 3. Call Planner AI to help plan user trips
        const result = await plannerAction(conversationId, content);

        // 4. Handle AI message failure
        // Case 1: User message never saved
        if (!result.success) {
          if (!result.savedUserMessage) {
            setMessages((prev) =>
              prev.filter((message) => message.id !== tempId),
            );
          }

          setError(result.error);
          return;
        }

        // Case 2A: Replace optimistic message with real database message
        setMessages((prev) =>
          prev.map((message) =>
            message.id === tempId ? result.savedUserMessage : message,
          ),
        );

        // Case 2B: AI failed after
        if (!result.assistantMessage) {
          setError("Planner failed. Please try again.");
          return;
        }

        // Case 3: Everything succeeded
        setMessages((prev) => [...prev, result.assistantMessage]);

        setTripState((prev) => ({
          tripData: {
            ...prev.tripData,
            ...(result.updatedTripData ?? {}),
          },
          travelPreferences: result.travelPreferences ?? prev.travelPreferences,
        }));
      } catch (err) {
        // 6. Handle AI failure
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const handleSend = sendToPlanner;

  const handleFinalSubmission = async (
    submissionPayload: GeneratorSubmission,
  ) => {
    setError(null);
    setIsGenerating(true);

    try {
      const res = await startItineraryWithFullSnapshotAction(
        tripId,
        submissionPayload,
      );

      if (!res.success) {
        setError(
          res.error || "Failed to create your structured travel layout.",
        );
        return;
      }

      // 3. TRIGGER VIEW PORT TRANSITION (Phase 4C Entry Portal!)
      if (onGenerationComplete && res.data) {
        onGenerationComplete(res.data);
      }

      router.push(`/trips/${tripId}`);
      router.refresh(); // Hard flushes the client-side cache for the current route
    } catch (err) {
      console.error("Generation pipeline failure", err);
      setError(
        "A fatal transmission error occurred while launching the itinerary builder.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUISubmit = (event: PlannerUIEvent) => {
    setError(null);

    let deltaPayload:
      | Partial<AITripPlanningResponse["updatedTripData"]>
      | UserPreferences
      | null = null;
    let textRepresentation = "";
    let isPreferenceTrack = false; // Flag to separate the two tracks at the bottom

    switch (event.type) {
      case "origin":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, origin: event.value },
        }));
        deltaPayload = { origin: event.value };
        textRepresentation = event.value.toString();
        break;
      case "destination":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, destination: event.value },
        }));
        deltaPayload = { destination: event.value };
        textRepresentation = event.value.toString();
        break;
      case "groupSize":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, travelers: event.value },
        }));
        deltaPayload = { travelers: event.value };
        textRepresentation =
          event.value === 1 ? "Just 1 traveler" : `${event.value} travelers`;
        break;
      case "budget":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, budgetTier: event.value },
        }));
        deltaPayload = { budgetTier: event.value };
        textRepresentation = `My budget preference is ${event.value}`;
        break;
      case "duration":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, duration: event.value },
        }));
        deltaPayload = { duration: event.value };
        textRepresentation =
          event.value === 1
            ? "Planning for a 1-day trip"
            : `Planning for a ${event.value}-day trip`;
        break;
      case "interests":
        setTripState((prev) => ({
          ...prev,
          tripData: { ...prev.tripData, interests: event.value },
        }));
        deltaPayload = { interests: event.value };
        textRepresentation = event.value.join(", ");
        break;

      case "travelPreferences":
        setTripState((prev) => ({ ...prev, travelPreferences: event.value }));

        // 🔥 Separate Track: Package the preferences data payload
        deltaPayload = event.value;
        isPreferenceTrack = true;

        const p = event.value;
        const details: string[] = [];
        // 1. Core Profile Configurations
        if (p?.pace) details.push(`a ${p.pace} pace`);
        if (p?.travelStyle) details.push(`a ${p.travelStyle} travel style`);

        // 2. Arrays & Content Filters
        if (p?.priority && p.priority.length > 0) {
          details.push(`prioritizing ${p.priority.join(" & ")}`);
        }
        if (p?.dietaryRestrictions && p.dietaryRestrictions.length > 0) {
          details.push(
            `with dietary restrictions for ${p.dietaryRestrictions.join(" & ")}`,
          );
        }
        if (p?.avoidCategories && p.avoidCategories.length > 0) {
          details.push(
            `while completely avoiding ${p.avoidCategories.join(" & ")}`,
          );
        }

        // 3. Financial, Planning, and Climate Enums
        if (p?.spendingFlexibility) {
          details.push(`with a ${p.spendingFlexibility} budget flexibility`);
        }
        if (p?.planningStyle) {
          details.push(`preferring a ${p.planningStyle} planning style`);
        }
        if (p?.weatherPreference && p.weatherPreference !== "noPreference") {
          details.push(`preferring ${p.weatherPreference} weather`);
        }

        textRepresentation =
          details.length > 0
            ? `I'd prefer ${details.join(", ")}.`
            : "Saved my travel preferences.";
        break;
      case "final":
        /* * The FinalSummaryTicket gives us the complete * PlannerSubmission. * * This is the gateway into Phase 4B. * * DO NOT generate the itinerary here yet unless * your Phase 4B action already exists. */
        setTripState(event.value);
        handleFinalSubmission(event.value as GeneratorSubmission);

        // 3. PROGRESSION ADVANCEMENT: At this point, your layout can show a
        // cinematic loader, or your real-time listeners will automatically load Phase 5!
        console.log("🚀 Phase 4B Gateway Initialized Successfully!");
        return;
      default: /* * TypeScript should make this unreachable because * PlannerUIEvent is a discriminated union. */
        break;
    }

    // 🔥 To Fix the State Lifecycle Lock problem between UI Components and AI Conversation: Asynchronously synchronize the tracks/lanes without state-locking your engine!
    if (deltaPayload && Object.keys(deltaPayload).length > 0) {
      // 1. Instead of using startPlanning, run as a standard async operation to control each step sequence
      (async () => {
        // 🔥 Fire Asynchronous System Execution Pipeline where AI can fire trip or preference tracks
        try {
          // Now I have the options to track the transaction loading feedback on the UI via your transition hooks if needed,
          // or let it execute quietly in the background as an intentional express track!
          let res;

          if (isPreferenceTrack) {
            // Lane A: Fire preferences payload directly to the User Profile table
            res = await syncTravelPreferencesAction(
              deltaPayload as UserPreferences,
            );
          } else {
            // Lane B: Fire trip payload directly to the Trip table
            res = await syncUIPreference(
              tripId,
              deltaPayload as Partial<
                AITripPlanningResponse["updatedTripData"]
              >,
            );
          }

          if (!res.success) {
            setError(
              "Your choice was updated locally, but failed to sync to the server.",
            );
            return;
          }

          // 2. Clear any residual errors from previous errors
          setError(null);

          // 3. Trigger the conversaional engine to advance the AI conversation smoothly
          await sendToPlanner(textRepresentation);
        } catch (err) {
          // Handle a catastrophic network/runtime failure (e.g., server offline, timeout)
          console.error("Catastrophic UI synchronization failure:", err);
          setError(
            err instanceof Error
              ? `Network error: ${err.message}`
              : "A critical network error occurred while saving your choice.",
          );
        }
      })();
    }
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs animate-fade-in w-full h-screen">
        <TravelLoader />
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex flex-col">
      <MessageList
        messages={messages}
        tripState={tripState}
        onUISubmit={handleUISubmit}
      />

      <div className="px-4">
        {isPlanning && (
          <p className="text-base text-gray-400 font-medium animate-pulse mb-1">
            Planning your trip...
          </p>
        )}

        {error && (
          <p className="text-base text-red-600 font-semibold bg-red-50 p-2 rounded-md border border-red-200 mb-2">
            Error: {error}
          </p>
        )}
      </div>

      <ChatInput onSend={handleSend} isLoading={isPlanning} />
    </div>
  );
};

export default ChatBox;
