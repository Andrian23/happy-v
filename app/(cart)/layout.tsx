import React, { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getUncompletedSignUpSteps } from "@/actions/signUp"
import CartInitializer from "@/app/features/cart/CartInitializer"
import { CartHeader } from "@/components/layout/CartHeader"

export default async function CartLayout({ children }: { children: ReactNode }) {
  const uncompletedSignUpSteps = await getUncompletedSignUpSteps()

  if (uncompletedSignUpSteps.length) {
    redirect(uncompletedSignUpSteps[0])
  }

  return (
    <div className="h-full">
      <CartHeader />
      <main className="bg-grey-200 grid min-h-full gap-6 px-4 py-6 lg:grid-cols-5 lg:gap-8 lg:px-44 lg:pt-11">
        <CartInitializer />
        {children}
      </main>
    </div>
  )
}
