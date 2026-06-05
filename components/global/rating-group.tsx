"use client";

import * as React from "react";
import { Rating, RatingItem } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import FormMessage from "./form-message";

interface RatingGroupProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  step?: 0.5 | 1;
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  ratingClassName?: string;
}

export function RatingGroup({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  step = 1,
  size = "default",
  disabled = false,
  readOnly = false,
  required = false,
  name,
  label,
  description,
  error,
  className,
  ratingClassName,
}: RatingGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Rating
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        max={max}
        step={step}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        className={cn("gap-1", ratingClassName)}
      >
        {Array.from({ length: max }, (_, i) => (
          <RatingItem key={i} index={i} />
        ))}
      </Rating>

      {error && <FormMessage message={error} />}
    </div>
  );
}
