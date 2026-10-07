-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'SELF_EMPLOYED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('PERSONAL', 'PROFESSIONAL', 'OPEN_SOURCE', 'CLIENT_WORK', 'SIDE_PROJECT');

-- CreateEnum
CREATE TYPE "ProjectVisibilityStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED', 'DRAFT');

-- CreateEnum
CREATE TYPE "PortfolioBlockType" AS ENUM ('HERO', 'CARD', 'PROFILE', 'TEXT', 'LIST', 'MEDIA', 'CTA');

-- CreateEnum
CREATE TYPE "PortfolioBlockItemType" AS ENUM ('TEXT', 'BULLET', 'LINK');

-- CreateTable
CREATE TABLE "PortfolioMode" (
    "id" TEXT NOT NULL,
    "mode_name" TEXT NOT NULL,
    "mode_description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "project_image" TEXT,
    "project_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "project_videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "project_url" TEXT,
    "project_github" TEXT,
    "project_md_url" TEXT,
    "project_tags" TEXT[],
    "project_tech" TEXT[],
    "project_status" "ProjectStatus" NOT NULL,
    "project_type" "ProjectType" NOT NULL,
    "project_visibility_status" "ProjectVisibilityStatus" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectModeContent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "portfolioModeId" TEXT NOT NULL,
    "project_description" TEXT,
    "project_highlights" TEXT[],
    "project_user_count" INTEGER,
    "project_revenue" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectModeContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "employment_type" "EmploymentType" NOT NULL,
    "location" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "currently_working" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceModeContent" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "portfolioModeId" TEXT NOT NULL,
    "experience_description" TEXT,
    "experience_highlights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceModeContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyDetails" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "profile_image" TEXT,
    "resume_url" TEXT,
    "email" TEXT NOT NULL,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "x_url" TEXT,
    "instagram_url" TEXT,
    "discord_url" TEXT,
    "website_url" TEXT,
    "location" TEXT,
    "years_of_experience" INTEGER DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyDetailsModeContent" (
    "id" TEXT NOT NULL,
    "myDetailsId" TEXT NOT NULL,
    "portfolioModeId" TEXT NOT NULL,
    "headline" TEXT,
    "short_bio" TEXT,
    "detailed_bio" TEXT,
    "highlights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MyDetailsModeContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioBlock" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "portfolioModeId" TEXT,
    "blockNumber" INTEGER NOT NULL,
    "type" "PortfolioBlockType" NOT NULL DEFAULT 'CARD',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT,
    "heading" TEXT,
    "subheading" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "ctaType" TEXT,
    "ctaVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioBlockItem" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "type" "PortfolioBlockItemType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioBlockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceMetric" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceAchievement" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectHighlight" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceSectionCMS" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'EXPERIENCE_MAIN',
    "defaultActiveId" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceSectionCMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceSectionCMSItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "showYear" BOOLEAN NOT NULL DEFAULT true,
    "showRole" BOOLEAN NOT NULL DEFAULT true,
    "showCompany" BOOLEAN NOT NULL DEFAULT true,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showTechnologies" BOOLEAN NOT NULL DEFAULT true,
    "showAchievements" BOOLEAN NOT NULL DEFAULT true,
    "showMetrics" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceSectionCMSItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedWorkSectionCMS" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'SELECTED_WORK_MAIN',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelectedWorkSectionCMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedWorkSectionCMSItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "offset" TEXT,
    "customNumber" TEXT,
    "showOneLiner" BOOLEAN NOT NULL DEFAULT true,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showTechnologies" BOOLEAN NOT NULL DEFAULT true,
    "showHighlights" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelectedWorkSectionCMSItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectShowcaseSectionCMS" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'PROJECT_SHOWCASE_MAIN',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectShowcaseSectionCMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectShowcaseSectionCMSItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showTechnologies" BOOLEAN NOT NULL DEFAULT true,
    "showViewAction" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectShowcaseSectionCMSItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioMode_mode_name_key" ON "PortfolioMode"("mode_name");

-- CreateIndex
CREATE INDEX "PortfolioMode_mode_name_idx" ON "PortfolioMode"("mode_name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_project_status_idx" ON "Project"("project_status");

-- CreateIndex
CREATE INDEX "Project_project_type_idx" ON "Project"("project_type");

-- CreateIndex
CREATE INDEX "Project_project_visibility_status_idx" ON "Project"("project_visibility_status");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectModeContent_projectId_idx" ON "ProjectModeContent"("projectId");

-- CreateIndex
CREATE INDEX "ProjectModeContent_portfolioModeId_idx" ON "ProjectModeContent"("portfolioModeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectModeContent_projectId_portfolioModeId_key" ON "ProjectModeContent"("projectId", "portfolioModeId");

-- CreateIndex
CREATE INDEX "Experience_company_name_idx" ON "Experience"("company_name");

-- CreateIndex
CREATE INDEX "Experience_start_date_idx" ON "Experience"("start_date");

-- CreateIndex
CREATE INDEX "Experience_currently_working_idx" ON "Experience"("currently_working");

-- CreateIndex
CREATE INDEX "ExperienceModeContent_experienceId_idx" ON "ExperienceModeContent"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceModeContent_portfolioModeId_idx" ON "ExperienceModeContent"("portfolioModeId");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceModeContent_experienceId_portfolioModeId_key" ON "ExperienceModeContent"("experienceId", "portfolioModeId");

-- CreateIndex
CREATE UNIQUE INDEX "MyDetails_email_key" ON "MyDetails"("email");

-- CreateIndex
CREATE INDEX "MyDetailsModeContent_myDetailsId_idx" ON "MyDetailsModeContent"("myDetailsId");

-- CreateIndex
CREATE INDEX "MyDetailsModeContent_portfolioModeId_idx" ON "MyDetailsModeContent"("portfolioModeId");

-- CreateIndex
CREATE UNIQUE INDEX "MyDetailsModeContent_myDetailsId_portfolioModeId_key" ON "MyDetailsModeContent"("myDetailsId", "portfolioModeId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioSection_key_key" ON "PortfolioSection"("key");

-- CreateIndex
CREATE INDEX "PortfolioSection_key_idx" ON "PortfolioSection"("key");

-- CreateIndex
CREATE INDEX "PortfolioBlock_sectionId_idx" ON "PortfolioBlock"("sectionId");

-- CreateIndex
CREATE INDEX "PortfolioBlock_portfolioModeId_idx" ON "PortfolioBlock"("portfolioModeId");

-- CreateIndex
CREATE INDEX "PortfolioBlock_blockNumber_idx" ON "PortfolioBlock"("blockNumber");

-- CreateIndex
CREATE INDEX "PortfolioBlockItem_blockId_idx" ON "PortfolioBlockItem"("blockId");

-- CreateIndex
CREATE INDEX "PortfolioBlockItem_order_idx" ON "PortfolioBlockItem"("order");

-- CreateIndex
CREATE INDEX "ExperienceMetric_experienceId_idx" ON "ExperienceMetric"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceMetric_order_idx" ON "ExperienceMetric"("order");

-- CreateIndex
CREATE INDEX "ExperienceAchievement_experienceId_idx" ON "ExperienceAchievement"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceAchievement_order_idx" ON "ExperienceAchievement"("order");

-- CreateIndex
CREATE INDEX "ProjectHighlight_projectId_idx" ON "ProjectHighlight"("projectId");

-- CreateIndex
CREATE INDEX "ProjectHighlight_order_idx" ON "ProjectHighlight"("order");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceSectionCMS_key_key" ON "ExperienceSectionCMS"("key");

-- CreateIndex
CREATE INDEX "ExperienceSectionCMSItem_sectionId_idx" ON "ExperienceSectionCMSItem"("sectionId");

-- CreateIndex
CREATE INDEX "ExperienceSectionCMSItem_experienceId_idx" ON "ExperienceSectionCMSItem"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceSectionCMSItem_displayOrder_idx" ON "ExperienceSectionCMSItem"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceSectionCMSItem_sectionId_experienceId_key" ON "ExperienceSectionCMSItem"("sectionId", "experienceId");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedWorkSectionCMS_key_key" ON "SelectedWorkSectionCMS"("key");

-- CreateIndex
CREATE INDEX "SelectedWorkSectionCMSItem_sectionId_idx" ON "SelectedWorkSectionCMSItem"("sectionId");

-- CreateIndex
CREATE INDEX "SelectedWorkSectionCMSItem_projectId_idx" ON "SelectedWorkSectionCMSItem"("projectId");

-- CreateIndex
CREATE INDEX "SelectedWorkSectionCMSItem_displayOrder_idx" ON "SelectedWorkSectionCMSItem"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SelectedWorkSectionCMSItem_sectionId_projectId_key" ON "SelectedWorkSectionCMSItem"("sectionId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectShowcaseSectionCMS_key_key" ON "ProjectShowcaseSectionCMS"("key");

-- CreateIndex
CREATE INDEX "ProjectShowcaseSectionCMSItem_sectionId_idx" ON "ProjectShowcaseSectionCMSItem"("sectionId");

-- CreateIndex
CREATE INDEX "ProjectShowcaseSectionCMSItem_projectId_idx" ON "ProjectShowcaseSectionCMSItem"("projectId");

-- CreateIndex
CREATE INDEX "ProjectShowcaseSectionCMSItem_displayOrder_idx" ON "ProjectShowcaseSectionCMSItem"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectShowcaseSectionCMSItem_sectionId_projectId_key" ON "ProjectShowcaseSectionCMSItem"("sectionId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectModeContent" ADD CONSTRAINT "ProjectModeContent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectModeContent" ADD CONSTRAINT "ProjectModeContent_portfolioModeId_fkey" FOREIGN KEY ("portfolioModeId") REFERENCES "PortfolioMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceModeContent" ADD CONSTRAINT "ExperienceModeContent_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceModeContent" ADD CONSTRAINT "ExperienceModeContent_portfolioModeId_fkey" FOREIGN KEY ("portfolioModeId") REFERENCES "PortfolioMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyDetailsModeContent" ADD CONSTRAINT "MyDetailsModeContent_myDetailsId_fkey" FOREIGN KEY ("myDetailsId") REFERENCES "MyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyDetailsModeContent" ADD CONSTRAINT "MyDetailsModeContent_portfolioModeId_fkey" FOREIGN KEY ("portfolioModeId") REFERENCES "PortfolioMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBlock" ADD CONSTRAINT "PortfolioBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "PortfolioSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBlock" ADD CONSTRAINT "PortfolioBlock_portfolioModeId_fkey" FOREIGN KEY ("portfolioModeId") REFERENCES "PortfolioMode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioBlockItem" ADD CONSTRAINT "PortfolioBlockItem_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "PortfolioBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceMetric" ADD CONSTRAINT "ExperienceMetric_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceAchievement" ADD CONSTRAINT "ExperienceAchievement_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectHighlight" ADD CONSTRAINT "ProjectHighlight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceSectionCMSItem" ADD CONSTRAINT "ExperienceSectionCMSItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ExperienceSectionCMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceSectionCMSItem" ADD CONSTRAINT "ExperienceSectionCMSItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedWorkSectionCMSItem" ADD CONSTRAINT "SelectedWorkSectionCMSItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SelectedWorkSectionCMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedWorkSectionCMSItem" ADD CONSTRAINT "SelectedWorkSectionCMSItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectShowcaseSectionCMSItem" ADD CONSTRAINT "ProjectShowcaseSectionCMSItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ProjectShowcaseSectionCMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectShowcaseSectionCMSItem" ADD CONSTRAINT "ProjectShowcaseSectionCMSItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
