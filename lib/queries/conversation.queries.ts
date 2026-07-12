"use server";

import { prisma } from "../db";
import { requireUser } from "@/auth";

export async function getConversation(conversationId: string) {
  const user = await requireUser();

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId: user.id,
    },

    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },

      trip: true,
    },
  });

  return conversation;
}

export async function getUserConversations() {
  const user = await requireUser();

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: user.id,
    },

    include: {
      trip: true,
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations;
}
