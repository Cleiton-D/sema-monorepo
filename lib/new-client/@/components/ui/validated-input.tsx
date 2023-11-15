import * as React from "react"

import { Input } from "./input"
import { cn } from "@/lib/utils"
import { useField } from "remix-validated-form"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
  }

const ValidatedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return (
      <Input
        ref={ref}
        {...props}
      />
    )
  }
)
ValidatedInput.displayName = "ValidatedInput"

export interface ValidatedInputWrapperProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ValidatedInputWrapper = React.forwardRef<HTMLInputElement, ValidatedInputWrapperProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "grid gap-1",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ValidatedInputWrapper.displayName = "ValidatedInputWrapper"

export type ValidatedInputErrorProps =
   Omit<React.HTMLAttributes<HTMLSpanElement> & {
    name: string
  }, 'children'>

const ValidatedInputError = React.forwardRef<HTMLSpanElement, ValidatedInputErrorProps>(
  ({ name, className,  ...props }, ref) => {
    const { error } = useField(name);

    if (!error) return null

    return (
      <span
        className={cn(
          "text-xs text-red-700",
          className
        )}
        ref={ref}
        {...props}
      >{error}</span>
    )
  }
)
ValidatedInputError.displayName = "ValidatedInputError"


export { ValidatedInput, ValidatedInputWrapper, ValidatedInputError }
