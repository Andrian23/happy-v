import Image from "next/image"

import check3Icon from "@/public/Check3.svg"
import checkGoodIcon from "@/public/CheckGood.svg"
import checkNowIcon from "@/public/CheckNow.svg"

interface SignUpStepsProps {
  currentStep: number
}

const icons = {
  completed: checkGoodIcon,
  current: check3Icon,
  incomplete: checkNowIcon,
}

const steps = [
  {
    title: "Create Professional Account",
    description: "Tell us a bit about yourself",
  },
  {
    title: "Choose your Sign up method",
    description: "Choose the most convenient option for you",
  },
  {
    title: "Upload your Professional Credentials",
    description: "Upload your Professional Credentials",
  },
  {
    title: "Review our Terms",
    description: "Last review our terms and launch account",
  },
]

export const SignUpSteps = ({ currentStep }: SignUpStepsProps) => (
  <div className="text-primary-900">
    {steps.map(({ title, description }, i) => {
      let icon
      if (i < currentStep) {
        icon = icons.completed
      } else if (i === currentStep) {
        icon = icons.current
      } else {
        icon = icons.incomplete
      }

      return (
        <div key={i} className={`mt-[24px] flex justify-start items-start${i !== 0 ? "mt-[24px]" : ""}`}>
          <Image src={icon} alt="Check icon" className="h-6 w-6" />
          <div className="ml-2">
            <div className="text-sm font-semibold text-primary-900">{title}</div>
            <div className="mt-1 text-[12px] font-medium text-grey-800">{description}</div>
          </div>
        </div>
      )
    })}
  </div>
)
