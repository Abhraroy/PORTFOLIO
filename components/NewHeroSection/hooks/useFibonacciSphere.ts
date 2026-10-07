"use client";

import { useMemo } from "react";
import { getSkillsForCount } from "../config/nodes.data";
import type { PositionedSkillNode, SkillNodeData } from "../types/network";
import { fibonacciSphere } from "../utils/fibonacciSphere";
import { useAdminStore } from "@/app/admin/_components/store";

/**
 * Memoized Fibonacci placement of skill nodes.
 * Connects to Admin Store CMS (heroNodesCMS) with fallback to local catalog.
 *
 * @param count - Number of skills to place (from breakpoint `nodeCount`)
 * @param radius - Sphere radius (from breakpoint `radius`)
 * @returns Skills with `position` and `index` attached
 */
export function useFibonacciSphere(
  count: number,
  radius: number,
): PositionedSkillNode[] {
  const heroNodesCMS = useAdminStore((s) => s.heroNodesCMS);

  return useMemo(() => {
    const cmsItems = heroNodesCMS?.items?.filter((item) => item.visible) || [];
    let skills: SkillNodeData[];

    if (cmsItems.length > 0) {
      const sorted = [...cmsItems].sort((a, b) => a.displayOrder - b.displayOrder);
      const sliced = sorted.slice(0, Math.min(count, sorted.length));
      skills = sliced.map((item) => ({
        id: item.nodeId || item.id,
        label: item.label || "Placeholder",
        title: item.title || "Placeholder",
        description: item.description || "Placeholder",
        techStack: item.techStack && item.techStack.length > 0 ? item.techStack : ["Placeholder"],
        cta: { label: item.ctaLabel || "Placeholder", href: item.ctaHref || "/#work" },
        image: item.image || undefined,
        cardWidth: item.cardWidth || undefined,
        cardHeight: item.cardHeight || undefined,
        cardMinHeight: item.cardMinHeight || undefined,
        cardImageHeight: item.cardImageHeight || undefined,
        titleFontSize: item.titleFontSize || undefined,
        descriptionFontSize: item.descriptionFontSize || undefined,
        techBadgeFontSize: item.techBadgeFontSize || undefined,
        ctaFontSize: item.ctaFontSize || undefined,
      }));
    } else {
      skills = getSkillsForCount(count);
    }

    const positions = fibonacciSphere(skills.length, radius);
    return skills.map((skill, index) => ({
      ...skill,
      index,
      position: positions[index] ?? ([0, 0, 0] as const),
    }));
  }, [count, radius, heroNodesCMS]);
}
