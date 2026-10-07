import type { IconType } from "react-icons";
import { FaAws, FaPython, FaDocker, FaGitAlt, FaFigma, FaNodeJs, FaReact, FaCode } from "react-icons/fa6";
import { LuBoxes, LuCode } from "react-icons/lu";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiZod,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiVercel,
  SiExpress,
  SiGo,
  SiRust,
  SiKubernetes,
  SiGooglecloud,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

/** Icon Registry mapping string icon names to React Component Icons */
export const ICON_MAP: Record<string, IconType> = {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiPrisma,
  SiPython,
  SiTailwindcss,
  SiThreedotjs,
  TbBrandFramerMotion,
  LuBoxes,
  SiZod,
  SiDocker,
  SiGit,
  FaAws,
  SiFigma,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiVercel,
  SiExpress,
  SiGo,
  SiRust,
  SiKubernetes,
  SiGooglecloud,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaFigma,
  FaPython,
  FaCode,
  LuCode,
};

export type SkillConfigEntry = {
  id: string;
  name: string;
  icon?: string;
  iconName?: string;
};

export type Skill = {
  id: string;
  name: string;
  icon: string;
  Icon?: IconType;
};

export const SKILLS_SECTION = {
  eyebrow: "Skills",
  heading: "Tech Stack",
  subtitle: "Tools and technologies I use to design, build, and ship products.",
} as const;

/**
 * SINGLE SOURCE OF TRUTH FOR SKILL TRACK
 * Skills rendered in the marquee using Syvixor API icons (https://skills.syvixor.com/api/icons?i=...).
 */
export const SKILL_TRACK_CONFIG: SkillConfigEntry[] = [
  { id: "nextjs", name: "Next.js", icon: "nextjs", iconName: "SiNextdotjs" },
  { id: "react", name: "React", icon: "react", iconName: "SiReact" },
  { id: "typescript", name: "TypeScript", icon: "typescript", iconName: "SiTypescript" },
  { id: "nodejs", name: "Node.js", icon: "nodejs", iconName: "SiNodedotjs" },
  { id: "python", name: "Python", icon: "python", iconName: "SiPython" },
  { id: "tailwind", name: "Tailwind CSS", icon: "tailwind", iconName: "SiTailwindcss" },
  { id: "threejs", name: "Three.js", icon: "threejs", iconName: "SiThreedotjs" },
  { id: "framer", name: "Framer Motion", icon: "framer", iconName: "TbBrandFramerMotion" },
  { id: "zustand", name: "Zustand", icon: "zustand", iconName: "LuBoxes" },
  { id: "zod", name: "Zod", icon: "zod", iconName: "SiZod" },
  { id: "docker", name: "Docker", icon: "docker", iconName: "SiDocker" },
  { id: "git", name: "Git", icon: "git", iconName: "SiGit" },
  { id: "aws", name: "AWS", icon: "aws", iconName: "FaAws" },
  { id: "figma", name: "Figma", icon: "figma", iconName: "SiFigma" },
  { id: "postgresql", name: "PostgreSQL", icon: "postgresql", iconName: "SiPostgresql" },
  { id: "mysql", name: "MySQL", icon: "mysql" },
  { id: "mongodb", name: "MongoDB", icon: "mongodb", iconName: "SiMongodb" },
  { id: "sqlite", name: "SQLite", icon: "sqlite" },
  { id: "sqlalchemy", name: "SQLAlchemy", icon: "sqlalchemy" },
  { id: "sql", name: "SQL", icon: "sql" },
  { id: "supabase", name: "Supabase", icon: "supabase", iconName: "SiSupabase" },
  { id: "firebase", name: "Firebase", icon: "firebase" },
  { id: "neon", name: "Neon", icon: "neon" },
  { id: "appwrite", name: "Appwrite", icon: "appwrite" },
  { id: "chroma", name: "Chroma", icon: "chroma" },
  { id: "redis", name: "Redis", icon: "redis", iconName: "SiRedis" },
  { id: "prisma", name: "Prisma", icon: "prisma", iconName: "SiPrisma" },
  { id: "drizzle", name: "Drizzle", icon: "drizzle" },
];

/** Derived resolved SKILLS array for the UI carousel */
export const SKILLS: Skill[] = SKILL_TRACK_CONFIG.map((entry) => ({
  id: entry.id,
  name: entry.name,
  icon: entry.icon || entry.id,
  Icon: (entry.iconName && ICON_MAP[entry.iconName]) || resolveSkillIcon(entry.id),
}));

export function resolveSkillIcon(nameOrIcon?: string): IconType {
  if (!nameOrIcon) return LuCode;
  if (ICON_MAP[nameOrIcon]) return ICON_MAP[nameOrIcon];
  const clean = nameOrIcon.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    const keyClean = key.toLowerCase().replace(/^si|^fa|^tb|^lu/, "");
    if (keyClean && (clean.includes(keyClean) || keyClean.includes(clean))) {
      return icon;
    }
  }
  return LuCode;
}

