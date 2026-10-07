"use client";

import React from "react";
import Link from "next/link";
import { FloatingActionCardProps } from "./types";
import { useThreeDCardScene } from "./ThreeDCardSceneContext";

/**
 * FloatingActionCard
 * Interactive action card ("01 | Explore projects →").
 * Positioned on the lower right perimeter with Z-elevation and tactile hover response.
 * Supports optional line number prefix or custom children.
 */
export default function FloatingActionCard({
  className = "",
  lineNo = "01",
  label = "Explore projects",
  href,
  onClick,
  children,
  translateZ = 45,
  rotateZ = -2,
  parallaxMultiplier = 1.35,
}: FloatingActionCardProps) {
  const { parallax } = useThreeDCardScene();

  const offsetX = parallax.mouseX * 14 * parallaxMultiplier;
  const offsetY = parallax.mouseY * 12 * parallaxMultiplier;

  const content = children ? (
    children
  ) : (
    <div className="group relative flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#192c1d]/95 px-4 py-2.5 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.7),0_0_20px_rgba(34,197,94,0.15)] backdrop-blur-xl transition-all duration-200 hover:border-emerald-400/50 hover:bg-[#203825] hover:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.8),0_0_25px_rgba(34,197,94,0.25)] active:scale-95 cursor-pointer">
      {/* Specular Edge Highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
      />

      <span className="font-mono text-xs font-semibold tracking-wide text-zinc-100">
        {label}
      </span>

      <span
        aria-hidden
        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-zinc-950 font-bold transition-all duration-200 group-hover:bg-emerald-300 group-hover:translate-x-0.5 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.6)]"
      >
        <svg
          className="h-2.5 w-2.5"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 7h12M8 2l5 5-5 5" />
        </svg>
      </span>
    </div>
  );

  return (
    <div
      className={`absolute -bottom-4 -right-3 sm:-bottom-6 sm:-right-8 z-50 transition-all duration-75 select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px) rotateZ(${rotateZ}deg) rotateX(${
          parallax.rotateX * 0.35
        }deg) rotateY(${parallax.rotateY * 0.35}deg)`,
      }}
    >
      {/* Soft Drop Shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-full bg-black/50 blur-lg transition-transform duration-100"
        style={{
          transform: `translate3d(${parallax.mouseX * -3}px, ${
            10 + parallax.mouseY * -2
          }px, -15px)`,
        }}
      />

      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className="cursor-pointer inline-block"
          aria-label={label}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="cursor-pointer border-none bg-transparent p-0 text-left outline-none focus-visible:outline-none"
          aria-label={label}
        >
          {content}
        </button>
      )}
    </div>
  );
}
