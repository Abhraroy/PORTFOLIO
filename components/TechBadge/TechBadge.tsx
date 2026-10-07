"use client";

import { useState, useEffect } from "react";
import { getTechSlug, LOCAL_SKILL_ICONS } from "./techConfig";

interface TechBadgeProps {
  tech: string;
  className?: string;
  size?: "sm" | "md";
}

export default function TechBadge({ tech, className = "", size = "md" }: TechBadgeProps) {
  const trimmed = tech?.trim() || "";
  const slug = getTechSlug(trimmed);

  // Status lifecycle:
  // "local"  -> try local SVG at /icons/skills/[slug].svg
  // "remote" -> try remote Syvixor API at https://skills.syvixor.com/api/icons?i=[slug]
  // "failed" -> no image found or both failed, fallback to plain text badge
  const initialStatus = slug ? (LOCAL_SKILL_ICONS.has(slug) ? "local" : "remote") : "failed";
  const [status, setStatus] = useState<"local" | "remote" | "failed">(initialStatus);

  useEffect(() => {
    const s = getTechSlug(trimmed);
    setStatus(s ? (LOCAL_SKILL_ICONS.has(s) ? "local" : "remote") : "failed");
  }, [trimmed]);

  if (!trimmed) return null;

  // Fallback to text if no image is available or image loading failed
  if (status === "failed" || !slug) {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white transition-colors duration-150 hover:border-white/20 ${className}`}
      >
        {trimmed}
      </span>
    );
  }

  const imgSrc =
    status === "local"
      ? `/icons/skills/${slug}.svg`
      : `https://skills.syvixor.com/api/icons?i=${slug}`;

  const isSm = size === "sm";

  return (
    <span className={`tech-badge group/tech ${className}`}>
      <span
        className={`flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:scale-105 ${
          isSm ? "h-7 w-7" : "h-7.5 w-7.5 sm:h-8 sm:w-8"
        }`}
      >
        <img
          src={imgSrc}
          alt={trimmed}
          className="size-full object-contain select-none pointer-events-none"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => {
            if (status === "local") {
              // Try remote fallback before giving up
              setStatus("remote");
            } else {
              // Remote also failed, fallback to text
              setStatus("failed");
            }
          }}
        />
      </span>

      {/* Hover tooltip displaying tech name */}
      <span role="tooltip" className="tech-badge__tooltip">
        {trimmed}
      </span>
    </span>
  );
}
