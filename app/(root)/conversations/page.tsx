import DeleteConversationButton from "@/components/conversations/DeleteConversationButton";
import { getUserConversations } from "@/lib/queries/conversation.queries";
import Link from "next/link";
import { notFound } from "next/navigation";

const ConversationsPage = async () => {
  const conversations = await getUserConversations();

  if (!conversations) {
    console.error("Can't find user conversations");
    return notFound();
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Chats</h1>

      <div className="mt-5">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="border rounded-xl p-5 mb-3">
            <Link href={`/conversations/${conversation.id}`}>
              <p>Conversation {conversation.id}</p>
              <p>{conversation.trip.title}</p>
            </Link>

            <DeleteConversationButton
              conversationId={conversation.id}
              tripId={conversation.tripId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsPage;
