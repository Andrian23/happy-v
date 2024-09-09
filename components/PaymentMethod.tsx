import { ReactNode } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import radioButtonIcon from "@/public/Radio_button.svg"

interface PaymentMethodProps {
  onClick: () => void
  isSelected: boolean
  children: ReactNode
}

const PaymentMethod = ({ onClick, isSelected, children }: PaymentMethodProps) => (
  <div className="my-4 flex h-auto w-full items-center rounded-xl bg-white p-4" onClick={onClick}>
    <div className={cn("relative h-5 w-5 rounded-full border border-grey-700", isSelected && "border-primary-500")}>
      {isSelected && <Image src={radioButtonIcon} alt="Shipping" fill className="h-5 w-5 object-contain" />}
    </div>
    <div className="ml-2">{children}</div>
  </div>
)

export default PaymentMethod
