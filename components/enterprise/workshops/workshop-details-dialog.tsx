"use client";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Workshop } from "./workshops-data-table/schema";
import {
  IconCalendar,
  IconUsers,
  IconMapPin,
  IconBriefcase,
  IconX,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/helper/formatDateTime";

interface WorkshopDetailsDialogProps {
  workshop: Workshop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (workshop: Workshop) => void;
}

export function WorkshopDetailsDialog({
  workshop,
  open,
  onOpenChange,
  onApply,
}: WorkshopDetailsDialogProps) {
  if (!workshop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Banner Section */}
        <div className="h-40 bg-linear-to-br from-purple-600 via-orange-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-8 right-8">
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
              {workshop.name}
            </h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <IconX size={20} />
          </Button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20">
                Professional Workshop
              </Badge>
              {workshop.specialization && (
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20">
                  {workshop.specialization}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {workshop.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
              <div className="p-3 rounded-xl bg-orange-500/20 text-orange-600">
                <IconCalendar size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-orange-600 uppercase text-xs tracking-wider">
                  Schedule
                </h4>
                <div className="text-sm text-foreground/80 space-y-1 font-medium">
                  <p>Starts: {formatDateTime(workshop.start_date)}</p>
                  <p>Ends: {formatDateTime(workshop.end_date)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-600">
                <IconUsers size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-purple-600 uppercase text-xs tracking-wider">
                  Participation
                </h4>
                <div className="text-sm text-foreground/80 space-y-1 font-medium">
                  <p>{workshop.number_of_participants} applied so far</p>
                  <p className="flex items-center gap-1.5 text-green-600">
                    <IconCircleCheck size={14} /> Spots available
                  </p>
                </div>
              </div>
            </div>

            {workshop.location && (
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-pink-500/5 border border-pink-500/10 hover:bg-pink-500/10 transition-colors">
                <div className="p-3 rounded-xl bg-pink-500/20 text-pink-600">
                  <IconMapPin size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-pink-600 uppercase text-xs tracking-wider">
                    Location
                  </h4>
                  <p className="text-sm text-foreground/80 font-medium">
                    {workshop.location}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-600">
                <IconBriefcase size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-600 uppercase text-xs tracking-wider">
                  Type
                </h4>
                <p className="text-sm text-foreground/80 font-medium">
                  Industry Expert-led
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 bg-muted/30 border-t gap-3">
          <Button
            variant="outline"
            className="h-12 px-8 rounded-xl border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 transition-all font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Not Now
          </Button>
          <Button
            className="h-12 px-10 rounded-xl bg-linear-to-r from-orange-500 via-purple-600 to-pink-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/20 text-white font-bold border-none"
            onClick={() => onApply(workshop)}
          >
            Confirm Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
