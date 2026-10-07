"use client";

import React from "react";
import { FloatingBadgeCardProps, normalizeLine } from "./types";
import { useThreeDCardScene } from "./ThreeDCardSceneContext";

/**
 * FloatingBadgeCard
 * Subtle floating pill/badge sitting at an intermediate Z-plane.
 * Enhances depth layering and compositional balance with optional line number prefix.
 */
export default function FloatingBadgeCard({
  className = "",
  lineNo = "01",
  text = "Available for work",
  lines,
  statusColor = "",
  children,
  translateZ = 35,
  rotateZ = -1.5,
  parallaxMultiplier = 1.2,
}: FloatingBadgeCardProps) {
  const { parallax } = useThreeDCardScene();

  const offsetX = parallax.mouseX * 10 * parallaxMultiplier;
  const offsetY = parallax.mouseY * 8 * parallaxMultiplier;

  return (
    <div
      className={`absolute -top-4 right-4 sm:-top-5 sm:-right-20 z-20 transition-all duration-75 select-none  ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px) rotateZ(${rotateZ}deg)`,
      }}
    >
      <div className="relative flex items-center gap-2 rounded-full border border-emerald-500/25 bg-[#a1cca5] px-3 py-1 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.6),0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-xl">
        {children ? (
          children
        ) : (
          <>
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)] ${statusColor}`} />
            {lines ? (
              <div className="flex items-center gap-2">
                {lines.map((l, i) => {
                  const normalized = normalizeLine(l, i);
                  return (
                    <span
                      key={i}
                      className="font-mono text-[10px] font-semibold tracking-wider text-black uppercase"
                    >
                      {normalized.text}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="font-mono text-[10px] font-semibold tracking-wider text-black uppercase">
                {text}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
