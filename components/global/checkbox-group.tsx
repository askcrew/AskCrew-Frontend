import { cn } from "@/lib/utils";
import * as CheckboxGroupBase from "@diceui/checkbox-group";
import { Check } from "lucide-react";
import { ComponentProps } from "react";

export type Option = {
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  label?: string;
  isLabelVisible?: boolean;
  options: Option[];

  listClassName?: string;
} & ComponentProps<typeof CheckboxGroupBase.Root>;

export function CheckboxGroup({
  label,
  isLabelVisible = false,
  options,
  listClassName = "",
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupBase.Root
      className={cn("peer flex flex-col gap-3.5", props.className)}
      {...props}
    >
      {isLabelVisible && (
        <CheckboxGroupBase.Label className="text-sm text-zinc-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-400">
          {label}
        </CheckboxGroupBase.Label>
      )}
      <CheckboxGroupBase.List
        className={cn(
          "flex gap-3 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          listClassName
        )}
      >
        {options.map((option) => (
          <CheckboxGroupItem
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </CheckboxGroupBase.List>
    </CheckboxGroupBase.Root>
  );
}

const CheckboxGroupItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <label className="flex w-fit select-none items-center gap-2 text-sm text-[#615B5C] leading-none has-data-disabled:cursor-not-allowed has-data-invalid:text-red-500 has-data-disabled:opacity-50 dark:text-zinc-100 dark:has-data-invalid:text-red-400">
      <CheckboxGroupBase.Item
        value={value}
        className="size-6 relative data-[state=checked]:bg-orange-500 shrink-0 rounded-sm shadow-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-500 data-invalid:border-red-500 dark:border-zinc-400 dark:data-invalid:border-red-400 dark:focus-visible:ring-zinc-400  dark:[&[data-state=checked]:not([data-invalid])]:text-zinc-900 [&[data-state=checked][data-invalid]]:bg-red-500 [&[data-state=checked][data-invalid]]:text-white dark:[&[data-state=checked][data-invalid]]:bg-red-400 [&[data-state=unchecked][data-invalid]]:bg-transparent"
      >
        <CheckboxGroupBase.Indicator className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Check className="size-4 text-white " />
        </CheckboxGroupBase.Indicator>
      </CheckboxGroupBase.Item>
      {label}
    </label>
  );
};
