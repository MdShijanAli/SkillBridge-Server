/*
  Warnings:

  - You are about to drop the column `scheduled_at` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `scheduleDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTime` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bookings_scheduled_at_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "scheduled_at",
ADD COLUMN     "scheduleDate" TEXT NOT NULL,
ADD COLUMN     "scheduleTime" TEXT NOT NULL;
