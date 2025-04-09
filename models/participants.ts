export enum VerificationUserStatus {
  PENDING_REVIEW = "pending_review",
  ACTIVE = "active",
  DECLINED = "declined",
}

export enum PartnerStatus {
  NOT_APPLIED = "not_applied",
  PENDING_REVIEW = "pending_review",
  ACTIVE = "active",
  DECLINED = "declined",
}

export const VerificationUserStatusReverseMap: { [value: string]: VerificationUserStatus } = Object.fromEntries(
  Object.entries(VerificationUserStatus).map(([key, value]) => [value, key])
) as { [value: string]: VerificationUserStatus }

export const PartnerStatusReverseMap: { [value: string]: PartnerStatus } = Object.fromEntries(
  Object.entries(PartnerStatus).map(([key, value]) => [value, key])
) as { [value: string]: PartnerStatus }
