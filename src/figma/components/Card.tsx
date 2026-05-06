import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "purple" | "accent" | "beige";
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "md", hoverable = false, children, className = "", ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all";

    const variants = {
      default: "border border-border bg-card shadow-sm",
      purple: "border border-purple-300 bg-card shadow-sm",
      accent: "border border-accent-purple-border bg-card shadow-sm",
      beige: "border border-beige-300 bg-background",
    };

    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hoverable
      ? "hover:shadow-lg hover:border-accent cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <h3 ref={ref} className={`text-lg font-bold text-card-foreground ${className}`} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";
