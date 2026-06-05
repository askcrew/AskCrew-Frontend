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
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { AddJobForm } from "./add-job-form";

export function AddJobDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
          <IconPlus className="mr-2 size-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post New Job</DialogTitle>
          <DialogDescription>
            Create a new job posting to attract talented professionals
          </DialogDescription>
        </DialogHeader>

        <AddJobForm  onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
