import * as React from "react";

import { cva, VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-background dark:bg-input/30",
        editable:
          "focus-visible:border-2 h-52 disabled:bg-[#f8fafc]! border-border-400 rounded-xl text-neutral-600 p-4 resize-none focus-visible:border-accent-blue! border border-[#CCD0D7] rounded-lg py-2 px-4",
      },
      size: {
        default: "",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-4 py-2 text-base",
        xl: "h-14 px-4 py-2",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

function Textarea({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={textareaVariants({ className, variant, size })}
      {...props}
    />
  );
}

export { Textarea };
