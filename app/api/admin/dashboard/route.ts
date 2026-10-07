import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [websiteInteraction, projectInteractions, projects] =
      await Promise.all([
        prisma.websiteInteraction.findUnique({ where: { id: 1 } }),
        prisma.projectInteraction.findMany({
          include: {
            project: {
              select: { project_name: true, slug: true, project_image: true },
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.project.count(),
      ]);

    return NextResponse.json({
      websiteInteraction: websiteInteraction || {
        resume_downloaded: 0,
        contact_form_submit: 0,
        contact_interested: 0,
        scrolled_past_hero: 0,
      },
      projectInteractions: projectInteractions || [],
      totalProjects: projects,
    });
  } catch (error: any) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
