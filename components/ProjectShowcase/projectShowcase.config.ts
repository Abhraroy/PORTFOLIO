import {
  SELECTED_PROJECTS,
  type SelectedProject,
} from "@/components/SelectedWork/selectedWork.config";

export type ShowcaseProject = SelectedProject;

export const PROJECT_SHOWCASE = {
  eyebrow: "Projects",
  heading: "PROJECT SHOWCASE",
  subtitle:
    "Scroll through products and systems I've designed, built, and shipped.",
} as const;

/** Shared card shell — keeps every slide the same size. */
export const SHOWCASE_CARD_CLASS =
  "showcase-card relative h-[340px] w-[min(82vw,340px)] shrink-0 sm:h-[360px] sm:w-[360px] lg:h-[380px] lg:w-[400px]";

export const VIEW_ALL_CARD = {
  eyebrow: "Archive",
  title: "View all projects",
  body: "Browse the full case-study archive — every product, platform, and system.",
  href: "/projects",
  cta: "Explore all",
} as const;

/** Reuse selected-work project data for the horizontal showcase. */
export const SHOWCASE_PROJECTS: ShowcaseProject[] = SELECTED_PROJECTS;
