"use client";

import React, { useState } from "react";
import { useAdminStore } from "../../_components/store";
import { HeroNodeCMSItemData } from "../../_components/types";
import { INFO_CARD_CONFIG } from "@/components/NewHeroSection/config/nodes.data";
import { toast } from "react-toastify";
import {
  FiSliders,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiLayout,
  FiType,
} from "react-icons/fi";

export default function CMSHeroNodesPage() {
  const {
    heroNodesCMS,
    updateHeroNodesCMS,
    addHeroNodeCMSItem,
    updateHeroNodeCMSItem,
    deleteHeroNodeCMSItem,
    reorderHeroNodeCMSItems,
  } = useAdminStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Node Form State
  const [newNode, setNewNode] = useState<{
    label: string;
    title: string;
    description: string;
    techStack: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    cardWidth: string;
    cardHeight: string;
    cardMinHeight: string;
    cardImageHeight: string;
    titleFontSize: string;
    descriptionFontSize: string;
    techBadgeFontSize: string;
    ctaFontSize: string;
  }>({
    label: "",
    title: "",
    description: "",
    techStack: "",
    ctaLabel: "View projects",
    ctaHref: "/#work",
    image: "",
    cardWidth: "",
    cardHeight: "",
    cardMinHeight: "",
    cardImageHeight: "",
    titleFontSize: "",
    descriptionFontSize: "",
    techBadgeFontSize: "",
    ctaFontSize: "",
  });

  const cmsItems = [...(heroNodesCMS?.items || [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

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

    reorderHeroNodeCMSItems(reindexed);
    toast.success("Updated hero node display sequence!");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNode.label || !newNode.title) return;

    const techArray = newNode.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addHeroNodeCMSItem({
      nodeId: newNode.label.toLowerCase().replace(/[^a-z0-9]/g, ""),
      label: newNode.label,
      title: newNode.title,
      description: newNode.description,
      techStack: techArray.length > 0 ? techArray : ["Web"],
      ctaLabel: newNode.ctaLabel || "View projects",
      ctaHref: newNode.ctaHref || "/#work",
      image: newNode.image || null,
      cardWidth: newNode.cardWidth || null,
      cardHeight: newNode.cardHeight || null,
      cardMinHeight: newNode.cardMinHeight || null,
      cardImageHeight: newNode.cardImageHeight || null,
      titleFontSize: newNode.titleFontSize || null,
      descriptionFontSize: newNode.descriptionFontSize || null,
      techBadgeFontSize: newNode.techBadgeFontSize || null,
      ctaFontSize: newNode.ctaFontSize || null,
      displayOrder: cmsItems.length + 1,
      visible: true,
    });

    setNewNode({
      label: "",
      title: "",
      description: "",
      techStack: "",
      ctaLabel: "View projects",
      ctaHref: "/#work",
      image: "",
      cardWidth: "",
      cardHeight: "",
      cardMinHeight: "",
      cardImageHeight: "",
      titleFontSize: "",
      descriptionFontSize: "",
      techBadgeFontSize: "",
      ctaFontSize: "",
    });
    setShowAddForm(false);
    toast.success(`Created 3D node "${newNode.label}"!`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="border-b border-zinc-800/80 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Hero CMS
        </p>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
          <FiSliders className="text-white h-7 w-7" /> Hero 3D Network Nodes CMS
        </h1>
        <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
          Manage 3D skill nodes, card copy, tech badges, CTAs, card dimensions, font sizes, display sequence, and visibility on the interactive hero sphere.
        </p>
      </div>

      {/* Explanation Box */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-zinc-200 uppercase tracking-wider">
          <FiInfo className="h-5 w-5 text-zinc-400" />
          <span>Hero Nodes & InfoCard CMS Architecture</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
          All node content (title, description, tech stack, CTAs) and individual node InfoCard overrides (custom width, card height, banner height, font sizes) are managed here. Global baseline defaults are defined in <code className="text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">nodes.data.ts</code>.
        </p>

        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm text-zinc-200 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={heroNodesCMS.visible}
              onChange={(e) => updateHeroNodesCMS({ visible: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-white focus:ring-0"
            />
            Hero Section Network Active on Site
          </label>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            {showAddForm ? <FiX className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
            {showAddForm ? "Cancel" : "Add New Skill Node"}
          </button>
        </div>
      </div>

      {/* Add New Node Form */}
      {showAddForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-7 space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiPlus className="text-zinc-300" /> Add New Network Skill Node
          </h2>

          <form onSubmit={handleAddSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Node 3D Sphere Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js"
                  value={newNode.label}
                  onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js App Router"
                  value={newNode.title}
                  onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description Copy
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of your expertise..."
                value={newNode.description}
                onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tech Badges (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="App Router, RSC, Vercel"
                  value={newNode.techStack}
                  onChange={(e) => setNewNode({ ...newNode, techStack: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  CTA Label
                </label>
                <input
                  type="text"
                  placeholder="View projects"
                  value={newNode.ctaLabel}
                  onChange={(e) => setNewNode({ ...newNode, ctaLabel: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  placeholder="/#work"
                  value={newNode.ctaHref}
                  onChange={(e) => setNewNode({ ...newNode, ctaHref: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Card Header Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://... or /image.png"
                value={newNode.image}
                onChange={(e) => setNewNode({ ...newNode, image: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                Create Node
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nodes List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FiSliders className="text-zinc-400" /> Active Hero Network Nodes ({cmsItems.length})
          </h2>
          <p className="text-sm text-zinc-400">
            Order matches Fibonacci sphere orbit priority.
          </p>
        </div>

        <div className="space-y-4">
          {cmsItems.map((item, idx) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-all space-y-4 ${
                  item.visible
                    ? "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
                    : "border-zinc-800/60 bg-zinc-900/30 opacity-50"
                }`}
              >
                {isEditing ? (
                  <EditNodeForm
                    item={item}
                    onSave={(updated) => {
                      updateHeroNodeCMSItem(item.id, updated);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300">
                          #{item.displayOrder}
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {item.label}
                        </h3>
                        {item.title !== item.label && (
                          <span className="text-sm text-zinc-400">
                            ({item.title})
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {item.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-medium px-2.5 py-1 rounded-md border border-zinc-700/60 bg-zinc-800 text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.ctaHref && (
                          <span className="text-xs text-zinc-400 flex items-center gap-1 ml-2 font-mono">
                            CTA: {item.ctaLabel} ({item.ctaHref})
                          </span>
                        )}
                        {(item.cardWidth || item.cardHeight || item.cardImageHeight) && (
                          <span className="text-xs font-medium text-zinc-200 border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 rounded-md ml-1">
                            Custom Card Layout
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveCMSItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <FiArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCMSItem(idx, "down")}
                        disabled={idx === cmsItems.length - 1}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <FiArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateHeroNodeCMSItem(item.id, { visible: !item.visible })
                        }
                        className={`p-2.5 rounded-xl border transition-colors ${
                          item.visible
                            ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                            : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title={item.visible ? "Visible on Sphere" : "Hidden"}
                      >
                        {item.visible ? (
                          <FiEye className="h-4 w-4" />
                        ) : (
                          <FiEyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(item.id)}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit Node Data & InfoCard"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHeroNodeCMSItem(item.id)}
                        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Delete Node"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EditNodeForm({
  item,
  onSave,
  onCancel,
}: {
  item: HeroNodeCMSItemData;
  onSave: (updated: Partial<HeroNodeCMSItemData>) => void;
  onCancel: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"content" | "styling">("content");

  const [form, setForm] = useState({
    label: item.label,
    title: item.title,
    description: item.description,
    techStack: item.techStack.join(", "),
    ctaLabel: item.ctaLabel,
    ctaHref: item.ctaHref,
    image: item.image || "",
    cardWidth: item.cardWidth || "",
    cardHeight: item.cardHeight || "",
    cardMinHeight: item.cardMinHeight || "",
    cardImageHeight: item.cardImageHeight || "",
    titleFontSize: item.titleFontSize || "",
    descriptionFontSize: item.descriptionFontSize || "",
    techBadgeFontSize: item.techBadgeFontSize || "",
    ctaFontSize: item.ctaFontSize || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = form.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      label: form.label,
      title: form.title,
      description: form.description,
      techStack: techArray,
      ctaLabel: form.ctaLabel,
      ctaHref: form.ctaHref,
      image: form.image || null,
      cardWidth: form.cardWidth || null,
      cardHeight: form.cardHeight || null,
      cardMinHeight: form.cardMinHeight || null,
      cardImageHeight: form.cardImageHeight || null,
      titleFontSize: form.titleFontSize || null,
      descriptionFontSize: form.descriptionFontSize || null,
      techBadgeFontSize: form.techBadgeFontSize || null,
      ctaFontSize: form.ctaFontSize || null,
    });
  };

  // Calculate live preview dimensions
  const previewWidth = form.cardWidth || INFO_CARD_CONFIG.width;
  const previewImageHeight = form.cardImageHeight || INFO_CARD_CONFIG.imageHeight;
  const previewTitleFontSize = form.titleFontSize || INFO_CARD_CONFIG.titleFontSize;
  const previewDescFontSize = form.descriptionFontSize || INFO_CARD_CONFIG.descriptionFontSize;
  const previewTechFontSize = form.techBadgeFontSize || INFO_CARD_CONFIG.techBadgeFontSize;
  const previewCtaFontSize = form.ctaFontSize || INFO_CARD_CONFIG.ctaFontSize;
  const previewHeight = form.cardHeight || INFO_CARD_CONFIG.height;
  const previewMinHeight = form.cardMinHeight || INFO_CARD_CONFIG.minHeight;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      {/* Form Section Selector & Preview Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === "content"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white"
            }`}
          >
            <FiType /> Node Data & Copy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("styling")}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === "styling"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white"
            }`}
          >
            <FiLayout /> InfoCard Dimensions & Fonts
          </button>
        </div>

        <span className="text-xs text-zinc-400">
          Live InfoCard Preview Enabled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Editor Form Columns */}
        <div className="lg:col-span-2 space-y-5">
          {activeTab === "content" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    3D Sphere Node Label
                  </label>
                  <input
                    type="text"
                    required
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Info Card Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Card Description Copy
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tech Badges
                  </label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    CTA Href Link
                  </label>
                  <input
                    type="text"
                    value={form.ctaHref}
                    onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Card Header Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or /image.png"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-3">
                Override global card dimensions and font sizes for this specific node. Leave fields blank to use global defaults from <code className="text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">nodes.data.ts</code>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Card Width (e.g. 340px)
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.width}`}
                    value={form.cardWidth}
                    onChange={(e) => setForm({ ...form, cardWidth: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Header Banner / Image Height
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.imageHeight}`}
                    value={form.cardImageHeight}
                    onChange={(e) => setForm({ ...form, cardImageHeight: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Overall Card Height (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.height}`}
                    value={form.cardHeight}
                    onChange={(e) => setForm({ ...form, cardHeight: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Min Overall Height (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.minHeight}`}
                    value={form.cardMinHeight}
                    onChange={(e) => setForm({ ...form, cardMinHeight: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Title Font Size (e.g. 20px)
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.titleFontSize}`}
                    value={form.titleFontSize}
                    onChange={(e) => setForm({ ...form, titleFontSize: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description Font Size
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.descriptionFontSize}`}
                    value={form.descriptionFontSize}
                    onChange={(e) => setForm({ ...form, descriptionFontSize: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tech Badge Font Size
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.techBadgeFontSize}`}
                    value={form.techBadgeFontSize}
                    onChange={(e) => setForm({ ...form, techBadgeFontSize: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    CTA Button Font Size
                  </label>
                  <input
                    type="text"
                    placeholder={`Global default: ${INFO_CARD_CONFIG.ctaFontSize}`}
                    value={form.ctaFontSize}
                    onChange={(e) => setForm({ ...form, ctaFontSize: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 flex items-center gap-2"
            >
              <FiCheck className="h-4 w-4" /> Save Node & InfoCard
            </button>
          </div>
        </div>

        {/* Live InfoCard Preview Panel */}
        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
            Live InfoCard Preview
          </p>

          <div
            className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl transition-all flex flex-col mx-auto"
            style={{
              width: previewWidth,
              maxWidth: "100%",
              height: previewHeight !== "auto" ? previewHeight : undefined,
              minHeight: previewMinHeight !== "auto" ? previewMinHeight : undefined,
              borderRadius: INFO_CARD_CONFIG.borderRadius,
            }}
          >
            {form.image ? (
              <div
                className="relative w-full border-b border-white/10 shrink-0 bg-zinc-900 overflow-hidden"
                style={{ height: previewImageHeight }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ) : previewImageHeight && previewImageHeight !== "0px" ? (
              <div
                className="relative w-full shrink-0 border-b border-white/10 bg-gradient-to-br from-zinc-800/80 via-zinc-900/90 to-zinc-950 flex items-center justify-center overflow-hidden"
                style={{ height: previewImageHeight }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />
                <span className="font-mono text-xs font-semibold text-zinc-500 tracking-wider uppercase z-10 select-none">
                  {form.title || "Header Image Banner"}
                </span>
              </div>
            ) : (
              <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700" />
            )}

            <div
              className="flex flex-col flex-1 justify-between"
              style={{
                padding: INFO_CARD_CONFIG.padding,
                gap: INFO_CARD_CONFIG.gap,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-mono font-semibold tracking-wide text-zinc-50"
                    style={{ fontSize: previewTitleFontSize }}
                  >
                    {form.title || "Node Title"}
                  </h3>
                  <span
                    className="rounded-md border border-white/10 px-1.5 py-0.5 text-zinc-400"
                    style={{ fontSize: INFO_CARD_CONFIG.escButtonFontSize }}
                  >
                    Esc
                  </span>
                </div>

                <p
                  className="leading-relaxed text-zinc-400"
                  style={{ fontSize: previewDescFontSize }}
                >
                  {form.description || "Skill description copy will appear here..."}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {form.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300"
                        style={{ fontSize: previewTechFontSize }}
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <div
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-mono font-medium tracking-wide text-zinc-100 transition"
                style={{ fontSize: previewCtaFontSize }}
              >
                {form.ctaLabel || "View projects"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
