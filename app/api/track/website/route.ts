import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = [
  "resume_downloaded",
  "contact_form_submit",
  "contact_interested",
  "scrolled_past_hero",
] as const;

type InteractionType = (typeof VALID_TYPES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: InteractionType = body?.type;

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid interaction type" },
        { status: 400 }
      );
    }

    // Upsert the singleton row (id = 1) and increment the relevant counter
    await prisma.websiteInteraction.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        [type]: 1,
      },
      update: {
        [type]: { increment: 1 },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/track/website error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
