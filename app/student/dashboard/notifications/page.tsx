"use client";

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/lib/queries/notifications";
import {
  Bell,
  CheckCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  Info,
  MoreVertical,
  Trash2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "payment":
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
          <CreditCard size={20} />
        </div>
      );
    case "message":
      return (
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
          <MessageSquare size={20} />
        </div>
      );
    case "event":
      return (
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
          <Calendar size={20} />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
          <Info size={20} />
        </div>
      );
  }
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const handleMarkRead = (id: number) => {
    markAsRead.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white lg:text-4xl flex items-center gap-3">
            Notifications
            <Badge
              variant="secondary"
              className="bg-orange-500/10 text-orange-600 border-none font-bold"
            >
              {notifications?.filter((n) => !n.is_read).length || 0} New
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activities, messages, and system
            alerts.
          </p>
        </div>
        {notifications &&
          notifications.filter((n) => !n.is_read).length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="rounded-xl border-orange-500/20 text-orange-600 hover:bg-orange-500/5 font-bold"
            >
              <CheckCheck className="mr-2 size-4" />
              Mark all as read
            </Button>
          )}
      </div>

      <div className="grid gap-4">
        {notifications && notifications.length > 0 ? (
          notifications
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "relative transition-all duration-300 border-0 shadow-sm hover:shadow-md group overflow-hidden",
                  !notification.is_read
                    ? "bg-orange-500/[0.03] dark:bg-orange-500/[0.05] ring-1 ring-orange-500/20"
                    : "bg-white dark:bg-zinc-900",
                )}
              >
                {!notification.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                )}
                <CardContent className="p-4 md:p-6 flex gap-4 md:gap-6 items-start">
                  <NotificationIcon type={notification.notification_type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={cn(
                            "text-sm md:text-base font-bold transition-colors",
                            !notification.is_read
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-gray-900 dark:text-white",
                          )}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center font-medium">
                            <Clock className="size-3 mr-1" />
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true },
                            )}
                          </span>
                          {!notification.is_read && (
                            <Badge
                              variant="default"
                              className="bg-orange-500 uppercase text-[9px] font-black h-4 px-1 leading-none"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-zinc-200 dark:border-zinc-800"
                        >
                          {!notification.is_read && (
                            <DropdownMenuItem
                              onClick={() => handleMarkRead(notification.id)}
                              className="font-bold flex items-center gap-2"
                            >
                              <CheckCheck size={16} />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive font-bold flex items-center gap-2 focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 size={16} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-[80%]">
                      {notification.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent text-center py-20 rounded-3xl">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Bell size={40} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  You have no new notifications at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
