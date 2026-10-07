import { prisma } from "@/lib/prisma";
import {
  getProjectBySlug,
  SELECTED_PROJECTS,
  type SelectedProject,
} from "@/components/SelectedWork/selectedWork.config";

/**
 * Reads or fetches the Case Study Markdown content for a given project slug.
 * Priority:
 * 1. project_md_url from Prisma DB (Remote URL e.g. Cloudflare R2).
 * 2. Structured fallback Markdown generated from DB Case Study fields (oneLiner, challenge, solution, impact, highlights).
 */
export async function getProjectMarkdown(slug: string): Promise<string> {
  // 1. Check Prisma DB for project and project_md_url
  let dbProject: any = null;
  try {
    dbProject = await prisma.project.findUnique({
      where: { slug },
      include: { modeContents: true, highlights: true },
    });
  } catch (err) {
    console.error("getProjectMarkdown DB error:", err);
  }

  if (dbProject?.project_md_url) {
    const mdUrl = dbProject.project_md_url.trim();

    // If Remote URL (Cloudflare R2 or CDN)
    if (mdUrl.startsWith("http://") || mdUrl.startsWith("https://")) {
      try {
        const res = await fetch(mdUrl, { next: { revalidate: 60 } });
        if (res.ok) {
          const remoteContent = await res.text();
          if (remoteContent.trim()) return remoteContent;
        }
      } catch (err) {
        console.error(`Failed to fetch remote markdown from ${mdUrl}:`, err);
      }
    }
  }

  // 2. Fallback: generate structured Markdown from DB or static config Case Study fields
  const modeContent = dbProject?.modeContents?.[0];
  const staticProj = getProjectBySlug(slug);

  const name = dbProject?.project_name || staticProj?.name || slug;
  const oneLiner = modeContent?.project_description || staticProj?.oneLiner || "Case Study Brief";
  const challenge = modeContent?.challenge || staticProj?.challenge || "No challenge statement provided.";
  const solution = modeContent?.solution || staticProj?.solution || "No solution breakdown provided.";
  const impact = modeContent?.impact || staticProj?.impact || "No impact outcomes provided.";
  const highlights: string[] =
    modeContent?.project_highlights && modeContent.project_highlights.length > 0
      ? modeContent.project_highlights
      : staticProj?.technicalHighlights || [];
  const techStack: string[] =
    dbProject?.project_tech && dbProject.project_tech.length > 0
      ? dbProject.project_tech
      : staticProj?.techStack || [];

  return `# ${name} — Case Study

> **One-Liner:** ${oneLiner}  
> **Category:** ${dbProject?.project_type || staticProj?.category || "Project Case Study"}  
> **Status:** ${dbProject?.project_status || "ACTIVE"}

---

## Executive Overview

${oneLiner}

---

## Challenge & Problem Statement

${challenge}

---

## Technical Solution & Architecture

${solution}

---

## Impact & Key Outcomes

${impact}

---

## Technical Highlights

${highlights.length > 0 ? highlights.map((item) => `- ${item}`).join("\n") : "- Full-stack engineering implementation"}

---

## Technologies Used

${techStack.length > 0 ? techStack.map((t) => `\`${t}\``).join(" • ") : "\`Next.js\` • \`TypeScript\`"}
`;
}

/**
 * Returns all projects combined from static config and optionally DB if needed.
 */
export async function getAllProjects(): Promise<SelectedProject[]> {
  return SELECTED_PROJECTS;
}
