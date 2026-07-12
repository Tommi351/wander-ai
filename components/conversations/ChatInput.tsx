import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

const ChatInput = ({
  onSend,
  isLoading,
}: {
  onSend: (value: string) => void;
  isLoading: boolean;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSend(value);
    setValue("");
  };
  return (
    <section>
      <div>
        <div className="rounded-3xl border p-4 shadow relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Create a trip for Paris from New York"
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
          />
          <Button
            size={"icon"}
            className="absolute bottom-6 right-6"
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
          >
            <Send className="h-4 w-4 " />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChatInput;
