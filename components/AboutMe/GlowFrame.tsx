"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Animated conic-gradient border frame (About Me).
 * Pauses the CSS animation while off-screen.
 */
export default function GlowFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("glow-frame--paused", !entry?.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`glow-frame ${className}`}>
      <div className="glow-frame__inner h-full w-full">{children}</div>
    </div>
  );
}
