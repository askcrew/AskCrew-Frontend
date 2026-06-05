import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

type FormMessageProps = {
  message?: string;
  className?: string;
};

const FormMessage = ({ message, className }: FormMessageProps) => {
  if (!message) return null;
  return (
    <div
      className={cn("text-red-500 flex items-center gap-1 text-xs", className)}
    >
      <AlertCircle className="size-4" />
      {message}
    </div>
  );
};
export default FormMessage;
