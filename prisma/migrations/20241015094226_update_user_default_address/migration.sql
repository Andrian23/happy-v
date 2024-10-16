/*
  Warnings:

  - You are about to drop the column `isDefault` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ShippingAddress_userId_isDefault_key";

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "isDefault";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultShippingAddress" INTEGER;
