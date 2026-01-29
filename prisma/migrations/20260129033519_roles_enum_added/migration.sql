/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'TUTOR', 'STUDENT');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'STUDENT';
