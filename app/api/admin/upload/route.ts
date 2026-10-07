import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, R2_BUCKET_NAME, getR2PublicUrl } from "@/lib/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderInput = (formData.get("folder") as string | null) || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request body." },
        { status: 400 }
      );
    }

    const sanitizedFolder = folderInput
      .trim()
      .replace(/[^a-zA-Z0-9_\-\/]/g, "")
      .replace(/^\/+|\/+$/g, "");

    const folder = sanitizedFolder || "uploads";

    // Validate file extensions/types
    const filename = file.name || "file";
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const isImage = [
      "png",
      "jpg",
      "jpeg",
      "webp",
      "gif",
      "svg",
      "avif",
    ].includes(extension) || file.type.startsWith("image/");
    const isVideo = [
      "mp4",
      "webm",
      "mov",
      "avi",
      "mkv",
      "ogv",
      "m4v",
    ].includes(extension) || file.type.startsWith("video/");
    const isPdf = extension === "pdf" || file.type === "application/pdf";
    const isDocx =
      extension === "docx" ||
      extension === "doc" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword";
    const isMarkdown =
      extension === "md" ||
      extension === "markdown" ||
      file.type === "text/markdown" ||
      file.type === "text/x-markdown";

    if (!isImage && !isVideo && !isPdf && !isDocx && !isMarkdown) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images, videos, PDF (.pdf), Word (.docx/.doc), and Markdown (.md) files are allowed.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sanitizedFilename = filename
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");

    const key = `${folder}/${Date.now()}-${sanitizedFilename}`;

    let contentType = file.type;
    if (!contentType || contentType === "application/octet-stream") {
      if (isPdf) contentType = "application/pdf";
      else if (extension === "docx")
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (extension === "doc") contentType = "application/msword";
      else if (isMarkdown) contentType = "text/markdown";
      else if (extension === "svg") contentType = "image/svg+xml";
      else if (extension === "png") contentType = "image/png";
      else if (extension === "jpg" || extension === "jpeg") contentType = "image/jpeg";
      else if (extension === "webp") contentType = "image/webp";
      else if (extension === "mp4") contentType = "video/mp4";
      else if (extension === "webm") contentType = "video/webm";
      else if (extension === "mov") contentType = "video/quicktime";
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = getR2PublicUrl(key);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
      originalName: filename,
      contentType,
      size: file.size,
      folder,
    });
  } catch (error: any) {
    console.error("Cloudflare R2 Upload Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to Cloudflare R2." },
      { status: 500 }
    );
  }
}
