export enum ApprovalUserStatus {
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

export const ApprovalUserStatusReverseMap: { [value: string]: ApprovalUserStatus } = Object.fromEntries(
  Object.entries(ApprovalUserStatus).map(([key, value]) => [value, key])
) as { [value: string]: ApprovalUserStatus }

export const PartnerStatusReverseMap: { [value: string]: PartnerStatus } = Object.fromEntries(
  Object.entries(PartnerStatus).map(([key, value]) => [value, key])
) as { [value: string]: PartnerStatus }
