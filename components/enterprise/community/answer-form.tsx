"use client";

import FormText from "@/components/global/form-text";
import { Button } from "@/components/ui/button";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { useAddQuestionAnswer } from "@/lib/queries/questions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AnswerFormProps {
  questionId: number;
  onSuccess?: () => void;
}

export function AnswerForm({ questionId, onSuccess }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const addAnswerMutation = useAddQuestionAnswer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    addAnswerMutation.mutate(
      {
        body: answer,
        question: questionId,
      },
      {
        onSuccess: () => {
          toast.success("Answer submitted successfully!");
          setAnswer("");
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (error) => {
          console.error("Error submitting answer:", error);
          toast.error("Failed to submit answer. Please try again.");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormText
        label="Your Answer"
        name="answer"
        placeholder="Share your knowledge and help the community..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="min-h-[150px] resize-none border-2 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all"
        required
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Be respectful and provide helpful, constructive feedback
        </p>
        <Button
          type="submit"
          disabled={!answer.trim() || addAnswerMutation.isPending}
          className="bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
        >
          {addAnswerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <IconSend className="mr-2 size-4" />
              Submit Answer
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
