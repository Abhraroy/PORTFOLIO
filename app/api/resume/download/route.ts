import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3, R2_BUCKET_NAME } from "@/lib/cloudflare";
import { GetObjectCommand } from "@aws-sdk/client-s3";

function extractR2Key(urlStr: string, bucketName: string): string {
  const cleanUrl = urlStr.split("?")[0];
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    try {
      const urlObj = new URL(cleanUrl);
      const pathParts = urlObj.pathname.replace(/^\/+/, "").split("/");
      if (pathParts[0] === bucketName) {
        return pathParts.slice(1).join("/");
      }
      return pathParts.join("/");
    } catch {
      // Fallback if URL parsing fails
    }
  }
  const parts = cleanUrl.replace(/^\/+/, "").split("/");
  if (parts[0] === bucketName) return parts.slice(1).join("/");
  return parts.join("/");
}

export async function GET(req: NextRequest) {
  try {
    const details = await prisma.myDetails.findFirst();
    if (!details || !details.resume_url) {
      return NextResponse.redirect(new URL("/?error=no_resume", req.url));
    }

    let fileBuffer: Buffer | Uint8Array | ArrayBuffer | null = null;
    const cleanUrl = details.resume_url.split("?")[0];
    const cleanUrlLower = cleanUrl.toLowerCase();

    let ext = "pdf";
    let contentType = "application/pdf";

    if (cleanUrlLower.endsWith(".docx")) {
      ext = "docx";
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (cleanUrlLower.endsWith(".doc")) {
      ext = "doc";
      contentType = "application/msword";
    } else if (cleanUrlLower.endsWith(".md") || cleanUrlLower.endsWith(".markdown")) {
      ext = "md";
      contentType = "text/markdown";
    }

    // Try fetching via Cloudflare R2 S3 client first if it's an R2 URL or key
    const r2PublicDomain = (process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || "").toLowerCase().replace(/^https?:\/\//, "");
    const isCustomR2Domain = !!r2PublicDomain && cleanUrlLower.includes(r2PublicDomain);
    if (cleanUrlLower.includes("r2.cloudflarestorage.com") || isCustomR2Domain || !cleanUrl.startsWith("http")) {
      try {
        const key = extractR2Key(details.resume_url, R2_BUCKET_NAME);
        const s3Response = await s3.send(
          new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
          })
        );

        if (s3Response.Body) {
          fileBuffer = await s3Response.Body.transformToByteArray();
          if (s3Response.ContentType) {
            contentType = s3Response.ContentType;
          }
        }
      } catch (r2Err) {
        console.warn("Failed to fetch resume via R2 S3 client, falling back to HTTP fetch:", r2Err);
      }
    }

    // Fallback to standard HTTP fetch for public links or if S3 fetch failed
    if (!fileBuffer) {
      const fileRes = await fetch(details.resume_url);
      if (!fileRes.ok) {
        console.error(`Failed to fetch resume file from ${details.resume_url}, status: ${fileRes.status}`);
        return NextResponse.redirect(new URL("/?error=resume_fetch_failed", req.url));
      }

      fileBuffer = await fileRes.arrayBuffer();

      const headerType = fileRes.headers.get("content-type");
      if (headerType?.includes("wordprocessingml") || headerType?.includes("docx")) {
        ext = "docx";
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (headerType?.includes("msword")) {
        ext = "doc";
        contentType = "application/msword";
      } else if (headerType?.includes("markdown")) {
        ext = "md";
        contentType = "text/markdown";
      } else if (headerType?.includes("pdf")) {
        ext = "pdf";
        contentType = "application/pdf";
      }
    }

    // Track the resume download interaction
    try {
      await prisma.websiteInteraction.upsert({
        where: { id: 1 },
        create: { id: 1, resume_downloaded: 1 },
        update: { resume_downloaded: { increment: 1 } },
      });
    } catch (trackErr) {
      console.warn("Failed to track resume download:", trackErr);
    }

    const sanitizedName = details.full_name
      ? details.full_name.replace(/[^a-zA-Z0-9]/g, "_")
      : "CV";
    const filename = `Resume_${sanitizedName}.${ext}`;

    const body: BodyInit = fileBuffer
      ? fileBuffer instanceof Buffer
        ? fileBuffer
        : new Uint8Array(fileBuffer as ArrayBuffer)
      : new Uint8Array(0);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("GET /api/resume/download error:", error);
    return NextResponse.redirect(new URL("/?error=resume_download_error", req.url));
  }
}

