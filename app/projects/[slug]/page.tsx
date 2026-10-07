import Link from "next/link";
import { notFound } from "next/navigation";
import { FiGithub, FiExternalLink, FiArrowLeft, FiFolder, FiUsers, FiDollarSign, FiCpu, FiFileText } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { getProjectMarkdown } from "@/lib/projects";
import MarkdownViewer from "@/components/MarkdownViewer";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((project) => ({ slug: project.slug }));
}

async function fetchDbProject(slug: string) {
  const proj = await prisma.project.findUnique({
    where: { slug },
    include: { modeContents: true, highlights: true },
  });
  if (!proj) return null;

  const modeContent =
    proj.modeContents?.find(
      (m) =>
        m.project_user_count !== null ||
        m.project_revenue !== null ||
        (m.project_highlights && m.project_highlights.length > 0) ||
        m.extra_notes
    ) || proj.modeContents?.[0];

  const userCount =
    proj.modeContents?.find((m) => typeof m.project_user_count === "number" && m.project_user_count > 0)
      ?.project_user_count ?? null;

  const revenue =
    proj.modeContents?.find((m) => typeof m.project_revenue === "number" && m.project_revenue > 0)
      ?.project_revenue ?? null;

  const extraNotes =
    proj.modeContents?.find((m) => m.extra_notes)?.extra_notes ?? null;

  const techHighlights =
    proj.modeContents?.find(
      (m) => m.project_highlights && m.project_highlights.length > 0
    )?.project_highlights ||
    (proj.highlights && proj.highlights.length > 0
      ? proj.highlights.map((h) => h.content)
      : []);

  const currency =
    proj.modeContents?.find(
      (m) => m.currency !== undefined && m.currency !== null
    )?.currency ?? "$";

  return {
    id: proj.id,
    slug: proj.slug,
    number: "01",
    name: proj.project_name || "Placeholder",
    oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
    techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
    githubUrl: proj.project_github || undefined,
    liveUrl: proj.project_url || undefined,
    period: "Production",
    role: "Lead Architect",
    category: proj.project_type || "Project Case Study",
    userCount,
    revenue,
    currency,
    extraNotes,
    technicalHighlights: techHighlights,
    challenge: modeContent?.challenge || null,
    solution: modeContent?.solution || null,
    impact: modeContent?.impact || null,
    projectImage: proj.project_image || null,
    projectImages: proj.project_images || [],
    projectVideos: proj.project_videos || [],
  };
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchDbProject(slug);
  if (!project) return { title: "Project Case Study · blankdev" };

  return {
    title: `${project.name} · Case Study & Documentation`,
    description: project.oneLiner,
  };
}

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|\|/)
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
}

/**
 * Single Project Case Study Page featuring factual header CTAs and dynamic Markdown container.
 */
export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchDbProject(slug);
  if (!project) notFound();

  const markdownContent = await getProjectMarkdown(slug);

  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-28 sm:px-6 md:px-8 lg:px-12 text-zinc-100 relative">
      {/* Subtle Background Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-x-10 -top-10 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)]"
        aria-hidden
      />

      <article className="relative mx-auto w-full max-w-4xl space-y-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-zinc-400 uppercase transition hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            <span>All Projects</span>
          </Link>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Case Study #{project.number}
          </span>
        </div>

        {/* Factual Data Header Section */}
        <header className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-zinc-400 uppercase">
              <span>{project.number}</span>
              <span>·</span>
              <span>{project.category || "Project Case Study"}</span>
            </div>
            {project.period && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400">
                {project.period}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {project.name}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {project.oneLiner}
            </p>
          </div>

          {/* Scale & Impact Metrics Grid (if userCount or revenue exists) */}
          {(Boolean(project.userCount) || Boolean(project.revenue)) && (
            <div className={`grid grid-cols-1 ${project.userCount && project.revenue ? "sm:grid-cols-2" : ""} gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5`}>
              {project.userCount ? (
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
                      Active User Base
                    </span>
                    <p className="font-mono text-lg font-semibold text-white">
                      {project.userCount.toLocaleString()}+ Users
                    </p>
                  </div>
                </div>
              ) : null}
              {project.revenue ? (
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FiDollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
                      Revenue Generated
                    </span>
                    <p className="font-mono text-lg font-semibold text-emerald-300">
                      {project.currency || "$"}{project.revenue.toLocaleString()}+
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Technical Highlights & Key Takeaways if available */}
          {project.technicalHighlights && project.technicalHighlights.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                <FiCpu className="h-3.5 w-3.5 text-indigo-400" /> Technical Highlights
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.technicalHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extra Notes if available */}
          {project.extraNotes && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                <FiFileText className="h-3.5 w-3.5 text-emerald-400" /> Architecture Notes & Key Takeaways
              </span>
              <ul className="space-y-2">
                {parseBullets(project.extraNotes).map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Factual Data Grid: Role & Tech Stack */}
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 border-t border-white/10">
            {project.role && (
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Role / Responsibility
                </span>
                <p className="font-mono text-xs text-zinc-200">{project.role}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                Technologies Used
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 font-mono text-xs text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs: Repository & Live Demo */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 font-mono text-xs tracking-wider text-white uppercase transition hover:border-white/30 hover:bg-white/20"
              >
                <FiGithub className="h-4 w-4" />
                <span>View Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#415d43] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#4d6e4f]"
              >
                <FiExternalLink className="h-4 w-4" />
                <span>Live Preview</span>
              </a>
            )}
          </div>
        </header>

        {/* Project Media Showcase (Video or Image Gallery if available) */}
        {(project.projectImage || (project.projectVideos && project.projectVideos.length > 0) || (project.projectImages && project.projectImages.length > 0)) && (
          <section aria-label="Project Visual Assets" className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-1.5">
                <FiFolder className="h-3.5 w-3.5" />
                <span>Visual Showcase</span>
              </span>
            </div>

            {project.projectVideos && project.projectVideos.length > 0 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/20 bg-black/60 shadow-2xl">
                <video
                  src={project.projectVideos[0]}
                  controls
                  playsInline
                  className="h-full w-full object-contain bg-black"
                />
              </div>
            ) : project.projectImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/20 bg-black/60 shadow-2xl">
                <img
                  src={project.projectImage}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            {project.projectImages && project.projectImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.projectImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-md">
                    <img src={imgUrl} alt={`${project.name} gallery ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Big Div: Markdown Viewer Container */}
        <section aria-label="Project Documentation & Case Study">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-1.5">
              <FiFolder className="h-3.5 w-3.5" />
              <span>Project Documentation (.md)</span>
            </span>
          </div>

          {/* Big Div Container */}
          <div className="glass-panel glass-panel--active relative rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl min-h-[400px]">
            <MarkdownViewer content={markdownContent} />
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-200 uppercase transition hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4 text-zinc-100" />
            <span>Back to All Projects</span>
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-200 uppercase transition hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            <span>Home Dashboard</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}
