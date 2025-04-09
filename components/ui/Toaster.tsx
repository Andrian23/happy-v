"use client"

import { CircleXIcon } from "lucide-react"

import type { ToastProviderProps } from "@radix-ui/react-toast"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/Toast"
import { useToast } from "@/components/ui/useToast"
import { Check } from "@/icons/Check"

interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}

const directionsMap: { [key: string]: ToastProviderProps["swipeDirection"] } = {
  "top-right": "right",
  "top-left": "left",
  "bottom-right": "right",
  "bottom-left": "left",
  "top-center": "up",
  "bottom-center": "down",
}

export const Toaster: React.FC<ToasterProps> = ({ position }) => {
  const { toasts } = useToast()

  const swipeDirections = position ? directionsMap[position] : "down"

  const viewportPosition = position || toasts[0]?.position

  return (
    <ToastProvider swipeDirection={swipeDirections}>
      {toasts.map(({ id, title, description, action, successIcon, errorIcon, ...props }) => (
        <Toast key={id} {...props}>
          {successIcon && <Check className="text-white" />}
          {errorIcon && <CircleXIcon className="text-white" />}
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport position={viewportPosition} />
    </ToastProvider>
  )
}
