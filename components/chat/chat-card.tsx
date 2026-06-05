import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import LinearGradientText from "../global/linear-gradient-text";

interface ChatCardProps {
  name: string;
  message: string;
  avatar?: string;
  time: string;
  isActive?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function ChatCard({
  name,
  message,
  avatar,
  time,
  isActive,
  unreadCount,
  onClick,
}: ChatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-sidebar-accent/50 relative overflow-hidden",
        isActive &&
          "bg-linear-to-r from-orange-50/50 to-purple-50/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-orange-500"
      )}
    >
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <LinearGradientText className="truncate text-sm font-medium">
            {name}
          </LinearGradientText>
          <span className="text-xs text-primary">{time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">
            {message}
          </span>
          {unreadCount && unreadCount > 0 && (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
