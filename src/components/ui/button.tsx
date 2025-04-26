import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          "rounded-full min-h-[44px]",
          {
            // Flat grayscale primary
            "bg-black text-white hover:bg-gray-900 active:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:active:bg-gray-300": variant === "default",
            // Flat grayscale secondary
            "bg-white text-black border border-gray-300 hover:bg-gray-100 active:bg-gray-200 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-900 dark:active:bg-gray-800": variant === "secondary",
            // Flat grayscale ghost
            "bg-transparent text-black hover:bg-gray-100 active:bg-gray-200 dark:text-white dark:hover:bg-gray-900 dark:active:bg-gray-800": variant === "ghost",
          },
          {
            "h-8 px-4 text-sm": size === "sm",
            "h-10 px-6 text-base": size === "md",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 