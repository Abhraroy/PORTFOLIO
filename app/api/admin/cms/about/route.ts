import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SECTION_KEY = "ABOUT";

const DEFAULT_BLOCK_DEFS = [
  {
    blockNumber: 1,
    type: "HERO" as const,
    label: "About me",
    heading: "Building interactive products with clarity and craft.",
    subheading: "Full-stack engineer",
    description:
      "I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs. Focused on Next.js, TypeScript, and systems that stay readable as they grow.",
    ctaText: "Get in touch",
    ctaUrl: "/#contact",
    ctaVisible: true,
  },
  {
    blockNumber: 2,
    type: "CARD" as const,
    label: "Focus",
    heading: "Product engineering",
    description: "Interfaces, APIs, and the space between.",
    ctaVisible: false,
  },
  {
    blockNumber: 3,
    type: "CARD" as const,
    label: "Experience",
    heading: "4+ yrs",
    description: "Shipping for web & startups",
    ctaVisible: false,
  },
  {
    blockNumber: 4,
    type: "CARD" as const,
    label: "Stack",
    heading: "Next · TS · Node",
    description: "Prisma · Three · Postgres",
    ctaVisible: false,
  },
  {
    blockNumber: 5,
    type: "CARD" as const,
    label: "Based",
    heading: "Remote",
    description: "Open to collab worldwide",
    ctaVisible: false,
  },
  {
    blockNumber: 6,
    type: "CARD" as const,
    label: "Status",
    heading: "Available",
    description: "Select freelance & full-time",
    ctaVisible: false,
  },
  {
    blockNumber: 7,
    type: "PROFILE" as const,
    heading: "AR",
    imageAlt: "Profile Visual",
    ctaVisible: false,
  },
];

