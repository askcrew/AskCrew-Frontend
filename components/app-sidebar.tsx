"use client";

import {
  IconBrandCinema4d,
  IconBrandOffice,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconVideo,
  IconMessageQuestion,
  IconPackage,
  IconHome,
  IconBriefcase,
  IconSchool,
} from "@tabler/icons-react";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import LinearGradientText from "./global/linear-gradient-text";
import Logo from "./global/logo";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/actions/auth";

const data = {

  content: [
    {
      name: "Movies",
      url: "/enterprise/dashboard/movies",
      icon: IconVideo,
    },
    {
      name: "Series",
      url: "/enterprise/dashboard/series",
      icon: IconBrandCinema4d,
    },
  ],
  management: [
    {
      title: "Jobs",
      icon: IconBriefcase,
      items: [
        {
          title: "My Jobs",
          url: "/enterprise/dashboard/jobs/my-jobs",
        },
        {
          title: "Apply to a Job",
          url: "/enterprise/dashboard/jobs/apply",
        },
        {
          title: "Applied Jobs",
          url: "/enterprise/dashboard/jobs/applied",
        },
      ],
    },
    {
      title: "Workshops",
      icon: IconSchool,
      items: [
        {
          title: "My Workshop",
          url: "/enterprise/dashboard/workshops/my-workshop",
        },
        {
          title: "Apply to a Workshop",
          url: "/enterprise/dashboard/workshops/apply",
        },
        {
          title: "Applied Workshops",
          url: "/enterprise/dashboard/workshops/applied",
        },
      ],
    },
    {
      title: "Rentals",
      icon: IconPackage,
      items: [
        {
          title: "Rent Products",
          url: "/enterprise/dashboard/rentals/rent",
        },
        {
          title: "My Requests",
          url: "/enterprise/dashboard/rentals/my-requests",
        },
        {
          title: "My Products",
          url: "/enterprise/dashboard/rentals/my-products",
        },
      ],
    },
  ],
  community: {
    title: "Community",
    icon: IconMessageQuestion,
    items: [
      {
        title: "Community Questions",
        url: "/enterprise/dashboard/community/questions",
      },
      {
        title: "My Questions",
        url: "/enterprise/dashboard/community/my-questions",
      },
    ],
  },
  talents: {
    name: "Find Talents",
    url: "/enterprise/dashboard/talents",
    icon: IconUsers,
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeUrl, setActiveUrl] = React.useState("");

  const { data: userProfileResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const userData = userProfileResponse?.success
    ? userProfileResponse.data
    : null;

  React.useEffect(() => {
    setActiveUrl(window.location.pathname);
  }, []);

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border-r border-border/40 bg-sidebar shadow-sm"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-border/40 bg-linear-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-orange-500/10 transition-colors"
            >
              <Link href="/enterprise/dashboard">
                <Logo />
                <LinearGradientText className="text-base font-semibold">
                  Ask Crew
                </LinearGradientText>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="gap-0 px-2 py-4">
        {/* Dashboard Home */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeUrl === "/enterprise/dashboard"}
                  className={cn(
                    "hover:bg-orange-500/10 transition-colors",
                    activeUrl === "/enterprise/dashboard" &&
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium"
                  )}
                >
                  <Link href="/enterprise/dashboard">
                    <IconHome className="size-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Section */}
        {userData && userData?.profile?.specification?.includes("producer") && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Content
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {data.content.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeUrl.startsWith(item.url)}
                      className={cn(
                        "hover:bg-orange-500/10 transition-colors",
                        activeUrl.startsWith(item.url) &&
                          "bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {data.management.map((section) => (
                <Collapsible
                  key={section.title}
                  defaultOpen={section.items.some((item) =>
                    activeUrl.includes(item.url)
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "hover:bg-purple-500/10 transition-colors",
                          section.items.some((item) =>
                            activeUrl.includes(item.url)
                          ) && "bg-purple-500/10"
                        )}
                      >
                        <section.icon className="size-4" />
                        <span className="font-medium">{section.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-0 border-l-0 px-0">
                        {section.items.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={activeUrl === item.url}
                              className={cn(
                                "hover:bg-purple-500/10 transition-colors pl-8",
                                activeUrl === item.url &&
                                  "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium"
                              )}
                            >
                              <Link href={item.url}>
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Community
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                defaultOpen={data.community.items.some((item) =>
                  activeUrl.includes(item.url)
                )}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "hover:bg-pink-500/10 transition-colors",
                        data.community.items.some((item) =>
                          activeUrl.includes(item.url)
                        ) && "bg-pink-500/10"
                      )}
                    >
                      <data.community.icon className="size-4" />
                      <span className="font-medium">
                        {data.community.title}
                      </span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-0 border-l-0 px-0">
                      {data.community.items.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={activeUrl === item.url}
                            className={cn(
                              "hover:bg-pink-500/10 transition-colors pl-8",
                              activeUrl === item.url &&
                                "bg-pink-500/20 text-pink-600 dark:text-pink-400 font-medium"
                            )}
                          >
                            <Link href={item.url}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Talents */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeUrl.startsWith(data.talents.url)}
                  className={cn(
                    "hover:bg-orange-500/10 transition-colors",
                    activeUrl.startsWith(data.talents.url) &&
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium"
                  )}
                >
                  <Link href={data.talents.url}>
                    <data.talents.icon className="size-4" />
                    <span>{data.talents.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeUrl === "/profile/details"}
                  className={cn(
                    "hover:bg-orange-500/10 transition-colors",
                    activeUrl === "/profile/details" &&
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium"
                  )}
                >
                  <Link href="/profile/details">
                    <IconSettings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/40 bg-linear-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
