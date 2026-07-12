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
          <Link
            key={conversation.id}
            href={`/conversations/${conversation.id}`}
          >
            <div className="border rounded-xl p-5 mb-3">
              <p>Conversation {conversation.id}</p>

              {conversation.trip ? (
                <p>{conversation.trip.title}</p>
              ) : (
                <p>New Trip Planning</p>
              )}
            </div>

            <DeleteConversationButton
              conversationId={conversation.id}
              tripId={conversation.tripId ?? ""}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ConversationsPage;
