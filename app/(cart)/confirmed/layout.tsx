import { ReactNode } from "react"

const ConfirmedOrderLayout = ({ children }: { children: ReactNode }) => {
  return <div className="h-full w-full lg:col-span-5">{children}</div>
}

export default ConfirmedOrderLayout
