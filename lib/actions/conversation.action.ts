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

      // 2. Trip? Yes -> Delete Trip (and cascade versions)
      if (conversation.tripId) {
        // If your schema doesn't have onDelete: Cascade, keep this deleteMany line.
        // Otherwise, you can completely remove this deleteMany block.
        await tx.tripVersion.deleteMany({
          where: {
            tripId: conversation.tripId, // Use the verified ID from the DB
          },
        });

        // Delete the parent Trip safely
        await tx.trip.delete({
          where: {
            id: conversation.tripId,
            userId: user.id,
          },
        });
      }

      // 3. Trip? No (or after Trip is deleted) -> Delete Conversation
      await tx.conversation.delete({
        where: {
          id: conversation.id,
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
