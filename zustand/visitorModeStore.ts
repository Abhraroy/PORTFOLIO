"use client";

import { create } from "zustand";

export const VISITOR_MODES = ["explorer", "builder", "business"] as const;

export type VisitorMode = (typeof VISITOR_MODES)[number];

type VisitorModeState = {
  /** Active visitor persona — drives homepage content filtering. */
  mode: VisitorMode;
  /** True while a mode switch animation / transition is in flight. */
  isSwitching: boolean;
  /**
   * Sets the active visitor mode.
   * @param mode - Target persona
   */
  setMode: (mode: VisitorMode) => void;
  /**
   * Marks whether a mode transition is currently animating.
   * @param switching - Whether a switch is in progress
   */
  setSwitching: (switching: boolean) => void;
};

/**
 * Zustand store for homepage visitor mode (Explorer / Builder / Business).
 * Default: explorer.
 */
export const useVisitorModeStore = create<VisitorModeState>((set, get) => ({
  mode: "explorer",
  isSwitching: false,

  setMode: (mode) => {
    if (get().mode === mode) return;
    set({ mode, isSwitching: true });
  },

  setSwitching: (switching) => {
    if (get().isSwitching === switching) return;
    set({ isSwitching: switching });
  },
}));
