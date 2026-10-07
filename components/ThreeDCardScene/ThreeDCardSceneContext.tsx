"use client";

import React, { createContext, useContext } from "react";
import { ThreeDCardSceneContextValue } from "./types";

const defaultContextValue: ThreeDCardSceneContextValue = {
  parallax: {
    mouseX: 0,
    mouseY: 0,
    rotateX: 7,
    rotateY: -11,
    floatY: 0,
    isHovered: false,
  },
  perspective: 1200,
  baseRotateX: 7,
  baseRotateY: -11,
};

export const ThreeDCardSceneContext =
  createContext<ThreeDCardSceneContextValue>(defaultContextValue);

export function useThreeDCardScene() {
  const context = useContext(ThreeDCardSceneContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
}
