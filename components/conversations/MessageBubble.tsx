import { ConversationMessage } from "@/types/global";

const MessageBubble = ({ role, content }: ConversationMessage) => {
  const isUser = role === "USER";

  return (
    <div className={`flex mt-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-lg px-4 py-2 rounded-lg ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
