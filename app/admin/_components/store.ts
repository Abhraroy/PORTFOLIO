import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PortfolioMode,
  MyDetails,
  Project,
  Experience,
  ProjectModeContent,
  ExperienceModeContent,
  MyDetailsModeContent,
  PortfolioSectionData,
  PortfolioBlockData,
  PortfolioBlockItemData,
  ExperienceMetricData,
  ExperienceAchievementData,
  ProjectHighlightData,
  ExperienceSectionCMSData,
  ExperienceSectionCMSItemData,
  SelectedWorkSectionCMSData,
  SelectedWorkSectionCMSItemData,
  ProjectShowcaseSectionCMSData,
  ProjectShowcaseSectionCMSItemData,
  HeroNodeCMSData,
  HeroNodeCMSItemData,
  MobileHeroSkillData,
} from "./types";
import { SKILL_CATALOG } from "@/components/NewHeroSection/config/nodes.data";


interface AdminState {
  isLoading: boolean;
  activeModeId: string;
  modes: PortfolioMode[];
  details: MyDetails;
  projects: Project[];
  experiences: Experience[];
  sections: PortfolioSectionData[];

  fetchInitialData: () => Promise<void>;
  setActiveModeId: (id: string) => void;

  // Portfolio Modes
  addMode: (mode: Omit<PortfolioMode, "id" | "createdAt" | "updatedAt">) => void;
  updateMode: (id: string, mode: Partial<PortfolioMode>) => void;
  deleteMode: (id: string) => void;

  // My Details
  updateMyDetails: (details: Partial<MyDetails>) => void;
  updateMyDetailsModeContent: (
    modeId: string,
    content: Partial<MyDetailsModeContent>
  ) => void;

  // Projects
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateProjectModeContent: (
    projectId: string,
    modeId: string,
    content: Partial<ProjectModeContent>
  ) => void;

  // Experience
  addExperience: (
    experience: Omit<Experience, "id" | "createdAt" | "updatedAt">
  ) => Promise<Experience | null>;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  updateExperienceModeContent: (
    experienceId: string,
    modeId: string,
    content: Partial<ExperienceModeContent>
  ) => void;

  // CMS Portfolio Sections & Blocks
  updateBlock: (
    sectionKey: string,
    blockId: string,
    data: Partial<PortfolioBlockData>
  ) => void;
  addBlock: (
    sectionKey: string,
    block: Omit<PortfolioBlockData, "id" | "sectionId" | "createdAt" | "updatedAt">
  ) => void;
  deleteBlock: (sectionKey: string, blockId: string) => void;
  reorderBlocks: (sectionKey: string, blocks: PortfolioBlockData[]) => void;

  // Block Items
  addBlockItem: (
    sectionKey: string,
    blockId: string,
    item: Omit<PortfolioBlockItemData, "id" | "blockId" | "createdAt" | "updatedAt">
  ) => void;
  updateBlockItem: (
    sectionKey: string,
    blockId: string,
    itemId: string,
    item: Partial<PortfolioBlockItemData>
  ) => void;
  deleteBlockItem: (
    sectionKey: string,
    blockId: string,
    itemId: string
  ) => void;
  reorderBlockItems: (
    sectionKey: string,
    blockId: string,
    items: PortfolioBlockItemData[]
  ) => void;

  // Factual Domain Extension States
  experienceMetrics: ExperienceMetricData[];
  experienceAchievements: ExperienceAchievementData[];
  projectHighlights: ProjectHighlightData[];

  // Section CMS Composition States
  experienceCMS: ExperienceSectionCMSData;
  selectedWorkCMS: SelectedWorkSectionCMSData;
  projectShowcaseCMS: ProjectShowcaseSectionCMSData;
  heroNodesCMS: HeroNodeCMSData;
  mobileHeroSkills: MobileHeroSkillData[];

  // Factual Metric Actions
  addExperienceMetric: (metric: Omit<ExperienceMetricData, "id" | "createdAt" | "updatedAt">) => void;
  updateExperienceMetric: (id: string, metric: Partial<ExperienceMetricData>) => void;
  deleteExperienceMetric: (id: string) => void;

