"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import ExperienceMilestone from "./ExperienceMilestone";
import ExperienceStickyPanel from "./ExperienceStickyPanel";
import { EXPERIENCE_MILESTONES as FALLBACK_MILESTONES, type ExperienceMilestone as ExperienceMilestoneType } from "./experience.config";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { useIsLg } from "./hooks/useIsLg";
import { useAdminStore } from "@/app/admin/_components/store";

export default function Experience() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const pathFillRef = useRef<HTMLDivElement>(null);
  const isLg = useIsLg();

  const { experiences, experienceMetrics, experienceAchievements, experienceCMS, activeModeId } = useAdminStore();

  // Derive dynamic milestones from ExperienceSectionCMS composition layer
  const milestones: ExperienceMilestoneType[] = useMemo(() => {
    const formatYear = (exp: typeof experiences[0]) => {
      if (!exp.start_date) return "2024";
      const startYear = new Date(exp.start_date).getFullYear().toString();
      const endYear = exp.currently_working
        ? "Present"
        : exp.end_date
          ? new Date(exp.end_date).getFullYear().toString()
          : "";
      if (startYear && endYear && startYear !== endYear) {
        return `${startYear} — ${endYear}`;
      }
      return startYear || endYear || "2024";
    };

    if (!experienceCMS || !experienceCMS.items || experienceCMS.items.length === 0) {
      if (experiences.length > 0) {
        return experiences.map((exp) => {
          const modeContent =
            exp.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
            exp.modeContents?.[0];

          const companyLocation = `${exp.company_name || ""}${exp.location ? ` · ${exp.location}` : ""}`;
          const summary = modeContent?.experience_summary || companyLocation || "Experience";
          const description = modeContent?.experience_description || modeContent?.experience_summary || exp.role_title || "";

          const techStack = exp.experience_tech && exp.experience_tech.length > 0
            ? exp.experience_tech
            : [];

          const masterAchievements = (exp.achievements || [])
            .filter((a) => a.visible !== false)
            .sort((a, b) => a.order - b.order)
            .map((a) => a.content);

          const achievements = masterAchievements.length > 0
            ? masterAchievements
            : (modeContent?.experience_highlights || []);

          const stats = (exp.metrics || [])
            .filter((m) => m.visible !== false)
            .sort((a, b) => a.order - b.order)
            .map((m) => ({ label: m.label, value: m.value }));

          return {
            id: exp.id,
            year: formatYear(exp),
            title: exp.role_title || "Experience",
            summary,
            description,
            techStack,
            achievements,
            stats,
            image: exp.experience_image || undefined,
            showYear: true,
            showRole: true,
            showCompany: true,
            showDescription: true,
            showTechnologies: true,
            showAchievements: true,
            showMetrics: true,
            isFeatured: false,
          };
        });
      }
      return [];
    }

    const activeCMSItems = [...experienceCMS.items]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const derived = activeCMSItems
      .map((item) => {
        const exp = experiences.find((e) => e.id === item.experienceId);
        if (!exp) return null;

        const modeContent =
          exp.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
          exp.modeContents?.[0];

        const companyLocation = `${exp.company_name || ""}${exp.location ? ` · ${exp.location}` : ""}`;
        const summary = modeContent?.experience_summary || companyLocation || "Experience";
        const description = modeContent?.experience_description || modeContent?.experience_summary || exp.role_title || "";

        const techStack = exp.experience_tech && exp.experience_tech.length > 0
          ? exp.experience_tech
          : [];

        const masterAchievements = (exp.achievements || [])
          .filter((a) => a.visible !== false)
          .sort((a, b) => a.order - b.order)
          .map((a) => a.content);

        const storeAchievements = experienceAchievements
          .filter((a) => a.experienceId === item.experienceId && a.visible)
          .sort((a, b) => a.order - b.order)
          .map((a) => a.content);

        const achievements =
          masterAchievements.length > 0
            ? masterAchievements
            : storeAchievements.length > 0
              ? storeAchievements
              : (modeContent?.experience_highlights || []);

        const masterMetrics = (exp.metrics || [])
          .filter((m) => m.visible !== false)
          .sort((a, b) => a.order - b.order)
          .map((m) => ({ label: m.label, value: m.value }));

        const storeMetrics = experienceMetrics
          .filter((m) => m.experienceId === item.experienceId && m.visible)
          .sort((a, b) => a.order - b.order)
          .map((m) => ({ label: m.label, value: m.value }));

        const stats = masterMetrics.length > 0 ? masterMetrics : storeMetrics;

        return {
          id: exp.id,
          year: formatYear(exp),
          title: exp.role_title || "Experience",
          summary,
          description,
          techStack,
          achievements,
          stats,
          image: exp.experience_image || undefined,
          showYear: item.showYear ?? true,
          showRole: item.showRole ?? true,
          showCompany: item.showCompany ?? true,
          showDescription: item.showDescription ?? true,
          showTechnologies: item.showTechnologies ?? true,
          showAchievements: item.showAchievements ?? true,
          showMetrics: item.showMetrics ?? true,
          isFeatured: item.isFeatured ?? false,
        };
      })
      .filter(Boolean) as ExperienceMilestoneType[];

    return derived;
  }, [experiences, experienceMetrics, experienceAchievements, experienceCMS, activeModeId]);

  const milestoneIds = useMemo(() => milestones.map((m) => m.id), [milestones]);

  // Default active ID uses configured defaultActiveId or top ordered item
  const initialActiveId =
    (experienceCMS?.defaultActiveId && milestoneIds.includes(experienceCMS.defaultActiveId))
      ? experienceCMS.defaultActiveId
      : milestoneIds[0] ?? "";

  const [activeId, setActiveId] = useState(initialActiveId);
  const [expandedId, setExpandedId] = useState(initialActiveId);

  const handleActiveId = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? "" : id));
  }, []);

  useExperienceScroll({
    roadmapRef,
    pathFillRef,
    milestoneIds,
    enabled: isLg === true,
    onActiveId: handleActiveId,
  });

  const activeMilestone =
    milestones.find((m) => m.id === activeId) ?? milestones[0];
  const activeIndex = milestoneIds.indexOf(activeId);

  return (
    <section
      id="experience"
      className="relative w-full scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="experience-heading"
    >
      <span id="achievements" className="absolute -top-24 block pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="min-w-0">
          <header className="mb-10 space-y-3 sm:mb-12">
            <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
              Experience
            </p>
            <h2
              id="experience-heading"
              className="font-mono text-2xl text-white sm:text-3xl"
            >
              Experience Journey
            </h2>
          </header>

          {isLg === null ? (
            <div className="min-h-[40vh]" aria-hidden />
          ) : null}

          {isLg === true ? (
            <div
              ref={roadmapRef}
              className="relative"
              role="list"
              aria-label="Career milestones"
            >
              <div
                className="pointer-events-none absolute top-0 bottom-0 left-0 w-3"
                aria-hidden
              >
                <div className="absolute top-[18px] bottom-[18px] left-1/2 w-px -translate-x-1/2 bg-white/10" />
                <div
                  ref={pathFillRef}
                  className="absolute top-[18px] bottom-[18px] left-1/2 w-px origin-top -translate-x-1/2 bg-zinc-100"
                />
              </div>

              {milestones.map((milestone, index) => (
                <div key={milestone.id} role="listitem">
                  <ExperienceMilestone
                    milestone={milestone}
                    variant="desktop"
                    isActive={milestone.id === activeId}
                    isPassed={activeIndex >= 0 && index < activeIndex}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {isLg === false ? (
            <div role="list" aria-label="Career milestones">
              {milestones.map((milestone) => (
                <div key={milestone.id} role="listitem">
                  <ExperienceMilestone
                    milestone={milestone}
                    variant="mobile"
                    isExpanded={expandedId === milestone.id}
                    onToggle={handleToggle}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {isLg === true && activeMilestone ? (
          <div className="min-w-0">
            <ExperienceStickyPanel milestone={activeMilestone} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

