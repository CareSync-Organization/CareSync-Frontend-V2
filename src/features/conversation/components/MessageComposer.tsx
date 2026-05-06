import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/shared/ActionButton";

type MessageComposerProps = {
  onSend: (message: string) => void;
};

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-card p-3">
      <Input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your message..."
        className="h-11"
      />

      <ActionButton
        type="submit"
        endIcon={<SendHorizontal className="size-4" />}
      >
        Send
      </ActionButton>
    </form>
  );
}
