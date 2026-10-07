"use client";

import React from "react";
import ThreeDCardScene from "./ThreeDCardScene";
import ThreeDCard from "./ThreeDCard";
import CardContent from "./CardContent";
import FloatingStatCard from "./FloatingStatCard";
import FloatingInsightCard from "./FloatingInsightCard";
import FloatingActionCard from "./FloatingActionCard";
import FloatingBadgeCard from "./FloatingBadgeCard";
import { LineContentInput } from "./types";
import { trackScrolledPastHero } from "@/lib/track";

export interface ThreeDFloatingHeroCardProps {
  className?: string;
  onExploreClick?: () => void;
  actionLabel?: string;
  actionHref?: string;
  /** Primary card title (defaults to "blank.dev") */
  cardTitle?: string;
  /** Primary card lines */
  lines?: LineContentInput[];
  /** Primary card footer lines */
  footerLines?: LineContentInput[];
  /** Secondary floating card lines */
  statLines?: LineContentInput[];
  /** Editorial note floating card lines */
  noteLines?: LineContentInput[];
  /** Badge text */
  badgeText?: string;
}

/**
 * ThreeDFloatingHeroCard
 * Ready-to-use turnkey 3D floating composition inspired by high-end design engineering portfolios.
 * Assembles ThreeDCardScene, ThreeDCard, CardContent, and floating secondary elements.
 * Uses flexible line numbers for all text content without fixed key-value metric schemas.
 */
export default function ThreeDFloatingHeroCard({
  className = "",
  onExploreClick,
  actionLabel = "Explore my site",
  actionHref,
  cardTitle,
  lines,
  footerLines,
  statLines,
  noteLines,
  badgeText,
}: ThreeDFloatingHeroCardProps) {
  const handleActionClick = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    trackScrolledPastHero();
    // Fallback: smooth scroll past hero viewport to next section
    if (typeof window !== "undefined") {
      const heroSection = document.querySelector("section");
      const next = heroSection?.nextElementSibling as HTMLElement | null;
      if (next) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`relative  flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-visible ${className} bg-[#111d13]`}
    >
      {/* Responsive Scaling Wrapper */}
      <div className="relative transform-gpu scale-[0.82] xs:scale-[0.88] sm:scale-95 md:scale-110 transition-transform duration-300">
        <ThreeDCardScene
          perspective={1200}
          initialRotateX={7}
          initialRotateY={-11}
          maxMouseRotateX={6}
          maxMouseRotateY={8}
          enableParallax={true}
          enableFloat={true}
        >
          {/* Main Primary 3D Card */}
          <ThreeDCard
            width="w-[300px] sm:w-[340px] md:w-[420px]"
            height="min-h-[460px] sm:min-h-[520px]"
          >
            <CardContent />
          </ThreeDCard>

          {/* Floating Secondary UI Elements in 3D Space */}

          {/* 1. Floating Secondary Card (Top left) */}
          <FloatingStatCard
            title="HI"
            translateZ={60}
            rotateZ={-3.5}
            parallaxMultiplier={1.65}
          />

          {/* 2. Floating Note Card (Bottom Left) */}
          <FloatingInsightCard
            tag=""
            lines={
              noteLines || [
                "Simplicity is the prerequisite for reliability.",
                "Design with intent, build with precision.",
              ]
            }
            footer=""
            translateZ={75}
            rotateZ={2.8}
            parallaxMultiplier={1.85}
          />

          {/* 3. Floating Action Card / Button (Bottom Right) */}
          <FloatingActionCard
            label={actionLabel}
            href={actionHref}
            onClick={handleActionClick}
            translateZ={48}
            rotateZ={-2}
            parallaxMultiplier={1.4}
          />

          {/* 4. Floating Badge (Top Right - hidden on ultra-small mobile to prevent clutter) */}
          <FloatingBadgeCard
            className="hidden sm:flex"
            text={badgeText || "Available for work"}
            statusColor="bg-emerald-500"
            translateZ={32}
            rotateZ={-1.5}
            parallaxMultiplier={1.15}
          />
        </ThreeDCardScene>
      </div>
    </div>
  );
}
