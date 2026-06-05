"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"

type CouponCodeInputProps = {
  label?: string
  placeholder?: string
  helperText?: string
  value?: string
  onChange?: (value: string) => void
  isChecking?: boolean
  className?: string
}

export function CouponCodeInput({
  label = "Discount code",
  placeholder = "Enter discount code",
  helperText,
  value,
  onChange,
  isChecking = false,
  className,
}: CouponCodeInputProps) {
  const generatedId = React.useId()
  const [internalValue, setInternalValue] = React.useState("")

  const resolvedValue = value ?? internalValue

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setInternalValue(event.target.value)
    }
    onChange?.(event.target.value)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <Label htmlFor={generatedId}>{label}</Label>
        {helperText ? (
          <span className="text-muted-foreground">{helperText}</span>
        ) : null}
      </div>

      <InputGroup className="bg-white h-12 border-transparent shadow-inner focus-within:shadow-lg transition-shadow duration-200">
        <InputGroupInput
          id={generatedId}
          value={resolvedValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-base text-foreground placeholder:text-muted-foreground/70"
        />
        <div className="pr-3" aria-hidden={!isChecking}>
          <Loader2
            className={cn(
              "size-4 text-purple-600 transition-opacity duration-200",
              isChecking ? "opacity-100 animate-spin" : "opacity-0"
            )}
          />
        </div>
      </InputGroup>
    </div>
  )
}

