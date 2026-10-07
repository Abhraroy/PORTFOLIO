// Enums matching prisma/schema.prisma
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP"
  | "SELF_EMPLOYED";

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";

export type ProjectType =
  | "PERSONAL"
  | "PROFESSIONAL"
  | "OPEN_SOURCE"
  | "CLIENT_WORK"
  | "SIDE_PROJECT";

export type ProjectVisibilityStatus =
  | "PUBLIC"
  | "PRIVATE"
  | "UNLISTED"
  | "DRAFT";

// 1. Portfolio Mode
export interface PortfolioMode {
  id: string;
  mode_name: string;
  mode_description?: string | null;
  createdAt: string;
  updatedAt: string;
}

// 2. Project & Mode Content
export interface ProjectModeContent {
  id: string;
  projectId: string;
  portfolioModeId: string;
  project_description?: string | null;
  challenge?: string | null;
  solution?: string | null;
  impact?: string | null;
  project_highlights: string[];
  project_user_count?: number | null;
  project_revenue?: number | null;
  currency?: string | null;
  extra_notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  project_name: string;
  slug: string;
  project_image?: string | null;
  project_images?: string[];
  project_videos?: string[];
  project_url?: string | null;
  project_github?: string | null;
  project_md_url?: string | null;
  project_tags: string[];
  project_tech: string[];
  project_status: ProjectStatus;
  project_type: ProjectType;
  project_visibility_status: ProjectVisibilityStatus;
  createdAt: string;
  updatedAt: string;
  modeContents?: ProjectModeContent[];
}

// 3. Experience & Mode Content
export interface ExperienceModeContent {
  id: string;
  experienceId: string;
  portfolioModeId: string;
  experience_summary?: string | null;
  experience_description?: string | null;
  experience_highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company_name: string;
  role_title: string;
  employment_type: EmploymentType;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  currently_working: boolean;
  experience_image?: string | null;
  experience_tech: string[];
  createdAt: string;
  updatedAt: string;
  modeContents?: ExperienceModeContent[];
  metrics?: ExperienceMetricData[];
  achievements?: ExperienceAchievementData[];
}

// 4. My Details & Mode Content
export interface MyDetailsModeContent {
  id: string;
  myDetailsId: string;
  portfolioModeId: string;
  headline?: string | null;
  short_bio?: string | null;
  detailed_bio?: string | null;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MyDetails {
  id: string;
  full_name: string;
  profile_image?: string | null;
  resume_url?: string | null;
  email: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  x_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  website_url?: string | null;
  location?: string | null;
  address?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  pin_code?: string | null;
  years_of_experience?: number | null;
  createdAt: string;
  updatedAt: string;
  modeContents?: MyDetailsModeContent[];
}

// 5. CMS Portfolio Sections & Blocks
export type PortfolioBlockType =
  | "HERO"
  | "CARD"
  | "PROFILE"
  | "TEXT"
  | "LIST"
  | "MEDIA"
  | "CTA";

export type PortfolioBlockItemType = "TEXT" | "BULLET" | "LINK";

export interface PortfolioBlockItemData {
  id: string;
  blockId: string;
  type: PortfolioBlockItemType;
  content: string;
  url?: string | null;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioBlockData {
  id: string;
  sectionId: string;
  portfolioModeId?: string | null;
  blockNumber: number;
  type: PortfolioBlockType;
  visible: boolean;


  label?: string | null;
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;

  imageUrl?: string | null;
  imageAlt?: string | null;

  ctaText?: string | null;
  ctaUrl?: string | null;
  ctaType?: string | null;
  ctaVisible?: boolean;

  items?: PortfolioBlockItemData[];

  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSectionData {
  id: string;
  key: string;
  title: string;
  visible: boolean;
  order: number;
  blocks: PortfolioBlockData[];
  createdAt: string;
  updatedAt: string;
}

// 6. Factual Domain Extensions
export interface ExperienceMetricData {
  id: string;
  experienceId: string;
  label: string;
  value: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceAchievementData {
  id: string;
  experienceId: string;
  content: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectHighlightData {
  id: string;
  projectId: string;
  content: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// 7. Section CMS Composition Layer
export interface ExperienceSectionCMSItemData {
  id: string;
  sectionId: string;
  experienceId: string;
  displayOrder: number;
  visible: boolean;
  isFeatured: boolean;

  showYear: boolean;
  showRole: boolean;
  showCompany: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showAchievements: boolean;
  showMetrics: boolean;

  createdAt: string;
  updatedAt: string;

  experience?: Experience;
}

export interface ExperienceSectionCMSData {
  id: string;
  key: string;
  defaultActiveId?: string | null;
  visible: boolean;
  items: ExperienceSectionCMSItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedWorkSectionCMSItemData {
  id: string;
  sectionId: string;
  projectId: string;
  displayOrder: number;
  visible: boolean;
  offset?: "up" | "down" | null;
  customNumber?: string | null;

  showOneLiner: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showHighlights: boolean;

  createdAt: string;
  updatedAt: string;

  project?: Project;
}

export interface SelectedWorkSectionCMSData {
  id: string;
  key: string;
  visible: boolean;
  items: SelectedWorkSectionCMSItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectShowcaseSectionCMSItemData {
  id: string;
  sectionId: string;
  projectId: string;
  displayOrder: number;
  visible: boolean;

  showDescription: boolean;
  showTechnologies: boolean;
  showViewAction: boolean;

  createdAt: string;
  updatedAt: string;

  project?: Project;
}

export interface ProjectShowcaseSectionCMSData {
  id: string;
  key: string;
  visible: boolean;
  items: ProjectShowcaseSectionCMSItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface HeroNodeCMSItemData {
  id: string;
  nodeId: string;
  label: string;
  title: string;
  description: string;
  techStack: string[];
  ctaLabel: string;
  ctaHref: string;
  image?: string | null;
  displayOrder: number;
  visible: boolean;

  // Optional InfoCard styling & dimensions overrides per node
  cardWidth?: string | null;
  cardHeight?: string | null;
  cardMinHeight?: string | null;
  cardImageHeight?: string | null;
  titleFontSize?: string | null;
  descriptionFontSize?: string | null;
  techBadgeFontSize?: string | null;
  ctaFontSize?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface HeroNodeCMSData {
  id: string;
  key: string;
  centerNodeLabel?: string | null;
  centerLogoUrl?: string | null;
  visible: boolean;
  items: HeroNodeCMSItemData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MobileHeroSkillData {
  id: string;
  text: string;
  displayOrder: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}



