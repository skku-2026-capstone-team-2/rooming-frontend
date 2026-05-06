import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "purple" | "accent" | "green";
  size?: "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", children, className = "", ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium border";

    const variants = {
      default: "bg-background text-text-tertiary border-beige-400",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      accent: "bg-accent-purple-bg text-accent-purple border-accent-purple-lighter",
      green: "bg-green-300 text-text-secondary border-beige-300",
    };

    const sizes = {
      sm: "rounded-full px-2 py-0.5 text-xs",
      md: "rounded-full px-3 py-1 text-xs",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
