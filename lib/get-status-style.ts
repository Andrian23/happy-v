export type FulfillmentStatus =
  | "FULFILLED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "SCHEDULED"

const fulfillmentStatusStyles: Record<FulfillmentStatus, { color: string; text: string }> = {
  FULFILLED: { color: "text-green-100", text: "Fulfilled" },
  IN_PROGRESS: { color: "text-orange-400", text: "In Progress" },
  ON_HOLD: { color: "text-yellow-300", text: "On Hold" },
  UNFULFILLED: { color: "text-error-500", text: "Unfulfilled" },
  PARTIALLY_FULFILLED: { color: "text-orange-500", text: "Partially Fulfilled" },
  SCHEDULED: { color: "text-blue-500", text: "Scheduled" },
}

const getStatusStyle = (status: string) => {
  const defaultStyle = { color: "text-black", text: "Unknown Status" }
  return fulfillmentStatusStyles[status as FulfillmentStatus] || defaultStyle
}

export default getStatusStyle
