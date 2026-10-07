"use client";

import React, { useState } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiInfo,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiExternalLink,
  FiBook,
  FiLayers,
} from "react-icons/fi";
import { Experience, ExperienceSectionCMSItemData } from "../../_components/types";

interface FormState {
  experienceId: string;
  role_title: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  modeTabId: string;
  expSummary: string;
  expDescription: string;
  expHighlights: string;
  // CMS Toggles
  isFeatured: boolean;
  showYear: boolean;
  showRole: boolean;
  showCompany: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showAchievements: boolean;
  showMetrics: boolean;
}

const defaultFormState: FormState = {
  experienceId: "",
  role_title: "",
  company_name: "",
  location: "",
  start_date: "",
  end_date: "",
  modeTabId: "",
  expSummary: "",
  expDescription: "",
  expHighlights: "",
  isFeatured: false,
  showYear: true,
  showRole: true,
  showCompany: true,
  showDescription: true,
  showTechnologies: true,
  showAchievements: true,
  showMetrics: true,
};

export default function CMSExperiencePage() {
  const {
    experiences,
    modes,
    activeModeId,
    experienceCMS,
    updateExperienceCMS,
    addExperienceCMSItem,
    updateExperienceCMSItem,
    deleteExperienceCMSItem,
    reorderExperienceCMSItems,
    addExperience,
    updateExperience,
    updateExperienceModeContent,
  } = useAdminStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    cmsItem?: ExperienceSectionCMSItemData;
    experience: Experience;
  } | null>(null);

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const cmsItems = [...(experienceCMS.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const loadModeContent = (exp: Experience, modeId: string) => {
    const mc = exp.modeContents?.find((c) => c.portfolioModeId === modeId) || exp.modeContents?.[0];
    return {
      expSummary: mc?.experience_summary || "",
      expDescription: mc?.experience_description || "",
      expHighlights: (mc?.experience_highlights || []).join(", "),
    };
  };

  // Switch mode tab inside modal
  const handleModeTabChange = (newModeId: string) => {
    setFormState((prev) => {
      if (!prev.experienceId || prev.experienceId === "__other__") {
        return { ...prev, modeTabId: newModeId };
      }
      const exp = experiences.find((e) => e.id === prev.experienceId);
      if (!exp) return { ...prev, modeTabId: newModeId };
      const story = loadModeContent(exp, newModeId);
      return {
        ...prev,
        modeTabId: newModeId,
        ...story,
      };
    });
  };

  // Dropdown selector handler
  const handleSelectExperienceDropdown = (selectedId: string) => {
    const currentMode = formState.modeTabId || activeModeId || modes[0]?.id || "";

    if (!selectedId) {
      setFormState({
        ...defaultFormState,
        modeTabId: currentMode,
      });
      return;
    }

    if (selectedId === "__other__") {
      setFormState({
        ...defaultFormState,
        experienceId: "__other__",
        modeTabId: currentMode,
      });
      return;
    }

    const exp = experiences.find((e) => e.id === selectedId);
    if (!exp) return;

    const story = loadModeContent(exp, currentMode);
    setFormState({
      ...defaultFormState,
      experienceId: exp.id,
      role_title: exp.role_title,
      company_name: exp.company_name,
      location: exp.location || "",
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
      modeTabId: currentMode,
      ...story,
    });
  };

  // Open Add Modal
  const openAddModal = () => {
    const defaultMode = activeModeId || modes[0]?.id || "";
    setFormState({
      ...defaultFormState,
      modeTabId: defaultMode,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal for a CMS milestone
  const openEditModal = (cmsItem: ExperienceSectionCMSItemData) => {
    const exp = experiences.find((e) => e.id === cmsItem.experienceId);
    if (!exp) {
      toast.error("Linked experience record not found.");
      return;
    }
    const currentMode = activeModeId || modes[0]?.id || "";
    const story = loadModeContent(exp, currentMode);

    setEditingItem({ cmsItem, experience: exp });
    setFormState({
      experienceId: exp.id,
      role_title: exp.role_title,
      company_name: exp.company_name,
      location: exp.location || "",
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
      modeTabId: currentMode,
      ...story,
      isFeatured: cmsItem.isFeatured ?? false,
      showYear: cmsItem.showYear ?? true,
      showRole: cmsItem.showRole ?? true,
      showCompany: cmsItem.showCompany ?? true,
      showDescription: cmsItem.showDescription ?? true,
      showTechnologies: cmsItem.showTechnologies ?? true,
      showAchievements: cmsItem.showAchievements ?? true,
      showMetrics: cmsItem.showMetrics ?? true,
    });
  };

  // Auto-sync: Ensure any experience in master pool is present in Experience CMS
  React.useEffect(() => {
    if (!experiences || !experienceCMS) return;
    const existingExpIds = new Set((experienceCMS.items || []).map((i) => i.experienceId));
    const missingExp = experiences.filter((exp) => !existingExpIds.has(exp.id));

    if (missingExp.length > 0) {
      missingExp.forEach(async (exp, idx) => {
        await addExperienceCMSItem({
          experienceId: exp.id,
          displayOrder: (experienceCMS.items || []).length + idx + 1,
          visible: true,
          isFeatured: false,
          showYear: true,
          showRole: true,
          showCompany: true,
          showDescription: true,
          showTechnologies: true,
          showAchievements: true,
          showMetrics: true,
        });
      });
    }
  }, [experiences, experienceCMS?.items, addExperienceCMSItem]);

  // Submit Add Form
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetExpId = formState.experienceId;

    if (!targetExpId) {
      toast.error("Please select an experience or choose 'Other / Custom Milestone'.");
      return;
    }

    // If Custom / Other selected, create new experience record first
    if (targetExpId === "__other__") {
      if (!formState.role_title.trim()) {
        toast.error("Role Title is required for custom experience.");
        return;
      }
      const compName = formState.company_name.trim();
      const createdExp = await addExperience({
        company_name: compName || "Freelance",
        role_title: formState.role_title.trim(),
        employment_type: compName ? "FULL_TIME" : "FREELANCE",
        location: formState.location || null,
        start_date: formState.start_date || new Date().toISOString().slice(0, 7),
        end_date: formState.end_date || null,
        currently_working: !formState.end_date,
        experience_tech: [],
      });

      if (createdExp && createdExp.id) {
        targetExpId = createdExp.id;
      } else {
        toast.error("Failed to create experience record.");
        return;
      }
    }

    // Save persona storytelling if mode selected
    if (targetExpId && formState.modeTabId) {
      const hlList = formState.expHighlights
        .split(",")
        .map((h) => h.trim())
        .map((h) => h.trim())
        .filter(Boolean);

      await updateExperienceModeContent(targetExpId, formState.modeTabId, {
        experience_summary: formState.expSummary || null,
        experience_description: formState.expDescription || null,
        experience_highlights: hlList,
      });
    }

    // Add to CMS display list
    await addExperienceCMSItem({
      experienceId: targetExpId,
      displayOrder: cmsItems.length + 1,
      visible: true,
      isFeatured: formState.isFeatured,
      showYear: formState.showYear,
      showRole: formState.showRole,
      showCompany: formState.showCompany,
      showDescription: formState.showDescription,
      showTechnologies: formState.showTechnologies,
      showAchievements: formState.showAchievements,
      showMetrics: formState.showMetrics,
    });

    toast.success("Added milestone experience to CMS!");
    setIsAddModalOpen(false);
    setFormState(defaultFormState);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Save master experience facts if modified
    await updateExperience(editingItem.experience.id, {
      role_title: formState.role_title.trim() || editingItem.experience.role_title,
      company_name: formState.company_name.trim() || editingItem.experience.company_name,
      location: formState.location || null,
      start_date: formState.start_date || editingItem.experience.start_date,
      end_date: formState.end_date || null,
      currently_working: !formState.end_date,
    });

    // Save persona storytelling
    if (formState.modeTabId) {
      const hlList = formState.expHighlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      await updateExperienceModeContent(editingItem.experience.id, formState.modeTabId, {
        experience_summary: formState.expSummary || null,
        experience_description: formState.expDescription || null,
        experience_highlights: hlList,
      });
    }

    // Update CMS item settings if present
    if (editingItem.cmsItem) {
      await updateExperienceCMSItem(editingItem.cmsItem.id, {
        isFeatured: formState.isFeatured,
        showYear: formState.showYear,
        showRole: formState.showRole,
        showCompany: formState.showCompany,
        showDescription: formState.showDescription,
        showTechnologies: formState.showTechnologies,
        showAchievements: formState.showAchievements,
        showMetrics: formState.showMetrics,
      });
    }

    toast.success(`Updated storytelling & CMS options for "${editingItem.experience.role_title}"!`);
    setEditingItem(null);
    setFormState(defaultFormState);
  };

  const handleMoveCMSItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === cmsItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...cmsItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    reorderExperienceCMSItems(reindexed);
    toast.success("Updated milestone display sequence!");
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Experience CMS
          </p>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
            <FiBriefcase className="text-white h-7 w-7" /> Experience Journey Composition
          </h1>
          <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
            Manage milestone display sequence, field visibility toggles, and persona storytelling.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" /> Add Milestone to CMS
        </button>
      </div>

      {/* Overview & Settings Box */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-200 uppercase tracking-wider">
          <FiInfo className="h-5 w-5 text-zinc-400" />
          <span>Section CMS Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center pt-2 border-t border-zinc-800/80">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
              Default Initial Active Milestone
            </label>
            <select
              value={experienceCMS.defaultActiveId || ""}
              onChange={(e) => updateExperienceCMS({ defaultActiveId: e.target.value || null })}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
            >
              <option value="">Top Ordered Item (Automatic)</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.role_title} @ {exp.company_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-6">
            <label className="flex items-center gap-2.5 text-sm font-medium text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={experienceCMS.visible}
                onChange={(e) => updateExperienceCMS({ visible: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
              />
              Section Active on Website
            </label>
          </div>
        </div>
      </div>

      {/* Displayed Milestones List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
          <FiSettings className="text-zinc-400" /> Displayed Journey Milestones ({cmsItems.length})
        </h2>

        <div className="space-y-4">
          {cmsItems.length === 0 ? (
            <p className="text-sm sm:text-base text-zinc-400 italic py-6 text-center">
              No milestones added to CMS yet. Click &quot;Add Milestone to CMS&quot; above to pick an experience.
            </p>
          ) : (
            cmsItems.map((cmsItem, itemIndex) => {
              const exp = experiences.find((e) => e.id === cmsItem.experienceId);
              if (!exp) return null;

              return (
                <div
                  key={cmsItem.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 p-5 space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-lg font-bold text-white">
                        {exp.role_title} <span className="text-zinc-400 font-normal">@ {exp.company_name}</span>
                      </span>
                      <span className="text-sm text-zinc-400 ml-2 font-sans">
                        ({exp.location || "Location N/A"})
                      </span>
                      {exp.experience_tech && exp.experience_tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {exp.experience_tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700">
                        #{cmsItem.displayOrder}
                      </span>

                      <button
                        type="button"
                        disabled={itemIndex === 0}
                        onClick={() => handleMoveCMSItem(itemIndex, "up")}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <FiArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={itemIndex === cmsItems.length - 1}
                        onClick={() => handleMoveCMSItem(itemIndex, "down")}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <FiArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(cmsItem)}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit Storytelling & Toggles"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteExperienceCMSItem(cmsItem.id);
                          toast.success("Removed milestone from CMS sequence!");
                        }}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Remove from CMS"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Field Toggles */}
                  <div className="border-t border-zinc-800/80 pt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showDescription}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showDescription: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
                      />
                      Story Description
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showTechnologies}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showTechnologies: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
                      />
                      Tech Badges
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showAchievements}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showAchievements: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
                      />
                      Achievements
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showMetrics}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showMetrics: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
                      />
                      Metrics
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD MILESTONE MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveAdd}
            className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FiPlus className="text-zinc-400 h-5 w-5" /> Add Milestone to Experience CMS
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dropdown Selector */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
                <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Select Experience Milestone
                </label>
                <select
                  value={formState.experienceId}
                  onChange={(e) => handleSelectExperienceDropdown(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                >
                  <option value="">-- Choose Existing Master Experience --</option>
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.role_title} @ {exp.company_name}
                    </option>
                  ))}
                  <option value="__other__">+ Other / Custom Experience Entry</option>
                </select>
              </div>

              {/* Factual Summary Card or Custom Input Fields */}
              {formState.experienceId && formState.experienceId !== "__other__" ? (
                (() => {
                  const selExp = experiences.find((e) => e.id === formState.experienceId);
                  if (!selExp) return null;
                  return (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <FiInfo className="h-4 w-4 text-zinc-400" /> Factual Role Details
                        </span>
                        <a
                          href="/admin/experience"
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-zinc-400 hover:text-white hover:underline flex items-center gap-1 font-medium"
                        >
                          Edit Master Facts in /admin/experience <FiExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-base text-white font-bold pt-1">
                        {selExp.role_title} @ {selExp.company_name}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Location: {selExp.location || "N/A"} • Type: {selExp.employment_type}
                      </div>
                    </div>
                  );
                })()
              ) : formState.experienceId === "__other__" ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5">
                  <span className="block text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800 pb-3">
                    Describe Custom Role Details
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Role Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Engineer"
                        value={formState.role_title}
                        onChange={(e) => setFormState({ ...formState, role_title: e.target.value })}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Company / Client Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Optional (leave blank for Freelance)"
                        value={formState.company_name}
                        onChange={(e) => setFormState({ ...formState, company_name: e.target.value })}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              ) : null}

              {/* Persona Storytelling Section */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6">
                <span className="block text-sm font-bold uppercase text-zinc-300 tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <FiBook className="h-4 w-4 text-zinc-400" /> Persona Storytelling Details (`ExperienceModeContent`)
                </span>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Select Persona Mode:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleModeTabChange(mode.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          formState.modeTabId === mode.id
                            ? "bg-white text-zinc-950 shadow-sm border border-white"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        {mode.mode_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Persona Story Summary (One-liner)
                  </label>
                  <input
                    type="text"
                    placeholder="Short summary for milestone cards..."
                    value={formState.expSummary}
                    onChange={(e) => setFormState({ ...formState, expSummary: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Persona Story Description / Bio Summary
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe key responsibilities and impact for this persona..."
                    value={formState.expDescription}
                    onChange={(e) => setFormState({ ...formState, expDescription: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Key Highlights (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Scaled infrastructure to 1M users, Reduced cloud cost by 30%"
                    value={formState.expHighlights}
                    onChange={(e) => setFormState({ ...formState, expHighlights: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiCheck className="h-4 w-4" /> Add to CMS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MILESTONE MODAL */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FiEdit3 className="text-zinc-400 h-5 w-5" /> Edit Milestone Story & Toggles: {editingItem.experience.role_title} @ {editingItem.experience.company_name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Factual Read-Only Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FiInfo className="h-4 w-4 text-zinc-400" /> Factual Role Details
                  </span>
                  <a
                    href="/admin/experience"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-white hover:underline flex items-center gap-1 font-medium"
                  >
                    Edit Master Facts in /admin/experience <FiExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-base text-white font-bold pt-1">
                  {editingItem.experience.role_title} @ {editingItem.experience.company_name}
                </div>
                <div className="text-sm text-zinc-400">
                  Location: {editingItem.experience.location || "N/A"} • Dates: {editingItem.experience.start_date ? editingItem.experience.start_date.slice(0, 7) : "N/A"} - {editingItem.experience.currently_working ? "Present" : editingItem.experience.end_date ? editingItem.experience.end_date.slice(0, 7) : "N/A"}
                </div>
              </div>

              {/* Persona Storytelling Section */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6">
                <span className="block text-sm font-bold uppercase text-zinc-300 tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <FiBook className="h-4 w-4 text-zinc-400" /> Persona Storytelling (`ExperienceModeContent`)
                </span>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Switch Persona Mode:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleModeTabChange(mode.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          formState.modeTabId === mode.id
                            ? "bg-white text-zinc-950 shadow-sm border border-white"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        {mode.mode_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Persona Story Description / Bio Summary
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe key responsibilities and impact for this persona..."
                    value={formState.expDescription}
                    onChange={(e) => setFormState({ ...formState, expDescription: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Key Highlights (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Scaled infrastructure to 1M users, Reduced cloud cost by 30%"
                    value={formState.expHighlights}
                    onChange={(e) => setFormState({ ...formState, expHighlights: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-6 py-3 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiCheck className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
