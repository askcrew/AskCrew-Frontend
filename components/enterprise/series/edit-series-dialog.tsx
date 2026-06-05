"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconEdit } from "@tabler/icons-react";
import { SeriesForm } from "./series-form";
import { ISeries, Series } from "./schema";

interface EditSeriesDialogProps {
  series: ISeries;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSeriesDialog({
  series,
  open,
  onOpenChange,
}: EditSeriesDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Series updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconEdit className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Edit Series
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Update your series details and information.
          </DialogDescription>
        </DialogHeader>

        <SeriesForm
          series={series}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
