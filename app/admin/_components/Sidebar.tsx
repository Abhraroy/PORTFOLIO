"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiLayers,
  FiUser,
  FiFolder,
  FiBriefcase,
  FiChevronRight,
  FiTerminal,
  FiLayout,
  FiSliders,
  FiSmartphone,
  FiLogOut,
} from "react-icons/fi";
import { logoutAction } from "../login/actions";


const domainNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FiGrid,
  },
  {
    name: "Portfolio Modes",
    href: "/admin/modes",
    icon: FiLayers,
  },
  {
    name: "My Details",
    href: "/admin/details",
    icon: FiUser,
  },
  {
    name: "Projects Pool",
    href: "/admin/projects",
    icon: FiFolder,
  },
  {
    name: "Experience Pool",
    href: "/admin/experience",
    icon: FiBriefcase,
  },
];

const cmsNavItems = [
  {
    name: "CMS Management Hub",
    href: "/admin/cms",
    icon: FiSliders,
  },
  {
    name: "Mobile Hero CMS",
    href: "/admin/cms/mobile-hero",
    icon: FiSmartphone,
  },
  {
    name: "Hero Nodes CMS",
    href: "/admin/cms/hero-nodes",
    icon: FiSliders,
  },
  {
    name: "About Me CMS",
    href: "/admin/cms/about",
    icon: FiLayout,
  },
  {
    name: "Experience CMS",
    href: "/admin/cms/experience",
    icon: FiBriefcase,
  },
  {
    name: "Selected Work CMS",
    href: "/admin/cms/selected-work",
    icon: FiGrid,
  },
  {
    name: "Showcase Track CMS",
    href: "/admin/cms/project-showcase",
    icon: FiSliders,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800/80 bg-[#0c0c0e] flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Admin Brand / Header */}
        <div className="p-6 border-b border-zinc-800/80">
          <Link href="/admin" className="flex items-center gap-3.5 group">
            <div className="h-11 w-11 rounded-xl border border-zinc-700/60 bg-zinc-900 p-0.5 shadow-sm">
              <div className="h-full w-full bg-black rounded-[9px] flex items-center justify-center">
                <FiTerminal className="h-5 w-5 text-zinc-200 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                Admin Studio
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  v2.0
                </span>
              </h1>
              <p className="text-xs text-zinc-400 font-medium tracking-wide">CMS & Portfolio Control</p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Domain Models Section */}
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Domain Data
            </div>
            {domainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold border border-zinc-700/60 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <FiChevronRight
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isActive
                        ? "text-zinc-300 opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-500"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CMS Composition Section */}
          <div className="space-y-1.5 pt-4 border-t border-zinc-800/80">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              CMS Sections
            </div>
            {cmsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/cms"
                  ? pathname === "/admin/cms"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold border border-zinc-700/60 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <FiChevronRight
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isActive
                        ? "text-zinc-300 opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-500"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Sign Out Action & Footer Info */}
      <div className="border-t border-zinc-800/80 p-4 space-y-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FiLogOut className="h-4.5 w-4.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span>Sign Out</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Session</span>
          </button>
        </form>

        <div className="px-3 text-xs text-zinc-400 flex items-center justify-between">
          <span className="font-medium tracking-wide uppercase text-zinc-400">Security Proxy</span>
          <span className="flex items-center gap-2 text-zinc-300 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
};
