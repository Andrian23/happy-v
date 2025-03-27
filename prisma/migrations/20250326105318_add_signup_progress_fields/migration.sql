-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signUpStep3Completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signUpStep4Completed" BOOLEAN NOT NULL DEFAULT false;