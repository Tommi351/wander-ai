"use server";

import { prisma } from "../db";
import {
  CreateMessageSchema,
  CreateMessageFormInput, // The raw input type (with strings)
} from "../validations";
import { requireUser } from "@/auth";

export const createMessage = async (
  conversationId: string,
  input: CreateMessageFormInput,
) => {
  const user = await requireUser();

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      userId: user.id,
    },
  });

  if (!existingConversation) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const data = CreateMessageSchema.parse(input);

    const message = await prisma.message.create({
      data: {
        conversationId,
        role: "USER",
        content: data.content,
      },

      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return { success: true, data: message };
  } catch (err) {
    console.error("Critical: Failed to create message:", err);
    return { success: false, error: "Failed to create user messages" };
  }
};
