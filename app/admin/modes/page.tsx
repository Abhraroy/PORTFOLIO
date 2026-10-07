"use client";

import React, { useState } from "react";
import { useAdminStore } from "../_components/store";
import { PortfolioMode } from "../_components/types";
import { toast } from "react-toastify";
import {
  FiLayers,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiFolder,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";

export default function ModesPage() {
  const { modes, projects, experiences, details, addMode, updateMode, deleteMode } =
    useAdminStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [modeName, setModeName] = useState("");
  const [modeDesc, setModeDesc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modeName.trim()) return;
    addMode({
      mode_name: modeName.trim(),
      mode_description: modeDesc.trim() || null,
    });
    toast.success(`Created portfolio mode "${modeName.trim()}"!`);
    setModeName("");
    setModeDesc("");
    setIsCreating(false);
  };

  const startEdit = (mode: PortfolioMode) => {
    setEditingId(mode.id);
    setModeName(mode.mode_name);
    setModeDesc(mode.mode_description || "");
  };

  const handleUpdate = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!modeName.trim()) return;
    updateMode(id, {
      mode_name: modeName.trim(),
      mode_description: modeDesc.trim() || null,
    });
    toast.success(`Updated mode "${modeName.trim()}"!`);
    setEditingId(null);
    setModeName("");
    setModeDesc("");
  };

  return (
    <div className="space-y-6 pb-16 font-mono">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            Master Personas
          </p>
          <h1 className="text-xl font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiLayers className="text-zinc-300 h-5 w-5" /> Portfolio Modes
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
            Master persona controllers representing distinct developer roles (e.g. Software Engineer, Founder, Hacker).
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setModeName("");
            setModeDesc("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-semibold shadow-sm transition-all"
        >
          <FiPlus className="h-4 w-4" /> Add New Mode
        </button>
      </div>

      {/* Create Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-white/20 bg-zinc-950/60 backdrop-blur-xl p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">
              Create New Portfolio Mode
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400">
                Mode Name *
              </label>
              <input
                type="text"
                required
                value={modeName}
                onChange={(e) => setModeName(e.target.value)}
                placeholder="e.g. Founder, DevOps Engineer, Designer"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400">
                Mode Description
              </label>
              <input
                type="text"
                value={modeDesc}
                onChange={(e) => setModeDesc(e.target.value)}
                placeholder="Summary of this persona's focus..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-semibold shadow-sm"
            >
              Save Mode
            </button>
          </div>
        </form>
      )}

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modes.map((mode) => {
          const isEditing = editingId === mode.id;

          const linkedProjectsCount = projects.filter((p) =>
            p.modeContents?.some((mc) => mc.portfolioModeId === mode.id)
          ).length;

          const linkedExperienceCount = experiences.filter((e) =>
            e.modeContents?.some((mc) => mc.portfolioModeId === mode.id)
          ).length;

          const linkedDetailsCount = details.modeContents?.some(
            (mc) => mc.portfolioModeId === mode.id
          )
            ? 1
            : 0;

          if (isEditing) {
            return (
              <form
                key={mode.id}
                onSubmit={(e) => handleUpdate(mode.id, e)}
                className="rounded-2xl border border-white/20 bg-zinc-950 p-5 space-y-3 shadow-lg"
              >
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Mode Name
                  </label>
                  <input
                    type="text"
                    required
                    value={modeName}
                    onChange={(e) => setModeName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={modeDesc}
                    onChange={(e) => setModeDesc(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-white font-sans"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    <FiCheck className="h-4 w-4" />
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div
              key={mode.id}
              className="group relative rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 text-zinc-200 flex items-center justify-center font-bold text-xs font-mono">
                      {mode.mode_name.slice(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-base font-bold text-zinc-100">
                      {mode.mode_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(mode)}
                      title="Edit Mode"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <FiEdit3 className="h-3.5 w-3.5" />
                    </button>
                    {modes.length > 1 && (
                      <button
                        onClick={() => {
                          deleteMode(mode.id);
                          toast.success(`Deleted mode "${mode.mode_name}"`);
                        }}
                        title="Delete Mode"
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans min-h-[36px]">
                  {mode.mode_description || (
                    <span className="italic text-zinc-600 font-mono">No description specified.</span>
                  )}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1" title="Projects with content">
                  <FiFolder className="text-zinc-400 h-3.5 w-3.5" />
                  {linkedProjectsCount} Projs
                </span>
                <span className="flex items-center gap-1" title="Experience with content">
                  <FiBriefcase className="text-zinc-400 h-3.5 w-3.5" />
                  {linkedExperienceCount} Exp
                </span>
                <span className="flex items-center gap-1" title="MyDetails Bio configured">
                  <FiUser className="text-zinc-400 h-3.5 w-3.5" />
                  {linkedDetailsCount > 0 ? "Bio Set" : "No Bio"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
