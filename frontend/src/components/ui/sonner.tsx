import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          success: "group-[.toast]:bg-green-600 group-[.toast]:text-white",
          error: "group-[.toast]:bg-red-600 group-[.toast]:text-white",
          info: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
        },
      }}
    />
  )
}