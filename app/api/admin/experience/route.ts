import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        modeContents: true,
        metrics: { orderBy: { order: "asc" } },
        achievements: { orderBy: { order: "asc" } },
      },
      orderBy: { start_date: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error: any) {
    console.error("GET /api/admin/experience error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_name,
      role_title,
      employment_type,
      location,
      start_date,
      end_date,
      currently_working,
      experience_image,
      experience_tech,
      metrics,
      achievements,
    } = body;

    const newExp = await prisma.experience.create({
      data: {
        company_name,
        role_title,
        employment_type: employment_type || "FULL_TIME",
        location: location || null,
        start_date: start_date ? new Date(start_date) : new Date(),
        end_date: end_date ? new Date(end_date) : null,
        currently_working: currently_working ?? false,
        experience_image: experience_image || null,
        experience_tech: Array.isArray(experience_tech) ? experience_tech : [],
        ...(metrics && metrics.length > 0
          ? {
              metrics: {
                create: metrics.map((m: { label: string; value: string; order?: number }, idx: number) => ({
                  label: m.label,
                  value: m.value,
                  order: m.order !== undefined ? m.order : idx + 1,
                  visible: true,
                })),
              },
            }
          : {}),
        ...(achievements && achievements.length > 0
          ? {
              achievements: {
                create: achievements.map((a: string | { content: string; order?: number }, idx: number) => ({
                  content: typeof a === "string" ? a : a.content,
                  order: typeof a === "object" && a.order !== undefined ? a.order : idx + 1,
                  visible: true,
                })),
              },
            }
          : {}),
      },
      include: {
        modeContents: true,
        metrics: { orderBy: { order: "asc" } },
        achievements: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(newExp, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/experience error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
