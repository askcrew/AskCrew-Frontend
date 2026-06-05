import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isSender: boolean;
  avatarUrl?: string;
}

export function MessageBubble({
  content,
  timestamp,
  isSender,
  avatarUrl,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 mb-4",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isSender ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            isSender
              ? "bg-linear-to-br from-orange-500 to-purple-600 text-white border-none rounded-br-none" // Gradient for sender
              : "bg-muted text-foreground rounded-bl-none border border-border/50" // Gray/Muted for receiver
          )}
        >
          {content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {format(timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
}
