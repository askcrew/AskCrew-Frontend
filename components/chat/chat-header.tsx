import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MoreVertical, Phone, Video } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  status: "online" | "offline";
  avatarUrl?: string;
}

export function ChatHeader({ name, status, avatarUrl }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b-orange-100/20">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Avatar className="h-10 w-10 border-2 border-orange-100 ring-2 ring-purple-100">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-linear-to-br from-orange-100 to-purple-100 text-purple-700">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm leading-none text-foreground">
            {name}
          </h3>
          <span className="text-xs text-muted-foreground capitalize mt-1 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === "online" ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            {status}
          </span>
        </div>
      </div>
      {/* <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-orange-500 hover:bg-orange-50"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-purple-500 hover:bg-purple-50"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div> */}
    </div>
  );
}
