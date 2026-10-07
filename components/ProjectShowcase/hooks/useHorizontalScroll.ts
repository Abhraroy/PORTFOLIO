"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { registerScrollTrigger } from "@/lib/gsap/scrollTrigger";

type UseHorizontalScrollOptions = {
  /** Tall outer wrapper — its height drives how long the sticky phase lasts. */
  containerRef: RefObject<HTMLElement | null>;
  /** Horizontal track translated by scroll progress. */
  trackRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  /** Dependencies that trigger re-measuring (e.g. project list / count). */
  dependencies?: unknown[];
};

/** Ease-in-out curve for horizontal travel (soft start + soft finish). */
const SCROLL_EASE = gsap.parseEase("power2.inOut");

/**
 * Sticky horizontal carousel with eased scrub:
 * - Outer height = viewport + travel (sticky “pin” window)
 * - Auto-measures dynamic track width via ResizeObserver
 * - Debounced ScrollTrigger.refresh on layout and dynamic card changes
 */
export function useHorizontalScroll({
  containerRef,
  trackRef,
  enabled = true,
  dependencies = [],
}: UseHorizontalScrollOptions) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    registerScrollTrigger();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let distance = 0;

    const measure = () => {
      if (!track || !container) return 0;
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      container.style.height = `${window.innerHeight + distance}px`;
      return distance;
    };

    const setTrackX = (progress: number) => {
      if (!track) return;
      const eased = SCROLL_EASE(gsap.utils.clamp(0, 1, progress));
      gsap.set(track, { x: -distance * eased, force3D: true });
    };

    const setWillChange = (on: boolean) => {
      if (!track) return;
      track.style.willChange = on ? "transform" : "auto";
    };

    gsap.set(track, { x: 0 });
    measure();

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => setTrackX(self.progress),
      onToggle: (self) => setWillChange(self.isActive),
      onRefresh: (self) => {
        measure();
        setTrackX(self.progress);
      },
    });

    const refreshLayout = () => {
      measure();
      ScrollTrigger.refresh();
    };

    // ResizeObserver watches track changes (cards rendering, fonts loading, CMS updates)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        refreshLayout();
      });
      resizeObserver.observe(track);
      resizeObserver.observe(container);
    }

    const raf = requestAnimationFrame(() => {
      refreshLayout();
    });

    const timer = setTimeout(() => {
      refreshLayout();
    }, 200);

    window.addEventListener("resize", refreshLayout);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", refreshLayout);
      trigger.kill();
      setWillChange(false);
      container.style.height = "";
      gsap.set(track, { clearProps: "transform" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, trackRef, enabled, ...dependencies]);
}
