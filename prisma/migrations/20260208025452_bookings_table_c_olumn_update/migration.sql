/*
  Warnings:

  - You are about to drop the column `subject_id` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_subject_id_fkey";

-- DropIndex
DROP INDEX "bookings_subject_id_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "subject_id",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT 'Bangla';

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
