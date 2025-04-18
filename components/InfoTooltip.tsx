import { useState } from "react"
import { Info } from "lucide-react"

interface InfoTooltipProps {
  text: string
  bgColor?: string
  textColor?: string
  iconSize?: number
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  bgColor = "bg-primary-900",
  textColor = "text-white",
  iconSize = 16,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-flex items-center">
      <div className="cursor-help" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        <Info size={iconSize} color="rgba(138, 149, 161)" />
      </div>

      {showTooltip && (
        <div
          className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded px-3 py-1 text-sm ${bgColor} ${textColor} z-10 w-72 break-words whitespace-normal shadow-md`}
        >
          {text}
          <div className={`absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 ${bgColor}`}></div>
        </div>
      )}
    </div>
  )
}
