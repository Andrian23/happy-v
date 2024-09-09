import { ChevronRight } from "lucide-react"

type CurrentStep = "cart" | "shipping" | "payment"

const Breadcrumbs = ({ currentStep }: { currentStep: CurrentStep }) => {
  const getStepClass = (step: CurrentStep) => {
    return currentStep === step ? "text-primary-500" : "text-grey-800"
  }

  return (
    <div className="flex h-10 w-full items-center justify-start bg-grey-200 px-[10rem] py-8 max-lg:px-4">
      <div className={`text-sm ${getStepClass("cart")}`}>Cart</div>
      <ChevronRight className="mx-2" color="#7C8E9E" width={15} height={15} />
      <div className={`text-sm ${getStepClass("shipping")}`}>Shipping</div>
      <ChevronRight className="mx-2" color="#7C8E9E" width={15} height={15} />
      <div className={`text-sm ${getStepClass("payment")}`}>Payment</div>
    </div>
  )
}

export default Breadcrumbs
