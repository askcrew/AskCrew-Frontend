"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { RiRadioButtonFill } from "react-icons/ri";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  iconClassName,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  iconClassName?: string;
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "data-[state=unchecked]:border-input text-primary relative focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-6 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-6"
      >
        {/* <CircleIcon className="fill-[#4E918F] size-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
        <RiRadioButtonFill
          className={cn(
            "text-orange-500 fill-orange-500  absolute size-[calc(100%+4px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            iconClassName
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
