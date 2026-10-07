import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const modes = await prisma.portfolioMode.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(modes);
  } catch (error: any) {
    console.error("GET /api/admin/modes error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = await prisma.portfolioMode.create({
      data: {
        mode_name: body.mode_name,
        mode_description: body.mode_description || null,
      },
    });
    return NextResponse.json(mode, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/modes error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, mode_name, mode_description } = body;
    if (!id) {
      return NextResponse.json({ error: "Mode ID required" }, { status: 400 });
    }

    const updated = await prisma.portfolioMode.update({
      where: { id },
      data: {
        ...(mode_name !== undefined && { mode_name }),
        ...(mode_description !== undefined && { mode_description }),
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/admin/modes error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Mode ID required" }, { status: 400 });
    }

    await prisma.portfolioMode.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/admin/modes error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
