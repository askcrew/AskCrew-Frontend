"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/helper/formatDateTime";
import {
  IconArrowRight,
  IconBookmark,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import type { Workshop } from "./workshops-data-table/schema";

interface WorkshopCardProps {
  workshop: Workshop;
  onApply: (workshop: Workshop) => void;
  onViewDetails: (workshop: Workshop) => void;
}

export function WorkshopCard({
  workshop,
  onApply,
  onViewDetails,
}: WorkshopCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-purple-500/20 hover:border-orange-500/40 bg-linear-to-br from-background via-background to-muted/20">
      {/* Visual Header / Image Placeholder */}
      <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-purple-600/20 via-orange-500/10 to-pink-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent)]" />
        {workshop.specialization && (
          <Badge className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-colors">
            {workshop.specialization}
          </Badge>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
          <IconBookmark size={120} className="text-purple-500" />
        </div>
      </div>

      <CardHeader className="space-y-2 relative">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-orange-600 to-pink-600 bg-clip-text text-transparent line-clamp-1">
            {workshop.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-base min-h-12">
            {workshop.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-0">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground group/item">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all duration-300">
              <IconCalendar size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-orange-600/70 uppercase">
                Schedule
              </span>
              <span className="font-medium text-foreground/80">
                {formatDateTime(workshop.start_date).split(",")[0]} -{" "}
                {formatDateTime(workshop.end_date).split(",")[0]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground group/item">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover/item:bg-purple-500 group-hover/item:text-white transition-all duration-300">
              <IconUsers size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-purple-600/70 uppercase">
                Attendance
              </span>
              <span className="font-medium text-foreground/80">
                {workshop.number_of_participants} Registered
              </span>
            </div>
          </div>

          {workshop.location && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground group/item">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 group-hover/item:bg-pink-500 group-hover/item:text-white transition-all duration-300">
                <IconMapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-pink-600/70 uppercase">
                  Location
                </span>
                <span
                  className="font-medium text-foreground/80 truncate max-w-[180px]"
                  title={workshop.location}
                >
                  {workshop.location}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t border-muted/50">
        <Button
          variant="outline"
          className="flex-1 h-11 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300"
          onClick={() => onViewDetails(workshop)}
        >
          Details
        </Button>
        <Button
          className="flex-1 h-11 gap-2 bg-linear-to-r from-orange-500 via-purple-600 to-pink-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-orange-500/20 text-white font-semibold border-none"
          onClick={() => onApply(workshop)}
        >
          Apply <IconArrowRight size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
