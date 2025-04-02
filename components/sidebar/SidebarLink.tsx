import React, { ReactElement } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Badge } from "@/components/ui/Badge"

interface SidebarLinkProps {
  link: string
  icon: ReactElement
  name: string
  className?: string
  isBadged?: boolean
  isNotified?: boolean
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  link,
  icon,
  name,
  className,
  isBadged = false,
  isNotified = false,
}) => {
  const currentPath = usePathname()
  const isActive = currentPath === link

  const mergedClasses = twMerge(
    clsx(
      "group mb-2.5 flex items-center gap-2 rounded-lg p-2 text-sm font-medium md:gap-2.5",
      {
        "bg-white/15": isActive,
        "bg-transparent hover:bg-white/15": !isActive,
      },
      className
    )
  )

  return (
    <Link href={link} className={mergedClasses}>
      <div className="flex items-center gap-2 md:gap-2.5">
        {icon}
        {name}
      </div>
      {isBadged && (
        <Badge
          className={clsx(
            "md:group-hover:text-light-grey md:text-grey-500 relative rounded-xs bg-transparent text-sm text-black",
            {
              "text-foreground md:text-light-grey rounded-xs bg-black/10 px-2 md:bg-white/10":
                isNotified && name === "Pending for Review",
            }
          )}
        >
          {isNotified && name === "Pending for Review" && (
            <div className="bg-notified absolute -top-1 -right-1 aspect-square w-1.5 rounded-full" />
          )}
          8
        </Badge>
      )}
    </Link>
  )
}

export default SidebarLink
