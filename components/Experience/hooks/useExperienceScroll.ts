"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startTransition, useLayoutEffect, useRef, type RefObject } from "react";
import { registerScrollTrigger } from "@/lib/gsap/scrollTrigger";

type UseExperienceScrollOptions = {
  roadmapRef: RefObject<HTMLElement | null>;
  pathFillRef: RefObject<HTMLElement | null>;
  milestoneIds: readonly string[];
  enabled?: boolean;
  onActiveId: (id: string) => void;
};

/**
 * Activates a milestone when its row crosses the viewport center.
 * No scrub, no inter-point distance math — updates only on cross.
 */
export function useExperienceScroll({
  roadmapRef,
  pathFillRef,
  milestoneIds,
  enabled = true,
  onActiveId,
}: UseExperienceScrollOptions) {
  const lastIndexRef = useRef(0);
  const onActiveIdRef = useRef(onActiveId);
  onActiveIdRef.current = onActiveId;

  useLayoutEffect(() => {
    if (!enabled) return;

    registerScrollTrigger();

    const roadmap = roadmapRef.current;
    const pathFill = pathFillRef.current;
    if (!roadmap || !pathFill) return;

    const count = milestoneIds.length;
    if (count === 0) return;

    const rows = [
      ...roadmap.querySelectorAll<HTMLElement>("[data-milestone-row]"),
    ];

    gsap.set(pathFill, { transformOrigin: "top center", scaleY: 1 / count });

    const activate = (index: number) => {
      if (index === lastIndexRef.current) return;
      lastIndexRef.current = index;

      gsap.to(pathFill, {
        scaleY: (index + 1) / count,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });

      const id = milestoneIds[index];
      if (id) {
        startTransition(() => {
          onActiveIdRef.current(id);
        });
      }
    };

    lastIndexRef.current = 0;
    onActiveIdRef.current(milestoneIds[0] ?? "");

    const triggers = rows.map((row, i) =>
      ScrollTrigger.create({
        trigger: row,
        start: "top center",
        end: "bottom center",
        onEnter: () => activate(i),
        onEnterBack: () => activate(i),
      }),
    );

    return () => {
      for (const trigger of triggers) trigger.kill();
      gsap.killTweensOf(pathFill);
      gsap.set(pathFill, { clearProps: "transform" });
    };
  }, [roadmapRef, pathFillRef, milestoneIds, enabled]);
}
