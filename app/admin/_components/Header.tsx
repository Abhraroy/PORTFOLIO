"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAdminStore } from "./store";
import { FiLayers, FiActivity, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { logoutAction } from "../login/actions";

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Portfolio Control Center",
    subtitle: "Overview of database entities, persona modes, and content coverage",
  },
  "/admin/modes": {
    title: "Portfolio Modes",
    subtitle: "Manage persona profiles (e.g. Software Engineer, Founder, Hacker)",
  },
  "/admin/details": {
    title: "My Details & Persona Storytelling",
    subtitle: "Manage primary contact facts and per-mode customized biographies",
  },
  "/admin/projects": {
    title: "Projects Factual Pool",
    subtitle: "Manage project facts (tech, tags, status, feature badges)",
  },
  "/admin/experience": {
    title: "Career Experience Factual Pool",
    subtitle: "Manage employment history facts, role metrics, and achievement bullets",
  },
  "/admin/cms": {
    title: "Centralized CMS Management Hub",
    subtitle: "Full CMS section selection, composition, spatial reordering, and display toggles",
  },
  "/admin/cms/hero-nodes": {
    title: "Hero 3D Network Nodes CMS Section",
    subtitle: "Manage 3D skill nodes, popup card titles, descriptions, tech tags, CTAs, display sequence, and visibility",
  },
  "/admin/cms/mobile-hero": {
    title: "Mobile View Hero Skills CMS Section",
    subtitle: "Manage typewriter skill strings, display sequence, and visibility for mobile hero view",
  },
  "/admin/cms/about": {
    title: "About Me CMS Section",
    subtitle: "Manage dynamic visual blocks (Blocks 1..7), items, CTAs, and profile bios",
  },
  "/admin/cms/experience": {
    title: "Experience Journey CMS Section",
    subtitle: "Pick displayed milestones, ordering, default initial item, and field toggles",
  },
  "/admin/cms/selected-work": {
    title: "Selected Work Grid CMS Section",
    subtitle: "Pick active projects, sequence order, vertical masonry offset, and custom numbers",
  },
  "/admin/cms/project-showcase": {
    title: "Project Showcase Track CMS Section",
    subtitle: "Select projects featured in the sticky horizontal GSAP track",
  },
};

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { modes, activeModeId, setActiveModeId } = useAdminStore();

  const currentInfo = titleMap[pathname] || {
    title: "Admin Studio",
    subtitle: "Manage portfolio data",
  };

  return (
    <header className="w-full border-b border-zinc-800/80 bg-[#0c0c0e]/95 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-xl">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold text-white tracking-tight truncate">
          {currentInfo.title}
        </h2>
        <p className="text-sm text-zinc-400 mt-1 truncate">{currentInfo.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 min-w-0">
        {/* Active Mode Selector */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 shadow-sm max-w-full overflow-hidden">
          <div className="flex items-center gap-2 px-2 text-sm text-zinc-300 font-medium shrink-0">
            <FiLayers className="h-4 w-4 text-zinc-400" />
            <span className="hidden sm:inline">Persona:</span>
          </div>
          <div className="flex items-center gap-1.5 scrollbar-none overflow-x-auto max-w-xs sm:max-w-md py-0.5">
            {modes.map((mode) => {
              const isSelected = mode.id === activeModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveModeId(mode.id);
                    toast.info(`Switched active persona to "${mode.mode_name}"`);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {mode.mode_name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-zinc-300 font-medium">Database Connected</span>
        </div>

        {/* Sign Out Button */}
        <form action={logoutAction} className="shrink-0">
          <button
            type="submit"
            title="Sign out of Admin Studio"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-medium transition-all cursor-pointer"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  );
};

