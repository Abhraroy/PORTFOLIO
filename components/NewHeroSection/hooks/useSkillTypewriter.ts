"use client";

import { useEffect, useState } from "react";

export type SkillTypewriterOptions = {
  skills: readonly string[];
  typeMs: number;
  deleteMs: number;
  holdMs: number;
  pauseMs: number;
};

export type SkillTypewriterState = {
  /** Partial or full skill currently shown after the prefix. */
  displayText: string;
  /** True while characters are being removed. */
  isDeleting: boolean;
  /** Full skill announced to screen readers (only when typing completes). */
  announcedSkill: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Cycles through skills with a type → hold → delete → next loop.
 * When `prefers-reduced-motion` is set, shows the first skill statically.
 */
export function useSkillTypewriter({
  skills,
  typeMs,
  deleteMs,
  holdMs,
  pauseMs,
}: SkillTypewriterOptions): SkillTypewriterState {
  const first = skills[0] ?? "";
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [announcedSkill, setAnnouncedSkill] = useState(first);
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || skills.length === 0) return;

    const current = skills[index] ?? "";

    if (!isDeleting && displayText === current) {
      const announce = window.setTimeout(() => setAnnouncedSkill(current), 0);
      const t = window.setTimeout(() => setIsDeleting(true), holdMs);
      return () => {
        window.clearTimeout(announce);
        window.clearTimeout(t);
      };
    }

    if (isDeleting && displayText === "") {
      const t = window.setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % skills.length);
      }, pauseMs);
      return () => window.clearTimeout(t);
    }

    const delay = isDeleting ? deleteMs : typeMs;
    const t = window.setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? current.slice(0, Math.max(0, prev.length - 1))
          : current.slice(0, prev.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(t);
  }, [
    deleteMs,
    displayText,
    holdMs,
    index,
    isDeleting,
    pauseMs,
    reduceMotion,
    skills,
    typeMs,
  ]);

  if (reduceMotion || skills.length === 0) {
    return { displayText: first, isDeleting: false, announcedSkill: first };
  }

  return { displayText, isDeleting, announcedSkill };
}
