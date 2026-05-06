import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    children,
    className = "",
    ...props
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary: "bg-primary text-primary-foreground shadow-md hover:bg-green-800 hover:shadow-lg focus:ring-ring",
      secondary: "border border-purple-300 bg-card text-secondary hover:bg-purple-100 focus:ring-secondary",
      outline: "border border-border bg-card text-text-secondary hover:bg-background focus:ring-ring",
      ghost: "bg-transparent text-text-secondary hover:bg-muted focus:ring-ring",
    };

    const sizes = {
      sm: "rounded-lg px-4 py-2 text-sm",
      md: "rounded-xl px-6 py-3 text-base",
      lg: "rounded-xl px-8 py-4 text-lg",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon className={iconSizes[size]} />}
        {children}
        {Icon && iconPosition === "right" && <Icon className={iconSizes[size]} />}
      </button>
    );
  }
);

Button.displayName = "Button";
