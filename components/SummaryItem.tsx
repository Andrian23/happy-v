interface SummaryItemProps {
  label?: string
  value?: string | number
  isBold?: boolean
  className?: string
}

const SummaryItem = ({ label, value, isBold = false, className = "" }: SummaryItemProps) => (
  <div
    className={`my-2 flex items-center justify-between text-sm ${isBold ? "text-primary-900" : "text-grey-800"} max-lg:text-xs ${className}`}
  >
    <div>{label}</div>
    <div>{value}</div>
  </div>
)

export default SummaryItem
