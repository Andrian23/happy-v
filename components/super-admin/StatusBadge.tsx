import { format } from "date-fns"

import { VerificationUserStatus, VerificationUserStatusReverseMap } from "@/models/participants"

const StatusBadge = ({
  status,
  date,
}: {
  status: VerificationUserStatus | undefined
  date: Date | null | undefined
}) => {
  const isDeclined = status === VerificationUserStatusReverseMap[VerificationUserStatus.DECLINED]

  return (
    <div
      className={`text-primary-900 rounded-full px-2.5 py-2 text-sm font-normal ${isDeclined ? "bg-red/10" : "bg-green-100/10"}`}
    >
      {isDeclined ? "Declined: " : "Approved: "}
      {date ? format(date, "MM/d/yyyy") : "-"}
    </div>
  )
}

export default StatusBadge
