import { ChartCardFormattedData } from "@/components/ChartCard"

export const terms = [
  {
    title: "50%",
    description: "Earn commission on the first month of a product subscription",
  },
  {
    title: "30%",
    description: "Earn commission on one-time purchases",
  },
  {
    title: "-30%",
    description: "For off wholesale products",
  },
]

export const mockTotalNetSales: ChartCardFormattedData = {
  title: "Total net sales",
  tabs: [],
  count: 0,
  prefix: "$",
  tooltip:
    "The total revenue generated from all completed sales made via affiliate links. This value does not include returns  data: undefined,",
  differenceFromPreviousPeriod: "",
  differenceArrow: false,
  data: undefined,
}

export const mockCommissionEarned: ChartCardFormattedData = {
  title: "Commission earned",
  count: 0,
  prefix: "$",
  tabs: ["All", "One-time", "Subscription"],
  tooltip:
    "The total commission earned from sales made via your affiliate links. This includes only completed purchases and excludes refunds or pending transactions.",
  data: undefined,
  differenceFromPreviousPeriod: "",
  differenceArrow: false,
}

export const defaultEarnings = [mockTotalNetSales, mockCommissionEarned]
