import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = "", ...props }, ref) => {
    const baseStyles = "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#6B6847] placeholder-[#B8B69F] transition-all focus:outline-none focus:ring-2";

    const borderStyles = error
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
      : "border-[#E8E6DD] focus:border-[#BDB96A] focus:ring-[#BDB96A]/10";

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
    const baseStyles = "w-full rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-[#6B6847] placeholder-[#B8B69F] transition-all focus:outline-none focus:ring-2 resize-none";

    const borderStyles = error
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
      : "border-[#E8E6DD] focus:border-[#BDB96A] focus:ring-[#BDB96A]/10";

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
