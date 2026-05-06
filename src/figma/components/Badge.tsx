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
      default: "bg-[#FDFCF8] text-[#8B8850] border-[#F0EFE8]",
      purple: "bg-[#F8F8FF] text-[#5A58AA] border-[#E8E7FF]",
      accent: "bg-[#FFF8FF] text-[#8E3BA8] border-[#F0E5FF]",
      green: "bg-[#FDFBD4] text-[#6B6847] border-[#EEECCA]",
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
