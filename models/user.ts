import { PartnerStatus, VerificationUserStatus } from "@/models/participants"
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
  referralCode?: string | null
  referralLink?: string | null
  signUpStep3Completed?: boolean
  signUpStep4Completed?: boolean
  npiNumber?: string | null
  verificationStatus?: VerificationUserStatus
  verificationDate?: Date | null
  verificationNotes?: string
  verifiedBy?: string
  partnerStatus?: PartnerStatus
  partnerStatusDate?: Date | null
  partnerNotes?: string
  partnerReviewedBy?: string
  commissionRate: number
}
