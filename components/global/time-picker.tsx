"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import React from "react";
import FormMessage from "./form-message";

type TimePickerProps = {
  label?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
  error?: string;
};

const TimePicker = ({
  label,
  value,
  onChange,
  className,
  error,
}: TimePickerProps) => {
  const [time, setTime] = React.useState(() => value);

  const displayTime = React.useMemo(() => {
    if (!time) return undefined; // Check if time is valid
    return time; // Already a string
  }, [time]);

  React.useEffect(() => {
    onChange?.(time);
  }, [time]);

  return (
    <Popover modal>
      <div className="flex  w-full flex-col gap-1">
        {!!label && (
          <Label className="mb-2" htmlFor={label}>
            {label}
          </Label>
        )}
        <div className="flex  w-full flex-col gap-2">
          <PopoverTrigger asChild className={cn(className)}>
            <Button
              type="button"
              variant="outline"
              className={cn(
                " w-full justify-start text-left font-normal",
                !time && "text-muted-foreground",
                error && "bg-red-50"
              )}
              aria-invalid={error ? true : false}
            >
              <Clock className="mr-2 size-6 text-[#b7c0bf]" />
              {displayTime ? displayTime : <span>Pick a time</span>}
            </Button>
          </PopoverTrigger>
          <FormMessage message={error} />
        </div>
      </div>
      <PopoverContent className="flex w-full items-center justify-center p-4">
        <Input
          type="time"
          value={time || ""}
          onChange={(e) => {
            const inputTime = e.target.value;
            setTime(inputTime || undefined); // Set time as string
          }}
          className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </PopoverContent>
    </Popover>
  );
};

export { TimePicker };
