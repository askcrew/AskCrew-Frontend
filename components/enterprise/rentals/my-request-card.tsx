"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconCalendar,
  IconCurrencyDollar,
  IconClock,
  IconMessage,
  IconPackage,
} from "@tabler/icons-react";
import { ApiRentalRequest, RentalRequest } from "./products-data-table/schema";
import { useCreateChat } from "@/hooks/use-create-chat";

interface MyRequestCardProps {
  request: ApiRentalRequest;
}

export function MyRequestCard({ request }: MyRequestCardProps) {
  const createChat = useCreateChat();

  const statusConfig = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    },
    approved: {
      label: "Approved",
      className:
        "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
    },
    rejected: {
      label: "Rejected",
      className:
        "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
    },
    completed: {
      label: "Completed",
      className:
        "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
    },
    cancelled: {
      label: "Cancelled",
      className:
        "bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400",
    },
  };

  const config = statusConfig[request.status as keyof typeof statusConfig];

  const handleChatWithOwner = () => {
    // Create or get chat room with the product owner
    createChat.mutate(request.user);
  };

  return (
    <Card className="group relative overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

      <CardHeader className="relative space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <IconPackage className="size-5 text-orange-500" />
              <h3 className="font-bold text-lg text-foreground line-clamp-1">
                {request.item_name}
              </h3>
            </div>
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 pb-4">
        {/* Rental Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <div>
              <p className="font-medium text-foreground">Start Date</p>
              <p>{new Date(request.start_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <div>
              <p className="font-medium text-foreground">End Date</p>
              <p>{new Date(request.end_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconClock className="size-4" />
            {/* <div>
              <p className="font-medium text-foreground">Duration</p>
              <p>
                {request.} {request.durationType}
              </p>
            </div> */}
          </div>
          {/* <div className="flex items-center gap-2 text-muted-foreground">
            <IconCurrencyDollar className="size-4" />
            <div>
              <p className="font-medium text-foreground">Total Price</p>
              <p className="font-semibold text-orange-600">
                ${request.}
              </p>
            </div>
          </div> */}
        </div>

        {/* Owner Info */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Product Owner</p>
          <div className="flex items-center gap-2">
            <Avatar className="size-8 border-2 border-orange-500/20">
              <AvatarImage
                src={request.user_photo ?? undefined}
                alt={request.user_fullname}
              />
              <AvatarFallback className="bg-orange-500/10 text-orange-600 text-xs font-semibold">
                {request.user_fullname
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {request.item_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {request.user_email}
              </p>
            </div>
          </div>
        </div>

        {/* Request Date */}
        <p className="text-xs text-muted-foreground">
          Requested on{" "}
          {new Date(request.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardContent>

      <CardFooter className="relative pt-4 border-t border-orange-500/10">
        <Button
          onClick={handleChatWithOwner}
          disabled={createChat.isPending}
          className="w-full bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50"
        >
          <IconMessage className="mr-2 size-4" />
          {createChat.isPending ? "Opening Chat..." : "Chat with Owner"}
        </Button>
      </CardFooter>
    </Card>
  );
}
