"use client";

import {
  Calendar,
  ArrowRight,
  MapPin,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppliedJob } from "./applied-jobs-data-table";

interface JobCardProps {
  job: AppliedJob;
  onApply: (job: AppliedJob) => void;
  onViewDetails: (job: AppliedJob) => void;
}

export function JobCard({ job, onApply, onViewDetails }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-purple-500/20 hover:border-orange-500/40 bg-linear-to-br from-purple-500/5 to-orange-500/5 hover:from-purple-500/10 hover:to-orange-500/10">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl line-clamp-1 bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              {job.job_title}
            </CardTitle>
            <CardDescription className="line-clamp-1 font-medium text-foreground/80">
              {job.company_name}
            </CardDescription>
            <CardDescription className="line-clamp-2">
              {job.about}
            </CardDescription>
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
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-orange-500/10">
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <DollarSign className="w-4 h-4 text-purple-500" />
            </div>
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <span className="truncate capitalize">{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-green-500/10">
              <Calendar className="w-4 h-4 text-green-500" />
            </div>
            <span className="truncate">{job.startDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500"
          onClick={() => onViewDetails(job)}
        >
          View Details
        </Button>
        <Button
          className="flex-1 gap-2 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 shadow-lg"
          onClick={() => onApply(job)}
        >
          Apply Now <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
