"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconEdit } from "@tabler/icons-react";
import { SeasonForm } from "./season-form";
import { ISeason } from "./schema";

interface EditSeasonDialogProps {
  season: ISeason;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSeasonDialog({
  season,
  open,
  onOpenChange,
}: EditSeasonDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconEdit className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Edit Season
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Update season details, cast, and pricing information.
          </DialogDescription>
        </DialogHeader>

        <SeasonForm
          season={season}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
