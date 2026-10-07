"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import ProjectExpandModal from "@/components/SelectedWork/ProjectExpandModal";
import ShowcaseCard from "./ShowcaseCard";
import ViewAllCard from "./ViewAllCard";
import {
  PROJECT_SHOWCASE,
  SHOWCASE_PROJECTS as FALLBACK_SHOWCASE_PROJECTS,
  type ShowcaseProject,
} from "./projectShowcase.config";
import { formatMetricNumber } from "@/components/SelectedWork/selectedWork.config";
import { useAdminStore } from "@/app/admin/_components/store";

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<ShowcaseProject | null>(null);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const { projects, projectHighlights, projectShowcaseCMS, activeModeId } = useAdminStore();

  const dynamicProjects: ShowcaseProject[] = useMemo(() => {
    if (!projectShowcaseCMS || !projectShowcaseCMS.items || projectShowcaseCMS.items.length === 0) {
      if (projects.length > 0) {
        return projects.map((proj, idx) => {
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
            solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "Placeholder"}.`,
            impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} project.`,
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
          };
        });
      }
      return [
        {
          id: "ph-showcase-1",
          slug: "placeholder-showcase-1",
          number: "01",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        },
        {
          id: "ph-showcase-2",
          slug: "placeholder-showcase-2",
          number: "02",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        },
      ];
    }

    const activeItems = [...projectShowcaseCMS.items]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const derived = activeItems.map((item, idx) => {
      const proj = projects.find((p) => p.id === item.projectId);
      const highlights = projectHighlights
        .filter((h) => h.projectId === item.projectId && h.visible)
        .sort((a, b) => a.order - b.order)
        .map((h) => ({ label: h.content }));

      const formattedNum = (idx + 1).toString().padStart(2, "0");
      const modeContent =
        proj?.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
        proj?.modeContents?.[0];

      if (!proj) {
        return {
          id: item.id,
          slug: `showcase-${idx + 1}`,
          number: formattedNum,
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: highlights,
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        };
      }

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

      return {
        id: proj.id,
        slug: proj.slug,
        number: formattedNum,
        name: proj.project_name || "Placeholder",
        oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
        techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
        metrics: compiledMetrics,
        challenge: modeContent?.challenge || modeContent?.project_description || "Placeholder",
        solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "Placeholder"}.`,
        impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} project.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["High throughput architecture", "Zero-downtime deployment"],
        userCount: (modeContent?.project_user_count && modeContent.project_user_count > 0) ? modeContent.project_user_count : null,
        revenue: (modeContent?.project_revenue && modeContent.project_revenue > 0) ? modeContent.project_revenue : null,
        currency: currencySymbol,
        extraNotes: modeContent?.extra_notes ?? null,
        githubUrl: proj.project_github || undefined,
        liveUrl: proj.project_url || undefined,
        projectImage: proj.project_image || null,
        projectImages: proj.project_images || [],
        projectVideos: proj.project_videos || [],
      };
    });

    return derived;
  }, [projects, projectHighlights, projectShowcaseCMS, activeModeId]);

  const onOpen = useCallback((project: ShowcaseProject) => {
    setActive(project);
  }, []);

  const onClose = useCallback(() => {
    setActive(null);
  }, []);

  // Detect when carousel reaches the end (view all card in full view)
  const checkIfAtEnd = useCallback(() => {
    const container = scrollContainerRef.current;
    const viewAll = viewAllRef.current;
    if (!container || !viewAll) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = viewAll.getBoundingClientRect();

    // The view all card must be in full view:
    // 1. Its right edge is within container's right boundary (with space to spare)
    // 2. Its left edge is visible past the container's left edge
    const isFullyInView =
      cardRect.left >= containerRect.left &&
      cardRect.right <= containerRect.right - 20;

    // Fallback: scrolled to the very end of scrollWidth
    const atEndByScroll =
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 15;

    setIsAtEnd(isFullyInView || atEndByScroll);
  }, []);

  // IntersectionObserver to observe when ViewAllCard enters view
  useEffect(() => {
    const container = scrollContainerRef.current;
    const viewAll = viewAllRef.current;
    if (!container || !viewAll) return;

    const observer = new IntersectionObserver(
      () => {
        checkIfAtEnd();
      },
      {
        root: container,
        threshold: [0.7, 0.85, 0.95, 1.0],
      }
    );

    observer.observe(viewAll);
    window.addEventListener("resize", checkIfAtEnd);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkIfAtEnd);
    };
  }, [dynamicProjects, checkIfAtEnd]);

  // Click handler: advances card by card, ensuring view all card is fully brought into view
  const handleArrowClick = useCallback(() => {
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    const viewAll = viewAllRef.current;
    if (!container || !track) return;

    if (isAtEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const cards = Array.from(track.children).filter(
      (child) => child.getAttribute("role") === "listitem"
    ) as HTMLElement[];
    if (cards.length === 0) return;

    const currentScroll = container.scrollLeft;
    const firstCardOffset = cards[0].offsetLeft;

    // Find the next card whose relative offset is further than currentScroll + threshold
    const nextCard = cards.find(
      (card) => card.offsetLeft - firstCardOffset > currentScroll + 24
    );

    if (nextCard) {
      // If the next card is the ViewAllCard, ensure it scrolls into 100% full view with right-side padding
      if (nextCard === viewAll) {
        const containerWidth = container.clientWidth;
        const viewAllRight = nextCard.offsetLeft + nextCard.offsetWidth;
        // Ensure there is at least 64px - 100px space on the right of ViewAllCard
        const targetForFullView = viewAllRight - containerWidth + 80;
        const targetFromLeft = nextCard.offsetLeft - firstCardOffset;
        const targetScroll = Math.max(targetFromLeft, targetForFullView);
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
      } else {
        const targetScroll = nextCard.offsetLeft - firstCardOffset;
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
    } else {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    }
  }, [isAtEnd]);

  return (
    <section
      id="showcase"
      className="project-showcase relative w-full scroll-mt-24 py-16 sm:py-20 lg:py-28 overflow-hidden bg-transparent"
      aria-labelledby="showcase-heading"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.header
          className="mb-8 max-w-2xl space-y-3 sm:mb-10 lg:mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={headerFade}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {PROJECT_SHOWCASE.eyebrow}
          </p>
          <h2
            id="showcase-heading"
            className="font-mono text-2xl tracking-tight text-white sm:text-3xl"
          >
            {PROJECT_SHOWCASE.heading}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white sm:text-[15px]">
            {PROJECT_SHOWCASE.subtitle}
          </p>
        </motion.header>
      </div>

      <div className="relative w-full">
        {/* Toggle Arrow on the left (hidden on mobile & tab, visible on desktop) */}
        <button
          type="button"
          onClick={handleArrowClick}
          className="group absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#111d13]/85 backdrop-blur-md text-white shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-[#415d43]/50 active:scale-95 cursor-pointer"
          aria-label={isAtEnd ? "Return to beginning" : "Next project"}
          title={isAtEnd ? "Return to beginning" : "Next project"}
        >
          <svg
            className={`h-6 w-6 text-white transition-transform duration-500 ease-out ${
              isAtEnd ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

        {/* Left gradient fade for smooth edge appearance (desktop only) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#111d13] to-transparent z-10 hidden lg:block" />

        {/* Scrollable track container (native scroll enabled, scrollbar hidden) */}
        <div
          ref={scrollContainerRef}
          onScroll={checkIfAtEnd}
          className="w-full overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            ref={trackRef}
            className="project-showcase__track flex w-max items-stretch gap-5 pl-4 pr-8 sm:gap-6 sm:pl-6 sm:pr-12 md:pl-8 md:pr-16 lg:gap-7 lg:pl-[max(6rem,calc((100vw-80rem)/2+4rem))] lg:pr-[max(8rem,calc((100vw-80rem)/2+6rem))]"
            role="list"
            aria-label="Project showcase"
          >
            {dynamicProjects.map((project) => (
              <div key={project.id} role="listitem" className="shrink-0">
                <ShowcaseCard project={project} onOpen={onOpen} />
              </div>
            ))}
            <div ref={viewAllRef} role="listitem" className="shrink-0">
              <ViewAllCard />
            </div>
            {/* Dedicated space to the right of the View All card */}
            <div
              className="w-16 sm:w-24 md:w-36 lg:w-48 shrink-0 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <ProjectExpandModal project={active} onClose={onClose} />
    </section>
  );
}


