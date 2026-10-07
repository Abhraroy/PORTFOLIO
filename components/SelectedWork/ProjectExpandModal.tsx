"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiUsers, FiDollarSign, FiGithub } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import type { SelectedProject } from "./selectedWork.config";
import { trackProjectViewed } from "@/lib/track";
import TechBadge from "@/components/TechBadge";

type ProjectExpandModalProps = {
  project: SelectedProject | null;
  onClose: () => void;
};

/**
 * Expanded glass panel — glass fill + glowing border (no glow frame).
 */
export default function ProjectExpandModal({
  project,
  onClose,
}: ProjectExpandModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedImage(null);
  }, [project]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  const firstVideo =
    project?.projectVideos && project.projectVideos.length > 0
      ? project.projectVideos[0]
      : null;

  const allImages = useMemo(() => {
    if (!project) return [];
    const list: string[] = [];
    if (project.projectImage) list.push(project.projectImage);
    if (project.projectImages && project.projectImages.length > 0) {
      project.projectImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [project]);

  const currentDisplayImage =
    selectedImage || (allImages.length > 0 ? allImages[0] : null);
  const hasMedia = Boolean(firstVideo || currentDisplayImage);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-4xl lg:max-w-5xl rounded-2xl sm:rounded-3xl border border-white/20 bg-[#415d43]/50 p-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-h-[min(88vh,820px)] overflow-y-auto thin-scrollbar p-5 sm:p-7 lg:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-mono text-xs tracking-[0.28em] text-white font-semibold uppercase">
                    {project.number} · Case brief
                  </p>
                  <h3
                    id="project-modal-title"
                    className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl"
                  >
                    {project.name}
                  </h3>
                  <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-white">
                    {project.oneLiner}
                  </p>

                  {(project.liveUrl || project.githubUrl) && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                          aria-label={`View ${project.name} live`}
                        >
                          <HiOutlineStatusOnline className="h-4 w-4 text-emerald-400" />
                          <span>Live</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                          aria-label={`View ${project.name} GitHub repository`}
                        >
                          <FiGithub className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-xs tracking-[0.18em] text-white uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Project Media Showcase (Video or Image Gallery if available) */}
              {hasMedia && (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-black/60 shadow-2xl">
                    {firstVideo ? (
                      <video
                        src={firstVideo}
                        controls
                        playsInline
                        className="h-full w-full object-contain bg-black"
                      />
                    ) : currentDisplayImage ? (
                      <img
                        src={currentDisplayImage}
                        alt={project?.name || "Project preview"}
                        className="h-full w-full object-contain bg-zinc-950/80"
                      />
                    ) : null}
                  </div>

                  {allImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 thin-scrollbar">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-xl border transition-all ${
                            currentDisplayImage === imgUrl
                              ? "border-[#cfff04] ring-2 ring-[#cfff04]/30 scale-105"
                              : "border-white/20 hover:border-white/40 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${project?.name} gallery ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Scale & Impact Metrics Grid (if userCount or revenue exists) */}
              {(Boolean(project.userCount) || Boolean(project.revenue)) && (
                <div className={`grid grid-cols-1 ${project.userCount && project.revenue ? "sm:grid-cols-2" : ""} gap-3 p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/40`}>
                  {project.userCount ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                        <FiUsers className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-white block font-medium">
                          Active Users
                        </span>
                        <p className="font-mono text-base font-bold text-white">
                          {project.userCount.toLocaleString()}+ Users
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {project.revenue ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        <FiDollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-white block font-medium">
                          Impact / Revenue
                        </span>
                        <p className="font-mono text-base font-bold text-white">
                          {project.currency !== undefined && project.currency !== null ? project.currency : "$"}
                          {project.revenue.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                {project.techStack.map((tech, i) => (
                  <TechBadge key={`${tech}-${i}`} tech={tech} />
                ))}
              </div>

              <div className="space-y-5">
                {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-mono text-xs sm:text-sm tracking-[0.22em] text-white uppercase font-bold">
                      Technical Highlights
                    </p>
                    <ul className="space-y-2">
                      {project.technicalHighlights.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-white"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)]"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ModalBlock title="Challenge" body={project.challenge} />
                <ModalBlock title="Solution" body={project.solution} />
                <ModalBlock title="Impact" body={project.impact} />


                {project.extraNotes && (
                  <div className="space-y-2 rounded-2xl border border-white/15 bg-white/[0.04] p-4">
                    <p className="font-mono text-xs sm:text-sm tracking-[0.22em] text-white uppercase font-bold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      Architectural Notes & Key Observations
                    </p>
                    {parseBullets(project.extraNotes).length > 0 ? (
                      <ul className="space-y-1.5">
                        {parseBullets(project.extraNotes).map((note, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs leading-relaxed text-white"
                          >
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400"
                              aria-hidden
                            />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs leading-relaxed text-white">
                        {project.extraNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5"
                    >
                      <p className="font-mono text-xs tracking-wide text-white uppercase font-medium">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div> */}
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-white">
                  Full write-up with architecture notes and outcomes.
                </p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-[#415d43] hover:bg-[#4d6e4f] px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase transition shadow-sm"
                  onClick={() => {
                    trackProjectViewed(project.id);
                    onClose();
                  }}
                >
                  Click me
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  const lines = text.split(/\r?\n|\|/);
  const items = lines
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
  return items;
}

function ModalBlock({ title, body }: { title: string; body: string }) {
  const bulletItems = parseBullets(body);

  return (
    <div className="space-y-2 rounded-xl p-3 bg-[#8fb996]/10 border-2 border-white/40">
      <p className="font-mono text-xs sm:text-[1rem] tracking-[0.22em] text-white uppercase font-bold">
        {title}
      </p>
      {bulletItems.length > 0 ? (
        <ul className="space-y-2">
          {bulletItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-white
              list-none
              "
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-white">{body}</p>
      )}
    </div>
  );
}
