"use client";

import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp, FiGithub } from "react-icons/fi";
import {
  type SelectedProject,
  formatMetricNumber,
} from "./selectedWork.config";
import { trackProjectClicked } from "@/lib/track";
import TechBadge from "@/components/TechBadge";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { url } from "inspector";

type ProjectCardProps = {
  project: SelectedProject;
  index: number;
  onOpen: (project: SelectedProject) => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * Glass project card — clean glass fill without glowing effect.
 */
export default function ProjectCard({
  project,
  index,
  onOpen,
}: ProjectCardProps) {
  const offsetClass =
    project.offset === "down"
      ? "md:mt-10 lg:mt-14"
      : project.offset === "up"
        ? "md:-mt-2 lg:mt-0"
        : "";

  const currencySymbol =
    project.currency !== undefined && project.currency !== null
      ? project.currency
      : "$";

  const firstVideo =
    project.projectVideos && project.projectVideos.length > 0
      ? project.projectVideos[0]
      : null;
  const primaryImage =
    project.projectImage ||
    (project.projectImages && project.projectImages.length > 0
      ? project.projectImages[0]
      : null);
  const hasMedia = Boolean(firstVideo || primaryImage);

  return (
    <motion.article
      className={`relative ${offsetClass}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      variants={fadeUp}
    >
      <motion.button
        type="button"
        onClick={() => {
          trackProjectClicked(project.id);
          onOpen(project);
        }}
        className="group block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-label={`Click me — ${project.name}`}
      >
        <div
          className={`flex min-h-[280px] flex-col justify-between gap-5 rounded-2xl border border-white/20  bg-[#a1cca5]/10 backdrop-blur-2xl  sm:min-h-[300px]  transition-colors group-hover:border-white/30 relative
        `}

        >
          <div
            className="relative  w-full"
          >
            {hasMedia && (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-xl border border-white/15 bg-black/40 shadow-inner">
                {firstVideo ? (
                  <video
                    src={firstVideo}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={project.name}
                    className="pointer-events-none h-full w-full object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7 " >

            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
                  {project.number}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-white uppercase transition-colors group-hover:text-white/80">
                  Click me
                </span>
              </div>


              <div className="flex items-center justify-between gap-3" ><h3 className="font-mono text-xl tracking-tight text-white sm:text-2xl">
                {project.name}
              </h3>
                <div className="flex items-center gap-4">
                  <FiGithub className="h-5.5 w-5.5" />
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                      aria-label={`View ${project.name} live`}
                    >

                      <HiOutlineStatusOnline className="h-3.5 w-3.5" />
                      <span>Live</span>
                    </a>
                  )}

                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white line-clamp-3">
                {project.oneLiner}
              </p>
            </div>

            {/* Scale & Impact Metrics Banner (Visible Initially) */}
            {(project.userCount || project.revenue) && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-950/30 px-3.5 py-2.5 shadow-inner">
                {project.userCount ? (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <FiUsers className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-white">
                      {formatMetricNumber(project.userCount)}
                    </span>
                    <span className="text-[10px] text-white uppercase tracking-wide">
                      Active Users
                    </span>
                  </div>
                ) : null}
                {project.userCount && project.revenue ? (
                  <span className="text-white font-mono">·</span>
                ) : null}
                {project.revenue ? (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <FiTrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">
                      {formatMetricNumber(project.revenue, currencySymbol)}
                    </span>
                    <span className="text-[10px] text-white uppercase tracking-wide">
                      Revenue
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {project.techStack.map((tech, i) => (
                <TechBadge key={`${tech}-${i}`} tech={tech} />
              ))}
            </div>

            {/* Metrics & Highlights Grid */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {project.metrics.slice(0, 4).map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors group-hover:border-white/20"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80" />
                    <p className="font-mono text-[10px] leading-snug tracking-wide text-white uppercase sm:text-[11px] truncate">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}
