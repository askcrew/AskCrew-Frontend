import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <ChatSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col overflow-hidden bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
