import { ComponentProps } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import FormMessage from "./form-message";

export default function FormGroup({
  label,
  type="text",
  labelClassName,
  message,
  className,
  ...props
}: {
  label?: string;
  type?: string;
  labelClassName?: string;
  message?: string;
} & ComponentProps<typeof Input>) {
  // const field = useFieldContext<string>();
  return (
    <div>
      {label && (
        <label
          className={cn(
            "block text-sm font-semibold text-gray-900 mb-2",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder="Enter your name"
        className={cn(message && "bg-red-50 border-red-400", className)}
        {...props}
      />
      <FormMessage message={message} className="mt-1" />
    </div>
  );
}
