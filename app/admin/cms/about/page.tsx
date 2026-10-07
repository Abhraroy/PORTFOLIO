"use client";

import React, { useState } from "react";
import { toast as reactToast } from "react-toastify";
import { useAdminStore } from "../../_components/store";
import { FileUploader } from "../../_components/FileUploader";
import {
  PortfolioBlockData,
  PortfolioBlockItemType,
  PortfolioBlockItemData,
} from "../../_components/types";
import {
  FiLayout,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiSave,
  FiCheck,
  FiImage,
  FiLink,
  FiList,
  FiLayers,
  FiFilter,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const FIXED_BLOCK_DEFS: {
  blockNumber: number;
  type: "HERO" | "CARD" | "PROFILE";
  positionLabel: string;
  defaultLabel: string;
  defaultHeading: string;
  defaultDescription: string;
  defaultCtaText?: string;
  defaultCtaUrl?: string;
}[] = [
  {
    blockNumber: 1,
    type: "HERO",
    positionLabel: "Block 1 — Top Horizontal Hero (Row 1)",
    defaultLabel: "About me",
    defaultHeading: "Building interactive products with clarity and craft.",
    defaultDescription:
      "I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs.",
  },
  {
    blockNumber: 2,
    type: "CARD",
    positionLabel: "Block 2 — Horizontal Card (Row 2, Left)",
    defaultLabel: "Focus",
    defaultHeading: "Product engineering",
    defaultDescription: "Interfaces, APIs, and the space between.",
  },
  {
    blockNumber: 3,
    type: "CARD",
    positionLabel: "Block 3 — Horizontal Card (Row 2, Right)",
    defaultLabel: "Experience",
    defaultHeading: "4+ yrs",
    defaultDescription: "Shipping for web & startups",
  },
  {
    blockNumber: 4,
    type: "CARD",
    positionLabel: "Block 4 — Horizontal Card (Row 3, Left)",
    defaultLabel: "Stack",
    defaultHeading: "Next · TS · Node",
    defaultDescription: "Prisma · Three · Postgres",
  },
  {
    blockNumber: 5,
    type: "CARD",
    positionLabel: "Block 5 — Horizontal Card (Row 3, Middle)",
    defaultLabel: "Based",
    defaultHeading: "Remote",
    defaultDescription: "Open to collab worldwide",
  },
  {
    blockNumber: 6,
    type: "CARD",
    positionLabel: "Block 6 — Horizontal Card (Row 3, Right)",
    defaultLabel: "Status",
    defaultHeading: "Available",
    defaultDescription: "Select freelance & full-time",
  },
  {
    blockNumber: 7,
    type: "PROFILE",
    positionLabel: "Block 7 — Vertical Profile Panel (Right Column)",
    defaultLabel: "Profile",
    defaultHeading: "AR",
    defaultDescription: "Profile image / avatar visual",
  },
];

export default function AdminAboutCMSPage() {
  const {
    sections,
    modes,
    activeModeId,
    setActiveModeId,
    updateBlock,
    addBlock,
    addBlockItem,
    updateBlockItem,
    deleteBlockItem,
  } = useAdminStore();

  const sectionKey = "ABOUT";
  const aboutSection = sections.find((s) => s.key === sectionKey);
  const dbBlocks = aboutSection?.blocks || [];

  const [toast, setToast] = useState<string | null>(null);
  const [editingBlockNumber, setEditingBlockNumber] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<string | "ALL">("ACTIVE_PERSONA");

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  const showToast = (msg: string) => {
    setToast(msg);
    reactToast.success(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Map each fixed block 1..7 to its saved DB block (matching persona/mode or global)
  const fixedBlocksToDisplay = FIXED_BLOCK_DEFS.map((def) => {
    const modeMatch = dbBlocks.find((b) => {
      if (b.blockNumber !== def.blockNumber) return false;
      if (filterMode === "ALL") return true;
      if (filterMode === "ACTIVE_PERSONA") {
        return b.portfolioModeId === activeModeId;
      }
      return b.portfolioModeId === filterMode;
    });

    const globalMatch = dbBlocks.find(
      (b) =>
        b.blockNumber === def.blockNumber &&
        (!b.portfolioModeId || b.portfolioModeId === "")
    );

    const existingBlock = modeMatch || globalMatch;

    if (existingBlock) {
      return {
        def,
        block: {
          ...existingBlock,
          blockNumber: def.blockNumber,
          type: def.type,
        },
      };
    }

    // Default fallback block if not created in DB yet
    const fallbackBlock: PortfolioBlockData = {
      id: `virtual-blk-${def.blockNumber}`,
      sectionId: aboutSection?.id || "about-sec",
      blockNumber: def.blockNumber,
      type: def.type,
      label: def.defaultLabel,
      heading: def.defaultHeading,
      subheading: "",
      description: def.defaultDescription,
      ctaText: def.defaultCtaText || null,
      ctaUrl: def.defaultCtaUrl || null,
      ctaVisible: !!def.defaultCtaText,
      visible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };

    return { def, block: fallbackBlock };
  });

  return (
    <div className="space-y-8 pb-16 min-h-screen">
      {/* Top Banner Header & Persona Switcher */}
      <div className="flex flex-col gap-6 border-b border-zinc-800/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              About Me CMS
            </p>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
              <FiLayout className="text-white h-7 w-7" /> Fixed 7-Block Content Management
            </h1>
            <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
              The 7-block spatial layout (Blocks 1–6 horizontal left-to-right, Block 7 vertical panel) is fixed. Customize the inside content of each block below.
            </p>
          </div>

          {toast && (
            <span className="inline-flex items-center gap-2 text-sm text-zinc-200 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl shrink-0">
              <FiCheck className="text-emerald-400" /> {toast}
            </span>
          )}
        </div>

        {/* Persona Mode Toggle View */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-zinc-200">
              <FiLayers className="text-zinc-400 h-4 w-4" />
              <span>Persona View Control</span>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-medium border border-zinc-700/60 ml-2">
                Active: {activeMode?.mode_name || "Default"}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <FiFilter className="text-zinc-400 h-4 w-4" />
              <select
                value={filterMode}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterMode(val);
                  if (val !== "ALL" && val !== "ACTIVE_PERSONA") {
                    setActiveModeId(val);
                  }
                }}
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-zinc-500 cursor-pointer"
              >
                <option value="ACTIVE_PERSONA">View Active Persona + Global</option>
                <option value="ALL">Show All Blocks (Unfiltered)</option>
                {modes.map((m) => (
                  <option key={m.id} value={m.id}>
                    Only {m.mode_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800 max-w-full">
            {modes.map((mode) => {
              const isSelected = mode.id === activeModeId;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setActiveModeId(mode.id);
                    setFilterMode("ACTIVE_PERSONA");
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-white text-zinc-950 border-white shadow-sm font-semibold"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSelected ? "bg-zinc-950" : "bg-zinc-600"
                    }`}
                  />
                  <span>{mode.mode_name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7 Fixed Blocks List */}
      <div className="space-y-6">
        {fixedBlocksToDisplay.map(({ def, block }) => (
          <BlockEditorCard
            key={`${def.blockNumber}-${block.id || "virtual"}-${block.portfolioModeId || activeModeId || "global"}`}
            block={block}
            positionLabel={def.positionLabel}
            modes={modes}
            sectionKey={sectionKey}
            isEditing={editingBlockNumber === def.blockNumber}
            onToggleEdit={() =>
              setEditingBlockNumber(
                editingBlockNumber === def.blockNumber ? null : def.blockNumber
              )
            }
            onSaveBlock={(data) => {
              const targetModeId =
                data.portfolioModeId !== undefined
                  ? data.portfolioModeId
                  : block.portfolioModeId || null;
              const isExistingBlockForSameMode =
                block.id &&
                !block.id.startsWith("virtual-blk-") &&
                (block.portfolioModeId || null) === targetModeId;

              if (isExistingBlockForSameMode) {
                updateBlock(sectionKey, block.id, data);
              } else {
                addBlock(sectionKey, {
                  blockNumber: def.blockNumber,
                  type: def.type,
                  portfolioModeId: targetModeId,
                  visible: data.visible ?? block.visible ?? true,
                  label: data.label !== undefined ? data.label : block.label || null,
                  heading: data.heading !== undefined ? data.heading : block.heading || null,
                  subheading: data.subheading !== undefined ? data.subheading : block.subheading || null,
                  description: data.description !== undefined ? data.description : block.description || null,
                  imageUrl: data.imageUrl !== undefined ? data.imageUrl : block.imageUrl || null,
                  imageAlt: data.imageAlt !== undefined ? data.imageAlt : block.imageAlt || null,
                  ctaText: data.ctaText !== undefined ? data.ctaText : block.ctaText || null,
                  ctaUrl: data.ctaUrl !== undefined ? data.ctaUrl : block.ctaUrl || null,
                  ctaType: data.ctaType || "LINK",
                  ctaVisible: data.ctaVisible !== undefined ? data.ctaVisible : block.ctaVisible ?? false,
                  items: block.items || [],
                });
              }
              showToast(`Saved ${def.positionLabel}`);
            }}
            onAddItem={(item) => {
              if (block.id && !block.id.startsWith("virtual-blk-")) {
                addBlockItem(sectionKey, block.id, item);
                showToast("Added item");
              } else {
                reactToast.warning("Please save block content first before adding sub-items.");
              }
            }}
            onUpdateItem={(itemId, item) => {
              if (block.id) {
                updateBlockItem(sectionKey, block.id, itemId, item);
                showToast("Updated item");
              }
            }}
            onDeleteItem={(itemId) => {
              if (block.id) {
                deleteBlockItem(sectionKey, block.id, itemId);
                showToast("Removed item");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface BlockEditorCardProps {
  block: PortfolioBlockData;
  positionLabel: string;
  modes: { id: string; mode_name: string }[];
  sectionKey: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSaveBlock: (data: Partial<PortfolioBlockData>) => void;
  onAddItem: (
    item: Omit<PortfolioBlockItemData, "id" | "blockId" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateItem: (itemId: string, item: Partial<PortfolioBlockItemData>) => void;
  onDeleteItem: (itemId: string) => void;
}

function BlockEditorCard({
  block,
  positionLabel,
  modes,
  isEditing,
  onToggleEdit,
  onSaveBlock,
  onAddItem,
  onDeleteItem,
}: BlockEditorCardProps) {
  const [label, setLabel] = useState(block.label || "");
  const [heading, setHeading] = useState(block.heading || "");
  const [subheading, setSubheading] = useState(block.subheading || "");
  const [description, setDescription] = useState(block.description || "");
  const [personaId, setPersonaId] = useState<string>(block.portfolioModeId || "GLOBAL");
  const [visible, setVisible] = useState(block.visible);

  const [ctaText, setCtaText] = useState(block.ctaText || "");
  const [ctaUrl, setCtaUrl] = useState(block.ctaUrl || "");
  const [ctaVisible, setCtaVisible] = useState(block.ctaVisible ?? true);

  const [imageUrl, setImageUrl] = useState(block.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(block.imageAlt || "");

  const [newItemType, setNewItemType] = useState<PortfolioBlockItemType>("TEXT");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  React.useEffect(() => {
    setLabel(block.label || "");
    setHeading(block.heading || "");
    setSubheading(block.subheading || "");
    setDescription(block.description || "");
    setPersonaId(block.portfolioModeId || "GLOBAL");
    setVisible(block.visible);
    setCtaText(block.ctaText || "");
    setCtaUrl(block.ctaUrl || "");
    setCtaVisible(block.ctaVisible ?? true);
    setImageUrl(block.imageUrl || "");
    setImageAlt(block.imageAlt || "");
    setNewItemContent("");
    setNewItemUrl("");
    setNewItemType("TEXT");
  }, [
    block.id,
    block.portfolioModeId,
    block.label,
    block.heading,
    block.subheading,
    block.description,
    block.visible,
    block.ctaText,
    block.ctaUrl,
    block.ctaVisible,
    block.imageUrl,
    block.imageAlt,
  ]);

  const handleSave = () => {
    onSaveBlock({
      label: label || null,
      heading: heading || null,
      subheading: subheading || null,
      description: description || null,
      portfolioModeId: personaId === "GLOBAL" ? null : personaId,
      visible,
      ctaText: ctaText || null,
      ctaUrl: ctaUrl || null,
      ctaVisible,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
    });
  };

  const handleCreateItem = () => {
    if (!newItemContent.trim()) return;
    const maxOrder = (block.items || []).reduce((max, i) => Math.max(max, i.order), 0);
    onAddItem({
      type: newItemType,
      content: newItemContent,
      url: newItemUrl || null,
      order: maxOrder + 1,
      visible: true,
    });
    setNewItemContent("");
    setNewItemUrl("");
  };

  const currentPersonaName =
    modes.find((m) => m.id === block.portfolioModeId)?.mode_name || "Global (All Personas)";

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        visible ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-900 bg-zinc-950/40 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-zinc-800 text-white border border-zinc-700">
            {positionLabel}
          </span>
          <span className="text-xs font-medium uppercase px-2.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
            {block.type}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
            {currentPersonaName}
          </span>
          <span className="text-base font-semibold text-white">
            {label ? label : "Untitled"} —{" "}
            <span className="text-zinc-400 font-normal">{heading || "No Heading"}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              const nextVis = !visible;
              setVisible(nextVis);
              onSaveBlock({ visible: nextVis });
            }}
            className={`p-2 rounded-lg transition-colors ${
              visible ? "text-zinc-200 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-800"
            }`}
            title={visible ? "Visible" : "Hidden"}
          >
            {visible ? <FiEye className="h-5 w-5" /> : <FiEyeOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={onToggleEdit}
            className={`px-4 py-2 rounded-xl transition-colors text-sm font-semibold flex items-center gap-2 ${
              isEditing ? "bg-white text-zinc-950 shadow-sm" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/60"
            }`}
          >
            <FiEdit3 className="h-4 w-4" />
            {isEditing ? "Close Editor" : "Edit Content"}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-7 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Assigned Persona Mode
              </label>
              <select
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                <option value="GLOBAL">Global (All Personas)</option>
                {modes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.mode_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. FOCUS"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Product engineering"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Subheading
              </label>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="Optional secondary text"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description Body
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Interfaces, APIs, and the space between."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {block.type !== "HERO" && (
            <div className="border-t border-zinc-800/80 pt-5 space-y-4">
              <span className="block text-sm uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
                <FiLink /> Call To Action (CTA)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="CTA Button Label"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="CTA URL"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
                <label className="flex items-center gap-2.5 text-sm text-zinc-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ctaVisible}
                    onChange={(e) => setCtaVisible(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                  />
                  Show CTA Button
                </label>
              </div>
            </div>
          )}

          <div className="border-t border-zinc-800/80 pt-5 space-y-4">
            <span className="block text-sm uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <FiImage /> Media Reference & Cloudflare R2 Upload
            </span>
            <FileUploader
              label="Upload Block Image to Cloudflare R2"
              defaultFolder="about"
              acceptedTypes="image"
              currentUrl={imageUrl}
              onUploadSuccess={(url) => setImageUrl(url)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Or paste Image URL directly"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Image Alt Description"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-5 space-y-4">
            <span className="block text-sm uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
              <FiList /> Sub-Items (Bullets, Links, Text lines)
            </span>

            {block.items && block.items.length > 0 && (
              <div className="space-y-2.5">
                {block.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3.5 p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 text-sm"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                        {item.type}
                      </span>
                      <span className="text-zinc-200 truncate font-medium">{item.content}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as PortfolioBlockItemType)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                <option value="TEXT">TEXT</option>
                <option value="BULLET">BULLET</option>
                <option value="LINK">LINK</option>
              </select>

              <input
                type="text"
                placeholder="Item text content..."
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleCreateItem}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-colors shrink-0"
              >
                <FiPlus className="h-4 w-4" /> Add Item
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-bold shadow-sm transition-colors"
            >
              <FiSave className="h-4 w-4" /> Save {positionLabel} Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
