/*
  Warnings:

  - Added the required column `coverImg` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoImg` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "coverImg" TEXT NOT NULL,
ADD COLUMN     "logoImg" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
