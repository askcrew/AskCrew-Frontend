import React from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import FormMessage from "./form-message";
import { cn } from "@/lib/utils";

const FormText = ({
  label,
  message,
  ...props
}: {
  label: string;
  message?: string;
} & React.ComponentProps<typeof Textarea>) => {
  return (
    <div className="space-y-2">
      <Label className="text-base text-neutral-500">{label}</Label>
      <Textarea
        variant="default"
        className={cn(
          "h-25 resize-none",
          props.className,
          message && "bg-red-50! border-destructive!"
        )}
        {...props}
      />
      <FormMessage message={message} />
    </div>
  );
};
export default FormText;
