"use client";

import { motion } from "framer-motion";
import { useCallback, useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import ProjectExpandModal from "./ProjectExpandModal";
import {
  SELECTED_PROJECTS as FALLBACK_PROJECTS,
  SELECTED_WORK,
  type SelectedProject,
  formatMetricNumber,
} from "./selectedWork.config";
import { useAdminStore } from "@/app/admin/_components/store";

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function SelectedWork() {
  const [active, setActive] = useState<SelectedProject | null>(null);
  const { projects, projectHighlights, selectedWorkCMS, activeModeId } = useAdminStore();

  const dynamicProjects = useMemo<SelectedProject[]>(() => {
    if (!selectedWorkCMS || !selectedWorkCMS.items || selectedWorkCMS.items.length === 0) {
      if (projects.length > 0) {
        return projects.map((proj, idx): SelectedProject => {
          const modeContent =
            proj.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
            proj.modeContents?.[0];

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
            compiledMetrics.push(...modeContent.project_highlights.map((h) => ({ label: h })));
          }

          return {
            id: proj.id,
            slug: proj.slug,
            number: (idx + 1).toString().padStart(2, "0"),
            name: proj.project_name || "Placeholder",
            oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
            techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
            metrics: compiledMetrics,
            challenge: modeContent?.challenge || modeContent?.project_description || "Placeholder",
            solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "modern tech stack"}.`,
            impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} product.`,
            technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
              ? modeContent.project_highlights
              : ["High throughput architecture", "Scalable data pipeline"],
            userCount: (modeContent?.project_user_count && modeContent.project_user_count > 0) ? modeContent.project_user_count : null,
            revenue: (modeContent?.project_revenue && modeContent.project_revenue > 0) ? modeContent.project_revenue : null,
            currency: currencySymbol,
            extraNotes: modeContent?.extra_notes ?? null,
            githubUrl: proj.project_github || undefined,
            liveUrl: proj.project_url || undefined,
            projectImage: proj.project_image || null,
            projectImages: proj.project_images || [],
            projectVideos: proj.project_videos || [],
            offset: idx % 2 === 0 ? "up" : "down",
          };
        });
      }
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
          offset: "up",
        },
        {
          id: "ph-2",
          slug: "placeholder-2",
          number: "02",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
          offset: "down",
        },
      ];
    }

    const activeItems = [...(selectedWorkCMS.items || [])]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const result: SelectedProject[] = [];

    activeItems.forEach((item, idx) => {
      const proj = projects.find((p) => p.id === item.projectId);
      if (!proj) return;

      const highlights = projectHighlights
        .filter((h) => h.projectId === item.projectId && h.visible)
        .sort((a, b) => a.order - b.order)
        .map((h) => ({ label: h.content }));

      const formattedNum = item.customNumber || (idx + 1).toString().padStart(2, "0");
      const modeContent =
        proj.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
        proj.modeContents?.[0];

      const currencySymbol =
        modeContent?.currency !== undefined && modeContent?.currency !== null
          ? modeContent.currency
          : "$";
      const userMetric = formatMetricNumber(modeContent?.project_user_count);
      const revMetric = formatMetricNumber(modeContent?.project_revenue, currencySymbol);
      const compiledMetrics: { label: string }[] = [];
      if (userMetric) compiledMetrics.push({ label: `${userMetric} Users` });
      if (revMetric) compiledMetrics.push({ label: `${revMetric} Revenue` });
      if (highlights.length > 0) {
        compiledMetrics.push(...highlights);
      } else if (modeContent?.project_highlights && modeContent.project_highlights.length > 0) {
        compiledMetrics.push(...modeContent.project_highlights.map((h) => ({ label: h })));
      }

      result.push({
        id: proj.id,
        slug: proj.slug,
        number: formattedNum,
        name: proj.project_name || "Placeholder",
        oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
        techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
        metrics: compiledMetrics,
        challenge: modeContent?.challenge || modeContent?.project_description || "No challenge statement configured.",
        solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "modern tech stack"}.`,
        impact: modeContent?.impact || `Active ${proj.project_status || "production"} product.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["High throughput architecture", "Zero-downtime automated deployment"],
        userCount: (modeContent?.project_user_count && modeContent.project_user_count > 0) ? modeContent.project_user_count : null,
        revenue: (modeContent?.project_revenue && modeContent.project_revenue > 0) ? modeContent.project_revenue : null,
        currency: currencySymbol,
        extraNotes: modeContent?.extra_notes ?? null,
        githubUrl: proj.project_github || undefined,
        liveUrl: proj.project_url || undefined,
        projectImage: proj.project_image || null,
        projectImages: proj.project_images || [],
        projectVideos: proj.project_videos || [],
        offset: item.offset as "up" | "down" | undefined,
      });
    });

    if (result.length === 0 && projects.length > 0) {
      return projects.map((proj, idx): SelectedProject => {
        const modeContent =
          proj.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
          proj.modeContents?.[0];

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
          compiledMetrics.push(...modeContent.project_highlights.map((h) => ({ label: h })));
        }

        return {
          id: proj.id,
          slug: proj.slug,
          number: (idx + 1).toString().padStart(2, "0"),
          name: proj.project_name || "Placeholder",
          oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
          techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
          metrics: compiledMetrics,
          challenge: modeContent?.challenge || modeContent?.project_description || "Placeholder",
          solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "modern tech stack"}.`,
          impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} product.`,
          technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
            ? modeContent.project_highlights
            : ["High throughput architecture", "Scalable data pipeline"],
          userCount: (modeContent?.project_user_count && modeContent.project_user_count > 0) ? modeContent.project_user_count : null,
          revenue: (modeContent?.project_revenue && modeContent.project_revenue > 0) ? modeContent.project_revenue : null,
          currency: currencySymbol,
          extraNotes: modeContent?.extra_notes ?? null,
          githubUrl: proj.project_github || undefined,
          liveUrl: proj.project_url || undefined,
          projectImage: proj.project_image || null,
          projectImages: proj.project_images || [],
          projectVideos: proj.project_videos || [],
          offset: idx % 2 === 0 ? "up" : "down",
        };
      });
    }

    return result;
  }, [projects, projectHighlights, selectedWorkCMS, activeModeId]);

  const onOpen = useCallback((project: SelectedProject) => {
    setActive(project);
  }, []);

  const onClose = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <section
      id="work"
      className="relative w-full scroll-mt-24 overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="work-heading"
    >
      <span id="projects" className="absolute -top-24 block pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl">
        <motion.header
          className="mb-10 max-w-2xl space-y-3 sm:mb-12 lg:mb-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={headerFade}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {SELECTED_WORK.eyebrow}
          </p>
          <h2
            id="work-heading"
            className="font-mono text-2xl tracking-tight text-white sm:text-3xl"
          >
            {SELECTED_WORK.heading}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white sm:text-[15px]">
            {SELECTED_WORK.subtitle}
          </p>
        </motion.header>

        <div
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:gap-x-8 lg:gap-y-10"
          role="list"
        >
          {dynamicProjects.map((project, index) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                project={project}
                index={index}
                onOpen={onOpen}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectExpandModal project={active} onClose={onClose} />
    </section>
  );
}

