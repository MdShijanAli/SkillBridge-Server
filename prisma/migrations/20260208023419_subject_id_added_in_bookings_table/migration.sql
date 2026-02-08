/*
  Warnings:

  - You are about to drop the column `category_id` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_category_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "category_id",
ADD COLUMN     "subject_id" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "bookings_subject_id_idx" ON "bookings"("subject_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
