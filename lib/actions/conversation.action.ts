"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { requireUser } from "@/auth";
import { createTrip } from "./trip.action";

export async function createConversation() {
  const user = await requireUser();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const trip = await createTrip(tx, user.id);

      const conversation = await tx.conversation.create({
        data: {
          userId: user.id,
          tripId: trip.id,
        },
      });

      return {
        conversation,
        trip,
      };
    });

    revalidatePath("/conversations");

    return { success: true, data: result };
  } catch (err) {
    console.error("Critical: Failed to create conversation:", err);
    return { success: false, error: "Failed to create user conversations" };
  }
}

export const deleteConversation = async (
  conversationId: string,
  // Note: You don't actually need tripId as an argument anymore,
  // because we extract the verified tripId directly from the conversation record.
) => {
  const user = await requireUser();

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Find Conversation (Verifies ownership)
      const conversation = await tx.conversation.findFirst({
        where: {
          id: conversationId,
          userId: user.id,
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Delete the Trip safely
      // Database cascades remove:
      // - Conversation
      // - Messages
      // - TripVersions
      await tx.trip.delete({
        where: {
          id: conversation.tripId,
          userId: user.id,
        },
      });
    });

    revalidatePath("/conversations");

    return { success: true, message: "Conversation successfully deleted" };
  } catch (err) {
    console.error(
      `Critical: Failed to delete conversation ID ${conversationId}:`,
      err,
    );
    return { success: false, error: "Failed to delete user conversation" };
  }
};
