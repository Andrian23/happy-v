import { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

import logo from "@/public/Logo_cl.svg"

import { SignUpStepIndicator } from "./SignUpStepIndicator"
import { SignUpSteps } from "./SignUpSteps"

interface SignUpLayoutProps {
  currentStep: number
  children: ReactNode
}

export const SignUpLayout = ({ currentStep, children }: SignUpLayoutProps) => {
  const isLastStep = currentStep >= 4

  return (
    <>
      <div className="lg:hidden">
        <div className="fixed top-0 h-[50px] w-full border-b border-black/15 bg-white lg:hidden">
          <div className="flex items-center justify-center p-4 max-md:p-[1.125rem]">
            <div className="logo">
              <Link href="/dashboard">
                <Image src={logo} alt="Logo" className="h-[50px] w-[120px] object-contain" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mim-lg:m-4 m-4 flex justify-center">
        <div className="flex h-[96vh] w-[466px] flex-col flex-nowrap justify-between rounded-2xl bg-grey-200 p-[32px] max-lg:hidden min-[1900px]:h-[98vh]">
          <div className="logo flex flex-col flex-nowrap justify-between">
            <Image src={logo} alt="HAPPY V" className="h-[50px] w-[120px] object-contain" />

            <div className="flex flex-col flex-nowrap justify-between">
              <SignUpSteps currentStep={currentStep} />
            </div>
          </div>

          <div className="mt-5 flex justify-between text-[12px] text-grey-800">
            <div className="mr-5 mt-auto">© 2021-2024 Happy V</div>
            <div className="ml-5">
              <div className="">hello@happyv.com</div>
              <div className="">+1 (831) 208-3459</div>
            </div>
          </div>
        </div>

        <div className={`flex w-[35%] max-lg:w-[100%] ${isLastStep ? "m-auto" : "mx-auto"} max-lg:mt-12`}>
          {!isLastStep && (
            <div className="my-4 text-left text-[16px] text-primary-900 lg:hidden">{currentStep + 1} / 4</div>
          )}
          <div className="flex flex-col items-center justify-center max-md:mt-2">
            {children}
            {!isLastStep && <SignUpStepIndicator currentStep={currentStep} />}
          </div>
        </div>
      </div>
    </>
  )
}
