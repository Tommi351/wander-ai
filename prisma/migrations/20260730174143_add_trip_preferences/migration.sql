-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('BUDGET', 'MID_RANGE', 'LUXURY');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('SOLO', 'COUPLE', 'FAMILY', 'FRIENDS', 'BUSINESS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MessageRole" ADD VALUE 'SYSTEM';
ALTER TYPE "MessageRole" ADD VALUE 'DEVELOPER';

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "budgetTier" "BudgetTier",
ADD COLUMN     "groupType" "GroupType",
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "travelers" INTEGER;
