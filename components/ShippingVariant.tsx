import Image from "next/image"

import { cn } from "@/lib/utils"
import radioButtonIcon from "@/public/Radio_button.svg"

interface ShippingVariantProps {
  id: string
  onClick: () => void
  isSelected: boolean
  label: string
  price: string
  marginTop?: boolean
}

const ShippingVariant = ({ id, onClick, isSelected, label, price, marginTop }: ShippingVariantProps) => (
  <div
    className={`flex h-auto w-full items-center justify-between rounded-2xl bg-white p-6 ${marginTop ? "mt-4" : ""}`}
  >
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="flex cursor-pointer items-center" id={id} onClick={onClick}>
          <div
            className={cn("relative h-5 w-5 rounded-full border border-grey-700", isSelected && "border-primary-500")}
          >
            {isSelected && <Image src={radioButtonIcon} alt="Shipping" fill className="h-5 w-5 object-contain" />}
          </div>
        </div>
      </div>
      <div className="ml-4 text-sm font-semibold text-primary-900">{label}</div>
    </div>
    <div className="text-sm font-semibold text-primary-900">{price}</div>
  </div>
)

export default ShippingVariant
