"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function NavCommunity({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  };
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Community</SidebarGroupLabel>
      <SidebarMenu>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="community" className="border-none">
            <SidebarMenuItem>
              <AccordionTrigger className="hover:no-underline p-0 w-full [&[data-state=open]>div]:bg-sidebar-accent [&[data-state=open]>div]:text-sidebar-accent-foreground">
                <SidebarMenuButton
                  variant="orange"
                  className="w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  asChild
                >
                  <div className="flex items-center w-full">
                    {items.icon && (
                      <items.icon className="size-4 shrink-0 mr-2" />
                    )}
                    <span className="flex-1 text-left">{items.title}</span>
                  </div>
                </SidebarMenuButton>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <SidebarMenuSub>
                  {items.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuButton
                        variant="orange"
                        isActive={pathname?.includes(subItem.url)}
                        asChild
                        className="pl-8"
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </AccordionContent>
            </SidebarMenuItem>
          </AccordionItem>
        </Accordion>
      </SidebarMenu>
    </SidebarGroup>
  );
}
