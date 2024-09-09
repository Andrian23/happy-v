"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import cartLogo from "@/public/Cart-to-cart.svg"

import { Button } from "./ui/Button"

const EmptyCart: React.FC = () => {
  const router = useRouter()
  return (
    <div className="mt-[16px] h-[94%] w-full rounded-xl bg-white">
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center text-sm">
          <div className="m-auto flex h-[80px] w-[80px] items-center justify-center rounded-full bg-grey-200 p-4">
            <Image src={cartLogo} alt="Cart" className="m-auto h-10 w-10" />
          </div>
          <div className="py-2 text-[16px] font-semibold text-primary-900">It&apos;s still empty here</div>
          <Button variant="primary" onClick={() => router.push("/products")}>
            Explore products
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmptyCart
