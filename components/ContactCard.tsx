import React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface ContactCardProps {
  title: string
  icon: string
  alt: string
  children: React.ReactNode
  className?: string
}

export const ContactCard: React.FC<ContactCardProps> = ({ icon, title, alt, children, className }) => {
  return (
    <div className={cn("ml-auto rounded-xl bg-grey-200 p-4 lg:w-[332px]", className)}>
      <div className="flex items-center gap-1.5">
        <Image src={icon} alt={alt} className="h-5 w-5" />
        <div className="text-sm font-medium text-primary-900">{title}</div>
      </div>
      <div className="mt-2.5 text-sm font-normal text-primary-900">{children}</div>
    </div>
  )
}
