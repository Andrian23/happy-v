import { ApprovalUserStatus, PartnerStatus } from "@/models/participants"
import type { ShippingAddress } from "@/models/shipping"

export interface User {
  id: string
  name: string | null
  lastName: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  telephone: string | null
  type_proffesion: string | null
  place_work: string | null
  practical_size: string | null
  role: string | null
  createdAt: Date | null
  updatedAt: Date | null
  isTwoFactorEnable: boolean
  stripeCustomerId?: string | null
  shippingAddresses?: ShippingAddress[]
  defaultShippingAddress: number | null
  signUpStep3Completed?: boolean
  signUpStep4Completed?: boolean
  npiNumber?: string | null
  approvalStatus?: ApprovalUserStatus
  approvalStatusUpdatedAt?: Date | null
  approvalNotes?: string
  approvedBy?: string
  partnerStatus?: PartnerStatus
  partnerStatusUpdatedAt?: Date | null
  partnerApprovalNotes?: string
  partnerApprovedBy?: string
}
