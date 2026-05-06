import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = "lg", children, className = "", ...props }, ref) => {
    const maxWidths = {
      sm: "max-w-4xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={`mx-auto px-6 ${maxWidths[maxWidth]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export const PageHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-8 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <h1 ref={ref} className={`text-3xl font-bold text-foreground ${className}`} {...props}>
        {children}
      </h1>
    );
  }
);

PageTitle.displayName = "PageTitle";

export const PageDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p ref={ref} className={`mt-2 text-text-secondary ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

PageDescription.displayName = "PageDescription";