  // Factual Achievement Actions
  addExperienceAchievement: (achievement: Omit<ExperienceAchievementData, "id" | "createdAt" | "updatedAt">) => void;
  updateExperienceAchievement: (id: string, achievement: Partial<ExperienceAchievementData>) => void;
  deleteExperienceAchievement: (id: string) => void;

  // Factual Highlight Actions
  addProjectHighlight: (highlight: Omit<ProjectHighlightData, "id" | "createdAt" | "updatedAt">) => void;
  updateProjectHighlight: (id: string, highlight: Partial<ProjectHighlightData>) => void;
  deleteProjectHighlight: (id: string) => void;

  // Experience Section CMS Actions
  updateExperienceCMS: (data: Partial<ExperienceSectionCMSData>) => void;
  addExperienceCMSItem: (item: Omit<ExperienceSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateExperienceCMSItem: (id: string, item: Partial<ExperienceSectionCMSItemData>) => Promise<void>;
  deleteExperienceCMSItem: (id: string) => Promise<void>;
  reorderExperienceCMSItems: (items: ExperienceSectionCMSItemData[]) => void;

  // Selected Work Section CMS Actions
  updateSelectedWorkCMS: (data: Partial<SelectedWorkSectionCMSData>) => void;
  addSelectedWorkCMSItem: (item: Omit<SelectedWorkSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => void;
  updateSelectedWorkCMSItem: (id: string, item: Partial<SelectedWorkSectionCMSItemData>) => void;
  deleteSelectedWorkCMSItem: (id: string) => void;
  reorderSelectedWorkCMSItems: (items: SelectedWorkSectionCMSItemData[]) => void;

  // Project Showcase Section CMS Actions
  updateProjectShowcaseCMS: (data: Partial<ProjectShowcaseSectionCMSData>) => void;
  addProjectShowcaseCMSItem: (item: Omit<ProjectShowcaseSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProjectShowcaseCMSItem: (id: string, item: Partial<ProjectShowcaseSectionCMSItemData>) => Promise<void>;
  deleteProjectShowcaseCMSItem: (id: string) => Promise<void>;
  reorderProjectShowcaseCMSItems: (items: ProjectShowcaseSectionCMSItemData[]) => void;

  // Hero Nodes Section CMS Actions
  updateHeroNodesCMS: (data: Partial<HeroNodeCMSData>) => void;
  addHeroNodeCMSItem: (item: Omit<HeroNodeCMSItemData, "id" | "createdAt" | "updatedAt">) => void;
  updateHeroNodeCMSItem: (id: string, item: Partial<HeroNodeCMSItemData>) => void;
  deleteHeroNodeCMSItem: (id: string) => void;
  reorderHeroNodeCMSItems: (items: HeroNodeCMSItemData[]) => void;

  // Mobile Hero Section CMS Actions
  addMobileHeroSkill: (skill: Omit<MobileHeroSkillData, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateMobileHeroSkill: (id: string, skill: Partial<MobileHeroSkillData>) => Promise<void>;
  deleteMobileHeroSkill: (id: string) => Promise<void>;
  reorderMobileHeroSkills: (items: MobileHeroSkillData[]) => Promise<void>;
}

const defaultModes: PortfolioMode[] = [];
const defaultDetails: MyDetails = {
  id: "details-1",
  full_name: "",
  profile_image: null,
  resume_url: null,
  email: "",
  github_url: null,
  linkedin_url: null,
  x_url: null,
  instagram_url: null,
  discord_url: null,
  website_url: null,
  location: null,
  address: null,
  district: null,
  state: null,
  country: null,
  pin_code: null,
  years_of_experience: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const defaultProjects: Project[] = [];
const defaultExperiences: Experience[] = [];
const defaultSections: PortfolioSectionData[] = [];
const defaultExperienceMetrics: ExperienceMetricData[] = [];
const defaultExperienceAchievements: ExperienceAchievementData[] = [];
const defaultProjectHighlights: ProjectHighlightData[] = [];
const defaultExperienceCMS: ExperienceSectionCMSData = {
  id: "exp-cms-main",
  key: "EXPERIENCE_MAIN",
  visible: true,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const defaultSelectedWorkCMS: SelectedWorkSectionCMSData = {
  id: "sw-cms-main",
  key: "SELECTED_WORK_MAIN",
  visible: true,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const defaultProjectShowcaseCMS: ProjectShowcaseSectionCMSData = {
  id: "ps-cms-main",
  key: "PROJECT_SHOWCASE_MAIN",
  visible: true,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const defaultHeroNodesCMS: HeroNodeCMSData = {
  id: "hn-cms-main",
  key: "HERO_NODES_MAIN",
  visible: true,
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useAdminStore = create<AdminState>()((set, get) => ({
  isLoading: false,
  activeModeId: "",
  modes: [],
  details: defaultDetails,
  projects: [],
  experiences: [],
  sections: [],
  experienceMetrics: [],
  experienceAchievements: [],
  projectHighlights: [],
  experienceCMS: defaultExperienceCMS,
  selectedWorkCMS: defaultSelectedWorkCMS,
  projectShowcaseCMS: defaultProjectShowcaseCMS,
  heroNodesCMS: defaultHeroNodesCMS,
  mobileHeroSkills: [],

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/bootstrap");
      if (res.ok) {
        const data = await res.json();
        set({
          modes: data.modes || [],
          details: data.details || defaultDetails,
          projects: data.projects || [],
          experiences: data.experiences || [],
          sections: data.sections || [],
          experienceCMS: data.experienceCMS || defaultExperienceCMS,
          selectedWorkCMS: data.selectedWorkCMS || defaultSelectedWorkCMS,
          projectShowcaseCMS: data.projectShowcaseCMS || defaultProjectShowcaseCMS,
          heroNodesCMS: data.heroNodesCMS || defaultHeroNodesCMS,
          mobileHeroSkills: data.mobileHeroSkills || [],
          activeModeId: data.modes?.length ? data.modes[0].id : "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch initial data from API:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveModeId: (id) => set({ activeModeId: id }),

  // Portfolio Modes
  addMode: async (modeData) => {
    try {
      const res = await fetch("/api/admin/modes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modeData),
      });
      if (res.ok) {
        const newMode = await res.json();
        set((state) => ({ modes: [...state.modes, newMode] }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addMode error:", e);
    }
  },

  updateMode: async (id, modeData) => {
    try {
      const res = await fetch("/api/admin/modes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...modeData }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          modes: state.modes.map((m) => (m.id === id ? updated : m)),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateMode error:", e);
    }
  },

  deleteMode: async (id) => {
    try {
      const res = await fetch(`/api/admin/modes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({
          modes: state.modes.filter((m) => m.id !== id),
          activeModeId:
            state.activeModeId === id
              ? state.modes.find((m) => m.id !== id)?.id || ""
              : state.activeModeId,
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteMode error:", e);
    }
  },

  // My Details
  updateMyDetails: async (detailsData) => {
    try {
      const res = await fetch("/api/admin/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detailsData),
      });
      if (res.ok) {
        const updated = await res.json();
        set({ details: updated });
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateMyDetails error:", e);
    }
  },

  updateMyDetailsModeContent: async (portfolioModeId, content) => {
    try {
      const res = await fetch("/api/admin/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modeContent: { portfolioModeId, ...content } }),
      });
      if (res.ok) {
        const updated = await res.json();
        set({ details: updated });
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateMyDetailsModeContent error:", e);
    }
  },

  // Projects
  addProject: async (projectData) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        const newProj = await res.json();
        set((state) => ({ projects: [newProj, ...state.projects] }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addProject error:", e);
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updated : p)),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateProject error:", e);
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteProject error:", e);
    }
  },

  updateProjectModeContent: async (projectId, portfolioModeId, content) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modeContent: { portfolioModeId, ...content } }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateProjectModeContent error:", e);
    }
  },

  // Experience
  addExperience: async (expData) => {
    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expData),
      });
      if (res.ok) {
        const newExp = await res.json();
        set((state) => ({ experiences: [newExp, ...state.experiences] }));
        await get().fetchInitialData();
        return newExp;
      }
    } catch (e) {
      console.error("addExperience error:", e);
    }
    return null;
  },

  updateExperience: async (id, expData) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expData),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          experiences: state.experiences.map((e) => (e.id === id ? updated : e)),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateExperience error:", e);
    }
  },

  deleteExperience: async (id) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({ experiences: state.experiences.filter((e) => e.id !== id) }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteExperience error:", e);
    }
  },

  updateExperienceModeContent: async (experienceId, portfolioModeId, content) => {
    try {
      const res = await fetch(`/api/admin/experience/${experienceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modeContent: { portfolioModeId, ...content } }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          experiences: state.experiences.map((e) => (e.id === experienceId ? updated : e)),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateExperienceModeContent error:", e);
    }
  },

  // CMS Portfolio Sections & Blocks
  updateBlock: async (sectionKey, blockId, data) => {
    try {
      const res = await fetch("/api/admin/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockId, blockData: data }),
      });
      if (res.ok) {
        const updatedBlock = await res.json();
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => (blk.id === blockId ? updatedBlock : blk)),
            };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateBlock error:", e);
    }
  },

  addBlock: async (sectionKey, blockData) => {
    try {
      const res = await fetch("/api/admin/cms/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockData }),
      });
      if (res.ok) {
        const newBlock = await res.json();
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return { ...sec, blocks: [...sec.blocks, newBlock] };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addBlock error:", e);
    }
  },

  deleteBlock: async (sectionKey, blockId) => {
    try {
      const res = await fetch(`/api/admin/cms/about?blockId=${blockId}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return { ...sec, blocks: sec.blocks.filter((b) => b.id !== blockId) };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteBlock error:", e);
    }
  },

  reorderBlocks: async (sectionKey, orderedBlocks) => {
    try {
      set((state) => ({
        sections: state.sections.map((sec) => {
          if (sec.key !== sectionKey) return sec;
          return { ...sec, blocks: orderedBlocks };
        }),
      }));
      const res = await fetch("/api/admin/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REORDER_BLOCKS",
          reorderedBlocks: orderedBlocks.map((b, idx) => ({ id: b.id, blockNumber: idx + 1 })),
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("reorderBlocks error:", e);
    }
  },

  // Block Items
  addBlockItem: async (sectionKey, blockId, itemData) => {
    try {
      const res = await fetch("/api/admin/cms/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_ITEM", blockId, itemData }),
      });
      if (res.ok) {
        const newItem = await res.json();
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) =>
                blk.id === blockId ? { ...blk, items: [...(blk.items || []), newItem] } : blk
              ),
            };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addBlockItem error:", e);
    }
  },

  updateBlockItem: async (sectionKey, blockId, itemId, itemData) => {
    try {
      const res = await fetch("/api/admin/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_ITEM", itemId, itemData }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                return {
                  ...blk,
                  items: (blk.items || []).map((itm) => (itm.id === itemId ? updatedItem : itm)),
                };
              }),
            };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateBlockItem error:", e);
    }
  },

  deleteBlockItem: async (sectionKey, blockId, itemId) => {
    try {
      const res = await fetch(`/api/admin/cms/about?itemId=${itemId}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                return {
                  ...blk,
                  items: (blk.items || []).filter((itm) => itm.id !== itemId),
                };
              }),
            };
          }),
        }));
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteBlockItem error:", e);
    }
  },

  reorderBlockItems: (sectionKey, blockId, items) =>
    set((state) => ({
      sections: state.sections.map((sec) => {
        if (sec.key !== sectionKey) return sec;
        return {
          ...sec,
          blocks: sec.blocks.map((blk) => (blk.id === blockId ? { ...blk, items } : blk)),
        };
      }),
    })),

  // Factual Metric Actions
  addExperienceMetric: (metricData) =>
    set((state) => ({
      experienceMetrics: [
        ...state.experienceMetrics,
        { ...metricData, id: `em-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    })),

  updateExperienceMetric: (id, metricData) =>
    set((state) => ({
      experienceMetrics: state.experienceMetrics.map((m) => (m.id === id ? { ...m, ...metricData } : m)),
    })),

  deleteExperienceMetric: (id) =>
    set((state) => ({
      experienceMetrics: state.experienceMetrics.filter((m) => m.id !== id),
    })),

  // Factual Achievement Actions
  addExperienceAchievement: (achData) =>
    set((state) => ({
      experienceAchievements: [
        ...state.experienceAchievements,
        { ...achData, id: `ea-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    })),

  updateExperienceAchievement: (id, achData) =>
    set((state) => ({
      experienceAchievements: state.experienceAchievements.map((a) => (a.id === id ? { ...a, ...achData } : a)),
    })),

  deleteExperienceAchievement: (id) =>
    set((state) => ({
      experienceAchievements: state.experienceAchievements.filter((a) => a.id !== id),
    })),

  // Factual Highlight Actions
  addProjectHighlight: (hlData) =>
    set((state) => ({
      projectHighlights: [
        ...state.projectHighlights,
        { ...hlData, id: `ph-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    })),

  updateProjectHighlight: (id, hlData) =>
    set((state) => ({
      projectHighlights: state.projectHighlights.map((h) => (h.id === id ? { ...h, ...hlData } : h)),
    })),

  deleteProjectHighlight: (id) =>
    set((state) => ({
      projectHighlights: state.projectHighlights.filter((h) => h.id !== id),
    })),

  // Section CMS Actions
  updateExperienceCMS: async (data) => {
    try {
      set((state) => ({
        experienceCMS: { ...state.experienceCMS, ...data },
      }));
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "EXPERIENCE", data }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateExperienceCMS error:", e);
    }
  },

  addExperienceCMSItem: async (itemData) => {
    const newItem = {
      ...itemData,
      id: `ecmsi-${Date.now()}`,
      sectionId: get().experienceCMS?.id || "exp-cms-main",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedItems = [...(get().experienceCMS?.items || []), newItem];
    set((state) => ({
      experienceCMS: {
        ...state.experienceCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "EXPERIENCE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addExperienceCMSItem error:", e);
    }
  },

  updateExperienceCMSItem: async (id, itemData) => {
    const updatedItems = (get().experienceCMS?.items || []).map((i) =>
      i.id === id ? { ...i, ...itemData } : i
    );
    set((state) => ({
      experienceCMS: {
        ...state.experienceCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "EXPERIENCE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateExperienceCMSItem error:", e);
    }
  },

  deleteExperienceCMSItem: async (id) => {
    const updatedItems = (get().experienceCMS?.items || []).filter((i) => i.id !== id);
    set((state) => ({
      experienceCMS: {
        ...state.experienceCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "EXPERIENCE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteExperienceCMSItem error:", e);
    }
  },

  reorderExperienceCMSItems: async (items) => {
    set((state) => ({
      experienceCMS: { ...state.experienceCMS, items },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "EXPERIENCE", items }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("reorderExperienceCMSItems error:", e);
    }
  },

  updateSelectedWorkCMS: async (data) => {
    try {
      set((state) => ({
        selectedWorkCMS: { ...state.selectedWorkCMS, ...data },
      }));
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "SELECTED_WORK", data }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateSelectedWorkCMS error:", e);
    }
  },

  addSelectedWorkCMSItem: async (itemData) => {
    const newItem = {
      ...itemData,
      id: `swcmsi-${Date.now()}`,
      sectionId: get().selectedWorkCMS?.id || "sw-cms-main",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedItems = [...(get().selectedWorkCMS?.items || []), newItem];
    set((state) => ({
      selectedWorkCMS: {
        ...state.selectedWorkCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "SELECTED_WORK", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addSelectedWorkCMSItem error:", e);
    }

    // Auto-sync project to Project Showcase track if not already present
    const existingPSItems = get().projectShowcaseCMS?.items || [];
    if (!existingPSItems.some((i) => i.projectId === itemData.projectId)) {
      await get().addProjectShowcaseCMSItem({
        projectId: itemData.projectId,
        displayOrder: existingPSItems.length + 1,
        visible: true,
        showDescription: true,
        showTechnologies: true,
        showViewAction: true,
      });
    }
  },

  updateSelectedWorkCMSItem: async (id, itemData) => {
    const updatedItems = (get().selectedWorkCMS?.items || []).map((i) =>
      i.id === id ? { ...i, ...itemData } : i
    );
    set((state) => ({
      selectedWorkCMS: {
        ...state.selectedWorkCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "SELECTED_WORK", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateSelectedWorkCMSItem error:", e);
    }
  },

  deleteSelectedWorkCMSItem: async (id) => {
    const updatedItems = (get().selectedWorkCMS?.items || []).filter((i) => i.id !== id);
    set((state) => ({
      selectedWorkCMS: {
        ...state.selectedWorkCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "SELECTED_WORK", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteSelectedWorkCMSItem error:", e);
    }
  },

  reorderSelectedWorkCMSItems: async (items) => {
    set((state) => ({
      selectedWorkCMS: { ...state.selectedWorkCMS, items },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "SELECTED_WORK", items }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("reorderSelectedWorkCMSItems error:", e);
    }
  },

  updateProjectShowcaseCMS: async (data) => {
    try {
      set((state) => ({
        projectShowcaseCMS: { ...state.projectShowcaseCMS, ...data },
      }));
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "PROJECT_SHOWCASE", data }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateProjectShowcaseCMS error:", e);
    }
  },

  addProjectShowcaseCMSItem: async (itemData) => {
    const newItem = {
      ...itemData,
      id: `pscmsi-${Date.now()}`,
      sectionId: get().projectShowcaseCMS?.id || "ps-cms-main",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedItems = [...(get().projectShowcaseCMS?.items || []), newItem];
    set((state) => ({
      projectShowcaseCMS: {
        ...state.projectShowcaseCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "PROJECT_SHOWCASE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addProjectShowcaseCMSItem error:", e);
    }
  },

  updateProjectShowcaseCMSItem: async (id, itemData) => {
    const updatedItems = (get().projectShowcaseCMS?.items || []).map((i) =>
      i.id === id ? { ...i, ...itemData } : i
    );
    set((state) => ({
      projectShowcaseCMS: {
        ...state.projectShowcaseCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "PROJECT_SHOWCASE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateProjectShowcaseCMSItem error:", e);
    }
  },

  deleteProjectShowcaseCMSItem: async (id) => {
    const updatedItems = (get().projectShowcaseCMS?.items || []).filter((i) => i.id !== id);
    set((state) => ({
      projectShowcaseCMS: {
        ...state.projectShowcaseCMS,
        items: updatedItems,
      },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "PROJECT_SHOWCASE", items: updatedItems }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteProjectShowcaseCMSItem error:", e);
    }
  },

  reorderProjectShowcaseCMSItems: async (items) => {
    set((state) => ({
      projectShowcaseCMS: { ...state.projectShowcaseCMS, items },
    }));
    try {
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionType: "PROJECT_SHOWCASE", items }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("reorderProjectShowcaseCMSItems error:", e);
    }
  },

  updateHeroNodesCMS: async (data) => {
    set((state) => ({
      heroNodesCMS: { ...state.heroNodesCMS, ...data },
    }));
    try {
      const current = get().heroNodesCMS;
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "HERO_NODES",
          data: {
            centerNodeLabel: current.centerNodeLabel,
            centerLogoUrl: current.centerLogoUrl,
            visible: current.visible,
          },
          items: current.items,
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateHeroNodesCMS error:", e);
    }
  },

  addHeroNodeCMSItem: async (itemData) => {
    const newItem = {
      ...itemData,
      id: `hncmsi-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      heroNodesCMS: {
        ...state.heroNodesCMS,
        items: [...(state.heroNodesCMS?.items || []), newItem],
      },
    }));
    try {
      const current = get().heroNodesCMS;
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "HERO_NODES",
          data: {
            centerNodeLabel: current.centerNodeLabel,
            centerLogoUrl: current.centerLogoUrl,
            visible: current.visible,
          },
          items: current.items,
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("addHeroNodeCMSItem error:", e);
    }
  },

  updateHeroNodeCMSItem: async (id, itemData) => {
    set((state) => ({
      heroNodesCMS: {
        ...state.heroNodesCMS,
        items: (state.heroNodesCMS?.items || []).map((i) =>
          i.id === id ? { ...i, ...itemData } : i
        ),
      },
    }));
    try {
      const current = get().heroNodesCMS;
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "HERO_NODES",
          data: {
            centerNodeLabel: current.centerNodeLabel,
            centerLogoUrl: current.centerLogoUrl,
            visible: current.visible,
          },
          items: current.items,
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("updateHeroNodeCMSItem error:", e);
    }
  },

  deleteHeroNodeCMSItem: async (id) => {
    set((state) => ({
      heroNodesCMS: {
        ...state.heroNodesCMS,
        items: (state.heroNodesCMS?.items || []).filter((i) => i.id !== id),
      },
    }));
    try {
      const current = get().heroNodesCMS;
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "HERO_NODES",
          data: {
            centerNodeLabel: current.centerNodeLabel,
            centerLogoUrl: current.centerLogoUrl,
            visible: current.visible,
          },
          items: current.items,
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("deleteHeroNodeCMSItem error:", e);
    }
  },

  reorderHeroNodeCMSItems: async (items) => {
    set((state) => ({
      heroNodesCMS: {
        ...state.heroNodesCMS,
        items,
      },
    }));
    try {
      const current = get().heroNodesCMS;
      const res = await fetch("/api/admin/cms/composition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "HERO_NODES",
          data: {
            centerNodeLabel: current.centerNodeLabel,
            centerLogoUrl: current.centerLogoUrl,
            visible: current.visible,
          },
          items,
        }),
      });
      if (res.ok) {
        await get().fetchInitialData();
      }
    } catch (e) {
      console.error("reorderHeroNodeCMSItems error:", e);
    }
  },

  addMobileHeroSkill: async (skill) => {
    try {
      const res = await fetch("/api/admin/cms/mobile-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill),
      });
      if (res.ok) {
        const newItem = await res.json();
        set((state) => ({
          mobileHeroSkills: [...state.mobileHeroSkills, newItem],
        }));
      }
    } catch (e) {
      console.error("addMobileHeroSkill error:", e);
    }
  },

  updateMobileHeroSkill: async (id, skill) => {
    set((state) => ({
      mobileHeroSkills: state.mobileHeroSkills.map((s) =>
        s.id === id ? { ...s, ...skill } : s
      ),
    }));
    try {
      await fetch("/api/admin/cms/mobile-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...skill }),
      });
    } catch (e) {
      console.error("updateMobileHeroSkill error:", e);
    }
  },

  deleteMobileHeroSkill: async (id) => {
    set((state) => ({
      mobileHeroSkills: state.mobileHeroSkills.filter((s) => s.id !== id),
    }));
    try {
      await fetch(`/api/admin/cms/mobile-hero?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("deleteMobileHeroSkill error:", e);
    }
  },

  reorderMobileHeroSkills: async (items) => {
    set({ mobileHeroSkills: items });
    try {
      await fetch("/api/admin/cms/mobile-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REORDER", items }),
      });
    } catch (e) {
      console.error("reorderMobileHeroSkills error:", e);
    }
  },
}));
