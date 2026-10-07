export type ExperienceStat = {
  label: string;
  value: string;
};

export type ExperienceMilestone = {
  id: string;
  year: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  achievements: string[];
  stats: ExperienceStat[];
  image?: string;
  showYear?: boolean;
  showRole?: boolean;
  showCompany?: boolean;
  showDescription?: boolean;
  showTechnologies?: boolean;
  showAchievements?: boolean;
  showMetrics?: boolean;
  isFeatured?: boolean;
};

export const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [];
