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
      primary: "bg-[#4A4530] text-white hover:bg-[#3A3520] shadow-md hover:shadow-lg focus:ring-[#BDB96A]",
      secondary: "border border-[#D8D7F5] bg-white text-[#8B89DD] hover:bg-[#F8F8FF] focus:ring-[#8B89DD]",
      outline: "border border-[#E8E6DD] bg-white text-[#6B6847] hover:bg-[#FDFCF8] focus:ring-[#BDB96A]",
      ghost: "bg-transparent text-[#6B6847] hover:bg-[#F5F5E8] focus:ring-[#BDB96A]",
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