export async function GET() {
  try {
    let section = await prisma.portfolioSection.findUnique({
      where: { key: SECTION_KEY },
      include: {
        blocks: {
          include: { items: { orderBy: { order: "asc" } } },
          orderBy: { blockNumber: "asc" },
        },
      },
    });

    if (!section) {
      section = await prisma.portfolioSection.create({
        data: {
          key: SECTION_KEY,
          title: "About Me",
          visible: true,
          order: 1,
        },
        include: {
          blocks: {
            include: { items: { orderBy: { order: "asc" } } },
            orderBy: { blockNumber: "asc" },
          },
        },
      });
    }

    // Auto-seed missing fixed blocks 1..7 for global portfolio mode
    const existingBlockNumbers = new Set(
      section.blocks
        .filter((b) => !b.portfolioModeId)
        .map((b) => b.blockNumber)
    );

    const missingDefs = DEFAULT_BLOCK_DEFS.filter(
      (def) => !existingBlockNumbers.has(def.blockNumber)
    );

    if (missingDefs.length > 0) {
      for (const def of missingDefs) {
        await prisma.portfolioBlock.create({
          data: {
            sectionId: section.id,
            blockNumber: def.blockNumber,
            type: def.type,
            label: def.label || null,
            heading: def.heading || null,
            subheading: def.subheading || null,
            description: def.description || null,
            ctaText: def.ctaText || null,
            ctaUrl: def.ctaUrl || null,
            ctaVisible: def.ctaVisible ?? false,
            visible: true,
          },
        });
      }

      // Re-fetch updated section with newly seeded blocks
      section = await prisma.portfolioSection.findUnique({
        where: { key: SECTION_KEY },
        include: {
          blocks: {
            include: { items: { orderBy: { order: "asc" } } },
            orderBy: { blockNumber: "asc" },
          },
        },
      });
    }

    return NextResponse.json(section);
  } catch (error: any) {
    console.error("GET /api/admin/cms/about error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, blockId, itemData, blockData } = body;

    let section = await prisma.portfolioSection.findUnique({
      where: { key: SECTION_KEY },
    });

    if (!section) {
      section = await prisma.portfolioSection.create({
        data: { key: SECTION_KEY, title: "About Me", visible: true, order: 1 },
      });
    }

    if (action === "ADD_ITEM" && blockId) {
      const newItem = await prisma.portfolioBlockItem.create({
        data: {
          blockId,
          type: itemData.type || "TEXT",
          content: itemData.content,
          url: itemData.url || null,
          order: itemData.order || 1,
          visible: itemData.visible ?? true,
        },
      });
      return NextResponse.json(newItem, { status: 201 });
    }

    // Default: Add Block
    const newBlock = await prisma.portfolioBlock.create({
      data: {
        sectionId: section.id,
        portfolioModeId: blockData.portfolioModeId || null,
        blockNumber: blockData.blockNumber || 1,
        type: blockData.type || "CARD",
        visible: blockData.visible ?? true,
        label: blockData.label || null,
        heading: blockData.heading || null,
        subheading: blockData.subheading || null,
        description: blockData.description || null,
        imageUrl: blockData.imageUrl || null,
        imageAlt: blockData.imageAlt || null,
        ctaText: blockData.ctaText || null,
        ctaUrl: blockData.ctaUrl || null,
        ctaType: blockData.ctaType || "LINK",
        ctaVisible: blockData.ctaVisible ?? true,
      },
      include: { items: true },
    });

    return NextResponse.json(newBlock, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/cms/about error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, blockId, itemId, blockData, itemData, reorderedBlocks } = body;

    if (action === "REORDER_BLOCKS" && Array.isArray(reorderedBlocks)) {
      for (const b of reorderedBlocks) {
        await prisma.portfolioBlock.update({
          where: { id: b.id },
          data: { blockNumber: b.blockNumber },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "UPDATE_ITEM" && itemId) {
      const updatedItem = await prisma.portfolioBlockItem.update({
        where: { id: itemId },
        data: itemData,
      });
      return NextResponse.json(updatedItem);
    }

    if (blockId) {
      const updatedBlock = await prisma.portfolioBlock.update({
        where: { id: blockId },
        data: {
          ...(blockData.type !== undefined && { type: blockData.type }),
          ...(blockData.portfolioModeId !== undefined && { portfolioModeId: blockData.portfolioModeId }),
          ...(blockData.visible !== undefined && { visible: blockData.visible }),
          ...(blockData.label !== undefined && { label: blockData.label }),
          ...(blockData.heading !== undefined && { heading: blockData.heading }),
          ...(blockData.subheading !== undefined && { subheading: blockData.subheading }),
          ...(blockData.description !== undefined && { description: blockData.description }),
          ...(blockData.imageUrl !== undefined && { imageUrl: blockData.imageUrl }),
          ...(blockData.imageAlt !== undefined && { imageAlt: blockData.imageAlt }),
          ...(blockData.ctaText !== undefined && { ctaText: blockData.ctaText }),
          ...(blockData.ctaUrl !== undefined && { ctaUrl: blockData.ctaUrl }),
          ...(blockData.ctaType !== undefined && { ctaType: blockData.ctaType }),
          ...(blockData.ctaVisible !== undefined && { ctaVisible: blockData.ctaVisible }),
          ...(blockData.blockNumber !== undefined && { blockNumber: blockData.blockNumber }),
        },
        include: { items: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json(updatedBlock);
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("PUT /api/admin/cms/about error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");
    const itemId = searchParams.get("itemId");

    if (itemId) {
      await prisma.portfolioBlockItem.delete({ where: { id: itemId } });
      return NextResponse.json({ success: true, itemId });
    }

    if (blockId) {
      await prisma.portfolioBlock.delete({ where: { id: blockId } });
      return NextResponse.json({ success: true, blockId });
    }

    return NextResponse.json({ error: "blockId or itemId required" }, { status: 400 });
  } catch (error: any) {
    console.error("DELETE /api/admin/cms/about error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
