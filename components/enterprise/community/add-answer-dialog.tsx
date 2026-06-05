"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconMessagePlus } from "@tabler/icons-react";
import { AnswerForm } from "./answer-form";

interface AddAnswerDialogProps {
  questionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAnswerDialog({
  questionTitle,
  open,
  onOpenChange,
}: AddAnswerDialogProps) {
  const handleSubmit = (answer: string) => {
    console.log("Answer submitted:", answer);
    // Handle answer submission
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <IconMessagePlus className="size-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Answer Question
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            <span className="font-semibold text-foreground">
              &quot;{questionTitle}&quot;
            </span>
            <br />
            Share your knowledge and help the community by providing a helpful
            answer.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <AnswerForm onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
