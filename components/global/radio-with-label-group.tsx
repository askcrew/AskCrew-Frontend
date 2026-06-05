import { ComponentProps } from "react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

type RadioWithLabelGroupProps = {
  label: string;
  iconClassName?: string;
} & ComponentProps<typeof RadioGroupItem>;

const RadioWithLabelGroup = ({
  value,
  label,
  iconClassName,
  ...props
}: RadioWithLabelGroupProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value={value}
        iconClassName={cn(iconClassName, "fill-[#3B82F6]")}
        {...props}
      />
      <Label
        htmlFor={props.id}
        className="text-sm text-neutral-550 font-normal"
      >
        {label}
      </Label>
    </div>
  );
};
export default RadioWithLabelGroup;
