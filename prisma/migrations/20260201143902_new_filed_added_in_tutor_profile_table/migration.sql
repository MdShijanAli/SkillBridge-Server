-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN     "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[];
