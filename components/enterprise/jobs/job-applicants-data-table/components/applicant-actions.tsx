"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { JobApplicant } from "../schema";

interface ApplicantActionsProps {
  applicant: JobApplicant;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicantActions({
  applicant,
  onAccept,
  onReject,
}: ApplicantActionsProps) {
  if (applicant.status === "accepted") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
          <IconCheck className="mr-1 size-3" />
          Accepted
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReject(applicant.id as string)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <IconX className="mr-1 size-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (applicant.status === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
          <IconX className="mr-1 size-3" />
          Rejected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAccept(applicant.id as string)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
        >
          <IconCheck className="mr-1 size-4" />
          Accept
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              // onClick={() => onAccept(applicant.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 border-green-500/20"
            >
              <IconCheck className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Accept Applicant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              // onClick={() => onReject(applicant.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-500/20"
            >
              <IconX className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject Applicant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
