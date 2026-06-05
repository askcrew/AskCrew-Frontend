"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import FormMessage from "./form-message";
import { cva, VariantProps } from "class-variance-authority";
export type SelectOptions = {
  label: string;
  value: string|number;
};

const customSelectVariants = cva("", {
  variants: {
    size: {
      lg: "h-12!",
      md: "h-10!",
      sm: "h-9!",
      xl: "h-14!",
    },
  },
});

const CustomSelect = ({
  options = [],
  value,
  placeholder = "select",
  onValueChange,
  className,
  containerClassName,
  label,
  message,
  size,
}: {
  options?: SelectOptions[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  containerClassName?: string;
  label?: string;
  message?: string;
  size?: VariantProps<typeof customSelectVariants>["size"];
}) => {
  return (
    <div className={cn("space-y-4", containerClassName)}>
      {label && <Label className="text-neutral-500">{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "rounded-[8px] w-full text-neutral-400!",
            customSelectVariants({
              size,
            }),
            className,
            message && "bg-red-50"
          )}
          aria-invalid={message ? true : false}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage message={message} />
    </div>
  );
};
export default CustomSelect;
