"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ThreeDCardSceneProps, ParallaxState } from "./types";
import { ThreeDCardSceneContext } from "./ThreeDCardSceneContext";

/**
 * ThreeDCardScene
 * A 3D perspective stage with smooth mouse-following parallax,
 * physics-based interpolation (lerp), and multi-layer transform-style: preserve-3d.
 */
export default function ThreeDCardScene({
  children,
  className = "",
  perspective = 1200,
  initialRotateX = 8,
  initialRotateY = -12,
  maxMouseRotateX = 6,
  maxMouseRotateY = 8,
  enableParallax = true,
  enableFloat = true,
}: ThreeDCardSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Target values driven by pointer
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Current interpolated values
  const currentRotXRef = useRef(initialRotateX);
  const currentRotYRef = useRef(initialRotateY);
  const currentMouseXRef = useRef(0);
  const currentMouseYRef = useRef(0);

  const [parallaxState, setParallaxState] = useState<ParallaxState>({
    mouseX: 0,
    mouseY: 0,
    rotateX: initialRotateX,
    rotateY: initialRotateY,
    floatY: 0,
    isHovered: false,
  });

  // Smooth animation loop using requestAnimationFrame + lerp
  useEffect(() => {
    let startTime = performance.now();

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Lerp factor (smooth spring-like interpolation: ~0.075)
      const lerpFactor = 0.075;

      // Mouse normalized coords interpolation
      currentMouseXRef.current +=
        (targetXRef.current - currentMouseXRef.current) * lerpFactor;
      currentMouseYRef.current +=
        (targetYRef.current - currentMouseYRef.current) * lerpFactor;

      // Target rotation angles based on resting position + mouse delta
      const targetRotateX =
        initialRotateX - currentMouseYRef.current * maxMouseRotateX;
      const targetRotateY =
        initialRotateY + currentMouseXRef.current * maxMouseRotateY;

      currentRotXRef.current +=
        (targetRotateX - currentRotXRef.current) * lerpFactor;
      currentRotYRef.current +=
        (targetRotateY - currentRotYRef.current) * lerpFactor;

      // Gentle organic ambient floating oscillation (sinusoidal)
      const floatOffset = enableFloat
        ? Math.sin(elapsed * 0.0018) * 4
        : 0;

      setParallaxState({
        mouseX: currentMouseXRef.current,
        mouseY: currentMouseYRef.current,
        rotateX: currentRotXRef.current,
        rotateY: currentRotYRef.current,
        floatY: floatOffset,
        isHovered: isHoveredRef.current,
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    initialRotateX,
    initialRotateY,
    maxMouseRotateX,
    maxMouseRotateY,
    enableFloat,
  ]);

  // Pointer event handlers with normalized coordinate calculation
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enableParallax || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Center origin
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize from -1 to 1 (with smooth clamped range)
      const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      targetXRef.current = x;
      targetYRef.current = y;
      isHoveredRef.current = true;
    },
    [enableParallax]
  );

  const handlePointerLeave = useCallback(() => {
    targetXRef.current = 0;
    targetYRef.current = 0;
    isHoveredRef.current = false;
  }, []);

  return (
    <ThreeDCardSceneContext.Provider
      value={{
        parallax: parallaxState,
        perspective,
        baseRotateX: initialRotateX,
        baseRotateY: initialRotateY,
      }}
    >
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Deep ambient shadow grounded behind the scene */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 h-32 w-72 sm:w-96 rounded-full opacity-40 blur-3xl transition-transform duration-700 ease-out"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(16,185,129,0.12) 35%, rgba(17,29,19,0.5) 60%, transparent 85%)",
            transform: `translate3d(${parallaxState.mouseX * 12}px, calc(100% + ${
              parallaxState.floatY * 0.5
            }px), -80px) scale(${1 - parallaxState.mouseY * 0.05})`,
          }}
        />

        {/* 3D Transform Root: preserves 3D for all children */}
        <div
          className="relative transition-transform duration-100 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(0, ${parallaxState.floatY}px, 0) rotateX(${parallaxState.rotateX}deg) rotateY(${parallaxState.rotateY}deg)`,
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    </ThreeDCardSceneContext.Provider>
  );
}
