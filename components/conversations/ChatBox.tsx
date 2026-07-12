"use client";

import { useState, useTransition } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { ConversationMessage } from "@/types/global";
import { createMessage } from "@/lib/actions/message.action";

const ChatBox = ({
  initialMessages,
  conversationId,
}: {
  initialMessages: ConversationMessage[];
  conversationId: string;
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    setError(null);

    // 1. Create optimistic message
    const tempId = crypto.randomUUID();

    const tempMessage: ConversationMessage = {
      id: tempId,
      conversationId: conversationId,
      role: "USER",
      content,
      createdAt: new Date(),
    };

    // 2. Add optimistic message immediately
    setMessages((prev) => [...prev, tempMessage]);

    startTransition(async () => {
      // 3. Call server
      const result = await createMessage(conversationId, { content });

      // 4. Handle failure (rollback optimistic message)
      // Add a check to make sure result.data actually exists too!
      if (!result.success || !result.data) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(result.error || "Failed to send message");
        return;
      }

      // 5. Replace optimistic message with real DB message
      const realMessage = result.data; // TypeScript now knows 100% this is NOT undefined!

      setMessages(
        (prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...realMessage, conversationId } : m,
          ), // ✅ Now this works perfectly!
      );
    });
  };

  return (
    <div className="h-[90vh] flex flex-col">
      <MessageList messages={messages} />

      {/* Floating or Inline indicators look much cleaner */}
      <div className="px-4">
        {isPending && (
          <p className="text-xs text-gray-400 font-medium animate-pulse mb-1">
            Sending message...
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-md border border-red-200 mb-2">
            Error: {error}
          </p>
        )}
      </div>

      <ChatInput onSend={handleSend} isLoading={isPending} />
    </div>
  );
};

export default ChatBox;
