-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "experience_image" TEXT,
ADD COLUMN     "experience_tech" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ExperienceModeContent" ADD COLUMN     "experience_summary" TEXT;
