"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import { FileUploader } from "../../_components/FileUploader";
import {
  FiGrid,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiExternalLink,
  FiGithub,
  FiPlus,
  FiEye,
  FiSearch,
  FiLayers,
  FiGlobe,
  FiInfo,
  FiBookOpen,
  FiUsers,
  FiDollarSign,
  FiBook,
  FiFileText,
} from "react-icons/fi";
import {
  Project,
  ProjectStatus,
  ProjectType,
  ProjectVisibilityStatus,
  SelectedWorkSectionCMSItemData,
} from "../../_components/types";

interface FormState {
  projectId: string;
  project_name: string;
  slug: string;
  project_tech: string;
  project_tags: string;
  project_url: string;
  project_github: string;
  project_image: string;
  project_status: ProjectStatus;
  project_type: ProjectType;
  project_visibility_status: ProjectVisibilityStatus;
  highlights: string;
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
  projectMdUrl: string;
  // Selected Work CMS Specific Settings
  offset: "up" | "down";
  customNumber: string;
  visible: boolean;
  showOneLiner: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showHighlights: boolean;
}

const defaultFormState: FormState = {
  projectId: "",
  project_name: "",
  slug: "",
  project_tech: "",
  project_tags: "",
  project_url: "",
  project_github: "",
  project_image: "",
  project_status: "ACTIVE",
  project_type: "PERSONAL",
  project_visibility_status: "PUBLIC",
  highlights: "",
  // Case Study Defaults
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
  projectMdUrl: "",
  // Selected Work Defaults
  offset: "up",
  customNumber: "",
  visible: true,
  showOneLiner: true,
  showDescription: true,
  showTechnologies: true,
  showHighlights: true,
};

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|\|/)
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
}

interface BulletListInputProps {
  label: string;
  value: string;
  onChange: (mergedValue: string) => void;
  placeholder?: string;
}

function BulletListInput({
  label,
  value,
  onChange,
  placeholder = "Add bullet item...",
}: BulletListInputProps) {
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

    const merged = updated
      .map((b) => b.trim())
      .filter((b) => b.length > 0)
      .map((b) => `• ${b}`)
      .join("\n");
    onChange(merged);
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, ""]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    const finalItems = updated.length > 0 ? updated : [""];
    setItems(finalItems);

    const merged = finalItems
      .map((b) => b.trim())
      .filter((b) => b.length > 0)
      .map((b) => `• ${b}`)
      .join("\n");
    onChange(merged);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
        <label className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
          {label}
          <span className="ml-1 rounded-full bg-zinc-800 border border-zinc-700/60 px-3 py-0.5 text-xs text-zinc-300 font-medium">
            {items.filter((b) => b.trim()).length} Bullets
          </span>
        </label>
        <button
          type="button"
          onClick={() => setIsRawMode(!isRawMode)}
          className="text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer font-medium"
        >
          {isRawMode ? "Bullet List Builder" : "Raw Text Editor"}
        </button>
      </div>

      {isRawMode ? (
        <textarea
          rows={6}
          placeholder="Enter bullets line by line&#10;• Item 1&#10;• Item 2"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setItems(parseValueToBullets(e.target.value));
          }}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors min-h-[160px] leading-relaxed"
        />
      ) : (
        <div className="space-y-3">
          {items.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-zinc-500 font-bold text-lg select-none pl-1">•</span>
              <input
                type="text"
                value={bullet}
                placeholder={`${placeholder} #${idx + 1}`}
                onChange={(e) => handleUpdateItem(idx, e.target.value)}
                className="w-full h-12 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="h-12 w-12 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                title="Remove bullet item"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full mt-2 py-3 px-5 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-sm font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FiPlus className="h-4 w-4" /> Add Bullet Item
          </button>
        </div>
      )}
    </div>
  );
}

