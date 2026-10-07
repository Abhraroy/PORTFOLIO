"use client";

import { motion } from "framer-motion";
import {
  SHOWCASE_CARD_CLASS,
  type ShowcaseProject,
} from "./projectShowcase.config";
import { trackProjectClicked } from "@/lib/track";
import TechBadge from "@/components/TechBadge";
import { FiGithub } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";

type ShowcaseCardProps = {
  project: ShowcaseProject;
  onOpen: (project: ShowcaseProject) => void;
};

/**
 * Glassmorphic project card — fixed height shell with matching zinc glass styling.
 */
export default function ShowcaseCard({ project, onOpen }: ShowcaseCardProps) {
  const firstVideo = project.projectVideos && project.projectVideos.length > 0 ? project.projectVideos[0] : null;
  const primaryImage = project.projectImage || (project.projectImages && project.projectImages.length > 0 ? project.projectImages[0] : null);
  const hasMedia = Boolean(firstVideo || primaryImage);

  return (
    <article className={SHOWCASE_CARD_CLASS}>
      <motion.button
        type="button"
        onClick={() => {
          trackProjectClicked(project.id);
          onOpen(project);
        }}
        className="group block h-full w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-label={`Click me — ${project.name}`}
      >
        <div className="showcase-panel flex h-full flex-col justify-between gap-5 rounded-2xl border border-white/20 bg-zinc-950/40 backdrop-blur-xl p-5 sm:gap-6 sm:p-6 lg:p-7 transition-colors group-hover:border-white/30">
          <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-white uppercase">
                {project.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white uppercase transition-colors group-hover:text-white/80">
                Click me
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              {hasMedia && (
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-inner">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={project.name}
                      className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : firstVideo ? (
                    <video
                      src={firstVideo}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              <div className="flex w-full flex-row items-center justify-between" >
              <h3 className="font-mono text-xl tracking-tight text-white sm:text-2xl leading-tight">
                {project.name}
              </h3>
                <div className="flex flex-row items-center gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${project.name} GitHub repository`}
                    >
                      <FiGithub className="h-4.5 w-4.5 transition-transform group-hover/link:scale-110" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group/link flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                      aria-label={`View ${project.name} live`}
                    >
                      <HiOutlineStatusOnline className="h-3.5 w-3.5 transition-transform group-hover/link:scale-110" />
                      <span>Live</span>
                    </a>
                  )}
              </div>
              </div>
            </div>

            <p className="line-clamp-2 sm:line-clamp-3 text-sm leading-relaxed text-white">
              {project.oneLiner}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {project.techStack.map((tech, i) => (
              <TechBadge key={`${tech}-${i}`} tech={tech} />
            ))}
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 pt-4">
              {project.metrics.slice(0, 4).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="font-mono text-[10px] leading-snug tracking-wide text-white uppercase sm:text-[11px]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.button>
    </article>
  );
}
