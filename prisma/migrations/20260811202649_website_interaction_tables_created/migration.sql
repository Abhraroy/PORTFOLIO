-- CreateTable
CREATE TABLE "HeroSectionCMS" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'HERO_NODES_MAIN',
    "centerNodeLabel" TEXT NOT NULL DEFAULT 'blankdev',
    "centerLogoUrl" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSectionCMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroNodeCMSItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaLabel" TEXT DEFAULT 'View projects',
    "ctaHref" TEXT DEFAULT '/#work',
    "image" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "cardWidth" TEXT,
    "cardHeight" TEXT,
    "cardMinHeight" TEXT,
    "cardImageHeight" TEXT,
    "titleFontSize" TEXT,
    "descriptionFontSize" TEXT,
    "techBadgeFontSize" TEXT,
    "ctaFontSize" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroNodeCMSItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteInteraction" (
    "id" TEXT NOT NULL,
    "resume_downloaded" INTEGER NOT NULL DEFAULT 0,
    "contact_form_submit" INTEGER NOT NULL DEFAULT 0,
    "contact_interested" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectClicked" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "project_clicked" INTEGER NOT NULL DEFAULT 0,
    "project_viewed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectClicked_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSectionCMS_key_key" ON "HeroSectionCMS"("key");

-- CreateIndex
CREATE INDEX "HeroNodeCMSItem_sectionId_idx" ON "HeroNodeCMSItem"("sectionId");

-- CreateIndex
CREATE INDEX "HeroNodeCMSItem_nodeId_idx" ON "HeroNodeCMSItem"("nodeId");

-- CreateIndex
CREATE INDEX "HeroNodeCMSItem_displayOrder_idx" ON "HeroNodeCMSItem"("displayOrder");

-- CreateIndex
CREATE INDEX "ProjectClicked_projectId_idx" ON "ProjectClicked"("projectId");

-- AddForeignKey
ALTER TABLE "HeroNodeCMSItem" ADD CONSTRAINT "HeroNodeCMSItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "HeroSectionCMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