export default function CMSSelectedWorkPage() {
  const {
    projects,
    modes,
    activeModeId,
    projectHighlights,
    selectedWorkCMS,
    updateSelectedWorkCMS,
    addSelectedWorkCMSItem,
    updateSelectedWorkCMSItem,
    deleteSelectedWorkCMSItem,
    reorderSelectedWorkCMSItems,
    updateProject,
    deleteProject,
    addProjectHighlight,
    updateProjectModeContent,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    cmsItem?: SelectedWorkSectionCMSItemData;
    project: Project;
  } | null>(null);
  const [viewingItem, setViewingItem] = useState<{
    cmsItem?: SelectedWorkSectionCMSItemData;
    project?: Project;
  } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    cmsItem?: SelectedWorkSectionCMSItemData;
    project?: Project;
  } | null>(null);
  const [deleteProjectAlso, setDeleteProjectAlso] = useState(false);

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const swCMSItems = useMemo(() => {
    return [...(selectedWorkCMS.items || [])].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }, [selectedWorkCMS.items]);

  const filteredCMSItems = useMemo(() => {
    if (!searchQuery.trim()) return swCMSItems;
    const q = searchQuery.toLowerCase();
    return swCMSItems.filter((item) => {
      const proj = projects.find((p) => p.id === item.projectId);
      return (
        proj?.project_name.toLowerCase().includes(q) ||
        proj?.slug.toLowerCase().includes(q) ||
        proj?.project_tech.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [swCMSItems, projects, searchQuery]);

  const availableProjectsNotInCMS = useMemo(() => {
    const includedIds = new Set(swCMSItems.map((item) => item.projectId));
    return projects.filter((p) => !includedIds.has(p.id));
  }, [projects, swCMSItems]);

  // Helper to load Case Study content for a given persona mode ID
  const loadModeContentForForm = (proj: Project, modeId: string) => {
    const modeContent =
      proj.modeContents?.find((m) => m.portfolioModeId === modeId) ||
      proj.modeContents?.[0];

    const uCount: number | "" =
      typeof modeContent?.project_user_count === "number"
        ? modeContent.project_user_count
        : "";

    const rev: number | "" =
      typeof modeContent?.project_revenue === "number"
        ? modeContent.project_revenue
        : "";

    const rawHighlights = modeContent?.project_highlights || [];
    const formattedHighlights =
      rawHighlights.length > 0
        ? rawHighlights.map((h) => `• ${h}`).join("\n")
        : "";

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
      projectMdUrl: proj.project_md_url || "",
    };
  };

  // Switch mode tab inside modal to edit Case Study for a specific persona
  const handleModeTabChange = (newModeId: string) => {
    if (!formState.projectId || formState.projectId === "__new__") {
      setFormState((prev) => ({ ...prev, modeTabId: newModeId }));
      return;
    }
    const proj = projects.find((p) => p.id === formState.projectId);
    if (!proj) {
      setFormState((prev) => ({ ...prev, modeTabId: newModeId }));
      return;
    }
    const storyData = loadModeContentForForm(proj, newModeId);
    setFormState((prev) => ({
      ...prev,
      ...storyData,
    }));
  };

  // Handle selecting a project from the dropdown in Create/Edit Modal
  const handleSelectProjectDropdown = (selectedId: string) => {
    if (!selectedId) {
      setFormState((prev) => ({
        ...prev,
        projectId: "",
      }));
      return;
    }

    const currentModeId = formState.modeTabId || activeModeId || modes[0]?.id || "";

    if (selectedId === "__new__") {
      setFormState({
        ...defaultFormState,
        projectId: "__new__",
        modeTabId: currentModeId,
        customNumber: (swCMSItems.length + 1).toString().padStart(2, "0"),
        offset: swCMSItems.length % 2 === 0 ? "up" : "down",
      });
      return;
    }

    const proj = projects.find((p) => p.id === selectedId);
    if (!proj) return;

    const highlights = projectHighlights
      .filter((h) => h.projectId === proj.id)
      .map((h) => h.content)
      .join(", ");

    const storyData = loadModeContentForForm(proj, currentModeId);

    setFormState({
      projectId: proj.id,
      project_name: proj.project_name || "",
      slug: proj.slug || "",
      project_tech: (proj.project_tech || []).join(", "),
      project_tags: (proj.project_tags || []).join(", "),
      project_url: proj.project_url || "",
      project_github: proj.project_github || "",
      project_image: proj.project_image || "",
      project_status: proj.project_status || "ACTIVE",
      project_type: proj.project_type || "PERSONAL",
      project_visibility_status: proj.project_visibility_status || "PUBLIC",
      highlights: highlights,
      ...storyData,
      offset: swCMSItems.length % 2 === 0 ? "up" : "down",
      customNumber: (swCMSItems.length + 1).toString().padStart(2, "0"),
      visible: true,
      showOneLiner: true,
      showDescription: true,
      showTechnologies: true,
      showHighlights: true,
    });

    toast.info(`Populated factual & Case Study data for "${proj.project_name}"!`);
  };

  // Open Create Modal
  const openCreateModal = () => {
    const defaultMode = activeModeId || modes[0]?.id || "";
    setFormState({
      ...defaultFormState,
      modeTabId: defaultMode,
      customNumber: (swCMSItems.length + 1).toString().padStart(2, "0"),
      offset: swCMSItems.length % 2 === 0 ? "up" : "down",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cmsItem: SelectedWorkSectionCMSItemData) => {
    const proj = projects.find((p) => p.id === cmsItem.projectId);
    if (!proj) {
      toast.error("Linked project data not found.");
      return;
    }
    const currentModeId = activeModeId || modes[0]?.id || "";
    const highlights = projectHighlights
      .filter((h) => h.projectId === proj.id)
      .map((h) => h.content)
      .join(", ");

    const storyData = loadModeContentForForm(proj, currentModeId);

    setEditingItem({ cmsItem, project: proj });
    setFormState({
      projectId: proj.id,
      project_name: proj.project_name || "",
      slug: proj.slug || "",
      project_tech: (proj.project_tech || []).join(", "),
      project_tags: (proj.project_tags || []).join(", "),
      project_url: proj.project_url || "",
      project_github: proj.project_github || "",
      project_image: proj.project_image || "",
      project_status: proj.project_status || "ACTIVE",
      project_type: proj.project_type || "PERSONAL",
      project_visibility_status: proj.project_visibility_status || "PUBLIC",
      highlights: highlights,
      ...storyData,
      offset: cmsItem.offset || "up",
      customNumber: cmsItem.customNumber || "",
      visible: cmsItem.visible ?? true,
      showOneLiner: cmsItem.showOneLiner ?? true,
      showDescription: cmsItem.showDescription ?? true,
      showTechnologies: cmsItem.showTechnologies ?? true,
      showHighlights: cmsItem.showHighlights ?? true,
    });
  };

  // Open Edit Modal for a project not currently in Selected Work grid
  const openEditUnaddedProject = (proj: Project) => {
    const currentModeId = activeModeId || modes[0]?.id || "";
    const highlights = projectHighlights
      .filter((h) => h.projectId === proj.id)
      .map((h) => h.content)
      .join(", ");

    const storyData = loadModeContentForForm(proj, currentModeId);

    setEditingItem({ project: proj });
    setFormState({
      projectId: proj.id,
      project_name: proj.project_name || "",
      slug: proj.slug || "",
      project_tech: (proj.project_tech || []).join(", "),
      project_tags: (proj.project_tags || []).join(", "),
      project_url: proj.project_url || "",
      project_github: proj.project_github || "",
      project_image: proj.project_image || "",
      project_status: proj.project_status || "ACTIVE",
      project_type: proj.project_type || "PERSONAL",
      project_visibility_status: proj.project_visibility_status || "PUBLIC",
      highlights: highlights,
      ...storyData,
      offset: "up",
      customNumber: "",
      visible: true,
      showOneLiner: true,
      showDescription: true,
      showTechnologies: true,
      showHighlights: true,
    });
  };

  // Submit Create Form
  const handleSaveNewWork = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.projectId) {
      toast.error("Please select a project from the master project pool.");
      return;
    }

    let targetProjectId = formState.projectId;

    // Upsert Case Study Mode Content if persona mode is selected
    if (targetProjectId && formState.modeTabId) {
      const modeHlList = parseBullets(formState.modeHighlights);

      await updateProjectModeContent(targetProjectId, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count:
          formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue:
          formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
        currency: formState.modeCurrency || null,
        extra_notes: formState.modeNotes || null,
      });
    }

    // Add Selected Work CMS Item
    await addSelectedWorkCMSItem({
      projectId: targetProjectId,
      displayOrder: swCMSItems.length + 1,
      visible: formState.visible,
      offset: formState.offset,
      customNumber: formState.customNumber || null,
      showOneLiner: formState.showOneLiner,
      showDescription: formState.showDescription,
      showTechnologies: formState.showTechnologies,
      showHighlights: formState.showHighlights,
    });

    const selectedProj = projects.find((p) => p.id === targetProjectId);
    toast.success(`Successfully added "${selectedProj?.project_name || "Project"}" to Selected Work!`);
    setIsAddModalOpen(false);
    setFormState(defaultFormState);
  };

  // Submit Edit Form
  const handleSaveEditWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Update Case Study Mode Content for selected persona
    if (formState.modeTabId) {
      const modeHlList = parseBullets(formState.modeHighlights);

      await updateProjectModeContent(editingItem.project.id, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count:
          formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue:
          formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
        currency: formState.modeCurrency || null,
        extra_notes: formState.modeNotes || null,
      });
    }

    // Update Selected Work CMS item settings if present
    if (editingItem.cmsItem) {
      await updateSelectedWorkCMSItem(editingItem.cmsItem.id, {
        offset: formState.offset,
        customNumber: formState.customNumber || null,
        visible: formState.visible,
        showOneLiner: formState.showOneLiner,
        showDescription: formState.showDescription,
        showTechnologies: formState.showTechnologies,
        showHighlights: formState.showHighlights,
      });
    }

    toast.success(`Updated Case Study & CMS settings for "${editingItem.project.project_name}"!`);
    setEditingItem(null);
    setFormState(defaultFormState);
  };

  // Clear/Reset Case Study for Current Persona Mode
  const handleClearCaseStudy = async () => {
    if (!formState.projectId || !formState.modeTabId) return;

    await updateProjectModeContent(formState.projectId, formState.modeTabId, {
      project_description: null,
      challenge: null,
      solution: null,
      impact: null,
      project_highlights: [],
      project_user_count: null,
      project_revenue: null,
      currency: null,
      extra_notes: null,
    });

    setFormState((prev) => ({
      ...prev,
      modeDescription: "",
      modeChallenge: "",
      modeSolution: "",
      modeImpact: "",
      modeHighlights: "",
      modeUserCount: "",
      modeRevenue: "",
      modeCurrency: "$",
      modeNotes: "",
    }));

    toast.info("Cleared Case Study content for selected persona mode.");
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    if (deletingItem.cmsItem) {
      await deleteSelectedWorkCMSItem(deletingItem.cmsItem.id);
    }

    if ((deleteProjectAlso || !deletingItem.cmsItem) && deletingItem.project) {
      await deleteProject(deletingItem.project.id);
      toast.success(
        `Deleted project "${deletingItem.project.project_name}" completely!`
      );
    } else {
      toast.success("Removed project from Selected Work!");
    }

    setDeletingItem(null);
    setDeleteProjectAlso(false);
  };

  // Reorder Item
  const handleMoveSWItem = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === swCMSItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...swCMSItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    await reorderSelectedWorkCMSItems(reindexed);
    toast.success("Updated selected work project sequence!");
  };

  // Quick toggle project from existing projects list
  const handleQuickAddProject = async (proj: Project) => {
    await addSelectedWorkCMSItem({
      projectId: proj.id,
      displayOrder: swCMSItems.length + 1,
      visible: true,
      offset: swCMSItems.length % 2 === 0 ? "up" : "down",
      customNumber: (swCMSItems.length + 1).toString().padStart(2, "0"),
      showOneLiner: true,
      showDescription: true,
      showTechnologies: true,
      showHighlights: true,
    });
    toast.success(`Added "${proj.project_name}" to Selected Work!`);
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Top Header */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Admin Panel CMS
          </p>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
            <FiGrid className="text-white h-7 w-7" /> Selected Work & Case Study CMS
          </h1>
          <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
            Create, edit, sequence, and manage projects and their <strong>Case Study Briefs</strong> (One-liner, Challenge, Solution, Impact, Technical Highlights, and Markdown files) for your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FiPlus className="h-4 w-4" /> Add Selected Work
          </button>
        </div>
      </div>

      {/* Section Enable & Search Controls */}
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
              checked={selectedWorkCMS.visible}
              onChange={(e) =>
                updateSelectedWorkCMS({ visible: e.target.checked })
              }
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
            />
            {selectedWorkCMS.visible ? (
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
            placeholder="Search selected work by title, slug, or tech stack..."
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

      {/* Selected Work Items Grid */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2.5">
            <FiSettings className="text-zinc-400" /> Active Grid Sequence ({filteredCMSItems.length})
          </h2>
          <span className="text-sm text-zinc-400">
            Total Projects in DB: {projects.length}
          </span>
        </div>

        {filteredCMSItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl space-y-4">
            <p className="text-sm sm:text-base text-zinc-400">
              No Selected Work items found matching your criteria.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              <FiPlus /> Create New Selected Work Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCMSItems.map((cmsItem, index) => {
              const proj = projects.find((p) => p.id === cmsItem.projectId);
              const activeMc = proj?.modeContents?.find(
                (m) => m.portfolioModeId === activeModeId
              ) || proj?.modeContents?.[0];

              return (
                <div
                  key={cmsItem.id}
                  className={`rounded-2xl border p-5 transition-all space-y-4 ${
                    cmsItem.visible
                      ? "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
                      : "border-zinc-800/60 bg-zinc-900/30 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-bold px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 shrink-0 font-mono">
                        #{cmsItem.customNumber || (index + 1).toString().padStart(2, "0")}
                      </span>

                      {proj?.project_image && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                          <img
                            src={proj.project_image}
                            alt={proj.project_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg font-bold text-white">
                            {proj?.project_name || "Unknown Project"}
                          </span>
                          {proj?.slug && (
                            <span className="text-xs text-zinc-400 font-mono">
                              /{proj.slug}
                            </span>
                          )}
                          <span
                            className={`text-xs uppercase font-medium px-2 py-0.5 rounded border ${
                              cmsItem.visible
                                ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                                : "bg-zinc-900 text-zinc-500 border-zinc-800"
                            }`}
                          >
                            {cmsItem.visible ? "Active" : "Hidden"}
                          </span>
                        </div>

                        {/* Case Study brief preview */}
                        {activeMc?.project_description && (
                          <p className="text-sm text-zinc-400 line-clamp-1 mt-1 max-w-xl">
                            &quot;{activeMc.project_description}&quot;
                          </p>
                        )}

                        {/* Tech stack pills */}
                        {proj?.project_tech && proj.project_tech.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {proj.project_tech.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Reorder controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveSWItem(index, "up")}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <FiArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        disabled={index === swCMSItems.length - 1}
                        onClick={() => handleMoveSWItem(index, "down")}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <FiArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewingItem({ cmsItem, project: proj })}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="View Case Study Breakdown"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(cmsItem)}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit Project, Case Study & CMS Options"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingItem({ cmsItem, project: proj })}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Remove from Grid"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Field Visibility Toggles & Rhythm Bar */}
                  <div className="border-t border-zinc-800 pt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                        Masonry Rhythm Offset
                      </label>
                      <select
                        value={cmsItem.offset || "up"}
                        onChange={(e) =>
                          updateSelectedWorkCMSItem(cmsItem.id, {
                            offset: e.target.value as "up" | "down",
                          })
                        }
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 cursor-pointer"
                      >
                        <option value="up">Shift Up</option>
                        <option value="down">Shift Down</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                        Custom Number Override
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 01"
                        value={cmsItem.customNumber || ""}
                        onChange={(e) =>
                          updateSelectedWorkCMSItem(cmsItem.id, {
                            customNumber: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-300 pt-3 sm:pt-0">
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={cmsItem.showHighlights}
                          onChange={(e) =>
                            updateSelectedWorkCMSItem(cmsItem.id, {
                              showHighlights: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                        />
                        Highlights
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={cmsItem.showTechnologies}
                          onChange={(e) =>
                            updateSelectedWorkCMSItem(cmsItem.id, {
                              showTechnologies: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                        />
                        Technologies
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={cmsItem.visible}
                          onChange={(e) =>
                            updateSelectedWorkCMSItem(cmsItem.id, {
                              visible: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                        />
                        Visible on Site
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Unadded Projects Quick Section */}
      {availableProjectsNotInCMS.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
            <FiInfo className="text-zinc-400 h-4 w-4" /> Available Projects Not In Selected Work Grid ({availableProjectsNotInCMS.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableProjectsNotInCMS.map((proj) => (
              <div
                key={proj.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center justify-between gap-3 hover:border-zinc-700 transition-all"
              >
                <div>
                  <p className="text-sm font-bold text-white">{proj.project_name}</p>
                  <p className="text-xs text-zinc-400">/{proj.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditUnaddedProject(proj)}
                    className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Edit Project & Case Study"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem({ project: proj })}
                    className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Delete Project Permanently"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddProject(proj)}
                    className="px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs text-white flex items-center gap-1.5 font-semibold cursor-pointer"
                    title="Add to Selected Work Grid"
                  >
                    <FiPlus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / ADD WORK MODAL WITH PROJECT DROPDOWN & CASE STUDY FIELDS */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <FiPlus className="text-zinc-400 h-6 w-6" /> Create / Add Selected Work & Case Study
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Select an existing project from the dropdown to auto-fill factual data, or create a new project.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* PROJECT DROPDOWN SELECTOR */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-zinc-300">
                1. Select Project Dropdown (Auto-Populate Factual & Case Study Data)
              </label>
              <select
                value={formState.projectId}
                onChange={(e) => handleSelectProjectDropdown(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
              >
                <option value="">-- Choose Existing Project to Auto-Fill --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name} ({p.slug})
                  </option>
                ))}
                <option value="__new__">+ Create Brand New Custom Project</option>
              </select>
            </div>

            <form onSubmit={handleSaveNewWork} className="space-y-6">
              {/* SECTION 2: FACTUAL PROJECT DATA (READ-ONLY REFERENCE) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiInfo className="text-zinc-400 h-4 w-4" /> 2. Master Project Facts (Factual Data)
                  </span>
                  <a
                    href="/admin/projects"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-white hover:underline flex items-center gap-1 font-medium"
                  >
                    Edit Master Facts in /admin/projects <FiExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {formState.projectId && formState.projectId !== "__new__" ? (
                  (() => {
                    const selProj = projects.find((p) => p.id === formState.projectId);
                    if (!selProj) return null;
                    return (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-white">{selProj.project_name}</h3>
                            <p className="text-sm text-zinc-400">/{selProj.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {selProj.project_status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/60 text-zinc-400 border border-zinc-700">
                              {selProj.project_type}
                            </span>
                          </div>
                        </div>

                        {selProj.project_tech && selProj.project_tech.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {selProj.project_tech.map((t, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-zinc-400 italic">
                    Select an existing project from the dropdown above to attach to Selected Work. Master project facts are managed in the <a href="/admin/projects" target="_blank" className="text-white underline font-semibold">Projects Pool</a>.
                  </p>
                )}
              </div>

              {/* SECTION 3: CASE STUDY FIELDS */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiBook className="text-zinc-400 h-4 w-4" /> 3. Case Study Details & Documentation
                  </span>
                  {formState.modeTabId && (
                    <button
                      type="button"
                      onClick={handleClearCaseStudy}
                      className="text-xs text-zinc-400 hover:text-white font-medium hover:underline cursor-pointer"
                    >
                      Reset Case Study
                    </button>
                  )}
                </div>

                {/* Persona Mode Switcher Tabs */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Select Persona Mode for Case Study Brief:
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
                    Case Study One-Liner / Brief
                  </label>
                  <input
                    type="text"
                    placeholder="Short summary or executive brief of the project..."
                    value={formState.modeDescription}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        modeDescription: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <BulletListInput
                    label="Challenge (Problem Statement)"
                    value={formState.modeChallenge}
                    onChange={(val) =>
                      setFormState({ ...formState, modeChallenge: val })
                    }
                    placeholder="Describe challenge point"
                  />

                  <BulletListInput
                    label="Solution (Technical Architecture)"
                    value={formState.modeSolution}
                    onChange={(val) =>
                      setFormState({ ...formState, modeSolution: val })
                    }
                    placeholder="Describe solution point"
                  />

                  <BulletListInput
                    label="Impact (Outcomes & Results)"
                    value={formState.modeImpact}
                    onChange={(val) =>
                      setFormState({ ...formState, modeImpact: val })
                    }
                    placeholder="Describe impact point"
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <BulletListInput
                    label="Technical Highlights (Key Architecture & Performance Feats)"
                    value={formState.modeHighlights}
                    onChange={(val) =>
                      setFormState({ ...formState, modeHighlights: val })
                    }
                    placeholder="e.g. Distributed event bus via Redis Streams, Sub-50ms query latency..."
                  />

                  <BulletListInput
                    label="Extra Notes / Key Takeaways / Architectural Observations"
                    value={formState.modeNotes}
                    onChange={(val) =>
                      setFormState({ ...formState, modeNotes: val })
                    }
                    placeholder="e.g. Trade-offs made during scaling, future roadmap items..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                      <FiUsers className="text-zinc-400 h-4 w-4" /> User Count Impact Metric
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={formState.modeUserCount}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          modeUserCount:
                            e.target.value !== "" ? Number(e.target.value) : "",
                        })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <FiDollarSign className="text-zinc-400 h-4 w-4" /> Revenue Impact Metric
                      </label>
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
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            modeRevenue:
                              e.target.value !== "" ? Number(e.target.value) : "",
                          })
                        }
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* MARKDOWN FILE UPLOADER & URL INPUT */}
                <div className="space-y-4 border-t border-zinc-800 pt-5">
                  <label className="block text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-zinc-400" /> Markdown Case Study File Upload (.md)
                  </label>
                  <FileUploader
                    acceptedTypes="md"
                    defaultFolder="projects"
                    label="Upload Markdown Case Study File (.md)"
                    currentUrl={formState.projectMdUrl}
                    onUploadSuccess={(url) => {
                      setFormState((prev) => ({ ...prev, projectMdUrl: url }));
                      toast.success("Attached Markdown Case Study file!");
                    }}
                  />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mt-4 mb-2">
                      Or Direct Markdown File URL:
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formState.projectMdUrl}
                      onChange={(e) =>
                        setFormState({ ...formState, projectMdUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: SELECTED WORK SPECIFIC OPTIONS */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-7 space-y-6">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiSettings className="text-zinc-400 h-4 w-4" /> 4. Selected Work Grid Configuration
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Masonry Rhythm Offset
                    </label>
                    <select
                      value={formState.offset}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          offset: e.target.value as "up" | "down",
                        })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                    >
                      <option value="up">Shift Up</option>
                      <option value="down">Shift Down</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Custom Number Override
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={formState.customNumber}
                      onChange={(e) =>
                        setFormState({ ...formState, customNumber: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-zinc-200 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formState.visible}
                      onChange={(e) =>
                        setFormState({ ...formState, visible: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                    />
                    Visible in Grid
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formState.showHighlights}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          showHighlights: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                    />
                    Show Highlights Badges
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formState.showTechnologies}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          showTechnologies: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                    />
                    Show Technologies
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
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
                  <FiCheck className="h-4 w-4" /> Add to Selected Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT WORK & CASE STUDY MODAL */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* EDIT WORK & CASE STUDY MODAL */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <FiEdit3 className="text-zinc-400 h-6 w-6" /> Edit Selected Work & Case Study:{" "}
                  <span className="text-white font-bold">{editingItem.project.project_name}</span>
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Modify factual project properties, persona case study briefs, and grid display configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEditWork} className="space-y-6">
              {/* SECTION 1: FACTUAL PROJECT DATA (READ-ONLY REFERENCE) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiInfo className="text-zinc-400 h-4 w-4" /> 1. Master Project Facts (Factual Data)
                  </span>
                  <a
                    href="/admin/projects"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-white hover:underline flex items-center gap-1 font-medium"
                  >
                    Edit Master Facts in /admin/projects <FiExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{editingItem.project.project_name}</h3>
                      <p className="text-sm text-zinc-400">/{editingItem.project.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {editingItem.project.project_status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800/60 text-zinc-400 border border-zinc-700">
                        {editingItem.project.project_type}
                      </span>
                    </div>
                  </div>

                  {editingItem.project.project_tech && editingItem.project.project_tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingItem.project.project_tech.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CASE STUDY & PERSONA MODE EDIT SECTION */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiBook className="text-zinc-400 h-4 w-4" /> 2. Case Study Details (`ProjectModeContent`)
                  </span>
                  {formState.modeTabId && (
                    <button
                      type="button"
                      onClick={handleClearCaseStudy}
                      className="text-xs text-zinc-400 hover:text-white font-medium hover:underline cursor-pointer"
                    >
                      Reset Case Study
                    </button>
                  )}
                </div>

                {/* Persona Mode Switcher Tabs */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                    Switch Persona Mode for Case Study Brief:
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
                    Case Study One-Liner / Brief
                  </label>
                  <input
                    type="text"
                    placeholder="Short summary or executive brief of the project..."
                    value={formState.modeDescription}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        modeDescription: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <BulletListInput
                    label="Challenge (Problem Statement)"
                    value={formState.modeChallenge}
                    onChange={(val) =>
                      setFormState({ ...formState, modeChallenge: val })
                    }
                    placeholder="Describe challenge point"
                  />

                  <BulletListInput
                    label="Solution (Technical Architecture)"
                    value={formState.modeSolution}
                    onChange={(val) =>
                      setFormState({ ...formState, modeSolution: val })
                    }
                    placeholder="Describe solution point"
                  />

                  <BulletListInput
                    label="Impact (Outcomes & Results)"
                    value={formState.modeImpact}
                    onChange={(val) =>
                      setFormState({ ...formState, modeImpact: val })
                    }
                    placeholder="Describe impact point"
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <BulletListInput
                    label="Technical Highlights (Key Architecture & Performance Feats)"
                    value={formState.modeHighlights}
                    onChange={(val) =>
                      setFormState({ ...formState, modeHighlights: val })
                    }
                    placeholder="e.g. Distributed event bus via Redis Streams, Sub-50ms query latency..."
                  />

                  <BulletListInput
                    label="Extra Notes / Key Takeaways / Architectural Observations"
                    value={formState.modeNotes}
                    onChange={(val) =>
                      setFormState({ ...formState, modeNotes: val })
                    }
                    placeholder="e.g. Trade-offs made during scaling, future roadmap items..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                      <FiUsers className="text-zinc-400 h-4 w-4" /> User Count Impact Metric
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={formState.modeUserCount}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          modeUserCount:
                            e.target.value !== "" ? Number(e.target.value) : "",
                        })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <FiDollarSign className="text-zinc-400 h-4 w-4" /> Revenue Impact Metric
                      </label>
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
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            modeRevenue:
                              e.target.value !== "" ? Number(e.target.value) : "",
                          })
                        }
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* MARKDOWN FILE UPLOADER & URL INPUT */}
                <div className="space-y-4 border-t border-zinc-800 pt-5">
                  <label className="block text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-zinc-400" /> Markdown Case Study File Upload (.md)
                  </label>
                  <FileUploader
                    acceptedTypes="md"
                    defaultFolder="projects"
                    label="Upload Markdown Case Study File (.md)"
                    currentUrl={formState.projectMdUrl}
                    onUploadSuccess={(url) => {
                      setFormState((prev) => ({ ...prev, projectMdUrl: url }));
                      toast.success("Attached Markdown Case Study file!");
                    }}
                  />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mt-4 mb-2">
                      Or Direct Markdown File URL:
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formState.projectMdUrl}
                      onChange={(e) =>
                        setFormState({ ...formState, projectMdUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: SELECTED WORK SPECIFIC GRID OPTIONS */}
              {editingItem.cmsItem && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-7 space-y-6">
                  <div className="border-b border-zinc-800 pb-3">
                    <span className="text-sm font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                      <FiSettings className="text-zinc-400 h-4 w-4" /> 3. Selected Work Grid Configuration
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Masonry Rhythm Offset
                      </label>
                      <select
                        value={formState.offset}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            offset: e.target.value as "up" | "down",
                          })
                        }
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                      >
                        <option value="up">Shift Up</option>
                        <option value="down">Shift Down</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Custom Number Override
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 01"
                        value={formState.customNumber}
                        onChange={(e) =>
                          setFormState({ ...formState, customNumber: e.target.value })
                        }
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-zinc-200 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formState.visible}
                        onChange={(e) =>
                          setFormState({ ...formState, visible: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      Visible on Site
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formState.showHighlights}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            showHighlights: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      Show Highlights Badges
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formState.showTechnologies}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            showTechnologies: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                      />
                      Show Technologies
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-800">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW FACTUAL & CASE STUDY DETAILS MODAL */}
      {/* ========================================================================= */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <FiEye className="text-zinc-400" /> Project Factual & Case Study Breakdown
              </h2>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {viewingItem.project ? (
              <div className="space-y-5 text-sm">
                {viewingItem.project.project_image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src={viewingItem.project.project_image}
                      alt={viewingItem.project.project_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Name</span>
                    <span className="font-bold text-white text-base">{viewingItem.project.project_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Slug</span>
                    <span className="text-zinc-300">/{viewingItem.project.slug}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Status</span>
                    <span className="text-zinc-200 font-semibold">{viewingItem.project.project_status}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Type</span>
                    <span className="text-zinc-300">{viewingItem.project.project_type}</span>
                  </div>
                </div>

                {/* Persona Mode Case Study Content List */}
                <div className="space-y-4 pt-2">
                  <span className="text-sm font-bold uppercase text-zinc-300 flex items-center gap-2">
                    <FiBook className="text-zinc-400" /> Case Study Details Per Persona Mode
                  </span>
                  {viewingItem.project.modeContents && viewingItem.project.modeContents.length > 0 ? (
                    <div className="space-y-4">
                      {viewingItem.project.modeContents.map((mc) => {
                        const modeObj = modes.find((m) => m.id === mc.portfolioModeId);
                        return (
                          <div
                            key={mc.id}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3"
                          >
                            <span className="text-xs font-bold uppercase text-zinc-200 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 inline-block">
                              {modeObj?.mode_name || "Persona Mode"}
                            </span>

                            {mc.project_description && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">One-Liner Brief</span>
                                <p className="text-sm text-zinc-300 italic">"{mc.project_description}"</p>
                              </div>
                            )}

                            {mc.challenge && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Challenge</span>
                                {parseBullets(mc.challenge).length > 0 ? (
                                  <ul className="space-y-1.5 pl-1">
                                    {parseBullets(mc.challenge).map((b, i) => (
                                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-zinc-300">{mc.challenge}</p>
                                )}
                              </div>
                            )}

                            {mc.solution && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Solution</span>
                                {parseBullets(mc.solution).length > 0 ? (
                                  <ul className="space-y-1.5 pl-1">
                                    {parseBullets(mc.solution).map((b, i) => (
                                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-zinc-300">{mc.solution}</p>
                                )}
                              </div>
                            )}

                            {mc.impact && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Impact</span>
                                {parseBullets(mc.impact).length > 0 ? (
                                  <ul className="space-y-1.5 pl-1">
                                    {parseBullets(mc.impact).map((b, i) => (
                                      <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-zinc-300">{mc.impact}</p>
                                )}
                              </div>
                            )}

                            {mc.project_highlights && mc.project_highlights.length > 0 && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1.5">Technical Highlights</span>
                                <div className="flex flex-wrap gap-2">
                                  {mc.project_highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700"
                                    >
                                      • {h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {mc.extra_notes && (
                              <div>
                                <span className="text-xs text-zinc-400 uppercase font-semibold block mb-1">Extra Notes</span>
                                <ul className="space-y-1.5">
                                  {parseBullets(mc.extra_notes).map((n, i) => (
                                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500 shrink-0" />
                                      <span>{n}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                              {typeof mc.project_user_count === "number" && (
                                <span className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  Users: {mc.project_user_count.toLocaleString()}
                                </span>
                              )}
                              {typeof mc.project_revenue === "number" && (
                                <span className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  Revenue: {mc.currency !== undefined && mc.currency !== null ? mc.currency : "$"}{mc.project_revenue.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">
                      No custom persona Case Study content configured yet.
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-xs text-zinc-400 uppercase font-semibold block mb-2">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {viewingItem.project.project_tech?.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 pt-3 border-t border-zinc-800">
                  {viewingItem.project.project_url && (
                    <a
                      href={viewingItem.project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <FiGlobe className="h-4 w-4" /> Live Preview <FiExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {viewingItem.project.project_github && (
                    <a
                      href={viewingItem.project.project_github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <FiGithub className="h-4 w-4" /> Repository <FiExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {viewingItem.project.project_md_url && (
                    <a
                      href={viewingItem.project.project_md_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-zinc-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <FiBookOpen className="h-4 w-4" /> Case Study MD <FiExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No project details available.</p>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                onClick={() => setViewingItem(null)}
                className="px-6 py-2.5 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiTrash2 className="text-zinc-400" /> {deletingItem.cmsItem ? "Remove Selected Work Item" : "Delete Project Permanently"}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {deletingItem.cmsItem ? (
                <>
                  Are you sure you want to remove{" "}
                  <strong className="text-white">"{deletingItem.project?.project_name || "this project"}"</strong> from the Selected Work grid?
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete project{" "}
                  <strong className="text-white">"{deletingItem.project?.project_name || "this project"}"</strong> from the database? This action cannot be undone.
                </>
              )}
            </p>

            {deletingItem.cmsItem && (
              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer pt-2 font-medium">
                <input
                  type="checkbox"
                  checked={deleteProjectAlso}
                  onChange={(e) => setDeleteProjectAlso(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer accent-white"
                />
                Also delete underlying Project permanently from DB
              </label>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setDeletingItem(null);
                  setDeleteProjectAlso(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiCheck className="h-4 w-4" /> {deletingItem.cmsItem ? "Confirm Remove" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
