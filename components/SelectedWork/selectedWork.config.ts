export type ProjectMetric = {
  label: string;
};

export type SelectedProject = {
  id: string;
  slug: string;
  number: string;
  name: string;
  oneLiner: string;
  techStack: string[];
  metrics: ProjectMetric[];
  challenge: string;
  solution: string;
  impact: string;
  technicalHighlights: string[];
  userCount?: number | null;
  revenue?: number | null;
  currency?: string | null;
  extraNotes?: string | null;
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  projectImage?: string | null;
  projectImages?: string[];
  projectVideos?: string[];
  /** Slight vertical offset for masonry rhythm on desktop. */
  offset?: "up" | "down";
  
};

export const SELECTED_WORK = {
  eyebrow: "Selected Work",
  heading: "SELECTED WORK",
  subtitle:
    "Products, platforms, and systems I've designed, built, and shipped.",
} as const;

export const SELECTED_PROJECTS: SelectedProject[] = [];

export function formatMetricNumber(
  num: number | null | undefined,
  prefix = "",
  suffix = ""
): string {
  if (num === null || num === undefined || isNaN(num) || num <= 0) return "";
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1);
    return `${prefix}${formatted}M+${suffix}`;
  }
  if (num >= 1_000) {
    const formatted = (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1);
    return `${prefix}${formatted}K+${suffix}`;
  }
  return `${prefix}${num.toLocaleString()}${suffix}`;
}

export function getProjectBySlug(slug: string): SelectedProject | undefined {
  return SELECTED_PROJECTS.find((project) => project.slug === slug);
}
