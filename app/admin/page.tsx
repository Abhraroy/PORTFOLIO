"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FiDownload,
  FiMail,
  FiMessageSquare,
  FiUsers,
  FiMousePointer,
  FiEye,
  FiRefreshCw,
  FiActivity,
  FiTrendingUp,
  FiBarChart2,
  FiArrowDownCircle,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface WebsiteInteraction {
  resume_downloaded: number;
  contact_form_submit: number;
  contact_interested: number;
  scrolled_past_hero: number;
}

interface ProjectInteractionRow {
  id: string;
  projectId: string;
  project_clicked: number;
  project_viewed: number;
  createdAt: string;
  updatedAt: string;
  project: {
    project_name: string;
    slug: string;
    project_image: string | null;
  };
}

interface DashboardData {
  websiteInteraction: WebsiteInteraction;
  projectInteractions: ProjectInteractionRow[];
  totalProjects: number;
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* Skeleton while loading */
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 rounded-2xl bg-white/5 border border-white/10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/5 border border-white/10" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    );
  }

  const w = data?.websiteInteraction ?? {
    resume_downloaded: 0,
    contact_form_submit: 0,
    contact_interested: 0,
    scrolled_past_hero: 0,
  };

  const totalWebsiteInteractions =
    w.resume_downloaded + w.contact_form_submit + w.contact_interested + w.scrolled_past_hero;

  const totalProjectClicks =
    data?.projectInteractions.reduce((s, p) => s + p.project_clicked, 0) ?? 0;
  const totalProjectViews =
    data?.projectInteractions.reduce((s, p) => s + p.project_viewed, 0) ?? 0;

  const websiteCards = [
    {
      title: "Resume Downloaded",
      value: w.resume_downloaded,
      icon: FiDownload,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    },
    {
      title: "Contact Form Submitted",
      value: w.contact_form_submit,
      icon: FiMail,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
      glow: "shadow-[0_0_20px_rgba(56,189,248,0.15)]",
    },
    {
      title: "Contact Interested",
      value: w.contact_interested,
      icon: FiUsers,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20",
      glow: "shadow-[0_0_20px_rgba(167,139,250,0.15)]",
    },
    {
      title: "Scrolled Past Hero",
      value: w.scrolled_past_hero,
      icon: FiArrowDownCircle,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-950/80 via-zinc-900/40 to-zinc-950/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_30px_rgba(255,255,255,0.06)]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-mono">
              <FiActivity className="h-3.5 w-3.5 text-emerald-400" />
              Live Analytics Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-zinc-50">
              Website Interactions
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Real-time tracking of visitor engagement across your portfolio —
              resume downloads, contact form submissions, and interest signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-3xl font-extrabold font-mono text-zinc-50 tracking-tight">
                {totalWebsiteInteractions}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                Total Interactions
              </span>
            </div>
            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-mono font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all shadow-sm disabled:opacity-50"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Website Interaction Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {websiteCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-2xl border ${card.border} bg-zinc-950/40 p-5 backdrop-blur-xl transition-all duration-300 ${card.glow} hover:scale-[1.02]`}
            >
              {/* Accent top line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${card.bg}`}
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  {card.title}
                </span>
                <div
                  className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-4xl font-extrabold text-zinc-50 font-mono tracking-tight">
                  {card.value}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/8">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                  <FiTrendingUp className="h-3 w-3" />
                  <span>All time</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Project Interactions Section ── */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl overflow-hidden">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FiBarChart2 className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-mono font-semibold text-zinc-100 uppercase tracking-[0.12em]">
                Project Interactions
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Clicks and views tracked per project across Selected Work & Showcase sections
            </p>
          </div>

          {/* Summary pills */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 text-xs font-mono text-amber-300">
              <FiMousePointer className="h-3 w-3" />
              {totalProjectClicks} clicks
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-mono text-cyan-300">
              <FiEye className="h-3 w-3" />
              {totalProjectViews} views
            </div>
          </div>
        </div>

        {/* Table */}
        {data?.projectInteractions && data.projectInteractions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="py-3 px-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                    Project
                  </th>
                  <th className="py-3 px-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold text-center">
                    <span className="inline-flex items-center gap-1">
                      <FiMousePointer className="h-3 w-3" /> Clicked
                    </span>
                  </th>
                  <th className="py-3 px-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold text-center">
                    <span className="inline-flex items-center gap-1">
                      <FiEye className="h-3 w-3" /> Viewed
                    </span>
                  </th>
                  <th className="py-3 px-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold text-right">
                    Click → View %
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.projectInteractions.map((row, idx) => {
                  const conversionRate =
                    row.project_clicked > 0
                      ? ((row.project_viewed / row.project_clicked) * 100).toFixed(1)
                      : "—";
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {row.project.project_image ? (
                            <img
                              src={row.project.project_image}
                              alt=""
                              className="h-8 w-8 rounded-lg object-cover border border-white/10"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 text-xs font-mono font-bold">
                              {(idx + 1).toString().padStart(2, "0")}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-zinc-200 leading-tight">
                              {row.project.project_name}
                            </p>
                            <p className="text-[11px] text-zinc-600 font-mono">
                              /{row.project.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-mono font-semibold text-amber-300">
                          {row.project_clicked}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-mono font-semibold text-cyan-300">
                          {row.project_viewed}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                            conversionRate === "—"
                              ? "bg-white/5 text-zinc-600"
                              : parseFloat(conversionRate) >= 50
                                ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                : parseFloat(conversionRate) >= 20
                                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                                  : "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                          }`}
                        >
                          {conversionRate === "—" ? "—" : `${conversionRate}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-600">
              <FiMousePointer className="h-5 w-5" />
            </div>
            <p className="text-sm text-zinc-500 font-mono">
              No project interactions yet
            </p>
            <p className="text-xs text-zinc-600 max-w-xs text-center">
              Interactions will appear here once visitors start clicking on your projects
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Summary Footer ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Projects",
            value: data?.totalProjects ?? 0,
            icon: FiBarChart2,
            accent: "text-zinc-400",
          },
          {
            label: "Projects Tracked",
            value: data?.projectInteractions.length ?? 0,
            icon: FiActivity,
            accent: "text-zinc-400",
          },
          {
            label: "Total Clicks",
            value: totalProjectClicks,
            icon: FiMousePointer,
            accent: "text-amber-400",
          },
          {
            label: "Total Views",
            value: totalProjectViews,
            icon: FiEye,
            accent: "text-cyan-400",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/8 bg-zinc-950/30 p-4 text-center backdrop-blur-sm"
            >
              <Icon className={`h-4 w-4 mx-auto ${stat.accent}`} />
              <p className="mt-2 text-xl font-mono font-bold text-zinc-100">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
