import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = "", ...props }, ref) => {
    const baseStyles = "w-full rounded-xl border bg-input-background px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2";

    const borderStyles = error
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
      : "border-border focus:border-ring focus:ring-ring/10";

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = "", ...props }, ref) => {
    const baseStyles = "w-full rounded-xl border bg-input-background px-4 py-3 text-sm leading-6 text-text-secondary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 resize-none";

    const borderStyles = error
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
      : "border-border focus:border-ring focus:ring-ring/10";

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
