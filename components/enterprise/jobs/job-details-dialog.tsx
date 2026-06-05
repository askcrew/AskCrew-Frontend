"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppliedJob } from "./applied-jobs-data-table";
import {
  Calendar,
  CheckCircle2,
  MapPin,
  DollarSign,
  Briefcase,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobDetailsDialogProps {
  job: AppliedJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (job: AppliedJob) => void;
}

export function JobDetailsDialog({
  job,
  open,
  onOpenChange,
  onApply,
}: JobDetailsDialogProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-8">
            <div className="space-y-1">
              <DialogTitle className="text-2xl bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                {job.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <Badge
              variant={job.status === "upcoming" ? "default" : "secondary"}
              className={
                job.status === "upcoming"
                  ? "bg-linear-to-r from-orange-500 to-purple-600 border-none"
                  : ""
              }
            >
              {job.status}
            </Badge>
          </div>
          <DialogDescription className="text-base pt-2">
            {job.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-linear-to-br from-orange-500/10 to-purple-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-orange-500/20">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-orange-600 dark:text-orange-400">
                  Location
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{job.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-linear-to-br from-purple-500/10 to-orange-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-purple-600 dark:text-purple-400">
                  Salary Range
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{job.salary}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-linear-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-blue-500/20">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-blue-600 dark:text-blue-400">
                  Job Type
                </span>
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                <p>{job.type}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-linear-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 font-medium">
                <div className="p-1.5 rounded-lg bg-green-500/20">
                  <Calendar className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-green-600 dark:text-green-400">
                  Duration
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Start: {job.startDate}</p>
                <p>End: {job.endDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <div className="p-1 rounded-lg bg-purple-500/10">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
              </div>
              <span className="bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Key Responsibilities
              </span>
            </h4>
            <ul className="grid gap-2 text-sm text-muted-foreground pl-6 list-disc">
              <li>
                Collaborate with the production team to achieve creative vision
              </li>
              <li>
                Maintain high standards of performance and professionalism
              </li>
              <li>Participate in rehearsals and preparation sessions</li>
              <li>Adhere to production schedules and safety guidelines</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 shadow-lg"
            onClick={() => onApply(job)}
          >
            Apply for Position
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
