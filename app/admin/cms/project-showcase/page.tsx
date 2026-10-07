"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiSliders,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiSearch,
  FiLayers,
} from "react-icons/fi";
import { Project, ProjectShowcaseSectionCMSItemData } from "../../_components/types";

interface FormState {
  projectId: string;
  // Case Study & Persona Mode Content Fields
  modeTabId: string;
  modeDescription: string;
  modeChallenge: string;
  modeSolution: string;
  modeImpact: string;
  modeHighlights: string;
  modeUserCount: number | "";
  modeRevenue: number | "";
  modeCurrency: string;
  modeNotes: string;
  // Showcase CMS Specific Settings
  showDescription: boolean;
  showTechnologies: boolean;
  showViewAction: boolean;
}

const defaultFormState: FormState = {
  projectId: "",
  modeTabId: "",
  modeDescription: "",
  modeChallenge: "",
  modeSolution: "",
  modeImpact: "",
  modeHighlights: "",
  modeUserCount: "",
  modeRevenue: "",
  modeCurrency: "$",
  modeNotes: "",
  showDescription: true,
  showTechnologies: true,
  showViewAction: true,
};

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|\|/)
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
}

function BulletListInput({ label, value, onChange, placeholder = "Add item..." }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [isRawMode, setIsRawMode] = useState(false);
  const parseValueToBullets = (val: string): string[] => {
    if (!val) return [""];
    const parsed = parseBullets(val);
    return parsed.length > 0 ? parsed : [""];
  };
  const [items, setItems] = useState<string[]>(() => parseValueToBullets(value));

  useEffect(() => {
    const parsed = parseValueToBullets(value);
    const currentMerged = items.filter((i) => i.trim()).join("\n");
    const newMerged = parsed.filter((i) => i.trim()).join("\n");
    if (currentMerged !== newMerged) {
      setItems(parsed);
    }
  }, [value]);

  const handleUpdateItem = (index: number, newText: string) => {
    const updated = [...items];
    updated[index] = newText;
    setItems(updated);
    const merged = updated.map((b) => b.trim()).filter((b) => b.length > 0).map((b) => `• ${b}`).join("\n");
    onChange(merged);
  };
  const handleAddItem = () => setItems((prev) => [...prev, ""]);
  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    const finalItems = updated.length > 0 ? updated : [""];
    setItems(finalItems);
    const merged = finalItems.map((b) => b.trim()).filter((b) => b.length > 0).map((b) => `• ${b}`).join("\n");
    onChange(merged);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200">{label}</label>
        <button type="button" onClick={() => setIsRawMode(!isRawMode)} className="text-xs text-zinc-400 hover:text-white underline font-medium">
          {isRawMode ? "Bullet Builder" : "Raw Text"}
        </button>
      </div>
      {isRawMode ? (
        <textarea
          rows={5}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setItems(parseValueToBullets(e.target.value));
          }}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
      ) : (
        <div className="space-y-3">
          {items.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-zinc-500 font-bold select-none text-lg">•</span>
              <input
                type="text"
                value={bullet}
                placeholder={`${placeholder} #${idx + 1}`}
                onChange={(e) => handleUpdateItem(idx, e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
              <button type="button" onClick={() => handleRemoveItem(idx)} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0">
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="w-full mt-2 py-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-sm font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-colors">
            <FiPlus className="h-4 w-4" /> Add Item
          </button>
        </div>
      )}
    </div>
  );
}

