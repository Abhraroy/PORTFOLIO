"use client";

import React from "react";
import Link from "next/link";
import { useAdminStore } from "../_components/store";
import {
  FiLayout,
  FiBriefcase,
  FiGrid,
  FiSliders,
  FiChevronRight,
  FiSliders as FiCms,
  FiLayers,
  FiSmartphone,
} from "react-icons/fi";

export default function CMSHubPage() {
  const { sections, experienceCMS, selectedWorkCMS, projectShowcaseCMS, heroNodesCMS, mobileHeroSkills, activeModeId, modes } = useAdminStore();

  const aboutSection = sections.find((s) => s.key === "ABOUT");
  const aboutBlocksCount = aboutSection?.blocks?.length || 0;
  const activeMode = modes.find((m) => m.id === activeModeId)?.mode_name || "Default";

  const cmsSections = [
    {
      id: "mobile-hero",
      name: "Mobile View Hero Skills CMS",
      description: "Manage typewriter skill string records, display sequence, and visibility for the mobile view hero section.",
      href: "/admin/cms/mobile-hero",
      icon: FiSmartphone,
      badgeText: `${mobileHeroSkills?.length || 0} Skill Records`,
      visible: true,
    },
    {
      id: "hero-nodes",
      name: "Hero 3D Network Nodes CMS",
      description: "Manage 3D skill nodes, popup card titles, descriptions, tech tags, CTAs, display sequence, and visibility on the interactive hero sphere.",
      href: "/admin/cms/hero-nodes",
      icon: FiSliders,
      badgeText: `${heroNodesCMS?.items?.length || 0} Network Nodes`,
      visible: heroNodesCMS?.visible ?? true,
    },
    {
      id: "about",
      name: "About Me Visual Blocks",
      description: "Manage dynamic visual cards, spatial positioning (Blocks 1..7), items, CTAs, and persona bios.",
      href: "/admin/cms/about",
      icon: FiLayout,
      badgeText: `${aboutBlocksCount} Content Blocks`,
      visible: true,
    },
    {
      id: "experience",
      name: "Experience Journey CMS",
      description: "Pick active career roles, set display sequence, default initial active milestone, and field visibility toggles.",
      href: "/admin/cms/experience",
      icon: FiBriefcase,
      badgeText: `${experienceCMS?.items?.length || 0} Displayed Milestones`,
      visible: experienceCMS?.visible ?? true,
    },
    {
      id: "selected-work",
      name: "Selected Work Grid CMS",
      description: "Pick active projects, sequence order, vertical masonry offset (up/down), and custom project numbers (01, 02).",
      href: "/admin/cms/selected-work",
      icon: FiGrid,
      badgeText: `${selectedWorkCMS?.items?.length || 0} Selected Projects`,
      visible: selectedWorkCMS?.visible ?? true,
    },
    {
      id: "project-showcase",
      name: "Project Showcase GSAP Track CMS",
      description: "Configure projects featured in the sticky horizontal GSAP track, reorder slides, and set display flags.",
      href: "/admin/cms/project-showcase",
      icon: FiSliders,
      badgeText: `${projectShowcaseCMS?.items?.length || 0} Showcase Slides`,
      visible: projectShowcaseCMS?.visible ?? true,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="border-b border-zinc-800/80 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          CMS Control Layer
        </p>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
          <FiCms className="text-white h-7 w-7" /> Centralized CMS Section Management
        </h1>
        <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
          Full CMS composition control for every section of your portfolio site. Factual data models remain untouched.
        </p>
      </div>

      {/* Persona Context Notice */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200">
            <FiLayers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Active Persona: <span className="text-zinc-200 font-bold">{activeMode}</span>
            </h3>
            <p className="text-sm text-zinc-400">
              CMS sections compose content dynamically based on persona selection.
            </p>
          </div>
        </div>
        <Link
          href="/admin/modes"
          className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          Manage Modes <FiChevronRight />
        </Link>
      </div>

      {/* Grid of CMS Section Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cmsSections.map((sec) => {
          const Icon = sec.icon;

          return (
            <Link
              key={sec.id}
              href={sec.href}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 p-7 space-y-5 transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700/60 text-white shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-zinc-100 transition-colors">
                        {sec.name}
                      </h3>
                      <span className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-zinc-700/60 bg-zinc-800/80 text-zinc-300 mt-2">
                        {sec.badgeText}
                      </span>
                    </div>
                  </div>

                  <FiChevronRight className="h-5 w-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-sm text-zinc-400">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  {sec.visible ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Section Active
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-zinc-600" /> Hidden Section
                    </>
                  )}
                </span>
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white group-hover:underline">
                  Configure CMS &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
