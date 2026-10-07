"use client";

import React from "react";
import { FloatingStatCardProps, normalizeLine } from "./types";
import { useThreeDCardScene } from "./ThreeDCardSceneContext";

const DEFAULT_LINES = [
  "Creative Dev & 3D",
  "Systems Architecture",
];

/**
 * FloatingStatCard
 * Floating secondary line-based card.
 * Floats at an elevated Z-plane with subtle rotation and distinct parallax motion.
 * Accepts flexible line items with line numbers instead of rigid metric data.
 */
export default function FloatingStatCard({
  className = "",
  title = "HI",
  tag,
  lineNo,
  lines,
  children,
  translateZ = 60,
  rotateZ = -3,
  parallaxMultiplier = 1.6,
  value,
  label,
  trend,
  period,
}: FloatingStatCardProps) {
  const { parallax } = useThreeDCardScene();

  // Foreground parallax delta (moves faster than the primary card)
  const offsetX = parallax.mouseX * 16 * parallaxMultiplier;
  const offsetY = parallax.mouseY * 14 * parallaxMultiplier;

  // Resolve lines from props or fallback to legacy value/label if provided
  const resolvedLines = lines
    ? lines
    : value || label
    ? [label || "Metric", value || ""]
    : DEFAULT_LINES;

  const normalizedLines = resolvedLines.map((item, idx) =>
    normalizeLine(item, idx)
  );

  return (
    <div
      className={`absolute -top-6 -left-10 sm:-top-8 sm:-left-20 z-30 transition-all duration-75 select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px) rotateZ(${rotateZ}deg) rotateX(${
          parallax.rotateX * 0.4
        }deg) rotateY(${parallax.rotateY * 0.4}deg)`,
      }}
    >
      {/* Dynamic Layered Shadow cast onto the main card underneath */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-2xl bg-black/50 blur-xl transition-transform duration-100"
        style={{
          transform: `translate3d(${parallax.mouseX * -4}px, ${
            14 + parallax.mouseY * -3
          }px, -20px)`,
        }}
      />

      {/* Physical Card Body */}
      <div className="relative flex items-center justify-center rounded-2xl border border-emerald-500/20 bg-[#162719]/90 px-4 py-2 sm:px-5 sm:py-2.5 shadow-[0_20px_45px_-8px_rgba(0,0,0,0.7),0_0_20px_-4px_rgba(34,197,94,0.12)] backdrop-blur-xl">
        {/* Subtle top edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
        />

        {children ? (
          children
        ) : (
          <span className="font-pixelify-sans text-sm sm:text-[3rem] font-bold tracking-widest text-zinc-100">
            {title || "HI !"}
          </span>
        )}
      </div>
    </div>
  );
}
