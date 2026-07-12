"use client";

import { useState, useTransition } from "react";
import { deleteConversation } from "@/lib/actions/conversation.action";

interface DeleteConversationButtonProps {
  conversationId: string;
  tripId: string;
  onSuccess?: () => void; // Optional callback to refresh the UI or redirect
}

export default function DeleteConversationButton({
  conversationId,
  onSuccess,
}: DeleteConversationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent) => {
    // Stop the click from opening the link
    e.preventDefault();
    e.stopPropagation();

    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteConversation(conversationId);

        if (result.success) {
          setShowConfirm(false);
          if (onSuccess) onSuccess();
        } else {
          setError(result.error || "Something went wrong");
        }
      } catch (err) {
        setError(`A network error occurred ${err}. Please try again.`);
      }
    });
  };

  if (showConfirm) {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex flex-col gap-2 p-2 border border-red-200 bg-red-50 rounded-lg max-w-xs"
      >
        <p className="text-xs text-red-700 font-medium">
          Are you sure? This deletes the chat and the associated trip.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowConfirm(false);
            }}
            disabled={isPending}
            className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
        {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(true);
      }}
      className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors"
      title="Delete conversation"
    >
      {/* Simple Trash Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>
  );
}
