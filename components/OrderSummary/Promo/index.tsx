import { useState } from "react"
import { Plus } from "lucide-react"

import { Input } from "@/components/ui/Input"

const Promo = () => {
  const [isPromoCodeVisible, setIsPromoCodeVisible] = useState<boolean>(false)

  const togglePromoCode = () => setIsPromoCodeVisible(!isPromoCodeVisible)

  return (
    <div className="mt-4">
      {isPromoCodeVisible ? (
        <div className="flex items-center justify-between">
          <Input type="text" placeholder="Enter promo code" className="w-[78%] rounded-[12px]" />
          <div className="h-auto w-[20%] rounded-full bg-primary-500 py-2 text-center text-white">
            <div className="cursor-pointer text-sm">Apply</div>
          </div>
        </div>
      ) : (
        <div className="flex cursor-pointer items-center text-sm text-primary-500" onClick={togglePromoCode}>
          <Plus width={20} height={20} />
          <div className="ml-1">Apply Promo Code</div>
        </div>
      )}
    </div>
  )
}

export default Promo
