"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"

import headerLogo from "@/public/logo-main.svg"

import { Button } from "../ui/Button"

export const CartHeader = () => {
  const router = useRouter()

  return (
    <header className="grid grid-cols-3 items-center border-b border-grey-400 px-4 py-5 text-primary-800 lg:px-44 lg:py-6">
      <Button
        variant="link"
        className="h-auto w-auto gap-2 justify-self-start p-0 text-primary-800"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </Button>
      <Image src={headerLogo} alt="Logo" className="justify-self-center" width={140} height={24} />
      <div className="flex items-center gap-2 justify-self-end text-sm">
        <ShieldCheck className="h-5 w-5" /> <span className="max-lg:hidden">Secure Checkout</span>
      </div>
    </header>
  )
}
