import Image from "next/image"

import dotIcon from "@/public/Dot.svg"
import dotCurrentIcon from "@/public/DotCurrent.svg"

interface SignUpStepIndicatorProps {
  currentStep: number
}

const totalSteps = 4

export const SignUpStepIndicator = ({ currentStep }: SignUpStepIndicatorProps) => (
  <div className="absolute bottom-[44px] max-lg:hidden">
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, i) => (
        <Image
          key={i}
          src={i === currentStep ? dotCurrentIcon : dotIcon}
          alt="Dots"
          className={`h-2.5 ${i === currentStep ? "w-6" : "w-2.5"} ${i !== totalSteps - 1 ? "mr-2" : ""}`}
        />
      ))}
    </div>
  </div>
)
