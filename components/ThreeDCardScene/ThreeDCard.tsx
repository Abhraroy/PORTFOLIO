"use client";

import React from "react";
import { ThreeDCardProps } from "./types";
import { useThreeDCardScene } from "./ThreeDCardSceneContext";

/**
 * ThreeDCard
 * The vertically oriented primary 3D card. Sits at translateZ(0) with layered
 * physical cast shadows, specular edge lighting, and an editorial SaaS surface.
 */
export default function ThreeDCard({
  children,
  className = "",
  width = "w-[310px] sm:w-[350px] md:w-[370px]",
  height = "min-h-[460px] sm:min-h-[500px]",
}: ThreeDCardProps) {
  const { parallax } = useThreeDCardScene();

  // Subtle specular light reflection angle calculation based on mouse
  const lightX = 50 + parallax.mouseX * 25;
  const lightY = 30 + parallax.mouseY * 25;

  return (
    <div
      className={`relative ${width} ${height} rounded-[26px] transition-all duration-200 ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(0px)",
      }}
    >
      {/* 3D Physical Cast Shadow behind the primary card (translateZ: -35px) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[28px] blur-2xl opacity-80 transition-transform duration-150"
        style={{
          transform: `translate3d(${parallax.mouseX * 8}px, ${
            24 + parallax.mouseY * 6
          }px, -35px) scale(0.95)`,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0, 0, 0, 0.8) 0%, rgba(10, 20, 12, 0.6) 60%, transparent 100%)",
        }}
      />

      {/* Main Card Physical Body */}
      <div
        className="relative h-full w-full overflow-hidden rounded-[26px] border border-emerald-500/20 bg-[#142316]/95 text-zinc-100 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8),0_0_30px_-4px_rgba(16,185,129,0.08)] backdrop-blur-xl transition-shadow duration-300"
        style={{
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(155deg, rgba(24, 40, 27, 0.95) 0%, rgba(17, 29, 19, 0.98) 50%, rgba(11, 19, 12, 1) 100%)",
        }}
      >
        {/* Subtle Specular Top/Surface Lighting highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[26px] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(52, 211, 153, 0.16) 0%, rgba(255, 255, 255, 0.04) 35%, transparent 65%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Crisp interior bevel highlight (top edge light stroke) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
        />

        {/* Content Container */}
        {children ? (
          <div className="relative z-10 flex h-full w-full flex-col p-6 sm:p-7">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
