import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ChatList } from "./chat-list";
import { ChatSearch } from "./chat-search";

export function ChatSidebar() {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r bg-[#f4f0eb]! md:w-80 w-full"
    >
      <SidebarHeader className="h-16 bg-[#edeae6] border-b border-sidebar-border px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Messages
        </h2>
      </SidebarHeader>
      <div className="py-2 bg-[#edeae6]">
        <ChatSearch />
      </div>
      <SidebarContent className="custom-scrollbar bg-[#edeae6]">
        <ChatList />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
