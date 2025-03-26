import { ReactNode } from "react"
import Image from "next/image"

import logo from "@/public/Logo_cl.svg"

import { SignUpStepIndicator } from "./SignUpStepIndicator"
import { SignUpSteps } from "./SignUpSteps"
import StepperMobile from "./StepperMobile"

interface SignUpLayoutProps {
  currentStep: number
  children: ReactNode
}

const steps = [
  { label: "Let’s Set Up Your Profile" },
  { label: "Choose Your Sign-Up Method" },
  { label: "Tell Us About Your Practice" },
  { label: "Upload Credentials" },
  { label: "Upload Credentials" },
]

export const SignUpLayout = ({ currentStep, children }: SignUpLayoutProps) => {
  const isLastStep = currentStep >= 4

  return (
    <>
      <div className="lg:hidden">
        <div className="fixed top-0 w-full border-b border-black/15 bg-white lg:hidden">
          <div className="flex items-center p-4 max-md:p-4">
            <StepperMobile currentStep={currentStep + 1} steps={steps} />
          </div>
        </div>
      </div>

      <div className="mim-lg:p-4 flex justify-center p-4">
        <div className="bg-grey-200 flex max-h-full min-h-[96vh] w-[466px] flex-col flex-nowrap justify-between rounded-2xl p-[32px] max-lg:hidden min-[1900px]:h-[98vh]">
          <div className="logo flex flex-col flex-nowrap justify-between">
            <Image src={logo} alt="HAPPY V" className="h-[50px] w-[120px] object-contain" />

            <div className="flex flex-col flex-nowrap justify-between">
              <SignUpSteps currentStep={currentStep} />
            </div>
          </div>

          <div className="text-grey-800 mt-5 flex justify-between text-[12px]">
            <div className="mt-auto mr-5">© 2021-2024 Happy V</div>
            <div className="ml-5">
              <div className="">hello@happyv.com</div>
              <div className="">+1 (831) 208-3459</div>
            </div>
          </div>
        </div>

        <div
          className={`flex w-[35%] flex-col justify-center max-lg:w-[100%] ${isLastStep ? "m-auto" : "mx-auto"} max-lg:mt-16`}
        >
          <div className="relative flex flex-col items-center justify-center pb-[70px] max-md:mt-6">
            {children}
            {!isLastStep && <SignUpStepIndicator currentStep={currentStep} />}
          </div>
        </div>
      </div>
    </>
  )
}
