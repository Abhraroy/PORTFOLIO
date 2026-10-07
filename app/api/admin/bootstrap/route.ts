import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const modes = await prisma.portfolioMode.findMany({
      orderBy: { createdAt: "asc" },
    });

    const details = await prisma.myDetails.findFirst({
      include: { modeContents: true },
    });

    const projects = await prisma.project.findMany({
      include: {
        modeContents: true,
        highlights: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const experiences = await prisma.experience.findMany({
      include: {
        modeContents: true,
        metrics: { orderBy: { order: "asc" } },
        achievements: { orderBy: { order: "asc" } },
      },
      orderBy: { start_date: "desc" },
    });

    const aboutSection = await prisma.portfolioSection.findUnique({
      where: { key: "ABOUT" },
      include: {
        blocks: {
          include: { items: { orderBy: { order: "asc" } } },
          orderBy: { blockNumber: "asc" },
        },
      },
    });

    const experienceCMS = await prisma.experienceSectionCMS.findFirst({
      include: { items: { orderBy: { displayOrder: "asc" } } },
    });

    const selectedWorkCMS = await prisma.selectedWorkSectionCMS.findFirst({
      include: { items: { orderBy: { displayOrder: "asc" } } },
    });

    const projectShowcaseCMS = await prisma.projectShowcaseSectionCMS.findFirst({
      include: { items: { orderBy: { displayOrder: "asc" } } },
    });

    const heroNodesCMS = await prisma.heroSectionCMS.findFirst({
      include: { items: { orderBy: { displayOrder: "asc" } } },
    });

    const mobileHeroSkills = await prisma.mobileHeroSkill.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      modes,
      details,
      projects,
      experiences,
      sections: aboutSection ? [aboutSection] : [],
      experienceCMS,
      selectedWorkCMS,
      projectShowcaseCMS,
      heroNodesCMS,
      mobileHeroSkills,
    });
  } catch (error: any) {
    console.error("GET /api/admin/bootstrap error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
