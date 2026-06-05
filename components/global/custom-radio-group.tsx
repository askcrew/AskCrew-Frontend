"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  label: string;
  value: string;
}

export interface BookingRadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const CustomRadioGroup = forwardRef<HTMLDivElement, BookingRadioGroupProps>(
  ({ options, value, onValueChange, name, className, disabled }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn("flex flex-wrap gap-2", className)}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const inputId = `${name}-${option.value}-random-${Math.random()}`;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "relative min-w-25 h-10 grid place-content-center cursor-pointer rounded-lg border px-6 text-neutral-400 font-normal py-2.5 text-sm transition-all",
                "hover:border-[#AECCCB]",
                isSelected
                  ? "border-[#AECCCB] bg-[#EDF4F4] text-[#4E918F]"
                  : "border-[#EFF0F2] bg-white text-neutral-400 hover:text-neutral-500",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={(e) => {
                  if (!disabled && onValueChange) {
                    onValueChange(e.target.value);
                  }
                }}
                disabled={disabled}
                className="sr-only"
                aria-checked={isSelected}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    );
  }
);

CustomRadioGroup.displayName = "CustomRadioGroup";

export { CustomRadioGroup };
