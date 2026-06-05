import { ComponentProps } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import FormMessage from "./form-message";
import { IconMapPin } from "@tabler/icons-react";

const LocationInput = ({
  label,
  name,
  value,
  onChange,
  labelClassName,
  message,
  className,
  placeholder = "Enter workshop location",
  ...props
}: {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
  message?: string;
  placeholder?: string;
} & ComponentProps<typeof Input>) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className={cn(
            "block text-base font-semibold text-foreground",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "h-12 pr-12 rounded-full border-2 border-gray-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 transition-all",
            message && "bg-red-50 border-red-400",
            className
          )}
          {...props}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconMapPin className="size-6 text-orange-500" />
        </div>
      </div>
      <FormMessage message={message} className="mt-1" />
    </div>
  );
};

export default LocationInput;
