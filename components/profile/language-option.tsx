import { ChevronRight } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LanguageOptionProps {
  value: string;
  label: string;
}

export function LanguageOption({ value, label }: LanguageOptionProps) {
  return (
    <Label
      htmlFor={value}
      className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem value={value} id={value} />
        <div className="text-base font-medium text-foreground cursor-pointer">
          {label}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Label>
  );
}
