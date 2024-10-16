import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { Button } from "./ui/Button"

interface ListContainerProps {
  title: string
  description: string
  href: string
  innerHref?: string
  linkLabel: string
  buttonLabel: string
  children?: React.ReactNode
  className?: string
}

export const ListContainer: React.FC<ListContainerProps> = ({
  title,
  description,
  href,
  innerHref,
  linkLabel,
  buttonLabel,
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-4 rounded-2xl bg-grey-200 p-4 text-primary-900 lg:p-6", className)}>
      <div className="flex flex-col gap-1 lg:flex-row lg:justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <Link className="text-sm font-semibold text-primary-500 hover:text-primary-600" href={href}>
          {linkLabel}
        </Link>
      </div>
      {children || (
        <div className="mt-2 flex flex-col items-center gap-4 rounded-xl bg-white p-4 lg:px-6 lg:py-10">
          <div className="flex flex-col items-center gap-1">
            <h4 className="text-[16px] font-bold">It&apos;s still empty here</h4>
            <p className="text-[14px] font-medium text-primary-900/60">{description}</p>
          </div>
          <Button asChild variant="primary" className="font-semibold">
            <Link href={innerHref ?? href}>{buttonLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
