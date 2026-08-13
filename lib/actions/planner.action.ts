"use server";

import { prisma } from "../db";
import { getConversation } from "../queries/conversation.queries";
import { createMessage } from "./message.action";
import { plannerService, updateTripFromPlannerResponse } from "../ai/planner";
import { toTripPlanningState } from "../mappers/trip.mapper";
import { toUserPreferences } from "../mappers/user.mapper";
import { PlannerActionResult } from "@/types/global";
import { type UserPreferences } from "../validations";

export const plannerAction = async (
  conversationId: string,
  content: string,
): Promise<PlannerActionResult> => {
  let savedUserMessage = null;
  try {
    // Save user message (Fast DB call)
    const saved = await createMessage(conversationId, { content });
    if (!saved.success || !saved.data) {
      return {
        success: false,
        savedUserMessage: null,
        assistantMessage: null,
        error: "Unable to save user messages",
      };
    }

    savedUserMessage = saved.data.message;

    // 2. Fetch context for the AI (Fast DB call)
    const userConversations = await getConversation(conversationId);
    if (!userConversations) {
      return {
        success: false,
        savedUserMessage,
        assistantMessage: null,
        error: "Unable to fetch user conversation",
      };
    }

    const conversationHistory = userConversations.messages.map((message) => ({
      role: message.role === "USER" ? "user" : "assistant",
      content: message.content,
    }));

    const currentTripState = toTripPlanningState(userConversations.trip);

    const userPreferences = toUserPreferences(
      userConversations.user.preferences,
    );

    // 3. The SLOW network call (Kept completely OUTSIDE the transaction)
    const plannerResponse = await plannerService({
      conversationHistory: conversationHistory,
      currentTripState: currentTripState,
      userPreferences: userPreferences as UserPreferences,
    });

    const tripId = userConversations.trip.id;

    // 4. Group remaining DB writes into a fast, atomized Transaction
    const assistantMessage = await prisma.$transaction(async (tx) => {
      // Save assistant message using the transaction client 'tx'
      const message = await tx.message.create({
        data: {
          conversationId,
          role: "ASSISTANT",
          content: plannerResponse.message,
          metadata: {
            ui: {
              type: plannerResponse.ui.type,
            },
          },
        },
        select: {
          id: true,
          conversationId: true,
          role: true,
          content: true,
          createdAt: true,
          metadata: true,
        },
      });

      // Update trip conditionally inside the same transaction block
      if (plannerResponse.updatedTripData) {
        // Pass them as two separate arguments, not inside an object
        await updateTripFromPlannerResponse(
          tx,
          tripId,
          plannerResponse.updatedTripData,
        );
      }

      return message;
    });

    if (plannerResponse.isComplete) {
      // Move to Phase 4B: Itinerary Generation
    }

    return {
      success: true,
      ...plannerResponse,
      savedUserMessage,
      assistantMessage,
    };
  } catch (err) {
    console.error("Unable to plan trip:", err);
    return {
      success: false,
      savedUserMessage,
      assistantMessage: null,
      error: "Trip planning failed",
    };
  }
};
