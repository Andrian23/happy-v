import { type DefaultSession } from "next-auth"

import { UserRole } from "@prisma/client"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  id: string
  defaultShippingAddress?: number | null
  telephone?: string
  signUpStep3Completed?: boolean
  signUpStep4Completed?: boolean
  approvalStatus: ApprovalUserStatus
  partnerStatus: PartnerStatus
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
