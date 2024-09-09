import { ReactNode, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react"

import Loader from "@/components/Loader"
import ProductMiniCard from "@/components/ProductMiniCard"
import { CartItem } from "@/interfaces/cart"
import { Product } from "@/models/product"

import Promo from "./Promo"
import ProtectPackage from "./ProtectPackage"

interface OrderSummaryProps {
  className: string
  totalCount: number
  cartContent: string | null
  productData: Product[]
  cart?: CartItem[]
  subtotal: string
  shipping: string
  taxes: string
  handleProtectionClick: () => void
  children: ReactNode
}

const OrderSummary = ({
  className,
  totalCount,
  cartContent,
  productData,
  cart,
  subtotal,
  shipping,
  taxes,
  handleProtectionClick,
  children,
}: OrderSummaryProps) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false)

  const toggleDetails = () => setIsDetailsVisible(!isDetailsVisible)

  return (
    <div className={`w-[35%] rounded-xl bg-white max-lg:mt-6 max-lg:w-full ${className}`}>
      <div className="h-[70%] w-full border-b border-grey-400 p-4">
        <div className="pb-4 text-lg font-semibold">Order Summary</div>
        <div className="w-full border-b border-[#d3dadf] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart width={17} height={17} color="#25425D" />
              <div className="ml-2 text-sm font-medium text-primary-900">{totalCount} Units</div>
            </div>
            {isDetailsVisible ? (
              <ChevronUp width={17} height={17} color="#25425D" onClick={toggleDetails} className="cursor-pointer" />
            ) : (
              <ChevronDown width={17} height={17} color="#25425D" onClick={toggleDetails} className="cursor-pointer" />
            )}
          </div>
          {isDetailsVisible && (
            <>
              {cartContent ? (
                <>
                  {productData ? (
                    productData.map((product, index) => (
                      <ProductMiniCard key={index} product={product} {...(cart ? { cart: cart[index].count } : {})} />
                    ))
                  ) : (
                    <Loader />
                  )}
                </>
              ) : (
                <Loader />
              )}
              <Link href="/cart">
                <div className="flex h-auto w-full cursor-pointer items-center justify-center rounded-full border border-[#d3dadf] p-2">
                  <div className="text-sm font-semibold text-primary-900">Edit</div>
                </div>
              </Link>
            </>
          )}
        </div>
        <div className="mt-2 flex justify-between py-2 text-sm text-grey-800">
          <div>Subtotal</div>
          <div>${subtotal}</div>
        </div>
        <div className="flex justify-between py-2 text-sm text-grey-800">
          <div>Shipping</div>
          <div>{shipping}</div>
        </div>
        <div className="flex justify-between border-b border-grey-400 pb-6 pt-2 text-sm text-grey-800">
          <div>Taxes</div>
          <div>{taxes}</div>
        </div>
        <ProtectPackage handleProtectionClick={handleProtectionClick} />
        <Promo />
      </div>
      {children}
    </div>
  )
}

export default OrderSummary
