import React from "react"
import Image from "next/image"
import Link from "next/link"

import logo from "@/public/Logo_cl.svg"

export default async function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="mobile-header lg:hidden">
        <div className="header-mobile fixed top-0 h-[50px] w-full border-b border-black/15 bg-white lg:hidden">
          <div className="header-container flex items-center justify-center p-4 max-md:p-[1.125rem]">
            <div className="logo">
              <Link href="/dashboard">
                <Image src={logo} alt="Dollar Icon" className="h-[50px] w-[120px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mim-lg:m-4 m-4 flex h-full justify-center">
        <div className="flex h-[96vh] w-[446px] flex-col flex-nowrap justify-between rounded-2xl bg-grey-200 p-[32px] max-lg:hidden min-[1900px]:h-[98vh]">
          <div className="logo">
            <Image src={logo} alt="HAPPY V" className="h-[50px] w-[120px]" />
          </div>

          <div className="text-primary-900">
            <div className="text-[32px] font-semibold">Welcome to</div>
            <div className="text-[32px] font-semibold">Happy V Professionals</div>
          </div>

          <div className="mt-5 flex justify-between text-[12px] text-grey-800">
            <div className="mr-5 mt-auto">© 2021-2024 Happy V</div>
            <div className="ml-5">
              <div className="">hello@happyv.com</div>
              <div className="">+1 (831) 208-3459</div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}
