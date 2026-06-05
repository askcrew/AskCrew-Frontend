"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus, IconVideo } from "@tabler/icons-react";
import { useState } from "react";
import { SeasonForm } from "./season-form";

export function AddSeasonDialog() {
  const [open, setOpen] = useState(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all duration-300"
        >
          <IconPlus className="mr-2 size-4" />
          Add Season
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconVideo className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Add New Season
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Create a new season with cover photo, trailer, cast, and pricing
            details.
          </DialogDescription>
        </DialogHeader>

        <SeasonForm  onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
