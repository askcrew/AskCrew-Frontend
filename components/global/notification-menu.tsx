"use client";

import { useMemo } from "react";
import {
  Bell,
  ExternalLink,
  Mail,
  MessageSquare,
  CreditCard,
  Clock,
  CheckCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useNotificationStream,
} from "@/lib/queries/notifications";
import { Notification } from "@/types/notifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/lib/actions/auth";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "payment":
      return <CreditCard className="w-4 h-4 text-emerald-500" />;
    case "message":
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    default:
      return <Mail className="w-4 h-4 text-orange-500" />;
  }
};

export function NotificationMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize dynamic SSE stream
  useNotificationStream();

  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const { data: userProfileResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
  });
  const isEnterprise = userProfileResponse?.data?.type === "enterprise";

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead.mutateAsync(notification.id);
      // Manually update cache for immediate UI feedback
      queryClient.setQueryData(
        ["notifications"],
        (old: Notification[] | undefined) => {
          if (!old) return old;
          return old.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n,
          );
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    }

    if (notification.metadata?.content_id) {
      router.push(`/movie/${notification.metadata.content_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead.mutateAsync();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({
      queryKey: ["notifications", "unread-count"],
    });
  };

  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [notifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-orange-500/10 rounded-full transition-all duration-300"
        >
          <Bell className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-[1.2rem] bg-orange-500 text-white text-[10px] font-bold border-2 border-background flex items-center justify-center rounded-full animate-in zoom-in duration-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-500 hover:bg-orange-5100/20 border-none text-[10px]"
              >
                {unreadCount} New
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-8 text-[11px] font-semibold text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 group px-2"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1 group-hover:scale-110 transition-transform" />
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[420px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
              <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 font-medium">
                Loading notifications...
              </p>
            </div>
          ) : sortedNotifications.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "relative flex gap-4 p-4 cursor-pointer transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 group",
                    !notification.is_read && "bg-orange-500/5",
                  )}
                >
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
                  )}

                  <div
                    className={cn(
                      "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      notification.is_read
                        ? "bg-zinc-100 dark:bg-zinc-900"
                        : "bg-orange-500/10",
                    )}
                  >
                    <NotificationIcon type={notification.notification_type} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight transition-colors",
                          notification.is_read
                            ? "text-zinc-600 dark:text-zinc-400"
                            : "font-bold text-zinc-900 dark:text-zinc-100",
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-zinc-400 flex items-center font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          { addSuffix: true },
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>

                    {notification.metadata?.content_id && (
                      <div className="mt-2 flex items-center text-[10px] font-bold text-orange-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View Movie <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] px-8 text-center">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                No notifications yet
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                We&apos;ll let you know when something important happens.
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/30">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(
                isEnterprise
                  ? "/enterprise/dashboard/notifications"
                  : "/student/dashboard/notifications",
              )
            }
            className="w-full h-9 text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors rounded-xl"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
