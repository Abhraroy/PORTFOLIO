"use client";

import Image from "next/image";
import { memo } from "react";
import type { ExperienceMilestone } from "./experience.config";

type ExperienceDetailContentProps = {
  milestone: ExperienceMilestone;
  /** Compact padding for mobile accordion vs desktop sticky card. */
  compact?: boolean;
};

/**
 * Shared milestone detail body — sticky desktop card and mobile accordion.
 */
function ExperienceDetailContent({
  milestone,
  compact = false,
}: ExperienceDetailContentProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {milestone.image ? (
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-44">
          <Image
            src={milestone.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full rounded-full bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700"
          aria-hidden
        />
      )}

      <div className="space-y-1.5  ">
        {milestone.showYear !== false && milestone.year ? (
          <p className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
            {milestone.year}
          </p>
        ) : null}
        {milestone.showRole !== false && milestone.title ? (
          <h3 className="font-mono text-2xl leading-tight text-white lg:text-3xl">
            {milestone.title}
          </h3>
        ) : null}
        {milestone.showCompany !== false && milestone.summary ? (
          <p className="text-xs text-white font-mono">
            {milestone.summary}
          </p>
        ) : null}
      </div>

      {milestone.showDescription !== false && milestone.description ? (
        <p className="text-sm leading-relaxed text-white">
          {milestone.description}
        </p>
      ) : null}

      {milestone.showTechnologies !== false && milestone.techStack && milestone.techStack.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white uppercase">
            Tech stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {milestone.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {milestone.showAchievements !== false && milestone.achievements && milestone.achievements.length > 0 ? (
        <div className="space-y-2">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white uppercase">
            Key achievements
          </p>
          <ul className="space-y-1.5">
            {milestone.achievements.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-white"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {milestone.showMetrics !== false && milestone.stats && milestone.stats.length > 0 ? (
        <div className={`grid gap-2 border-t border-white/10 pt-4 ${
          milestone.stats.length === 1
            ? "grid-cols-1"
            : milestone.stats.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        }`}>
          {milestone.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center"
            >
              <p className="font-mono text-sm font-medium text-white sm:text-base">
                {stat.value}
              </p>
              <p className="mt-0.5 font-mono text-[9px] tracking-wide text-white uppercase sm:text-[10px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default memo(ExperienceDetailContent);
