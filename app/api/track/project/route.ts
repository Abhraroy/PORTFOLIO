import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = ["project_clicked", "project_viewed"] as const;

type ProjectInteractionType = (typeof VALID_TYPES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, type } = body as {
      projectId?: string;
      type?: ProjectInteractionType;
    };

    if (!projectId || !type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid payload — need projectId and valid type" },
        { status: 400 }
      );
    }

    // Verify the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Upsert the interaction row keyed by projectId
    await prisma.projectInteraction.upsert({
      where: { projectId },
      create: {
        projectId,
        [type]: 1,
      },
      update: {
        [type]: { increment: 1 },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/track/project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
