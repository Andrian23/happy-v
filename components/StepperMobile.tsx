interface StepperStep {
  label: string
}

interface StepperMobileProps {
  steps: StepperStep[]
  currentStep: number
}

export default function StepperMobile({ steps, currentStep }: StepperMobileProps) {
  const totalSteps = steps.length
  const isInitialStep = currentStep === 0
  const isFinalStep = currentStep === totalSteps
  const isPenultimateStep = currentStep === totalSteps - 1

  let progress: number
  if (isInitialStep) {
    progress = 0
  } else if (isFinalStep || isPenultimateStep) {
    progress = 100
  } else {
    progress = (currentStep / (totalSteps - 1)) * 100
  }

  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  let labelText: string
  if (isFinalStep) {
    labelText = "Completed"
  } else if (isInitialStep) {
    labelText = `Next: ${steps[0].label}`
  } else {
    labelText = steps[currentStep - 1].label
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="relative h-[50px] w-[50px]">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <circle
              className={`text-secondary-150`}
              cx="18"
              cy="18"
              fill="transparent"
              r={radius}
              stroke="#E9ECEF"
              strokeWidth={isFinalStep ? 0 : 4}
            />
            {!isInitialStep && (
              <circle
                className="text-primary-brand"
                cx="18"
                cy="18"
                fill="transparent"
                r={radius}
                stroke="#6CB4DA"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="4"
                transform="rotate(-90 18 18)"
              />
            )}
            {isFinalStep ? (
              <text className="text-primary-900 text-xs tracking-wide" dy="0.3em" textAnchor="middle" x="50%" y="50%">
                {`${totalSteps - 1}/${totalSteps - 1}`}
              </text>
            ) : (
              <text className="text-primary-900 text-xs tracking-wide" dy="0.3em" textAnchor="middle" x="50%" y="50%">
                {isInitialStep ? `0/${totalSteps - 1}` : `${currentStep}/${totalSteps - 1}`}
              </text>
            )}
          </svg>
        </div>

        <div>
          <p className="text-primary-900 text-lg font-medium">{labelText}</p>
          {currentStep < totalSteps - 1 && !isInitialStep && (
            <p className="text-grey-800 text-xs">Next: {steps[currentStep].label}</p>
          )}
        </div>
      </div>
    </div>
  )
}
