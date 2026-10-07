import type { IconType } from "react-icons";
import {
  SiDocker,
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiThreedotjs,
  SiTypescript,
} from "react-icons/si";

export type HeroBackgroundIcon = {
  id: string;
  Icon: IconType;
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity: number;
};

/** Fixed scatter layout — stable for SSR (no runtime random). */
export const HERO_BACKGROUND_ICONS: HeroBackgroundIcon[] = [
  { id: "nextjs", Icon: SiNextdotjs, top: "10%", left: "7%", size: 30, rotate: -14, opacity: 0.1 },
  { id: "react", Icon: SiReact, top: "14%", left: "82%", size: 34, rotate: 10, opacity: 0.09 },
  { id: "typescript", Icon: SiTypescript, top: "38%", left: "4%", size: 26, rotate: 8, opacity: 0.08 },
  { id: "threejs", Icon: SiThreedotjs, top: "52%", left: "88%", size: 28, rotate: -18, opacity: 0.1 },
  { id: "nodejs", Icon: SiNodedotjs, top: "72%", left: "12%", size: 32, rotate: 12, opacity: 0.09 },
  { id: "postgresql", Icon: SiPostgresql, top: "78%", left: "76%", size: 27, rotate: -8, opacity: 0.08 },
  { id: "docker", Icon: SiDocker, top: "28%", left: "58%", size: 24, rotate: -6, opacity: 0.07 },
  { id: "git", Icon: SiGit, top: "62%", left: "42%", size: 22, rotate: 16, opacity: 0.07 },
];
