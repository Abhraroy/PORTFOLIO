"use client";

import { memo } from "react";
import type { ExperienceMilestone } from "./experience.config";
import ExperienceDetailContent from "./ExperienceDetailContent";

type ExperienceMilestoneProps = {
  milestone: ExperienceMilestone;
  variant: "desktop" | "mobile";
  isExpanded?: boolean;
  onToggle?: (id: string) => void;
  /** Desktop: which point is active / already passed for glow. */
  isActive?: boolean;
  isPassed?: boolean;
};

/**
 * Roadmap milestone — desktop summary row or mobile expandable row.
 */
function ExperienceMilestone({
  milestone,
  variant,
  isExpanded = false,
  onToggle,
  isActive = false,
  isPassed = false,
}: ExperienceMilestoneProps) {
  if (variant === "mobile") {
    return (
      <div className="relative border-b border-white/10 last:border-b-0">
        <button
          type="button"
          onClick={() => onToggle?.(milestone.id)}
          aria-expanded={isExpanded}
          className="flex w-full items-start gap-4 py-5 text-left transition-colors"
        >
          <span
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-300 ease-out ${
              isExpanded
                ? "scale-110 border-zinc-200 bg-zinc-200 shadow-[0_0_12px_rgba(244,244,245,0.55)]"
                : "border-white/25 bg-transparent"
            }`}
            aria-hidden
          />
          <span className="min-w-0 flex-1 space-y-1">
            {milestone.showYear !== false && milestone.year ? (
              <span className="block font-mono text-[10px] tracking-[0.28em] text-white uppercase">
                {milestone.year}
              </span>
            ) : null}
            {milestone.showRole !== false && milestone.title ? (
              <span
                className="block font-mono text-base text-white transition-colors duration-300"
              >
                {milestone.title}
              </span>
            ) : null}
            {milestone.showCompany !== false && milestone.summary ? (
              <span className="block text-sm text-white">{milestone.summary}</span>
            ) : null}
          </span>
          <span
            className={`mt-1 shrink-0 rounded-md border border-white/10 bg-white/5 p-1 transition-all duration-300 ease-out ${
              isExpanded
                ? "rotate-180 border-white/30 bg-white/15 text-white"
                : "text-white"
            }`}
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 5.5L7 9.5L11 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        >
          <div
            className={`min-h-0 overflow-hidden transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {isExpanded ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 pb-6 sm:p-5">
                <ExperienceDetailContent milestone={milestone} compact />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-milestone-row
      data-milestone-id={milestone.id}
      className="relative flex min-h-[40vh] gap-5 pb-8 last:pb-0"
    >
      <div className="relative flex w-3 shrink-0 flex-col items-center">
        <span
          data-milestone-dot
          className={`experience-dot z-10 mt-1.5 h-3 w-3 rounded-full border border-white/25 bg-zinc-950 transition-[box-shadow,transform,background-color,border-color] duration-300 ease-out ${
            isActive
              ? "experience-dot--active"
              : isPassed
                ? "experience-dot--passed"
                : ""
          }`}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1 pl-1">
        {milestone.showYear !== false && milestone.year ? (
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {milestone.year}
          </p>
        ) : null}
        {milestone.showRole !== false && milestone.title ? (
          <h3 className="mt-1.5 font-mono text-lg text-white sm:text-xl">
            {milestone.title}
          </h3>
        ) : null}
        {milestone.showCompany !== false && milestone.summary ? (
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white">
            {milestone.summary}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default memo(ExperienceMilestone);
