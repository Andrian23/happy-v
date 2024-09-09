import { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import logo from "@/public/Logo_cl.svg"
import shieldIcon from "@/public/Shield.svg"

const CartLayout = ({ children }: { children: ReactNode }) => (
  <div className="h-full w-full">
    <div className="flex h-[5rem] w-full items-center justify-between border-b border-grey-400 px-[10rem] py-[2rem] max-lg:px-[1rem]">
      <Link href="/products">
        <div className="flex items-center">
          <ArrowLeft color="#7C8E9E" width={18} height={18} />
          <div className="ml-2 text-sm text-grey-800">Back</div>
        </div>
      </Link>
      <div className="block max-lg:hidden">
        <Link href="/dashboard">
          <Image src={logo} alt="Logo" className="h-10 w-[140px]" />
        </Link>
      </div>
      <div className="hidden text-sm text-grey-800 max-lg:block">Secure Checkout</div>
      <div className="flex items-center justify-end max-lg:w-[59px]">
        <Image src={shieldIcon} alt="Secure" className="h-[18px] w-[18px]" />
        <div className="ml-1 block text-sm text-grey-800 max-lg:hidden">Secure Checkout</div>
      </div>
    </div>
    {children}
  </div>
)

export default CartLayout
