import { ConversationMessage, PlannerMessageMetadata } from "@/types/global";
import { Prisma } from "../generated/prisma";
import { PlannerMessageMetadataSchema } from "../validations";

export function toConversationMessage(
  message: Prisma.MessageGetPayload<{
    select: {
      id: true;
      conversationId: true;
      role: true;
      content: true;
      createdAt: true;
      metadata: true;
    };
  }>,
): ConversationMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    metadata: toPlannerMessageMetadata(message.metadata),
  };
}

export function toPlannerMessageMetadata(
  metadata: Prisma.JsonValue | null,
): PlannerMessageMetadata | null {
  if (metadata === null) return null;

  const result = PlannerMessageMetadataSchema.safeParse(metadata);

  return result.success ? result.data : null;
}
