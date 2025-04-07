-- CreateEnum
CREATE TYPE "ApprovalUserStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'DECLINED');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('NOT_APPLIED', 'PENDING_REVIEW', 'ACTIVE', 'DECLINED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvalNotes" TEXT,
ADD COLUMN     "approvalStatus" "ApprovalUserStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "approvalStatusUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "partnerApprovalNotes" TEXT,
ADD COLUMN     "partnerApprovedBy" TEXT,
ADD COLUMN     "partnerStatus" "PartnerStatus" NOT NULL DEFAULT 'NOT_APPLIED',
ADD COLUMN     "partnerStatusUpdatedAt" TIMESTAMP(3);
