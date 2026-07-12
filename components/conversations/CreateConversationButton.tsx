"use client";

import { createConversation } from "@/lib/actions/conversation.action";
import { useRouter } from "next/navigation";

const CreateConversationButton = () => {
  const router = useRouter();

  const handleCreate = async () => {
    const result = await createConversation();

    if (!result.success || !result.data) {
      console.log(result.error);
      return;
    }

    router.push(`/conversations/${result.data.id}`);
  };

  return (
    <button
      onClick={handleCreate}
      className="rounded-lg bg-black text-white px-5 py-3"
    >
      Start Planning
    </button>
  );
};

export default CreateConversationButton;
