import ChatBox from "@/components/conversations/ChatBox";
import { getConversation } from "@/lib/queries/conversation.queries";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ConversationDetails = async ({ params }: Props) => {
  const { id } = await params;

  const conversation = await getConversation(id);
  if (!conversation) {
    console.error("Can't find user conversations");
    return notFound();
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10">
      {" "}
      <div>
        {" "}
        <ChatBox
          conversationId={conversation.id}
          initialMessages={conversation.messages}
        />{" "}
      </div>{" "}
      <div>
        {" "}
        {conversation.trip ? (
          <div>Trip Preview Here</div>
        ) : (
          <div>AI will generate itinerary here</div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default ConversationDetails;
