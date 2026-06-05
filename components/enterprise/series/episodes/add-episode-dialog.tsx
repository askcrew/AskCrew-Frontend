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
import { IconPlus, IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";
import { EpisodeForm } from "./episode-form";

export function AddEpisodeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all duration-300"
        >
          <IconPlus className="mr-2 size-4" />
          Add Episode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconPlayerPlay className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Add New Episode
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Upload a new episode with thumbnail, video file, and details.
          </DialogDescription>
        </DialogHeader>

        <EpisodeForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
