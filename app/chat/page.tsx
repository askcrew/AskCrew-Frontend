import { MessageSquare } from "lucide-react";

export default function ChatEmptyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background text-muted-foreground">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
        <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        Select a conversation
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs text-center mt-2">
        Choose a chat from the sidebar to start messaging or search for a new
        connection.
      </p>
    </div>
  );
}
