import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let details = await prisma.myDetails.findFirst({
      include: { modeContents: true },
    });

    if (!details) {
      details = await prisma.myDetails.create({
        data: {
          full_name: "Abhra",
          email: "hello@blankdev.dev",
        },
        include: { modeContents: true },
      });
    }

    return NextResponse.json(details);
  } catch (error: any) {
    console.error("GET /api/admin/details error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, modeContent, ...detailsData } = body;

    if (!detailsData.location) {
      const parts = [
        detailsData.address,
        detailsData.district,
        detailsData.state,
        detailsData.country,
        detailsData.pin_code ? `PIN: ${detailsData.pin_code}` : null,
      ].filter(Boolean);
      if (parts.length > 0) {
        detailsData.location = parts.join(", ");
      }
    }

    let details = await prisma.myDetails.findFirst();

    if (!details) {
      details = await prisma.myDetails.create({
        data: {
          full_name: detailsData.full_name || "Abhra",
          email: detailsData.email || "hello@blankdev.dev",
          ...detailsData,
        },
      });
    } else {
      details = await prisma.myDetails.update({
        where: { id: details.id },
        data: detailsData,
      });
    }

    if (modeContent && modeContent.portfolioModeId) {
      await prisma.myDetailsModeContent.upsert({
        where: {
          myDetailsId_portfolioModeId: {
            myDetailsId: details.id,
            portfolioModeId: modeContent.portfolioModeId,
          },
        },
        update: {
          headline: modeContent.headline,
          short_bio: modeContent.short_bio,
          detailed_bio: modeContent.detailed_bio,
          highlights: modeContent.highlights || [],
        },
        create: {
          myDetailsId: details.id,
          portfolioModeId: modeContent.portfolioModeId,
          headline: modeContent.headline,
          short_bio: modeContent.short_bio,
          detailed_bio: modeContent.detailed_bio,
          highlights: modeContent.highlights || [],
        },
      });
    }

    const updatedDetails = await prisma.myDetails.findUnique({
      where: { id: details.id },
      include: { modeContents: true },
    });

    return NextResponse.json(updatedDetails);
  } catch (error: any) {
    console.error("PUT /api/admin/details error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
