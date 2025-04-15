import Image from "next/image"
import Link from "next/link"

import dotIcon from "@/public/Dot.svg"
import dotCompletedIcon from "@/public/DotBlue.svg"
import dotCurrentIcon from "@/public/DotCurrent.svg"

interface SignUpStepIndicatorProps {
  currentStep: number
}

const totalSteps = 4

export const SignUpStepIndicator = ({ currentStep }: SignUpStepIndicatorProps) => (
  <div className="absolute bottom-0 max-lg:hidden">
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, i) => (
        <Link
          key={i}
          href={`/sign-up${i < currentStep ? (i === 0 ? "" : "-" + (i + 1)) : currentStep === 0 ? "" : "-" + i}`}
        >
          <Image
            src={i === currentStep ? dotCurrentIcon : i < currentStep ? dotCompletedIcon : dotIcon}
            alt="Dots"
            className={`h-2.5 ${i === currentStep ? "w-6" : "w-2.5"} ${i !== totalSteps - 1 ? "mr-2" : ""}`}
          />
        </Link>
      ))}
    </div>
  </div>
)
