"use client";

import { useAddQuestion } from "@/lib/queries/questions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import FormGroup from "@/components/global/form-group";
import FormText from "@/components/global/form-text";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  body: z.string().min(10, "Description must be at least 10 characters"),
  specification: z.string().min(2, "Category is required"),
});

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddQuestionDialog({
  open,
  onOpenChange,
}: AddQuestionDialogProps) {
  const addQuestionMutation = useAddQuestion();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      specification: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addQuestionMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Question posted successfully!");
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        console.error("Error posting question:", error);
        toast.error("Failed to post question. Please try again.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Ask a Question
          </DialogTitle>
          <DialogDescription className="text-base">
            Post a question to the community. Be specific and provide details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormGroup
                  label="Title"
                  placeholder="What's your question?"
                  message={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="specification"
              render={({ field, fieldState }) => (
                <FormGroup
                  label="Category"
                  placeholder="e.g. Development, Design, Marketing"
                  message={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <FormText
                  label="Description"
                  placeholder="Describe your question in detail..."
                  message={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={addQuestionMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addQuestionMutation.isPending}
                className="bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold"
              >
                {addQuestionMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Question
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
