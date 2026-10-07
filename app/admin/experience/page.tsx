"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAdminStore } from "../_components/store";
import { Experience, EmploymentType } from "../_components/types";
import { ArrayInput } from "../_components/ArrayInput";
import {
  FiBriefcase,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiX,
} from "react-icons/fi";

const employmentTypes: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
  "SELF_EMPLOYED",
];

export default function ExperienceFactsPage() {
  const {
    experiences,
    experienceMetrics,
    experienceAchievements,
    addExperience,
    updateExperience,
    deleteExperience,
    addExperienceMetric,
    deleteExperienceMetric,
    addExperienceAchievement,
    deleteExperienceAchievement,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Form state - Facts
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [empType, setEmpType] = useState<EmploymentType>("FULL_TIME");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [experienceImage, setExperienceImage] = useState("");
  const [experienceTech, setExperienceTech] = useState<string[]>([]);

  // Metric Form state per experience
  const [newMetricExpId, setNewMetricExpId] = useState<string>("");
  const [newMetricLabel, setNewMetricLabel] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");

  // Achievement Form state per experience
  const [newAchExpId, setNewAchExpId] = useState<string>("");
  const [newAchContent, setNewAchContent] = useState("");

  const openCreateModal = () => {
    setEditingExp(null);
    setCompanyName("");
    setRoleTitle("");
    setEmpType("FULL_TIME");
    setLocation("");
    setStartDate(new Date().toISOString().slice(0, 7));
    setEndDate("");
    setCurrentlyWorking(true);
    setExperienceImage("");
    setExperienceTech([]);

    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setCompanyName(exp.company_name);
    setRoleTitle(exp.role_title);
    setEmpType(exp.employment_type);
    setLocation(exp.location || "");
    setStartDate(exp.start_date ? exp.start_date.slice(0, 10) : "");
    setEndDate(exp.end_date ? exp.end_date.slice(0, 10) : "");
    setCurrentlyWorking(exp.currently_working);
    setExperienceImage(exp.experience_image || "");
    setExperienceTech(exp.experience_tech || []);

    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    if (editingExp) {
      updateExperience(editingExp.id, {
        company_name: companyName.trim(),
        role_title: roleTitle.trim(),
        employment_type: empType,
        location: location || null,
        start_date: startDate,
        end_date: currentlyWorking ? null : endDate || null,
        currently_working: currentlyWorking,
        experience_image: experienceImage || null,
        experience_tech: experienceTech,
      });
    } else {
      addExperience({
        company_name: companyName.trim(),
        role_title: roleTitle.trim(),
        employment_type: empType,
        location: location || null,
        start_date: startDate,
        end_date: currentlyWorking ? null : endDate || null,
        currently_working: currentlyWorking,
        experience_image: experienceImage || null,
        experience_tech: experienceTech,
      });
    }

    toast.success(
      editingExp
        ? `Updated experience at ${companyName.trim()}`
        : `Created experience at ${companyName.trim()}`
    );
    setIsModalOpen(false);
  };

  const handleAddMetric = (expId: string) => {
    if (!newMetricLabel.trim() || !newMetricValue.trim()) return;
    const existing = experienceMetrics.filter((m) => m.experienceId === expId);
    addExperienceMetric({
      experienceId: expId,
      label: newMetricLabel.trim().toUpperCase(),
      value: newMetricValue.trim(),
      order: existing.length + 1,
      visible: true,
    });
    toast.success("Added metric!");
    setNewMetricLabel("");
    setNewMetricValue("");
    setNewMetricExpId("");
  };

  const handleAddAchievement = (expId: string) => {
    if (!newAchContent.trim()) return;
    const existing = experienceAchievements.filter((a) => a.experienceId === expId);
    addExperienceAchievement({
      experienceId: expId,
      content: newAchContent.trim(),
      order: existing.length + 1,
      visible: true,
    });
    toast.success("Added achievement bullet!");
    setNewAchContent("");
    setNewAchExpId("");
  };

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.location && exp.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "ALL" || exp.employment_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            Domain Facts
          </p>
          <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiBriefcase className="text-zinc-300 h-5 w-5" /> Factual Experience Pool
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Factual career roles (`Experience`), role metrics (`ExperienceMetric`), and achievements (`ExperienceAchievement`).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 font-mono text-xs font-semibold shadow-sm transition-all"
        >
          <FiPlus className="h-4 w-4" /> Add Experience Record
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <div className="relative w-full md:w-80 font-mono">
          <FiSearch className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, role, or location..."
            className="w-full rounded-xl border border-white/10 bg-zinc-950 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 w-full md:w-auto">
          <FiFilter className="h-3.5 w-3.5 text-zinc-500" />
          <span>Employment Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            {employmentTypes.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {filteredExperiences.map((exp) => {
          const metrics = experienceMetrics.filter((m) => m.experienceId === exp.id);
          const achievements = experienceAchievements.filter((a) => a.experienceId === exp.id);

          return (
            <div
              key={exp.id}
              className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-5 hover:border-white/20 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
            >
              {/* Role Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-50">{exp.role_title}</h3>
                    <span className="text-zinc-400 font-normal">@ {exp.company_name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-zinc-300 border border-white/10">
                      {exp.employment_type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <FiCalendar className="h-3 w-3 text-zinc-500" />
                      {exp.start_date} — {exp.currently_working ? <span className="text-emerald-400 font-semibold">Present</span> : exp.end_date || "N/A"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <FiMapPin className="h-3 w-3 text-zinc-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Tech Stack Pills */}
                  {exp.experience_tech && exp.experience_tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {exp.experience_tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-zinc-300 border border-white/10 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Edit Experience"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteExperience(exp.id);
                      toast.success(`Deleted experience at ${exp.company_name}`);
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Delete Experience"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Factual Metrics Section (`ExperienceMetric`: 8+ PIPELINES, 12 MODELS) */}
              <div className="space-y-3 pt-1">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  Factual Metrics (`ExperienceMetric`: 8+ PIPELINES, 40% LATENCY CUT)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                  {metrics.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-zinc-50">{m.value}</span>
                        <span className="text-[10px] text-zinc-400 ml-1.5 uppercase">{m.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          deleteExperienceMetric(m.id);
                          toast.success("Deleted metric!");
                        }}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Metric */}
                <div className="flex items-center gap-2 pt-1 font-mono">
                  <input
                    type="text"
                    placeholder="Value (8+)"
                    value={newMetricExpId === exp.id ? newMetricValue : ""}
                    onChange={(e) => {
                      setNewMetricExpId(exp.id);
                      setNewMetricValue(e.target.value);
                    }}
                    className="w-28 rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Label (PIPELINES)"
                    value={newMetricExpId === exp.id ? newMetricLabel : ""}
                    onChange={(e) => {
                      setNewMetricExpId(exp.id);
                      setNewMetricLabel(e.target.value);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddMetric(exp.id)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-medium"
                  >
                    <FiPlus /> Add Metric
                  </button>
                </div>
              </div>

              {/* Factual Achievements Section (`ExperienceAchievement`) */}
              <div className="space-y-3 pt-2">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  Key Achievements (`ExperienceAchievement`)
                </span>

                <div className="space-y-1.5">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start justify-between gap-2 p-2 rounded-xl border border-white/10 bg-white/5 text-xs text-zinc-300 font-sans"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-1 text-zinc-500">•</span>
                        <span>{a.content}</span>
                      </div>
                      <button
                        onClick={() => {
                          deleteExperienceAchievement(a.id);
                          toast.success("Deleted achievement bullet!");
                        }}
                        className="p-1 text-zinc-500 hover:text-rose-400 shrink-0"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Achievement */}
                <div className="flex items-center gap-2 pt-1 font-mono">
                  <input
                    type="text"
                    placeholder="Add key achievement bullet point..."
                    value={newAchExpId === exp.id ? newAchContent : ""}
                    onChange={(e) => {
                      setNewAchExpId(exp.id);
                      setNewAchContent(e.target.value);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none font-sans"
                  />
                  <button
                    onClick={() => handleAddAchievement(exp.id)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-medium"
                  >
                    <FiPlus /> Add Achievement
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form for Editing Role Facts */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-mono">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <FiBriefcase className="text-zinc-300" />
                {editingExp ? "Edit Experience Record" : "Add Experience Record"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold border-b border-white/5 pb-1">
                Role Facts (`Experience`)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Acme Inc."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Employment Type
                  </label>
                  <select
                    value={empType}
                    onChange={(e) => setEmpType(e.target.value as EmploymentType)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-none"
                  >
                    {employmentTypes.map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA (Remote)"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={currentlyWorking}
                    value={currentlyWorking ? "" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 disabled:opacity-40 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-zinc-400">
                  Experience Logo / Image (Upload)
                </label>
                <input
                  type="text"
                  value={experienceImage}
                  onChange={(e) => setExperienceImage(e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                />
              </div>

              <ArrayInput
                label="Tech Stack (`experience_tech`)"
                placeholder="Add technology e.g. React, Node.js..."
                items={experienceTech}
                onChange={setExperienceTech}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-mono font-semibold shadow-sm"
              >
                Save Experience Facts
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
