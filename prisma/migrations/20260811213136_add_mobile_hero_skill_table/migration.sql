-- CreateTable
CREATE TABLE "MobileHeroSkill" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileHeroSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MobileHeroSkill_displayOrder_idx" ON "MobileHeroSkill"("displayOrder");
