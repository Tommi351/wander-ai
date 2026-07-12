import MessageBubble from "./MessageBubble";
import { ConversationMessage } from "@/types/global";

const MessageList = ({ messages }: { messages: ConversationMessage[] }) => {
  return (
    <section className="flex-1 overflow-y-auto p-4">
      {messages.map((m) => (
        <MessageBubble key={m.id} {...m} />
      ))}
    </section>
  );
};

export default MessageList;
