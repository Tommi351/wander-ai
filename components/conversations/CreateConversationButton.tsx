"use client";

import { createConversation } from "@/lib/actions/conversation.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateConversationButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    const result = await createConversation();

    if (!result.success || !result.data) {
      setError(result.error || "Failed to create conversation");
      setIsLoading(false);
      return;
    }

    router.push(`/conversations/${result.data.conversation.id}`);
  };

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="rounded-lg bg-black text-white px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating..." : "Start Planning"}
      </button>
    </div>
  );
};

export default CreateConversationButton;
