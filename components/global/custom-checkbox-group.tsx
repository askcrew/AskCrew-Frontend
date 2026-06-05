"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxOption {
  id: string;
  label: string;
  value?: string; // Added value field for form integration
  checked?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  onChange?: (selectedValues: string[]) => void;
  disabled?: boolean;
  className?: string;
  checkedColor?: string;
  checkedBorderColor?: string;
  uncheckedBorderColor?: string;
  name?: string; // Added name prop for form integration
  value?: string[]; // Added value prop for controlled component (react-hook-form)
}

export function CheckboxGroup({
  options: initialOptions,
  onChange,
  disabled = false,
  className,
  checkedColor = "bg-[#5B7FFF]",
  checkedBorderColor = "border-[#5B7FFF]",
  uncheckedBorderColor = "border-gray-300",
  name,
  value: controlledValue,
}: CheckboxGroupProps) {
  const [internalOptions, setInternalOptions] =
    React.useState<CheckboxOption[]>(initialOptions);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      const updatedOptions = initialOptions.map((option) => ({
        ...option,
        checked: controlledValue?.includes(option.value || option.id) ?? false,
      }));
      setInternalOptions(updatedOptions);
    } else {
      setInternalOptions(initialOptions);
    }
  }, [initialOptions, controlledValue]);

  const options =
    controlledValue !== undefined ? internalOptions : internalOptions;

  const handleToggle = (id: string) => {
    if (disabled) return;

    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setInternalOptions(updatedOptions);

    const selectedValues = updatedOptions
      .filter((opt) => opt.checked)
      .map((opt) => opt.value || opt.id);

    onChange?.(selectedValues);
  };

  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {options.map((option) => (
        <label
          key={option.id}
          className={cn(
            "flex items-center p-2 rounded-full gap-2 cursor-pointer select-none",
            disabled && "cursor-not-allowed opacity-50",
            option.checked ? `bg-[#EBF3FE]` : `bg-[#F8FAFC]`,
            "shrink-0"
          )}
        >
          <input
            type="checkbox"
            name={name}
            value={option.value || option.id}
            checked={option.checked ?? false}
            disabled={disabled}
            onChange={() => handleToggle(option.id)}
            className="sr-only"
          />
          <button
            type="button"
            role="checkbox"
            aria-checked={option.checked}
            disabled={disabled}
            onClick={() => handleToggle(option.id)}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
              option.checked
                ? `${checkedColor} ${checkedBorderColor} focus:ring-[#5B7FFF]`
                : `bg-white ${uncheckedBorderColor} hover:border-gray-400 focus:ring-gray-400`,
              disabled && "cursor-not-allowed"
            )}
          >
            {option.checked && (
              <Check className="w-3 h-3 text-white stroke-3" />
            )}
          </button>
          <span
            className={cn("text-sm text-gray-700", disabled && "opacity-90")}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
