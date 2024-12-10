import { FC, ReactNode } from "react"
import Image from "next/image"

interface StatusMessageProps {
  image: string
  title: string
  description: string
  actions?: ReactNode
}

const StatusMessage: FC<StatusMessageProps> = ({ image, title, description, actions }) => (
  <div className="flex h-[50vh] w-full items-center justify-center lg:h-[95vh]">
    <div className="text-center">
      <Image src={image} alt="Status" className="mx-auto block h-24 w-24" />
      <h3 className="mt-8 text-2.5xl font-semibold text-primary-900 lg:text-3xl">{title}</h3>
      <p className="mt-2 text-sm font-light text-grey-800 lg:text-sm">{description}</p>
      {actions && <div className="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row">{actions}</div>}
    </div>
  </div>
)

export default StatusMessage
