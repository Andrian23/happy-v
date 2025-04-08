/*
  Warnings:

  - You are about to drop the column `approvalNotes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `approvalStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `approvalStatusUpdatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partnerApprovalNotes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partnerApprovedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partnerStatusUpdatedAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'DECLINED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "approvalNotes",
DROP COLUMN "approvalStatus",
DROP COLUMN "approvalStatusUpdatedAt",
DROP COLUMN "approvedBy",
DROP COLUMN "partnerApprovalNotes",
DROP COLUMN "partnerApprovedBy",
DROP COLUMN "partnerStatusUpdatedAt",
ADD COLUMN     "partnerNotes" TEXT,
ADD COLUMN     "partnerReviewedBy" TEXT,
ADD COLUMN     "partnerStatusDate" TIMESTAMP(3),
ADD COLUMN     "verificationDate" TIMESTAMP(3),
ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "verifiedBy" TEXT;

-- DropEnum
DROP TYPE "ApprovalUserStatus";
