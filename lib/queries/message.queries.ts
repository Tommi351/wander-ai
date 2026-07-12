"use server";

import { prisma } from "../db";
import { requireUser } from "@/auth";

export async function getMessagesByConversation(conversationId: string) {
  const user = await requireUser();

  // 1. Verify conversation belongs to user
  const existingConversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingConversation) {
    return {
      success: false,
      error: "Unauthorized or Conversation not Found",
    };
  }

  try {
    // 2. Fetch messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc", // CRITICAL for chat UI
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return messages;
  } catch (err) {
    console.error("Failed to fetch messages:", err);

    return {
      success: false,
      error: "Failed to fetch messages",
    };
  }
}
