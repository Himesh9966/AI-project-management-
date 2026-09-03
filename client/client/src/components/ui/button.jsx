import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  // Metallic variants strictly avoiding bright colors
  const variants = {
    default: "bg-[#1A1A1A] text-white hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
    metallic: "metallic-btn",
    outline: "border border-[#555] bg-transparent text-[#E0E0E0] hover:bg-[#222] hover:text-white",
    ghost: "hover:bg-white/10 hover:text-white text-[#CCC]",
    link: "text-[#AAA] underline-offset-4 hover:underline hover:text-white",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
