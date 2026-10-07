/*
  Warnings:

  - The primary key for the `WebsiteInteraction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `WebsiteInteraction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ProjectClicked` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "WebsiteInteraction" DROP CONSTRAINT "WebsiteInteraction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "WebsiteInteraction_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ProjectClicked";

-- CreateTable
CREATE TABLE "ProjectInteraction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "project_clicked" INTEGER NOT NULL DEFAULT 0,
    "project_viewed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInteraction_projectId_key" ON "ProjectInteraction"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectInteraction" ADD CONSTRAINT "ProjectInteraction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
