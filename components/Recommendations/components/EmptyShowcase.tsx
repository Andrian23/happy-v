import React from "react"
import Image, { StaticImageData } from "next/image"

import { Button } from "@/components/ui/Button"

interface EmptyStateProps {
  image: StaticImageData
  title: string
  message: string
  onButtonClick: () => void
  isTemplate?: boolean
}

const EmptyShowcase: React.FC<EmptyStateProps> = ({ image, title, message, isTemplate, onButtonClick }) => (
  <div className="grid h-[60vh] content-center items-center justify-center justify-items-center">
    <Image src={image} alt="empty-state" width={74} height={74} />
    <h3 className="pt-4 text-base font-bold text-primary-900">{title}</h3>
    <p className="px-0 py-2 text-sm font-medium text-[rgba(37,66,93,0.6)]">{message}</p>
    <Button variant="primary" onClick={onButtonClick} size="md">
      {isTemplate ? "Create template" : "New recommendation"}
    </Button>
  </div>
)
export default EmptyShowcase
