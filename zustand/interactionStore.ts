"use client";

import { create } from "zustand";
import type {
  SkillNodeData,
  Vec3,
} from "@/components/NewHeroSection/types/network";

/**
 * Card payload rendered by InteractionLayer / InfoCard.
 * `worldPosition` is local to the rotating NetworkSphere group.
 */
export type ActiveCard = {
  nodeId: string;
  data: SkillNodeData;
  worldPosition: Vec3;
};

type InteractionState = {
  /** Node opened via click — drives the info card. */
  selectedId: string | null;
  /** True while a node drag session is active. */
  isDragging: boolean;
  /** Active info card, or null when none selected. */
  activeCard: ActiveCard | null;
  /**
   * Click selection: opens the info card and keeps it until clearFocus.
   * @param id - Skill node id
   * @param data - Full skill payload for the card
   * @param localPosition - Node position in network-group local space
   */
  selectNode: (id: string, data: SkillNodeData, localPosition: Vec3) => void;
  /**
   * Marks a drag session; also mirrors into dragPauseRef for useFrame.
   * @param dragging - Whether a node is currently being dragged
   */
  setDragging: (dragging: boolean) => void;
  /** Clears selection and card. */
  clearFocus: () => void;
};

/**
 * Module-level flag read inside useFrame (auto-rotate / camera)
 * without subscribing those loops to Zustand.
 */
export const dragPauseRef = { current: false };

/**
 * Zustand store for hero interaction: click card + drag pause.
 * No hover state — enter/leave does nothing.
 */
export const useInteractionStore = create<InteractionState>((set) => ({
  selectedId: null,
  isDragging: false,
  activeCard: null,

  selectNode: (id, data, localPosition) => {
    set({
      selectedId: id,
      activeCard: {
        nodeId: id,
        data,
        worldPosition: localPosition,
      },
    });
  },

  setDragging: (dragging) => {
    dragPauseRef.current = dragging;
    set({ isDragging: dragging });
  },

  clearFocus: () => {
    set({
      selectedId: null,
      activeCard: null,
    });
  },
}));
