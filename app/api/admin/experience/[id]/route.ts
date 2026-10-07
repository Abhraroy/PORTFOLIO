import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        modeContents: true,
        metrics: { orderBy: { order: "asc" } },
        achievements: { orderBy: { order: "asc" } },
      },
    });

    if (!experience) {
      return NextResponse.json({ error: "Experience record not found" }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error: any) {
    console.error("GET /api/admin/experience/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { modeContent, metrics, achievements, ...fields } = body;

    const updatedExp = await prisma.experience.update({
      where: { id },
      data: {
        ...(fields.company_name !== undefined && { company_name: fields.company_name }),
        ...(fields.role_title !== undefined && { role_title: fields.role_title }),
        ...(fields.employment_type !== undefined && { employment_type: fields.employment_type }),
        ...(fields.location !== undefined && { location: fields.location }),
        ...(fields.start_date !== undefined && { start_date: new Date(fields.start_date) }),
        ...(fields.end_date !== undefined && {
          end_date: fields.end_date ? new Date(fields.end_date) : null,
        }),
        ...(fields.currently_working !== undefined && {
          currently_working: fields.currently_working,
        }),
        ...(fields.experience_image !== undefined && {
          experience_image: fields.experience_image || null,
        }),
        ...(fields.experience_tech !== undefined && {
          experience_tech: Array.isArray(fields.experience_tech) ? fields.experience_tech : [],
        }),
      },
    });

    // Handle ExperienceModeContent upsert if provided
    if (modeContent && modeContent.portfolioModeId) {
      await prisma.experienceModeContent.upsert({
        where: {
          experienceId_portfolioModeId: {
            experienceId: id,
            portfolioModeId: modeContent.portfolioModeId,
          },
        },
        update: {
          experience_description: modeContent.experience_description || null,
          experience_highlights: modeContent.experience_highlights || [],
        },
        create: {
          experienceId: id,
          portfolioModeId: modeContent.portfolioModeId,
          experience_description: modeContent.experience_description || null,
          experience_highlights: modeContent.experience_highlights || [],
        },
      });
    }

    // Handle Metrics replacement if provided
    if (Array.isArray(metrics)) {
      await prisma.experienceMetric.deleteMany({ where: { experienceId: id } });
      if (metrics.length > 0) {
        await prisma.experienceMetric.createMany({
          data: metrics.map((m: { label: string; value: string; order?: number }, idx: number) => ({
            experienceId: id,
            label: m.label,
            value: m.value,
            order: m.order !== undefined ? m.order : idx + 1,
            visible: true,
          })),
        });
      }
    }

    // Handle Achievements replacement if provided
    if (Array.isArray(achievements)) {
      await prisma.experienceAchievement.deleteMany({ where: { experienceId: id } });
      if (achievements.length > 0) {
        await prisma.experienceAchievement.createMany({
          data: achievements.map((a: string | { content: string; order?: number }, idx: number) => ({
            experienceId: id,
            content: typeof a === "string" ? a : a.content,
            order: typeof a === "object" && a.order !== undefined ? a.order : idx + 1,
            visible: true,
          })),
        });
      }
    }

    const fullExp = await prisma.experience.findUnique({
      where: { id },
      include: {
        modeContents: true,
        metrics: { orderBy: { order: "asc" } },
        achievements: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(fullExp);
  } catch (error: any) {
    console.error("PUT /api/admin/experience/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/admin/experience/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
