"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { FiSearch, FiGithub, FiExternalLink, FiArrowRight, FiArrowLeft, FiCode } from "react-icons/fi";
import { useAdminStore } from "@/app/admin/_components/store";
import { type SelectedProject, formatMetricNumber } from "@/components/SelectedWork/selectedWork.config";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { projects, activeModeId, selectedWorkCMS } = useAdminStore();

  const allProjects: SelectedProject[] = useMemo(() => {
    if (projects.length === 0) {
      return [
        {
          id: "ph-1",
          slug: "placeholder-1",
          number: "01",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
          category: "Placeholder",
        },
      ];
    }
    return projects.map((p, idx) => {
      const modeContent =
        p.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
        p.modeContents?.[0];
      
      const currencySymbol =
        modeContent?.currency !== undefined && modeContent?.currency !== null
          ? modeContent.currency
          : "$";
      const userMetric = formatMetricNumber(modeContent?.project_user_count);
      const revMetric = formatMetricNumber(modeContent?.project_revenue, currencySymbol);
      const compiledMetrics: { label: string }[] = [];
      if (userMetric) compiledMetrics.push({ label: `${userMetric} Users` });
      if (revMetric) compiledMetrics.push({ label: `${revMetric} Revenue` });
      if (modeContent?.project_highlights && modeContent.project_highlights.length > 0) {
        compiledMetrics.push(...modeContent.project_highlights.map((h: string) => ({ label: h })));
      }

      const cmsItem = selectedWorkCMS?.items?.find((i) => i.projectId === p.id);

      return {
        id: p.id,
        slug: p.slug,
        number: cmsItem?.customNumber || (idx + 1).toString().padStart(2, "0"),
        name: p.project_name || "Placeholder",
        oneLiner: modeContent?.project_description || p.project_name || "Placeholder",
        techStack: p.project_tech && p.project_tech.length > 0 ? p.project_tech : ["Placeholder"],
        githubUrl: p.project_github || undefined,
        liveUrl: p.project_url || undefined,
        category: p.project_type || "Project Case Study",
        metrics: compiledMetrics,
        challenge: modeContent?.challenge || modeContent?.project_description || "No challenge statement configured.",
        solution: modeContent?.solution || `Built with ${p.project_tech?.join(", ") || "modern tech stack"}.`,
        impact: modeContent?.impact || `Active ${p.project_status || "production"} project.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["High throughput architecture", "Scalable data pipeline"],
        userCount: (modeContent?.project_user_count && modeContent.project_user_count > 0) ? modeContent.project_user_count : null,
        revenue: (modeContent?.project_revenue && modeContent.project_revenue > 0) ? modeContent.project_revenue : null,
        currency: currencySymbol,
        extraNotes: modeContent?.extra_notes ?? null,
        projectImage: p.project_image || null,
        projectImages: p.project_images || [],
        projectVideos: p.project_videos || [],
      };
    });
  }, [projects, activeModeId, selectedWorkCMS]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        project.name.toLowerCase().includes(query) ||
        project.oneLiner.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query)) ||
        (project.category && project.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [allProjects, searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-28 sm:px-6 md:px-8 lg:px-12 text-zinc-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-x-20 -top-20 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(120,119,198,0.15)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-zinc-300 uppercase transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4 text-zinc-200 group-hover:text-white" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-400 uppercase">
                Selected Archive
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-zinc-300">
                {allProjects.length} Projects Total
              </span>
            </div>
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              All Projects & Case Studies
            </h1>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              Explore the full index of web applications, AI retrieval systems, platform tools, and interactive digital experiences.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-white/30 focus:bg-white/10 font-mono"
            />
          </div>
        </header>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                  selectedCategory === cat
                    ? "border border-white/30 bg-white text-zinc-950 font-medium shadow-lg"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {filteredProjects.map((project) => (
              <ProjectGridCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center space-y-3">
            <FiCode className="mx-auto h-8 w-8 text-zinc-600" />
            <h3 className="font-mono text-lg text-zinc-300">No projects found</h3>
            <p className="text-xs text-zinc-500">
              No matching projects for query &quot;{searchQuery}&quot; in {selectedCategory}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="inline-flex rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-zinc-300 hover:bg-white/10"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function ProjectGridCard({ project }: { project: SelectedProject }) {
  return (
    <article className="glass-panel group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-white/35 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
      <div className="space-y-4">
        {/* Top bar: Number & Category */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            {project.number}
          </span>
          {project.category && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400 uppercase">
              {project.category}
            </span>
          )}
        </div>

        {/* Media Preview if available */}
        {(project.projectImage || (project.projectVideos && project.projectVideos.length > 0)) && (
          <Link href={`/projects/${project.slug}`} className="block relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 group-hover:border-white/20 transition-all">
            {project.projectVideos && project.projectVideos.length > 0 ? (
              <video
                src={project.projectVideos[0]}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : project.projectImage ? (
              <img
                src={project.projectImage}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : null}
          </Link>
        )}

        {/* Title & Description */}
        <div className="space-y-2">
          <Link href={`/projects/${project.slug}`} className="group/title inline-block">
            <h2 className="font-mono text-xl font-medium tracking-tight text-white group-hover/title:text-zinc-200 transition-colors sm:text-2xl flex items-center gap-2">
              {project.name}
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-zinc-400">
            {project.oneLiner}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Key Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {project.metrics.slice(0, 4).map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5"
              >
                <p className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-zinc-200 uppercase transition hover:text-white group"
        >
          <span>Read Case Study</span>
          <FiArrowRight className="h-4 w-4 text-zinc-100 transition-transform group-hover:translate-x-1.5" />
        </Link>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 bg-white/10 p-2 text-zinc-200 transition hover:border-white/30 hover:bg-white/20 hover:text-white"
              title="GitHub Repository"
            >
              <FiGithub className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 bg-white/10 p-2 text-zinc-200 transition hover:border-white/30 hover:bg-white/20 hover:text-white"
              title="Live Site / Preview"
            >
              <FiExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
