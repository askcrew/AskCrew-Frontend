"use client";

import {
  IconBriefcase,
  IconPackage,
  IconSchool,
  IconSettings,
  IconUsers,
  IconVideo,
  IconBrandCinema4d,
  IconMessageQuestion,
  IconHome,
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
} from "@/components/ui/sidebar";
import LinearGradientText from "./global/linear-gradient-text";
import Logo from "./global/logo";
import { cn } from "@/lib/utils";
import { getCurrentUserProfile } from "@/lib/actions/auth";
import { LoginResponse } from "@/Schemas/auth/login";

const data = {
  opportunities: [
    {
      title: "Jobs",
      icon: IconBriefcase,
      items: [
        {
          title: "Browse Jobs",
          url: "/student/dashboard/jobs/apply",
        },
        {
          title: "My Applications",
          url: "/student/dashboard/jobs/applied",
        },
      ],
    },
    {
      title: "Workshops",
      icon: IconSchool,
      items: [
        {
          title: "Browse Workshops",
          url: "/student/dashboard/workshops/apply",
        },
        {
          title: "My Applications",
          url: "/student/dashboard/workshops/applied",
        },
      ],
    },
    {
      title: "Rentals",
      icon: IconPackage,
      items: [
        {
          title: "Browse Products",
          url: "/student/dashboard/rentals/rent",
        },
        {
          title: "My Requests",
          url: "/student/dashboard/rentals/my-requests",
        },
      ],
    },
  ],
  content: [
    {
      name: "Movies",
      url: "/student/dashboard/movies",
      icon: IconVideo,
    },
    {
      name: "Series",
      url: "/student/dashboard/series",
      icon: IconBrandCinema4d,
    },
  ],
  discover: [
    {
      name: "Find Talents",
      url: "/student/dashboard/talents",
      icon: IconUsers,
    },
    {
      name: "Community",
      url: "/student/dashboard/community",
      icon: IconMessageQuestion,
    },
    {
      name: "My Questions",
      url: "/student/dashboard/community/my-questions",
      icon: IconMessageQuestion,
    },
  ],
};

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeUrl, setActiveUrl] = React.useState("");

  const { data: userProfileResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const userData = userProfileResponse?.success
    ? userProfileResponse.data
    : null;

  const user = (userData || {
    fullname: "Student User",
    email: "student@example.com",
    profile_photo: "/avatars/student.jpg",
  }) as LoginResponse["user"];

  React.useEffect(() => {
    setActiveUrl(window.location.pathname);
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props} className=" bg-sidebar">
      {/* Header */}
      <SidebarHeader className="border-b border-border/40 bg-linear-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-orange-500/10 transition-colors"
            >
              <Link href="/student/dashboard">
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
                  isActive={activeUrl === "/student/dashboard"}
                  className={cn(
                    "hover:bg-orange-500/10 transition-colors",
                    activeUrl === "/student/dashboard" &&
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400",
                  )}
                >
                  <Link href="/student/dashboard">
                    <IconHome className="size-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Opportunities Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider px-2">
            Opportunities
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {data.opportunities.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    <section.icon className="size-4" />
                    <span>{section.title}</span>
                  </div>
                  <div className="ml-6 space-y-0.5">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeUrl === item.url}
                          className={cn(
                            "hover:bg-purple-500/10 transition-colors text-sm",
                            activeUrl === item.url &&
                              "bg-purple-500/20 text-purple-600 dark:text-purple-400",
                          )}
                        >
                          <Link href={item.url}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Discover Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider px-2">
            Discover
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {data.discover.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeUrl === item.url}
                    className={cn(
                      "hover:bg-pink-500/10 transition-colors",
                      activeUrl === item.url &&
                        "bg-pink-500/20 text-pink-600 dark:text-pink-400",
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
                      "bg-orange-500/20 text-orange-600 dark:text-orange-400",
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
