import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatSearch() {
  return (
    <div className="relative px-2 py-2">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search chats..."
        className="h-9 w-full rounded-md bg-sidebar-accent pl-9 text-sm outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
      />
    </div>
  );
}
