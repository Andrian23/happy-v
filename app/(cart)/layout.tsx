import { ReactNode } from "react"

import { CartHeader } from "@/components/layout/CartHeader"

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full">
      <CartHeader />
      <main className="grid min-h-full gap-6 bg-grey-200 px-4 py-6 lg:grid-cols-5 lg:gap-8 lg:px-44 lg:pt-11">
        {children}
      </main>
    </div>
  )
}
