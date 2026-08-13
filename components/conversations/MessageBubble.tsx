"use client";

import { MessageBubbleProps } from "@/types/global";
import PlannerUIRenderer from "../planner/PlannerUIRenderer";

const MessageBubble = ({
  message,
  onUISubmit,
  tripState,
}: MessageBubbleProps) => {
  const uiType = message.metadata?.ui?.type;
  const isUser = message.role === "USER";

  return (
    <div className={`flex mt-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-lg px-4 py-2 rounded-lg ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {message.content}

        {uiType && (
          <div className="w-full max-w-[80%] bg-white border border-slate-200/80 rounded-2xl p-3 shadow-md shadow-slate-100/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <PlannerUIRenderer
              type={uiType}
              data={tripState}
              onSubmit={onUISubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
