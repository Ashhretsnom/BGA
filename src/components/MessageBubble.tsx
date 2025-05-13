import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const MessageBubble = ({
  message,
  isUser = false,
  timestamp,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none",
        )}
      >
        <div className="whitespace-pre-wrap">{message}</div>
        {timestamp && (
          <div
            className={cn(
              "text-xs mt-1 text-right",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
