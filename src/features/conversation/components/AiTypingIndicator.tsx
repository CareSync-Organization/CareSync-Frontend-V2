import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const WORDS = [
  "Analyzing",
  "Thinking",
  "Searching knowledge base",
  "Reviewing context",
  "Composing reply",
  "Checking inventory",
  "Looking up order",
  "Processing",
];

const WORD_DURATION_MS = 1250;
const FADE_DURATION_MS = 180;

export function AiTypingIndicator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setFading(false);
      }, FADE_DURATION_MS);
    }, WORD_DURATION_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("flex justify-end", className)}>
      <div className="flex min-w-52 items-center gap-2.5 rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-2.5 text-sm text-primary">
        <span
          className="flex-1 transition-opacity"
          style={{
            opacity: fading ? 0 : 1,
            transitionDuration: `${FADE_DURATION_MS}ms`,
          }}
        >
          {WORDS[index]}
        </span>
        <span className="flex shrink-0 gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
