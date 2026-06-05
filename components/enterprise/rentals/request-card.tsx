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
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import { RentalRequest } from "./products-data-table/schema";

interface RequestCardProps {
  request: RentalRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RequestCard({
  request,
  onApprove,
  onReject,
}: RequestCardProps) {
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

  return (
    <Card className="group relative overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

      <CardHeader className="relative space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border-2 border-orange-500/20">
              <AvatarImage
                src={request.renterAvatar}
                alt={request.renterName}
              />
              <AvatarFallback className="bg-orange-500/10 text-orange-600 font-semibold">
                {request.renterName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">
                {request.renterName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {request.renterEmail}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 pb-4">
        {/* Rental Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <div>
              <p className="font-medium text-foreground">Start Date</p>
              <p>{new Date(request.startDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <div>
              <p className="font-medium text-foreground">End Date</p>
              <p>{new Date(request.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconClock className="size-4" />
            <div>
              <p className="font-medium text-foreground">Duration</p>
              <p>
                {request.duration} {request.durationType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCurrencyDollar className="size-4" />
            <div>
              <p className="font-medium text-foreground">Total Price</p>
              <p className="font-semibold text-orange-600">
                ${request.totalPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              {request.message}
            </p>
          </div>
        )}

        {/* Request Date */}
        <p className="text-xs text-muted-foreground">
          Requested on{" "}
          {new Date(request.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardContent>

      {request.status === "pending" && (
        <CardFooter className="relative pt-4 border-t border-orange-500/10 gap-2">
          <Button
            onClick={() => onReject?.(request.id)}
            variant="outline"
            className="flex-1 border-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all"
          >
            <IconX className="mr-2 size-4" />
            Reject
          </Button>
          <Button
            onClick={() => onApprove?.(request.id)}
            className="flex-1 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
          >
            <IconCheck className="mr-2 size-4" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
