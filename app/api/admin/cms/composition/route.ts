import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [experienceCMS, selectedWorkCMS, projectShowcaseCMS, heroNodesCMS] = await Promise.all([
      prisma.experienceSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.selectedWorkSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.projectShowcaseSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.heroSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
    ]);

    return NextResponse.json({
      experienceCMS,
      selectedWorkCMS,
      projectShowcaseCMS,
      heroNodesCMS,
    });
  } catch (error: any) {
    console.error("GET /api/admin/cms/composition error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionType, data, items } = body;

    if (sectionType === "HERO_NODES") {
      let section = await prisma.heroSectionCMS.findFirst();
      if (!section) {
        section = await prisma.heroSectionCMS.create({
          data: { key: "HERO_NODES_MAIN", centerNodeLabel: data?.centerNodeLabel || "blankdev", visible: true },
        });
      }

      if (data) {
        section = await prisma.heroSectionCMS.update({
          where: { id: section.id },
          data: {
            ...(data.centerNodeLabel !== undefined && { centerNodeLabel: data.centerNodeLabel }),
            ...(data.centerLogoUrl !== undefined && { centerLogoUrl: data.centerLogoUrl }),
            ...(data.visible !== undefined && { visible: data.visible }),
          },
        });
      }

      if (Array.isArray(items)) {
        await prisma.heroNodeCMSItem.deleteMany({
          where: { sectionId: section.id },
        });
        if (items.length > 0) {
          await prisma.heroNodeCMSItem.createMany({
            data: items.map((item: any, idx: number) => ({
              sectionId: section.id,
              nodeId: item.nodeId || `node-${idx + 1}`,
              label: item.label || "Skill Node",
              title: item.title || "Node Title",
              description: item.description || "Node Description",
              techStack: Array.isArray(item.techStack) ? item.techStack : [],
              ctaLabel: item.ctaLabel || "View projects",
              ctaHref: item.ctaHref || "/#work",
              image: item.image || null,
              displayOrder: item.displayOrder ?? idx + 1,
              visible: item.visible ?? true,
              cardWidth: item.cardWidth || null,
              cardHeight: item.cardHeight || null,
              cardMinHeight: item.cardMinHeight || null,
              cardImageHeight: item.cardImageHeight || null,
              titleFontSize: item.titleFontSize || null,
              descriptionFontSize: item.descriptionFontSize || null,
              techBadgeFontSize: item.techBadgeFontSize || null,
              ctaFontSize: item.ctaFontSize || null,
            })),
          });
        }
      }

      const result = await prisma.heroSectionCMS.findUnique({
        where: { id: section.id },
        include: { items: { orderBy: { displayOrder: "asc" } } },
      });
      return NextResponse.json(result);
    }

    if (sectionType === "EXPERIENCE") {
      let section = await prisma.experienceSectionCMS.findFirst();
      if (!section) {
        section = await prisma.experienceSectionCMS.create({
          data: { key: "EXPERIENCE_MAIN", visible: true },
        });
      }

      if (data) {
        section = await prisma.experienceSectionCMS.update({
          where: { id: section.id },
          data: {
            ...(data.defaultActiveId !== undefined && { defaultActiveId: data.defaultActiveId }),
            ...(data.visible !== undefined && { visible: data.visible }),
          },
        });
      }

      if (Array.isArray(items)) {
        await prisma.experienceSectionCMSItem.deleteMany({
          where: { sectionId: section.id },
        });
        if (items.length > 0) {
          await prisma.experienceSectionCMSItem.createMany({
            data: items.map((item: any, idx: number) => ({
              sectionId: section.id,
              experienceId: item.experienceId,
              displayOrder: item.displayOrder ?? idx + 1,
              visible: item.visible ?? true,
              isFeatured: item.isFeatured ?? false,
              showYear: item.showYear ?? true,
              showRole: item.showRole ?? true,
              showCompany: item.showCompany ?? true,
              showDescription: item.showDescription ?? true,
              showTechnologies: item.showTechnologies ?? true,
              showAchievements: item.showAchievements ?? true,
              showMetrics: item.showMetrics ?? true,
            })),
          });
        }
      }

      const result = await prisma.experienceSectionCMS.findUnique({
        where: { id: section.id },
        include: { items: { orderBy: { displayOrder: "asc" } } },
      });
      return NextResponse.json(result);
    }

    if (sectionType === "SELECTED_WORK") {
      let section = await prisma.selectedWorkSectionCMS.findFirst();
      if (!section) {
        section = await prisma.selectedWorkSectionCMS.create({
          data: { key: "SELECTED_WORK_MAIN", visible: true },
        });
      }

      if (data) {
        section = await prisma.selectedWorkSectionCMS.update({
          where: { id: section.id },
          data: {
            ...(data.visible !== undefined && { visible: data.visible }),
          },
        });
      }

      if (Array.isArray(items)) {
        await prisma.selectedWorkSectionCMSItem.deleteMany({
          where: { sectionId: section.id },
        });
        if (items.length > 0) {
          await prisma.selectedWorkSectionCMSItem.createMany({
            data: items.map((item: any, idx: number) => ({
              sectionId: section.id,
              projectId: item.projectId,
              displayOrder: item.displayOrder ?? idx + 1,
              visible: item.visible ?? true,
              offset: item.offset || null,
              customNumber: item.customNumber || null,
              showOneLiner: item.showOneLiner ?? true,
              showDescription: item.showDescription ?? true,
              showTechnologies: item.showTechnologies ?? true,
              showHighlights: item.showHighlights ?? true,
            })),
          });
        }
      }

      const result = await prisma.selectedWorkSectionCMS.findUnique({
        where: { id: section.id },
        include: { items: { orderBy: { displayOrder: "asc" } } },
      });
      return NextResponse.json(result);
    }

    if (sectionType === "PROJECT_SHOWCASE") {
      let section = await prisma.projectShowcaseSectionCMS.findFirst();
      if (!section) {
        section = await prisma.projectShowcaseSectionCMS.create({
          data: { key: "PROJECT_SHOWCASE_MAIN", visible: true },
        });
      }

      if (data) {
        section = await prisma.projectShowcaseSectionCMS.update({
          where: { id: section.id },
          data: {
            ...(data.visible !== undefined && { visible: data.visible }),
          },
        });
      }

      if (Array.isArray(items)) {
        await prisma.projectShowcaseSectionCMSItem.deleteMany({
          where: { sectionId: section.id },
        });
        if (items.length > 0) {
          await prisma.projectShowcaseSectionCMSItem.createMany({
            data: items.map((item: any, idx: number) => ({
              sectionId: section.id,
              projectId: item.projectId,
              displayOrder: item.displayOrder ?? idx + 1,
              visible: item.visible ?? true,
              showDescription: item.showDescription ?? true,
              showTechnologies: item.showTechnologies ?? true,
              showViewAction: item.showViewAction ?? true,
            })),
          });
        }
      }

      const result = await prisma.projectShowcaseSectionCMS.findUnique({
        where: { id: section.id },
        include: { items: { orderBy: { displayOrder: "asc" } } },
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid sectionType" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT /api/admin/cms/composition error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
