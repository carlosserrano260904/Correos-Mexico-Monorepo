"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../app/lib/utils"
import { useHydration } from "../../hooks/useHydratyon"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  const isHydrated = useHydration()

  // During SSR and before hydration, render a simple span to prevent nesting issues
  if (!isHydrated) {
    return (
      <span className={cn(
        "bg-border shrink-0 inline-block data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )} />
    )
  }

  // After hydration, render the full Radix component with hydration safety
  return (
    <span className="contents">
      {isHydrated ? (
        <SeparatorPrimitive.Root
          data-slot="separator"
          decorative={decorative}
          orientation={orientation}
          className={cn(
            "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
            className
          )}
          {...props}
        />
      ) : (
        <span className={cn(
          "bg-border shrink-0 inline-block data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className
        )} />
      )}
    </span>
  )
}

export { Separator }
