import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/shared/ActionButton";

type MessageComposerProps = {
  onSend: (message: string) => void;
  isSending?: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

export function MessageComposer({
  onSend,
  isSending = false,
  disabled = false,
  disabledReason = "Messaging is disabled.",
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const isComposerDisabled = disabled || isSending;

  useEffect(() => {
    if (disabled) setMessage("");
  }, [disabled]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isComposerDisabled) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-card p-3">
      <Input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={disabled ? disabledReason : "Type your message..."}
        className="h-11"
        disabled={isComposerDisabled}
      />
      <ActionButton
        type="submit"
        isLoading={isSending}
        disabled={isComposerDisabled}
        endIcon={<SendHorizontal className="size-4" />}
      >
        Send
      </ActionButton>
    </form>
  );
}
