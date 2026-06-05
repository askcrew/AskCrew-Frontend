"use client";

import { format } from "date-fns";
import * as React from "react";
// import CalendarIcon from "@/app/icons/Calender";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import FormMessage from "./form-message";

type DatePickerProps = {
  onValueChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
  placeholder?: string;
  className?: string;
  formatString?: string;
  label?: string;
  labelClassName?: string;
  message?: string;
};

export default function DatePicker({
  onValueChange,
  value,
  placeholder,
  className,
  formatString = "PPP",
  label,
  labelClassName,
  message,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => value);

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn("text-base text-neutral-500", labelClassName)}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground flex w-70 justify-start items-center text-left font-normal",
              className,
              message && "bg-red-50"
            )}
            aria-invalid={message ? true : false}
          >
            <img src="/icons/calendar-2.svg" alt="" />
            {date && !isNaN(date.getTime()) ? (
              format(date, formatString)
            ) : (
              <span>{placeholder || "Select date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              onValueChange?.(date);
            }}
          />
        </PopoverContent>
      </Popover>
      <FormMessage message={message} />
    </div>
  );
}
