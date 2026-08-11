"use client";

import MessageBubble from "./MessageBubble";
import { MessageListProps } from "@/types/global";

const MessageList = ({ messages, tripState, onUISubmit }: MessageListProps) => {
  return (
    <section className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          {...message}
          tripState={tripState}
          onUISubmit={onUISubmit}
        />
      ))}
    </section>
  );
};

export default MessageList;
