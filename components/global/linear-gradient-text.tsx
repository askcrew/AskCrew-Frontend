import { cn } from "@/lib/utils";
import { JSX } from "react";
type LinearGradientTextProps = {
  children: React.ReactNode;
  className?: string;
  Component?: keyof JSX.IntrinsicElements;
};

const LinearGradientText = ({
  children,
  className,
  Component = "span",
}: LinearGradientTextProps) => {
  return (
    <Component
      className={cn(
        "bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </Component>
  );
};
export default LinearGradientText;
