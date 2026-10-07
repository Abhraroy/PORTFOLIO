"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiSmartphone,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiArrowUp,
  FiArrowDown,
  FiType,
  FiInfo,
} from "react-icons/fi";

export default function CMSMobileHeroPage() {
  const {
    mobileHeroSkills,
    addMobileHeroSkill,
    updateMobileHeroSkill,
    deleteMobileHeroSkill,
    reorderMobileHeroSkills,
    fetchInitialData,
  } = useAdminStore();

  const [newSkillText, setNewSkillText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const sortedSkills = [...mobileHeroSkills].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;

    setIsSubmitting(true);
    await addMobileHeroSkill({
      text: newSkillText.trim(),
      displayOrder: sortedSkills.length,
      visible: true,
    });
    toast.success(`Added mobile hero skill "${newSkillText.trim()}"!`);
    setNewSkillText("");
    setIsSubmitting(false);
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateMobileHeroSkill(id, { text: editingText.trim() });
    toast.success("Updated mobile hero skill!");
    setEditingId(null);
    setEditingText("");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sortedSkills.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...sortedSkills];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((item, idx) => ({
      ...item,
      displayOrder: idx,
    }));

    await reorderMobileHeroSkills(updated);
    toast.success("Reordered mobile hero skills!");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="border-b border-zinc-800/80 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          CMS Control Layer
        </p>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mt-1.5">
          <FiSmartphone className="text-white h-7 w-7" /> Mobile View Hero Skills CMS
        </h1>
        <p className="text-base text-zinc-400 mt-2 leading-relaxed max-w-3xl">
          Manage typewriter skill strings displayed after &quot;I build with &quot; in the mobile hero view. Each record represents a skill string in the database.
        </p>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex items-center gap-3.5">
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
          <FiInfo className="h-5 w-5" />
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Active skills will loop sequentially in the typewriter component on devices below tablet breakpoint (<code className="text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">768px</code>).
        </p>
      </div>

      {/* Add New Skill String Form */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiPlus className="text-zinc-300 h-5 w-5" /> Add Skill Record String
        </h3>
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <FiType className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="e.g. Next.js, React Native, Rust..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-4 py-3 text-base text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newSkillText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <FiPlus className="h-4 w-4" /> Save Skill Record
          </button>
        </form>
      </div>

      {/* Skills String Table List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <h3 className="text-lg font-semibold text-white">
            Mobile Skill Records ({sortedSkills.length})
          </h3>
          <span className="text-sm text-zinc-400">
            {sortedSkills.filter((s) => s.visible).length} visible in typewriter
          </span>
        </div>

        {sortedSkills.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-500">
            No skill records found. Add your first skill record above.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSkills.map((skill, index) => {
              const isEditing = editingId === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl border transition-all ${
                    skill.visible
                      ? "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
                      : "border-zinc-800/60 bg-zinc-900/30 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <span className="font-mono text-sm text-zinc-500 w-7 shrink-0 text-center font-medium">
                      #{index + 1}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-base text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(skill.id)}
                          className="p-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
                          title="Save change"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                          title="Cancel edit"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base font-semibold text-white truncate">
                          {skill.text}
                        </span>
                        {!skill.visible && (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Hidden
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-all"
                        title="Move Up"
                      >
                        <FiArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === sortedSkills.length - 1}
                        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition-all"
                        title="Move Down"
                      >
                        <FiArrowDown className="h-4 w-4" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => {
                          updateMobileHeroSkill(skill.id, {
                            visible: !skill.visible,
                          });
                          toast.success(skill.visible ? "Hidden skill from typewriter" : "Showed skill in typewriter");
                        }}
                        className={`p-2 rounded-lg border transition-all ${
                          skill.visible
                            ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                            : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title={skill.visible ? "Hide from typewriter" : "Show in typewriter"}
                      >
                        {skill.visible ? (
                          <FiEye className="h-4 w-4" />
                        ) : (
                          <FiEyeOff className="h-4 w-4" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(skill.id, skill.text)}
                        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                        title="Edit Skill String"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          deleteMobileHeroSkill(skill.id);
                          toast.success(`Deleted skill "${skill.text}"`);
                        }}
                        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                        title="Delete Skill Record"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
