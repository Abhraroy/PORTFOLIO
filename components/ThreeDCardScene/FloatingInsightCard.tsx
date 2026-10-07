"use client";

import React from "react";
import { FloatingInsightCardProps, normalizeLine } from "./types";
import { useThreeDCardScene } from "./ThreeDCardSceneContext";

const DEFAULT_LINES = [
  "Simplicity is the prerequisite for reliability.",
  "Code crafted with care and intent.",
];

/**
 * FloatingInsightCard
 * Editorial message card rendered with line numbers.
 * Sits at an elevated Z-plane with subtle tilt and cast shadow over the main card.
 * Enables freeform line-based authoring without fixed key-value schemas.
 */
export default function FloatingInsightCard({
  className = "",
  tag = "",
  title,
  lineNo,
  lines,
  footer = "",
  children,
  translateZ = 75,
  rotateZ = 2.5,
  parallaxMultiplier = 1.85,
  quote,
  author,
  category,
}: FloatingInsightCardProps) {
  const { parallax } = useThreeDCardScene();

  const offsetX = parallax.mouseX * 20 * parallaxMultiplier;
  const offsetY = parallax.mouseY * 16 * parallaxMultiplier;

  const resolvedLines = lines
    ? lines
    : quote
    ? [quote]
    : DEFAULT_LINES;

  const normalizedLines = resolvedLines.map((item, idx) =>
    normalizeLine(item, idx)
  );

  const displayTag = tag || category || "";
  const displayFooter = footer || author;

  return (
    <div
      className={`absolute bottom-8 -left-5 sm:bottom-5 sm:-left-20 z-40 max-w-[240px] sm:max-w-[280px] transition-all duration-75  select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px) rotateZ(${rotateZ}deg) rotateX(${
          parallax.rotateX * 0.5
        }deg) rotateY(${parallax.rotateY * 0.5}deg)`,
      }}
    >
      {/* High-elevation shadow cast on background layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-2xl bg-black/60 blur-2xl transition-transform duration-100"
        style={{
          transform: `translate3d(${parallax.mouseX * -6}px, ${
            18 + parallax.mouseY * -4
          }px, -28px)`,
        }}
      />

      {/* Card Body */}
      <div className="relative rounded-2xl border border-emerald-500/20 bg-[#142317]/90 p-3.5 sm:p-4 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.7),0_0_24px_-4px_rgba(34,197,94,0.12)] backdrop-blur-xl">
        {/* Specular Edge Highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
        />

        {children ? (
          children
        ) : (
          <>

            {/* Line items */}
            <div className="space-y-1.5 pt-0.5">
              {normalizedLines.map((line, idx) => (
                <div key={idx} className="flex items-start">
                  <p className="text-xs sm:text-[13px] leading-snug font-medium text-zinc-100 break-words flex-1">
                    {line.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            {displayFooter && (
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-zinc-400">
                <span className="font-mono text-[10px] font-medium tracking-wide text-zinc-400">
                  {displayFooter}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