export default function CMSProjectShowcasePage() {
  const {
    projects,
    modes,
    activeModeId,
    selectedWorkCMS,
    projectShowcaseCMS,
    updateProjectShowcaseCMS,
    addProjectShowcaseCMSItem,
    updateProjectShowcaseCMSItem,
    deleteProjectShowcaseCMSItem,
    reorderProjectShowcaseCMSItems,
    updateProjectModeContent,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    cmsItem?: ProjectShowcaseSectionCMSItemData;
    project: Project;
  } | null>(null);

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  // Auto-sync: Ensure any project in Selected Work CMS is present in Showcase Track CMS as well
  useEffect(() => {
    if (!selectedWorkCMS?.items || !projectShowcaseCMS) return;
    const existingPSProjectIds = new Set((projectShowcaseCMS.items || []).map((i) => i.projectId));
    const missingFromSW = selectedWorkCMS.items.filter(
      (swItem) => !existingPSProjectIds.has(swItem.projectId)
    );

    if (missingFromSW.length > 0) {
      missingFromSW.forEach(async (swItem, idx) => {
        await addProjectShowcaseCMSItem({
          projectId: swItem.projectId,
          displayOrder: (projectShowcaseCMS.items || []).length + idx + 1,
          visible: true,
          showDescription: true,
          showTechnologies: true,
          showViewAction: true,
        });
      });
    }
  }, [selectedWorkCMS?.items, projectShowcaseCMS?.items, addProjectShowcaseCMSItem]);

  const psCMSItems = useMemo(() => {
    return [...(projectShowcaseCMS.items || [])].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }, [projectShowcaseCMS.items]);

  const filteredCMSItems = useMemo(() => {
    if (!searchQuery.trim()) return psCMSItems;
    const q = searchQuery.toLowerCase();
    return psCMSItems.filter((item) => {
      const proj = projects.find((p) => p.id === item.projectId);
      return (
        proj?.project_name.toLowerCase().includes(q) ||
        proj?.slug.toLowerCase().includes(q) ||
        proj?.project_tech.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [psCMSItems, projects, searchQuery]);

  const availableProjectsNotInCMS = useMemo(() => {
    const includedIds = new Set(psCMSItems.map((item) => item.projectId));
    return projects.filter((p) => !includedIds.has(p.id));
  }, [projects, psCMSItems]);

  const loadModeContentForForm = (proj: Project, modeId: string) => {
    const modeContent = proj.modeContents?.find((m) => m.portfolioModeId === modeId) || proj.modeContents?.[0];
    const uCount: number | "" = typeof modeContent?.project_user_count === "number" ? modeContent.project_user_count : "";
    const rev: number | "" = typeof modeContent?.project_revenue === "number" ? modeContent.project_revenue : "";
    const rawHighlights = modeContent?.project_highlights || [];
    const formattedHighlights = rawHighlights.length > 0 ? rawHighlights.map((h) => `• ${h}`).join("\n") : "";

    return {
      modeTabId: modeId || activeModeId || modes[0]?.id || "",
      modeDescription: modeContent?.project_description || "",
      modeChallenge: modeContent?.challenge || "",
      modeSolution: modeContent?.solution || "",
      modeImpact: modeContent?.impact || "",
      modeHighlights: formattedHighlights,
      modeUserCount: uCount,
      modeRevenue: rev,
      modeCurrency: modeContent?.currency !== undefined && modeContent?.currency !== null ? modeContent.currency : "$",
      modeNotes: modeContent?.extra_notes || "",
    };
  };

  const handleModeTabChange = (newModeId: string) => {
    if (!formState.projectId) {
      setFormState((prev) => ({ ...prev, modeTabId: newModeId }));
      return;
    }
    const proj = projects.find((p) => p.id === formState.projectId);
    if (!proj) return;
    const storyData = loadModeContentForForm(proj, newModeId);
    setFormState((prev) => ({ ...prev, ...storyData }));
  };

  const handleSelectProjectDropdown = (selectedId: string) => {
    if (!selectedId) {
      setFormState((prev) => ({ ...prev, projectId: "" }));
      return;
    }
    const currentModeId = formState.modeTabId || activeModeId || modes[0]?.id || "";
    const proj = projects.find((p) => p.id === selectedId);
    if (!proj) return;
    const storyData = loadModeContentForForm(proj, currentModeId);
    setFormState({
      projectId: proj.id,
      ...storyData,
      showDescription: true,
      showTechnologies: true,
      showViewAction: true,
    });
    toast.info(`Populated data for "${proj.project_name}"!`);
  };

  const openCreateModal = () => {
    const defaultMode = activeModeId || modes[0]?.id || "";
    setFormState({
      ...defaultFormState,
      modeTabId: defaultMode,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cmsItem: ProjectShowcaseSectionCMSItemData) => {
    const proj = projects.find((p) => p.id === cmsItem.projectId);
    if (!proj) {
      toast.error("Linked project data not found.");
      return;
    }
    const currentModeId = activeModeId || modes[0]?.id || "";
    const storyData = loadModeContentForForm(proj, currentModeId);
    setEditingItem({ cmsItem, project: proj });
    setFormState({
      projectId: proj.id,
      ...storyData,
      showDescription: cmsItem.showDescription ?? true,
      showTechnologies: cmsItem.showTechnologies ?? true,
      showViewAction: cmsItem.showViewAction ?? true,
    });
  };

  const handleSaveNewWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.projectId) {
      toast.error("Please select a project.");
      return;
    }
    const targetProjectId = formState.projectId;
    if (formState.modeTabId) {
      const modeHlList = parseBullets(formState.modeHighlights);
      await updateProjectModeContent(targetProjectId, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count: formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue: formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
        currency: formState.modeCurrency || null,
        extra_notes: formState.modeNotes || null,
      });
    }
    await addProjectShowcaseCMSItem({
      projectId: targetProjectId,
      displayOrder: psCMSItems.length + 1,
      visible: true,
      showDescription: formState.showDescription,
      showTechnologies: formState.showTechnologies,
      showViewAction: formState.showViewAction,
    });
    toast.success("Added project to Showcase track!");
    setIsAddModalOpen(false);
    setFormState(defaultFormState);
  };

  const handleSaveEditWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (formState.modeTabId) {
      const modeHlList = parseBullets(formState.modeHighlights);
      await updateProjectModeContent(editingItem.project.id, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count: formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue: formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
        currency: formState.modeCurrency || null,
        extra_notes: formState.modeNotes || null,
      });
    }
    if (editingItem.cmsItem) {
      await updateProjectShowcaseCMSItem(editingItem.cmsItem.id, {
        showDescription: formState.showDescription,
        showTechnologies: formState.showTechnologies,
        showViewAction: formState.showViewAction,
      });
    }
    toast.success(`Updated Case Study & CMS settings!`);
    setEditingItem(null);
    setFormState(defaultFormState);
  };

  const handleMovePSItem = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === psCMSItems.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...psCMSItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    await reorderProjectShowcaseCMSItems(reindexed);
    toast.success("Updated showcase track sequence!");
  };

  const selectedProjectObj = projects.find((p) => p.id === formState.projectId);

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Admin Panel CMS
          </p>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
            <FiSliders className="text-white h-7 w-7" /> Project Showcase Track
          </h1>
          <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
            Select projects for the horizontal GSAP track, and configure their Case Study persona-based storytelling content.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FiPlus className="h-4 w-4" /> Add to Showcase Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiLayers className="text-zinc-400 h-5 w-5" />
            <span className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Section Status
            </span>
          </div>
          <label className="flex items-center gap-2.5 text-sm font-medium text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={projectShowcaseCMS.visible}
              onChange={(e) =>
                updateProjectShowcaseCMS({ visible: e.target.checked })
              }
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
            />
            {projectShowcaseCMS.visible ? (
              <span className="text-emerald-400 font-semibold">Enabled</span>
            ) : (
              <span className="text-zinc-500 font-medium">Disabled</span>
            )}
          </label>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-3.5">
          <FiSearch className="text-zinc-400 h-5 w-5 shrink-0" />
          <input
            type="text"
            placeholder="Search showcase track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-base text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-zinc-400 hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2.5">
            <FiSettings className="text-zinc-400" /> Showcase Track Sequence ({filteredCMSItems.length})
          </h2>
        </div>

        {filteredCMSItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl space-y-4">
            <p className="text-sm sm:text-base text-zinc-400">
              No projects in the showcase track.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              <FiPlus /> Add Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCMSItems.map((cmsItem, index) => {
              const proj = projects.find((p) => p.id === cmsItem.projectId);
              if (!proj) return null;

              return (
                <div
                  key={cmsItem.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 p-5 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                    <span className="text-xs font-bold px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 shrink-0 font-mono">
                      Track #{cmsItem.displayOrder}
                    </span>
                    <div>
                      <span className="text-base font-bold text-white block">{proj.project_name}</span>
                      <span className="text-xs text-zinc-400 font-mono">/{proj.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMovePSItem(index, "up")}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <FiArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      disabled={index === psCMSItems.length - 1}
                      onClick={() => handleMovePSItem(index, "down")}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <FiArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(cmsItem)}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit CMS Item"
                    >
                      <FiEdit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProjectShowcaseCMSItem(cmsItem.id)}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Delete CMS Item"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form for Add/Edit */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 sm:p-7 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FiEdit3 className="text-zinc-400 h-5 w-5" />
                {isAddModalOpen ? "Add to Showcase Track" : `Edit Showcase: ${editingItem?.project?.project_name}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  setFormState(defaultFormState);
                }}
                className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <form
                id="showcase-form"
                onSubmit={isAddModalOpen ? handleSaveNewWork : handleSaveEditWork}
                className="space-y-8"
              >
                {/* 1. Project Selection */}
                {isAddModalOpen && (
                  <div className="space-y-3 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
                    <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                      1. Select Project
                    </label>
                    <select
                      value={formState.projectId}
                      onChange={(e) => handleSelectProjectDropdown(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose a project --</option>
                      {availableProjectsNotInCMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name} ({p.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedProjectObj && (
                  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-2">
                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                      Factual Project Overview (Read-Only)
                    </p>
                    <h3 className="text-lg text-white font-bold">{selectedProjectObj.project_name}</h3>
                    <p className="text-sm text-zinc-400">
                      /{selectedProjectObj.slug} • {selectedProjectObj.project_status} • {selectedProjectObj.project_type} • {(selectedProjectObj.project_tech || []).join(", ")}
                    </p>
                  </div>
                )}

                {/* 2. Persona Case Study Editor */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                      2. Persona Storytelling
                    </label>
                  </div>
                  
                  {/* Persona Tabs */}
                  {modes.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {modes.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleModeTabChange(m.id)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            formState.modeTabId === m.id
                              ? "bg-white text-zinc-950 shadow-sm border border-white"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          }`}
                        >
                          {m.mode_name}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 bg-zinc-900/30 p-6 sm:p-7 rounded-2xl border border-zinc-800">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Brief Description</label>
                      <textarea
                        value={formState.modeDescription}
                        onChange={(e) => setFormState({ ...formState, modeDescription: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Challenge</label>
                        <textarea
                          value={formState.modeChallenge}
                          onChange={(e) => setFormState({ ...formState, modeChallenge: e.target.value })}
                          rows={4}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Solution</label>
                        <textarea
                          value={formState.modeSolution}
                          onChange={(e) => setFormState({ ...formState, modeSolution: e.target.value })}
                          rows={4}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Impact</label>
                      <textarea
                        value={formState.modeImpact}
                        onChange={(e) => setFormState({ ...formState, modeImpact: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    
                    <BulletListInput
                      label="Key Highlights"
                      value={formState.modeHighlights}
                      onChange={(v) => setFormState({ ...formState, modeHighlights: v })}
                      placeholder="e.g. Achieved 99.9% uptime"
                    />

                    <BulletListInput
                      label="Extra Notes / Key Takeaways"
                      value={formState.modeNotes}
                      onChange={(v) => setFormState({ ...formState, modeNotes: v })}
                      placeholder="e.g. Architecture decisions, production trade-offs..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">User Count (Optional)</label>
                        <input
                          type="number"
                          value={formState.modeUserCount}
                          onChange={(e) => setFormState({ ...formState, modeUserCount: e.target.value ? Number(e.target.value) : "" })}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Revenue (Optional)</label>
                          <div className="flex items-center gap-1.5">
                            {["$", "₹", "€", "£"].map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => setFormState({ ...formState, modeCurrency: curr })}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                  formState.modeCurrency === curr
                                    ? "bg-white text-zinc-950 font-bold"
                                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                                }`}
                              >
                                {curr}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setFormState({ ...formState, modeCurrency: "" })}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                formState.modeCurrency === ""
                                  ? "bg-white text-zinc-950 font-bold"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white"
                              }`}
                            >
                              None
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Curr"
                            value={formState.modeCurrency}
                            onChange={(e) => setFormState({ ...formState, modeCurrency: e.target.value })}
                            className="w-24 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3.5 text-base text-center text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                          />
                          <input
                            type="number"
                            placeholder="e.g. 50000"
                            value={formState.modeRevenue}
                            onChange={(e) => setFormState({ ...formState, modeRevenue: e.target.value ? Number(e.target.value) : "" })}
                            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Display Settings */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                    3. Showcase Display Settings
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 cursor-pointer hover:bg-zinc-900/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={formState.showDescription}
                        onChange={(e) => setFormState({ ...formState, showDescription: e.target.checked })}
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      <span className="text-sm font-medium text-zinc-200">Show Description</span>
                    </label>
                    <label className="flex items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 cursor-pointer hover:bg-zinc-900/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={formState.showTechnologies}
                        onChange={(e) => setFormState({ ...formState, showTechnologies: e.target.checked })}
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      <span className="text-sm font-medium text-zinc-200">Show Technologies</span>
                    </label>
                    <label className="flex items-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 cursor-pointer hover:bg-zinc-900/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={formState.showViewAction}
                        onChange={(e) => setFormState({ ...formState, showViewAction: e.target.checked })}
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      <span className="text-sm font-medium text-zinc-200">Show View Action</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  setFormState(defaultFormState);
                }}
                className="px-6 py-3 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="showcase-form"
                className="px-7 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiCheck className="h-4 w-4" /> {isAddModalOpen ? "Save to Showcase" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
