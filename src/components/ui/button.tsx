import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-gray-300 dark:border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        xs: "px-2 text-xs",
        sm: "px-3",
        lg: "px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animate?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  animate = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), animate && "group")}
      {...props}
    >
      {animate ? (
        <>
          {/* THE CALYPSO CIRCLE 
            - Positioned at the bottom center
            - Scaled to 0 initially
            - Scales up large enough to cover the rectangular corners (approx 150%+)
          */}
          <span
            className={cn(
              "absolute left-1/2 top-full -translate-x-1/2",
              "aspect-square w-[140%] rounded-full",
              "bg-[oklch(0.83_0.11_180)]", // Your custom color
              "transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]",
              "group-hover:-translate-y-[120%] group-hover:scale-[1.6]"
            )}
          />

          {/* TEXT CONTAINER
            - Handles the vertical slide effect
            - Overflow hidden to clip the exiting/entering text
          */}
          <span className="relative z-10 flex flex-col overflow-hidden">
            {/* Primary Text */}
            <span
              className={cn(
                "inline-block transition-all duration-300 ease-[cubic-bezier(0.7,0,0.2,1)]",
                "group-hover:-translate-y-full group-hover:opacity-0"
              )}
            >
              {children}
            </span>

            {/* Hover Text (Absolute overlay) */}
            <span
              className={cn(
                "absolute inset-0 inline-block translate-y-full opacity-0",
                "transition-all duration-300 ease-[cubic-bezier(0.7,0,0.2,1)]",
                "group-hover:translate-y-0 group-hover:opacity-100",
                "text-black" // Adjust text color to contrast with your circle color
              )}
            >
              {children}
            </span>
          </span>
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </Comp>
  )
}

export { Button }