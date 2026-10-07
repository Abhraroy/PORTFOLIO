"use client";

import { memo } from "react";
import type { ExperienceMilestone as Milestone } from "./experience.config";
import ExperienceDetailContent from "./ExperienceDetailContent";

type ExperienceStickyPanelProps = {
  milestone: Milestone;
};

/**
 * Single sticky detail card — content swaps when active milestone changes.
 */
function ExperienceStickyPanel({ milestone }: ExperienceStickyPanelProps) {
  return (
    <div className="sticky top-24 w-full translate-z-0 overflow-hidden rounded-3xl border border-white/10 p-6 shadow-md contain-[layout_style_paint] sm:p-8 bg-[#415d43]/20 backdrop-blur-2xl">
      <div key={milestone.id} className="experience-panel-enter">
        <ExperienceDetailContent milestone={milestone} />
      </div>
    </div>
  );
}

export default memo(ExperienceStickyPanel);
