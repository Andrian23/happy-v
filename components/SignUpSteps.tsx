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
    title: "Let’s Set Up Your Profile",
    description:
      "To get started, we just need a few details from you. This helps us personalize your experience and connect you with the right opportunities.",
  },
  {
    title: "Choose Your Sign-Up Method",
    description: "To make things faster and easier, select how you’d like to sign up.",
  },
  {
    title: "Tell Us About Your Practice",
    description: "Let us know more about your professional background so we can provide a tailored experience for you.",
  },
  {
    title: "Upload Credentials",
    description:
      "To confirm your professional background, please upload your credentials. This helps us ensure we’re partnering with qualified experts.",
  },
]

export const SignUpSteps = ({ currentStep }: SignUpStepsProps) => (
  <div className="text-primary-900 mt-[30px]">
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
        <div key={i} className={`mt-[32px] flex justify-start items-start${i !== 0 ? "mt-[24px]" : ""}`}>
          <Image src={icon} alt="Check icon" className="h-6 w-6" />
          <div className="ml-2">
            <div className="text-primary-900 text-sm font-semibold">{title}</div>
            <div className="text-grey-800 mt-1 text-[12px] font-medium">{description}</div>
          </div>
        </div>
      )
    })}
  </div>
)
