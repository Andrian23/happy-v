import React from "react"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface FormErrorProps {
  message?: string
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null

  return (
    <div className="my-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
