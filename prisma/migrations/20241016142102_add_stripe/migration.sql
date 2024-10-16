-- AlterTable
ALTER TABLE "CartOrder" ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;
