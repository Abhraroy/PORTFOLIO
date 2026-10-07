import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        modeContents: true,
        highlights: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_name,
      slug,
      project_image,
      project_images,
      project_videos,
      project_url,
      project_github,
      project_md_url,
      project_tags,
      project_tech,
      project_status,
      project_type,
      project_visibility_status,
      highlights,
    } = body;

    const generatedSlug =
      slug ||
      project_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProject = await prisma.project.create({
      data: {
        project_name,
        slug: generatedSlug,
        project_image: project_image || null,
        project_images: project_images || [],
        project_videos: project_videos || [],
        project_url: project_url || null,
        project_github: project_github || null,
        project_md_url: project_md_url || null,
        project_tags: project_tags || [],
        project_tech: project_tech || [],
        project_status: project_status || "ACTIVE",
        project_type: project_type || "SIDE_PROJECT",
        project_visibility_status: project_visibility_status || "PUBLIC",
        ...(highlights && highlights.length > 0
          ? {
              highlights: {
                create: highlights.map((h: string | { content: string; order?: number }, idx: number) => ({
                  content: typeof h === "string" ? h : h.content,
                  order: typeof h === "object" && h.order !== undefined ? h.order : idx + 1,
                  visible: true,
                })),
              },
            }
          : {}),
      },
      include: {
        modeContents: true,
        highlights: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/projects error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
