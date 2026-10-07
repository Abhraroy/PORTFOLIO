import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Three.js",
  "PostgreSQL",
];

export async function GET() {
  try {
    let items = await prisma.mobileHeroSkill.findMany({
      orderBy: { displayOrder: "asc" },
    });

    if (items.length === 0) {
      // Auto-seed default skills
      await Promise.all(
        DEFAULT_SKILLS.map((text, idx) =>
          prisma.mobileHeroSkill.create({
            data: {
              text,
              displayOrder: idx,
              visible: true,
            },
          })
        )
      );

      items = await prisma.mobileHeroSkill.findMany({
        orderBy: { displayOrder: "asc" },
      });
    }

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/admin/cms/mobile-hero error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, displayOrder, visible } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.mobileHeroSkill.aggregate({
      _max: { displayOrder: true },
    });
    const nextOrder = displayOrder ?? (maxOrder._max.displayOrder ?? -1) + 1;

    const newItem = await prisma.mobileHeroSkill.create({
      data: {
        text: text.trim(),
        displayOrder: nextOrder,
        visible: visible ?? true,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/cms/mobile-hero error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, text, displayOrder, visible, items } = body;

    if (action === "REORDER" && Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        await prisma.mobileHeroSkill.update({
          where: { id: items[i].id },
          data: { displayOrder: i },
        });
      }
      const updated = await prisma.mobileHeroSkill.findMany({
        orderBy: { displayOrder: "asc" },
      });
      return NextResponse.json(updated);
    }

    if (!id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const updated = await prisma.mobileHeroSkill.update({
      where: { id },
      data: {
        ...(text !== undefined && { text: text.trim() }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(visible !== undefined && { visible }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/admin/cms/mobile-hero error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await prisma.mobileHeroSkill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/admin/cms/mobile-hero error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
