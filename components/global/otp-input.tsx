import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import FormMessage from "./form-message";
import { cn } from "@/lib/utils";

type OTPInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  className?: string;
  groupClassName?: string;
  label?: string;
  message?: string;
};

export function OTPInput({
  onChange,
  value,
  className,
  groupClassName,
  label,
  message,
  length,
}: OTPInputProps) {
  const lengthArray = Array.from({ length: length || 6 });
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
      <InputOTP maxLength={6} value={value} onChange={onChange}>
        <InputOTPGroup className={groupClassName}>
          {lengthArray.map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={cn(className, "text-orange-600 text-xl")}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <FormMessage message={message} />
    </div>
  );
}
