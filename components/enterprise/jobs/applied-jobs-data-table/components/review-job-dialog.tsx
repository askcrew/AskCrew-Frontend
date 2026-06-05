"use client";

import * as React from "react";
import { IconCalendar } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RatingGroup } from "@/components/global/rating-group";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicantJob,  } from "../schema";

interface ReviewJobDialogProps {
  job: ApplicantJob;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewJobDialog({
  job,
  open,
  onOpenChange,
}: ReviewJobDialogProps) {
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");

  const handleSubmit = () => {
    console.log("Submitting review:", {
      jobId: job.id,
      rating,
      review,
    });
    onOpenChange(false);
    setRating(0);
    setReview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="bg-linear-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Review Job Position
          </DialogTitle>
          <DialogDescription>
            Share your experience with &quot;{job.job_title}&quot; at {job.job_company}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Job Info */}
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4">
            <h3 className="font-semibold text-lg mb-2">{job.job_title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{job.applicant_name}</p>
            <p className="text-sm text-muted-foreground">{job.status}</p>
            {/* <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                {job.startDate}
              </div>
              <span>-</span>
              <div className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                {job.endDate}
              </div>
            </div> */}
          </div>

          {/* Rating */}
          <RatingGroup
            label="Your Rating"
            description="Rate your overall experience with this position"
            value={rating}
            onValueChange={setRating}
            ratingClassName="text-yellow-400"
            max={5}
            size="lg"
            required
          />

          {/* Review Text */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none">
              Your Review
              <span className="text-destructive ml-1">*</span>
            </label>
            <Textarea
              placeholder="Share your thoughts about the job position..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim() === ""}
            className="bg-linear-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
